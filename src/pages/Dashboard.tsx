import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuth } from '../hooks/useAuth';
import { useDashboard } from '../hooks/useDashboard';
import SkeletonCard from '../components/SkeletonCard';
import PageError from '../components/PageError';
import Loading from '../components/Loading';
import type { Task } from '../types';
import {
  Plus, Sparkles, Megaphone, CheckSquare, Clock, Lightbulb,
  ListTodo, TrendingUp, ArrowRight, ArrowUpRight,
} from 'lucide-react';

// ── Subject progress bar list component ─────────────────────
function SubjectChart({ tasks }: { tasks: Task[] }) {
  const subjects = Array.from(new Set(tasks.map((t) => t.subject)));
  if (subjects.length === 0) return null;

  return (
    <div className="space-y-3.5">
      {subjects.slice(0, 4).map((subj) => {
        const subjTasks = tasks.filter((t) => t.subject === subj);
        const completed = subjTasks.filter((t) => t.status === 'completed').length;
        const total = subjTasks.length;
        const pct = total > 0 ? Math.round((completed / total) * 100) : 0;
        return (
          <div key={subj} className="space-y-1.5">
            <div className="flex justify-between items-center text-xs font-bold text-slate-600 dark:text-slate-400">
              <span className="truncate max-w-[150px]">{subj}</span>
              <span>{completed}/{total} ({pct}%)</span>
            </div>
            <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden flex">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full rounded-full"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ── Progress ring component ──────────────────────────────────
function ProgressRing({ pct }: { pct: number }) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const dash = circ * (1 - pct / 100);
  return (
    <svg width="72" height="72" className="rotate-[-90deg]">
      <circle cx="36" cy="36" r={r} fill="none" stroke="#e2e8f0" strokeWidth="6" className="dark:stroke-slate-800" />
      <circle
        cx="36" cy="36" r={r} fill="none"
        stroke="#3b82f6" strokeWidth="6"
        strokeDasharray={circ} strokeDashoffset={dash}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 0.8s ease' }}
      />
    </svg>
  );
}

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { dashboardData, tasks, loading, error, refresh } = useDashboard();

  if (loading) {
    return <Loading type="dashboard" />;
  }

  if (error) {
    return <PageError message={error} onRetry={refresh} />;
  }

  const todayStr = new Date().toISOString().split('T')[0];
  const pendingToday = tasks.filter((t) => t.deadline === todayStr && t.status !== 'completed');
  const upcomingDeadlines = tasks.filter((t) => t.deadline > todayStr && t.status !== 'completed');
  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const completionPct = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const stats = [
    {
      title: "Today's Tasks",
      value: pendingToday.length,
      desc: pendingToday.length === 0 ? 'All caught up!' : `${pendingToday.length} need attention`,
      icon: <CheckSquare className="w-5 h-5" />,
      bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-100',
    },
    {
      title: 'Upcoming',
      value: upcomingDeadlines.length,
      desc: `${upcomingDeadlines.length} deadlines ahead`,
      icon: <Clock className="w-5 h-5" />,
      bg: 'bg-amber-50', text: 'text-amber-600', border: 'border-amber-100',
    },
    {
      title: 'Completed',
      value: completedCount,
      desc: `${completionPct}% completion rate`,
      icon: <TrendingUp className="w-5 h-5" />,
      bg: 'bg-emerald-50', text: 'text-emerald-600', border: 'border-emerald-100',
    },
  ];

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-6">

      {/* ── Hero Welcome Banner ── */}
      <motion.div variants={cardVariants} className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white rounded-3xl p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-400/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/4 pointer-events-none" />

        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-widest bg-white/15 text-blue-100">
              <Sparkles className="w-3.5 h-3.5 fill-blue-300" />
              Empowering Campus Life
            </span>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
              {dashboardData?.welcomeMessage ?? `Hey, ${user?.fullName?.split(' ')[0] ?? 'Student'}! 👋`}
            </h2>
            <p className="text-sm text-blue-200 font-medium leading-relaxed">
              {user?.branch} · {user?.year} — Your academic command center.
            </p>
          </div>

          {/* Completion ring */}
          <div className="flex flex-col items-center gap-1 shrink-0">
            <div className="relative">
              <ProgressRing pct={completionPct} />
              <span className="absolute inset-0 flex items-center justify-center text-sm font-black rotate-90">
                {completionPct}%
              </span>
            </div>
            <span className="text-xs font-bold text-blue-200 uppercase tracking-wider">Done</span>
          </div>
        </div>
      </motion.div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {stats.map((s) => (
          <motion.div
            key={s.title}
            variants={cardVariants}
            onClick={() => navigate('/tasks')}
            className={`bg-white rounded-2xl border ${s.border} p-5 shadow-xs cursor-pointer hover:shadow-md transition-shadow group`}
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2.5 ${s.bg} ${s.text} rounded-xl`}>{s.icon}</div>
              <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
            </div>
            <p className={`text-3xl font-black ${s.text}`}>{s.value}</p>
            <p className="text-xs font-bold text-slate-500 mt-1">{s.title}</p>
            <p className="text-xs text-slate-400 mt-0.5">{s.desc}</p>
          </motion.div>
        ))}
      </div>

      {/* ── Bento Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left col — AI tip + Today schedule */}
        <div className="lg:col-span-2 space-y-6">

          {/* AI Tip */}
          <motion.div variants={cardVariants} className="relative overflow-hidden bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-100 rounded-2xl p-6 shadow-xs">
            <div className="absolute top-2 right-4 opacity-10"><Lightbulb className="w-24 h-24 text-amber-500" /></div>
            <div className="flex items-start gap-4 relative z-10">
              <div className="p-3 bg-amber-500 text-white rounded-xl shadow-sm shrink-0">
                <Lightbulb className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-amber-700 mb-1">AI Tip of the Day</h3>
                <p className="text-sm text-amber-900 font-medium leading-relaxed">
                  {dashboardData?.tipOfTheDay ?? 'Break your studying into chunks. Spaced repetition and active recall are the most effective exam preparation strategies.'}
                </p>
              </div>
            </div>
          </motion.div>
          {/* Subject Performance & Progress Chart */}
          <motion.div variants={cardVariants} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-xs">
            <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2 mb-5">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              Syllabus Performance & Tasks by Subject
            </h3>
            {tasks.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <span className="text-2xl mb-1">📊</span>
                <p className="text-xs font-bold text-slate-500">No task data available yet</p>
                <p className="text-4xs text-slate-400 mt-0.5">Academic counts populate automatically once deliverables are logged</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
                {/* SVG Ring Chart */}
                <div className="relative flex flex-col items-center justify-center py-2 bg-slate-50 dark:bg-slate-950/20 rounded-2xl p-4 border border-slate-50 dark:border-slate-900">
                  <div className="relative w-36 h-36 flex items-center justify-center">
                    <svg width="128" height="128" viewBox="0 0 128 128" className="rotate-[-90deg]">
                      <circle cx="64" cy="64" r="50" fill="none" stroke="#e2e8f0" strokeWidth="10" className="dark:stroke-slate-800" />
                      <circle
                        cx="64"
                        cy="64"
                        r="50"
                        fill="none"
                        stroke="url(#dashboardGrad)"
                        strokeWidth="10"
                        strokeDasharray={2 * Math.PI * 50}
                        strokeDashoffset={2 * Math.PI * 50 * (1 - completionPct / 100)}
                        strokeLinecap="round"
                        style={{ transition: 'stroke-dashoffset 1s ease-out' }}
                      />
                      <defs>
                        <linearGradient id="dashboardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#3b82f6" />
                          <stop offset="100%" stopColor="#10b981" />
                        </linearGradient>
                      </defs>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-xl font-black text-slate-800 dark:text-slate-100">{completionPct}%</span>
                      <span className="text-4xs font-extrabold text-slate-400 uppercase tracking-widest">Completed</span>
                    </div>
                  </div>
                </div>

                {/* Progress bars list */}
                <SubjectChart tasks={tasks} />
              </div>
            )}
          </motion.div>

          {/* Today's schedule */}
          <motion.div variants={cardVariants} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-6 shadow-xs">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-base font-extrabold text-slate-800 flex items-center gap-2">
                <ListTodo className="w-5 h-5 text-blue-500" />
                Today's Schedule
              </h3>
              <button onClick={() => navigate('/tasks')} className="text-xs font-bold text-blue-600 hover:text-blue-700 inline-flex items-center gap-1 cursor-pointer">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {pendingToday.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="text-3xl mb-2">🎉</div>
                <p className="text-sm font-bold text-slate-600">All clear for today!</p>
                <p className="text-xs text-slate-400 mt-1">No pending tasks due today.</p>
              </div>
            ) : (
              <div className="space-y-1">
                {pendingToday.slice(0, 4).map((task) => (
                  <div key={task.id} className="flex items-center justify-between py-3 border-b border-slate-50 last:border-0">
                    <div>
                      <p className="text-sm font-bold text-slate-800">{task.title}</p>
                      <p className="text-xs font-semibold text-slate-400">{task.subject}</p>
                    </div>
                    <span className="text-xs font-bold text-amber-600 bg-amber-50 border border-amber-100 px-2.5 py-0.5 rounded-full shrink-0">Due Today</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* Right col — Quick actions + Recent activity */}
        <div className="space-y-6">

          {/* Quick Actions */}
          <motion.div variants={cardVariants} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs space-y-3">
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider">Quick Actions</h3>
            {[
              { label: 'Add New Task', path: '/tasks', bg: 'bg-blue-50', text: 'text-blue-600', icon: <Plus className="w-4 h-4" /> },
              { label: 'Study Buddy AI', path: '/study-buddy', bg: 'bg-cyan-50', text: 'text-cyan-600', icon: <Sparkles className="w-4 h-4" /> },
              { label: 'Notice Summarizer', path: '/notice-summarizer', bg: 'bg-violet-50', text: 'text-violet-600', icon: <Megaphone className="w-4 h-4" /> },
            ].map((action) => (
              <button
                key={action.path}
                onClick={() => navigate(action.path)}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:border-slate-200 hover:bg-slate-50 text-left transition cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className={`p-2 ${action.bg} ${action.text} rounded-lg`}>{action.icon}</div>
                  <span className="text-xs font-bold text-slate-700">{action.label}</span>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
              </button>
            ))}
          </motion.div>

          {/* Recent Activity */}
          <motion.div variants={cardVariants} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-xs">
            <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider mb-4">Recent Activity</h3>
            {!dashboardData?.recentActivities?.length ? (
              <p className="text-xs text-slate-400 font-medium text-center py-4">No recent activity found.</p>
            ) : (
              <div className="space-y-3">
                {dashboardData.recentActivities.slice(0, 4).map((act) => (
                  <div key={act.id} className="flex gap-3 items-start text-xs">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-1.5 shrink-0" />
                    <div>
                      <p className="font-bold text-slate-700">{act.text}</p>
                      <p className="text-slate-400 font-semibold mt-0.5">{act.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
