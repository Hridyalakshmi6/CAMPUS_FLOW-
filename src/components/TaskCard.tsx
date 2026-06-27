import React from 'react';
import { Calendar, Bell, CheckCircle2, Circle, Edit2, Trash2, CalendarDays } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  subject: string;
  deadline: string;
  reminderTime?: string;
  addToCalendar?: boolean;
  status: 'pending' | 'completed';
}

interface TaskCardProps {
  key?: string | number;
  task: Task;
  onToggleStatus: (task: Task) => void;
  onEdit: (task: Task) => void;
  onDelete: (id: string) => void;
}

export default function TaskCard({ task, onToggleStatus, onEdit, onDelete }: TaskCardProps) {
  const isCompleted = task.status === 'completed';
  const isOverdue = new Date(task.deadline) < new Date() && !isCompleted;

  // Format date elegantly
  const formatDate = (dateStr: string) => {
    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric', year: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-US', options);
  };

  return (
    <div 
      className={`group bg-white rounded-2xl border transition-all duration-300 p-5 shadow-xs relative overflow-hidden flex flex-col justify-between ${
        isCompleted 
          ? 'border-emerald-100 bg-emerald-50/10 opacity-75' 
          : isOverdue
            ? 'border-rose-100 bg-rose-50/10'
            : 'border-slate-100 hover:border-blue-100 hover:shadow-md'
      }`}
    >
      {/* Visual Accent Bar */}
      <div 
        className={`absolute top-0 left-0 right-0 h-1.5 transition-colors ${
          isCompleted 
            ? 'bg-emerald-500' 
            : isOverdue
              ? 'bg-rose-500'
              : 'bg-blue-600'
        }`}
      />

      <div className="space-y-4 pt-1">
        {/* Top Header */}
        <div className="flex justify-between items-start gap-3">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 tracking-wide">
            {task.subject}
          </span>
          
          <button
            onClick={() => onToggleStatus(task)}
            className={`p-1 rounded-full transition-all duration-200 cursor-pointer ${
              isCompleted 
                ? 'text-emerald-600 hover:bg-emerald-50' 
                : 'text-slate-300 hover:text-blue-600 hover:bg-blue-50'
            }`}
            title={isCompleted ? "Mark as Pending" : "Mark as Completed"}
          >
            {isCompleted ? (
              <CheckCircle2 className="w-6 h-6 fill-emerald-500 text-white" />
            ) : (
              <Circle className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Task Title */}
        <div>
          <h4 className={`text-base font-bold text-slate-800 tracking-tight leading-snug line-clamp-2 ${
            isCompleted ? 'line-through text-slate-400 font-medium' : ''
          }`}>
            {task.title}
          </h4>
        </div>
      </div>

      {/* Task Details and Meta */}
      <div className="mt-5 space-y-3 pt-4 border-t border-slate-50">
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-slate-500">
          <div className="flex items-center gap-1.5">
            <Calendar className={`w-3.5 h-3.5 ${isOverdue ? 'text-rose-500' : 'text-slate-400'}`} />
            <span className={isOverdue ? 'text-rose-600 font-semibold animate-pulse' : ''}>
              {formatDate(task.deadline)} {isOverdue && '(Overdue)'}
            </span>
          </div>

          {task.reminderTime && (
            <div className="flex items-center gap-1.5">
              <Bell className="w-3.5 h-3.5 text-slate-400" />
              <span>{task.reminderTime}</span>
            </div>
          )}

          {task.addToCalendar && (
            <div className="flex items-center gap-1.5" title="Added to Calendar">
              <CalendarDays className="w-3.5 h-3.5 text-cyan-500" />
              <span className="text-cyan-600">Synced</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center pt-2">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-2xs font-extrabold uppercase tracking-widest ${
            isCompleted 
              ? 'bg-emerald-100 text-emerald-800' 
              : isOverdue
                ? 'bg-rose-100 text-rose-800'
                : 'bg-blue-50 text-blue-700'
          }`}>
            {isCompleted ? 'Completed' : isOverdue ? 'Overdue' : 'Pending'}
          </span>

          <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={() => onEdit(task)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-slate-50 transition-colors cursor-pointer"
              title="Edit Task"
            >
              <Edit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-slate-50 transition-colors cursor-pointer"
              title="Delete Task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
