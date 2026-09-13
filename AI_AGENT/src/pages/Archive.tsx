import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDatabase } from '../context/DatabaseContext';
import { useAuth } from '../context/AuthContext';
import { LineageViewer } from '../components/ui/LineageViewer';
import { StatusBadge } from '../components/ui/StatusBadge';
import { PriorityBadge } from '../components/ui/PriorityBadge';
import type { Circular } from '../types';
import {
  Archive as ArchiveIcon,
  Search,
  GitBranch,
  ListTodo,
  X,
  ChevronDown,
  RotateCcw,
  Filter,
  FileText,
  Calendar,
  Building2,
  CheckCircle2,
  AlertCircle,
  Clock,
  ExternalLink,
  ChevronRight,
  Eye,
  Layers,
  Tag,
  ArrowRight,
  Info,
  Users,
  Sparkles
} from 'lucide-react';

// ─── Status Color Helpers ─────────────────────────────────────────────────────
const statusBadgeClass = (status: string) => {
  switch (status) {
    case 'Active':       return 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30';
    case 'Superseded':   return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
    case 'Under Review': return 'bg-sky-500/20 text-sky-400 border-sky-500/30';
    case 'Draft':        return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
    case 'Expired':      return 'bg-rose-500/20 text-rose-400 border-rose-500/30';
    default:             return 'bg-slate-500/20 text-slate-400 border-slate-500/30';
  }
};

const priorityDotClass = (priority: string) => {
  switch (priority) {
    case 'Critical': return 'bg-rose-500';
    case 'High':     return 'bg-amber-500';
    case 'Medium':   return 'bg-sky-400';
    case 'Low':      return 'bg-slate-400';
    default:         return 'bg-slate-500';
  }
};

