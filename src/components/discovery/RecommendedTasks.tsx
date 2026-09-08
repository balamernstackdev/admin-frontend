import { Link } from 'react-router-dom';

export const RecommendedTasks = () => {
  return (
    <div className="bg-gradient-to-br from-indigo-900 to-violet-950 rounded-3xl p-6 text-white relative overflow-hidden shadow-xl">
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <svg className="w-24 h-24" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      </div>
      
      <h2 className="text-sm font-black text-white/90 uppercase tracking-widest mb-1 relative z-10">
        Recommended For You
      </h2>
      <p className="text-xs text-white/60 mb-5 relative z-10">Based on your recent activity</p>

      {/* Placeholder logic for recommended tasks — to be connected to API */}
      <div className="space-y-3 relative z-10">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-bold text-sm leading-tight text-white mb-1">Engage with Top Tech Creators</p>
              <p className="text-[11px] text-white/60">YouTube • Tech Category</p>
            </div>
            <span className="shrink-0 bg-white/20 px-2 py-1 rounded text-[10px] font-black text-violet-300">
              👥 120
            </span>
          </div>
          <Link to="/tasks" className="mt-3 block w-full py-2 bg-white text-indigo-950 text-center text-xs font-black rounded-xl hover:bg-amber-300 transition-colors">
            View Matches
          </Link>
        </div>
      </div>
    </div>
  );
};
