import React, { useState, useEffect } from 'react';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { 
  Plus, 
  Search, 
  Layers, 
  BookOpen, 
  FileText, 
  MoreVertical, 
  Edit2, 
  ChevronRight,
  User,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { apiClient } from '../../core/api/client';
import { cn } from '../../lib/utils';
import { useNavigate } from 'react-router-dom';

export default function HierarchyPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'authors' | 'works' | 'chapters'>('authors');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, [activeTab]);

  const tabs = [
    { id: 'authors', label: 'Authors', icon: <User size={18} /> },
    { id: 'works', label: 'Works', icon: <BookOpen size={18} /> },
    { id: 'chapters', label: 'Chapters', icon: <FileText size={18} /> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={() => navigate(-1)} className="h-10 w-10">
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-neutral-900 tracking-tight">Hierarchy Management</h1>
            <p className="text-neutral-500 font-medium">Manage the structural relationship between authors, works, and chapters</p>
          </div>
        </div>
        <Button className="gap-2">
          <Plus size={18} /> Create {activeTab.slice(0, -1)}
        </Button>
      </div>

      <div className="flex items-center gap-1 p-1 bg-neutral-100 rounded-xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-bold transition-all",
              activeTab === tab.id 
                ? "bg-white text-neutral-900 shadow-sm" 
                : "text-neutral-500 hover:text-neutral-900"
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <Card className="p-0 border-neutral-200/60 overflow-hidden">
        <div className="p-4 border-b border-neutral-100 bg-neutral-50/50 flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={18} />
            <Input 
              placeholder={`Search ${activeTab}...`} 
              className="pl-10 bg-white"
            />
          </div>
        </div>

        <div className="divide-y divide-neutral-100">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-6 animate-pulse flex items-center justify-between">
                <div className="h-4 bg-neutral-100 rounded w-1/3" />
                <div className="h-8 w-8 bg-neutral-100 rounded" />
              </div>
            ))
          ) : (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="p-6 hover:bg-neutral-50/50 transition-colors group flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-400 border border-neutral-200">
                    {activeTab === 'authors' ? <User size={24} /> : activeTab === 'works' ? <BookOpen size={24} /> : <FileText size={24} />}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-neutral-900 capitalize">{activeTab.slice(0, -1)} #{100 + i}</h3>
                    <p className="text-xs text-neutral-500 font-medium">
                      {activeTab === 'authors' ? '12 Works • 45 Chapters' : activeTab === 'works' ? 'Author: John Doe • 8 Chapters' : 'Work: The Great Gatsby • Order: 1'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Edit2 size={14} /> Edit
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-neutral-400">
                    <MoreVertical size={18} />
                  </Button>
                  <ChevronRight size={18} className="text-neutral-300" />
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-4 bg-neutral-50 border-t border-neutral-100 flex items-center justify-center">
          <Button variant="ghost" size="sm" className="text-neutral-500 font-bold gap-2">
            Load More <ArrowRight size={14} />
          </Button>
        </div>
      </Card>
    </div>
  );
}
