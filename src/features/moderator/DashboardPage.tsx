import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertTriangle, 
  TrendingUp, 
  Users, 
  ShieldAlert,
  ArrowRight
} from 'lucide-react';
import { apiClient } from '../../core/api/client';
import { Link } from 'react-router-dom';

interface SummaryStats {
  today_approved: number;
  pending_review: number;
  total_approved: number;
  flagged_items: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<SummaryStats>({
    today_approved: 124,
    pending_review: 42,
    total_approved: 12450,
    flagged_items: 8
  });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await apiClient.get('/analytics/summary');
        setStats(response.data);
      } catch (error) {
        console.error('Failed to fetch stats', error);
      }
    };
    fetchStats();
  }, []);

  const statCards = [
    { 
      label: 'Pending Review', 
      value: stats.pending_review, 
      icon: <Clock className="text-amber-500" size={24} />,
      color: 'bg-amber-50',
      trend: '+12% from yesterday'
    },
    { 
      label: 'Approved Today', 
      value: stats.today_approved, 
      icon: <CheckCircle2 className="text-emerald-500" size={24} />,
      color: 'bg-emerald-50',
      trend: '+5% from yesterday'
    },
    { 
      label: 'Flagged Items', 
      value: stats.flagged_items, 
      icon: <AlertTriangle className="text-red-500" size={24} />,
      color: 'bg-red-50',
      trend: '-2% from yesterday'
    },
    { 
      label: 'Total Users', 
      value: '24.5k', 
      icon: <Users className="text-blue-500" size={24} />,
      color: 'bg-blue-50',
      trend: '+1.2k this month'
    },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Moderator Dashboard</h1>
          <p className="text-neutral-500 font-medium">System health and moderation overview</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">Export Report</Button>
          <Link to="/moderator/queue">
            <Button className="gap-2">
              Open Queue
              <ArrowRight size={18} />
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <Card key={i} className="border-neutral-200/60">
            <div className="flex items-start justify-between">
              <div className={cn("p-3 rounded-xl", stat.color)}>
                {stat.icon}
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-neutral-500">{stat.label}</p>
                <p className="text-2xl font-bold text-neutral-900 mt-1">{stat.value}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-neutral-50 flex items-center gap-1 text-xs font-medium text-neutral-400">
              <TrendingUp size={14} className="text-emerald-500" />
              {stat.trend}
            </div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity */}
        <Card title="Recent Submissions" className="lg:col-span-2" footer={
          <Link to="/moderator/queue" className="text-sm font-semibold text-neutral-900 hover:underline flex items-center gap-1">
            View all submissions <ArrowRight size={14} />
          </Link>
        }>
          <div className="space-y-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="flex items-center justify-between group cursor-pointer">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-500">
                    <Users size={20} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-neutral-900 group-hover:underline">Submission #{1024 + item}</p>
                    <p className="text-xs text-neutral-500 font-medium">By user_42 • 12 minutes ago</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-wider rounded">Pending</span>
                  <Button variant="ghost" size="sm">Review</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* AI Triage Snapshot */}
        <Card title="AI Triage Recommendations" className="bg-neutral-900 text-white border-none shadow-neutral-900/20 shadow-2xl">
          <div className="space-y-6">
            <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/10">
              <ShieldAlert className="text-amber-400" size={24} />
              <div>
                <p className="text-sm font-bold">High Risk Detected</p>
                <p className="text-xs text-white/60">3 items require immediate attention</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-white/60">Model Confidence</span>
                <span className="font-bold">98.2%</span>
              </div>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full w-[98.2%]" />
              </div>
            </div>

            <p className="text-xs text-white/40 leading-relaxed">
              AI model v2.4 is currently processing 42 items in the background. 
              Triage recommendations are updated every 5 minutes.
            </p>

            <Link to="/moderator/triage" className="block">
              <Button variant="secondary" className="w-full">
                View Triage
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

import { cn } from '../../lib/utils';
