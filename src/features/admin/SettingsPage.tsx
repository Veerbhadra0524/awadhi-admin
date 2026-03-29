import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { 
  Save, 
  RefreshCcw, 
  Trash2, 
  Plus, 
  Search, 
  FileUp, 
  AlertCircle,
  CheckCircle2,
  Lock,
  Globe,
  Database,
  Cpu,
  ArrowLeft
} from 'lucide-react';
import { apiClient } from '../../core/api/client';
import { cn } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';

interface SettingItem {
  key: string;
  value: string;
  description: string;
  category: 'general' | 'security' | 'performance' | 'database';
}

export default function SettingsPage() {
  const navigate = useNavigate();
  const [settings, setSettings] = useState<SettingItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<'all' | 'general' | 'security' | 'performance' | 'database'>('all');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        // const response = await apiClient.get('/admin/system_settings');
        // setSettings(response.data);
        
        // MOCK DATA
        await new Promise(resolve => setTimeout(resolve, 800));
        const mockSettings: SettingItem[] = [
          { key: 'site_name', value: 'Admin Command Center', description: 'The display name of the application.', category: 'general' },
          { key: 'registration_enabled', value: 'true', description: 'Allow new users to register.', category: 'general' },
          { key: 'jwt_expiry', value: '3600', description: 'Token expiration time in seconds.', category: 'security' },
          { key: 'max_login_attempts', value: '5', description: 'Number of failed logins before lockout.', category: 'security' },
          { key: 'cache_ttl', value: '300', description: 'Global cache time-to-live.', category: 'performance' },
          { key: 'db_max_connections', value: '100', description: 'Maximum database connection pool size.', category: 'database' },
        ];
        setSettings(mockSettings);
      } catch (error) {
        console.error('Failed to fetch settings', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const filteredSettings = settings.filter(s => {
    const matchesSearch = s.key.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          s.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || s.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // await apiClient.put('/admin/system_settings/batch', { settings });
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Settings saved');
    } catch (error) {
      console.error('Save failed', error);
    } finally {
      setIsSaving(false);
    }
  };

  const categories = [
    { id: 'all', label: 'All Settings', icon: <Globe size={18} /> },
    { id: 'general', label: 'General', icon: <Cpu size={18} /> },
    { id: 'security', label: 'Security', icon: <Lock size={18} /> },
    { id: 'performance', label: 'Performance', icon: <RefreshCcw size={18} /> },
    { id: 'database', label: 'Database', icon: <Database size={18} /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)} className="h-10 w-10">
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">System Settings</h1>
            <p className="text-neutral-500 font-medium">Configure global application behavior and limits</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <FileUp size={18} /> Import
          </Button>
          <Button className="gap-2" onClick={handleSave} isLoading={isSaving}>
            <Save size={18} /> Save Changes
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Categories */}
        <div className="space-y-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id as any)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                activeCategory === cat.id 
                  ? "bg-neutral-900 text-white shadow-lg shadow-neutral-900/10" 
                  : "text-neutral-500 hover:bg-neutral-100 hover:text-neutral-900"
              )}
            >
              {cat.icon}
              {cat.label}
            </button>
          ))}
        </div>

        {/* Settings List */}
        <div className="lg:col-span-3 space-y-6">
          <Card className="p-0 border-neutral-200/60 overflow-hidden">
            <div className="p-4 border-b border-neutral-100 bg-neutral-50/50">
              <div className="relative max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
                <Input 
                  placeholder="Search settings..." 
                  className="pl-10 bg-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <div className="divide-y divide-neutral-100">
              {isLoading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="p-6 animate-pulse space-y-2">
                    <div className="h-4 bg-neutral-100 rounded w-1/4" />
                    <div className="h-4 bg-neutral-100 rounded w-1/2" />
                  </div>
                ))
              ) : filteredSettings.length === 0 ? (
                <div className="p-12 text-center text-neutral-500 font-medium">
                  No settings found matching your criteria.
                </div>
              ) : (
                filteredSettings.map((setting) => (
                  <div key={setting.key} className="p-6 hover:bg-neutral-50/50 transition-colors group">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-neutral-900 font-mono tracking-tight">{setting.key}</h3>
                          <span className="px-1.5 py-0.5 bg-neutral-100 text-neutral-500 text-[10px] font-bold uppercase tracking-wider rounded border border-neutral-200">
                            {setting.category}
                          </span>
                        </div>
                        <p className="text-xs text-neutral-500 font-medium leading-relaxed">
                          {setting.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 w-full md:w-64">
                        <Input 
                          value={setting.value} 
                          onChange={(e) => {
                            const newSettings = [...settings];
                            const idx = newSettings.findIndex(s => s.key === setting.key);
                            newSettings[idx].value = e.target.value;
                            setSettings(newSettings);
                          }}
                          className="font-mono text-xs"
                        />
                        <Button variant="ghost" size="icon" className="h-10 w-10 text-neutral-400 hover:text-red-600">
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-between">
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
                {filteredSettings.length} settings visible
              </p>
              <Button variant="outline" size="sm" className="gap-2">
                <Plus size={16} /> Add Custom Setting
              </Button>
            </div>
          </Card>

          {/* Warning Card */}
          <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex items-start gap-4">
            <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
              <AlertCircle size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-amber-900">Caution: System-Wide Impact</p>
              <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                Changes to these settings take effect immediately and may affect all users. 
                Ensure you have validated the values before saving.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
