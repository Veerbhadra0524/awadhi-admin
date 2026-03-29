import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  Download, 
  Filter, 
  Activity,
  Users,
  ShieldCheck,
  Clock,
  ArrowLeft
} from 'lucide-react';
import { apiClient } from '../../core/api/client';
import { cn } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';

const MOCK_GROWTH_DATA = [
  { name: 'Jan', users: 4000, moderation: 2400 },
  { name: 'Feb', users: 3000, moderation: 1398 },
  { name: 'Mar', users: 2000, moderation: 9800 },
  { name: 'Apr', users: 2780, moderation: 3908 },
  { name: 'May', users: 1890, moderation: 4800 },
  { name: 'Jun', users: 2390, moderation: 3800 },
  { name: 'Jul', users: 3490, moderation: 4300 },
];

const MOCK_PIE_DATA = [
  { name: 'Approved', value: 400 },
  { name: 'Rejected', value: 300 },
  { name: 'Pending', value: 300 },
  { name: 'Flagged', value: 200 },
];

const COLORS = ['#10b981', '#ef4444', '#f59e0b', '#6366f1'];

export default function AnalyticsPage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)} className="h-10 w-10">
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">System Analytics</h1>
            <p className="text-neutral-500 font-medium">Deep insights into system performance and moderation throughput</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Calendar size={18} /> Last 30 Days
          </Button>
          <Button variant="outline" className="gap-2">
            <Download size={18} /> Export Data
          </Button>
          <Button className="gap-2">
            <Filter size={18} /> Filters
          </Button>
        </div>
      </div>

      {/* KPI Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Users', value: '24,512', trend: '+12.5%', icon: <Users size={20} />, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Mod Throughput', value: '1,240/hr', trend: '+8.2%', icon: <Activity size={20} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Avg Cycle Time', value: '14.2m', trend: '-15.4%', icon: <Clock size={20} />, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'RBAC Denials', value: '42', trend: '-2.1%', icon: <ShieldCheck size={20} />, color: 'text-red-600', bg: 'bg-red-50' },
        ].map((kpi, i) => (
          <Card key={i} className="border-neutral-200/60">
            <div className="flex items-center justify-between mb-4">
              <div className={cn("p-2 rounded-lg", kpi.bg, kpi.color)}>
                {kpi.icon}
              </div>
              <span className={cn(
                "text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1",
                kpi.trend.startsWith('+') ? "bg-emerald-50 text-emerald-600" : "bg-red-50 text-red-600"
              )}>
                {kpi.trend.startsWith('+') ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {kpi.trend}
              </span>
            </div>
            <p className="text-sm font-medium text-neutral-500">{kpi.label}</p>
            <p className="text-2xl font-bold text-neutral-900 mt-1">{kpi.value}</p>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Growth Chart */}
        <Card title="User Growth vs Moderation Load" description="Monthly comparison of new users and moderation actions.">
          <div className="h-[300px] w-full mt-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_GROWTH_DATA}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#171717" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#171717" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#737373' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#737373' }} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="users" stroke="#171717" fillOpacity={1} fill="url(#colorUsers)" strokeWidth={2} />
                <Area type="monotone" dataKey="moderation" stroke="#10b981" fillOpacity={0} strokeWidth={2} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Distribution Chart */}
        <Card title="Moderation Distribution" description="Breakdown of moderation outcomes across all categories.">
          <div className="h-[300px] w-full mt-4 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={MOCK_PIE_DATA}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {MOCK_PIE_DATA.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-2 ml-4">
              {MOCK_PIE_DATA.map((entry, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index] }} />
                  <span className="text-xs font-medium text-neutral-600">{entry.name}</span>
                  <span className="text-xs font-bold text-neutral-900 ml-auto">{entry.value}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Throughput Table */}
      <Card title="Action Throughput (v2)" description="Real-time tracking of administrative events and system actions.">
        <div className="h-[300px] w-full mt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={MOCK_GROWTH_DATA}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f5f5f5" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#737373' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#737373' }} />
              <Tooltip 
                cursor={{ fill: '#f5f5f5' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="moderation" fill="#171717" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
}
