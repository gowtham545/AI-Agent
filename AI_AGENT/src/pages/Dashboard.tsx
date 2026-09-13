import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useDatabase } from '../context/DatabaseContext';
import { useAuth } from '../context/AuthContext';
import { 
  mockDepartmentComplianceData, 
  mockCategoryDistribution, 
  mockMonthlyTrends 
} from '../data/mockData';
import { MetricCard } from '../components/ui/MetricCard';
import { StatusBadge } from '../components/ui/StatusBadge';
import { PriorityBadge } from '../components/ui/PriorityBadge';
import { LineageViewer } from '../components/ui/LineageViewer';
import type { Circular } from '../types';
import { 
  FileText, 
  Users, 
  AlertCircle, 
  CheckSquare, 
  Sparkles, 
  TrendingUp, 
  ArrowRight, 
  PlusCircle, 
  Bot, 
  Clock,
  ShieldCheck,
  GitBranch,
  AlertTriangle,
  CheckCircle2,
  X,
  ExternalLink,
  BarChart3
} from 'lucide-react';

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  AreaChart, 
  Area 
} from 'recharts';

export const Dashboard: React.FC = () => {
  const { isDark } = useTheme();
  const { circulars, metrics } = useDatabase();
  const { currentUser } = useAuth();
  const [selectedLineageCircular, setSelectedLineageCircular] = useState<Circular | null>(null);

  const tooltipStyle = {
    contentStyle: {
      backgroundColor: isDark ? '#0f172a' : '#ffffff',
      borderColor: isDark ? '#334155' : '#e2e8f0',
      borderRadius: '10px',
      fontSize: '12px',
      color: isDark ? '#e2e8f0' : '#1e293b',
      boxShadow: isDark ? '0 8px 24px -4px rgba(0,0,0,0.5)' : '0 4px 16px -4px rgba(0,0,0,0.1)',
    },
  };

  const activeCirculars = circulars.filter((c) => c.status === 'Active');
  const supersededCirculars = circulars.filter((c) => c.status === 'Superseded');
  const urgentDirectives = circulars.filter((c) => c.priority === 'Critical' || c.priority === 'High');
  const conflictingCirculars = circulars.filter((c) => c.conflictCheckStatus === 'Conflict Detected');

  return (
    <div className="space-y-6 animate-in fade-in duration-300">

      {/* ── Lineage Modal ─────────────────────────────────────────────────── */}
      {selectedLineageCircular && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-indigo-400" />
                <h2 className="text-lg font-bold text-slate-100">
                  Policy Lineage Tree Inspector — {selectedLineageCircular.refNo}
                </h2>
              </div>
              <button
                onClick={() => setSelectedLineageCircular(null)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <LineageViewer
              currentCircular={selectedLineageCircular}
              allCirculars={circulars}
            />
          </div>
        </div>
      )}

      {/* Top Welcome & AI Executive Summary Banner */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 relative overflow-hidden border border-indigo-500/30 bg-gradient-to-r from-indigo-950/60 via-slate-900 to-slate-950">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-mono mb-3 border border-indigo-500/30">
              <Sparkles className="w-3.5 h-3.5 text-sky-400 animate-pulse" />
              Vignan's University · Institutional Governance OS
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              <span className="gradient-text-brand">CircularFlow AI</span>
            </h1>
            <p className="text-base font-semibold text-slate-300 mt-1">Intelligent Circular Management Agent</p>
            <p className="text-sm text-slate-400 mt-1.5 max-w-2xl leading-relaxed">
              AI-powered circular management, version lineage traceability, automated acknowledgement tracking, and real-time departmental compliance.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            {currentUser.canUploadDocuments ? (
              <Link
                to="/circulars/new"
                className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
              >
                <PlusCircle className="w-4 h-4" />
                Issue Circular
              </Link>
            ) : (
              <Link
                to="/circulars"
                className="px-4 py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 font-medium text-xs flex items-center gap-2 transition-colors"
              >
                <FileText className="w-4 h-4" />
                Browse Directives
              </Link>
            )}
            <Link
              to="/assistant"
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-indigo-300 font-medium text-xs flex items-center gap-2 border border-slate-700 transition-colors group shadow-sm"
            >
              <div className="w-4 h-4 rounded-full overflow-hidden border border-indigo-400/60 shrink-0">
                <img src="/cira-agent.jpg" alt="Cira" className="w-full h-full object-cover" />
              </div>
              Cira AI Copilot
            </Link>
          </div>
        </div>

        {/* AI Health Briefing Strip */}
        <div className="mt-6 pt-4 border-t border-indigo-500/20 flex flex-wrap items-center justify-between gap-4 text-xs text-indigo-200/90 font-mono">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>AI Policy Audit Status: <strong>Optimal (No unresolved active overlaps)</strong></span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>Org Ack Rate: <strong className="text-emerald-400 font-semibold">{metrics.overallAcknowledgementRate}%</strong></span>
            <span>Target Reach: <strong className="text-slate-200">{metrics.totalAudienceReach.toLocaleString()} Staff/Students</strong></span>
          </div>
        </div>
      </div>

      {/* KPI Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <MetricCard
          title="Active Circulars"
          value={metrics.totalActiveCirculars}
          change="+1 this month"
          changeType="positive"
          subtitle="Governing directives"
          icon={FileText}
          iconBgColor="bg-indigo-500/10"
          iconColor="text-indigo-400"
        />

        <MetricCard
          title="Overall Ack Rate"
          value={`${metrics.overallAcknowledgementRate}%`}
          change="+1.8% vs Q2"
          changeType="positive"
          subtitle="Target: 95.0%"
          icon={Users}
          iconBgColor="bg-emerald-500/10"
          iconColor="text-emerald-400"
        />

        <MetricCard
          title="Pending Approvals"
          value={metrics.pendingApprovalsCount}
          subtitle="Awaiting sign-off"
          icon={CheckSquare}
          iconBgColor="bg-amber-500/10"
          iconColor="text-amber-400"
        />

        <MetricCard
          title="Overdue Actions"
          value={metrics.overdueActionsCount}
          change="Requires escalation"
          changeType="negative"
          subtitle="Operational tasks"
          icon={AlertCircle}
          iconBgColor="bg-rose-500/10"
          iconColor="text-rose-400"
        />
      </div>

      {/* ── Phase 5: Rule Intelligence & Lineage Overview ─────────────────── */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-indigo-500/15 text-indigo-400 border border-indigo-500/30">
                <GitBranch className="w-4 h-4" />
              </div>
              <h3 className="text-base font-bold text-slate-100">Rule Intelligence & Lineage Status</h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Active rules, supersession chains, and policy conflict resolution matrix.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to="/archive"
              className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-700"
            >
              Full Lineage Archive <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Active Rules Card */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> Active Rules
              </span>
              <span className="font-mono text-xs font-black text-emerald-400">{activeCirculars.length}</span>
            </div>
            <div className="space-y-2">
              {activeCirculars.slice(0, 3).map((circ) => (
                <div
                  key={circ.id}
                  onClick={() => setSelectedLineageCircular(circ)}
                  className="p-2 rounded-lg bg-slate-950/60 hover:bg-indigo-950/30 border border-slate-800/80 hover:border-indigo-500/40 transition-colors cursor-pointer text-xs group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-indigo-400">{circ.refNo}</span>
                    <span className="text-[10px] text-slate-500 font-mono">v{circ.version}</span>
                  </div>
                  <div className="text-slate-300 font-medium truncate mt-0.5">{circ.title}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Recently Superseded Card */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Superseded Rules
              </span>
              <span className="font-mono text-xs font-black text-amber-400">{supersededCirculars.length}</span>
            </div>
            <div className="space-y-2">
              {supersededCirculars.slice(0, 3).map((circ) => (
                <div
                  key={circ.id}
                  onClick={() => setSelectedLineageCircular(circ)}
                  className="p-2 rounded-lg bg-slate-950/60 hover:bg-amber-950/20 border border-slate-800/80 hover:border-amber-500/40 transition-colors cursor-pointer text-xs group"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-amber-400">{circ.refNo}</span>
                    <span className="text-[10px] text-rose-400 font-mono">→ {circ.supersededByRef}</span>
                  </div>
                  <div className="text-slate-400 truncate mt-0.5">{circ.title}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Expiring Rules Card */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-sky-400 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" /> Upcoming Expirations
              </span>
              <span className="font-mono text-xs font-black text-sky-400">0 in 30d</span>
            </div>
            <div className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 text-xs space-y-2">
              <div className="text-slate-300 font-semibold">Next Scheduled Review:</div>
              <div className="font-mono text-[11px] text-sky-300">CIRC-2026-089 (AI Governance)</div>
              <div className="text-[10px] text-slate-400">Expires Aug 31, 2027 (Auto-alert queued)</div>
            </div>
          </div>

          {/* Conflict Analyzer Preview */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" /> Conflict Audit
              </span>
              <span className="font-mono text-xs font-black text-emerald-400">0 Live Conflicts</span>
            </div>
            <div className="p-3 rounded-lg bg-emerald-950/20 border border-emerald-500/30 text-xs space-y-1">
              <div className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> All Active Rules Clear
              </div>
              <p className="text-[11px] text-slate-300 leading-snug">
                Superseded rules (CIR-2026-041, CIRC-2024-042) correctly routed to active v3.0 policies.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Phase 6: Acknowledgement Intelligence Widget ─────────────────── */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              <Users className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">ACKNOWLEDGEMENT INTELLIGENCE</h3>
              <p className="text-xs text-slate-400">Live recipient compliance, read receipts, and pending reminder queues.</p>
            </div>
          </div>

          <Link
            to="/distribution"
            className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm self-start sm:self-auto"
          >
            View Details <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Compliance Rate</span>
              <div className="text-2xl font-black text-emerald-300 mt-0.5">82% Acknowledged</div>
              <span className="text-[11px] text-slate-400 font-mono">18% Pending Formal Sign-off</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold text-base">
              82%
            </div>
          </div>

          <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-rose-400 uppercase tracking-wider block">Pending Directives</span>
              <div className="text-2xl font-black text-rose-300 mt-0.5">18 Pending Recipient Acks</div>
              <span className="text-[11px] text-slate-400 font-mono">12 Reminders Pending Queue</span>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 border border-rose-500/40 text-rose-400 flex items-center justify-center font-bold text-base">
              18
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider block">Autonomous Delivery</span>
              <div className="text-xs text-slate-200 font-semibold mt-1">CIR-2026-052 & CIRC-2026-089</div>
              <span className="text-[11px] text-slate-400 font-mono">100% Multi-channel delivery</span>
            </div>
            <div className="pt-2 flex items-center justify-between text-[11px] text-slate-400 border-t border-slate-800/80">
              <span className="text-emerald-400 flex items-center gap-1 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live Telemetry
              </span>
              <Link to="/distribution" className="text-indigo-400 hover:underline font-semibold flex items-center gap-1">
                Open Matrix <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Department Acknowledgement Breakdown (Bar Chart) */}
        <div className="lg:col-span-2 glass-card rounded-xl p-6 border border-slate-800 flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-semibold text-slate-100">Department Acknowledgement Performance</h3>
              <p className="text-xs text-slate-400">Read receipt completion rates by institutional department.</p>
            </div>
            <span className="text-xs font-mono text-indigo-400 px-2 py-1 rounded bg-indigo-500/10 border border-indigo-500/20">
              Live Feed
            </span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockDepartmentComplianceData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="department" stroke="#94a3b8" tick={{ fontSize: 10 }} angle={-15} textAnchor="end" />
                <YAxis stroke="#94a3b8" tick={{ fontSize: 10 }} domain={[0, 100]} />
                <Tooltip {...tooltipStyle} formatter={(val: number) => [`${val}% Acknowledged`, 'Rate']} />
                <Bar dataKey="rate" fill="#6366f1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Circular Distribution by Category (Donut Chart) */}
        <div className="glass-card rounded-xl p-6 border border-slate-800 flex flex-col justify-between">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-slate-100">Category Distribution</h3>
            <p className="text-xs text-slate-400">Active circulars grouped by governance sector.</p>
          </div>

          <div className="h-52 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={mockCategoryDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="count"
                >
                  {mockCategoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip {...tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 pt-4 border-t border-slate-800">
            {mockCategoryDistribution.slice(0, 4).map((cat) => (
              <div key={cat.name} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                  <span className="text-slate-300 truncate max-w-[140px]">{cat.name}</span>
                </div>
                <span className="font-mono text-slate-400">{cat.count} Directives</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Urgent & Active Directives Feed */}
      <div className="glass-card rounded-xl p-6 border border-slate-800">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-semibold text-slate-100">Urgent & Active Directives</h3>
            <p className="text-xs text-slate-400">Circulars requiring immediate institutional compliance and operational tracking.</p>
          </div>
          <Link
            to="/circulars"
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
          >
            View All Circulars <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {urgentDirectives.slice(0, 3).map((circ) => (
            <div
              key={circ.id}
              className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-xs text-indigo-400 font-bold px-2 py-0.5 rounded bg-indigo-500/10 border border-indigo-500/20">
                    {circ.refNo}
                  </span>
                  <PriorityBadge priority={circ.priority} />
                </div>

                <Link
                  to={`/circulars/${circ.id}`}
                  className="font-semibold text-sm text-slate-100 hover:text-indigo-400 transition-colors line-clamp-2 mb-2 block"
                >
                  {circ.title}
                </Link>

                <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                  {circ.summary}
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-slate-400">Department Ack</span>
                  <span className="font-semibold text-slate-200">{circ.affectedAudience.ackPercentage}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-slate-800 overflow-hidden mb-4">
                  <div
                    className="h-full rounded-full bg-indigo-500"
                    style={{ width: `${circ.affectedAudience.ackPercentage}%` }}
                  />
                </div>

                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                  <StatusBadge status={circ.status} size="sm" />
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedLineageCircular(circ)}
                      className="text-xs text-amber-400 hover:underline flex items-center gap-1 font-medium"
                    >
                      <GitBranch className="w-3 h-3" /> Lineage
                    </button>
                    <Link
                      to={`/circulars/${circ.id}`}
                      className="text-xs text-indigo-400 hover:underline flex items-center gap-1 font-medium"
                    >
                      Hub <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Phase 9: Institutional Analytics Widget ───────────────────── */}
      <div className="glass-card rounded-2xl p-6 border border-indigo-500/20 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 border border-indigo-500/20">
              <BarChart3 className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">Institutional Analytics</h3>
              <p className="text-xs text-slate-400">Live governance metrics — circular activity, compliance, and acknowledgement rates.</p>
            </div>
          </div>
          <Link
            to="/analytics"
            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shrink-0 self-start sm:self-auto"
          >
            <BarChart3 className="w-3.5 h-3.5" /> View Analytics <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Metric tiles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: 'Total Circulars', value: circulars.length, color: 'text-slate-100', icon: FileText },
            { label: 'Active', value: circulars.filter(c => c.status === 'Active').length, color: 'text-emerald-400', icon: CheckCircle2 },
            { label: 'Expired / Superseded', value: circulars.filter(c => c.status === 'Superseded').length, color: 'text-amber-400', icon: GitBranch },
            { label: 'Compliance %', value: `${metrics.complianceScore}%`, color: 'text-indigo-400', icon: ShieldCheck },
          ].map(({ label, value, color, icon: Icon }) => (
            <div key={label} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col gap-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase text-slate-400">{label}</span>
                <Icon className={`w-3.5 h-3.5 ${color}`} />
              </div>
              <span className={`text-2xl font-black font-mono ${color}`}>{value}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
