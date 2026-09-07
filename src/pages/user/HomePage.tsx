import React, { useState, useEffect, useCallback } from 'react';
import { MainLayout } from '../../layouts/MainLayout';
import { taskService } from '../../services/services';
import type { Task } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { Toast, EmptyState } from '../../components/ui/index';


import { RecentTasks } from '../../components/tasks/RecentTasks';
import { PlatformFilter } from '../../components/tasks/PlatformFilter';
import { TaskPost } from '../../components/tasks/TaskPost';
import { TrendingTasks } from '../../components/discovery/TrendingTasks';
import { RecommendedTasks } from '../../components/discovery/RecommendedTasks';

const PLATFORMS = ['All', 'instagram', 'youtube', 'facebook', 'x', 'custom'];

const TaskPostSkeleton = () => (
  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-6 animate-pulse">
    <div className="px-5 py-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-gray-200" />
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-24" />
        <div className="h-3 bg-gray-200 rounded w-16" />
      </div>
    </div>
    <div className="w-full aspect-[16/9] bg-gray-200" />
    <div className="px-5 pt-4 pb-5 space-y-3">
      <div className="h-6 bg-gray-200 rounded w-3/4" />
      <div className="h-4 bg-gray-200 rounded w-full" />
      <div className="h-4 bg-gray-200 rounded w-5/6" />
      <div className="h-12 bg-gray-200 rounded-xl w-full mt-4" />
    </div>
  </div>
);

const HomePage = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [platform, setPlatform] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [toast, setToast] = useState<{ message: string; type: 'error' | 'success' } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(timer);
  }, [search]);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await taskService.getTasks({
        page, limit: 10,
        search: debouncedSearch || undefined,
        platform: platform !== 'All' ? platform : undefined,
      });
      // Sort by newest for the feed
      const sorted = res.data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setTasks(sorted);
      setTotalPages(res.pagination.totalPages);
    } catch {
      setToast({ message: 'Failed to load tasks', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, platform]);

  useEffect(() => { loadTasks(); }, [loadTasks]);
  useEffect(() => { setPage(1); }, [debouncedSearch, platform]);

  return (
    <MainLayout fullWidth>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="bg-gray-50 min-h-screen pb-24">
        {/* 1. Mobile & Desktop Compact Top Area */}
        <div className="bg-gradient-to-br from-violet-600 via-indigo-700 to-purple-800 text-white pb-8 pt-8 md:pt-12 md:pb-12 border-b border-indigo-900/20 shadow-inner relative overflow-hidden">
          {/* Decorative floating elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] right-[-5%] w-[30%] h-[50%] rounded-full bg-pink-500/10 blur-[80px]" />
            <div className="absolute bottom-[-10%] left-[-5%] w-[40%] h-[50%] rounded-full bg-violet-500/10 blur-[80px]" />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-2xl">
              <span className="inline-block py-1 px-3 rounded-full bg-white/10 text-white/90 text-[10px] font-bold uppercase tracking-widest mb-4 border border-white/20 shadow-sm backdrop-blur-md">
                Social Tasks
              </span>
              <h1 className="text-3xl md:text-5xl font-black mb-3 md:mb-4 tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white to-white/80">
                Discover. Complete. Contribute.
              </h1>
              <p className="text-sm md:text-base text-white/80 font-medium max-w-xl leading-relaxed">
                Explore social media tasks from Instagram, YouTube, Facebook and X. Help creators grow and earn social impact.
              </p>
            </div>
          </div>
        </div>

        {/* 2. Recent Tasks (Story Style) */}
        <div className="max-w-7xl mx-auto pt-6 pb-2">
          <RecentTasks tasks={tasks} loading={loading} />
        </div>

        {/* 3. Sticky Platform Filters */}
        <PlatformFilter platforms={PLATFORMS} activePlatform={platform} onSelect={setPlatform} />

        {/* 4. Main Content Area */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
          <div className="flex flex-col lg:flex-row gap-8">
            
            {/* Left Column: Social Feed (65-70%) */}
            <div className="lg:w-2/3">
              {/* Search Bar */}
              <div className="relative mb-6">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </span>
                <input
                  type="text"
                  placeholder="Search tasks, platforms, categories..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-gray-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-violet-500 shadow-sm"
                />
              </div>

              {/* Feed Header */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-black text-gray-900 tracking-tight">Latest Tasks</h2>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{tasks.length} Available</span>
              </div>

              {/* Feed Content */}
              {loading ? (
                <div className="space-y-6">
                  <TaskPostSkeleton />
                  <TaskPostSkeleton />
                  <TaskPostSkeleton />
                </div>
              ) : tasks.length === 0 ? (
                <div className="bg-white rounded-3xl border border-gray-100 p-10 md:p-16 shadow-sm flex flex-col items-center text-center">
                  <div className="w-20 h-20 bg-violet-50 text-violet-500 rounded-full flex items-center justify-center text-4xl mb-6 shadow-sm">
                    🔍
                  </div>
                  <h3 className="text-xl font-black text-gray-900 mb-2">No tasks found</h3>
                  <p className="text-sm text-gray-500 max-w-sm mb-8">We couldn't find any tasks matching your search or filters.</p>
                  <button onClick={() => { setSearch(''); setPlatform('All'); }} className="px-6 py-2.5 bg-violet-50 hover:bg-violet-100 text-violet-700 hover:text-violet-800 rounded-xl font-bold text-sm transition-colors border border-violet-100">
                    Clear Filters
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {tasks.map(task => (
                    <TaskPost key={task.id} task={task} />
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-8 pb-8 border-t border-gray-200 pt-8">
                  <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-5 py-2.5 rounded-xl bg-white border border-gray-200 text-sm font-bold text-gray-600 disabled:opacity-40 hover:bg-gray-50 transition-colors shadow-sm">
                    ← Newer
                  </button>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                    Page {page} of {totalPages}
                  </span>
                  <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-5 py-2.5 rounded-xl bg-white border border-gray-200 text-sm font-bold text-gray-600 disabled:opacity-40 hover:bg-gray-50 transition-colors shadow-sm">
                    Older →
                  </button>
                </div>
              )}
            </div>

            {/* Right Column: Discovery Sidebar (30-35%) */}
            <div className="lg:w-1/3 flex flex-col gap-6 order-last">
              {/* Ensure it is hidden on mobile and visible on desktop in a sticky way if desired, or just reorder visually */}
              <div className="sticky top-20 space-y-6">
                <TrendingTasks tasks={tasks.slice(0, 5)} />
                <RecommendedTasks />
              </div>
            </div>

          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default HomePage;
