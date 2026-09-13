import React, { useState, useMemo } from 'react';
import { useDatabase } from '../context/DatabaseContext';
import { useAuth } from '../context/AuthContext';
import type { Circular, RecipientRecord } from '../types';
import { PriorityBadge } from '../components/ui/PriorityBadge';
import { StatusBadge } from '../components/ui/StatusBadge';
import { formatDate } from '../lib/utils';
import { 
  Users, 
  Send, 
  Mail, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Search, 
  Filter, 
  ChevronDown, 
  Sparkles, 
  CheckCheck, 
  Eye, 
  EyeOff, 
  FileText, 
  Building2, 
  UserCheck, 
  AlertTriangle,
  RotateCcw,
  BellRing,
  ArrowRight,
  Lock
} from 'lucide-react';

export const Distribution: React.FC = () => {
  const { circulars, recipients, sendNudgeBroadcast } = useDatabase();
  const { currentUser, openLoginModal } = useAuth();

  // Selected Circular
  const [selectedCircId, setSelectedCircId] = useState<string>(circulars[0]?.id || 'circ-052');
  
  // Search and Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [deptFilter, setDeptFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [ackFilter, setAckFilter] = useState('All');
  const [readFilter, setReadFilter] = useState('All');

  // Interactive Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const selectedCircular = useMemo(() => {
    return circulars.find(c => c.id === selectedCircId || c.refNo === selectedCircId) || circulars[0] || {
      id: 'circ-001',
      refNo: 'CIRC-2026-089',
      title: 'Institutional Governance Directive',
      priority: 'High' as const,
    };
  }, [circulars, selectedCircId]);

  // Filter recipients belonging to selected circular (or fallback to generic)
  const circularRecipients = useMemo(() => {
    const direct = recipients.filter(r => r.circularId === selectedCircId || r.circularRef === selectedCircular?.refNo);
    return direct.length > 0 ? direct : recipients;
  }, [recipients, selectedCircId, selectedCircular]);

  // Computed summary metrics
  const totalCount = circularRecipients.length;
  const deliveredCount = circularRecipients.filter(r => r.deliveryStatus === 'Delivered').length;
  const readCount = circularRecipients.filter(r => r.readStatus === 'Read').length;
  const ackCount = circularRecipients.filter(r => r.acknowledgementStatus === 'Acknowledged').length;
  const pendingCount = circularRecipients.filter(r => r.acknowledgementStatus === 'Pending').length;

  const ackPercentage = totalCount > 0 ? Math.round((ackCount / totalCount) * 100) : 0;
  const pendingPercentage = 100 - ackPercentage;
  const readPercentage = totalCount > 0 ? Math.round((readCount / totalCount) * 100) : 0;
  const deliveryPercentage = totalCount > 0 ? Math.round((deliveredCount / totalCount) * 100) : 0;

  // Filtered recipient list for table
  const filteredRecipients = useMemo(() => {
    return circularRecipients.filter((r) => {
      const matchSearch = r.name.toLowerCase().includes(searchQuery.toLowerCase()) || r.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchDept = deptFilter === 'All' || r.department === deptFilter;
      const matchRole = roleFilter === 'All' || r.role === roleFilter;
      const matchAck = ackFilter === 'All' || r.acknowledgementStatus === ackFilter;
      const matchRead = readFilter === 'All' || r.readStatus === readFilter;

      return matchSearch && matchDept && matchRole && matchAck && matchRead;
    });
  }, [circularRecipients, searchQuery, deptFilter, roleFilter, ackFilter, readFilter]);

  // Unique departments & roles for filter dropdowns
  const departments = useMemo(() => {
    const list = Array.from(new Set(circularRecipients.map(r => r.department)));
    return ['All', ...list];
  }, [circularRecipients]);

  const roles = useMemo(() => {
    const list = Array.from(new Set(circularRecipients.map(r => r.role)));
    return ['All', ...list];
  }, [circularRecipients]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Send single reminder
  const handleSendSingleReminder = (rec: RecipientRecord) => {
    if (!currentUser.canBroadcastNudge) {
      showToast(`Notice: Reminders are restricted to Registrar / Faculty accounts.`);
      return;
    }
    sendNudgeBroadcast(selectedCircular?.id || selectedCircId, rec.department);
    showToast(`📨 Reminder sent successfully to ${rec.name} (${rec.email}).`);
  };

  // Send batch reminders
  const handleSendBatchReminders = () => {
    if (!currentUser.canBroadcastNudge) {
      showToast(`Notice: Nudge broadcasts are restricted to Registrar / Faculty accounts.`);
      return;
    }
    const count = sendNudgeBroadcast(selectedCircular?.id || selectedCircId, 'All Departments');
    showToast(`📨 Nudge broadcast sent successfully to ${pendingCount || count} pending recipients with 48h deadline.`);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">

      {/* ── Toast Notification ────────────────────────────────────────────── */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-indigo-950 border border-indigo-500 text-white text-xs shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-200 max-w-md">
          <BellRing className="w-4 h-4 text-sky-400 shrink-0 animate-pulse" />
          <p className="flex-1 font-medium">{toastMessage}</p>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* ── Title Header ──────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight flex items-center gap-2.5">
            <Users className="w-6 h-6 text-indigo-400" /> Distribution & Acknowledgement Intelligence
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Real-time recipient delivery tracking, read receipts, formal digital acknowledgements, and automated reminder broadcasts.
          </p>
        </div>

        {currentUser.canBroadcastNudge ? (
          <button
            onClick={handleSendBatchReminders}
            disabled={pendingCount === 0}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-semibold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all hover:scale-105 disabled:opacity-50"
          >
            <Send className="w-4 h-4" /> Send Reminder to All Pending ({pendingCount})
          </button>
        ) : (
          <button
            onClick={openLoginModal}
            className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs flex items-center gap-2 transition-colors"
          >
            <Lock className="w-3.5 h-3.5 text-amber-400" /> Admin Broadcast Tools
          </button>
        )}
      </div>

      {/* ── Circular Selector Bar ─────────────────────────────────────────── */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-bold text-slate-400 uppercase">Select Directive:</span>
          <div className="flex flex-wrap gap-2">
            {circulars.slice(0, 4).map(c => (
              <button
                key={c.id}
                onClick={() => setSelectedCircId(c.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                  (selectedCircId === c.id || selectedCircular?.id === c.id)
                    ? 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-500/50'
                    : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700'
                }`}
              >
                <span className="font-mono">{c.refNo}</span>
                <span className="hidden md:inline font-sans text-[11px] opacity-80">· {c.title.slice(0, 20)}...</span>
              </button>
            ))}
          </div>
        </div>

        {/* Selected Circular Metadata Badge */}
        <div className="flex items-center gap-3 text-xs font-mono text-slate-400">
          <span className="text-slate-200 font-sans font-semibold truncate max-w-xs">{selectedCircular.title}</span>
          <PriorityBadge priority={selectedCircular.priority} />
        </div>
      </div>

      {/* ── Summary Cards (Dynamically Calculated) ─────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total Recipients</span>
          <div className="text-2xl font-black text-slate-100">{totalCount}</div>
          <p className="text-[10px] text-slate-500 font-mono">100% Target Scope</p>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400">Delivered</span>
          <div className="text-2xl font-black text-blue-400">{deliveredCount}</div>
          <p className="text-[10px] text-blue-400/80 font-mono">{deliveryPercentage}% Delivery Rate</p>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-sky-400">Read / Opened</span>
          <div className="text-2xl font-black text-sky-400">{readCount}</div>
          <p className="text-[10px] text-sky-400/80 font-mono">{readPercentage}% Opened</p>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Acknowledged</span>
          <div className="text-2xl font-black text-emerald-400">{ackCount}</div>
          <p className="text-[10px] text-emerald-400/80 font-mono">{ackPercentage}% Compliant</p>
        </div>

        <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-1">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400">Pending Ack</span>
          <div className="text-2xl font-black text-rose-400">{pendingCount}</div>
          <p className="text-[10px] text-rose-400/80 font-mono">{pendingPercentage}% Pending</p>
        </div>
      </div>

      {/* ── Acknowledgement Progress & Delivery Funnel ─────────────────────── */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <CheckCheck className="w-4 h-4 text-emerald-400" /> Acknowledgement Compliance Progress
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Live funnel from transmission to reader engagement and verified legal sign-off.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <span className="flex items-center gap-1.5 text-emerald-400 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Acknowledged: {ackPercentage}%
            </span>
            <span className="flex items-center gap-1.5 text-rose-400 font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" /> Pending: {pendingPercentage}%
            </span>
          </div>
        </div>

        {/* Large Progress Bar */}
        <div className="space-y-2">
          <div className="w-full h-4 rounded-full bg-slate-800 overflow-hidden flex shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${ackPercentage}%` }}
              title={`Acknowledged: ${ackPercentage}%`}
            />
            <div
              className="h-full bg-rose-500/80 transition-all duration-500"
              style={{ width: `${pendingPercentage}%` }}
              title={`Pending: ${pendingPercentage}%`}
            />
          </div>
        </div>

        {/* 3-Step Progress Flow: Delivered ➔ Read ➔ Acknowledged */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          {/* Step 1: Delivered */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center font-bold text-sm shrink-0">
              1
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Stage 1: Transmission</span>
              <div className="text-sm font-bold text-slate-200">Delivered ({deliveredCount}/{totalCount})</div>
              <span className="text-[10px] text-blue-400 font-mono">{deliveryPercentage}% Successful</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-600 hidden md:block" />
          </div>

          {/* Step 2: Read */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 text-sky-400 flex items-center justify-center font-bold text-sm shrink-0">
              2
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Stage 2: Engagement</span>
              <div className="text-sm font-bold text-slate-200">Opened & Read ({readCount}/{totalCount})</div>
              <span className="text-[10px] text-sky-400 font-mono">{readPercentage}% Read Rate</span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-600 hidden md:block" />
          </div>

          {/* Step 3: Acknowledged */}
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold text-sm shrink-0">
              3
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">Stage 3: Binding Sign-off</span>
              <div className="text-sm font-bold text-emerald-300">Acknowledged ({ackCount}/{totalCount})</div>
              <span className="text-[10px] text-emerald-400 font-mono font-bold">{ackPercentage}% Complete ✅</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Recipient Table & Search Toolbar ───────────────────────────────── */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-400" /> Recipient Audit Ledger
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Detailed read-receipt telemetry and individual compliance status.
            </p>
          </div>

          <div className="text-xs font-mono text-slate-400">
            Showing <strong className="text-slate-100">{filteredRecipients.length}</strong> of {totalCount} recipients
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-800 focus:border-indigo-500 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none"
            />
          </div>

          {/* Department Filter */}
          <select
            value={deptFilter}
            onChange={(e) => setDeptFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            {departments.map(d => (
              <option key={d} value={d}>Dept: {d}</option>
            ))}
          </select>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            {roles.map(r => (
              <option key={r} value={r}>Role: {r}</option>
            ))}
          </select>

          {/* Ack Status Filter */}
          <select
            value={ackFilter}
            onChange={(e) => setAckFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="All">Ack: All Statuses</option>
            <option value="Acknowledged">Ack: Acknowledged</option>
            <option value="Pending">Ack: Pending</option>
          </select>

          {/* Read Status Filter */}
          <select
            value={readFilter}
            onChange={(e) => setReadFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="All">Read: All Statuses</option>
            <option value="Read">Read: Read / Opened</option>
            <option value="Unread">Read: Unopened</option>
          </select>
        </div>

        {/* Recipients Table */}
        <div className="overflow-x-auto rounded-xl border border-slate-800" style={{ scrollbarWidth: 'thin' }}>
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 font-mono text-[10px] uppercase border-b border-slate-800">
              <tr>
                <th className="p-3.5">Recipient Name & Email</th>
                <th className="p-3.5">Role</th>
                <th className="p-3.5">Department</th>
                <th className="p-3.5">Delivery</th>
                <th className="p-3.5">Read Status</th>
                <th className="p-3.5">Acknowledgement</th>
                <th className="p-3.5">Last Activity</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 bg-slate-900/40">
              {filteredRecipients.length > 0 ? (
                filteredRecipients.map((rec) => {
                  const isAck = rec.acknowledgementStatus === 'Acknowledged';
                  const isRead = rec.readStatus === 'Read';

                  return (
                    <tr key={rec.id} className="hover:bg-slate-850/60 transition-colors">
                      {/* Name & Email */}
                      <td className="p-3.5">
                        <div className="font-semibold text-slate-200">{rec.name}</div>
                        <div className="text-[11px] text-slate-500 font-mono">{rec.email}</div>
                      </td>

                      {/* Role */}
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 font-medium text-[11px]">
                          {rec.role}
                        </span>
                      </td>

                      {/* Department */}
                      <td className="p-3.5 text-slate-300">
                        {rec.department}
                      </td>

                      {/* Delivery */}
                      <td className="p-3.5">
                        <span className={`inline-flex items-center gap-1 font-mono text-[11px] px-2 py-0.5 rounded ${
                          rec.deliveryStatus === 'Delivered'
                            ? 'bg-blue-500/15 text-blue-300 border border-blue-500/30'
                            : rec.deliveryStatus === 'Pending'
                            ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                            : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            rec.deliveryStatus === 'Delivered' ? 'bg-blue-400' : 'bg-amber-400'
                          }`} />
                          {rec.deliveryStatus}
                        </span>
                      </td>

                      {/* Read Status */}
                      <td className="p-3.5">
                        <span className={`inline-flex items-center gap-1 font-mono text-[11px] px-2 py-0.5 rounded ${
                          isRead
                            ? 'bg-sky-500/15 text-sky-300 border border-sky-500/30'
                            : 'bg-slate-800 text-slate-400 border border-slate-700'
                        }`}>
                          {isRead ? <Eye className="w-3 h-3 text-sky-400" /> : <EyeOff className="w-3 h-3 text-slate-500" />}
                          {rec.readStatus}
                        </span>
                      </td>

                      {/* Acknowledgement */}
                      <td className="p-3.5">
                        <span className={`inline-flex items-center gap-1.5 font-bold text-[11px] px-2.5 py-1 rounded-full ${
                          isAck
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-rose-500/15 text-rose-300 border border-rose-500/30'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isAck ? 'bg-emerald-400' : 'bg-rose-400 animate-pulse'}`} />
                          {rec.acknowledgementStatus}
                        </span>
                      </td>

                      {/* Last Activity */}
                      <td className="p-3.5 font-mono text-[11px] text-slate-400">
                        {rec.lastActivity}
                        {rec.remindersSent > 0 && (
                          <span className="block text-[10px] text-indigo-400 font-sans">
                            {rec.remindersSent} reminder{rec.remindersSent > 1 ? 's' : ''} sent
                          </span>
                        )}
                      </td>

                      {/* Action */}
                      <td className="p-3.5 text-right">
                        {!isAck ? (
                          <button
                            onClick={() => handleSendSingleReminder(rec)}
                            className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 text-[11px] font-semibold transition-colors flex items-center gap-1 ml-auto"
                            title="Send instant reminder nudge"
                          >
                            <Mail className="w-3 h-3" /> Remind
                          </button>
                        ) : (
                          <span className="text-[11px] text-emerald-400 font-mono">Verified ✓</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-500">
                    No recipients match the specified filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
