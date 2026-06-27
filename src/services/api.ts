import axios from 'axios';

// Set up the base Axios instance
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to automatically attach JWT token from localStorage
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('campusflow_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: extract a human-readable error message
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error?.message ||
      'An unexpected error occurred.';
    return Promise.reject(new Error(message));
  }
);

export const apiService = {
  // Authentication
  register: async (userData: any) => {
    const res = await API.post('/register', userData);
    return res.data;
  },

  login: async (credentials: any) => {
    const res = await API.post('/login', credentials);
    return res.data;
  },

  // Dashboard stats
  getDashboard: async () => {
    const res = await API.get('/dashboard');
    return res.data;
  },

  // Task Management
  getTasks: async () => {
    const res = await API.get('/tasks');
    return res.data;
  },

  createTask: async (taskData: any) => {
    const res = await API.post('/tasks', taskData);
    return res.data;
  },

  updateTask: async (id: string, taskData: any) => {
    const res = await API.put(`/tasks/${id}`, taskData);
    return res.data;
  },

  deleteTask: async (id: string) => {
    const res = await API.delete(`/tasks/${id}`);
    return res.data;
  },

  // AI Study Buddy (Flashcard Generator)
  generateFlashcards: async (lectureNotes: string) => {
    const res = await API.post('/ai/flashcards', { notes: lectureNotes });
    return res.data;
  },

  // Notice Summarizer
  summarizeNotice: async (noticeText: string, eventDate: string) => {
    const res = await API.post('/ai/summarize', { notice: noticeText, eventDate });
    return res.data;
  },
};
