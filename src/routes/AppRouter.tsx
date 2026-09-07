import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from '../context/AuthContext';
import { AdminRoute } from './guards';

const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const HomePage = lazy(() => import('../pages/user/HomePage'));
const TaskDetailPage = lazy(() => import('../pages/user/TaskDetailPage'));
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const AdminTasksPage = lazy(() => import('../pages/admin/AdminTasksPage'));
const AdminCreateTaskPage = lazy(() => import('../pages/admin/AdminCreateTaskPage'));

const Loader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-10 h-10 rounded-full border-4 border-violet-500 border-t-transparent animate-spin" />
  </div>
);

const AppRouter = () => (
  <BrowserRouter>
    <AuthProvider>
      <Suspense fallback={<Loader />}>
        <Routes>
          {/* Fully public routes — no auth required */}
          <Route path="/" element={<HomePage />} />
          <Route path="/tasks" element={<HomePage />} />
          <Route path="/tasks/:taskId" element={<TaskDetailPage />} />

          {/* Admin login */}
          <Route path="/admin/login" element={<LoginPage />} />

          {/* Protected admin routes */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/tasks" element={<AdminTasksPage />} />
            <Route path="/admin/tasks/create" element={<AdminCreateTaskPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </AuthProvider>
  </BrowserRouter>
);

export default AppRouter;
