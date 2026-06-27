import React, { useState } from 'react';
import { User, Mail, Phone, BookOpen, GraduationCap, Calendar, Lock, Eye, EyeOff, CheckSquare, Award } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Profile() {
  const userString = localStorage.getItem('campusflow_user');
  const user = userString ? JSON.parse(userString) : {
    fullName: 'John Doe',
    branch: 'Computer Science & Engineering',
    year: '3rd Year',
    subjects: 'Database Systems, Artificial Intelligence, Web Dev',
    phoneNumber: '+1234567890',
    email: 'demo@campus.edu',
    password: 'password'
  };

  const [showPassword, setShowPassword] = useState(false);
  const tasks = JSON.parse(localStorage.getItem('campusflow_mock_tasks') || '[]');
  const completedTasksCount = tasks.filter((t: any) => t.status === 'completed').length;
  const pendingTasksCount = tasks.filter((t: any) => t.status !== 'completed').length;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Banner / Card Header */}
      <div className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center gap-6 relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full blur-xl pointer-events-none -mr-8 -mt-8"></div>
        
        {/* Avatar */}
        <div className="w-24 h-24 rounded-2xl bg-blue-600 border border-blue-500 text-white font-black text-3xl flex items-center justify-center shadow-md shrink-0 relative">
          {user.fullName ? user.fullName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase() : 'ST'}
        </div>

        {/* Basic Details */}
        <div className="space-y-1.5 text-center sm:text-left flex-1">
          <h2 className="text-2xl font-black text-slate-800 tracking-tight">{user.fullName}</h2>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-3 gap-y-1 text-sm font-medium text-slate-500">
            <span className="flex items-center gap-1">
              <GraduationCap className="w-4 h-4 text-slate-400" />
              {user.branch}
            </span>
            <span className="hidden sm:inline text-slate-300">•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-4 h-4 text-slate-400" />
              {user.year}
            </span>
          </div>
        </div>

        {/* Quick stat widgets */}
        <div className="flex gap-4 shrink-0">
          <div className="bg-blue-50/50 border border-blue-100 rounded-2xl px-4 py-3 text-center min-w-[100px]">
            <span className="text-2xl font-black text-blue-600 block">{completedTasksCount}</span>
            <span className="text-3xs font-extrabold uppercase tracking-widest text-slate-400">Completed</span>
          </div>
          <div className="bg-amber-50/50 border border-amber-100 rounded-2xl px-4 py-3 text-center min-w-[100px]">
            <span className="text-2xl font-black text-amber-600 block">{pendingTasksCount}</span>
            <span className="text-3xs font-extrabold uppercase tracking-widest text-slate-400">Pending</span>
          </div>
        </div>
      </div>

      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left column - Info Details */}
        <div className="md:col-span-2 bg-white rounded-3xl border border-slate-100 p-6 shadow-2xs space-y-6">
          <h3 className="text-base font-extrabold text-slate-800 tracking-tight pb-3 border-b border-slate-100">Student Profile Information</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* Full Name */}
            <div className="space-y-1">
              <span className="text-3xs font-bold uppercase tracking-wider text-slate-400 block">Full Name</span>
              <div className="flex items-center gap-2.5 text-sm font-bold text-slate-700">
                <User className="w-4 h-4 text-slate-400 shrink-0" />
                {user.fullName}
              </div>
            </div>

            {/* Email Address */}
            <div className="space-y-1">
              <span className="text-3xs font-bold uppercase tracking-wider text-slate-400 block">Email Address</span>
              <div className="flex items-center gap-2.5 text-sm font-bold text-slate-700">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                {user.email}
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-1">
              <span className="text-3xs font-bold uppercase tracking-wider text-slate-400 block">Phone Number</span>
              <div className="flex items-center gap-2.5 text-sm font-bold text-slate-700">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                {user.phoneNumber}
              </div>
            </div>

            {/* Password Masked */}
            <div className="space-y-1">
              <span className="text-3xs font-bold uppercase tracking-wider text-slate-400 block">Account Password</span>
              <div className="flex items-center justify-between text-sm font-bold text-slate-700 max-w-[200px]">
                <div className="flex items-center gap-2.5">
                  <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>{showPassword ? user.password : '••••••••'}</span>
                </div>
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-slate-400 hover:text-slate-600 transition cursor-pointer ml-2"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

          </div>

          {/* Subjects enrolled list */}
          <div className="space-y-2 pt-4 border-t border-slate-50">
            <span className="text-3xs font-bold uppercase tracking-wider text-slate-400 block flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              Enrolled Academic Subjects
            </span>
            <div className="flex flex-wrap gap-2 pt-1">
              {user.subjects ? user.subjects.split(',').map((subj: string, idx: number) => (
                <span key={idx} className="inline-flex items-center px-3 py-1 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                  {subj.trim()}
                </span>
              )) : (
                <span className="text-xs font-bold text-slate-400">No subjects registered yet.</span>
              )}
            </div>
          </div>
        </div>

        {/* Right column - Achievements / Badges */}
        <div className="bg-white rounded-3xl border border-slate-100 p-6 shadow-2xs space-y-4">
          <h3 className="text-base font-extrabold text-slate-800 tracking-tight flex items-center gap-2 pb-3 border-b border-slate-100">
            <Award className="text-blue-600 w-5 h-5" />
            Achievements
          </h3>

          <div className="space-y-4">
            
            {/* Badge 1 */}
            <div className="flex gap-3 items-center p-3 rounded-2xl bg-blue-50/40 border border-blue-50/60">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <CheckSquare className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-700">Tasks Champion</h4>
                <p className="text-3xs text-slate-400 font-semibold uppercase tracking-wider">Logged first completed task</p>
              </div>
            </div>

            {/* Badge 2 */}
            <div className="flex gap-3 items-center p-3 rounded-2xl bg-emerald-50/40 border border-emerald-50/60">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-700">Hackathon Ready</h4>
                <p className="text-3xs text-slate-400 font-semibold uppercase tracking-wider">Created CampusFlow account</p>
              </div>
            </div>

          </div>
        </div>

      </div>

    </div>
  );
}
