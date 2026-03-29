import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { 
  Search, 
  UserPlus, 
  MoreVertical, 
  Shield, 
  Mail, 
  Calendar,
  Filter,
  CheckCircle2,
  XCircle,
  Edit2,
  Trash2,
  Ban,
  ArrowLeft
} from 'lucide-react';
import { apiClient } from '../../core/api/client';
import { cn } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';

interface AdminUser {
  id: string;
  email: string;
  username: string;
  role: string;
  is_active: boolean;
  is_banned: boolean;
  created_at: string;
}

export default function UsersPage() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        // const response = await apiClient.get('/admin/users');
        // setUsers(response.data);
        
        // MOCK DATA
        await new Promise(resolve => setTimeout(resolve, 800));
        const mockUsers: AdminUser[] = [
          { id: 'u1', email: 'admin@example.com', username: 'super_admin', role: 'admin', is_active: true, is_banned: false, created_at: '2023-01-01T00:00:00Z' },
          { id: 'u2', email: 'mod1@example.com', username: 'mod_alpha', role: 'moderator', is_active: true, is_banned: false, created_at: '2023-02-15T00:00:00Z' },
          { id: 'u3', email: 'mod2@example.com', username: 'mod_beta', role: 'senior_moderator', is_active: true, is_banned: false, created_at: '2023-03-10T00:00:00Z' },
          { id: 'u4', email: 'user1@example.com', username: 'john_doe', role: 'registered', is_active: true, is_banned: false, created_at: '2023-05-20T00:00:00Z' },
          { id: 'u5', email: 'user2@example.com', username: 'jane_smith', role: 'registered', is_active: false, is_banned: true, created_at: '2023-06-12T00:00:00Z' },
        ];
        setUsers(mockUsers);
      } catch (error) {
        console.error('Failed to fetch users', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)} className="h-10 w-10">
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">User Management</h1>
            <p className="text-neutral-500 font-medium">Manage system users, roles, and permissions</p>
          </div>
        </div>
        <Button className="gap-2">
          <UserPlus size={18} /> Add New User
        </Button>
      </div>

      <Card className="p-0 border-neutral-200/60 overflow-hidden">
        <div className="p-4 border-b border-neutral-100 bg-neutral-50/50 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
            <Input 
              placeholder="Search by username or email..." 
              className="pl-10 bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Filter size={16} /> Filters
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/30">
                <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">User</th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Role</th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest text-center">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Joined</th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest text-right">Actions</th>
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
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-neutral-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500 font-bold">
                          {user.username[0].toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-neutral-900">{user.username}</p>
                          <p className="text-xs text-neutral-500 flex items-center gap-1">
                            <Mail size={12} /> {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Shield size={14} className={cn(
                          user.role === 'admin' ? "text-red-500" : 
                          user.role.includes('moderator') ? "text-amber-500" : 
                          "text-blue-500"
                        )} />
                        <span className="text-sm font-medium text-neutral-700 capitalize">{user.role.replace('_', ' ')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center">
                        {user.is_banned ? (
                          <span className="px-2 py-1 bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-wider rounded border border-red-100">Banned</span>
                        ) : user.is_active ? (
                          <span className="px-2 py-1 bg-emerald-50 text-emerald-600 text-[10px] font-bold uppercase tracking-wider rounded border border-emerald-100">Active</span>
                        ) : (
                          <span className="px-2 py-1 bg-neutral-50 text-neutral-400 text-[10px] font-bold uppercase tracking-wider rounded border border-neutral-100">Inactive</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-neutral-600">
                        <Calendar size={14} className="text-neutral-400" />
                        {new Date(user.created_at).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-400 hover:text-neutral-900">
                          <Edit2 size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-400 hover:text-red-600">
                          <Ban size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-400 hover:text-red-600">
                          <Trash2 size={16} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-400">
                          <MoreVertical size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
