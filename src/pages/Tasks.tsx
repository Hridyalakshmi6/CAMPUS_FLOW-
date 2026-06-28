import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useTasks } from '../hooks/useTasks';
import TaskCard from '../components/TaskCard';
import Modal from '../components/Modal';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import PageError from '../components/PageError';
import type { Task, CreateTaskPayload } from '../types';
import {
  Plus, Search, Filter, BookOpen, Clock, Calendar,
  CheckSquare, Bell, CalendarDays,
} from 'lucide-react';
import toast from 'react-hot-toast';

const SUBJECTS = [
  'Database Systems', 'Artificial Intelligence', 'Technical Communication',
  'Web Development', 'Computer Networks', 'Mathematics',
];

const DEFAULT_FORM: Omit<CreateTaskPayload, 'status'> = {
  title: '',
  subject: SUBJECTS[0],
  deadline: new Date().toISOString().split('T')[0],
  reminderTime: '09:00',
  addToCalendar: false,
};

export default function Tasks() {
  const { tasks, loading, error, fetchTasks, createTask, updateTask, deleteTask } = useTasks();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [subjectFilter, setSubjectFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [form, setForm] = useState({ ...DEFAULT_FORM });
  const [saving, setSaving] = useState(false);

  const openAddModal = () => {
    setEditingTask(null);
    setForm({ ...DEFAULT_FORM });
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setForm({
      title: task.title,
      subject: task.subject,
      deadline: task.deadline,
      reminderTime: task.reminderTime ?? '09:00',
      addToCalendar: task.addToCalendar ?? false,
    });
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (task: Task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    try {
      await updateTask(task.id, { status: newStatus });
      toast.success(newStatus === 'completed' ? '✅ Task completed! Great work!' : 'Task moved back to pending.');
    } catch {
      toast.error('Failed to update task status.');
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!window.confirm('Delete this task permanently?')) return;
    try {
      await deleteTask(id);
      toast.success('Task deleted.');
    } catch {
      toast.error('Failed to delete task.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.deadline) {
      toast.error('Title and deadline are required.');
      return;
    }
    setSaving(true);
    try {
      if (editingTask) {
        await updateTask(editingTask.id, form);
        toast.success('Task updated!');
      } else {
        await createTask({ ...form, status: 'pending' });
        toast.success('Task created!');
      }
      setIsModalOpen(false);
    } catch {
      toast.error('Failed to save task.');
    } finally {
      setSaving(false);
    }
  };

  const filteredTasks = tasks.filter((t) => {
    const q = search.toLowerCase();
    return (
      (t.title.toLowerCase().includes(q) || t.subject.toLowerCase().includes(q)) &&
      (statusFilter === 'all' || t.status === statusFilter) &&
      (subjectFilter === 'all' || t.subject === subjectFilter)
    );
  });

  const inputClass = "w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 text-sm font-medium transition";

  return (
    <div className="space-y-6">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Task Manager</h2>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Track assignments, tests, and academic deliverables</p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-3 rounded-xl text-sm transition shadow-md active:scale-95 cursor-pointer w-full sm:w-auto justify-center"
        >
          <Plus className="w-4.5 h-4.5" />
          Add Task
        </button>
      </motion.div>

      {/* Filters */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }} className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute inset-y-0 left-3 my-auto w-4 h-4 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks by title or subject..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 dark:focus:ring-blue-900/30 text-sm font-medium transition"
          />
        </div>
        <div className="flex gap-3">
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 rounded-xl px-3 py-1 text-slate-700 dark:text-slate-200">
            <Filter className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as typeof statusFilter)} className="bg-transparent text-xs font-bold focus:outline-none cursor-pointer">
              <option value="all" className="dark:bg-slate-900">All Status</option>
              <option value="pending" className="dark:bg-slate-900">Pending</option>
              <option value="completed" className="dark:bg-slate-900">Completed</option>
            </select>
          </div>
          <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 rounded-xl px-3 py-1 text-slate-700 dark:text-slate-200">
            <BookOpen className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
            <select value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} className="bg-transparent text-xs font-bold focus:outline-none cursor-pointer">
              <option value="all" className="dark:bg-slate-900">All Subjects</option>
              {SUBJECTS.map((s) => <option key={s} value={s} className="dark:bg-slate-900">{s}</option>)}
            </select>
          </div>
        </div>
      </motion.div>

      {/* Task List */}
      {loading ? (
        <Loading type="card" count={6} />
      ) : error ? (
        <PageError message={error} onRetry={fetchTasks} />
      ) : filteredTasks.length === 0 ? (
        <EmptyState
          title="No tasks found"
          description={search || statusFilter !== 'all' || subjectFilter !== 'all'
            ? 'Try adjusting your filters or search terms.'
            : 'Add your first task to get started!'}
          actionLabel="Create Task"
          onAction={openAddModal}
        />
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.06 } } }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          <AnimatePresence>
            {filteredTasks.map((task) => (
              <motion.div
                key={task.id}
                variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
              >
                <TaskCard
                  task={task}
                  onToggleStatus={handleToggleStatus}
                  onEdit={openEditModal}
                  onDelete={handleDeleteTask}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Add/Edit Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingTask ? 'Edit Task' : 'New Task'}>
        <form onSubmit={handleSubmit} className="space-y-4">

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Task Title *</label>
            <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. Submit DB schema draft" className={inputClass} required />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Subject *</label>
            <select value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className={`${inputClass} bg-white dark:bg-slate-800 cursor-pointer`}>
              {SUBJECTS.map((s) => <option key={s} value={s} className="dark:bg-slate-900">{s}</option>)}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Deadline *</label>
              <input type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} className={`${inputClass} cursor-pointer`} required />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1"><Bell className="w-3.5 h-3.5" /> Reminder</label>
              <input type="time" value={form.reminderTime} onChange={(e) => setForm({ ...form, reminderTime: e.target.value })} className={`${inputClass} cursor-pointer`} />
            </div>
          </div>

          <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-950/40 px-4 py-3 rounded-xl border border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <CalendarDays className="text-cyan-600 w-4.5 h-4.5" />
              <div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block">Add to Calendar</span>
                <span className="text-xs text-slate-400 dark:text-slate-500">Sync with Google Calendar</span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" checked={form.addToCalendar} onChange={(e) => setForm({ ...form, addToCalendar: e.target.checked })} className="sr-only peer" />
              <div className="w-11 h-6 bg-slate-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
            </label>
          </div>

          <button type="submit" disabled={saving} className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl transition shadow-md active:scale-95 cursor-pointer flex items-center justify-center gap-2">
            {saving ? <><Clock className="w-4 h-4 animate-spin" /> Saving...</> : editingTask ? 'Save Changes' : 'Create Task'}
          </button>
        </form>
      </Modal>
    </div>
  );
}
