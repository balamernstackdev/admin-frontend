import React from 'react';
import { FaInstagram, FaYoutube, FaFacebook, FaXTwitter, FaLink } from 'react-icons/fa6';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const platformIcons: Record<string, React.ReactNode> = {
  instagram: (
    <>
      <svg width="0" height="0">
        <linearGradient id="ig-grad" x1="1" y1="1" x2="0" y2="0">
          <stop stopColor="#f09433" offset="0%" />
          <stop stopColor="#e6683c" offset="25%" />
          <stop stopColor="#dc2743" offset="50%" />
          <stop stopColor="#cc2366" offset="75%" />
          <stop stopColor="#bc1888" offset="100%" />
        </linearGradient>
      </svg>
      <FaInstagram className="w-[1.2em] h-[1.2em] inline-block shrink-0" style={{ fill: 'url(#ig-grad)' }} />
    </>
  ),
  youtube: <FaYoutube className="w-[1.2em] h-[1.2em] inline-block shrink-0 text-[#FF0000]" />,
  facebook: <FaFacebook className="w-[1.2em] h-[1.2em] inline-block shrink-0 text-[#1877F2]" />,
  x: <FaXTwitter className="w-[1.2em] h-[1.2em] inline-block shrink-0 text-gray-900" />,
  custom: <FaLink className="w-[1.2em] h-[1.2em] inline-block shrink-0 text-violet-600" />,
};

export const platformColors: Record<string, string> = {
  instagram: 'from-pink-500 to-purple-600',
  youtube: 'from-red-500 to-red-700',
  facebook: 'from-blue-600 to-blue-800',
  x: 'from-gray-700 to-gray-900',
  custom: 'from-indigo-500 to-purple-600',
};

export const platformBadgeColors: Record<string, string> = {
  instagram: 'bg-pink-100 text-pink-800',
  youtube: 'bg-red-100 text-red-800',
  facebook: 'bg-blue-100 text-blue-800',
  x: 'bg-gray-100 text-gray-800',
  custom: 'bg-indigo-100 text-indigo-800',
};

export const statusColors: Record<string, string> = {
  DRAFT: 'bg-gray-100 text-gray-800',
  PUBLISHED: 'bg-green-100 text-green-800',
  PAUSED: 'bg-yellow-100 text-yellow-800',
  COMPLETED: 'bg-blue-100 text-blue-800',
  ARCHIVED: 'bg-red-100 text-red-800',
  PENDING: 'bg-yellow-100 text-yellow-800',
  APPROVED: 'bg-green-100 text-green-800',
  REJECTED: 'bg-red-100 text-red-800',
  ACTIVE: 'bg-green-100 text-green-800',
  INACTIVE: 'bg-gray-100 text-gray-800',
  SUSPENDED: 'bg-red-100 text-red-800',
};

export const formatDate = (date?: string) => {
  if (!date) return '—';
  return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(date));
};

export const formatDateTime = (date?: string) => {
  if (!date) return '—';
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric', month: 'short', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  }).format(new Date(date));
};

export const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();

export const timeAgo = (date: string) => {
  const seconds = Math.floor((new Date().getTime() - new Date(date).getTime()) / 1000);
  let interval = seconds / 31536000;
  if (interval > 1) return Math.floor(interval) + 'y ago';
  interval = seconds / 2592000;
  if (interval > 1) return Math.floor(interval) + 'mo ago';
  interval = seconds / 86400;
  if (interval > 1) return Math.floor(interval) + 'd ago';
  interval = seconds / 3600;
  if (interval > 1) return Math.floor(interval) + 'h ago';
  interval = seconds / 60;
  if (interval > 1) return Math.floor(interval) + 'm ago';
  return Math.floor(seconds) + 's ago';
};
