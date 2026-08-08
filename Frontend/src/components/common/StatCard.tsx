import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  change?: string;
  isPositive?: boolean;
  icon: LucideIcon;
  badge?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  change,
  isPositive = true,
  icon: Icon,
  badge
}) => {
  return (
    <div className="relative overflow-hidden rounded-xl border border-zinc-800 bg-[#121215] p-5 shadow-xs transition-all duration-200 hover:border-zinc-700 group">
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <span className="text-[9px] font-mono font-bold text-zinc-500 uppercase tracking-widest">{title}</span>
          <div className="flex items-baseline gap-2">
            <h3 className="text-2xl font-extrabold text-zinc-100 tracking-tight">{value}</h3>
            {badge && (
              <span className="px-1.5 py-0.5 text-[8px] font-mono uppercase font-bold bg-zinc-900 text-zinc-400 rounded border border-zinc-800">
                {badge}
              </span>
            )}
          </div>
        </div>

        <div className="p-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-200 group-hover:bg-zinc-800 transition-colors">
          <Icon className="w-4 h-4" />
        </div>
      </div>

      {(subtitle || change) && (
        <div className="mt-4 pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs">
          {subtitle && <span className="text-zinc-500 truncate text-[11px] font-medium">{subtitle}</span>}
          {change && (
            <div className={`flex items-center gap-1 text-[11px] font-mono ${isPositive ? 'text-zinc-300 font-semibold' : 'text-zinc-500'}`}>
              {isPositive ? <TrendingUp className="w-3 h-3 text-zinc-300" /> : <TrendingDown className="w-3 h-3 text-zinc-500" />}
              <span>{change}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
