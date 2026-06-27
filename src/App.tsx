import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Tasks from './pages/Tasks';
import StudyBuddy from './pages/StudyBuddy';
import NoticeSummarizer from './pages/NoticeSummarizer';
import Profile from './pages/Profile';

// Layout components
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';

// Type definitions & authentication guard
interface PrivateRouteProps {
  children: React.ReactNode;
}

function PrivateRoute({ children }: PrivateRouteProps) {
  const token = localStorage.getItem('campusflow_token');
  return token ? <>{children}</> : <Navigate to="/login" replace />;
}

// Sub-component to manage Sidebar state & Page Titles dynamically
function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  // Map route paths to friendly display headers
  const getPageTitle = (path: string) => {
    switch (path) {
      case '/dashboard':
        return 'Student Dashboard';
      case '/tasks':
        return 'Task Manager';
      case '/study-buddy':
        return 'AI Study Buddy';
      case '/notice-summarizer':
        return 'Notice Summarizer';
      case '/profile':
        return 'Student Profile';
      default:
        return 'CampusFlow';
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Navigation Sidebar Drawer */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header Navbar */}
        <Navbar 
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} 
          title={getPageTitle(location.pathname)} 
        />

        {/* Content Body */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Routes>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/study-buddy" element={<StudyBuddy />} />
            <Route path="/notice-summarizer" element={<NoticeSummarizer />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      {/* Toast Notification Provider */}
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: '16px',
            background: '#1E293B',
            color: '#F8FAFC',
            fontWeight: '600',
            fontSize: '13px',
          },
          success: {
            duration: 3500,
            iconTheme: {
              primary: '#10B981',
              secondary: '#FFFFFF',
            },
          },
          error: {
            duration: 4000,
            iconTheme: {
              primary: '#EF4444',
              secondary: '#FFFFFF',
            },
          },
        }}
      />

      <Routes>
        {/* Public auth paths */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected Dashboard path wrapper */}
        <Route 
          path="/*" 
          element={
            <PrivateRoute>
              <AppLayout />
            </PrivateRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}
