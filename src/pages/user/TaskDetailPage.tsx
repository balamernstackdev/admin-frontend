import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MainLayout } from '../../layouts/MainLayout';
import { taskService } from '../../services/services';
import type { Task } from '../../types';
import { platformIcons, platformBadgeColors, platformColors, formatDate } from '../../utils';
import { Badge, Modal, Toast } from '../../components/ui/index';
import { Button } from '../../components/ui/Button';

const COMPLETED_KEY = 'taskhub_completed_tasks';

const getCompletedSet = (): Set<string> => {
  try {
    const raw = localStorage.getItem(COMPLETED_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch {
    return new Set();
  }
};

const markCompleted = (taskId: string) => {
  const set = getCompletedSet();
  set.add(taskId);
  localStorage.setItem(COMPLETED_KEY, JSON.stringify([...set]));
};

const TaskDetailPage = () => {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate = useNavigate();

  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [openedLinks, setOpenedLinks] = useState<Set<string>>(new Set());
  const [alreadyCompleted, setAlreadyCompleted] = useState(false);

  useEffect(() => {
    if (taskId) setAlreadyCompleted(getCompletedSet().has(taskId));
  }, [taskId]);

  useEffect(() => {
    if (!taskId) return;
    taskService.getTask(taskId)
      .then(res => setTask(res.data))
      .catch(() => setToast({ message: 'Task not found', type: 'error' }))
      .finally(() => setLoading(false));
  }, [taskId]);



  const handleComplete = async () => {
    if (!confirmed) {
      setToast({ message: 'Please confirm you completed all actions', type: 'info' });
      return;
    }
    setSubmitting(true);
    try {
      await taskService.completeTask(taskId!);
      markCompleted(taskId!);
      setAlreadyCompleted(true);
      setTask(prev => prev ? { ...prev, completionCount: prev.completionCount + 1 } : prev);
      setToast({ message: '🎉 Task completed successfully! Thank you.', type: 'success' });
      setShowModal(false);
    } catch (err: any) {
      const msg = err?.response?.data?.message || 'Completion failed';
      if (err?.response?.status === 409) {
        markCompleted(taskId!);
        setAlreadyCompleted(true);
        setToast({ message: 'You have already completed this task.', type: 'info' });
      } else {
        setToast({ message: msg, type: 'error' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <MainLayout>
      <div className="animate-pulse space-y-4 max-w-4xl mx-auto">
        <div className="h-8 bg-gray-200 rounded w-3/4" />
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-40 bg-gray-200 rounded-2xl" />
      </div>
    </MainLayout>
  );

  if (!task) return (
    <MainLayout>
      <div className="text-center py-20">
        <div className="text-5xl mb-4">🔍</div>
        <h2 className="text-xl font-bold text-gray-800">Task not found</h2>
      </div>
    </MainLayout>
  );

  const platform = task.links?.[0]?.platform || 'custom';
  const completedLinks = openedLinks.size;
  const totalLinks = task.links?.length || 0;
  const progressPct = totalLinks > 0 ? (completedLinks / totalLinks) * 100 : 0;
  const isAvailable = task.status === 'PUBLISHED';

  return (
    <MainLayout>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}

      <div className="max-w-5xl mx-auto">
        {/* Back */}
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-500 hover:text-violet-600 mb-6 transition-colors">
          ← Back to Tasks
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header Card */}
            <div className={`rounded-3xl bg-gradient-to-br ${platformColors[platform]} p-8 text-white shadow-2xl`}>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{platformIcons[platform]}</span>
                <span className="text-sm font-semibold opacity-80 capitalize">{platform} Task</span>
                <Badge label={task.status} className="ml-auto bg-white/20 text-white border-0" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black mb-2">{task.title}</h1>
              <p className="text-white/75 text-sm leading-relaxed">{task.description}</p>
              <div className="mt-4 flex items-center gap-2">
                <span className="text-white/60 text-sm">👥</span>
                <span className="text-sm font-semibold text-white/80">
                  Completed by {task.completionCount} {task.completionCount === 1 ? 'person' : 'people'}
                </span>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
                📋 Instructions / Command
              </h2>
              <div className="prose prose-sm text-gray-600 whitespace-pre-line leading-relaxed">
                {task.instructions}
              </div>
            </div>

            {/* Progress */}
            {totalLinks > 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-lg font-bold text-gray-900">📊 Progress</h2>
                  <span className="text-sm font-semibold text-violet-600">{completedLinks} / {totalLinks} opened</span>
                </div>
                <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-violet-500 to-indigo-600 rounded-full transition-all duration-500"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
              </div>
            )}

            {/* Links */}
            <div className="space-y-3">
              <h2 className="text-lg font-bold text-gray-900">🔗 Social Media Links</h2>
              {task.links?.map((link, idx) => (
                <div key={link.id} className={`bg-white rounded-2xl border shadow-sm p-5 transition-all ${openedLinks.has(link.id) ? 'border-green-200 bg-green-50/50' : 'border-gray-100 hover:border-violet-200'}`}>
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${platformBadgeColors[link.platform]}`}>
                          {platformIcons[link.platform]} {link.platform.charAt(0).toUpperCase() + link.platform.slice(1)}
                        </span>
                        {openedLinks.has(link.id) && <span className="text-xs text-green-600 font-semibold">✓ Opened</span>}
                      </div>
                      <p className="font-semibold text-gray-900 text-sm">{link.label || `Link ${idx + 1}`}</p>
                      {link.description && <p className="text-xs text-gray-500 mt-0.5">{link.description}</p>}
                      {link.actions?.map(action => (
                        <span key={action.id} className="inline-block text-xs bg-violet-50 text-violet-700 px-2 py-0.5 rounded-lg mt-1 mr-1 font-medium">
                          {action.isRequired ? '* ' : ''}{action.actionType}
                        </span>
                      ))}
                    </div>
                    <a
                      id={`open-link-${link.id}`}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setOpenedLinks(prev => new Set(prev).add(link.id))}
                      className={`inline-block text-center shrink-0 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                        openedLinks.has(link.id)
                          ? 'bg-green-100 text-green-700 border border-green-200 hover:bg-green-200'
                          : 'bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:shadow-lg hover:shadow-violet-500/30'
                      }`}
                    >
                      {openedLinks.has(link.id) ? '✓ Opened' : '🔗 Open Link'}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Summary Card */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">Task Summary</h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Platform</span>
                  <span className="font-semibold capitalize">{platform}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Links</span>
                  <span className="font-semibold">{totalLinks}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Status</span>
                  <Badge label={task.status} />
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Completions</span>
                  <span className="font-semibold text-violet-600">{task.completionCount}</span>
                </div>
                {task.endAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Deadline</span>
                    <span className="font-semibold text-red-600">{formatDate(task.endAt)}</span>
                  </div>
                )}
              </div>

              <div className="mt-5 p-4 bg-violet-50 rounded-xl border border-violet-100">
                <p className="text-xs text-violet-600 font-semibold mb-1">👥 Total Completions</p>
                <p className="text-2xl font-black text-violet-700">{task.completionCount} people</p>
              </div>

              {isAvailable && !alreadyCompleted && (
                <button
                  id="complete-task-btn"
                  onClick={() => setShowModal(true)}
                  className="mt-4 w-full py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-sm hover:shadow-lg hover:shadow-violet-500/30 transition-all"
                >
                  ✅ I Completed This Task
                </button>
              )}

              {alreadyCompleted && (
                <div className="mt-4 w-full py-3 rounded-xl bg-green-50 border border-green-200 text-center">
                  <span className="text-green-700 font-bold text-sm">✓ Task Completed</span>
                  <p className="text-xs text-green-600 mt-0.5">Thank you for completing this task!</p>
                </div>
              )}

              {!isAvailable && (
                <div className="mt-4 w-full py-3 rounded-xl bg-gray-50 border border-gray-200 text-center">
                  <span className="text-gray-500 font-semibold text-sm">Task not available</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal open={showModal} onClose={() => setShowModal(false)} title="Complete This Task">
        <div className="space-y-4">
          <div className="p-4 bg-violet-50 rounded-xl border border-violet-100">
            <p className="text-sm text-violet-800 font-medium">
              Before marking as complete, make sure you have performed all required social media actions above.
            </p>
          </div>
          <label className="flex items-start gap-3 cursor-pointer group">
            <input
              id="confirm-completion"
              type="checkbox"
              checked={confirmed}
              onChange={e => setConfirmed(e.target.checked)}
              className="mt-0.5 w-4 h-4 accent-violet-600 cursor-pointer"
            />
            <span className="text-sm text-gray-700 font-medium group-hover:text-gray-900">
              I confirm that I have completed all required actions on the social media platform(s).
            </span>
          </label>
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => setShowModal(false)} className="flex-1">Cancel</Button>
            <Button
              id="submit-task-btn"
              onClick={handleComplete}
              loading={submitting}
              disabled={!confirmed}
              className="flex-1"
            >
              Submit
            </Button>
          </div>
        </div>
      </Modal>
    </MainLayout>
  );
};

export default TaskDetailPage;
