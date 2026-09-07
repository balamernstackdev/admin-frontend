import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import type { Task } from '../../types';
import { platformIcons, timeAgo } from '../../utils';

interface RecentTasksProps {
  tasks: Task[];
  loading: boolean;
}

const SkeletonCard = () => (
  <div className="flex flex-col shrink-0 w-[160px] md:w-[200px] bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden animate-pulse">
    <div className="w-full aspect-[4/3] bg-gray-200" />
    <div className="p-3 space-y-2">
      <div className="h-3 bg-gray-200 rounded w-1/2" />
      <div className="h-4 bg-gray-200 rounded w-full" />
      <div className="h-4 bg-gray-200 rounded w-4/5" />
      <div className="h-3 bg-gray-200 rounded w-1/3 mt-2" />
    </div>
  </div>
);

const isNew = (createdAt: string) => {
  const diff = Date.now() - new Date(createdAt).getTime();
  return diff < 1000 * 60 * 60 * 24 * 2; // 48 hours
};

export const RecentTasks = ({ tasks, loading }: RecentTasksProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  if (!loading && tasks.length === 0) return null;

  return (
    <section aria-label="Recent tasks">
      <div className="flex items-center justify-between mb-4 px-4 sm:px-0">
        <div>
          <h2 className="text-lg font-black text-gray-900 tracking-tight">Recent Tasks</h2>
          <p className="text-xs font-semibold text-gray-500">Fresh tasks added recently</p>
        </div>
        <Link to="/tasks" className="text-sm font-bold text-violet-600 hover:text-violet-700 flex items-center gap-1 bg-violet-50 px-3 py-1.5 rounded-full transition-colors">
          View all <span>→</span>
        </Link>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto px-4 sm:px-0 pb-4 pt-1 snap-x snap-mandatory"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
      >
        {loading
          ? Array.from({ length: 5 }).map((_, i) => <SkeletonCard key={i} />)
          : tasks.slice(0, 10).map(task => {
              const platform = task.links?.[0]?.platform || 'custom';
              const _isNew = task.createdAt ? isNew(task.createdAt) : false;

              return (
                <Link
                  key={task.id}
                  to={`/tasks/${task.id}`}
                  className="flex flex-col shrink-0 w-[180px] md:w-[220px] bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group snap-start relative overflow-hidden"
                >
                  <div className="w-full aspect-[4/3] relative bg-gray-50 overflow-hidden">
                    {task.thumbnailUrl ? (
                      <img
                        src={task.thumbnailUrl}
                        alt={task.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl text-gray-300 group-hover:scale-105 transition-transform duration-300">
                        {platformIcons[platform]}
                      </div>
                    )}
                    <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-black uppercase flex items-center gap-1 shadow-sm text-gray-800">
                      <span>{platformIcons[platform]}</span>
                      {platform}
                    </div>
                    {_isNew && (
                      <div className="absolute top-2 right-2 bg-violet-600 text-white px-2 py-1 rounded-lg text-[10px] font-black uppercase shadow-sm">
                        NEW
                      </div>
                    )}
                  </div>
                  
                  <div className="p-3 flex flex-col flex-1">
                    <h3 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug group-hover:text-violet-600 transition-colors mb-2 flex-1">
                      {task.title}
                    </h3>
                    
                    <div className="mt-auto border-t border-gray-50 pt-2 flex items-center justify-between">
                      <p className="text-[11px] font-bold text-gray-500">
                        👥 {task.completionCount} completed
                      </p>
                      <p className="text-[10px] font-semibold text-gray-400">
                        {task.createdAt ? timeAgo(task.createdAt) : ''}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })
        }
        <div className="shrink-0 w-2" aria-hidden />
      </div>
    </section>
  );
};

