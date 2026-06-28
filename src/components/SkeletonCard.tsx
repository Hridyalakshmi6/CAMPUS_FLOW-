import React from 'react';

// Animated shimmer skeleton for cards, rows, and list items
// Usage:
//   <SkeletonCard />                 - single dashboard-style card
//   <SkeletonCard variant="row" />   - horizontal list row
//   <SkeletonCard count={3} />       - render N skeletons

interface SkeletonCardProps {
  variant?: 'card' | 'row' | 'stat';
  count?: number;
}

function SingleSkeleton({ variant = 'card' }: { variant: 'card' | 'row' | 'stat' }) {
  if (variant === 'row') {
    return (
      <div className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-100 animate-pulse">
        <div className="w-10 h-10 bg-slate-100 rounded-xl shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="h-3 bg-slate-100 rounded-full w-3/4" />
          <div className="h-2 bg-slate-100 rounded-full w-1/2" />
        </div>
        <div className="w-16 h-6 bg-slate-100 rounded-full" />
      </div>
    );
  }

  if (variant === 'stat') {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 p-5 animate-pulse space-y-3">
        <div className="flex justify-between items-start">
          <div className="w-10 h-10 bg-slate-100 rounded-xl" />
          <div className="w-16 h-6 bg-slate-100 rounded-full" />
        </div>
        <div className="h-7 bg-slate-100 rounded-lg w-1/2" />
        <div className="h-3 bg-slate-100 rounded-full w-3/4" />
      </div>
    );
  }

  // default: card
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 animate-pulse space-y-4">
      <div className="flex justify-between items-center">
        <div className="w-10 h-10 bg-slate-100 rounded-xl" />
        <div className="w-20 h-5 bg-slate-100 rounded-full" />
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-slate-100 rounded-full w-3/4" />
        <div className="h-3 bg-slate-100 rounded-full w-full" />
        <div className="h-3 bg-slate-100 rounded-full w-5/6" />
      </div>
      <div className="h-8 bg-slate-100 rounded-xl w-full" />
    </div>
  );
}

export default function SkeletonCard({ variant = 'card', count = 1 }: SkeletonCardProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <SingleSkeleton key={i} variant={variant} />
      ))}
    </>
  );
}
