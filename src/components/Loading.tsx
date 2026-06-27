import React from 'react';

interface LoadingProps {
  type?: 'spinner' | 'skeleton' | 'card';
  count?: number;
}

export default function Loading({ type = 'spinner', count = 3 }: LoadingProps) {
  if (type === 'skeleton') {
    return (
      <div className="space-y-4 animate-pulse">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl p-5 border border-slate-100 shadow-xs space-y-3">
            <div className="h-4 bg-slate-200 rounded-sm w-1/3"></div>
            <div className="h-3 bg-slate-200 rounded-sm w-3/4"></div>
            <div className="flex gap-2">
              <div className="h-5 bg-slate-200 rounded-full w-16"></div>
              <div className="h-5 bg-slate-200 rounded-full w-24"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'card') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-xs space-y-4 animate-pulse">
            <div className="flex justify-between items-center">
              <div className="h-6 bg-slate-200 rounded-sm w-2/3"></div>
              <div className="h-5 bg-slate-200 rounded-full w-12"></div>
            </div>
            <div className="space-y-2">
              <div className="h-3 bg-slate-200 rounded-sm w-full"></div>
              <div className="h-3 bg-slate-200 rounded-sm w-5/6"></div>
            </div>
            <div className="pt-4 border-t border-slate-50 flex justify-between items-center">
              <div className="h-4 bg-slate-200 rounded-sm w-24"></div>
              <div className="h-8 bg-slate-200 rounded-lg w-20"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      <div className="relative flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-slate-100 border-t-blue-600 animate-spin"></div>
        <div className="absolute w-6 h-6 rounded-full border-4 border-blue-100 border-b-blue-600 animate-spin duration-300 reverse-spin"></div>
      </div>
      <p className="mt-4 text-sm font-medium text-slate-500 animate-pulse">Loading data, please wait...</p>
    </div>
  );
}
