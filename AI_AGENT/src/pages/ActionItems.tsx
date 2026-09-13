import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDatabase } from '../context/DatabaseContext';
import { useAuth } from '../context/AuthContext';
import { 
  getDeptCompliance,
  daysDiff,
  type ComplianceAction,
  type ActionStatus,
} from '../data/mockActions';
import { 
  ListTodo, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Search, 
  Sparkles, 
  ArrowRight,
  Users,
  Building2,
  Calendar,
  Flame,
  LayoutGrid,
  Table2,
  ExternalLink,
  Bell,
  TrendingUp,
  Shield,
  Activity,
  BarChart3,
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

// ─── Helpers ─────────────────────────────────────────────────────────────────

const statusConfig: Record<ActionStatus, { label: string; pill: string; dot: string }> = {
  'Completed':   { label: 'Completed',   pill: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40',  dot: 'bg-emerald-400' },
  'In Progress': { label: 'In Progress', pill: 'bg-indigo-500/20  text-indigo-300  border border-indigo-500/40',   dot: 'bg-indigo-400 animate-pulse' },
  'Not Started': { label: 'Not Started', pill: 'bg-slate-700/80   text-slate-300   border border-slate-600',       dot: 'bg-slate-500' },
  'Overdue':     { label: 'Overdue',     pill: 'bg-rose-500/20   text-rose-300    border border-rose-500/40',      dot: 'bg-rose-400 animate-pulse' },
};

const priorityConfig: Record<string, { pill: string }> = {
  Critical: { pill: 'bg-rose-500/20   text-rose-300   border border-rose-500/40' },
  High:     { pill: 'bg-amber-500/20  text-amber-300  border border-amber-500/40' },
  Medium:   { pill: 'bg-sky-500/20    text-sky-300    border border-sky-500/40' },
  Low:      { pill: 'bg-slate-700/80  text-slate-300  border border-slate-600' },
};

const deadlineLabel = (iso: string): { text: string; cls: string } => {
  const diff = daysDiff(iso);
  if (diff < 0)  return { text: `${Math.abs(diff)}d overdue`, cls: 'text-rose-400 font-bold' };
  if (diff === 0) return { text: 'Due Today!', cls: 'text-amber-300 font-bold animate-pulse' };
  if (diff <= 7)  return { text: `Due in ${diff}d`, cls: 'text-amber-400 font-semibold' };
  return { text: new Date(iso).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }), cls: 'text-slate-400' };
};

