import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Sparkles, 
  Megaphone, 
  User, 
  LogOut, 
  GraduationCap,
  X,
  Bell,
  Settings,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navItems = [
  { name: 'Dashboard',        path: '/dashboard',          icon: LayoutDashboard },
  { name: 'Tasks',            path: '/tasks',              icon: CheckSquare },
  { name: 'AI Study Buddy',   path: '/study-buddy',        icon: Sparkles },
  { name: 'Notice Summarizer',path: '/notice-summarizer',  icon: Megaphone },
  { name: 'Notifications',   path: '/notifications',       icon: Bell },
  { name: 'Profile',          path: '/profile',            icon: User },
  { name: 'Settings',         path: '/settings',           icon: Settings },
];

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { logout, user } = useAuth();

  const handleLogout = () => {
    onClose();
    logout();
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/40 backdrop-blur-xs lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-slate-900 text-slate-100 flex flex-col justify-between border-r border-slate-800 transition-transform duration-300 lg:static lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Header Branding */}
        <div className="flex flex-col min-h-0">
          <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800 bg-slate-950/40">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-600 rounded-xl text-white shadow-xs">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-base font-black tracking-wider text-white uppercase">
                CampusFlow
              </span>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User summary in sidebar */}
          {user && (
            <div className="px-5 py-4 border-b border-slate-800/60">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white font-black text-sm flex items-center justify-center shrink-0">
                  {user.fullName.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-white truncate">{user.fullName}</p>
                  <p className="text-3xs font-semibold uppercase tracking-wider text-slate-400 truncate">{user.branch}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Links */}
          <nav className="mt-4 px-3 space-y-1 flex-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-slate-400 hover:bg-slate-800 hover:text-slate-100'
                    }`
                  }
                >
                  <Icon className="w-4.5 h-4.5 shrink-0" />
                  {item.name}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer — Logout */}
        <div className="p-3 border-t border-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold tracking-wide text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors cursor-pointer"
          >
            <LogOut className="w-4.5 h-4.5 shrink-0" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  );
}
