import React from 'react';
import { AlertTriangle, RefreshCw, WifiOff } from 'lucide-react';

// Inline error state shown inside a page section (non-boundary)
// Usage:
//   <PageError message="Failed to load tasks" onRetry={fetchTasks} />
//   <PageError message="No connection" type="network" />

interface PageErrorProps {
  message?: string;
  onRetry?: () => void;
  type?: 'generic' | 'network' | 'auth';
}

export default function PageError({
  message = 'Something went wrong. Please try again.',
  onRetry,
  type = 'generic',
}: PageErrorProps) {
  const Icon = type === 'network' ? WifiOff : AlertTriangle;
  const iconBg = type === 'network' ? 'bg-orange-50 text-orange-500' : 'bg-red-50 text-red-500';

  return (
    <div className="flex flex-col items-center justify-center min-h-[40vh] space-y-5 text-center px-4 py-12">
      <div className={`p-4 ${iconBg} rounded-full`}>
        <Icon className="w-10 h-10" />
      </div>
      <div className="space-y-1.5">
        <h3 className="text-lg font-black text-slate-800">
          {type === 'network' ? 'Connection Problem' : 'Unable to Load Data'}
        </h3>
        <p className="text-sm font-medium text-slate-500 max-w-sm">{message}</p>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition shadow-md cursor-pointer active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  );
}
