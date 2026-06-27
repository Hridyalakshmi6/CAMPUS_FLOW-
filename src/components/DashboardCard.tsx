import React from 'react';

interface DashboardCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: React.ReactNode;
  color?: 'blue' | 'cyan' | 'emerald' | 'amber';
  onClick?: () => void;
}

export default function DashboardCard({ title, value, description, icon, color = 'blue', onClick }: DashboardCardProps) {
  const getColorClasses = () => {
    switch (color) {
      case 'cyan':
        return {
          bg: 'bg-cyan-50/50 hover:bg-cyan-50 border-cyan-100',
          iconBg: 'bg-cyan-500 text-white',
          text: 'text-cyan-600',
        };
      case 'emerald':
        return {
          bg: 'bg-emerald-50/50 hover:bg-emerald-50 border-emerald-100',
          iconBg: 'bg-emerald-500 text-white',
          text: 'text-emerald-600',
        };
      case 'amber':
        return {
          bg: 'bg-amber-50/50 hover:bg-amber-50 border-amber-100',
          iconBg: 'bg-amber-500 text-white',
          text: 'text-amber-600',
        };
      default:
        return {
          bg: 'bg-blue-50/50 hover:bg-blue-50 border-blue-100',
          iconBg: 'bg-blue-600 text-white',
          text: 'text-blue-600',
        };
    }
  };

  const classes = getColorClasses();

  return (
    <div
      onClick={onClick}
      className={`p-6 rounded-2xl border transition-all duration-300 shadow-2xs ${classes.bg} ${
        onClick ? 'cursor-pointer transform hover:-translate-y-1 hover:shadow-xs active:scale-98' : ''
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
          <h3 className="text-3xl font-black text-slate-800 tracking-tight">{value}</h3>
        </div>
        <div className={`p-3 rounded-xl ${classes.iconBg} shadow-xs`}>
          {icon}
        </div>
      </div>
      <p className="mt-4 text-xs font-medium text-slate-500 leading-normal">{description}</p>
    </div>
  );
}
