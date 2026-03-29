import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '../auth/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  Settings, 
  ClipboardList, 
  BarChart3, 
  ShieldCheck, 
  Layers, 
  LogOut,
  Menu,
  X,
  ChevronRight,
  User as UserIcon,
  ShieldAlert,
  ArrowLeft
} from 'lucide-react';
import { cn } from '../../lib/utils';

interface NavItem {
  label: string;
  path: string;
  icon: React.ReactNode;
  requiredRole: UserRole;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: '/', icon: <LayoutDashboard size={20} />, requiredRole: 'moderator' },
  { label: 'Moderation Queue', path: '/moderator/queue', icon: <ClipboardList size={20} />, requiredRole: 'moderator' },
  { label: 'AI Triage', path: '/moderator/triage', icon: <ShieldAlert size={20} />, requiredRole: 'moderator' },
  { label: 'User Management', path: '/admin/users', icon: <Users size={20} />, requiredRole: 'admin' },
  { label: 'System Settings', path: '/admin/settings', icon: <Settings size={20} />, requiredRole: 'admin' },
  { label: 'Hierarchy', path: '/admin/hierarchy', icon: <Layers size={20} />, requiredRole: 'admin' },
  { label: 'Audit Logs', path: '/admin/audit', icon: <ClipboardList size={20} />, requiredRole: 'admin' },
  { label: 'Analytics', path: '/admin/analytics', icon: <BarChart3 size={20} />, requiredRole: 'admin' },
  { label: 'Governance', path: '/admin/governance', icon: <ShieldCheck size={20} />, requiredRole: 'admin' },
];

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout, hasRole } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const filteredNavItems = NAV_ITEMS.filter(item => hasRole(item.requiredRole));

  return (
    <div className="min-h-screen bg-neutral-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-neutral-200 transform transition-transform duration-200 ease-in-out md:relative md:translate-x-0",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="h-full flex flex-col">
          <div className="p-6 flex items-center gap-3 border-b border-neutral-100">
            <div className="bg-primary text-white p-2 rounded-lg">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h1 className="font-bold text-neutral-900 leading-tight">Admin</h1>
              <p className="text-xs text-neutral-500 font-medium uppercase tracking-wider">Command Center</p>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {filteredNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                    isActive 
                      ? "bg-neutral-900 text-white" 
                      : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.icon}
                  {item.label}
                  {isActive && <ChevronRight size={14} className="ml-auto opacity-50" />}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-neutral-100">
            <div className="flex items-center gap-3 px-3 py-3 mb-2">
              <div className="bg-neutral-100 p-2 rounded-full text-neutral-600">
                <UserIcon size={20} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-neutral-900 truncate">{user?.username}</p>
                <p className="text-xs text-neutral-500 truncate capitalize">{user?.role.replace('_', ' ')}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut size={20} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <header className="md:hidden bg-white border-b border-neutral-200 px-4 py-3 flex items-center justify-between sticky top-0 z-40">
          <div className="flex items-center gap-2">
            <ShieldCheck size={24} className="text-neutral-900" />
            <span className="font-bold text-neutral-900">Admin</span>
          </div>
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 text-neutral-600 hover:bg-neutral-100 rounded-lg"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </header>

        {/* Content Area */}
        <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
          {location.pathname !== '/' && (
            <button
              onClick={() => navigate(-1)}
              className="mb-6 flex items-center gap-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors group"
            >
              <div className="p-1.5 rounded-md bg-white border border-neutral-200 group-hover:border-neutral-300 shadow-sm">
                <ArrowLeft size={16} />
              </div>
              Back
            </button>
          )}
          {children}
        </div>
      </main>

      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
};