export const Archive: React.FC = () => {
  const navigate = useNavigate();
  const { circulars, actions } = useDatabase();
  const { currentUser } = useAuth();

  // ── Department options derived from data ─────────────────────────────────────
  const DEPT_OPTIONS = ['All', ...Array.from(new Set(circulars.flatMap(c => c.affectedAudience?.departments || [])))];
  const STATUS_OPTIONS = ['All', 'Active', 'Superseded', 'Under Review', 'Draft', 'Expired'];
  const PRIORITY_OPTIONS = ['All', 'Critical', 'High', 'Medium', 'Low'];
  const CATEGORY_OPTIONS = ['All', ...Array.from(new Set(circulars.map(c => c.category)))];

  // ── View Tabs ──────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<'search' | 'lineage'>('search');

  // ── Search & Filters ───────────────────────────────────────────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // ── Detail Panel ───────────────────────────────────────────────────────────
  const [selectedCircular, setSelectedCircular] = useState<Circular | null>(null);

  // ── Lineage Tab ────────────────────────────────────────────────────────────
  const [lineageRoot, setLineageRoot] = useState<Circular>(
    circulars.find(c => c.refNo === 'CIR-2026-052') || circulars[0]
  );
  const [lineageModal, setLineageModal] = useState<Circular | null>(null);

  // ── Filtered results ───────────────────────────────────────────────────────
  const filteredCirculars = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return circulars.filter(c => {
      const matchSearch = !q ||
        c.refNo.toLowerCase().includes(q) ||
        c.title.toLowerCase().includes(q) ||
        c.summary.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        (c.affectedAudience?.departments || []).some(d => d.toLowerCase().includes(q)) ||
        (c.tags || []).some(t => t.toLowerCase().includes(q));

      const matchDept = deptFilter === 'All' ||
        (c.affectedAudience?.departments || []).some(d => d === deptFilter);

      const matchStatus = statusFilter === 'All' || c.status === statusFilter;
      const matchPriority = priorityFilter === 'All' || c.priority === priorityFilter;
      const matchCategory = categoryFilter === 'All' || c.category === categoryFilter;

      const matchDateFrom = !dateFrom || c.effectiveDate >= dateFrom;
      const matchDateTo = !dateTo || c.effectiveDate <= dateTo;

      return matchSearch && matchDept && matchStatus && matchPriority && matchCategory && matchDateFrom && matchDateTo;
    });
  }, [circulars, searchQuery, deptFilter, statusFilter, priorityFilter, categoryFilter, dateFrom, dateTo]);

  const hasActiveFilters = searchQuery || deptFilter !== 'All' || statusFilter !== 'All' ||
    priorityFilter !== 'All' || categoryFilter !== 'All' || dateFrom || dateTo;

  const resetFilters = () => {
    setSearchQuery('');
    setDeptFilter('All');
    setStatusFilter('All');
    setPriorityFilter('All');
    setCategoryFilter('All');
    setDateFrom('');
    setDateTo('');
  };

  // ── Actions for selected circular ──────────────────────────────────────────
  const actionsForSelected = selectedCircular
    ? actions.filter(a => a.sourceCircularId === selectedCircular.id || a.sourceCircularRef === selectedCircular.refNo)
    : [];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">

      {/* ── Lineage Full Modal ──────────────────────────────────────────────── */}
      {lineageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-indigo-400" />
                <h2 className="text-lg font-bold text-slate-100">
                  Policy Lineage Tree — {lineageModal.refNo}
                </h2>
              </div>
              <button onClick={() => setLineageModal(null)} className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
            <LineageViewer currentCircular={lineageModal} allCirculars={circulars} />
          </div>
        </div>
      )}

      {/* ── Page Header ────────────────────────────────────────────────────── */}
      <div className="glass-card rounded-2xl p-5 border border-amber-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 shrink-0">
            <ArchiveIcon className="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl font-black text-slate-100 tracking-tight">
              Archive & Advanced Search
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Search across all {circulars.length} institutional circulars — active, superseded, under review, and historical.
            </p>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center gap-2 bg-slate-900/90 p-1.5 rounded-xl border border-slate-800 shrink-0">
          <button
            onClick={() => setActiveTab('search')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'search' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Search className="w-3.5 h-3.5" /> Circular Registry
          </button>
          <button
            onClick={() => setActiveTab('lineage')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-2 transition-all ${
              activeTab === 'lineage' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <GitBranch className="w-3.5 h-3.5" /> Lineage Trees
          </button>
        </div>
      </div>

      {/* ── Status Summary Strip ───────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          { label: 'Total Circulars', value: circulars.length, color: 'text-slate-200', filter: 'All' },
          { label: 'Active', value: circulars.filter(c => c.status === 'Active').length, color: 'text-emerald-400', filter: 'Active' },
          { label: 'Superseded', value: circulars.filter(c => c.status === 'Superseded').length, color: 'text-amber-400', filter: 'Superseded' },
          { label: 'Under Review', value: circulars.filter(c => c.status === 'Under Review').length, color: 'text-sky-400', filter: 'Under Review' },
          { label: 'Draft / Pending', value: circulars.filter(c => c.status === 'Draft').length, color: 'text-slate-400', filter: 'Draft' },
        ].map(({ label, value, color, filter }) => (
          <button
            key={label}
            onClick={() => { setStatusFilter(filter === 'All' ? 'All' : filter); setActiveTab('search'); }}
            className="glass-card rounded-xl p-3.5 border border-slate-800/80 hover:border-indigo-500/40 transition-all text-left group"
          >
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">{label}</span>
            <span className={`text-2xl font-black ${color} mt-0.5 block group-hover:scale-105 transition-transform`}>{value}</span>
          </button>
        ))}
      </div>

      {activeTab === 'search' && (
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-6">

          {/* ── LEFT: Search + Table ──────────────────────────────────────── */}
          <div className="space-y-4">

            {/* Search Bar */}
            <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-3">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder='Search circulars, policies, departments, keywords…'
                  className="w-full pl-10 pr-4 py-3 bg-slate-900/80 border border-slate-700 rounded-xl text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Filter Row */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {/* Department Filter */}
                <div className="relative">
                  <select
                    value={deptFilter}
                    onChange={e => setDeptFilter(e.target.value)}
                    className="w-full appearance-none bg-slate-900/80 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors pr-7"
                  >
                    {DEPT_OPTIONS.map(d => <option key={d} value={d}>{d === 'All' ? 'All Departments' : d}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                </div>

                {/* Status Filter */}
                <div className="relative">
                  <select
                    value={statusFilter}
                    onChange={e => setStatusFilter(e.target.value)}
                    className="w-full appearance-none bg-slate-900/80 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors pr-7"
                  >
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                </div>

                {/* Priority Filter */}
                <div className="relative">
                  <select
                    value={priorityFilter}
                    onChange={e => setPriorityFilter(e.target.value)}
                    className="w-full appearance-none bg-slate-900/80 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors pr-7"
                  >
                    {PRIORITY_OPTIONS.map(p => <option key={p} value={p}>{p === 'All' ? 'All Priorities' : p}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                </div>

                {/* Category Filter */}
                <div className="relative">
                  <select
                    value={categoryFilter}
                    onChange={e => setCategoryFilter(e.target.value)}
                    className="w-full appearance-none bg-slate-900/80 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors pr-7"
                  >
                    {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c === 'All' ? 'All Categories' : c}</option>)}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                </div>
              </div>

              {/* Date Range + Reset */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] text-slate-400 font-medium">Effective Date:</span>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={e => setDateFrom(e.target.value)}
                  className="bg-slate-900/80 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors"
                />
                <span className="text-slate-400 text-xs">to</span>
                <input
                  type="date"
                  value={dateTo}
                  onChange={e => setDateTo(e.target.value)}
                  className="bg-slate-900/80 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-300 focus:outline-none focus:border-indigo-500 transition-colors"
                />
                {hasActiveFilters && (
                  <button
                    onClick={resetFilters}
                    className="ml-auto px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" /> Reset Filters
                  </button>
                )}
              </div>
            </div>

            {/* Results Count */}
            <div className="flex items-center justify-between px-1">
              <span className="text-xs text-slate-400 font-mono">
                {filteredCirculars.length} of {circulars.length} records
                {searchQuery && <span className="text-indigo-400 ml-1">for "{searchQuery}"</span>}
              </span>
            </div>

            {/* Circular Cards List */}
            {filteredCirculars.length === 0 ? (
              /* ── Empty State ────────────────────────────────────────────── */
              <div className="glass-card rounded-2xl p-12 border border-slate-800 text-center space-y-4 animate-in fade-in duration-200">
                <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto">
                  <Search className="w-7 h-7 text-slate-500" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-200">No matching institutional records found.</h3>
                  <p className="text-xs text-slate-400 mt-1.5 max-w-sm mx-auto">
                    Adjust your search term or filters to find circulars, policies, or directives.
                  </p>
                </div>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 mx-auto transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" /> Clear Filters
                </button>
              </div>
            ) : (
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1" style={{ scrollbarWidth: 'thin' }}>
                {filteredCirculars.map(circ => (
                  <button
                    key={circ.id}
                    onClick={() => setSelectedCircular(circ)}
                    className={`w-full text-left p-4 rounded-xl border transition-all flex items-start gap-4 group ${
                      selectedCircular?.id === circ.id
                        ? 'bg-indigo-950/40 border-indigo-500/60 shadow-md'
                        : 'glass-card border-slate-800/80 hover:border-indigo-500/30 hover:bg-indigo-950/20'
                    }`}
                  >
                    {/* Priority dot */}
                    <span className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1.5 ${priorityDotClass(circ.priority)}`} />

                    <div className="flex-1 min-w-0 space-y-1.5">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-[11px] text-indigo-400 font-bold">{circ.refNo}</span>
                        <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${statusBadgeClass(circ.status)}`}>
                          {circ.status.toUpperCase()}
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">v{circ.version}</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-200 group-hover:text-white line-clamp-1">{circ.title}</p>
                      <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono flex-wrap">
                        <span className="flex items-center gap-1"><Building2 className="w-3 h-3" />{circ.category}</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{circ.effectiveDate}</span>
                        {circ.expiryDate && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />Exp: {circ.expiryDate}</span>}
                      </div>
                      {circ.tags && circ.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {circ.tags.slice(0, 4).map(tag => (
                            <span key={tag} className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 text-[9px] font-mono">{tag}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 transition-colors shrink-0 mt-1" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── RIGHT: Circular Detail Panel ────────────────────────────── */}
          {selectedCircular ? (
            <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden flex flex-col animate-in slide-in-from-right-4 duration-200 max-h-[700px]">
              {/* Header */}
              <div className="p-4 border-b border-slate-800 bg-gradient-to-r from-indigo-950/40 to-slate-900/40 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="font-mono text-xs text-indigo-400 font-black">{selectedCircular.refNo}</span>
                    <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border ${statusBadgeClass(selectedCircular.status)}`}>
                      {selectedCircular.status.toUpperCase()}
                    </span>
                    <PriorityBadge priority={selectedCircular.priority} />
                  </div>
                  <h3 className="text-sm font-bold text-slate-100 line-clamp-2 leading-tight">{selectedCircular.title}</h3>
                </div>
                <button onClick={() => setSelectedCircular(null)} className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors shrink-0">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ scrollbarWidth: 'thin' }}>

                {/* Metadata grid */}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Circular ID', value: selectedCircular.id, mono: true },
                    { label: 'Version', value: `v${selectedCircular.version}`, mono: true },
                    { label: 'Category', value: selectedCircular.category },
                    { label: 'Priority', value: selectedCircular.priority },
                    { label: 'Effective Date', value: selectedCircular.effectiveDate, mono: true },
                    { label: 'Expiry Date', value: selectedCircular.expiryDate || 'N/A', mono: true },
                    { label: 'Issuing Authority', value: selectedCircular.issuingAuthority },
                    { label: 'Signatory', value: selectedCircular.signatoryName },
                  ].map(({ label, value, mono }) => (
                    <div key={label} className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800">
                      <span className="text-[9px] font-mono uppercase text-slate-400 block">{label}</span>
                      <span className={`text-[11px] font-semibold text-slate-200 mt-0.5 block ${mono ? 'font-mono' : ''}`}>{value}</span>
                    </div>
                  ))}
                </div>

                {/* Affected Departments */}
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800">
                  <span className="text-[10px] font-mono uppercase text-slate-400 block mb-2 font-bold">Target Audience</span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedCircular.affectedAudience.departments.map(d => (
                      <span key={d} className="px-2 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-[10px] font-mono">{d}</span>
                    ))}
                  </div>
                  <div className="flex items-center gap-4 mt-2.5 text-[11px] font-mono">
                    <span className="text-slate-400">Total: <strong className="text-slate-200">{selectedCircular.affectedAudience.totalCount.toLocaleString()}</strong></span>
                    <span className="text-slate-400">Ack: <strong className="text-emerald-400">{selectedCircular.affectedAudience.ackPercentage}%</strong></span>
                  </div>
                </div>

                {/* Supersession info */}
                {(selectedCircular.supersedesRef || selectedCircular.supersededByRef) && (
                  <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-500/30 space-y-1.5 text-[11px]">
                    <span className="text-[10px] font-mono uppercase text-amber-400 font-bold">Lineage & Supersession</span>
                    {selectedCircular.supersedesRef && (
                      <p className="text-slate-300">Supersedes: <span className="font-mono font-bold text-amber-300">{selectedCircular.supersedesRef}</span></p>
                    )}
                    {selectedCircular.supersededByRef && (
                      <p className="text-slate-300">Superseded By: <span className="font-mono font-bold text-rose-300">{selectedCircular.supersededByRef}</span></p>
                    )}
                    {selectedCircular.reasonForChange && (
                      <p className="text-slate-400 text-[10px] leading-relaxed">{selectedCircular.reasonForChange}</p>
                    )}
                  </div>
                )}

                {/* Required Actions */}
                {actionsForSelected.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block">Required Actions ({actionsForSelected.length})</span>
                    {actionsForSelected.map(a => (
                      <div key={a.id} className="p-2.5 rounded-lg bg-slate-900/60 border border-slate-800 flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold text-slate-200 truncate">{a.title}</p>
                          <span className="text-[10px] font-mono text-slate-400">{a.responsibleRole} · Due {a.deadline}</span>
                        </div>
                        <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border shrink-0 ${
                          a.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                          a.status === 'Overdue' ? 'bg-rose-500/20 text-rose-400 border-rose-500/30' :
                          a.status === 'In Progress' ? 'bg-sky-500/20 text-sky-400 border-sky-500/30' :
                          'bg-slate-500/20 text-slate-400 border-slate-500/30'
                        }`}>{a.status}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Summary */}
                <div className="p-3 rounded-xl bg-slate-900/40 border border-slate-800">
                  <span className="text-[10px] font-mono uppercase text-slate-400 font-bold block mb-1.5">Summary</span>
                  <p className="text-[11px] text-slate-300 leading-relaxed">{selectedCircular.summary}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 border-t border-slate-800 flex items-center gap-2 bg-slate-950/60 flex-wrap">
                <Link
                  to={`/circulars/${selectedCircular.id}`}
                  className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md"
                >
                  <FileText className="w-3.5 h-3.5" /> View Circular
                </Link>
                <button
                  onClick={() => setLineageModal(selectedCircular)}
                  className="flex-1 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                >
                  <GitBranch className="w-3.5 h-3.5" /> View Lineage
                </button>
                <Link
                  to="/actions"
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                >
                  <ListTodo className="w-3.5 h-3.5" /> View Actions
                </Link>
              </div>
            </div>
          ) : (
            /* No selection placeholder */
            <div className="glass-card rounded-2xl border border-slate-800/60 flex flex-col items-center justify-center p-12 text-center space-y-4 min-h-[400px]">
              <div className="w-14 h-14 rounded-2xl bg-slate-800 flex items-center justify-center">
                <Eye className="w-7 h-7 text-slate-500" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-300">Select a Circular</h3>
                <p className="text-[11px] text-slate-500 mt-1 max-w-xs">Click any row on the left to view full circular details, lineage, and required actions.</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Lineage Tab ──────────────────────────────────────────────────────── */}
      {activeTab === 'lineage' && (
        <div className="space-y-5">
          {/* Policy chain selector */}
          <div className="glass-card rounded-2xl p-4 border border-slate-800 flex flex-wrap items-center gap-3">
            <span className="text-xs font-mono font-bold text-slate-400 uppercase">Select Policy Chain:</span>
            {[
              { label: 'Attendance Monitoring (CIR-2026-052)', targetRef: 'CIR-2026-052' },
              { label: 'AI Safety Governance (CIRC-2026-089)', targetRef: 'CIRC-2026-089' },
              { label: 'Financial Authority (CIRC-2026-092)', targetRef: 'CIRC-2026-092' },
            ].map(preset => {
              const circ = circulars.find(c => c.refNo === preset.targetRef);
              if (!circ) return null;
              const isSelected = lineageRoot.refNo === circ.refNo;
              return (
                <button
                  key={preset.targetRef}
                  onClick={() => setLineageRoot(circ)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                    isSelected
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                      : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700'
                  }`}
                >
                  <GitBranch className="w-3.5 h-3.5" /> {preset.label}
                </button>
              );
            })}
          </div>

          <div className="glass-card rounded-2xl p-6 border border-slate-800">
            <LineageViewer currentCircular={lineageRoot} allCirculars={circulars} />
          </div>
        </div>
      )}
    </div>
  );
};
