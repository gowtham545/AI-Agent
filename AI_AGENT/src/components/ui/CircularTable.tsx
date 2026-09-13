import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Circular } from '../../types';
import { StatusBadge } from './StatusBadge';
import { PriorityBadge } from './PriorityBadge';
import { formatDate } from '../../lib/utils';
import { 
  ArrowUpDown, 
  ChevronRight, 
  FileText, 
  Users, 
  ExternalLink,
  GitBranch,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

interface CircularTableProps {
  circulars: Circular[];
  onSelectCircular?: (circular: Circular) => void;
}

export const CircularTable: React.FC<CircularTableProps> = ({ circulars, onSelectCircular }) => {
  const [sortField, setSortField] = useState<keyof Circular>('effectiveDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (field: keyof Circular) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const sortedCirculars = [...circulars].sort((a, b) => {
    let aVal = a[sortField];
    let bVal = b[sortField];

    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return sortDirection === 'asc'
        ? aVal.localeCompare(bVal)
        : bVal.localeCompare(aVal);
    }
    return 0;
  });

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-slate-800 bg-slate-950/60 backdrop-blur">
      <table className="w-full text-left text-xs text-slate-300">
        <thead className="bg-slate-900/90 uppercase font-mono text-[11px] text-slate-400 border-b border-slate-800">
          <tr>
            <th className="py-3.5 px-4 font-semibold">
              <button
                onClick={() => handleSort('refNo')}
                className="flex items-center gap-1 hover:text-slate-200 transition-colors"
              >
                Ref No <ArrowUpDown className="w-3 h-3 ml-0.5" />
              </button>
            </th>
            <th className="py-3.5 px-4 font-semibold">Title & Category</th>
            <th className="py-3.5 px-4 font-semibold">Status</th>
            <th className="py-3.5 px-4 font-semibold">Priority</th>
            <th className="py-3.5 px-4 font-semibold">Issuing Authority</th>
            <th className="py-3.5 px-4 font-semibold text-center">Ack Rate</th>
            <th className="py-3.5 px-4 font-semibold">
              <button
                onClick={() => handleSort('effectiveDate')}
                className="flex items-center gap-1 hover:text-slate-200 transition-colors"
              >
                Effective Date <ArrowUpDown className="w-3 h-3 ml-0.5" />
              </button>
            </th>
            <th className="py-3.5 px-4 font-semibold text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60">
          {sortedCirculars.map((circ) => (
            <tr
              key={circ.id}
              className="hover:bg-slate-900/50 transition-colors group cursor-pointer"
              onClick={() => onSelectCircular?.(circ)}
            >
              <td className="py-3.5 px-4 font-mono font-medium text-indigo-400 whitespace-nowrap">
                <div className="flex items-center gap-1.5">
                  {circ.supersedesId && (
                    <span title={`Supersedes ${circ.supersedesRef}`}>
                      <GitBranch className="w-3.5 h-3.5 text-amber-400" />
                    </span>
                  )}
                  {circ.refNo}
                </div>
              </td>
              <td className="py-3.5 px-4">
                <Link
                  to={`/circulars/${circ.id}`}
                  className="font-medium text-slate-100 group-hover:text-indigo-400 transition-colors line-clamp-1 block"
                >
                  {circ.title}
                </Link>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700/50">
                    {circ.category}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">v{circ.version}</span>
                </div>
              </td>
              <td className="py-3.5 px-4 whitespace-nowrap">
                <StatusBadge status={circ.status} size="sm" />
              </td>
              <td className="py-3.5 px-4 whitespace-nowrap">
                <PriorityBadge priority={circ.priority} showIcon={true} />
              </td>
              <td className="py-3.5 px-4 text-slate-400 line-clamp-1 max-w-[200px]">
                {circ.issuingAuthority}
              </td>
              <td className="py-3.5 px-4 text-center whitespace-nowrap">
                <div className="inline-flex items-center gap-1.5">
                  <div className="w-16 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className={`h-full rounded-full ${
                        (circ.affectedAudience?.ackPercentage ?? 0) >= 90
                          ? 'bg-emerald-500'
                          : (circ.affectedAudience?.ackPercentage ?? 0) >= 70
                          ? 'bg-indigo-500'
                          : 'bg-amber-500'
                      }`}
                      style={{ width: `${circ.affectedAudience?.ackPercentage ?? 0}%` }}
                    />
                  </div>
                  <span className="font-semibold text-slate-200">
                    {circ.affectedAudience?.ackPercentage ?? 0}%
                  </span>
                </div>
              </td>
              <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap font-mono text-[11px]">
                {formatDate(circ.effectiveDate)}
              </td>
              <td className="py-3.5 px-4 text-right whitespace-nowrap">
                <Link
                  to={`/circulars/${circ.id}`}
                  onClick={(e) => e.stopPropagation()}
                  className="p-1.5 rounded hover:bg-indigo-500/20 text-indigo-400 hover:text-indigo-300 inline-flex items-center gap-1 transition-colors"
                >
                  View <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </td>
            </tr>
          ))}
          {sortedCirculars.length === 0 && (
            <tr>
              <td colSpan={8} className="py-8 text-center text-slate-500">
                <div className="flex flex-col items-center justify-center gap-2">
                  <FileText className="w-8 h-8 text-slate-600" />
                  <p className="text-sm">No circulars match your current filter criteria.</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};
