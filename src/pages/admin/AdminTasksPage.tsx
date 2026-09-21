import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from '../../layouts/AdminLayout';
import { adminTaskService } from '../../services/services';
import type { Task } from '../../types';
import { platformIcons } from '../../utils/index';
import { Badge, Toast, Modal, EmptyState } from '../../components/ui/index';
import { Button } from '../../components/ui/Button';
import { Edit2, PauseCircle, PlayCircle, Trash2, Eye } from 'lucide-react';

const platforms = ['All', 'instagram', 'youtube', 'facebook', 'x', 'custom'];
const statuses = ['All', 'DRAFT', 'PUBLISHED', 'PAUSED', 'EXPIRED', 'ARCHIVED'];

const AdminTasksPage = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [platform, setPlatform] = useState('All');
  const [status, setStatus] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean; task?: Task }>({ open: false });

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 400);
    return () => clearTimeout(t);
  }, [search]);

  const loadTasks = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminTaskService.getTasks({
        page, limit: 20,
        search: debouncedSearch || undefined,
        platform: platform !== 'All' ? platform : undefined,
        status: status !== 'All' ? status : undefined,
      });
      setTasks(res.data);
      setTotalPages(res.pagination.totalPages);
    } catch {
      setToast({ message: 'Failed to load tasks', type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, platform, status]);

  useEffect(() => { loadTasks(); }, [loadTasks]);
  useEffect(() => { setPage(1); }, [debouncedSearch, platform, status]);

  const handleDelete = async () => {
    if (!deleteModal.task) return;
    try {
      await adminTaskService.deleteTask(deleteModal.task.id);
      setToast({ message: 'Task deleted', type: 'success' });
      setDeleteModal({ open: false });
      loadTasks();
    } catch {
      setToast({ message: 'Failed to delete task', type: 'error' });
    }
  };

  const handleStatusChange = async (taskId: string, newStatus: string) => {
    try {
      await adminTaskService.updateTask(taskId, { status: newStatus });
      setToast({ message: `Task ${newStatus.toLowerCase()}`, type: 'success' });
      loadTasks();
    } catch {
      setToast({ message: 'Failed to update status', type: 'error' });
    }
  };

  return (
    <AdminLayout>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-gray-900">Tasks</h1>
          <p className="text-gray-500 mt-1">Manage all social media tasks</p>
        </div>
        <Link to="/admin/tasks/create">
          <Button id="create-task-btn">+ Create Task</Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5 flex flex-col sm:flex-row gap-3">
        <input
          id="admin-task-search"
          type="text"
          placeholder="Search tasks..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
        <select
          value={platform}
          onChange={e => setPlatform(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
        >
          {platforms.map(p => <option key={p}>{p}</option>)}
        </select>
        <select
          value={status}
          onChange={e => setStatus(e.target.value)}
          className="px-4 py-2.5 rounded-xl border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 bg-white"
        >
          {statuses.map(s => <option key={s}>{s}</option>)}
        </select>
      </div>

      {/* Task Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 space-y-4 animate-pulse">
            {[1, 2, 3, 4].map(i => <div key={i} className="h-12 bg-gray-100 rounded-xl" />)}
          </div>
        ) : tasks.length === 0 ? (
          <EmptyState icon="📋" title="No tasks found" description="Create your first task!" />
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                     <th className="px-6 py-3 text-left font-semibold text-gray-500">Task</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-500">Platform</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-500">Status</th>
                    {/* <th className="px-6 py-3 text-left font-semibold text-gray-500">Completions</th>
                    <th className="px-6 py-3 text-left font-semibold text-gray-500">Deadline</th> */}
                    <th className="px-6 py-3 text-right font-semibold text-gray-500">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map(task => {
                    const plat = task.links?.[0]?.platform || 'custom';
                    return (
                      <tr key={task.id} className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-semibold text-gray-900 line-clamp-1">{task.title}</p>
                          {/* <p className="text-xs text-gray-400">{task.completionCount} completions</p> */}
                        </td>
                        <td className="px-6 py-4">
                          <span className="capitalize text-gray-600">{platformIcons[plat]} {plat}</span>
                        </td>
                        <td className="px-6 py-4"><Badge label={task.status} /></td>
                        {/* <td className="px-6 py-4 font-bold text-violet-600">👥 {task.completionCount}</td>
                        <td className="px-6 py-4 text-gray-500 text-xs">{formatDate(task.endAt)}</td> */}
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-3">
                            <Link to={`/tasks/${task.id}`} target="_blank" className="text-blue-600 hover:text-blue-800 transition-colors" title="View as User">
                              <Eye size={18} />
                            </Link>
                            <Link to={`/admin/tasks/${task.id}/edit`} className="text-violet-600 hover:text-violet-800 transition-colors" title="Edit">
                              <Edit2 size={18} />
                            </Link>
                            {task.status !== 'PUBLISHED' && (
                              <button onClick={() => handleStatusChange(task.id, 'PUBLISHED')} className="text-green-600 hover:text-green-800 transition-colors" title="Publish">
                                <PlayCircle size={18} />
                              </button>
                            )}
                            {task.status === 'PUBLISHED' && (
                              <button onClick={() => handleStatusChange(task.id, 'PAUSED')} className="text-amber-600 hover:text-amber-800 transition-colors" title="Pause">
                                <PauseCircle size={18} />
                              </button>
                            )}
                            <button
                              onClick={() => setDeleteModal({ open: true, task })}
                              className="text-red-500 hover:text-red-700 transition-colors"
                              title="Delete"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-gray-100">
              {tasks.map(task => (
                <div key={task.id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between">
                    <p className="font-semibold text-gray-900 text-sm">{task.title}</p>
                    <Badge label={task.status} />
                  </div>
                  <div className="flex items-center gap-3 text-xs text-gray-500">
                    {/* <span>👥 {task.completionCount} completions</span>
                    <span>•</span> */}
                    <span>{task.links?.[0]?.platform || 'custom'}</span>
                  </div>
                  <div className="flex gap-2">
                    <Link to={`/tasks/${task.id}`} target="_blank" className="flex-1 py-2 rounded-xl bg-blue-50 text-blue-600 flex justify-center items-center gap-2 text-xs font-bold transition-colors hover:bg-blue-100">
                      <Eye size={16} /> View
                    </Link>
                    <Link to={`/admin/tasks/${task.id}/edit`} className="flex-1 py-2 rounded-xl bg-violet-50 text-violet-600 flex justify-center items-center gap-2 text-xs font-bold transition-colors hover:bg-violet-100">
                      <Edit2 size={16} /> Edit
                    </Link>
                    {task.status !== 'PUBLISHED' ? (
                      <button onClick={() => handleStatusChange(task.id, 'PUBLISHED')} className="flex-1 py-2 rounded-xl bg-green-50 text-green-600 flex justify-center items-center gap-2 text-xs font-bold transition-colors hover:bg-green-100">
                        <PlayCircle size={16} /> Publish
                      </button>
                    ) : (
                      <button onClick={() => handleStatusChange(task.id, 'PAUSED')} className="flex-1 py-2 rounded-xl bg-amber-50 text-amber-600 flex justify-center items-center gap-2 text-xs font-bold transition-colors hover:bg-amber-100">
                        <PauseCircle size={16} /> Pause
                      </button>
                    )}
                    <button onClick={() => setDeleteModal({ open: true, task })} className="flex-1 py-2 rounded-xl bg-red-50 text-red-600 flex justify-center items-center gap-2 text-xs font-bold transition-colors hover:bg-red-100">
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-6">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="px-4 py-2 rounded-xl border bg-white text-sm font-medium disabled:opacity-40">← Prev</button>
          <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-4 py-2 rounded-xl border bg-white text-sm font-medium disabled:opacity-40">Next →</button>
        </div>
      )}

      {/* Delete Modal */}
      <Modal open={deleteModal.open} onClose={() => setDeleteModal({ open: false })} title="Delete Task">
        <p className="text-sm text-gray-600 mb-4">Are you sure you want to delete <strong>"{deleteModal.task?.title}"</strong>? This action cannot be undone.</p>
        <div className="flex gap-3">
          <Button variant="secondary" onClick={() => setDeleteModal({ open: false })} className="flex-1">Cancel</Button>
          <Button variant="danger" onClick={handleDelete} className="flex-1">Delete</Button>
        </div>
      </Modal>
    </AdminLayout>
  );
};

export default AdminTasksPage;
