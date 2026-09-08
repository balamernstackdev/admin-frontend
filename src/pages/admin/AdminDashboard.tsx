import { useEffect, useState } from 'react';
import { AdminLayout } from '../../layouts/AdminLayout';
import { adminAnalyticsService } from '../../services/services';
import { StatCard } from '../../components/ui/Card';
import { Toast } from '../../components/ui/index';
import { formatDateTime } from '../../utils';

const AdminDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'error' } | null>(null);

  useEffect(() => {
    adminAnalyticsService.getAnalytics()
      .then(res => setStats(res.data))
      .catch(() => setToast({ message: 'Failed to load analytics', type: 'error' }))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <AdminLayout>
      <div className="animate-pulse grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-32 bg-white rounded-2xl border border-gray-100" />
        ))}
      </div>
    </AdminLayout>
  );

  return (
    <AdminLayout>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Platform overview at a glance</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
        <StatCard title="Total Tasks" value={stats?.totalTasks ?? 0} icon="📋" gradient="from-violet-500 to-indigo-700" />
        <StatCard title="Published Tasks" value={stats?.activeTasks ?? 0} icon="🚀" gradient="from-orange-400 to-red-600" />
        <StatCard title="Total Completions" value={stats?.totalCompletions ?? 0} icon="✅" gradient="from-green-500 to-emerald-700" />
      </div>

      {/* Two-column lower section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Platform Breakdown */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-900 text-lg mb-4">📊 Links by Platform</h2>
          <div className="space-y-3">
            {Object.entries(stats?.tasksByPlatform || {}).map(([plat, count]) => (
              <div key={plat} className="flex items-center gap-3">
                <span className="w-28 text-sm font-medium text-gray-600 capitalize">{plat}</span>
                <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-500 to-indigo-600 rounded-full"
                    style={{ width: `${Math.min(100, (Number(count) / (stats?.totalTasks || 1)) * 100)}%` }}
                  />
                </div>
                <span className="text-sm font-bold text-gray-900 w-8 text-right">{String(count)}</span>
              </div>
            ))}
            {Object.keys(stats?.tasksByPlatform || {}).length === 0 && (
              <p className="text-sm text-gray-400">No platform data yet</p>
            )}
          </div>
        </div>

        {/* Top Tasks */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-900 text-lg mb-4">🏆 Most Completed Tasks</h2>
          <div className="space-y-3">
            {(stats?.topTasks || []).map((t: any, idx: number) => (
              <div key={t.id} className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-black ${idx === 0 ? 'bg-amber-400 text-white' : idx === 1 ? 'bg-gray-300 text-gray-800' : 'bg-orange-300 text-white'}`}>
                  {idx + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{t.title}</p>
                  <p className="text-xs text-gray-500">{t.status}</p>
                </div>
                <span className="text-sm font-bold text-violet-600">👥 {t.completionCount}</span>
              </div>
            ))}
            {(stats?.topTasks || []).length === 0 && <p className="text-sm text-gray-400">No completion data yet</p>}
          </div>
        </div>

        {/* Recent Completions */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-900 text-lg mb-4">📬 Recent Completions</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-gray-100">
                  <th className="pb-3 font-semibold text-gray-500">Task</th>
                  <th className="pb-3 font-semibold text-gray-500">Session</th>
                  <th className="pb-3 font-semibold text-gray-500">Date</th>
                </tr>
              </thead>
              <tbody>
                {(stats?.recentCompletions || []).map((c: any) => (
                  <tr key={c.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 font-medium text-gray-900 truncate max-w-[200px]">{c.task?.title}</td>
                    <td className="py-3 text-gray-400 text-xs font-mono">{c.anonymousSessionId?.slice(0, 12)}…</td>
                    <td className="py-3 text-gray-500 text-xs">{formatDateTime(c.createdAt)}</td>
                  </tr>
                ))}
                {(stats?.recentCompletions || []).length === 0 && (
                  <tr><td colSpan={3} className="py-6 text-center text-gray-400">No completions yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
