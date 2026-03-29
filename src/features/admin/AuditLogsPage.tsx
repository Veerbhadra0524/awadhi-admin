import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { 
  Search, 
  Filter, 
  Download, 
  User, 
  Calendar, 
  Clock, 
  Activity,
  ChevronLeft,
  ChevronRight,
  Eye,
  Shield,
  Settings,
  Database,
  Lock,
  ArrowLeft
} from 'lucide-react';
import { apiClient } from '../../core/api/client';
import { cn } from '../../lib/utils';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

interface AuditLog {
  id: string;
  action: string;
  resource_type: string;
  resource_id: string;
  actor_id: string;
  actor_name: string;
  created_at: string;
  metadata: Record<string, any>;
}

export default function AuditLogsPage() {
  const navigate = useNavigate();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        // const response = await apiClient.get('/admin/audit_logs');
        // setLogs(response.data);
        
        // MOCK DATA
        await new Promise(resolve => setTimeout(resolve, 800));
        const mockLogs: AuditLog[] = Array.from({ length: 10 }).map((_, i) => ({
          id: `log_${10000 + i}`,
          action: ['update_user', 'delete_submission', 'change_setting', 'login_success', 'rbac_denial'][Math.floor(Math.random() * 5)],
          resource_type: ['user', 'submission', 'setting', 'auth', 'system'][Math.floor(Math.random() * 5)],
          resource_id: `res_${Math.floor(Math.random() * 1000)}`,
          actor_id: `u_${Math.floor(Math.random() * 10)}`,
          actor_name: ['admin_jane', 'mod_bob', 'system_cron', 'super_admin'][Math.floor(Math.random() * 4)],
          created_at: new Date(Date.now() - Math.random() * 100000000).toISOString(),
          metadata: { ip: '127.0.0.1', user_agent: 'Mozilla/5.0...' }
        }));
        setLogs(mockLogs);
      } catch (error) {
        console.error('Failed to fetch logs', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, []);

  const getActionIcon = (action: string) => {
    if (action.includes('user')) return <User size={16} className="text-blue-500" />;
    if (action.includes('setting')) return <Settings size={16} className="text-amber-500" />;
    if (action.includes('submission')) return <Shield size={16} className="text-emerald-500" />;
    if (action.includes('denial')) return <Lock size={16} className="text-red-500" />;
    return <Activity size={16} className="text-neutral-500" />;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)} className="h-10 w-10">
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Audit Logs</h1>
            <p className="text-neutral-500 font-medium">Track all administrative and moderation actions</p>
          </div>
        </div>
        <Button variant="outline" className="gap-2">
          <Download size={18} /> Export Logs
        </Button>
      </div>

      <Card className="p-0 border-neutral-200/60 overflow-hidden">
        <div className="p-4 border-b border-neutral-100 bg-neutral-50/50 flex flex-col md:flex-row md:items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
            <Input 
              placeholder="Search by action, actor, or resource..." 
              className="pl-10 bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2 ml-auto">
            <Button variant="outline" size="sm" className="gap-2">
              <Calendar size={16} /> Date Range
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Filter size={16} /> Filters
            </Button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/30">
                <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Action</th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Actor</th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Resource</th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Timestamp</th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-6 py-8">
                      <div className="h-4 bg-neutral-100 rounded w-full" />
                    </td>
                  </tr>
                ))
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-neutral-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-neutral-100 rounded-lg">
                          {getActionIcon(log.action)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-neutral-900 capitalize">{log.action.replace('_', ' ')}</p>
                          <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">{log.resource_type}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
                          <User size={14} />
                        </div>
                        <span className="text-sm font-medium text-neutral-700">{log.actor_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono bg-neutral-100 px-2 py-1 rounded text-neutral-600 border border-neutral-200">
                        {log.resource_id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-neutral-700 font-medium">{format(new Date(log.created_at), 'MMM dd, yyyy')}</span>
                        <span className="text-xs text-neutral-400 flex items-center gap-1">
                          <Clock size={12} /> {format(new Date(log.created_at), 'HH:mm:ss')}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-400 hover:text-neutral-900">
                        <Eye size={18} />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-neutral-100 bg-neutral-50/30 flex items-center justify-between">
          <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
            Page 1 of 420
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8" disabled>
              <ChevronLeft size={16} />
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
