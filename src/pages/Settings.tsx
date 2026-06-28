import React from 'react';
import { motion } from 'motion/react';
import {
  Moon, Sun, Monitor, Bell, MessageCircle, Mail,
  Calendar, Clock, Save, Smartphone, ToggleLeft, ToggleRight, Palette,
} from 'lucide-react';
import { useSettings } from '../hooks/useSettings';
import type { ColorScheme, Settings as SettingsType } from '../types';
import toast from 'react-hot-toast';
import Loading from '../components/Loading';
import PageError from '../components/PageError';

// ─── Sub-components ───────────────────────────────────────────────────────────

function SettingSection({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xs overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2.5">
        <div className="text-blue-600 dark:text-blue-400">{icon}</div>
        <h3 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 tracking-tight">{title}</h3>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  );
}

function Toggle({ label, sub, value, onChange }: {
  label: string; sub?: string; value: boolean; onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">{label}</p>
        {sub && <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-0.5">{sub}</p>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className="shrink-0 cursor-pointer transition-colors"
        aria-label={label}
      >
        {value
          ? <ToggleRight className="w-9 h-9 text-blue-600 dark:text-blue-400" />
          : <ToggleLeft className="w-9 h-9 text-slate-300 dark:text-slate-600" />}
      </button>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Settings() {
  const { settings, loading, error, updateSettings, refresh } = useSettings();

  const handleSave = () => {
    toast.success('Settings synced and saved!');
  };

  if (loading) {
    return <Loading type="settings" />;
  }

  if (error) {
    return <PageError message={error} onRetry={refresh} />;
  }

  const SCHEMES: { value: ColorScheme; label: string; icon: React.ElementType }[] = [
    { value: 'light',  label: 'Light',  icon: Sun },
    { value: 'dark',   label: 'Dark',   icon: Moon },
    { value: 'system', label: 'System', icon: Monitor },
  ];

  const LEAD_TIMES = [
    { value: 1,  label: '1 hour' },
    { value: 6,  label: '6 hours' },
    { value: 12, label: '12 hours' },
    { value: 24, label: '24 hours' },
    { value: 48, label: '2 days' },
  ];

  return (
    <div className="max-w-2xl mx-auto space-y-5">

      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Settings</h2>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
          Customise appearance, reminders, and notification preferences
        </p>
      </div>

      {/* ── Appearance ─────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05, duration: 0.3 }}
      >
        <SettingSection title="Appearance" icon={<Palette className="w-4.5 h-4.5" />}>
          <div>
            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-3">Color Scheme</p>
            <div className="grid grid-cols-3 gap-3">
              {SCHEMES.map(({ value, label, icon: Icon }) => (
                <button
                  key={value}
                  onClick={() => updateSettings({ darkMode: value })}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all cursor-pointer ${
                    settings.darkMode === value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 shadow-md'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <Icon className={`w-6 h-6 ${settings.darkMode === value ? 'text-blue-600 dark:text-blue-400' : 'text-slate-500 dark:text-slate-400'}`} />
                  <span className={`text-xs font-bold ${settings.darkMode === value ? 'text-blue-700 dark:text-blue-300' : 'text-slate-600 dark:text-slate-400'}`}>{label}</span>
                </button>
              ))}
            </div>
          </div>
        </SettingSection>
      </motion.div>

      {/* ── Reminders ──────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.3 }}
      >
        <SettingSection title="Reminder Preferences" icon={<Bell className="w-4.5 h-4.5" />}>

          {/* Default time */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">Default Reminder Time</label>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Used as default for new tasks</p>
            <div className="relative">
              <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="time"
                value={settings.defaultReminderTime}
                onChange={(e) => updateSettings({ defaultReminderTime: e.target.value })}
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 focus:outline-none focus:border-blue-500 text-sm font-medium transition cursor-pointer max-w-[180px]"
              />
            </div>
          </div>

          {/* Lead time */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">Remind me before deadline</label>
            <div className="flex flex-wrap gap-2">
              {LEAD_TIMES.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => updateSettings({ reminderLeadTime: value })}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                    settings.reminderLeadTime === value
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* WhatsApp number */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-slate-800 dark:text-slate-200">WhatsApp Number</label>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Reminders will be sent to this number</p>
            <div className="relative">
              <MessageCircle className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-emerald-500" />
              <input
                type="tel"
                value={settings.whatsappNumber}
                onChange={(e) => updateSettings({ whatsappNumber: e.target.value })}
                placeholder="+91 98765 43210"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 text-sm font-medium transition"
              />
            </div>
          </div>
        </SettingSection>
      </motion.div>

      {/* ── Notification Channels ───────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.3 }}
      >
        <SettingSection title="Notification Channels" icon={<Smartphone className="w-4.5 h-4.5" />}>
          <Toggle
            label="Email Notifications"
            sub="Receive weekly academic digests and important updates via email"
            value={settings.emailNotifications}
            onChange={(v) => updateSettings({ emailNotifications: v })}
          />
          <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
            <Toggle
              label="Push Notifications"
              sub="Browser push notifications for immediate deadline alerts"
              value={settings.pushNotifications}
              onChange={(v) => updateSettings({ pushNotifications: v })}
            />
          </div>
          <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
            <Toggle
              label="Google Calendar Sync"
              sub="Automatically add tasks with deadlines to Google Calendar"
              value={settings.calendarSync}
              onChange={(v) => updateSettings({ calendarSync: v })}
            />
          </div>
        </SettingSection>
      </motion.div>

      {/* ── Status preview ──────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        className="bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-900/10 rounded-2xl border border-slate-100 dark:border-slate-800 p-5 space-y-3"
      >
        <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-600 dark:text-slate-400">Active Configuration</h3>
        <div className="grid grid-cols-2 gap-3 text-xs font-medium">
          <div className="flex items-center gap-2">
            {settings.darkMode === 'dark' ? <Moon className="w-3.5 h-3.5 text-slate-500" /> : settings.darkMode === 'light' ? <Sun className="w-3.5 h-3.5 text-amber-500" /> : <Monitor className="w-3.5 h-3.5 text-slate-500" />}
            <span className="text-slate-600 dark:text-slate-400 capitalize">Theme: {settings.darkMode}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-3.5 h-3.5 text-blue-500" />
            <span className="text-slate-600 dark:text-slate-400">Reminder: {settings.defaultReminderTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <Bell className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-slate-600 dark:text-slate-400">Lead time: {LEAD_TIMES.find(l => l.value === settings.reminderLeadTime)?.label}</span>
          </div>
          <div className="flex items-center gap-2">
            <MessageCircle className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-slate-600 dark:text-slate-400">{settings.whatsappNumber || 'No WhatsApp set'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Mail className={`w-3.5 h-3.5 ${settings.emailNotifications ? 'text-blue-500' : 'text-slate-400'}`} />
            <span className="text-slate-600 dark:text-slate-400">Email: {settings.emailNotifications ? 'On' : 'Off'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className={`w-3.5 h-3.5 ${settings.calendarSync ? 'text-violet-500' : 'text-slate-400'}`} />
            <span className="text-slate-600 dark:text-slate-400">Calendar sync: {settings.calendarSync ? 'On' : 'Off'}</span>
          </div>
        </div>
      </motion.div>

      {/* Save */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.25 }}
        onClick={handleSave}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition shadow-md shadow-blue-600/20 active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
      >
        <Save className="w-4 h-4" />
        Save Settings
      </motion.button>
    </div>
  );
}
