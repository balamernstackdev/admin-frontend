import React from 'react';
import { Link } from 'react-router-dom';
import type { Task } from '../../types';
import { platformIcons, platformBadgeColors, formatDate } from '../../utils';
import { Badge } from '../ui/index';
import { Card, CardBody } from '../ui/Card';

interface TaskCardProps {
  task: Task;
}

export const TaskCard = ({ task }: TaskCardProps) => {
  const platform = task.links?.[0]?.platform || 'custom';
  const linkCount = task.links?.length || 0;

  return (
    <Card hover className="flex flex-col overflow-hidden group cursor-pointer">
      {/* Top gradient bar */}
      <div className={`h-1.5 w-full bg-gradient-to-r ${
        platform === 'instagram' ? 'from-pink-500 to-purple-600' :
        platform === 'youtube' ? 'from-red-500 to-red-700' :
        platform === 'facebook' ? 'from-blue-600 to-blue-800' :
        platform === 'x' ? 'from-gray-700 to-gray-900' :
        'from-violet-500 to-indigo-600'
      }`} />

      {task.thumbnailUrl && (
        <div className="h-40 overflow-hidden">
          <img src={task.thumbnailUrl} alt={task.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
      )}

      <CardBody className="flex flex-col flex-1 gap-3">
        {/* Platform badge + status */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${platformBadgeColors[platform] || 'bg-gray-100 text-gray-800'}`}>
            <span>{platformIcons[platform]}</span>
            {platform.charAt(0).toUpperCase() + platform.slice(1)}
          </span>
          <Badge label={task.status} />
        </div>

        {/* Title */}
        <h3 className="font-bold text-gray-900 text-base leading-snug group-hover:text-violet-700 transition-colors line-clamp-2">
          {task.title}
        </h3>

        {/* Description */}
        <p className="text-gray-500 text-sm line-clamp-2 flex-1">{task.description}</p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-gray-500 border-t border-gray-50 pt-3">
          <span className="flex items-center gap-1">🔗 {linkCount} link{linkCount !== 1 ? 's' : ''}</span>
          {task.endAt && <span className="flex items-center gap-1">📅 {formatDate(task.endAt)}</span>}
          {task._count && <span className="flex items-center gap-1">👥 {task._count.submissions}</span>}
        </div>

        {/* Reward + CTA */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 rounded-xl border border-amber-100">
            <span className="text-amber-500 text-sm">⚡</span>
            <span className="text-sm font-bold text-amber-700">{task.rewardPoints} pts</span>
          </div>
          <Link
            to={`/tasks/${task.id}`}
            id={`task-view-${task.id}`}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold hover:shadow-lg hover:shadow-violet-500/30 transition-all"
          >
            View Task →
          </Link>
        </div>
      </CardBody>
    </Card>
  );
};
