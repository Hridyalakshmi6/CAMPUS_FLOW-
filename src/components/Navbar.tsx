import React from 'react';
import { Menu, Bell, User, BookOpen } from 'lucide-react';

interface NavbarProps {
  onToggleSidebar: () => void;
  title: string;
}

export default function Navbar({ onToggleSidebar, title }: NavbarProps) {
  const userString = localStorage.getItem('campusflow_user');
  const user = userString ? JSON.parse(userString) : { fullName: 'Student', branch: 'General' };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
      {/* Mobile Toggle & Page Title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-50 hover:text-slate-800 transition cursor-pointer"
          aria-label="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
          {title}
        </h1>
      </div>

      {/* User Quick Info */}
      <div className="flex items-center gap-4">
        <div className="hidden sm:flex flex-col text-right">
          <span className="text-sm font-bold text-slate-800">{user.fullName}</span>
          <span className="text-3xs font-semibold uppercase tracking-wider text-slate-500 max-w-[200px] truncate">
            {user.branch}
          </span>
        </div>

        {/* Profile Avatar / Indicator */}
        <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 font-bold text-sm shadow-2xs">
          {user.fullName ? user.fullName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : 'ST'}
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></div>
        </div>
      </div>
    </header>
  );
}
