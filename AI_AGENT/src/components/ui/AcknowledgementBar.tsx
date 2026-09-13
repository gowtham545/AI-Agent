import React from 'react';
import type { DepartmentAck } from '../../types';
import { Users, Send, CheckCircle2, AlertCircle } from 'lucide-react';

interface AcknowledgementBarProps {
  breakdown: DepartmentAck[];
  onSendNudge?: (department: string) => void;
}

export const AcknowledgementBar: React.FC<AcknowledgementBarProps> = ({ breakdown, onSendNudge }) => {
  return (
    <div className="space-y-4">
      {breakdown.map((item) => (
        <div key={item.department} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-slate-200">{item.department}</span>
              <span className="text-xs text-slate-400 font-mono">
                ({item.acknowledgedCount} / {item.totalAudience} staff)
              </span>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`text-xs font-mono font-bold ${
                  item.percentage >= 95
                    ? 'text-emerald-400'
                    : item.percentage >= 80
                    ? 'text-indigo-400'
                    : 'text-amber-400'
                }`}
              >
                {item.percentage}% Acknowledged
              </span>

              {item.percentage < 100 && onSendNudge && (
                <button
                  onClick={() => onSendNudge(item.department)}
                  className="px-2.5 py-1 rounded-md bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 text-xs font-medium border border-indigo-500/30 flex items-center gap-1 transition-colors"
                  title="Broadcast email & app nudge to pending recipients"
                >
                  <Send className="w-3 h-3" />
                  Nudge
                </button>
              )}
            </div>
          </div>

          <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                item.percentage >= 95
                  ? 'bg-emerald-500'
                  : item.percentage >= 80
                  ? 'bg-indigo-500'
                  : 'bg-amber-500'
              }`}
              style={{ width: `${item.percentage}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
