import api from './api';

// Helper to get or create an anonymous session ID
export const getAnonymousSessionId = (): string => {
  const key = 'taskhub_session_id';
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
};

export const authService = {
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data).then(r => r.data),
  register: (data: { name: string; email: string; password: string }) =>
    api.post('/auth/register', data).then(r => r.data),
  me: () =>
    api.get('/auth/me').then(r => r.data),
};

export const taskService = {
  getTasks: (params?: Record<string, any>) =>
    api.get('/tasks', { params }).then(r => r.data),

  getTask: (id: string) =>
    api.get(`/tasks/${id}`).then(r => r.data),

  completeTask: (id: string) => {
    const anonymousSessionId = getAnonymousSessionId();
    return api.post(`/tasks/${id}/complete`, { anonymousSessionId }).then(r => r.data);
  },
};

export const adminTaskService = {
  getTasks: (params?: Record<string, any>) =>
    api.get('/admin/tasks', { params }).then(r => r.data),

  getTask: (id: string) =>
    api.get(`/admin/tasks/${id}`).then(r => r.data),

  createTask: (data: any) =>
    api.post('/admin/tasks', data).then(r => r.data),

  updateTask: (id: string, data: any) =>
    api.put(`/admin/tasks/${id}`, data).then(r => r.data),

  deleteTask: (id: string) =>
    api.delete(`/admin/tasks/${id}`).then(r => r.data),

  addLink: (taskId: string, data: any) =>
    api.post(`/admin/tasks/${taskId}/links`, data).then(r => r.data),

  updateLink: (taskId: string, linkId: string, data: any) =>
    api.put(`/admin/tasks/${taskId}/links/${linkId}`, data).then(r => r.data),

  deleteLink: (taskId: string, linkId: string) =>
    api.delete(`/admin/tasks/${taskId}/links/${linkId}`).then(r => r.data),
};

export const adminAnalyticsService = {
  getAnalytics: () =>
    api.get('/admin/analytics').then(r => r.data),
};
