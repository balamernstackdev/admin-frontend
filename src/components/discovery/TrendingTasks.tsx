import React from 'react';
import { Link } from 'react-router-dom';
import type { Task } from '../../types';
import { platformIcons } from '../../utils';

interface TrendingTasksProps {
  tasks: Task[];
}

export const TrendingTasks = ({ tasks }: TrendingTasksProps) => {
  if (!tasks || tasks.length === 0) return null;

  return (
    <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 relative overflow-hidden">
      {/* Decorative gradient corner */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl pointer-events-none" />

      <h2 className="text-sm font-black text-gray-900 uppercase tracking-widest mb-1 flex items-center gap-2">
        <span className="text-orange-500 text-lg">🔥</span> Trending Tasks
      </h2>
      <p className="text-xs text-gray-500 font-semibold mb-6">Popular tasks right now</p>
      
      <div className="space-y-5">
        {tasks.map((task, idx) => {
          const platform = task.links?.[0]?.platform || 'custom';
          const isTop = idx === 0;
          
          return (
            <Link key={task.id} to={`/tasks/${task.id}`} className="flex items-center gap-3.5 group">
              <span className={`font-black text-lg w-6 shrink-0 text-center ${isTop ? 'text-orange-500' : 'text-gray-300'}`}>
                {String(idx + 1).padStart(2, '0')}
              </span>
              
              <div className={`w-12 h-12 rounded-xl bg-gray-50 overflow-hidden shrink-0 relative flex items-center justify-center ${isTop ? 'ring-2 ring-orange-500/20 ring-offset-2' : ''}`}>
                {task.thumbnailUrl ? (
                  <img src={task.thumbnailUrl} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform" loading="lazy" />
                ) : (
                  <span className="text-xl text-gray-400 group-hover:scale-110 transition-transform">{platformIcons[platform]}</span>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate group-hover:text-violet-600 transition-colors">
                  {task.title}
                </p>
                <div className="flex items-center gap-2 mt-1 text-[11px] font-semibold text-gray-500">
                  <span className="capitalize">{platform}</span>
                  <span aria-hidden>•</span>
                  <span className="text-gray-600 font-bold">{task.completionCount.toLocaleString()} completed</span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
      
      <Link to="/tasks" className="block mt-6 text-center text-xs font-bold text-violet-700 hover:text-violet-800 transition-colors bg-violet-50 hover:bg-violet-100 py-3 rounded-xl border border-violet-100">
        View All Trends →
      </Link>
    </div>
  );
};
