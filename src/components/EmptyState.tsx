import React from 'react';
import { Sparkles, Calendar, Plus } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: 'task' | 'flashcard' | 'notice';
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({ title, description, icon = 'task', actionLabel, onAction }: EmptyStateProps) {
  const renderIcon = () => {
    switch (icon) {
      case 'flashcard':
        return (
          <div className="relative w-16 h-16 rounded-2xl bg-cyan-50 flex items-center justify-center text-cyan-600 mb-4 mx-auto animate-bounce">
            <Sparkles className="w-8 h-8" />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full animate-ping"></div>
          </div>
        );
      case 'notice':
        return (
          <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 mb-4 mx-auto">
            <Calendar className="w-8 h-8 animate-pulse" />
          </div>
        );
      default:
        return (
          <div className="w-16 h-16 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 mb-4 mx-auto">
            <Plus className="w-8 h-8 rotate-45" />
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center text-center p-8 bg-white rounded-2xl border border-slate-100 shadow-xs max-w-md mx-auto my-6">
      {renderIcon()}
      <h3 className="text-lg font-semibold text-slate-800 tracking-tight">{title}</h3>
      <p className="mt-2 text-sm text-slate-500 leading-relaxed max-w-xs">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-5 inline-flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 transition px-4 py-2 rounded-xl text-sm font-medium shadow-sm active:scale-98 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          {actionLabel}
        </button>
      )}
    </div>
  );
}
