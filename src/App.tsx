import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Auth
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Pages — public
import Login from './pages/Login';
import Register from './pages/Register';

// Pages — protected
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import StudyBuddy from './pages/StudyBuddy';
import NoticeSummarizer from './pages/NoticeSummarizer';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';

// Layout
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

// ── Protected Route ───────────────────────────────────────────
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
}

// ── Route → page title map ────────────────────────────────────
const PAGE_TITLES: Record<string, string> = {
  '/dashboard':          'Student Dashboard',
  '/tasks':             'Task Manager',
  '/study-buddy':       'AI Study Buddy',
  '/notice-summarizer': 'Notice Summarizer',
  '/profile':           'My Profile',
  '/notifications':     'Notifications',
  '/settings':          'Settings',
};

// ── Authenticated app layout ──────────────────────────────────
function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] ?? 'CampusFlow';

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Navbar
          onToggleSidebar={() => setSidebarOpen((v) => !v)}
          title={title}
        />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto w-full">
            <Routes>
              <Route path="/dashboard"          element={<Dashboard />} />
              <Route path="/tasks"              element={<Tasks />} />
              <Route path="/study-buddy"        element={<StudyBuddy />} />
              <Route path="/notice-summarizer"  element={<NoticeSummarizer />} />
              <Route path="/profile"            element={<Profile />} />
              <Route path="/notifications"      element={<Notifications />} />
              <Route path="/settings"           element={<Settings />} />
              <Route path="*"                   element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
}

// ── Root app with providers ───────────────────────────────────
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              borderRadius: '14px',
              background: '#1E293B',
              color: '#F8FAFC',
              fontWeight: '600',
              fontSize: '13px',
            },
            success: {
              duration: 3500,
              iconTheme: { primary: '#10B981', secondary: '#FFFFFF' },
            },
            error: {
              duration: 4500,
              iconTheme: { primary: '#EF4444', secondary: '#FFFFFF' },
            },
          }}
        />

        <Routes>
          {/* Public routes */}
          <Route path="/login"    element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected layout wrapper */}
          <Route
            path="/*"
            element={
              <PrivateRoute>
                <AppLayout />
              </PrivateRoute>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
