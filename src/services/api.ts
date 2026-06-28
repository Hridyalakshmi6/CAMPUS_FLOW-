import axios from 'axios';
import type {
  LoginResponse,
  RegisterResponse,
  Task,
  CreateTaskPayload,
  UpdateTaskPayload,
  DashboardData,
  FlashcardResponse,
  NoticeSummary,
  AppNotification,
  Settings,
  User,
} from '../types';

// ── Axios instance with base URL from env ────────────────────
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── Request interceptor: attach JWT ──────────────────────────
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('campusflow_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor: normalize errors + handle 401 ──────
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // On 401 Unauthorized → dispatch a global event so AuthContext
    // can perform a clean logout without a direct hook call here.
    if (error?.response?.status === 401) {
      window.dispatchEvent(new Event('auth:unauthorized'));
    }
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      'An unexpected error occurred.';
    return Promise.reject(new Error(message));
  }
);

// ── API service methods ───────────────────────────────────────
export const apiService = {

  // ── Authentication ─────────────────────────────────────────
  register: async (userData: Record<string, string>): Promise<RegisterResponse> => {
    const res = await API.post<RegisterResponse>('/register', userData);
    return res.data;
  },

  login: async (credentials: { email: string; password: string }): Promise<LoginResponse> => {
    const res = await API.post<LoginResponse>('/login', credentials);
    return res.data;
  },

  // ── Dashboard ──────────────────────────────────────────────
  getDashboard: async (): Promise<DashboardData> => {
    const res = await API.get<DashboardData>('/dashboard');
    return res.data;
  },

  // ── Task Management ────────────────────────────────────────
  getTasks: async (): Promise<Task[]> => {
    const res = await API.get<Task[]>('/tasks');
    return res.data;
  },

  createTask: async (taskData: CreateTaskPayload): Promise<Task> => {
    const res = await API.post<Task>('/tasks', taskData);
    return res.data;
  },

  updateTask: async (id: string, taskData: UpdateTaskPayload): Promise<Task> => {
    const res = await API.put<Task>(`/tasks/${id}`, taskData);
    return res.data;
  },

  deleteTask: async (id: string): Promise<{ message: string }> => {
    const res = await API.delete<{ message: string }>(`/tasks/${id}`);
    return res.data;
  },

  // ── Profile ────────────────────────────────────────────────
  getProfile: async (): Promise<User> => {
    const res = await API.get<User>('/profile');
    return res.data;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const res = await API.put<User>('/profile', data);
    return res.data;
  },

  // ── AI — Study Buddy ───────────────────────────────────────
  generateFlashcards: async (lectureNotes: string): Promise<FlashcardResponse> => {
    const res = await API.post<FlashcardResponse>('/ai/flashcards', { notes: lectureNotes });
    return res.data;
  },

  // ── AI — Notice Summarizer ─────────────────────────────────
  summarizeNotice: async (noticeText: string, eventDate: string): Promise<NoticeSummary> => {
    const res = await API.post<NoticeSummary>('/ai/summarize', { notice: noticeText, eventDate });
    return res.data;
  },

  // ── Notifications ──────────────────────────────────────────
  getNotifications: async (): Promise<AppNotification[]> => {
    const res = await API.get<AppNotification[]>('/notifications');
    return res.data;
  },

  // ── Settings ───────────────────────────────────────────────
  getSettings: async (): Promise<Settings> => {
    const res = await API.get<Settings>('/settings');
    return res.data;
  },

  updateSettings: async (data: Partial<Settings>): Promise<Settings> => {
    const res = await API.put<Settings>('/settings', data);
    return res.data;
  },
};
