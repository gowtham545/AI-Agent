import React from 'react';
import type { ActionItem } from '../../types';
import { formatDate } from '../../lib/utils';
import { CheckCircle2, Clock, AlertCircle, ShieldAlert, UserCheck, ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ActionItemCardProps {
  action: ActionItem;
  onToggleStatus?: (id: string) => void;
}

export const ActionItemCard: React.FC<ActionItemCardProps> = ({ action, onToggleStatus }) => {
  const getStatusBadge = (status: ActionItem['status']) => {
    switch (status) {
      case 'Completed':
        return { color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30', icon: CheckCircle2 };
      case 'In Progress':
        return { color: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30', icon: Clock };
      case 'Overdue':
        return { color: 'bg-rose-500/10 text-rose-400 border-rose-500/30', icon: ShieldAlert };
      case 'Under Review':
        return { color: 'bg-amber-500/10 text-amber-400 border-amber-500/30', icon: AlertCircle };
      default:
        return { color: 'bg-slate-800 text-slate-400 border-slate-700', icon: Clock };
    }
  };

  const statusInfo = getStatusBadge(action.status);
  const StatusIcon = statusInfo.icon;

  return (
    <div className="glass-card rounded-xl p-4 border border-slate-800 flex flex-col justify-between hover:border-indigo-500/30 transition-all">
      <div>
        <div className="flex items-center justify-between gap-2 mb-2">
          <Link
            to={`/circulars/${action.circularId}`}
            className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-900 text-indigo-300 border border-indigo-500/20 hover:underline flex items-center gap-1"
          >
            {action.circularRef}
            <ArrowUpRight className="w-3 h-3" />
          </Link>

          <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${statusInfo.color}`}>
            <StatusIcon className="w-3 h-3" />
            {action.status}
          </span>
        </div>

        <h4 className="text-sm font-semibold text-slate-100 mb-2 leading-snug">
          {action.title}
        </h4>

        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mb-4">
          <span className="px-2 py-0.5 rounded bg-slate-800/80 text-slate-300">
            {action.targetDepartment}
          </span>
          <span className="flex items-center gap-1 text-slate-400">
            <UserCheck className="w-3.5 h-3.5 text-slate-500" />
            {action.assigneeRole}
          </span>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
        <span className={`font-mono ${action.status === 'Overdue' ? 'text-rose-400 font-semibold' : 'text-slate-400'}`}>
          Due: {formatDate(action.dueDate)}
        </span>

        {onToggleStatus && (
          <button
            onClick={() => onToggleStatus(action.id)}
            className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
              action.status === 'Completed'
                ? 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                : 'bg-indigo-600 hover:bg-indigo-500 text-white'
            }`}
          >
            {action.status === 'Completed' ? 'Reopen Task' : 'Mark Completed'}
          </button>
        )}
      </div>
    </div>
  );
};
