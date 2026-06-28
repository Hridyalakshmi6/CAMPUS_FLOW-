// ============================================================
//  CampusFlow — Central TypeScript Interfaces
//  All domain models used across pages, hooks, and services
// ============================================================

// ── User ─────────────────────────────────────────────────────
export interface User {
  id?: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  branch: string;
  year: string;
  subjects: string; // comma-separated
  completedTasks?: number;
  pendingTasks?: number;
}

// ── Auth ──────────────────────────────────────────────────────
export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface LoginResponse {
  message: string;
  token: string;
  user: User;
}

export interface RegisterResponse {
  message: string;
  token: string;
  user: User;
}

// ── Task ──────────────────────────────────────────────────────
export type TaskStatus = 'pending' | 'completed';

export interface Task {
  id: string;
  title: string;
  subject: string;
  deadline: string; // ISO date string YYYY-MM-DD
  reminderTime?: string; // HH:MM
  addToCalendar?: boolean;
  status: TaskStatus;
  createdAt?: string;
}

export interface CreateTaskPayload {
  title: string;
  subject: string;
  deadline: string;
  reminderTime?: string;
  addToCalendar?: boolean;
  status: TaskStatus;
}

export type UpdateTaskPayload = Partial<Omit<CreateTaskPayload, 'status'>> & { status?: TaskStatus };

// ── Dashboard ─────────────────────────────────────────────────
export interface Activity {
  id: string;
  text: string;
  time: string;
  type?: 'task' | 'notice' | 'login' | 'system';
}

export interface DashboardData {
  welcomeMessage?: string;
  todayTasksCount?: number;
  upcomingCount?: number;
  tipOfTheDay?: string;
  recentActivities?: Activity[];
}

// ── Flashcard / Study Buddy ───────────────────────────────────
export interface Flashcard {
  question: string;
  answer: string;
}

export interface FlashcardResponse {
  flashcards: Flashcard[];
}

// ── Notice Summarizer ─────────────────────────────────────────
export interface NoticeSummary {
  summary: string;
  eventDate?: string;
  broadcastedAt?: string;
}

// ── Notifications ─────────────────────────────────────────────
export type NotificationStatus = 'sent' | 'pending' | 'failed';
export type NotificationChannel = 'whatsapp' | 'email' | 'calendar' | 'push';

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  channel: NotificationChannel;
  status: NotificationStatus;
  taskId?: string;
  sentAt: string;
  scheduledFor?: string;
}

export interface CalendarSyncStatus {
  connected: boolean;
  lastSynced?: string;
  calendarName?: string;
}

// ── Settings ──────────────────────────────────────────────────
export type ColorScheme = 'light' | 'dark' | 'system';

export interface Settings {
  darkMode: ColorScheme;
  defaultReminderTime: string; // HH:MM
  whatsappNumber: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  calendarSync: boolean;
  reminderLeadTime: number; // hours before deadline
}

export const DEFAULT_SETTINGS: Settings = {
  darkMode: 'light',
  defaultReminderTime: '09:00',
  whatsappNumber: '',
  emailNotifications: true,
  pushNotifications: false,
  calendarSync: false,
  reminderLeadTime: 24,
};