// ─── Kanban Column ────────────────────────────────────────────────────────────
const KanbanColumn: React.FC<{
  status: ActionStatus;
  actions: ComplianceAction[];
  onChangeStatus: (id: string, s: ActionStatus) => void;
}> = ({ status, actions, onChangeStatus }) => {
  const cfg = statusConfig[status];
  const colBg: Record<ActionStatus, string> = {
    'Not Started': 'bg-slate-900/60 border-slate-700',
    'In Progress': 'bg-indigo-950/30 border-indigo-500/30',
    'Completed':   'bg-emerald-950/20 border-emerald-500/30',
    'Overdue':     'bg-rose-950/20 border-rose-500/30',
  };
  return (
    <div className={`rounded-2xl border p-4 space-y-3 min-h-[200px] ${colBg[status]}`}>
      <div className="flex items-center justify-between pb-2 border-b border-slate-800/60">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${cfg.dot}`} />
          <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">{status}</span>
        </div>
        <span className={`text-xs font-mono font-black px-2 py-0.5 rounded-full ${cfg.pill}`}>{actions.length}</span>
      </div>
      {actions.length === 0 && (
        <p className="text-center text-slate-600 text-xs py-6">No actions</p>
      )}
      {actions.map((a) => {
        const dl = deadlineLabel(a.deadline);
        return (
          <div key={a.id} className="bg-slate-900/80 border border-slate-800 rounded-xl p-3 space-y-2 hover:border-indigo-500/40 transition-colors group">
            <div className="flex items-center justify-between gap-2">
              <Link
                to={`/circulars/${a.sourceCircularId}`}
                className="text-[10px] font-mono font-bold text-indigo-400 hover:underline flex items-center gap-1"
                title={a.sourceCircularTitle}
              >
                {a.sourceCircularRef} <ExternalLink className="w-2.5 h-2.5" />
              </Link>
              <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded border ${priorityConfig[a.priority].pill}`}>{a.priority}</span>
            </div>
            <p className="text-xs font-semibold text-slate-100 leading-snug line-clamp-2">{a.title}</p>
            <div className="flex flex-wrap gap-1.5 text-[10px] text-slate-500">
              <span className="flex items-center gap-1"><Users className="w-3 h-3"/>{a.responsibleRole}</span>
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-slate-800/60">
              <span className={`text-[10px] font-mono ${dl.cls}`}>{dl.text}</span>
              <select
                value={status}
                onChange={(e) => onChangeStatus(a.id, e.target.value as ActionStatus)}
                className="text-[10px] bg-slate-800 border border-slate-700 rounded px-1 py-0.5 text-slate-300 focus:outline-none focus:border-indigo-500 cursor-pointer"
              >
                {(['Not Started', 'In Progress', 'Completed', 'Overdue'] as ActionStatus[]).map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────
export const ActionItems: React.FC = () => {
  const navigate = useNavigate();
  const { actions, updateActionStatus } = useDatabase();
  const { currentUser } = useAuth();
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  // ── Computed Metrics ──────────────────────────────────────────────────────
  const totalCount = actions.length;
  const completedCount = useMemo(() => actions.filter(a => a.status === 'Completed').length, [actions]);
  const inProgressCount = useMemo(() => actions.filter(a => a.status === 'In Progress').length, [actions]);
  const notStartedCount = useMemo(() => actions.filter(a => a.status === 'Not Started').length, [actions]);
  const overdueCount = useMemo(() => actions.filter(a => a.status === 'Overdue').length, [actions]);
  const complianceRate = useMemo(() => totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0, [completedCount, totalCount]);
  const dueThisWeek = useMemo(() => actions.filter(a => {
    const d = daysDiff(a.deadline);
    return d >= 0 && d <= 7 && a.status !== 'Completed';
  }).length, [actions]);

  // ── Dept Compliance ───────────────────────────────────────────────────────
  const deptCompliance = useMemo(() => getDeptCompliance(actions), [actions]);

  // ── Unique filter options ─────────────────────────────────────────────────
  const departments = useMemo(() => ['All', ...Array.from(new Set(actions.map(a => a.department)))], [actions]);
  const roles = useMemo(() => ['All', ...Array.from(new Set(actions.map(a => a.responsibleRole)))], [actions]);

  // ── Filtered actions ──────────────────────────────────────────────────────
  const filteredActions = useMemo(() => actions.filter(a => {
    const q = searchQuery.toLowerCase();
    const matchSearch = a.title.toLowerCase().includes(q) 
      || a.sourceCircularRef.toLowerCase().includes(q)
      || a.responsibleRole.toLowerCase().includes(q)
      || a.department.toLowerCase().includes(q);
    const matchDept = deptFilter === 'All' || a.department === deptFilter;
    const matchStatus = statusFilter === 'All' || a.status === statusFilter;
    const matchPriority = priorityFilter === 'All' || a.priority === priorityFilter;
    const matchRole = roleFilter === 'All' || a.responsibleRole === roleFilter;
    return matchSearch && matchDept && matchStatus && matchPriority && matchRole;
  }), [actions, searchQuery, deptFilter, statusFilter, priorityFilter, roleFilter]);

  // ── Urgent actions: overdue or due within 3 days, non-completed ───────────
  const urgentActions = useMemo(() => 
    actions
      .filter(a => a.status !== 'Completed' && daysDiff(a.deadline) <= 3)
      .sort((a, b) => daysDiff(a.deadline) - daysDiff(b.deadline))
      .slice(0, 5),
    [actions]
  );

  // ── Status change handler ─────────────────────────────────────────────────
  const handleChangeStatus = (id: string, newStatus: ActionStatus) => {
    updateActionStatus(id, newStatus);
    showToast(`✅ Action status updated to "${newStatus}"`);
  };

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  // ── Kanban grouped actions ────────────────────────────────────────────────
  const kanbanGroups: Record<ActionStatus, ComplianceAction[]> = useMemo(() => ({
    'Overdue':     filteredActions.filter(a => a.status === 'Overdue'),
    'Not Started': filteredActions.filter(a => a.status === 'Not Started'),
    'In Progress': filteredActions.filter(a => a.status === 'In Progress'),
    'Completed':   filteredActions.filter(a => a.status === 'Completed'),
  }), [filteredActions]);

  // ── Chart data ─────────────────────────────────────────────────────────────
  const chartData = deptCompliance.map(d => ({
    name: d.department.split(' ')[0],
    fullName: d.department,
    Completed: d.completed,
    Pending: d.pending,
    Overdue: d.overdue,
    rate: d.compliancePercent,
  }));

  const filterSelectClass = "px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500";

  return (
    <div className="space-y-6 animate-in fade-in duration-300">

      {/* ── Toast ──────────────────────────────────────────────────────────── */}
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-indigo-950 border border-indigo-500 text-white text-xs shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-200 max-w-md">
          <Sparkles className="w-4 h-4 text-sky-400 shrink-0" />
          <p className="flex-1 font-medium">{toastMsg}</p>
          <button onClick={() => setToastMsg(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2.5">
            <Shield className="w-6 h-6 text-indigo-400" />
            Action & Compliance Intelligence
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            AI-extracted mandatory actions from active circulars — tracked, prioritized and compliance-scored.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {overdueCount > 0 && (
            <span className="text-xs font-mono px-3 py-1.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold flex items-center gap-1.5 animate-pulse">
              <Bell className="w-3.5 h-3.5" />
              {overdueCount} Overdue Actions
            </span>
          )}
          <Link
            to="/assistant"
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-colors"
          >
            <img src="/cira-agent.jpg" alt="Cira" className="w-4 h-4 rounded-full object-cover" />
            Ask Cira
          </Link>
        </div>
      </div>

      {/* ── Summary KPI Cards ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {[
          { label: 'Total Actions', value: totalCount, color: 'text-slate-100', bg: 'border-slate-700' },
          { label: 'Completed', value: completedCount, color: 'text-emerald-400', bg: 'border-emerald-500/30' },
          { label: 'In Progress', value: inProgressCount, color: 'text-indigo-400', bg: 'border-indigo-500/30' },
          { label: 'Not Started', value: notStartedCount, color: 'text-slate-400', bg: 'border-slate-700' },
          { label: 'Overdue', value: overdueCount, color: 'text-rose-400', bg: 'border-rose-500/30' },
          { label: 'Due This Week', value: dueThisWeek, color: 'text-amber-400', bg: 'border-amber-500/30' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={`glass-card rounded-2xl p-4 border ${bg} space-y-1`}>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">{label}</span>
            <div className={`text-2xl font-black ${color}`}>{value}</div>
          </div>
        ))}
      </div>

      {/* ── Overall Compliance + Urgent Actions ─────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Compliance Rate Circle */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-800 flex flex-col items-center justify-center gap-4 text-center">
          <div className="relative w-36 h-36">
            <svg className="w-36 h-36 -rotate-90" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="50" stroke="#1e293b" strokeWidth="12" fill="none" />
              <circle
                cx="60" cy="60" r="50"
                stroke={complianceRate >= 70 ? '#10b981' : complianceRate >= 40 ? '#f59e0b' : '#f43f5e'}
                strokeWidth="12"
                fill="none"
                strokeDasharray={`${2 * Math.PI * 50}`}
                strokeDashoffset={`${2 * Math.PI * 50 * (1 - complianceRate / 100)}`}
                strokeLinecap="round"
                className="transition-all duration-700"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className={`text-3xl font-black ${complianceRate >= 70 ? 'text-emerald-400' : complianceRate >= 40 ? 'text-amber-400' : 'text-rose-400'}`}>
                {complianceRate}%
              </span>
              <span className="text-[10px] text-slate-400 font-mono mt-1">COMPLIANCE</span>
            </div>
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-100">Overall Compliance Rate</h3>
            <p className="text-xs text-slate-400 mt-0.5">{completedCount}/{totalCount} actions completed</p>
          </div>
          <div className="w-full grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2 rounded-xl bg-emerald-950/30 border border-emerald-500/30 text-center">
              <div className="font-black text-emerald-400">{completedCount}</div>
              <div className="text-slate-400">Completed</div>
            </div>
            <div className="p-2 rounded-xl bg-rose-950/30 border border-rose-500/30 text-center">
              <div className="font-black text-rose-400">{overdueCount}</div>
              <div className="text-slate-400">Overdue</div>
            </div>
          </div>
        </div>

        {/* Urgent Actions Panel */}
        <div className="lg:col-span-3 glass-card rounded-2xl p-6 border border-rose-500/20 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-400" />
              Urgent Actions
              <span className="text-xs text-rose-300 font-mono bg-rose-500/15 border border-rose-500/30 px-2 py-0.5 rounded-full">
                Overdue &amp; Due ≤ 3 days
              </span>
            </h3>
          </div>
          <div className="space-y-2">
            {urgentActions.length === 0 && (
              <p className="text-center text-slate-500 text-xs py-4">No urgent actions! Great work 🎉</p>
            )}
            {urgentActions.map(a => {
              const dl = deadlineLabel(a.deadline);
              return (
                <div key={a.id} className="flex items-start gap-3 p-3 rounded-xl bg-rose-950/15 border border-rose-500/20 hover:border-rose-500/40 transition-colors">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${a.status === 'Overdue' ? 'bg-rose-400 animate-pulse' : 'bg-amber-400'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-100 leading-snug">{a.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-mono text-indigo-400">{a.sourceCircularRef}</span>
                      <span className="text-[10px] text-slate-500">·</span>
                      <span className="text-[10px] text-slate-400">{a.responsibleRole}</span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <span className={`text-[10px] font-bold font-mono block ${dl.cls}`}>{dl.text}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border mt-1 inline-block ${priorityConfig[a.priority].pill}`}>{a.priority}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Department Compliance Chart ─────────────────────────────────────── */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-5">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-400" />
            Compliance by Department
          </h3>
          <span className="text-xs font-mono text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 px-2 py-1 rounded">Actions Breakdown</span>
        </div>

        {/* Recharts Bar Chart */}
        <div className="h-52">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="name" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <YAxis tick={{ fill: '#94a3b8', fontSize: 10 }} />
              <Tooltip
                contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '10px', fontSize: '11px' }}
                labelFormatter={(v, payload) => payload?.[0]?.payload?.fullName || v}
              />
              <Bar dataKey="Completed" stackId="a" fill="#10b981" radius={[0, 0, 0, 0]} />
              <Bar dataKey="Pending" stackId="a" fill="#6366f1" radius={[0, 0, 0, 0]} />
              <Bar dataKey="Overdue" stackId="a" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Department Progress Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-xs">
            <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-mono border-b border-slate-800">
              <tr>
                <th className="p-3 text-left">Department</th>
                <th className="p-3 text-center">Total</th>
                <th className="p-3 text-center">Completed</th>
                <th className="p-3 text-center">Pending</th>
                <th className="p-3 text-center">Overdue</th>
                <th className="p-3 text-left">Compliance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
              {deptCompliance.map(d => (
                <tr key={d.department} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-3 font-medium text-slate-200">{d.department}</td>
                  <td className="p-3 text-center font-mono text-slate-300">{d.total}</td>
                  <td className="p-3 text-center font-mono text-emerald-400">{d.completed}</td>
                  <td className="p-3 text-center font-mono text-indigo-400">{d.pending}</td>
                  <td className="p-3 text-center font-mono text-rose-400">{d.overdue}</td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${
                            d.compliancePercent >= 70 ? 'bg-emerald-500' : d.compliancePercent >= 40 ? 'bg-amber-500' : 'bg-rose-500'
                          }`}
                          style={{ width: `${d.compliancePercent}%` }}
                        />
                      </div>
                      <span className={`font-mono font-bold text-[11px] min-w-[35px] ${
                        d.compliancePercent >= 70 ? 'text-emerald-400' : d.compliancePercent >= 40 ? 'text-amber-400' : 'text-rose-400'
                      }`}>{d.compliancePercent}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── View Toggle + Filters ────────────────────────────────────────────── */}
      <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Title & Toggle */}
          <div className="flex items-center gap-3">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-400" /> Action Intelligence
            </h3>
            <div className="flex rounded-xl bg-slate-900 border border-slate-800 overflow-hidden text-xs">
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1.5 flex items-center gap-1.5 font-semibold transition-colors ${viewMode === 'table' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                <Table2 className="w-3.5 h-3.5" /> Table
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={`px-3 py-1.5 flex items-center gap-1.5 font-semibold transition-colors ${viewMode === 'kanban' ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-white'}`}
              >
                <LayoutGrid className="w-3.5 h-3.5" /> Kanban
              </button>
            </div>
          </div>

          <p className="text-xs font-mono text-slate-400">
            Showing <strong className="text-slate-100">{filteredActions.length}</strong> of {totalCount} actions
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search actions, circulars..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 focus:border-indigo-500 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none"
            />
          </div>
          <select value={deptFilter} onChange={e => setDeptFilter(e.target.value)} className={filterSelectClass}>
            {departments.map(d => <option key={d} value={d}>Dept: {d}</option>)}
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className={filterSelectClass}>
            {['All', 'Not Started', 'In Progress', 'Completed', 'Overdue'].map(s => <option key={s} value={s}>Status: {s}</option>)}
          </select>
          <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)} className={filterSelectClass}>
            {['All', 'Critical', 'High', 'Medium', 'Low'].map(p => <option key={p} value={p}>Priority: {p}</option>)}
          </select>
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)} className={filterSelectClass}>
            {roles.map(r => <option key={r} value={r}>Role: {r}</option>)}
          </select>
        </div>
      </div>

      {/* ── TABLE VIEW ──────────────────────────────────────────────────────── */}
      {viewMode === 'table' && (
        <div className="glass-card rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
          <div className="overflow-x-auto" style={{ scrollbarWidth: 'thin' }}>
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/80 text-slate-400 font-mono text-[10px] uppercase border-b border-slate-800">
                <tr>
                  <th className="p-3.5">Action</th>
                  <th className="p-3.5">Source Circular</th>
                  <th className="p-3.5">Responsible Role</th>
                  <th className="p-3.5">Department</th>
                  <th className="p-3.5">Deadline</th>
                  <th className="p-3.5">Priority</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
                {filteredActions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-10 text-center text-slate-500">
                      <ListTodo className="w-8 h-8 mx-auto mb-2 text-slate-700" />
                      No actions match the selected filters.
                    </td>
                  </tr>
                ) : filteredActions.map(a => {
                  const dl = deadlineLabel(a.deadline);
                  const sc = statusConfig[a.status];
                  return (
                    <tr key={a.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-3.5 max-w-xs">
                        <p className="font-semibold text-slate-100 leading-snug line-clamp-2">{a.title}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-1">{a.description}</p>
                      </td>
                      <td className="p-3.5">
                        <Link
                          to={`/circulars/${a.sourceCircularId}`}
                          className="font-mono font-bold text-indigo-400 hover:underline flex items-center gap-1 text-[11px]"
                        >
                          {a.sourceCircularRef} <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                      <td className="p-3.5 text-slate-300 flex items-center gap-1 mt-0.5">
                        <Users className="w-3 h-3 text-slate-500 shrink-0" />
                        {a.responsibleRole}
                      </td>
                      <td className="p-3.5 text-slate-300">
                        <span className="flex items-center gap-1"><Building2 className="w-3 h-3 text-slate-500 shrink-0" />{a.department}</span>
                      </td>
                      <td className="p-3.5">
                        <span className={`flex items-center gap-1 font-mono text-[11px] ${dl.cls}`}>
                          <Calendar className="w-3 h-3" />
                          {dl.text}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${priorityConfig[a.priority].pill}`}>{a.priority}</span>
                      </td>
                      <td className="p-3.5">
                        <span className={`inline-flex items-center gap-1.5 font-bold text-[11px] px-2.5 py-1 rounded-full ${sc.pill}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${sc.dot}`} />
                          {a.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <select
                          value={a.status}
                          onChange={e => handleChangeStatus(a.id, e.target.value as ActionStatus)}
                          className="text-[10px] bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-slate-300 focus:outline-none focus:border-indigo-500"
                        >
                          {(['Not Started', 'In Progress', 'Completed', 'Overdue'] as ActionStatus[]).map(s => (
                            <option key={s} value={s}>{s}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── KANBAN VIEW ─────────────────────────────────────────────────────── */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
          {(['Overdue', 'Not Started', 'In Progress', 'Completed'] as ActionStatus[]).map(status => (
            <KanbanColumn
              key={status}
              status={status}
              actions={kanbanGroups[status]}
              onChangeStatus={handleChangeStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
};
