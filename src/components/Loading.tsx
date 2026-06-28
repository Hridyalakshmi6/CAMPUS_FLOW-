import React from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

// ─── Props ────────────────────────────────────────────────────────────────────

interface LoadingProps {
  type?: 'spinner' | 'card' | 'dashboard' | 'profile' | 'list' | 'settings' | 'ai';
  count?: number;
}

// ─── Skeleton primitives ──────────────────────────────────────────────────────

const Skel = ({ className }: { className: string }) => (
  <div className={`skeleton ${className}`} />
);

// ─── Main Component ───────────────────────────────────────────────────────────

export default function Loading({ type = 'spinner', count = 3 }: LoadingProps) {

  // Settings skeleton
  if (type === 'settings') {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="space-y-2">
          <Skel className="h-8 w-1/3 rounded-xl" />
          <Skel className="h-4 w-1/2 rounded-md" />
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-50 dark:border-slate-800">
              <Skel className="w-5 h-5 rounded-md" />
              <Skel className="h-4 w-1/4 rounded-md" />
            </div>
            <div className="space-y-3">
              <Skel className="h-10 w-full rounded-xl" />
              <Skel className="h-10 w-full rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // AI flashcard/summary skeleton
  if (type === 'ai') {
    return (
      <div className="max-w-xl mx-auto space-y-6">
        <div className="space-y-2">
          <Skel className="h-8 w-1/3 rounded-xl" />
          <Skel className="h-4 w-1/2 rounded-md" />
        </div>
        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-100 dark:border-slate-800 flex flex-col items-center justify-center min-h-[320px] space-y-4">
          <Skel className="w-12 h-12 rounded-full" />
          <Skel className="h-6 w-3/4 rounded-xl" />
          <Skel className="h-4 w-1/2 rounded-lg" />
          <div className="w-full pt-6 border-t border-slate-50 dark:border-slate-800 flex justify-between items-center">
            <Skel className="h-8 w-12 rounded-xl" />
            <Skel className="h-8 w-24 rounded-xl" />
            <Skel className="h-8 w-12 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  // Card grid skeleton (Tasks page)
  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl p-5 border border-slate-100 dark:border-slate-800 space-y-4">
            <div className="flex justify-between items-start">
              <Skel className="h-4 w-1/2" />
              <Skel className="h-5 w-16 rounded-full" />
            </div>
            <Skel className="h-3 w-1/3" />
            <div className="space-y-2">
              <Skel className="h-3 w-full" />
              <Skel className="h-3 w-4/5" />
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-slate-50 dark:border-slate-800">
              <Skel className="h-3 w-20" />
              <Skel className="h-8 w-20 rounded-xl" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Dashboard skeleton
  if (type === 'dashboard') {
    return (
      <div className="space-y-6">
        {/* Hero banner */}
        <Skel className="h-36 w-full rounded-3xl" />
        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => <Skel key={i} className="h-28 rounded-2xl" />)}
        </div>
        {/* Bento grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <div className="lg:col-span-2 space-y-5">
            <Skel className="h-28 rounded-2xl" />
            <Skel className="h-52 rounded-2xl" />
          </div>
          <div className="space-y-5">
            <Skel className="h-44 rounded-2xl" />
            <Skel className="h-36 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  // Profile skeleton
  if (type === 'profile') {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <Skel className="h-40 rounded-3xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">
            <Skel className="h-8 w-1/3 rounded-xl" />
            <div className="grid grid-cols-2 gap-4">
              {[1,2,3,4].map(i => <Skel key={i} className="h-14 rounded-xl" />)}
            </div>
          </div>
          <Skel className="h-64 rounded-2xl" />
        </div>
      </div>
    );
  }

  // List skeleton (Notifications)
  if (type === 'list') {
    return (
      <div className="space-y-3">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 flex items-start gap-4">
            <Skel className="w-10 h-10 rounded-xl shrink-0" />
            <div className="flex-1 space-y-2">
              <Skel className="h-4 w-2/3" />
              <Skel className="h-3 w-full" />
              <Skel className="h-3 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Default spinner
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      <div className="relative">
        <div className="w-14 h-14 rounded-full border-4 border-slate-100 dark:border-slate-800 border-t-blue-600 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full border-3 border-transparent border-b-blue-300 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.6s' }} />
        </div>
      </div>
      <p className="mt-5 text-sm font-semibold text-slate-500 dark:text-slate-400 animate-pulse">
        Loading…
      </p>
    </div>
  );
}

// ─── Error State Component ────────────────────────────────────────────────────

export function ErrorState({
  title = 'Something went wrong',
  message,
  onRetry,
}: {
  title?: string;
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-5 text-center px-4">
      <div className="p-4 bg-red-50 dark:bg-red-900/20 text-red-500 rounded-full">
        <AlertTriangle className="w-10 h-10" />
      </div>
      <div className="space-y-1.5">
        <h3 className="text-lg font-black text-slate-800 dark:text-slate-100">{title}</h3>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400 max-w-sm">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition shadow-md cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          Retry
        </button>
      )}
    </div>
  );
}
