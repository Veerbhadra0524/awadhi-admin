import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Brain, 
  ArrowRight,
  ChevronRight,
  Activity,
  BarChart3,
  ArrowLeft
} from 'lucide-react';
import { apiClient } from '../../core/api/client';
import { cn } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';

interface TriageItem {
  id: string;
  submission_id: string;
  risk_level: 'high' | 'medium' | 'low';
  reason: string;
  confidence: number;
  model_version: string;
}

export default function TriagePage() {
  const navigate = useNavigate();
  const [items, setItems] = useState<TriageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTriage = async () => {
      try {
        // const response = await apiClient.get('/ai/moderation-triage');
        // setItems(response.data);
        
        // MOCK DATA
        await new Promise(resolve => setTimeout(resolve, 800));
        const mockItems: TriageItem[] = [
          { id: 't1', submission_id: 'sub_1024', risk_level: 'high', reason: 'Potential hate speech detected in paragraph 2.', confidence: 0.98, model_version: 'v2.4' },
          { id: 't2', submission_id: 'sub_1025', risk_level: 'medium', reason: 'Sentiment analysis indicates high aggression.', confidence: 0.75, model_version: 'v2.4' },
          { id: 't3', submission_id: 'sub_1026', risk_level: 'low', reason: 'Unusual formatting detected.', confidence: 0.62, model_version: 'v2.4' },
          { id: 't4', submission_id: 'sub_1027', risk_level: 'high', reason: 'Known spam pattern identified.', confidence: 0.99, model_version: 'v2.4' },
        ];
        setItems(mockItems);
      } catch (error) {
        console.error('Failed to fetch triage', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTriage();
  }, []);

  const handleDecision = async (itemId: string, decision: 'accept' | 'reject') => {
    try {
      await apiClient.post('/ai/model-decision', { triage_id: itemId, decision });
      setItems(prev => prev.filter(i => i.id !== itemId));
    } catch (error) {
      console.error('Decision failed', error);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)} className="h-10 w-10">
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">AI Moderation Triage</h1>
            <p className="text-neutral-500 font-medium">Review and validate AI-driven moderation recommendations</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-neutral-100 rounded-lg border border-neutral-200">
            <Activity size={16} className="text-emerald-500" />
            <span className="text-xs font-bold text-neutral-600 uppercase tracking-widest">Model: v2.4 Active</span>
          </div>
          <Button variant="outline" className="gap-2">
            <BarChart3 size={18} /> Model Performance
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Triage List */}
        <div className="lg:col-span-2 space-y-6">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="animate-pulse h-48" />
            ))
          ) : items.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-2xl border border-dashed border-neutral-200">
              <div className="inline-flex items-center justify-center p-4 bg-neutral-50 rounded-full text-neutral-300 mb-4">
                <CheckCircle2 size={48} />
              </div>
              <p className="text-neutral-500 font-medium text-lg">All triage items cleared.</p>
              <p className="text-neutral-400 text-sm mt-1">Great job! The AI model has no pending recommendations.</p>
            </div>
          ) : (
            items.map((item) => (
              <Card key={item.id} className="border-neutral-200/60 overflow-hidden group">
                <div className="flex flex-col md:flex-row">
                  <div className={cn(
                    "w-full md:w-2 bg-neutral-100",
                    item.risk_level === 'high' ? "bg-red-500" : 
                    item.risk_level === 'medium' ? "bg-amber-500" : 
                    "bg-emerald-500"
                  )} />
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border",
                            item.risk_level === 'high' ? "bg-red-50 border-red-100 text-red-600" : 
                            item.risk_level === 'medium' ? "bg-amber-50 border-amber-100 text-amber-600" : 
                            "bg-emerald-50 border-emerald-100 text-emerald-600"
                          )}>
                            {item.risk_level} Risk
                          </span>
                          <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Confidence: {(item.confidence * 100).toFixed(1)}%</span>
                        </div>
                        <h3 className="text-lg font-bold text-neutral-900">Submission #{item.submission_id}</h3>
                      </div>
                      <Button variant="ghost" size="sm" className="gap-2">
                        View Submission <ArrowRight size={14} />
                      </Button>
                    </div>
                    
                    <div className="p-4 bg-neutral-50 rounded-xl border border-neutral-100 mb-6">
                      <div className="flex items-start gap-3">
                        <Brain className="text-neutral-400 mt-0.5" size={18} />
                        <p className="text-sm text-neutral-700 leading-relaxed">
                          <span className="font-bold">AI Reason:</span> {item.reason}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-3">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-2 text-red-600 hover:bg-red-50 hover:border-red-200"
                        onClick={() => handleDecision(item.id, 'reject')}
                      >
                        <XCircle size={16} /> Reject AI Decision
                      </Button>
                      <Button 
                        variant="primary" 
                        size="sm" 
                        className="gap-2"
                        onClick={() => handleDecision(item.id, 'accept')}
                      >
                        <CheckCircle2 size={16} /> Validate AI Decision
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* AI Stats Sidebar */}
        <div className="space-y-6">
          <Card className="bg-neutral-900 text-white border-none shadow-xl shadow-neutral-900/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-white/10 rounded-lg">
                <Brain className="text-emerald-400" size={20} />
              </div>
              <h3 className="font-bold">Model Performance</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-white/40">
                  <span>Precision</span>
                  <span className="text-emerald-400">94.2%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full w-[94.2%]" />
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-white/40">
                  <span>Recall</span>
                  <span className="text-blue-400">89.8%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div className="bg-blue-400 h-full w-[89.8%]" />
                </div>
              </div>

              <div className="pt-6 mt-6 border-t border-white/10 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Items Processed</span>
                  <span className="font-bold">12,450</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-white/60">Human Overrides</span>
                  <span className="font-bold text-amber-400">2.4%</span>
                </div>
              </div>
            </div>
          </Card>

          <Card title="Triage Guidelines" className="border-neutral-200/60">
            <div className="space-y-4">
              <p className="text-xs text-neutral-500 leading-relaxed">
                Review high-risk items first. AI recommendations are based on the latest community guidelines (v2.4).
              </p>
              <div className="space-y-2">
                <button className="w-full flex items-center justify-between p-3 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition-colors text-sm font-bold text-neutral-700">
                  View Guidelines
                  <ChevronRight size={16} />
                </button>
                <button className="w-full flex items-center justify-between p-3 rounded-lg bg-neutral-50 hover:bg-neutral-100 transition-colors text-sm font-bold text-neutral-700">
                  Model Release Notes
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
