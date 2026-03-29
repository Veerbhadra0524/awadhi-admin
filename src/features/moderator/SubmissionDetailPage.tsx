import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { 
  ArrowLeft, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  User, 
  Calendar, 
  ShieldAlert,
  MessageSquare,
  History,
  ExternalLink,
  ChevronRight,
  ChevronLeft
} from 'lucide-react';
import { apiClient } from '../../core/api/client';
import { cn } from '../../lib/utils';

interface SubmissionDetail {
  id: string;
  title: string;
  author: string;
  created_at: string;
  status: 'pending' | 'approved' | 'rejected';
  risk_score: number;
  content: string;
  metadata: Record<string, any>;
  ai_analysis: {
    sentiment: string;
    toxicity: number;
    flags: string[];
    recommendation: string;
  };
}

export default function SubmissionDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState<SubmissionDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        // const response = await apiClient.get(`/moderation/submissions/${id}`);
        // setSubmission(response.data);
        
        // MOCK DATA
        await new Promise(resolve => setTimeout(resolve, 600));
        setSubmission({
          id: id || 'sub_1024',
          title: 'Content Submission #1024',
          author: 'user_42',
          created_at: new Date().toISOString(),
          status: 'pending',
          risk_score: 78,
          content: 'This is the main content of the submission. It might contain some sensitive information that needs to be reviewed by a moderator. The AI has flagged this for potential policy violations regarding community guidelines.',
          metadata: {
            ip_address: '192.168.1.1',
            device: 'Chrome / macOS',
            previous_submissions: 12
          },
          ai_analysis: {
            sentiment: 'Neutral',
            toxicity: 0.78,
            flags: ['Potential Hate Speech', 'Policy Violation'],
            recommendation: 'Reject'
          }
        });
      } catch (error) {
        console.error('Failed to fetch detail', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleAction = async (action: 'approve' | 'reject') => {
    setIsSubmitting(true);
    try {
      await apiClient.post(`/moderation/submissions/${id}/${action}`, {
        note,
        guideline_version: 'v2.4',
        approved_by_human: true
      });
      navigate('/moderator/queue');
    } catch (error) {
      console.error(`${action} failed`, error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900"></div>
      </div>
    );
  }

  if (!submission) {
    return (
      <div className="text-center py-12">
        <p className="text-neutral-500 font-medium">Submission not found.</p>
        <Link to="/moderator/queue">
          <Button variant="ghost" className="mt-4">Back to Queue</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/moderator/queue">
            <Button variant="outline" size="icon" className="h-10 w-10">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">{submission.title}</h1>
              <span className="px-2 py-0.5 bg-amber-50 text-amber-600 text-[10px] font-bold uppercase tracking-wider rounded border border-amber-100">Pending</span>
            </div>
            <p className="text-sm text-neutral-500 font-medium flex items-center gap-1 mt-0.5">
              <User size={14} /> {submission.author} • <Calendar size={14} /> {new Date(submission.created_at).toLocaleString()}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <ChevronLeft size={20} />
          </Button>
          <Button variant="ghost" size="icon" className="h-10 w-10">
            <ChevronRight size={20} />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card title="Submission Content" className="border-neutral-200/60">
            <div className="prose prose-neutral max-w-none">
              <p className="text-neutral-800 leading-relaxed whitespace-pre-wrap">
                {submission.content}
              </p>
            </div>
            <div className="mt-8 pt-6 border-t border-neutral-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button variant="outline" size="sm" className="gap-2">
                  <ExternalLink size={14} /> View Source
                </Button>
                <Button variant="outline" size="sm" className="gap-2">
                  <History size={14} /> History
                </Button>
              </div>
              <Button variant="ghost" size="sm" className="gap-2 text-neutral-500">
                <MessageSquare size={14} /> 12 Comments
              </Button>
            </div>
          </Card>

          <Card title="Moderation Action" className="border-neutral-200/60">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-700">Moderator Note</label>
                <textarea 
                  className="w-full min-h-[120px] rounded-xl border border-neutral-200 p-4 text-sm focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:ring-offset-2 transition-all"
                  placeholder="Explain the reason for approval or rejection..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <Button 
                  variant="danger" 
                  className="flex-1 md:flex-none gap-2" 
                  onClick={() => handleAction('reject')}
                  isLoading={isSubmitting}
                >
                  <XCircle size={18} /> Reject Submission
                </Button>
                <Button 
                  variant="primary" 
                  className="flex-1 md:flex-none gap-2" 
                  onClick={() => handleAction('approve')}
                  isLoading={isSubmitting}
                >
                  <CheckCircle2 size={18} /> Approve Submission
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          {/* AI Analysis */}
          <Card className="bg-neutral-900 text-white border-none shadow-xl shadow-neutral-900/20">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-white/10 rounded-lg">
                <ShieldAlert className="text-amber-400" size={20} />
              </div>
              <h3 className="font-bold">AI Analysis</h3>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-white/40">
                  <span>Risk Score</span>
                  <span className={cn(
                    submission.risk_score > 70 ? "text-red-400" : "text-emerald-400"
                  )}>{submission.risk_score}%</span>
                </div>
                <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className={cn(
                      "h-full transition-all duration-1000",
                      submission.risk_score > 70 ? "bg-red-400" : "bg-emerald-400"
                    )} 
                    style={{ width: `${submission.risk_score}%` }} 
                  />
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-widest text-white/40">Detected Flags</p>
                <div className="flex flex-wrap gap-2">
                  {submission.ai_analysis.flags.map((flag, i) => (
                    <span key={i} className="px-2 py-1 bg-white/10 rounded text-[10px] font-bold text-white/80 border border-white/5">
                      {flag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-white/5 rounded-xl border border-white/10">
                <p className="text-xs font-bold uppercase tracking-widest text-white/40 mb-2">Recommendation</p>
                <p className={cn(
                  "text-sm font-bold",
                  submission.ai_analysis.recommendation === 'Reject' ? "text-red-400" : "text-emerald-400"
                )}>
                  {submission.ai_analysis.recommendation}
                </p>
              </div>
            </div>
          </Card>

          {/* Metadata */}
          <Card title="Metadata" className="border-neutral-200/60">
            <div className="space-y-4">
              {Object.entries(submission.metadata).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between text-sm">
                  <span className="text-neutral-500 capitalize">{key.replace('_', ' ')}</span>
                  <span className="font-bold text-neutral-900">{value}</span>
                </div>
              ))}
              <div className="pt-4 mt-4 border-t border-neutral-100">
                <div className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg border border-neutral-100">
                  <AlertTriangle className="text-amber-500" size={18} />
                  <p className="text-xs font-medium text-neutral-600">
                    User has 2 previous rejections in the last 30 days.
                  </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
