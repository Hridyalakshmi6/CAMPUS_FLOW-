import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Bell } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface NavbarProps {
  onToggleSidebar: () => void;
  title: string;
}

export default function Navbar({ onToggleSidebar, title }: NavbarProps) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const initials = user?.fullName
    ? user.fullName.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
    : 'ST';

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-sm border-b border-slate-100 px-4 sm:px-6 py-3.5 flex items-center justify-between">
      {/* Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition cursor-pointer"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-extrabold text-slate-800 tracking-tight">{title}</h1>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        {/* Notification Bell */}
        <button
          onClick={() => navigate('/notifications')}
          className="relative p-2 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition cursor-pointer"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          {/* Unread dot */}
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-500 rounded-full border border-white" />
        </button>

        {/* User info + avatar */}
        <div className="flex items-center gap-2.5">
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-sm font-bold text-slate-800 leading-tight">{user?.fullName ?? 'Student'}</span>
            <span className="text-xs font-medium text-slate-400 max-w-[180px] truncate">{user?.branch ?? ''}</span>
          </div>

          <button
            onClick={() => navigate('/profile')}
            className="relative flex items-center justify-center w-9 h-9 rounded-xl bg-blue-600 text-white font-black text-sm shadow-xs hover:bg-blue-700 transition cursor-pointer"
            aria-label="Go to profile"
          >
            {initials}
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full" />
          </button>
        </div>
      </div>
    </header>
  );
}
