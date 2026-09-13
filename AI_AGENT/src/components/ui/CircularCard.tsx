import React from 'react';
import { Link } from 'react-router-dom';
import type { Circular } from '../../types';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { FileText, Users, Calendar, ArrowRight, Sparkles, CheckCircle2 } from 'lucide-react';
import { formatDate } from '../../lib/utils';

interface CircularCardProps {
  circular: Circular;
  onQuickView?: (circular: Circular) => void;
}

export const CircularCard: React.FC<CircularCardProps> = ({ circular, onQuickView }) => {
  return (
    <div className="glass-card rounded-xl p-5 flex flex-col justify-between relative group border border-slate-800 hover:border-indigo-500/40">
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-800 text-indigo-300 border border-indigo-500/20">
            {circular.refNo}
          </span>
          <div className="flex items-center gap-2">
            <PriorityBadge priority={circular.priority} showIcon={false} />
            <StatusBadge status={circular.status} size="sm" />
          </div>
        </div>

        <Link
          to={`/circulars/${circular.id}`}
          className="text-base font-semibold text-slate-100 hover:text-indigo-400 transition-colors line-clamp-2 mb-2 block"
        >
          {circular.title}
        </Link>

        <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
          {circular.summary}
        </p>

        {/* AI Highlight Pill */}
        {circular.aiExecutiveSummary && (
          <div className="mb-4 p-2.5 rounded-lg bg-indigo-950/40 border border-indigo-500/20 text-xs text-indigo-200/90 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
            <p className="line-clamp-2">{circular.aiExecutiveSummary}</p>
          </div>
        )}
      </div>

      <div>
        {/* Department Tags */}
        <div className="flex flex-wrap gap-1 mb-4">
          <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700/50">
            {circular.category}
          </span>
          {(circular.affectedAudience?.departments || []).slice(0, 2).map((dept, idx) => (
            <span key={idx} className="text-[11px] px-2 py-0.5 rounded bg-slate-900/60 text-slate-400">
              {dept}
            </span>
          ))}
          {(circular.affectedAudience?.departments || []).length > 2 && (
            <span className="text-[11px] px-1.5 py-0.5 rounded bg-slate-900/60 text-slate-500">
              +{(circular.affectedAudience?.departments || []).length - 2}
            </span>
          )}
        </div>

        {/* Acknowledgement Progress */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="text-slate-400 flex items-center gap-1">
              <Users className="w-3.5 h-3.5" /> Ack Rate
            </span>
            <span className="font-semibold text-slate-200">
              {circular.affectedAudience?.ackPercentage ?? 0}%
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                (circular.affectedAudience?.ackPercentage ?? 0) >= 90
                  ? 'bg-emerald-500'
                  : (circular.affectedAudience?.ackPercentage ?? 0) >= 70
                  ? 'bg-indigo-500'
                  : 'bg-amber-500'
              }`}
              style={{ width: `${circular.affectedAudience?.ackPercentage ?? 0}%` }}
            />
          </div>
        </div>

        <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-500" />
            {formatDate(circular.effectiveDate)}
          </span>

          <div className="flex items-center gap-2">
            {onQuickView && (
              <button
                onClick={() => onQuickView(circular)}
                className="p-1.5 rounded hover:bg-slate-800 text-slate-400 hover:text-slate-200 transition-colors"
                title="Quick View"
              >
                <FileText className="w-4 h-4" />
              </button>
            )}
            <Link
              to={`/circulars/${circular.id}`}
              className="inline-flex items-center gap-1 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors group-hover:translate-x-0.5 transition-transform"
            >
              Details
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
