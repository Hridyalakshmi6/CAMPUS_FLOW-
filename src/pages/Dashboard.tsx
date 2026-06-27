import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiService } from '../services/api';
import DashboardCard from '../components/DashboardCard';
import Loading from '../components/Loading';
import { 
  Plus, 
  Sparkles, 
  Megaphone, 
  CheckSquare, 
  Clock, 
  Lightbulb, 
  ListTodo, 
  TrendingUp, 
  ArrowRight,
  ArrowUpRight
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [tasks, setTasks] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stats = await apiService.getDashboard();
        const allTasks = await apiService.getTasks();
        setDashboardData(stats);
        setTasks(allTasks);
      } catch (err: any) {
        toast.error('Error fetching dashboard stats');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return <Loading type="spinner" />;
  }

  const userString = localStorage.getItem('campusflow_user');
  const user = userString ? JSON.parse(userString) : { fullName: 'Student', branch: 'General' };

  // Calculate stats based on tasks
  const todayStr = new Date().toISOString().split('T')[0];
  const pendingToday = tasks.filter(t => t.deadline === todayStr && t.status !== 'completed');
  const upcomingDeadlines = tasks.filter(t => t.deadline > todayStr && t.status !== 'completed');
  const completedCount = tasks.filter(t => t.status === 'completed').length;

  return (
    <div className="space-y-6">
      
      {/* Welcome Card & Context */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-3xl p-6 sm:p-8 shadow-lg border border-blue-500/20">
        <div className="absolute top-0 right-0 transform translate-x-12 -translate-y-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 transform -translate-x-12 translate-y-12 w-48 h-48 bg-cyan-500/10 rounded-full blur-xl pointer-events-none"></div>
        
        <div className="relative z-10 max-w-2xl space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-2xs font-extrabold uppercase tracking-widest bg-white/20 text-blue-100">
            <Sparkles className="w-3.5 h-3.5 fill-blue-300 text-blue-200" />
            Empowering Campus Life
          </span>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight leading-tight">
            {dashboardData?.welcomeMessage || `Welcome, ${user.fullName}!`}
          </h2>
          <p className="text-sm sm:text-base text-blue-100 font-medium leading-relaxed">
            Your centralized hub for academic task flows, study tools, and notice feeds. Stay on track, complete deliverables, and utilize custom AI assistance.
          </p>
        </div>
      </div>

      {/* Grid of Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <DashboardCard
          title="Today's Tasks"
          value={pendingToday.length}
          description={`${pendingToday.length === 0 ? 'All caught up for today!' : `${pendingToday.length} critical items require your action.`}`}
          icon={<CheckSquare className="w-6 h-6" />}
          color="blue"
          onClick={() => navigate('/tasks')}
        />
        <DashboardCard
          title="Upcoming Deadlines"
          value={upcomingDeadlines.length}
          description={`Track ${upcomingDeadlines.length} upcoming items scheduled across subjects.`}
          icon={<Clock className="w-6 h-6" />}
          color="amber"
          onClick={() => navigate('/tasks')}
        />
        <DashboardCard
          title="Completed Tasks"
          value={completedCount}
          description={`Excellent job! You have logged ${completedCount} finished milestones in your list.`}
          icon={<TrendingUp className="w-6 h-6" />}
          color="emerald"
          onClick={() => navigate('/tasks')}
        />
      </div>

      {/* Bento Grid: AI Tip, Recent Activity, & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left/Middle Column (span 2) */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* AI Tip of the Day */}
          <div className="bg-amber-50/40 border border-amber-100 rounded-2xl p-6 shadow-2xs relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Lightbulb className="w-24 h-24 text-amber-500" />
            </div>
            <div className="flex items-start gap-4">
              <div className="p-3 bg-amber-500 text-white rounded-xl shadow-2xs">
                <Lightbulb className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-amber-800">AI Tip of the Day</h3>
                <p className="text-sm text-amber-900/90 font-medium leading-relaxed">
                  {dashboardData?.tipOfTheDay || "Break your studying into chunks. Spaced repetition and retrieval practice are extremely effective ways to prepare for exams."}
                </p>
              </div>
            </div>
          </div>

          {/* Today's Tasks Sneak Peek */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-2xs space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-extrabold text-slate-800 tracking-tight flex items-center gap-2">
                <ListTodo className="text-blue-600 w-5 h-5" />
                Today's Schedule
              </h3>
              <button
                onClick={() => navigate('/tasks')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 hover:underline inline-flex items-center gap-1 cursor-pointer"
              >
                Go to Tasks
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {pendingToday.length === 0 ? (
              <div className="p-4 bg-slate-50 rounded-xl text-center">
                <p className="text-xs font-bold text-slate-500">No pending tasks for today. Awesome!</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {pendingToday.slice(0, 3).map((task: any) => (
                  <div key={task.id} className="py-3 flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-slate-800">{task.title}</p>
                      <p className="text-2xs font-bold uppercase tracking-wider text-slate-400">{task.subject}</p>
                    </div>
                    <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full">
                      Due Today
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Quick Actions & Recent Activity (span 1) */}
        <div className="space-y-6">
          
          {/* Quick Actions Panel */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-2xs space-y-4">
            <h3 className="text-base font-extrabold text-slate-800 tracking-tight">Quick Actions</h3>
            
            <div className="grid grid-cols-1 gap-3">
              <button
                onClick={() => navigate('/tasks')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-blue-100 hover:bg-blue-50/30 text-left transition cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                    <Plus className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-700">Add New Task</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => navigate('/study-buddy')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-cyan-100 hover:bg-cyan-50/30 text-left transition cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-cyan-100 text-cyan-600 rounded-lg">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-700">Study Buddy AI</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400" />
              </button>

              <button
                onClick={() => navigate('/notice-summarizer')}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-violet-100 hover:bg-violet-50/30 text-left transition cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-violet-100 text-violet-600 rounded-lg">
                    <Megaphone className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-bold text-slate-700">Notice Summarizer</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-2xs space-y-4">
            <h3 className="text-base font-extrabold text-slate-800 tracking-tight">Recent Activity</h3>
            
            <div className="space-y-4">
              {dashboardData?.recentActivities?.length === 0 ? (
                <p className="text-xs text-slate-400 font-medium">No recent activities found.</p>
              ) : (
                dashboardData?.recentActivities?.slice(0, 3).map((act: any) => (
                  <div key={act.id} className="flex gap-3 items-start text-xs">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 shrink-0"></div>
                    <div className="space-y-0.5">
                      <p className="font-bold text-slate-700">{act.text}</p>
                      <p className="text-3xs font-semibold text-slate-400 uppercase tracking-wide">{act.time}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
