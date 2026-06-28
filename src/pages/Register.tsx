import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { apiService } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { GraduationCap, User, BookOpen, Calendar, Phone, Mail, Lock, Loader2, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    fullName: '',
    branch: 'Computer Science & Engineering',
    year: '1st Year',
    subjects: '',
    phoneNumber: '',
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.fullName || !form.subjects || !form.phoneNumber || !form.email || !form.password) {
      toast.error('All fields are required.');
      return;
    }
    setLoading(true);
    try {
      const data = await apiService.register(form);
      login(data.token, data.user);
      toast.success(data.message || 'Welcome to CampusFlow! 🎓');
      navigate('/dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Registration failed.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = "w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm font-medium transition bg-slate-50/50";
  const selectClass = "w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white/80 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm font-medium transition cursor-pointer";
  const labelClass = "text-xs font-bold text-slate-600 uppercase tracking-wider";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 flex items-center justify-center p-4 py-12">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative w-full max-w-lg"
      >
        <div className="bg-white/95 backdrop-blur-sm rounded-3xl border border-white/20 shadow-2xl p-8 space-y-6">

          <div className="text-center space-y-3">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex p-4 bg-blue-600 rounded-2xl text-white shadow-lg shadow-blue-600/30 mb-1"
            >
              <GraduationCap className="w-8 h-8" />
            </motion.div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tight">Create your Account</h2>
            <p className="text-sm text-slate-500 font-medium">Join CampusFlow to unlock academic productivity</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Full Name */}
            <div className="space-y-1.5">
              <label className={labelClass}>Full Name</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"><User className="w-4.5 h-4.5" /></span>
                <input type="text" name="fullName" value={form.fullName} onChange={handleChange} placeholder="Alex Mercer" className={inputClass} required />
              </div>
            </div>

            {/* Branch & Year */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className={labelClass}>Branch</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"><GraduationCap className="w-4.5 h-4.5" /></span>
                  <select name="branch" value={form.branch} onChange={handleChange} className={`${selectClass} pl-10`}>
                    <option value="Computer Science & Engineering">CSE</option>
                    <option value="Electronics & Communication">ECE</option>
                    <option value="Electrical Engineering">EEE</option>
                    <option value="Mechanical Engineering">ME</option>
                    <option value="Information Technology">IT</option>
                    <option value="Civil Engineering">Civil</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Academic Year</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"><Calendar className="w-4.5 h-4.5" /></span>
                  <select name="year" value={form.year} onChange={handleChange} className={`${selectClass} pl-10`}>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Subjects */}
            <div className="space-y-1.5">
              <label className={labelClass}>Current Subjects (Comma separated)</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"><BookOpen className="w-4.5 h-4.5" /></span>
                <input type="text" name="subjects" value={form.subjects} onChange={handleChange} placeholder="Database Systems, AI, Web Dev" className={inputClass} required />
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-1.5">
              <label className={labelClass}>Phone Number</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"><Phone className="w-4.5 h-4.5" /></span>
                <input type="tel" name="phoneNumber" value={form.phoneNumber} onChange={handleChange} placeholder="+91 98765 43210" className={inputClass} required />
              </div>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className={labelClass}>Email Address</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"><Mail className="w-4.5 h-4.5" /></span>
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="alex@campus.edu" className={inputClass} required />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className={labelClass}>Password</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400"><Lock className="w-4.5 h-4.5" /></span>
                <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" className={inputClass} required />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold py-3.5 px-4 rounded-xl transition shadow-lg shadow-blue-600/20 active:scale-[0.98] cursor-pointer flex justify-center items-center gap-2"
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Creating Account...</>
              ) : (
                <><ArrowRight className="w-4.5 h-4.5" /> Create Account</>
              )}
            </button>
          </form>

          <div className="text-center pt-1">
            <p className="text-sm font-medium text-slate-500">
              Already have an account?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-700 font-bold transition">
                Log in here
              </Link>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
