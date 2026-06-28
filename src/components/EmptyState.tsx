import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, Calendar, Plus, Bell, Settings } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: 'task' | 'flashcard' | 'notice' | 'notification' | 'settings';
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({
  title,
  description,
  icon = 'task',
  actionLabel,
  onAction,
}: EmptyStateProps) {
  const iconMap = {
    flashcard: { bg: 'bg-cyan-50', text: 'text-cyan-600', el: <Sparkles className="w-8 h-8" /> },
    notice:    { bg: 'bg-violet-50', text: 'text-violet-600', el: <Calendar className="w-8 h-8" /> },
    notification: { bg: 'bg-amber-50', text: 'text-amber-600', el: <Bell className="w-8 h-8" /> },
    settings:  { bg: 'bg-slate-50', text: 'text-slate-500', el: <Settings className="w-8 h-8" /> },
    task:      { bg: 'bg-blue-50', text: 'text-blue-500', el: <Plus className="w-8 h-8" /> },
  };

  const { bg, text, el } = iconMap[icon] ?? iconMap.task;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="flex flex-col items-center justify-center text-center p-10 bg-white rounded-2xl border border-slate-100 shadow-xs max-w-md mx-auto my-6"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
        className={`w-16 h-16 rounded-2xl ${bg} ${text} flex items-center justify-center mb-5`}
      >
        {el}
      </motion.div>
      <h3 className="text-lg font-bold text-slate-800 tracking-tight">{title}</h3>
      <p className="mt-2 text-sm text-slate-500 leading-relaxed max-w-xs">{description}</p>
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-6 inline-flex items-center gap-2 bg-blue-600 text-white hover:bg-blue-700 transition px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm active:scale-95 cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          {actionLabel}
        </button>
      )}
    </motion.div>
  );
}
