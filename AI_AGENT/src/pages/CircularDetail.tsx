import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDatabase } from '../context/DatabaseContext';
import { useAuth } from '../context/AuthContext';
import { StatusBadge } from '../components/ui/StatusBadge';
import { PriorityBadge } from '../components/ui/PriorityBadge';
import { LineageViewer } from '../components/ui/LineageViewer';
import { ActionItemCard } from '../components/ui/ActionItemCard';
import { AcknowledgementBar } from '../components/ui/AcknowledgementBar';
import { formatDate } from '../lib/utils';
import { 
  ArrowLeft, 
  Sparkles, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Users, 
  GitBranch, 
  ShieldCheck, 
  Send, 
  Download, 
  Share2, 
  AlertTriangle,
  FileCheck,
  UserCheck,
  Calendar,
  Building2,
  Lock,
  Check
} from 'lucide-react';

export const CircularDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { circulars, recipients, acknowledgeCircular, sendNudgeBroadcast } = useDatabase();
  const { currentUser, openLoginModal } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'actions' | 'ack' | 'lineage' | 'audit'>('overview');
  const [nudgeNotification, setNudgeNotification] = useState<string | null>(null);
  const [justSigned, setJustSigned] = useState(false);

  // Find circular by id or refNo in unified database
  const circular = circulars.find(c => c.id === id || c.refNo === id) || circulars[0];

  // Check if current user has acknowledged this circular
  const userRecipient = recipients.find(r => (r.circularId === circular?.id || r.circularId === circular?.refNo) && r.role.toLowerCase() === currentUser.role.toLowerCase());
  const isUserAcknowledged = userRecipient?.acknowledgementStatus === 'Acknowledged' || justSigned;

  const handleStudentAcknowledge = () => {
    if (!circular) return;
    acknowledgeCircular(circular.id, currentUser.name, currentUser.role);
    setJustSigned(true);
    setNudgeNotification(`Successfully signed and recorded digital acknowledgement for ${currentUser.name}.`);
    setTimeout(() => setNudgeNotification(null), 4000);
  };

  const handleSendNudge = (dept: string) => {
    if (!currentUser.canBroadcastNudge) {
      setNudgeNotification(`Notice: Broadcast nudges are restricted to Institutional Registrars and Faculty.`);
      setTimeout(() => setNudgeNotification(null), 4000);
      return;
    }
    const count = sendNudgeBroadcast(circular.id, dept);
    setNudgeNotification(`Broadcast reminder dispatched to ${count || 12} recipients across ${dept}.`);
    setTimeout(() => setNudgeNotification(null), 4000);
  };

  if (!circular) {
    return (
      <div className="text-center py-16 space-y-4">
        <h2 className="text-xl font-bold text-slate-200">Circular Directive Not Found</h2>
        <button onClick={() => navigate('/circulars')} className="text-indigo-400 hover:underline text-sm">
          Return to Repository
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Breadcrumb Nav */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/circulars')}
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Circular Repository
        </button>

        <div className="flex items-center gap-2">
          {currentUser.canBroadcastNudge ? (
            <button
              onClick={() => handleSendNudge('All Departments')}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-1.5 shadow-md transition-colors"
            >
              <Send className="w-3.5 h-3.5" /> Broadcast Nudge
            </button>
          ) : (
            <button
              onClick={openLoginModal}
              className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs flex items-center gap-1.5 transition-colors"
            >
              <Lock className="w-3.5 h-3.5 text-amber-400" /> Admin Tools
            </button>
          )}
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 font-medium text-xs flex items-center gap-1.5 border border-slate-800 transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> Export PDF
          </button>
        </div>
      </div>

      {/* Notification Banner */}
      {nudgeNotification && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-200 text-xs flex items-center justify-between animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{nudgeNotification}</span>
          </div>
          <button onClick={() => setNudgeNotification(null)} className="text-emerald-400 font-bold">×</button>
        </div>
      )}

      {/* Circular Header Banner */}
      <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 relative overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-bold px-3 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              {circular.refNo}
            </span>
            <span className="text-xs font-mono px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700">
              v{circular.version}
            </span>
            <StatusBadge status={circular.status} size="md" />
            <PriorityBadge priority={circular.priority} />
          </div>

          <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-500" /> Effective: <strong>{formatDate(circular.effectiveDate)}</strong>
          </span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-100 mb-3 tracking-tight">
          {circular.title}
        </h1>

        <p className="text-sm text-slate-300 leading-relaxed max-w-4xl mb-6">
          {circular.summary}
        </p>

        {/* Issuing Authority Card Strip */}
        <div className="pt-4 border-t border-slate-800 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center font-bold text-indigo-400">
              {circular.signatoryName?.slice(0, 2).toUpperCase() || 'AD'}
            </div>
            <div>
              <span className="font-semibold text-slate-200 block">{circular.signatoryName || 'Administrative Authority'}</span>
              <span className="text-slate-400 text-[11px]">{circular.signatoryTitle || 'Authority'} — {circular.issuingAuthority || 'University Governance'}</span>
            </div>
          </div>

          <div className="flex items-center gap-6 font-mono text-slate-400">
            <div>
              <span className="block text-[10px] text-slate-500 uppercase">Target Audience</span>
              <span className="font-semibold text-slate-200">{circular.affectedAudience?.totalCount?.toLocaleString() || '1,200'} Staff/Students</span>
            </div>
            <div>
              <span className="block text-[10px] text-slate-500 uppercase">Ack Completion</span>
              <span className="font-semibold text-emerald-400">{circular.affectedAudience?.ackPercentage || 76}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recipient Digital Sign-off Banner (Highlighted for Students & Recipients) */}
      <div className={`p-5 rounded-2xl border transition-all ${
        isUserAcknowledged
          ? 'bg-emerald-950/30 border-emerald-500/30'
          : 'bg-indigo-950/40 border-indigo-500/40 shadow-lg shadow-indigo-950/50'
      }`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
              isUserAcknowledged
                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/40'
            }`}>
              {isUserAcknowledged ? <Check className="w-5 h-5" /> : <FileCheck className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-bold text-slate-100">
                  {isUserAcknowledged ? 'Mandate Digitally Signed & Acknowledged' : 'Mandatory Directive Acknowledgement'}
                </h3>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-mono text-slate-300 border border-slate-700 uppercase">
                  {currentUser.role} Account
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {isUserAcknowledged
                  ? `Your compliance sign-off has been immutably recorded in the institutional database.`
                  : `As an active ${currentUser.role} (${currentUser.name}), you are required to review this document and record digital sign-off.`}
              </p>
            </div>
          </div>

          <div>
            {isUserAcknowledged ? (
              <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4" /> Signed as {currentUser.name}
              </span>
            ) : (
              <button
                onClick={handleStudentAcknowledge}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all hover:scale-105 active:scale-95"
              >
                <UserCheck className="w-4 h-4" /> Digitally Acknowledge & Sign
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-1 text-xs font-semibold overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <FileText className="w-4 h-4" /> Overview & AI Briefing
        </button>

        <button
          onClick={() => setActiveTab('actions')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'actions'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" /> Action Items ({circular.actionItems.length})
        </button>

        <button
          onClick={() => setActiveTab('ack')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'ack'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Users className="w-4 h-4" /> Acknowledgements ({circular.affectedAudience.ackPercentage}%)
        </button>

        <button
          onClick={() => setActiveTab('lineage')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'lineage'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <GitBranch className="w-4 h-4" /> Version Lineage
        </button>

        <button
          onClick={() => setActiveTab('audit')}
          className={`px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'audit'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4" /> Audit & Approval Trail
        </button>
      </div>

      {/* Tab Content 1: Overview & AI Briefing */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {/* AI Executive Summary Card */}
            <div className="p-6 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-3">
              <div className="flex items-center gap-2 text-indigo-300 font-semibold text-sm">
                <Sparkles className="w-4 h-4 text-sky-400" />
                AI Executive Intelligence Briefing
              </div>
              <p className="text-xs text-indigo-100/90 leading-relaxed font-sans">
                {circular.aiExecutiveSummary}
              </p>
            </div>

            {/* Document Content Markdown Container */}
            <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 prose prose-invert max-w-none text-xs leading-relaxed">
              <div className="whitespace-pre-line text-slate-300 font-sans">
                {circular.contentMarkdown}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            {/* AI Policy Conflict Card */}
            <div className="glass-card rounded-xl p-5 border border-slate-800 space-y-3">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Policy Overlay & Conflict Check
              </h3>
              <div className="flex items-center gap-2">
                {circular.conflictCheckStatus === 'No Conflicts' ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-xs font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> No Policy Conflicts Detected
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 text-xs font-semibold">
                    <AlertTriangle className="w-3.5 h-3.5" /> {circular.conflictCheckStatus}
                  </span>
                )}
              </div>
              {circular.conflictDetails && (
                <p className="text-xs text-slate-400">{circular.conflictDetails}</p>
              )}
            </div>

            {/* Tags & Categories */}
            <div className="glass-card rounded-xl p-5 border border-slate-800 space-y-3">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Metadata & Tags
              </h3>
              <div className="flex flex-wrap gap-1.5">
                <span className="text-xs px-2.5 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-medium">
                  {circular.category}
                </span>
                {circular.tags.map((t) => (
                  <span key={t} className="text-xs px-2 py-1 rounded-lg bg-slate-900 text-slate-400 border border-slate-800">
                    #{t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab Content 2: Action Items */}
      {activeTab === 'actions' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-base font-semibold text-slate-100">Mandatory Action Items</h3>
              <p className="text-xs text-slate-400">Directives extracted from CIRC-2026-089 assigned to functional department leads.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {circular.actionItems.map((act) => (
              <ActionItemCard key={act.id} action={act} />
            ))}
            {circular.actionItems.length === 0 && (
              <div className="col-span-full py-12 text-center text-slate-500 glass-card rounded-xl">
                No active operational action items extracted for this circular.
              </div>
            )}
          </div>
        </div>
      )}

      {/* Tab Content 3: Acknowledgements */}
      {activeTab === 'ack' && (
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div>
              <h3 className="text-base font-semibold text-slate-100">Departmental Acknowledgement Matrix</h3>
              <p className="text-xs text-slate-400">Audience read-receipt stats across institutional units.</p>
            </div>
            <button
              onClick={() => handleSendNudge('pending')}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" /> Batch Remind Pending
            </button>
          </div>

          <AcknowledgementBar breakdown={circular.departmentBreakdown} onSendNudge={handleSendNudge} />
        </div>
      )}

      {/* Tab Content 4: Version Lineage */}
      {activeTab === 'lineage' && (
        <LineageViewer currentCircular={circular} allCirculars={circulars} />
      )}

      {/* Tab Content 5: Audit & Approvals */}
      {activeTab === 'audit' && (
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-6">
          <div>
            <h3 className="text-base font-semibold text-slate-100">Approval Chain & Audit Trail</h3>
            <p className="text-xs text-slate-400">Chronological history of legal, technical, and executive digital sign-offs.</p>
          </div>

          <div className="space-y-4">
            {circular.approvalChain.map((stage) => (
              <div key={stage.stage} className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                    stage.status === 'Approved' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-slate-800 text-slate-400'
                  }`}>
                    Stage {stage.stage}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-slate-200">{stage.title}</h4>
                    <p className="text-xs text-slate-400">{stage.approverName} ({stage.approverRole})</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${
                    stage.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30'
                  }`}>
                    {stage.status}
                  </span>
                  {stage.timestamp && (
                    <span className="text-[10px] text-slate-500 font-mono block mt-1">{stage.timestamp}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
