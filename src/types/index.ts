export interface Admin {
  id: string;
  email: string;
  role: 'ADMIN';
  createdAt: string;
  lastLoginAt?: string;
}

// Kept as alias for auth context compatibility
export type User = Admin;

export interface TaskAction {
  id: string;
  taskLinkId: string;
  actionType: string;
  isRequired: boolean;
}

export interface TaskLink {
  id: string;
  taskId: string;
  platform: 'instagram' | 'youtube' | 'facebook' | 'x' | 'custom';
  url: string;
  label: string;
  description?: string;
  sortOrder: number;
  actions: TaskAction[];
}

export type TaskStatus = 'DRAFT' | 'PUBLISHED' | 'PAUSED' | 'EXPIRED' | 'ARCHIVED';

export interface Task {
  id: string;
  title: string;
  slug: string;
  description: string;
  instructions: string;
  thumbnailUrl?: string;
  completionCount: number;
  status: TaskStatus;
  startAt?: string;
  endAt?: string;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  links: TaskLink[];
  creator?: { id: string; email: string };
  _count?: { submissions: number };
  rewardPoints?: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: Pagination;
}
