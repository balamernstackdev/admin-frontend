import React, { useRef } from 'react';
import { platformIcons } from '../../utils';

interface PlatformFilterProps {
  platforms: string[];
  activePlatform: string;
  onSelect: (platform: string) => void;
}

export const PlatformFilter = ({ platforms, activePlatform, onSelect }: PlatformFilterProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <div className="bg-white/80 backdrop-blur-md border-y border-gray-100 sticky top-14 z-30 shadow-sm">
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto py-3 px-4 max-w-7xl mx-auto items-center"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' } as React.CSSProperties}
      >
        <span className="text-xs font-black text-gray-400 uppercase tracking-widest shrink-0 mr-2">Filter</span>
        
        {platforms.map(p => {
          const isActive = activePlatform === p;
          const isAll = p === 'All';
          return (
            <button
              key={p}
              onClick={() => onSelect(p)}
              className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                isActive
                  ? 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white border-transparent shadow-md shadow-violet-500/30'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-violet-300 hover:text-violet-600 hover:bg-violet-50 hover:shadow-sm'
              }`}
            >
              {!isAll && platformIcons[p] && <span className={isActive ? 'text-white' : 'text-gray-400'}>{platformIcons[p]}</span>}
              {p.charAt(0).toUpperCase() + p.slice(1)}
            </button>
          );
        })}
        {/* Spacer for inertial scroll */}
        <div className="shrink-0 w-2" aria-hidden />
      </div>
    </div>
  );
};
