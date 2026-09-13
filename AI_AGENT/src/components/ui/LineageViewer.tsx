import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Circular } from '../../types';
import { StatusBadge } from './StatusBadge';
import { 
  GitBranch, 
  ArrowDown, 
  Clock, 
  ShieldCheck, 
  AlertCircle, 
  FileText, 
  CheckCircle2, 
  Sparkles, 
  Building2, 
  AlertTriangle,
  ChevronRight,
  Zap,
  Info
} from 'lucide-react';
import { formatDate } from '../../lib/utils';

interface LineageViewerProps {
  currentCircular: Circular;
  allCirculars: Circular[];
  onSelectCircular?: (circ: Circular) => void;
}

export const LineageViewer: React.FC<LineageViewerProps> = ({ 
  currentCircular, 
  allCirculars,
  onSelectCircular 
}) => {
  const [selectedItem, setSelectedItem] = useState<Circular>(currentCircular);

  // Build the complete lineage chain sequentially (from v1.0 root -> v2.0 -> v3.0 current)
  const buildLineageChain = (startNode: Circular): Circular[] => {
    const chain: Circular[] = [];
    const visited = new Set<string>();

    // Step 1: Walk backwards to find root
    let root: Circular = startNode;
    while (root.supersedesRef || root.supersedesId) {
      const prev = allCirculars.find(c => c.refNo === root.supersedesRef || c.id === root.supersedesId);
      if (!prev || visited.has(prev.id)) break;
      visited.add(prev.id);
      root = prev;
    }

    // Step 2: Walk forwards from root
    visited.clear();
    let current: Circular | undefined = root;
    while (current && !visited.has(current.id)) {
      visited.add(current.id);
      chain.push(current);
      current = allCirculars.find(c => c.supersedesRef === current?.refNo || c.supersedesId === current?.id || current?.supersededByRef === c.refNo);
    }

    return chain.length > 0 ? chain : [startNode];
  };

  const lineageChain = buildLineageChain(currentCircular);
  const activeCurrent = lineageChain.find(c => c.status === 'Active') || lineageChain[lineageChain.length - 1];

  return (
    <div className="space-y-6">
      {/* ── Main Tree Header ────────────────────────────────────────────── */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-gradient-to-tr from-amber-500/20 via-indigo-500/20 to-sky-500/20 border border-amber-500/30 text-amber-400 shrink-0">
            <GitBranch className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-slate-100">Circular Lineage & Rule Evolution</h3>
              <span className="px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300 border border-indigo-500/30 text-[10px] font-mono font-bold">
                {lineageChain.length} Revisions in Chain
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Visual audit trail tracing policy changes, supersessions, and the currently active institutional rule.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="text-slate-400">Current Binding Rule:</span>
          <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            {activeCurrent.refNo}
          </span>
        </div>
      </div>

      {/* ── Two-Column Layout: Visual Tree (Left) + Details Panel (Right) ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* ── Visual Timeline Tree ────────────────────────────────────────── */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-slate-700 before:via-indigo-500 before:to-emerald-500">
            {lineageChain.map((item, index) => {
              const isSelected = selectedItem.id === item.id;
              const isActiveNode = item.status === 'Active';
              const isSuperseded = item.status === 'Superseded';

              return (
                <div key={item.id} className="relative flex flex-col">
                  {/* Node Connector Icon */}
                  <div
                    className={`absolute -left-6 sm:-left-8 top-3 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                      isActiveNode
                        ? 'bg-emerald-500 text-white ring-4 ring-emerald-500/20 scale-110 shadow-lg shadow-emerald-500/30'
                        : isSuperseded
                        ? 'bg-amber-600 text-white'
                        : 'bg-slate-700 text-slate-300'
                    }`}
                  >
                    {isActiveNode ? '✓' : index + 1}
                  </div>

                  {/* Node Card */}
                  <div
                    onClick={() => {
                      setSelectedItem(item);
                      onSelectCircular?.(item);
                    }}
                    className={`rounded-2xl p-4 transition-all cursor-pointer border ${
                      isSelected
                        ? 'bg-indigo-950/40 border-indigo-500 shadow-xl shadow-indigo-950/40 ring-2 ring-indigo-500/30'
                        : isActiveNode
                        ? 'bg-emerald-950/20 border-emerald-500/40 hover:border-emerald-500/80 shadow-md'
                        : 'glass-card border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    {/* Header line */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`font-mono text-xs font-black px-2 py-0.5 rounded ${
                          isActiveNode ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}>
                          {item.refNo}
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-300">
                          v{item.version}
                        </span>
                        {isActiveNode && (
                          <span className="text-[10px] uppercase font-black tracking-wider px-2 py-0.5 rounded-full bg-emerald-500 text-slate-950 flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-pulse" />
                            CURRENT / ACTIVE
                          </span>
                        )}
                      </div>

                      <StatusBadge status={item.status} size="sm" />
                    </div>

                    {/* Title */}
                    <h4 className={`text-sm font-bold transition-colors ${
                      isActiveNode ? 'text-slate-100' : 'text-slate-300'
                    }`}>
                      {item.title}
                    </h4>

                    {/* Reason for change snippet */}
                    {item.reasonForChange && (
                      <p className="text-xs text-slate-400 mt-2 bg-slate-900/60 p-2.5 rounded-xl border border-slate-800/80 font-sans leading-relaxed">
                        <strong className="text-indigo-400 font-semibold">Change Reason: </strong>
                        {item.reasonForChange}
                      </p>
                    )}

                    {/* Footer metadata */}
                    <div className="flex flex-wrap items-center gap-4 text-[11px] text-slate-400 mt-3 pt-2.5 border-t border-slate-800/60 font-mono">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        Effective: {formatDate(item.effectiveDate)}
                      </span>
                      {item.supersedesRef && (
                        <span className="text-amber-400 font-sans font-medium">
                          ← Supersedes {item.supersedesRef}
                        </span>
                      )}
                      {item.supersededByRef && (
                        <span className="text-rose-400 font-sans font-medium">
                          → Superseded by {item.supersededByRef}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Down connector arrow */}
                  {index < lineageChain.length - 1 && (
                    <div className="flex justify-center py-1 text-slate-600">
                      <ArrowDown className="w-4 h-4 animate-bounce" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Lineage Details Panel & Conflict Analyzer ───────────────────── */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Selected Node Details Card */}
          <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4 shadow-xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-indigo-400" />
                <span className="font-bold text-xs uppercase tracking-wider text-slate-200">
                  Lineage Node Inspector
                </span>
              </div>
              <StatusBadge status={selectedItem.status} size="sm" />
            </div>

            <div>
              <div className="font-mono text-xs text-indigo-400 font-bold">{selectedItem.refNo} (v{selectedItem.version})</div>
              <h3 className="text-base font-bold text-slate-100 mt-0.5">{selectedItem.title}</h3>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">{selectedItem.summary}</p>
            </div>

            {/* Metadata Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-slate-900/80 p-3 rounded-xl border border-slate-800">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Department</span>
                <span className="text-slate-200 font-sans font-medium">{selectedItem.issuingAuthority || 'Institutional Governance'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Effective Date</span>
                <span className="text-slate-200">{formatDate(selectedItem.effectiveDate)}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Supersedes</span>
                <span className="text-amber-400">{selectedItem.supersedesRef || 'None (Baseline)'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase block">Superseded By</span>
                <span className={selectedItem.supersededByRef ? 'text-rose-400' : 'text-emerald-400 font-bold'}>
                  {selectedItem.supersededByRef || 'None (Active Rule)'}
                </span>
              </div>
            </div>

            {/* Why is this the current rule? AI Explanation Card */}
            <div className="p-4 rounded-xl bg-gradient-to-br from-indigo-950/60 to-slate-900 border border-indigo-500/30 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
                <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
                <span>Why is this {selectedItem.status === 'Active' ? 'the Current Rule?' : 'a Superseded Rule?'}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                {selectedItem.whyCurrentExplanation || (
                  selectedItem.status === 'Active'
                    ? `This directive is current and legally binding. All institutional operations and compliance checks reference ${selectedItem.refNo}.`
                    : `This directive was replaced by ${selectedItem.supersededByRef || 'a newer version'} and should no longer be cited for operational decisions.`
                )}
              </p>
            </div>

            {/* Conflict Detection Warning if viewing superseded item */}
            {selectedItem.status === 'Superseded' && (
              <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/40 text-xs space-y-2 text-amber-200">
                <div className="flex items-center gap-1.5 font-bold text-amber-400">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>Potential Policy Conflict Detected</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] pt-1 border-t border-amber-500/20 font-mono">
                  <div>
                    <span className="text-slate-400 block">OLD RULE</span>
                    <strong className="text-amber-300">{selectedItem.refNo} (v{selectedItem.version})</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block">CURRENT RULE</span>
                    <strong className="text-emerald-300">{activeCurrent.refNo} (v{activeCurrent.version})</strong>
                  </div>
                </div>
                <p className="text-[11px] text-amber-200/90 font-sans pt-1">
                  <strong>Recommended Action:</strong> Enforce <strong>{activeCurrent.refNo}</strong> because it is the latest ratified circular.
                </p>
              </div>
            )}

            {/* Direct Link to Circular Page */}
            <div className="pt-2">
              <Link
                to={`/circulars/${selectedItem.id}`}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-600/30"
              >
                <span>View Full Circular Text</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
