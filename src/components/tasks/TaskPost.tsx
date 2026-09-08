import { Link } from 'react-router-dom';
import type { Task } from '../../types';
import { platformIcons, timeAgo } from '../../utils';

interface TaskPostProps {
  task: Task;
}

export const TaskPost = ({ task }: TaskPostProps) => {
  const platform = task.links?.[0]?.platform || 'custom';
  const actions = task.links?.[0]?.actions || [];

  return (
    <article className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-6 flex flex-col transition-all hover:shadow-md hover:-translate-y-0.5 duration-300 group">
      
      {/* Top Header */}
      <div className="px-5 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="text-xl text-gray-700">{platformIcons[platform]}</span>
          <span className="font-bold text-gray-900 text-sm capitalize">{platform}</span>
        </div>
        <span className="text-[11px] font-semibold text-gray-400">
          {task.createdAt ? timeAgo(task.createdAt) : 'Recently'}
        </span>
      </div>

      <div className="px-5 pb-3">
        <Link to={`/tasks/${task.id}`}>
          <h2 className="text-xl font-black text-gray-900 leading-tight group-hover:text-violet-700 transition-colors">
            {task.title}
          </h2>
        </Link>
        {task.description && (
          <p className="text-sm text-gray-600 mt-2 line-clamp-2">
            {task.description}
          </p>
        )}
      </div>

      {/* Main Visual */}
      <Link to={`/tasks/${task.id}`} className="block relative w-full aspect-[16/9] bg-gray-50 overflow-hidden mx-5 w-[calc(100%-40px)] rounded-2xl">
        {task.thumbnailUrl ? (
          <img
            src={task.thumbnailUrl}
            alt={task.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <span className="text-6xl text-gray-300 group-hover:scale-110 transition-transform duration-500">{platformIcons[platform]}</span>
          </div>
        )}
      </Link>

      {/* Actions & Completion */}
      <div className="px-5 pt-4 pb-5">
        {/* Action Pills */}
        {actions.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {actions.map((action, idx) => (
              <span key={idx} className="px-3 py-1 bg-gray-50 border border-gray-100 text-gray-600 text-xs font-bold rounded-full uppercase tracking-wider">
                {action.actionType.replace('_', ' ')}
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className={`w-7 h-7 rounded-full border-2 border-white flex items-center justify-center text-xs bg-gradient-to-br ${i === 1 ? 'from-violet-500 to-indigo-500 text-white' : 'from-gray-100 to-gray-200 text-transparent'} shadow-sm`}>
                  {i === 1 ? '👥' : ''}
                </div>
              ))}
            </div>
            <span className="text-sm font-bold text-gray-800">
              {task.completionCount.toLocaleString()} <span className="font-semibold text-gray-500">people completed</span>
            </span>
          </div>

          <Link
            to={`/tasks/${task.id}`}
            className="px-6 py-2.5 bg-gray-900 hover:bg-violet-600 text-white text-sm font-bold text-center rounded-xl transition-all flex items-center justify-center gap-2 group/btn"
          >
            View Task
            <span className="group-hover/btn:translate-x-1 transition-transform">→</span>
          </Link>
        </div>
      </div>
    </article>
  );
};
