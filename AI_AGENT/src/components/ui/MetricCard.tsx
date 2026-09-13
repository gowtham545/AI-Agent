import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  subtitle?: string;
  icon: LucideIcon;
  iconBgColor?: string;
  iconColor?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  change,
  changeType = 'positive',
  subtitle,
  icon: Icon,
  iconBgColor = 'bg-indigo-500/10',
  iconColor = 'text-indigo-400',
}) => {
  return (
    <div className="glass-card rounded-xl p-5 relative overflow-hidden group">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</p>
          <h3 className="text-2xl font-bold text-slate-100 mt-1.5 tracking-tight">{value}</h3>
          
          {(change || subtitle) && (
            <div className="flex items-center gap-1.5 mt-2">
              {change && (
                <span
                  className={`inline-flex items-center text-xs font-semibold ${
                    changeType === 'positive'
                      ? 'text-emerald-400'
                      : changeType === 'negative'
                      ? 'text-rose-400'
                      : 'text-slate-400'
                  }`}
                >
                  {changeType === 'positive' ? (
                    <TrendingUp className="w-3 h-3 mr-0.5" />
                  ) : changeType === 'negative' ? (
                    <TrendingDown className="w-3 h-3 mr-0.5" />
                  ) : null}
                  {change}
                </span>
              )}
              {subtitle && (
                <span className="text-xs text-slate-400">{subtitle}</span>
              )}
            </div>
          )}
        </div>

        <div className={`p-3 rounded-lg ${iconBgColor} ${iconColor} border border-white/5 transition-transform group-hover:scale-110`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      
      {/* Subtle background glow effect */}
      <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-indigo-500/5 rounded-full blur-2xl group-hover:bg-indigo-500/10 transition-all pointer-events-none" />
    </div>
  );
};
