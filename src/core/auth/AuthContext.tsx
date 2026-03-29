import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../api/client';

export type UserRole = 'guest' | 'registered' | 'moderator' | 'senior_moderator' | 'admin';

export interface User {
  id: string;
  email: string;
  username: string;
  role: UserRole;
  permissions?: string[];
  permission_scopes?: string[];
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (token: string, refreshToken: string) => Promise<void>;
  logout: () => void;
  hasRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const ROLE_HIERARCHY: Record<UserRole, number> = {
  guest: 0,
  registered: 1,
  moderator: 2,
  senior_moderator: 3,
  admin: 4,
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMe = async () => {
    const token = localStorage.getItem('auth_token');
    
    // Hardcoded mock users for testing
    if (token === 'mock_access_token_admin') {
      setUser({
        id: 'admin-1',
        email: 'veerbhadra0524@gmail.com',
        username: 'veerbhadra',
        role: 'admin',
        permissions: ['*'],
      });
      setIsLoading(false);
      return;
    }

    if (token === 'mock_access_token') {
      setUser({
        id: 'user-1',
        email: 'test@example.com',
        username: 'testuser',
        role: 'registered',
      });
      setIsLoading(false);
      return;
    }

    try {
      const response = await apiClient.get('/auth/me');
      setUser(response.data);
    } catch (error) {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      fetchMe();
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (token: string, refreshToken: string) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('refresh_token', refreshToken);
    await fetchMe();
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    setUser(null);
  };

  const hasRole = (requiredRole: UserRole) => {
    if (!user) return false;
    return ROLE_HIERARCHY[user.role] >= ROLE_HIERARCHY[requiredRole];
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
