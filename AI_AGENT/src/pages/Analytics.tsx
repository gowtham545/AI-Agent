import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useDatabase } from '../context/DatabaseContext';
import { useAuth } from '../context/AuthContext';
import { 
  mockDepartmentComplianceData, 
  mockMonthlyTrends, 
  mockCategoryDistribution 
} from '../data/mockData';
import { getDeptCompliance } from '../data/mockActions';
import {
  BarChart3,
  TrendingUp,
  ShieldCheck,
  FileText,
  Users,
  Clock,
  AlertTriangle,
  CheckCircle2,
  GitBranch,
  Sparkles,
  Award,
  ArrowRight,
  AlertCircle,
  Activity,
  Layers,
  Tag,
  Building2,
  ChevronRight
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';

// Shared chart tooltip style (adapts light/dark)
const chartTooltipStyle = (isDark: boolean) => ({
  contentStyle: {
    backgroundColor: isDark ? '#0f172a' : '#ffffff',
    borderColor: isDark ? '#334155' : '#e2e8f0',
    borderRadius: '10px',
    fontSize: '11px',
    color: isDark ? '#e2e8f0' : '#1e293b',
    boxShadow: isDark
      ? '0 8px 24px -4px rgba(0,0,0,0.5)'
      : '0 4px 16px -4px rgba(0,0,0,0.1)',
  },
  labelStyle: { color: isDark ? '#94a3b8' : '#64748b', fontWeight: 600 },
  itemStyle: { color: isDark ? '#e2e8f0' : '#334155' },
});

// Compliance trend
const complianceTrendData = [
  { month: 'Apr', compliance: 62, ackRate: 91 },
  { month: 'May', compliance: 67, ackRate: 92 },
  { month: 'Jun', compliance: 68, ackRate: 95 },
  { month: 'Jul', compliance: 72, ackRate: 94 },
  { month: 'Aug', compliance: 78, ackRate: 96 },
  { month: 'Sep', compliance: 84, ackRate: 94 },
];

export const Analytics: React.FC = () => {
  const { isDark } = useTheme();
  const { circulars, actions, recipients, metrics } = useDatabase();
  const { currentUser } = useAuth();
  const tooltip = chartTooltipStyle(isDark);

  // ─── Derived Analytics Data ───────────────────────────────────────────────────
  const activeCirculars     = useMemo(() => circulars.filter(c => c.status === 'Active'), [circulars]);
  const supersededCirculars = useMemo(() => circulars.filter(c => c.status === 'Superseded'), [circulars]);
  const reviewCirculars     = useMemo(() => circulars.filter(c => c.status === 'Under Review'), [circulars]);
  const draftCirculars      = useMemo(() => circulars.filter(c => c.status === 'Draft'), [circulars]);

  const totalActions        = actions.length;
  const completedActions    = useMemo(() => actions.filter(a => a.status === 'Completed').length, [actions]);
  const overdueActions      = useMemo(() => actions.filter(a => a.status === 'Overdue').length, [actions]);
  const actionComplianceRate = totalActions > 0 ? Math.round((completedActions / totalActions) * 100) : 0;

  const totalRecipients     = recipients.length;
  const ackedRecipients     = useMemo(() => recipients.filter(r => r.acknowledgementStatus === 'Acknowledged').length, [recipients]);

  // Status distribution data for Pie chart
  const statusDistData = useMemo(() => [
    { name: 'Active',       value: activeCirculars.length,     color: '#10b981' },
    { name: 'Superseded',   value: supersededCirculars.length, color: '#f59e0b' },
    { name: 'Under Review', value: reviewCirculars.length,     color: '#38bdf8' },
    { name: 'Draft',        value: draftCirculars.length,      color: '#94a3b8' },
  ], [activeCirculars, supersededCirculars, reviewCirculars, draftCirculars]);

  // Department action compliance
  const deptCompliance = useMemo(() => getDeptCompliance(actions), [actions]);

  // AI-generated insights
  const aiInsights = useMemo(() => [
    {
      icon: TrendingUp,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
      text: 'Action compliance improved by 6% compared with August — September score: 84%.',
    },
    {
      icon: Award,
      color: 'text-indigo-400',
      bg: 'bg-indigo-500/10 border-indigo-500/20',
      text: 'Legal & Compliance achieved the highest institutional acknowledgement rate: 99.4%.',
    },
    {
      icon: AlertTriangle,
      color: 'text-rose-400',
      bg: 'bg-rose-500/10 border-rose-500/20',
      text: `${overdueActions} actions are past their deadline and require immediate escalation to department HODs.`,
    },
    {
      icon: Users,
      color: 'text-sky-400',
      bg: 'bg-sky-500/10 border-sky-500/20',
      text: `${totalRecipients - ackedRecipients} recipients are still pending acknowledgement across institutional circulars.`,
    },
    {
      icon: GitBranch,
      color: 'text-amber-400',
      bg: 'bg-amber-500/10 border-amber-500/20',
      text: `${supersededCirculars.length} legacy circulars have been formally superseded with complete lineage audit trails.`,
    },
    {
      icon: CheckCircle2,
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10 border-emerald-500/20',
      text: `${activeCirculars.length} circulars are currently active and governing ${metrics.totalAudienceReach.toLocaleString()}+ institutional stakeholders.`,
    },
  ], [overdueActions, totalRecipients, ackedRecipients, supersededCirculars, activeCirculars, metrics]);
  return (
    <div className="space-y-8 animate-in fade-in duration-300">

      {/* ── Page Header ────────────────────────────────────────────────────── */}
      <div className="glass-card rounded-2xl p-5 border border-indigo-500/20 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-xl bg-indigo-500/10 border border-indigo-500/20 shrink-0">
            <BarChart3 className="w-6 h-6 text-indigo-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <h1 className="text-2xl font-black text-slate-100 tracking-tight">
                Institutional Analytics
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                LIVE DATA
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Real-time institutional governance metrics — compliance, acknowledgements, circular activity, and department performance.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-mono px-3 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
            Governance Score: {metrics.complianceScore}/100
          </span>
        </div>
      </div>


      {/* ── KEY METRICS ROW (Requirement 4) ──────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
        {[
          { label: 'Total Circulars', value: circulars.length, color: 'text-slate-200', icon: FileText, link: '/archive' },
          { label: 'Active', value: activeCirculars.length, color: 'text-emerald-400', icon: CheckCircle2, link: '/circulars' },
          { label: 'Superseded', value: supersededCirculars.length, color: 'text-amber-400', icon: GitBranch, link: '/archive' },
          { label: 'Pending Approval', value: reviewCirculars.length, color: 'text-sky-400', icon: Clock, link: '/approvals' },
          { label: 'Avg Ack Rate', value: `${metrics.overallAcknowledgementRate}%`, color: 'text-indigo-400', icon: Users, link: '/distribution' },
          { label: 'Action Compliance', value: `${actionComplianceRate}%`, color: 'text-emerald-400', icon: ShieldCheck, link: '/actions' },
          { label: 'Overdue Actions', value: overdueActions, color: 'text-rose-400', icon: AlertCircle, link: '/actions' },
        ].map(({ label, value, color, icon: Icon, link }) => (
          <Link
            key={label}
            to={link}
            className="glass-card rounded-xl p-3.5 border border-slate-800/80 hover:border-indigo-500/40 transition-all group flex flex-col items-start"
          >
            <div className="flex items-center justify-between w-full mb-1.5">
              <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider leading-tight">{label}</span>
              <Icon className={`w-3.5 h-3.5 ${color} group-hover:scale-110 transition-transform`} />
            </div>
            <span className={`text-xl font-black ${color}`}>{value}</span>
          </Link>
        ))}
      </div>

      {/* ── CHARTS ROW 1: Monthly Activity + Status Distribution (Req 5, 7) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Monthly Circular Activity (Requirement 5) */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-400" />
              Monthly Circular Activity
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Policy issuance volume and acknowledgement rate trend over 6 months.</p>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockMonthlyTrends} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip {...tooltip} />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
                <Bar dataKey="issued" name="Circulars Published" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="ackRate" name="Ack Rate %" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution Donut (Requirement 7) */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              Status Distribution
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Circular lifecycle stage breakdown.</p>
          </div>
          <div className="flex items-center justify-center">
            <div className="h-40 w-40">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusDistData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={68}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusDistData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip {...tooltip} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="space-y-1.5">
            {statusDistData.map(item => (
              <div key={item.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-300">{item.name}</span>
                </div>
                <span className="font-mono font-bold text-slate-200">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CHARTS ROW 2: Dept Compliance + Compliance Trend (Req 6, 8) ─────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Department Acknowledgement Compliance */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Users className="w-4 h-4 text-sky-400" />
              Department Acknowledgement Compliance
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Acknowledgement percentage by functional unit.</p>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockDepartmentComplianceData} layout="vertical" margin={{ top: 0, right: 16, left: 50, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                <XAxis type="number" stroke="#64748b" tick={{ fontSize: 10 }} domain={[70, 100]} />
                <YAxis dataKey="department" type="category" stroke="#64748b" tick={{ fontSize: 9 }} width={85} />
                <Tooltip {...tooltip} formatter={(val: number) => [`${val}%`, 'Ack Rate']} />
                <Bar dataKey="rate" name="Ack Rate %" fill="#10b981" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Institutional Compliance Trend (Requirement 8) */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              Institutional Compliance Trend
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Action compliance & acknowledgement rate — 6-month trajectory.</p>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={complianceTrendData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} domain={[55, 100]} />
                <Tooltip {...tooltip} formatter={(val: number, name: string) => [`${val}%`, name === 'compliance' ? 'Action Compliance' : 'Ack Rate']} />
                <Legend wrapperStyle={{ fontSize: '11px', color: '#94a3b8' }} />
                <Area type="monotone" dataKey="compliance" name="Action Compliance" stroke="#6366f1" fill="rgba(99,102,241,0.15)" strokeWidth={2.5} />
                <Area type="monotone" dataKey="ackRate" name="Ack Rate" stroke="#10b981" fill="rgba(16,185,129,0.10)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          {/* Trend month callouts */}
          <div className="flex items-center justify-between text-[11px] font-mono border-t border-slate-800 pt-3 flex-wrap gap-1">
            <span className="text-slate-400">Jun: <strong className="text-slate-200">68%</strong></span>
            <span className="text-slate-400">Jul: <strong className="text-slate-200">72%</strong></span>
            <span className="text-slate-400">Aug: <strong className="text-slate-200">78%</strong></span>
            <span className="text-emerald-400 font-bold">Sep: <strong>84% ↑</strong></span>
          </div>
        </div>
      </div>

      {/* ── Department Action Performance Matrix (Requirement 6) ─────────────── */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-indigo-400" />
              Department Action Performance Matrix
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Compliance actions breakdown per department — completed, pending, overdue.</p>
          </div>
          <Link to="/actions" className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold transition-colors">
            View All Actions <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60">
                {['Department', 'Total', 'Completed', 'Pending / In Progress', 'Overdue', 'Compliance %'].map(h => (
                  <th key={h} className="text-left px-4 py-2.5 text-[10px] font-mono uppercase tracking-wider text-slate-400 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {deptCompliance.map((dept, idx) => (
                <tr key={dept.department} className={`border-b border-slate-800/60 transition-colors hover:bg-slate-900/40 ${idx % 2 !== 0 ? 'bg-slate-900/20' : ''}`}>
                  <td className="px-4 py-3 font-semibold text-slate-200 whitespace-nowrap">{dept.department}</td>
                  <td className="px-4 py-3 font-mono text-slate-300">{dept.total}</td>
                  <td className="px-4 py-3 font-mono font-bold text-emerald-400">{dept.completed}</td>
                  <td className="px-4 py-3 font-mono text-sky-400">{dept.pending}</td>
                  <td className="px-4 py-3">
                    <span className={`font-mono font-bold ${dept.overdue > 0 ? 'text-rose-400' : 'text-slate-400'}`}>{dept.overdue}</span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2 min-w-[90px]">
                      <div className="flex-1 h-1.5 rounded-full bg-slate-800 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${dept.compliancePercent >= 80 ? 'bg-emerald-500' : dept.compliancePercent >= 50 ? 'bg-amber-500' : 'bg-rose-500'}`}
                          style={{ width: `${dept.compliancePercent}%` }}
                        />
                      </div>
                      <span className={`font-mono font-bold text-[11px] ${dept.compliancePercent >= 80 ? 'text-emerald-400' : dept.compliancePercent >= 50 ? 'text-amber-400' : 'text-rose-400'}`}>
                        {dept.compliancePercent}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Bottom Row: Category Distribution + AI Insights ──────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Category Distribution (Requirement 7) */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
              <Tag className="w-4 h-4 text-indigo-400" />
              Circular Category Distribution
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">Number of circulars per governance domain.</p>
          </div>
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockCategoryDistribution} margin={{ top: 5, right: 10, left: -20, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="name" stroke="#64748b" tick={{ fontSize: 9 }} angle={-14} textAnchor="end" interval={0} height={48} />
                <YAxis stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip {...tooltip} />
                <Bar dataKey="count" name="Circulars" radius={[4, 4, 0, 0]}>
                  {mockCategoryDistribution.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Category legend */}
          <div className="grid grid-cols-2 gap-1.5">
            {mockCategoryDistribution.map(item => (
              <div key={item.name} className="flex items-center gap-1.5 text-[10px]">
                <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-slate-400 truncate">{item.name} ({item.count})</span>
              </div>
            ))}
          </div>
        </div>

        {/* AI Analytics Insights (Requirement 10) */}
        <div className="glass-card rounded-2xl p-6 border border-indigo-500/20 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
            <div className="w-6 h-6 rounded-lg overflow-hidden border border-indigo-500/40 shrink-0">
              <img src="/cira-agent.jpg" alt="Cira" className="w-full h-full object-cover" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-100">AI Insights — Cira Analytics Engine</h3>
              <p className="text-[10px] text-slate-400">Computed from live institutional data. Updated in real-time.</p>
            </div>
          </div>
          <div className="space-y-2 overflow-y-auto max-h-[260px]" style={{ scrollbarWidth: 'thin' }}>
            {aiInsights.map((insight, idx) => {
              const Icon = insight.icon;
              return (
                <div key={idx} className={`p-3 rounded-xl border ${insight.bg} flex items-start gap-2.5`}>
                  <Icon className={`w-4 h-4 ${insight.color} shrink-0 mt-0.5`} />
                  <p className="text-[11px] text-slate-300 leading-relaxed">{insight.text}</p>
                </div>
              );
            })}
          </div>
          <Link
            to="/assistant"
            className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-md"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Ask Cira Analytics Questions
          </Link>
        </div>
      </div>

      {/* ── Extra KPI Strip (Requirement 4) ──────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="glass-card rounded-xl p-5 border border-slate-800 space-y-2">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">Avg Acknowledgement Turnaround</span>
          <h3 className="text-2xl font-bold text-slate-100 font-mono">1.8 Days</h3>
          <p className="text-xs text-emerald-400 flex items-center gap-1 font-mono">
            <TrendingUp className="w-3.5 h-3.5" /> 14% faster than 2025 average
          </p>
        </div>
        <div className="glass-card rounded-xl p-5 border border-slate-800 space-y-2">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">AI Conflict Detection Score</span>
          <h3 className="text-2xl font-bold text-slate-100 font-mono">0 Active</h3>
          <p className="text-xs text-emerald-400 flex items-center gap-1 font-mono">
            <ShieldCheck className="w-3.5 h-3.5" /> No unresolved policy conflicts
          </p>
        </div>
        <div className="glass-card rounded-xl p-5 border border-slate-800 space-y-2">
          <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">AI-Scanned Policies</span>
          <h3 className="text-2xl font-bold text-slate-100 font-mono">{metrics.totalCirculars} Policies</h3>
          <p className="text-xs text-slate-400 font-mono">Scanned & indexed this quarter</p>
        </div>
      </div>

    </div>
  );
};
