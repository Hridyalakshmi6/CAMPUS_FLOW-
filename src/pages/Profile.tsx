import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../hooks/useAuth';
import { useTasks } from '../hooks/useTasks';
import { apiService } from '../services/api';
import Loading from '../components/Loading';
import {
  User, Mail, Phone, BookOpen, GraduationCap, Calendar,
  Edit3, Save, X, Award, CheckSquare, Clock, TrendingUp,
} from 'lucide-react';
import toast from 'react-hot-toast';
import type { User as UserType } from '../types';

type FormState = Pick<UserType, 'fullName' | 'email' | 'phoneNumber' | 'branch' | 'year' | 'subjects'>;

export default function Profile() {
  const { user, updateUser } = useAuth();
  const { tasks } = useTasks();
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<FormState>({
    fullName: user?.fullName ?? '',
    email: user?.email ?? '',
    phoneNumber: user?.phoneNumber ?? '',
    branch: user?.branch ?? '',
    year: user?.year ?? '',
    subjects: user?.subjects ?? '',
  });

  // Sync form when user changes
  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        branch: user.branch,
        year: user.year,
        subjects: user.subjects,
      });
    }
  }, [user]);

  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const pendingCount = tasks.filter((t) => t.status === 'pending').length;
  const completionPct = tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const handleSave = async () => {
    if (!form.fullName.trim()) { toast.error('Name is required.'); return; }
    setSaving(true);
    try {
      const updated = await apiService.updateProfile(form);
      updateUser(updated);
      toast.success('Profile updated!');
      setEditing(false);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to update profile.';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (user) setForm({ fullName: user.fullName, email: user.email, phoneNumber: user.phoneNumber, branch: user.branch, year: user.year, subjects: user.subjects });
    setEditing(false);
  };

  if (!user) {
    return <Loading type="profile" />;
  }

  const initials = user.fullName.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() ?? 'ST';
  const inputClass = "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm font-medium transition bg-white";
  const readClass = "text-sm font-semibold text-slate-700";

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="max-w-4xl mx-auto space-y-6">

      {/* ── Profile Banner ── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-3xl p-6 sm:p-8 shadow-lg">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4 pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur border-2 border-white/30 text-white font-black text-2xl flex items-center justify-center shadow-lg shrink-0">
            {initials}
          </div>
          <div className="text-center sm:text-left space-y-1 flex-1">
            <h2 className="text-2xl font-black tracking-tight">{user.fullName}</h2>
            <p className="text-blue-200 text-sm font-medium">{user.email}</p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
              <span className="inline-flex items-center gap-1 text-xs font-bold bg-white/15 px-3 py-1 rounded-full">
                <GraduationCap className="w-3.5 h-3.5" />{user.branch}
              </span>
              <span className="inline-flex items-center gap-1 text-xs font-bold bg-white/15 px-3 py-1 rounded-full">
                <Calendar className="w-3.5 h-3.5" />{user.year}
              </span>
            </div>
          </div>
          {/* Quick stats */}
          <div className="flex gap-3 shrink-0">
            {[
              { label: 'Done', val: completedCount, color: 'bg-emerald-500/20 text-emerald-200 border-emerald-400/30' },
              { label: 'Pending', val: pendingCount, color: 'bg-amber-500/20 text-amber-200 border-amber-400/30' },
              { label: '% Rate', val: `${completionPct}%`, color: 'bg-blue-500/20 text-blue-200 border-blue-400/30' },
            ].map((s) => (
              <div key={s.label} className={`border ${s.color} rounded-2xl px-3 py-3 text-center min-w-[64px]`}>
                <span className="text-xl font-black block">{s.val}</span>
                <span className="text-xs font-bold uppercase tracking-wider opacity-80">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Main Grid ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        {/* Left: Profile Info */}
        <div className="md:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-xs p-6 space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <h3 className="text-base font-extrabold text-slate-800">Profile Information</h3>
            {!editing ? (
              <button onClick={() => setEditing(true)} className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition cursor-pointer">
                <Edit3 className="w-3.5 h-3.5" /> Edit
              </button>
            ) : (
              <div className="flex gap-2">
                <button onClick={handleCancel} className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-lg transition cursor-pointer">
                  <X className="w-3.5 h-3.5" /> Cancel
                </button>
                <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-1 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 px-3 py-1.5 rounded-lg transition cursor-pointer">
                  <Save className="w-3.5 h-3.5" /> {saving ? 'Saving...' : 'Save'}
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><User className="w-3.5 h-3.5" /> Full Name</label>
              {editing ? <input value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} className={inputClass} /> : <p className={readClass}>{user.fullName}</p>}
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> Email</label>
              {editing ? <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClass} /> : <p className={readClass}>{user.email}</p>}
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> Phone</label>
              {editing ? <input type="tel" value={form.phoneNumber} onChange={(e) => setForm({ ...form, phoneNumber: e.target.value })} className={inputClass} /> : <p className={readClass}>{user.phoneNumber || '—'}</p>}
            </div>

            {/* Branch */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><GraduationCap className="w-3.5 h-3.5" /> Branch</label>
              {editing ? (
                <select value={form.branch} onChange={(e) => setForm({ ...form, branch: e.target.value })} className={`${inputClass} cursor-pointer`}>
                  {['Computer Science & Engineering','Electronics & Communication','Electrical Engineering','Mechanical Engineering','Information Technology','Civil Engineering'].map((b) => <option key={b}>{b}</option>)}
                </select>
              ) : <p className={readClass}>{user.branch}</p>}
            </div>

            {/* Year */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> Year</label>
              {editing ? (
                <select value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} className={`${inputClass} cursor-pointer`}>
                  {['1st Year','2nd Year','3rd Year','4th Year'].map((y) => <option key={y}>{y}</option>)}
                </select>
              ) : <p className={readClass}>{user.year}</p>}
            </div>
          </div>

          {/* Subjects */}
          <div className="pt-4 border-t border-slate-50 space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1"><BookOpen className="w-3.5 h-3.5" /> Enrolled Subjects</label>
            {editing ? (
              <input value={form.subjects} onChange={(e) => setForm({ ...form, subjects: e.target.value })} placeholder="Comma-separated subjects" className={inputClass} />
            ) : (
              <div className="flex flex-wrap gap-2 pt-1">
                {user.subjects ? user.subjects.split(',').map((s, i) => (
                  <span key={i} className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100">{s.trim()}</span>
                )) : <span className="text-xs text-slate-400">No subjects added yet.</span>}
              </div>
            )}
          </div>
        </div>

        {/* Right: Achievements */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-xs p-6 space-y-5">
          <h3 className="text-sm font-extrabold text-slate-800 uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-slate-100">
            <Award className="w-4.5 h-4.5 text-amber-500" /> Achievements
          </h3>

          {[
            { icon: <CheckSquare className="w-5 h-5" />, title: 'Tasks Champion', desc: 'Logged first task', bg: 'bg-blue-50', text: 'text-blue-600', active: tasks.length > 0 },
            { icon: <TrendingUp className="w-5 h-5" />, title: 'First Completion', desc: 'Completed a task', bg: 'bg-emerald-50', text: 'text-emerald-600', active: completedCount > 0 },
            { icon: <Award className="w-5 h-5" />, title: 'Hackathon Ready', desc: 'Joined CampusFlow', bg: 'bg-amber-50', text: 'text-amber-500', active: true },
            { icon: <Clock className="w-5 h-5" />, title: 'On a Streak', desc: '5+ tasks completed', bg: 'bg-violet-50', text: 'text-violet-600', active: completedCount >= 5 },
          ].map((badge) => (
            <div key={badge.title} className={`flex gap-3 items-center p-3 rounded-2xl border transition ${badge.active ? `${badge.bg} border-transparent` : 'bg-slate-50 border-slate-100 opacity-40 grayscale'}`}>
              <div className={`w-10 h-10 rounded-xl ${badge.active ? badge.bg : 'bg-slate-100'} ${badge.active ? badge.text : 'text-slate-400'} flex items-center justify-center shrink-0`}>
                {badge.icon}
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-700">{badge.title}</h4>
                <p className="text-xs text-slate-400 font-semibold">{badge.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}
