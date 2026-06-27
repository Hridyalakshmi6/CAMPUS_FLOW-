import React, { useEffect, useState } from 'react';
import { apiService } from '../services/api';
import TaskCard from '../components/TaskCard';
import Modal from '../components/Modal';
import Loading from '../components/Loading';
import EmptyState from '../components/EmptyState';
import { Plus, Search, Filter, BookOpen, Clock, Calendar, CheckSquare, Bell, CalendarDays } from 'lucide-react';
import toast from 'react-hot-toast';

interface Task {
  id: string;
  title: string;
  subject: string;
  deadline: string;
  reminderTime?: string;
  addToCalendar?: boolean;
  status: 'pending' | 'completed';
}

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search and Filter State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('all');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Form State
  const [form, setForm] = useState({
    title: '',
    subject: 'Database Systems',
    deadline: '',
    reminderTime: '',
    addToCalendar: false,
  });

  const subjectsList = [
    'Database Systems',
    'Artificial Intelligence',
    'Technical Communication',
    'Web Development',
    'Computer Networks',
    'Mathematics'
  ];

  const fetchTasks = async () => {
    try {
      const data = await apiService.getTasks();
      setTasks(data);
    } catch (err: any) {
      toast.error('Error loading tasks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const openAddModal = () => {
    setEditingTask(null);
    setForm({
      title: '',
      subject: subjectsList[0],
      deadline: new Date().toISOString().split('T')[0],
      reminderTime: '09:00',
      addToCalendar: false,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setForm({
      title: task.title,
      subject: task.subject,
      deadline: task.deadline,
      reminderTime: task.reminderTime || '',
      addToCalendar: task.addToCalendar || false,
    });
    setIsModalOpen(true);
  };

  const handleToggleStatus = async (task: Task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    try {
      await apiService.updateTask(task.id, { status: newStatus });
      toast.success(newStatus === 'completed' ? 'Task completed! Good work!' : 'Task returned to pending.');
      fetchTasks();
    } catch (err: any) {
      toast.error('Failed to update task status.');
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await apiService.deleteTask(id);
        toast.success('Task deleted.');
        fetchTasks();
      } catch (err: any) {
        toast.error('Failed to delete task.');
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.deadline) {
      toast.error('Please fill in required fields.');
      return;
    }

    try {
      if (editingTask) {
        // Edit Task
        await apiService.updateTask(editingTask.id, form);
        toast.success('Task updated successfully!');
      } else {
        // Add Task
        await apiService.createTask({ ...form, status: 'pending' });
        toast.success('Task created successfully!');
      }
      setIsModalOpen(false);
      fetchTasks();
    } catch (err: any) {
      toast.error('Error saving task.');
    }
  };

  // Filter computation
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase()) || 
                          task.subject.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesSubject = subjectFilter === 'all' || task.subject === subjectFilter;

    return matchesSearch && matchesStatus && matchesSubject;
  });

  return (
    <div className="space-y-6">
      
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">Task Manager</h2>
          <p className="text-sm font-medium text-slate-500">Add, schedule, and track academic assignments, tests, and deliverables</p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-3 rounded-xl text-sm transition shadow-md active:scale-98 cursor-pointer w-full sm:w-auto justify-center"
        >
          <Plus className="w-5 h-5" />
          Add Task
        </button>
      </div>

      {/* Search and Filters panel */}
      <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-2xs flex flex-col md:flex-row gap-4">
        
        {/* Search */}
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
            <Search className="w-5 h-5" />
          </span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tasks by title, subject..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-sm font-medium transition"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 rounded-xl px-3 py-1">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={statusFilter}
              onChange={(e: any) => setStatusFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-700 focus:outline-hidden cursor-pointer"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Subject Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 rounded-xl px-3 py-1">
            <BookOpen className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-700 focus:outline-hidden cursor-pointer"
            >
              <option value="all">All Subjects</option>
              {subjectsList.map(subj => (
                <option key={subj} value={subj}>{subj}</option>
              ))}
            </select>
          </div>

        </div>

      </div>

      {/* Task List Rendering */}
      {loading ? (
        <Loading type="card" count={3} />
      ) : filteredTasks.length === 0 ? (
        <EmptyState
          title="No tasks found"
          description="Try broadening your filters, searching different keywords, or add a fresh task to get started."
          actionLabel="Create Task"
          onAction={openAddModal}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleStatus={handleToggleStatus}
              onEdit={openEditModal}
              onDelete={handleDeleteTask}
            />
          ))}
        </div>
      )}

      {/* Form Dialog Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTask ? 'Edit Task' : 'Add New Task'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Title */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Task Title *</label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="e.g. Design relational schema draft"
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-sm font-medium transition"
              required
            />
          </div>

          {/* Subject Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Subject *</label>
            <select
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-sm font-medium transition cursor-pointer"
            >
              {subjectsList.map(subj => (
                <option key={subj} value={subj}>{subj}</option>
              ))}
            </select>
          </div>

          {/* Deadline Date */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Deadline Date *</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Calendar className="w-5 h-5" />
              </span>
              <input
                type="date"
                value={form.deadline}
                onChange={(e) => setForm({ ...form, deadline: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-sm font-medium transition cursor-pointer"
                required
              />
            </div>
          </div>

          {/* Reminder Time */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-600 uppercase tracking-wider">Reminder Time</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Bell className="w-5 h-5" />
              </span>
              <input
                type="time"
                value={form.reminderTime}
                onChange={(e) => setForm({ ...form, reminderTime: e.target.value })}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:border-blue-600 focus:ring-2 focus:ring-blue-100 text-sm font-medium transition cursor-pointer"
              />
            </div>
          </div>

          {/* Add to Calendar Toggle */}
          <div className="pt-2 flex items-center justify-between bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">
            <div className="flex gap-2.5 items-center">
              <CalendarDays className="text-cyan-600 w-5 h-5" />
              <div className="flex flex-col">
                <span className="text-xs font-bold text-slate-700">Add to Calendar</span>
                <span className="text-3xs font-semibold text-slate-400 uppercase tracking-wide">Sync to Google / Local Calendar</span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={form.addToCalendar}
                onChange={(e) => setForm({ ...form, addToCalendar: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-200 peer-focus:outline-hidden rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-xl transition shadow-md active:scale-98 cursor-pointer"
          >
            {editingTask ? 'Save Changes' : 'Create Task'}
          </button>

        </form>
      </Modal>

    </div>
  );
}
