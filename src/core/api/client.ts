import axios, { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';

// The API base URL is derived from the environment or defaults to /api/v1
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

// Endpoint Resolver logic for AI/Governance/Telemetry
export class EndpointResolver {
  private static resolvedPrefixes: Record<string, string> = {};

  static resolve(group: 'ai' | 'governance' | 'telemetry' | 'default', path: string): string {
    if (group === 'default') return `${API_BASE_URL}${path}`;
    
    // If we already resolved this group, use it
    if (this.resolvedPrefixes[group]) {
      return `${this.resolvedPrefixes[group]}${path}`;
    }

    // Default to /api/v1 for now
    return `${API_BASE_URL}/${group}${path}`;
  }

  static async verifyAndResolve(group: 'ai' | 'governance' | 'telemetry', path: string): Promise<string> {
    if (this.resolvedPrefixes[group]) {
      return `${this.resolvedPrefixes[group]}${path}`;
    }

    const primaryPath = `${API_BASE_URL}/${group}${path}`;
    const secondaryPath = `${API_BASE_URL}/api/v1/${group}${path}`;

    try {
      // Try primary
      await axios.get(primaryPath, { headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` }, params: { limit: 1 } });
      this.resolvedPrefixes[group] = `${API_BASE_URL}/${group}`;
      return primaryPath;
    } catch (e) {
      // Try secondary fallback
      try {
        await axios.get(secondaryPath, { headers: { Authorization: `Bearer ${localStorage.getItem('auth_token')}` }, params: { limit: 1 } });
        this.resolvedPrefixes[group] = `${API_BASE_URL}/api/v1/${group}`;
        return secondaryPath;
      } catch (e2) {
        // Default back to primary if both fail (let the caller handle the error)
        return primaryPath;
      }
    }
  }
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor for Auth Token and Path Resolution
apiClient.interceptors.request.use(async (config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  // Resolve path if it belongs to a specific group
  if (config.url) {
    if (config.url.startsWith('/ai/')) {
      config.url = await EndpointResolver.verifyAndResolve('ai', config.url.replace('/ai', ''));
    } else if (config.url.startsWith('/governance/')) {
      config.url = await EndpointResolver.verifyAndResolve('governance', config.url.replace('/governance', ''));
    } else if (config.url.startsWith('/telemetry/')) {
      config.url = await EndpointResolver.verifyAndResolve('telemetry', config.url.replace('/telemetry', ''));
    }
  }

  // Include X-Request-ID for traceability
  config.headers['X-Request-ID'] = crypto.randomUUID();
  return config;
});

// Response Interceptor for 401 handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // Attempt token refresh
        const refreshResponse = await axios.post(`${API_BASE_URL}/auth/refresh`, {
          refresh_token: localStorage.getItem('refresh_token'),
        });
        
        const { access_token } = refreshResponse.data;
        localStorage.setItem('auth_token', access_token);
        
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access_token}`;
        }
        
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);
