import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { 
  Search, 
  Filter, 
  CheckCircle2, 
  XCircle, 
  MoreVertical, 
  Clock, 
  User,
  ChevronLeft,
  ChevronRight,
  CheckSquare,
  Square,
  ArrowLeft
} from 'lucide-react';
import { apiClient } from '../../core/api/client';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../../lib/utils';

interface Submission {
  id: string;
  title: string;
  author: string;
  created_at: string;
  status: 'pending' | 'approved' | 'rejected';
  risk_score: number;
}

export default function QueuePage() {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchSubmissions = async () => {
      try {
        // const response = await apiClient.get('/moderation/submissions');
        // setSubmissions(response.data);
        
        // MOCK DATA
        await new Promise(resolve => setTimeout(resolve, 800));
        const mockData: Submission[] = Array.from({ length: 10 }).map((_, i) => ({
          id: `sub_${1024 + i}`,
          title: `Content Submission #${1024 + i}`,
          author: `user_${Math.floor(Math.random() * 100)}`,
          created_at: new Date(Date.now() - Math.random() * 10000000).toISOString(),
          status: 'pending',
          risk_score: Math.floor(Math.random() * 100)
        }));
        setSubmissions(mockData);
      } catch (error) {
        console.error('Failed to fetch submissions', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubmissions();
  }, []);

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === submissions.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(submissions.map(s => s.id));
    }
  };

  const handleBatchApprove = async () => {
    if (selectedIds.length === 0) return;
    try {
      await apiClient.post('/moderation/batch_approve', { submission_ids: selectedIds });
      setSubmissions(prev => prev.filter(s => !selectedIds.includes(s.id)));
      setSelectedIds([]);
    } catch (error) {
      console.error('Batch approve failed', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)} className="h-10 w-10">
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Moderation Queue</h1>
            <p className="text-neutral-500 font-medium">Review and manage content submissions</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {selectedIds.length > 0 && (
            <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-4">
              <span className="text-sm font-bold text-neutral-600 mr-2">{selectedIds.length} selected</span>
              <Button variant="danger" size="sm" className="gap-2">
                <XCircle size={16} /> Reject
              </Button>
              <Button variant="primary" size="sm" className="gap-2" onClick={handleBatchApprove}>
                <CheckCircle2 size={16} /> Approve
              </Button>
            </div>
          )}
          <Button variant="outline" size="sm" className="gap-2">
            <Filter size={16} /> Filters
          </Button>
        </div>
      </div>

      <Card className="p-0 border-neutral-200/60 overflow-hidden">
        <div className="p-4 border-b border-neutral-100 bg-neutral-50/50 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
            <Input 
              placeholder="Search by ID, author, or title..." 
              className="pl-10 bg-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-xs font-bold text-neutral-400 uppercase tracking-widest">Sort by:</span>
            <select className="bg-transparent text-sm font-bold text-neutral-900 focus:outline-none cursor-pointer">
              <option>Newest First</option>
              <option>Risk Score</option>
              <option>Author</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-neutral-100 bg-neutral-50/30">
                <th className="px-6 py-4 w-10">
                  <button onClick={toggleSelectAll} className="text-neutral-400 hover:text-neutral-900 transition-colors">
                    {selectedIds.length === submissions.length && submissions.length > 0 ? (
                      <CheckSquare size={20} className="text-neutral-900" />
                    ) : (
                      <Square size={20} />
                    )}
                  </button>
                </th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Submission</th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest text-center">Risk Score</th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Author</th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-neutral-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="px-6 py-8">
                      <div className="h-4 bg-neutral-100 rounded w-full" />
                    </td>
                  </tr>
                ))
              ) : submissions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-neutral-500 font-medium">
                    No submissions found in the queue.
                  </td>
                </tr>
              ) : (
                submissions.map((sub) => (
                  <tr 
                    key={sub.id} 
                    className={cn(
                      "hover:bg-neutral-50/50 transition-colors group",
                      selectedIds.includes(sub.id) && "bg-neutral-50"
                    )}
                  >
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => toggleSelect(sub.id)} 
                        className={cn(
                          "transition-colors",
                          selectedIds.includes(sub.id) ? "text-neutral-900" : "text-neutral-200 group-hover:text-neutral-400"
                        )}
                      >
                        {selectedIds.includes(sub.id) ? <CheckSquare size={20} /> : <Square size={20} />}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <Link to={`/moderator/submission/${sub.id}`} className="block group/link">
                        <p className="text-sm font-bold text-neutral-900 group-hover/link:underline">{sub.title}</p>
                        <p className="text-xs text-neutral-500 font-mono mt-0.5">{sub.id}</p>
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={cn(
                        "inline-flex items-center justify-center w-10 h-10 rounded-full text-xs font-bold border-2",
                        sub.risk_score > 70 ? "border-red-100 bg-red-50 text-red-600" :
                        sub.risk_score > 40 ? "border-amber-100 bg-amber-50 text-amber-600" :
                        "border-emerald-100 bg-emerald-50 text-emerald-600"
                      )}>
                        {sub.risk_score}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400">
                          <User size={14} />
                        </div>
                        <span className="text-sm font-medium text-neutral-700">{sub.author}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-neutral-600">{new Date(sub.created_at).toLocaleDateString()}</p>
                      <p className="text-xs text-neutral-400">{new Date(sub.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-400 hover:text-emerald-600">
                          <CheckCircle2 size={18} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-400 hover:text-red-600">
                          <XCircle size={18} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-400">
                          <MoreVertical size={18} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-neutral-100 bg-neutral-50/30 flex items-center justify-between">
          <p className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
            Showing {submissions.length} of 1,240 results
          </p>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" className="h-8 w-8" disabled>
              <ChevronLeft size={16} />
            </Button>
            <div className="flex items-center gap-1">
              <Button variant="primary" size="sm" className="h-8 w-8 p-0">1</Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">2</Button>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">3</Button>
              <span className="text-neutral-400 px-1">...</span>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">42</Button>
            </div>
            <Button variant="outline" size="icon" className="h-8 w-8">
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
