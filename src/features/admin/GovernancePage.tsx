import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  FileText, 
  Play, 
  RefreshCcw,
  Activity,
  BarChart3,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';
import { apiClient } from '../../core/api/client';
import { cn } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';

export default function GovernancePage() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const checklistItems = [
    { label: 'Data Retention Policy Active', status: 'success', lastRun: '2 hours ago' },
    { label: 'Audit Log Integrity Check', status: 'success', lastRun: '12 hours ago' },
    { label: 'RBAC Permission Sync', status: 'warning', lastRun: '1 day ago' },
    { label: 'PII Masking Validation', status: 'success', lastRun: '3 hours ago' },
    { label: 'System Backup Verification', status: 'success', lastRun: '6 hours ago' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)} className="h-10 w-10">
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Governance & Compliance</h1>
            <p className="text-neutral-500 font-medium">System observability, checklist, and retention controls</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Activity size={18} /> Observability
          </Button>
          <Button className="gap-2">
            <Play size={18} /> Run Retention
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Checklist */}
        <div className="lg:col-span-2 space-y-6">
          <Card title="Compliance Checklist" description="Daily system health and compliance verification status.">
            <div className="divide-y divide-neutral-100">
              {checklistItems.map((item, i) => (
                <div key={i} className="py-4 flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    {item.status === 'success' ? (
                      <CheckCircle2 className="text-emerald-500" size={20} />
                    ) : (
                      <AlertCircle className="text-amber-500" size={20} />
                    )}
                    <div>
                      <p className="text-sm font-bold text-neutral-900">{item.label}</p>
                      <p className="text-xs text-neutral-400 font-medium flex items-center gap-1">
                        <Clock size={12} /> Last verified: {item.lastRun}
                      </p>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    Verify Now <RefreshCcw size={14} />
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="SLO Status" description="Service Level Objectives for admin operations.">
              <div className="space-y-6 mt-4">
                {[
                  { label: 'API Availability', value: '99.99%', target: '99.9%' },
                  { label: 'Mod Response Time', value: '14.2m', target: '< 15m' },
                  { label: 'Error Rate', value: '0.02%', target: '< 0.1%' },
                ].map((slo, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-neutral-600">{slo.label}</span>
                      <span className="font-bold text-neutral-900">{slo.value}</span>
                    </div>
                    <div className="w-full bg-neutral-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-neutral-900 h-full w-[95%]" />
                    </div>
                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">Target: {slo.target}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card title="Data Completeness" description="Audit log and telemetry coverage stats.">
              <div className="flex flex-col items-center justify-center h-full py-4">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-neutral-100" />
                    <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="364.4" strokeDashoffset="36.4" className="text-neutral-900" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-neutral-900">90%</span>
                    <span className="text-[10px] font-bold text-neutral-400 uppercase">Coverage</span>
                  </div>
                </div>
                <p className="text-xs text-neutral-500 font-medium mt-6 text-center">
                  Telemetry completeness is within acceptable bounds for the current period.
                </p>
              </div>
            </Card>
          </div>
        </div>

        {/* Governance Controls */}
        <div className="space-y-6">
          <Card className="bg-neutral-900 text-white border-none shadow-xl shadow-neutral-900/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-white/10 rounded-lg">
                <ShieldCheck className="text-emerald-400" size={20} />
              </div>
              <h3 className="font-bold">Governance Controls</h3>
            </div>

            <div className="space-y-4">
              <Button variant="secondary" className="w-full justify-between group">
                Export Audit Report
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="secondary" className="w-full justify-between group">
                Telemetry Export
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="secondary" className="w-full justify-between group">
                Retention Settings
                <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            <div className="mt-8 pt-8 border-t border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <BarChart3 className="text-white/40" size={18} />
                <span className="text-xs font-bold uppercase tracking-widest text-white/40">Risk Score Analysis</span>
              </div>
              <p className="text-sm font-bold text-white mb-2">System Risk Score: 12/100</p>
              <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-400 h-full w-[12%]" />
              </div>
              <p className="text-[10px] text-white/40 mt-3 leading-relaxed">
                Calculated based on RBAC denials, flagged content volume, and system access patterns.
              </p>
            </div>
          </Card>

          <Card title="Quick Actions" className="border-neutral-200/60">
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start gap-3">
                <FileText size={18} /> Generate Compliance PDF
              </Button>
              <Button variant="outline" className="w-full justify-start gap-3">
                <RefreshCcw size={18} /> Sync Permissions
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
