import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Bell, MessageCircle, Mail, Calendar, CheckCircle,
  XCircle, Clock, RefreshCw, AlertTriangle, CalendarDays,
} from 'lucide-react';
import { apiService } from '../services/api';
import { useSettings } from '../hooks/useSettings';
import Loading, { ErrorState } from '../components/Loading';
import type { AppNotification, NotificationChannel, NotificationStatus } from '../types';
import toast from 'react-hot-toast';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.round(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h}h ago`;
  return `${Math.round(h / 24)}d ago`;
}

const CHANNEL_CONFIG: Record<NotificationChannel, { icon: React.ElementType; color: string; bg: string; label: string }> = {
  whatsapp: { icon: MessageCircle, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/30', label: 'WhatsApp' },
  email: { icon: Mail, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-900/30', label: 'Email' },
  calendar: { icon: Calendar, color: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-100 dark:bg-violet-900/30', label: 'Calendar' },
  push: { icon: Bell, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-900/30', label: 'Push' },
};

const STATUS_CONFIG: Record<NotificationStatus, { icon: React.ElementType; color: string; label: string }> = {
  sent: { icon: CheckCircle, color: 'text-emerald-500', label: 'Sent' },
  pending: { icon: Clock, color: 'text-amber-500', label: 'Pending' },
  failed: { icon: XCircle, color: 'text-red-500', label: 'Failed' },
};

// ─── Notification Card ────────────────────────────────────────────────────────

function NotifCard({ notif, index }: { notif: AppNotification; index: number }) {
  const ch = CHANNEL_CONFIG[notif.channel];
  const st = STATUS_CONFIG[notif.status];
  const ChIcon = ch.icon;
  const StIcon = st.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.25 }}
      className={`bg-white dark:bg-slate-900 rounded-2xl border shadow-xs hover:shadow-md transition-all duration-200 p-4 flex items-start gap-4 ${notif.status === 'failed'
          ? 'border-red-200 dark:border-red-900/40'
          : 'border-slate-100 dark:border-slate-800'
        }`}
    >
      {/* Channel icon */}
      <div className={`p-2.5 rounded-xl ${ch.bg} ${ch.color} shrink-0`}>
        <ChIcon className="w-4.5 h-4.5" />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-start justify-between gap-2">
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200 leading-snug">{notif.title}</p>
          <div className={`flex items-center gap-1 text-3xs font-bold shrink-0 ${st.color}`}>
            <StIcon className="w-3 h-3" />
            {st.label}
          </div>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{notif.message}</p>
        <div className="flex items-center gap-3 text-3xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wide">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full ${ch.bg} ${ch.color} font-bold`}>
            <ChIcon className="w-2.5 h-2.5" />{ch.label}
          </span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{timeAgo(notif.sentAt)}</span>
          {notif.scheduledFor && (
            <span className="flex items-center gap-1 text-amber-500 dark:text-amber-400">
              <Clock className="w-3 h-3" />Fires: {new Date(notif.scheduledFor).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Notifications() {
  const { settings, updateSettings, loading: settingsLoading } = useSettings();
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<NotificationChannel | 'all'>('all');
  const [syncingCalendar, setSyncingCalendar] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await apiService.getNotifications();
      setNotifications(Array.isArray(data) ? data : []);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch notifications.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotifications(); }, []);

  const handleToggleCalendar = async () => {
    setSyncingCalendar(true);
    try {
      const targetState = !settings.calendarSync;
      await updateSettings({ calendarSync: targetState });
      toast.success(targetState ? 'Google Calendar Sync connected!' : 'Google Calendar Sync disconnected.');
    } catch {
      toast.error('Failed to update Google Calendar sync status.');
    } finally {
      setSyncingCalendar(false);
    }
  };

  if (loading || settingsLoading) {
    return <Loading type="list" count={4} />;
  }

  if (error) {
    return <ErrorState message={error} onRetry={fetchNotifications} />;
  }

  const filtered = filter === 'all' ? notifications : notifications.filter((n) => n.channel === filter);

  const counts = {
    all: notifications.length,
    whatsapp: notifications.filter((n) => n.channel === 'whatsapp').length,
    email: notifications.filter((n) => n.channel === 'email').length,
    calendar: notifications.filter((n) => n.channel === 'calendar').length,
    push: notifications.filter((n) => n.channel === 'push').length,
  };

  const sentCount = notifications.filter((n) => n.status === 'sent').length;
  const pendingCount = notifications.filter((n) => n.status === 'pending').length;
  const failedCount = notifications.filter((n) => n.status === 'failed').length;

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight flex items-center gap-2">
            <Bell className="w-6 h-6 text-amber-500" />
            Notifications
          </h2>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            WhatsApp reminders, calendar syncs, and email digests
          </p>
        </div>
        <button onClick={fetchNotifications} className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition cursor-pointer">
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Google Calendar Sync Status Connection Block */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm"
      >
        <div className="flex items-center gap-3.5 w-full sm:w-auto">
          <div className={`p-3 rounded-xl shrink-0 ${settings.calendarSync
              ? 'bg-violet-100 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400'
              : 'bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500'
            }`}>
            <CalendarDays className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Google Calendar Integration</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {settings.calendarSync
                ? 'Connected to "CampusFlow Academic Calendar" (auto-sync active)'
                : 'Automatically add task deadlines to your personal Google Calendar'}
            </p>
          </div>
        </div>
        <button
          onClick={handleToggleCalendar}
          disabled={syncingCalendar}
          className={`w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer ${settings.calendarSync
              ? 'bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-950/20 dark:text-red-400'
              : 'bg-violet-600 text-white hover:bg-violet-700'
            }`}
        >
          {syncingCalendar ? 'Connecting...' : settings.calendarSync ? 'Disconnect Sync' : 'Connect Calendar'}
        </button>
      </motion.div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Sent', value: sentCount, color: 'emerald' },
          { label: 'Pending', value: pendingCount, color: 'amber' },
          { label: 'Failed', value: failedCount, color: failedCount > 0 ? 'red' : 'slate' },
        ].map(({ label, value, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 p-4 text-center shadow-xs"
          >
            <p className={`text-2xl font-black text-${color}-600 dark:text-${color}-400`}>{value}</p>
            <p className="text-3xs font-extrabold uppercase tracking-widest text-slate-400 dark:text-slate-500 mt-0.5">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Channel filter */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'whatsapp', 'email', 'calendar'] as const).map((ch) => (
          <button
            key={ch}
            onClick={() => setFilter(ch)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer capitalize flex items-center gap-1.5 ${filter === ch
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
          >
            {ch !== 'all' && (() => { const Icon = CHANNEL_CONFIG[ch as NotificationChannel].icon; return <Icon className="w-3.5 h-3.5" />; })()}
            {ch === 'all' ? 'All' : CHANNEL_CONFIG[ch as NotificationChannel].label}
            <span className={`ml-0.5 px-1.5 py-0.5 rounded-full text-3xs font-black ${filter === ch ? 'bg-white/20 text-white' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'}`}>
              {counts[ch]}
            </span>
          </button>
        ))}
      </div>

      {/* List */}
      {loading ? (
        <Loading type="list" count={4} />
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
          <div className="p-5 bg-slate-100 dark:bg-slate-800 text-slate-400 rounded-full">
            <Bell className="w-10 h-10" />
          </div>
          <div className="space-y-1">
            <p className="text-sm font-bold text-slate-700 dark:text-slate-300">No notifications yet</p>
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium">Reminders will appear here once tasks are configured with reminder times.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence>
            {filtered.map((n, i) => (
              <NotifCard key={n.id} notif={n} index={i} />
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
