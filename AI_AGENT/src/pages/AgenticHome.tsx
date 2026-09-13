import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useDatabase } from '../context/DatabaseContext';
import type { CopilotMessage } from '../types';
import { Bot3D } from '../components/ui/Bot3D';
import { CyberPuppy } from '../components/ui/CyberPuppy';
import {
  Send, LayoutDashboard, FileText, CheckSquare, ListTodo,
  BarChart3, AlertCircle, Clock, Users, ShieldCheck,
  Sparkles, ChevronRight, Activity, CheckCircle2, Bell,
  ArrowRight, Zap, BookOpen, Mail, Sun, Moon, Database,
  Cpu, GitBranch, ExternalLink, RefreshCw, AlertTriangle,
  Check, Info, X, GraduationCap, Briefcase, Building,
  TrendingUp, Layers, CheckCheck, Eye
} from 'lucide-react';

interface RichActionItem {
  id: string;
  task: string;
  role: string;
  dept: string;
  dueDate: string;
  priority: 'Critical' | 'High' | 'Medium';
  status: 'Pending' | 'In Progress' | 'Completed';
  isOverdue?: boolean;
}

interface RichResponseData {
  text: string;
  refs?: Array<{ id: string; refNo: string; title: string; dept?: string; status?: string }>;
  supersessionAlert?: {
    supersededRef: string;
    supersededTitle: string;
    activeRef: string;
    activeTitle: string;
    activeId: string;
    reason: string;
  };
  actionItems?: RichActionItem[];
  complianceData?: Array<{
    dept: string;
    total: number;
    ack: number;
    pct: number;
    status: 'good' | 'warning' | 'critical';
  }>;
  approvalStages?: Array<{
    refNo: string;
    title: string;
    id: string;
    stage: string;
    currentApprover: string;
    pendingSince: string;
  }>;
}

type RoleMode = 'registrar' | 'faculty' | 'student';
type SlideOverKey = 'active' | 'approvals' | 'acknowledgements' | 'actions' | 'expiring' | null;

// ─── Canned Rich AI Responses ─────────────────────────────────────────────────────
const cannedRichResponses: Record<string, RichResponseData> = {
  'which circular is currently active?': {
    text: 'Identified **5 officially active directives** across the institutional governance repository.\n\nAll current operational compliance baselines are synchronized with department registries:',
    refs: [
      { id: 'circ-001', refNo: 'CIRC-2026-089', title: 'Enterprise AI Safety Governance & Data Protection Protocol (v3.0)', dept: 'IT & Cyber Security', status: 'Active' },
      { id: 'circ-002', refNo: 'CIRC-2026-092', title: 'Financial Delegation of Authority & Expenditure Thresholds', dept: 'Finance & Audit', status: 'Active' },
      { id: 'circ-052', refNo: 'CIR-2026-052', title: 'Revised Attendance and Academic Monitoring Guidelines (v3.0)', dept: 'Academic Affairs', status: 'Active' },
      { id: 'circ-003', refNo: 'CIRC-2026-068', title: 'Vendor Risk Management Standards & Third-Party SLAs', dept: 'Legal & Compliance', status: 'Active' },
      { id: 'circ-004', refNo: 'CIRC-2026-044', title: 'Clean Desk & Physical Document Disposal Protocol', dept: 'Health & Safety', status: 'Active' },
    ],
    supersessionAlert: {
      supersededRef: 'CIR-2026-041 (v2.0)',
      supersededTitle: 'Legacy Attendance Guidelines (75% manual portal logging)',
      activeRef: 'CIR-2026-052 (v3.0)',
      activeTitle: 'Revised Attendance and Academic Monitoring Guidelines',
      activeId: 'circ-052',
      reason: 'CIR-2026-041 was formally rescinded on August 31, 2026. Current mandatory baseline is 80.0% biometric RFID logging.',
    },
  },
  'who has not acknowledged the latest circular?': {
    text: 'Real-time read-receipt audit for **CIRC-2026-089** (AI Safety Governance v3.0):\n\n• **Overall Compliance:** **93.6%** acknowledged across 4,250 targeted personnel\n• **Pending Non-Compliant Staff:** **270 total staff members** require immediate acknowledgement',
    refs: [
      { id: 'circ-001', refNo: 'CIRC-2026-089', title: 'Enterprise AI Safety Governance & Data Protection Protocol (v3.0)', dept: 'IT & Cyber Security', status: 'Active' }
    ],
    complianceData: [
      { dept: 'Legal & Compliance', total: 180, ack: 180, pct: 100, status: 'good' },
      { dept: 'IT & Cyber Security', total: 850, ack: 840, pct: 98.8, status: 'good' },
      { dept: 'Executive Office', total: 2500, ack: 2300, pct: 92.0, status: 'warning' },
      { dept: 'Human Resources', total: 580, ack: 520, pct: 89.6, status: 'critical' },
    ],
  },
  'which actions are due this week?': {
    text: 'Extracted **4 prioritized action items** requiring execution this week. Directives have been assigned to functional leads with strict SLA countdowns:',
    actionItems: [
      { id: 'act-1', task: 'Audit & Revoke Unauthorized External API Tokens', role: 'Chief Information Security Officer', dept: 'IT & Cyber Security', dueDate: 'Today, 5:00 PM', priority: 'Critical', status: 'In Progress', isOverdue: true },
      { id: 'act-2', task: 'Reconfigure ERP Dual-Approval Expenditure Matrix', role: 'Finance Systems Admin', dept: 'Finance & Audit', dueDate: 'Sep 15, 2026', priority: 'High', status: 'In Progress' },
      { id: 'act-3', task: 'Appoint Departmental AI Ethics & Risk Officers', role: 'Department HODs', dept: 'All Departments', dueDate: 'Sep 30, 2026', priority: 'High', status: 'Pending' },
      { id: 'act-4', task: 'Calibrate Biometric RFID Turnstiles with LMS Database', role: 'Systems Engineer', dept: 'Academic Affairs', dueDate: 'Sep 20, 2026', priority: 'Medium', status: 'Pending' },
    ],
  },
  'show me circulars awaiting approval.': {
    text: 'Found **2 institutional circular drafts** actively progressing through the multi-stage governance approval chain:',
    approvalStages: [
      { refNo: 'CIRC-2026-095', title: 'Emergency Evacuation & Crisis Protocol', id: 'circ-005', stage: 'Stage 2 of 3 (COO Approval)', currentApprover: 'Dr. V. Prasad (Chief Operating Officer)', pendingSince: '1 day ago' },
      { refNo: 'CIRC-2026-101', title: 'Cloud Infrastructure Data Retention Policy', id: 'circ-006', stage: 'Stage 1 of 3 (Legal Review)', currentApprover: 'Adv. S. Raman (Chief Legal Officer)', pendingSince: '4 hours ago' },
    ],
  },
  'which circulars are expiring soon?': {
    text: 'Circular SLA & Expiry forecast status:\n\n✅ **Zero circulars** are expiring in the next 30 days.\n\n**Upcoming Scheduled Governance Reviews:**\n• **CIRC-2026-089** (AI Safety) — Annual Review: Aug 31, 2027 (11 months)\n• **CIRC-2026-068** (Vendor Risk) — Review: Jun 30, 2028 (21 months)\n• **CIRC-2026-092** (Financial Authority) — Review: Sep 9, 2028 (24 months)\n\n*Autonomous 60-day renewal alerts are pre-scheduled.*',
  },
  // Faculty Mode Queries
  'show circulars requiring cse hod sign-off.': {
    text: 'Identified **2 pending departmental sign-offs** for the Department of Computer Science & Engineering:\n\n1. **CIR-2026-052** — Laboratory Biometric Logging Protocol (Awaiting HOD verification)\n2. **CIRC-2026-089** — CSE AI Compute Cluster Access Policy (Action: Appoint Risk Officer by Sep 30)\n\nFaculty attendance submission for current week is **98.2% completed**.',
    refs: [
      { id: 'circ-052', refNo: 'CIR-2026-052', title: 'Revised Attendance and Academic Monitoring Guidelines (v3.0)', dept: 'Academic Affairs', status: 'Active' },
      { id: 'circ-001', refNo: 'CIRC-2026-089', title: 'Enterprise AI Safety Governance & Data Protection Protocol (v3.0)', dept: 'IT & Cyber Security', status: 'Active' },
    ],
  },
  // Student Mode Queries
  'what is the minimum attendance requirement?': {
    text: 'According to current active directive **CIR-2026-052 (v3.0)**:\n\n• **Mandatory Threshold:** **80.0% minimum biometric / RFID attendance** across all registered courses\n• **LMS Alert Trigger:** Automated deficit alerts are dispatched to students & mentors when attendance falls below 80%\n• **Condonation Policy:** Permitted exclusively for certified medical emergencies with prior HOD endorsement\n• **Superseded Policy:** The previous 75% criteria (CIR-2026-041) is formally **RESCINDED**.',
    refs: [
      { id: 'circ-052', refNo: 'CIR-2026-052', title: 'Revised Attendance and Academic Monitoring Guidelines (v3.0)', dept: 'Academic Affairs', status: 'Active' },
    ],
    supersessionAlert: {
      supersededRef: 'CIR-2026-041 (v2.0)',
      supersededTitle: '75% Attendance (Manual portal)',
      activeRef: 'CIR-2026-052 (v3.0)',
      activeTitle: '80% Biometric RFID Attendance',
      activeId: 'circ-052',
      reason: 'Mandatory 80.0% biometric RFID baseline effective since 01 September 2026.',
    },
  },
};

const getAiResponse = (query: string): RichResponseData => {
  const key = query.toLowerCase().trim();
  for (const [k, v] of Object.entries(cannedRichResponses)) {
    if (key.includes(k.slice(0, 16)) || k.includes(key.slice(0, 16))) return v;
  }
  return {
    text: `Query analyzed: **"${query}"**\n\nLive institutional snapshot:\n• **5 Active** circulars across 4 governance categories\n• Overall acknowledgement compliance: **94.2%**\n• **2 Action items** flagged for urgent execution this week\n• **2 Circular drafts** pending executive signature approval\n\nAsk me about specific circulars, lineage history, or overdue compliance.`,
  };
};

const initialAgentActivities = [
  { id: '1', action: 'Circular Analyzed', detail: 'CIRC-2026-089 — AI Governance v3.0 parsed', time: '2 min ago', icon: <FileText className="w-3.5 h-3.5" />, tag: 'AI Parsed' },
  { id: '2', action: 'Audience Scoped', detail: '4,250 staff across IT, Legal, HR, Executive', time: '5 min ago', icon: <Users className="w-3.5 h-3.5" />, tag: 'Auto-Scoped' },
  { id: '3', action: 'Approval Routed', detail: 'CIRC-2026-095 sent to Legal & COO', time: '12 min ago', icon: <CheckSquare className="w-3.5 h-3.5" />, tag: 'Chain Active' },
  { id: '4', action: 'Circular Broadcast', detail: 'CIRC-2026-092 published to Finance & Ops', time: '28 min ago', icon: <Zap className="w-3.5 h-3.5" />, tag: 'Broadcast' },
  { id: '5', action: 'Nudge Dispatched', detail: '270 HR & Exec personnel nudged via email', time: '45 min ago', icon: <Mail className="w-3.5 h-3.5" />, tag: 'Nudge Sent' },
  { id: '6', action: 'Lineage Verified', detail: 'CIR-2026-052 verified as v3.0 active legal baseline', time: 'Just now', icon: <GitBranch className="w-3.5 h-3.5" />, tag: 'Deterministic' },
];

const roleSuggestedQuestions: Record<RoleMode, string[]> = {
  registrar: [
    'What circulars are currently active?',
    'Who has not acknowledged the latest circular?',
    'Which actions are due this week?',
    'Show me circulars awaiting approval.',
    'Which circulars are expiring soon?',
  ],
  faculty: [
    'Show circulars requiring CSE HOD sign-off.',
    'What faculty actions are due this semester?',
    'Which students have attendance deficit below 80%?',
    'Which circulars are currently active?',
  ],
  student: [
    'What is the minimum attendance requirement?',
    'Which circulars are currently active?',
    'Which actions are due this week?',
    'Which circulars are expiring soon?',
  ],
};

const accreditations = [
  { label: 'NAAC', sub: 'A+', color: 'from-orange-500 to-red-600', border: 'border-orange-300' },
  { label: 'NIRF', sub: 'Rank', color: 'from-blue-600 to-blue-800', border: 'border-blue-300' },
  { label: 'NBA', sub: '', color: 'from-green-600 to-green-800', border: 'border-green-300' },
  { label: 'UGC', sub: 'CARE', color: 'from-purple-600 to-purple-800', border: 'border-purple-300' },
  { label: 'AICTE', sub: '', color: 'from-slate-700 to-slate-900', border: 'border-slate-300' },
];

interface ChatMessage extends CopilotMessage {
  richData?: RichResponseData;
}

// ─── Custom Count-Up Hook ──────────────────────────────────────────────────────────
function useCountUp(target: number, duration = 800) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = target;
    if (start === end) { setCount(end); return; }
    const totalFrames = Math.round(duration / 16);
    let frame = 0;
    const timer = setInterval(() => {
      frame++;
      const progress = frame / totalFrames;
      const current = Math.round(end * (1 - Math.pow(1 - progress, 3)));
      setCount(current);
      if (frame === totalFrames) {
        clearInterval(timer);
        setCount(end);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target, duration]);
  return count;
}

export const AgenticHome: React.FC = () => {
  const { isDark, toggleTheme } = useTheme();
  const { currentUser, loginAs, openLoginModal } = useAuth();
  const { circulars, metrics, acknowledgeCircular } = useDatabase();
  const selectedRole = currentUser.role;
  const [studentAcknowledged, setStudentAcknowledged] = useState(false);
  const [activeSlideOver, setActiveSlideOver] = useState<SlideOverKey>(null);
  const [activities, setActivities] = useState(initialAgentActivities);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'init-1',
      sender: 'assistant',
      text: "Hello! I'm Cira, your Circular Intelligence Agent. I have real-time access to all institutional directives, compliance analytics, and acknowledgement tracking.\n\nHow can I assist your governance operations today?",
      timestamp: '08:00 PM',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [activePipelineStep, setActivePipelineStep] = useState<number>(0);
  const [nudged, setNudged] = useState(false);
  const [checkedActions, setCheckedActions] = useState<Record<string, boolean>>({});
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Exact target values derived from centralized database
  const rawActive = metrics.totalActiveCirculars;
  const rawApprovals = metrics.pendingApprovalsCount;
  const rawAck = 1350;
  const rawOverdue = metrics.overdueActionsCount;
  const rawExpiring = circulars.length;

  // Animated counters
  const activeCirculars = useCountUp(rawActive);
  const pendingApprovals = useCountUp(rawApprovals);
  const pendingAck = useCountUp(rawAck);
  const overdueActions = useCountUp(rawOverdue);
  const expiringSoon = useCountUp(rawExpiring);

  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);

  // Ambient pipeline animation when idle vs active
  useEffect(() => {
    if (isTyping) {
      const s1 = setTimeout(() => setActivePipelineStep(1), 100);
      const s2 = setTimeout(() => setActivePipelineStep(2), 500);
      const s3 = setTimeout(() => setActivePipelineStep(3), 900);
      return () => { clearTimeout(s1); clearTimeout(s2); clearTimeout(s3); };
    } else {
      const interval = setInterval(() => {
        setActivePipelineStep(prev => (prev >= 3 ? 1 : prev + 1));
      }, 2500);
      return () => clearInterval(interval);
    }
  }, [isTyping]);

  const handleRoleChange = (role: RoleMode) => {
    loginAs(role);
    const roleText = role === 'registrar'
      ? "Switched to **Registrar Mode** (Signed in as Dr. K. R. Sharma). University-wide governance controls, draft approval chains, and executive compliance dashboards are active."
      : role === 'faculty'
      ? "Switched to **Faculty / HOD Mode** (Signed in as Prof. Ananya Rao). Scoped to Department of CSE directives, digital sign-offs, and semester attendance tracking."
      : "Switched to **Student Mode** (Signed in as Rohan Varma). Upload and edit privileges are restricted; showing academic directives, exam rules, and mandatory 80% biometric attendance acknowledgement.";

    setMessages(prev => [
      ...prev,
      {
        id: `role-${Date.now()}`,
        sender: 'assistant',
        text: roleText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }
    ]);
  };

  const handleSend = (text?: string) => {
    const query = text || input;
    if (!query.trim()) return;
    setInput(query);
    setMessages(prev => [...prev, { 
      id: `u-${Date.now()}`, 
      sender: 'user', 
      text: query, 
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) 
    }]);
    setIsTyping(true);
    setActivePipelineStep(1);

    setTimeout(() => {
      const res = getAiResponse(query);
      setMessages(prev => [...prev, { 
        id: `a-${Date.now()}`, 
        sender: 'assistant', 
        text: res.text, 
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
        referencedCirculars: res.refs,
        richData: res
      }]);
      setIsTyping(false);
      setInput('');
    }, 1200);
  };

  const toggleActionCheck = (actionId: string) => {
    setCheckedActions(prev => ({ ...prev, [actionId]: !prev[actionId] }));
  };

  const handleNudge = () => {
    setNudged(true);
    setTimeout(() => setNudged(false), 4000);
  };

  const addSimulatedActivity = () => {
    const newAct = {
      id: `${Date.now()}`,
      action: 'Compliance Scanned',
      detail: `Real-time check completed for ${selectedRole.toUpperCase()} scope`,
      time: 'Just now',
      icon: <CheckCircle2 className="w-3.5 h-3.5" />,
      tag: 'Live Event'
    };
    setActivities(prev => [newAct, ...prev.slice(0, 5)]);
  };

  const fmt = (t: string) => t.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

  // ── Theme tokens ──────────────────────────────────────────────────────────
  const T = {
    pageBg:       isDark ? 'bg-slate-950'                  : 'bg-[#f0f5ff]',
    headerBg:     isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-blue-100',
    subBg:        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-blue-50',
    cardBg:       isDark ? 'bg-slate-900 border-slate-800 shadow-slate-900' : 'bg-white border-blue-100 shadow-sm',
    heroBg:       isDark ? 'bg-gradient-to-r from-slate-900 to-indigo-950/40 border-slate-800' : 'bg-gradient-to-r from-blue-50 to-sky-50 border-blue-100',
    inputBg:      isDark ? 'bg-slate-800 border-slate-700 focus-within:border-indigo-500' : 'bg-[#f8fbff] border-blue-200 focus-within:border-blue-400',
    chatAreaBg:   isDark ? 'bg-slate-950'    : 'bg-[#fafcff]',
    msgBubble:    isDark ? 'bg-slate-800 border-slate-700 text-slate-200' : 'bg-white border-blue-100 text-slate-700',
    primaryText:  isDark ? 'text-slate-100'  : 'text-blue-900',
    secondText:   isDark ? 'text-slate-400'  : 'text-slate-500',
    accentText:   isDark ? 'text-indigo-400' : 'text-blue-600',
    labelText:    isDark ? 'text-slate-500'  : 'text-blue-400',
    divider:      isDark ? 'border-slate-800': 'border-blue-50',
    pillBg:       isDark ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-slate-300' : 'bg-blue-50 hover:bg-blue-100 border-blue-200 text-blue-700',
    navLink:      isDark ? 'text-slate-300 hover:text-indigo-400 hover:bg-slate-800/80 px-2.5 py-1 rounded-md' : 'text-slate-600 hover:text-blue-600 hover:bg-blue-50 px-2.5 py-1 rounded-md',
    kpiRow:       isDark ? 'border-slate-800 hover:border-indigo-500/50 hover:bg-indigo-900/20' : 'border-slate-100 hover:border-blue-200 hover:bg-blue-50/50',
    actRow:       isDark ? 'hover:bg-slate-800/60' : 'hover:bg-slate-50',
    toggleBg:     isDark ? 'bg-slate-800 border-slate-700 text-yellow-400 hover:bg-slate-700' : 'bg-blue-50 border-blue-200 text-slate-700 hover:bg-blue-100',
    footerBg:     isDark ? 'bg-slate-900 border-slate-800 text-slate-500' : 'bg-white border-blue-100 text-slate-400',
    quickBtn1:    isDark ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white',
    quickBtn2:    isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700' : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200',
    quickBtn3:    isDark ? 'bg-amber-900/30 hover:bg-amber-900/50 text-amber-400 border border-amber-800' : 'bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200',
    quickBtn4:    isDark ? 'bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700' : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200',
    onlineBadge:  isDark ? 'bg-slate-900 border-emerald-700 text-emerald-400' : 'bg-white border-emerald-200 text-emerald-600',
    subLinkBg:    isDark ? 'bg-indigo-600 hover:bg-indigo-500 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white',
    typingBubble: isDark ? 'bg-slate-800 border-slate-700' : 'bg-white border-blue-100 shadow-sm',
    segmentedBg:  isDark ? 'bg-slate-900/90 border-slate-800' : 'bg-white border-blue-200 shadow-sm',
  };

  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${T.pageBg}`} style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>

      {/* ── HEADER ──────────────────────────────────────────────────────────── */}
      <header className={`border-b shadow-sm transition-colors duration-300 ${T.headerBg}`}>
        <div className="max-w-[1700px] mx-auto px-6 py-3 flex items-center justify-between gap-4">

          {/* Left: CSE Shield Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <div className={`rounded-xl overflow-hidden shadow-md border ${isDark ? 'border-purple-900/60 bg-slate-800/80' : 'border-purple-200 bg-white'} p-1 flex items-center justify-center`}>
              <img
                src="/cse-shield-logo.jpg"
                alt="CSE Department Logo"
                className="h-20 w-20 object-contain rounded-lg"
              />
            </div>
            <div className="hidden md:block">
              <div className={`text-xs font-black tracking-wider uppercase ${isDark ? 'text-red-400' : 'text-red-600'}`}>DEPARTMENT OF CSE</div>
              <div className={`text-[10px] font-semibold tracking-wide ${T.secondText}`}>Vignan's Foundation for Science,</div>
              <div className={`text-[9px] font-medium ${T.labelText}`}>Technology & Research</div>
            </div>
          </div>

          {/* Center: Event Title */}
          <div className="text-center flex-1">
            <div className={`text-xs font-bold tracking-[0.35em] uppercase mb-0.5 ${T.accentText}`}>CSE PRESENTS</div>
            <div className={`text-2xl sm:text-3xl font-black tracking-tight leading-none ${T.primaryText}`}>
              AGENTIC AI HACKATHON
            </div>
            <div className={`text-xs mt-1 font-medium ${T.secondText}`}>
              Department of Computer Science & Engineering
            </div>
          </div>

          {/* Right: Accreditation + Theme Toggle + Dashboard Link */}
          <div className="flex items-center gap-3 shrink-0">
            {/* NAAC Accreditation Badges */}
            <div className="hidden lg:flex items-center gap-1.5">
              {accreditations.map(acc => (
                <div
                  key={acc.label}
                  className={`w-11 h-11 rounded-full bg-gradient-to-br ${acc.color} border-2 ${acc.border} flex flex-col items-center justify-center shadow-sm`}
                  title={`${acc.label} ${acc.sub}`}
                >
                  <span className="text-[8px] font-black text-white leading-none">{acc.label}</span>
                  {acc.sub && <span className="text-[7px] font-bold text-white/90 leading-none mt-0.5">{acc.sub}</span>}
                </div>
              ))}
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg border transition-colors ${T.toggleBg}`}
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Dashboard Link */}
            <Link to="/dashboard" className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold transition-colors shadow-sm ${T.subLinkBg}`}>
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Full Dashboard</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ── SUB-HEADER ────────────────────────────────────────────────────────── */}
      <div className={`border-b px-6 py-2 transition-colors duration-300 ${T.subBg}`}>
        <div className="max-w-[1700px] mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className={`w-5 h-5 rounded-md flex items-center justify-center ${isDark ? 'bg-indigo-600' : 'bg-blue-600'}`}>
              <ShieldCheck className="w-3 h-3 text-white" />
            </div>
            <span className={`font-bold text-sm ${T.primaryText}`}>CircularFlow AI</span>
            <span className={`text-xs ${T.secondText}`}>· Institutional Circular Governance Platform</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Role Switcher Pill Bar */}
            <div className={`hidden sm:flex items-center p-0.5 rounded-lg border text-xs ${T.segmentedBg}`}>
              <button
                onClick={() => handleRoleChange('registrar')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                  selectedRole === 'Registrar'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Building className="w-3 h-3" />
                <span>Registrar</span>
              </button>
              <button
                onClick={() => handleRoleChange('faculty')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                  selectedRole === 'Faculty'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Briefcase className="w-3 h-3" />
                <span>Faculty / HOD</span>
              </button>
              <button
                onClick={() => handleRoleChange('student')}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                  selectedRole === 'Student'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <GraduationCap className="w-3 h-3" />
                <span>Student</span>
              </button>
            </div>

            <div className={`flex items-center gap-2 text-xs ${T.secondText}`}>
              {[
                { label: 'Circulars', path: '/circulars', icon: FileText },
                { label: 'Approvals', path: '/approvals', icon: CheckSquare },
                { label: 'Actions', path: '/actions', icon: ListTodo },
                { label: 'Analytics', path: '/analytics', icon: BarChart3 },
              ].map(({ label, path, icon: Icon }) => (
                <Link key={path} to={path} className={`flex items-center gap-1.5 font-medium transition-all ${T.navLink}`}>
                  <Icon className="w-3.5 h-3.5" /> {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── MAIN ────────────────────────────────────────────────────────────── */}
      <main className="flex-1 max-w-[1700px] mx-auto w-full px-6 py-6 grid grid-cols-1 xl:grid-cols-[1fr_390px] gap-6">

        {/* LEFT: Agent Hero + Chat ──────────────────────────────────────────── */}
        <div className="flex flex-col gap-5">
          <div className={`rounded-2xl border shadow transition-colors duration-300 ${T.cardBg} overflow-hidden`}>

            {/* ── HERO SECTION (Matching Reference Design) ── */}
            <div className={`border-b p-6 flex flex-col md:flex-row items-center gap-6 transition-colors duration-300 ${T.heroBg}`}>

              {/* 3D Animated Bot Presentation (Bigger, Interactive, Raising Hand & Saying Hi) */}
              <div className="relative shrink-0 flex flex-col items-center justify-center p-2">
                <Bot3D
                  size="hero"
                  greetingText="Hi! 👋 I'm Cira"
                  showSpeechBubble={true}
                  onAskClick={(prompt) => {
                    if (prompt) handleSend(prompt);
                  }}
                  autoWave={true}
                />
              </div>

              {/* Agent Info & Live Governance KPIs */}
              <div className="flex-1 min-w-0">
                <div className={`text-[11px] font-bold tracking-[0.2em] uppercase mb-1 ${isDark ? 'text-indigo-400' : 'text-blue-500'}`}>
                  CIRCULAR INTELLIGENCE AGENT
                </div>
                <h1 className={`text-3xl sm:text-4xl font-extrabold tracking-tight leading-none mb-1.5 ${isDark ? 'text-slate-100' : 'text-[#1e3a5f]'}`}>
                  Cira
                </h1>
                <p className={`text-sm font-bold mb-2 ${isDark ? 'text-indigo-400' : 'text-[#2563eb]'}`}>
                  Your Institutional AI Governance Assistant
                </p>
                <p className={`text-xs leading-relaxed max-w-xl ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                  Real-time access to active directives, compliance data, action deadlines, acknowledgement tracking, and governance analytics. Ask anything about institutional circulars.
                </p>

                {/* Inline KPIs */}
                <div className="flex flex-wrap items-center gap-6 sm:gap-8 mt-4 pt-3 border-t border-slate-200/60 dark:border-slate-800">
                  {[
                    { label: 'Active Circulars', value: activeCirculars, color: isDark ? 'text-indigo-400' : 'text-blue-600' },
                    { label: 'Ack Rate', value: `${metrics.overallAcknowledgementRate}%`, color: 'text-emerald-600' },
                    { label: 'Overdue Actions', value: overdueActions, color: 'text-rose-500' },
                    { label: 'Pending Approvals', value: pendingApprovals, color: 'text-amber-500' },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="text-left">
                      <div className={`text-2xl font-black ${color}`}>{value}</div>
                      <div className={`text-[11px] font-medium ${T.secondText}`}>{label}</div>
                    </div>
                  ))}
                </div>

                {/* ── Realistic 3D Puppy Roaming Below KPIs (Active Circulars, Ack Rate, Overdue Actions) ── */}
                <div className="relative mt-4 pt-2 pb-1 h-12 flex items-center overflow-visible">
                  <div className="flex items-center gap-1.5 text-[9px] font-mono font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest pl-0.5 pointer-events-none select-none opacity-80 shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>BYTE (AI COMPANION)</span>
                  </div>
                  <CyberPuppy />
                </div>
              </div>
            </div>

            {/* Suggested Questions (Prompt Pills - Exact Reference Layout) */}
            <div className={`px-5 py-3.5 flex flex-wrap items-center gap-2 border-b ${T.divider}`}>
              <span className={`text-[10px] font-bold uppercase tracking-wider self-center mr-1 text-blue-500`}>
                ASK CIRA:
              </span>
              {[
                'What circulars are currently active?',
                'Who has not acknowledged the latest circular?',
                'Which actions are due this week?',
                'Show me circulars awaiting approval.',
                'Which circulars are expiring soon?',
              ].map(q => (
                <button
                  key={q}
                  onClick={() => handleSend(q)}
                  className={`px-3 py-1.5 rounded-lg border text-xs font-medium transition-all flex items-center gap-1.5 hover:scale-[1.02] shadow-xs active:scale-95 ${T.pillBg}`}
                >
                  <Sparkles className="w-3.5 h-3.5 shrink-0 text-blue-500 opacity-80" /> {q}
                </button>
              ))}
            </div>


            {/* Chat Messages Viewport */}
            <div className={`h-[360px] overflow-y-auto p-5 space-y-4 transition-colors duration-300 ${T.chatAreaBg}`} style={{ scrollbarWidth: 'thin' }}>
              {messages.map(msg => (
                <div key={msg.id} className={`flex gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 overflow-hidden shadow-sm ${
                    msg.sender === 'user'
                      ? (isDark ? 'bg-indigo-600 border-indigo-500 text-white text-xs font-bold' : 'bg-blue-600 border-blue-500 text-white text-xs font-bold')
                      : (isDark ? 'bg-slate-800 border-slate-700' : 'bg-[#dbeafe] border-blue-200')
                  }`}>
                    {msg.sender === 'user' ? 'YOU' : <img src="/cira-agent.jpg" alt="Cira" className="w-full h-full object-cover" />}
                  </div>

                  <div className={`max-w-[86%] sm:max-w-[80%] flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`text-[10px] font-black uppercase tracking-wider mb-1 ${
                      msg.sender === 'user' 
                        ? (isDark ? 'text-indigo-400 text-right' : 'text-blue-500 text-right') 
                        : (isDark ? 'text-sky-400' : 'text-blue-600')
                    }`}>
                      {msg.sender === 'user' ? 'YOU' : 'CIRA — ASSISTANT'}
                    </div>

                    <div className={`rounded-xl px-4 py-3.5 text-xs leading-relaxed shadow-xs ${
                      msg.sender === 'user'
                        ? (isDark ? 'bg-indigo-600 text-white rounded-tr-sm' : 'bg-blue-600 text-white rounded-tr-sm')
                        : `border rounded-tl-sm ${T.msgBubble}`
                    }`}>
                      {/* Main Message Text */}
                      <div dangerouslySetInnerHTML={{ __html: fmt(msg.text) }} className="whitespace-pre-line" />

                      {/* ── RICH INLINE RESPONSE CARDS ── */}
                      {msg.richData && (
                        <div className="mt-3 space-y-3 pt-2 border-t border-slate-700/30">

                          {/* 1. Supersession Alert Badge */}
                          {msg.richData.supersessionAlert && (
                            <div className={`p-3 rounded-xl border flex items-start gap-2.5 transition-all ${
                              isDark 
                                ? 'bg-amber-950/40 border-amber-500/40 text-amber-200' 
                                : 'bg-amber-50 border-amber-300 text-amber-900'
                            }`}>
                              <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                              <div className="flex-1 min-w-0 text-xs">
                                <div className="font-bold flex items-center gap-1.5 flex-wrap">
                                  <span>SUPERSESSION ALERT:</span>
                                  <span className="line-through font-mono opacity-80">{msg.richData.supersessionAlert.supersededRef}</span>
                                  <span>➔</span>
                                  <span className="font-mono text-emerald-500 font-black">{msg.richData.supersessionAlert.activeRef}</span>
                                </div>
                                <p className="mt-1 text-[11px] opacity-90 leading-tight">
                                  {msg.richData.supersessionAlert.reason}
                                </p>
                                <div className="mt-2">
                                  <Link
                                    to={`/circulars/${msg.richData.supersessionAlert.activeId}`}
                                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold transition-colors ${
                                      isDark ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40' : 'bg-amber-200 hover:bg-amber-300 text-amber-900'
                                    }`}
                                  >
                                    <FileText className="w-3 h-3" /> View Active Baseline ({msg.richData.supersessionAlert.activeRef})
                                  </Link>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* 2. Action Items Checklist Cards */}
                          {msg.richData.actionItems && (
                            <div className="space-y-2">
                              <div className={`text-[10px] font-bold uppercase tracking-wider ${T.labelText}`}>
                                Action Execution Checklist (Interactive):
                              </div>
                              <div className="space-y-1.5">
                                {msg.richData.actionItems.map(act => {
                                  const isChecked = !!checkedActions[act.id];
                                  return (
                                    <div
                                      key={act.id}
                                      onClick={() => toggleActionCheck(act.id)}
                                      className={`p-2.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                                        isChecked
                                          ? (isDark ? 'bg-emerald-950/20 border-emerald-500/30 opacity-70' : 'bg-emerald-50 border-emerald-200 opacity-75')
                                          : (isDark ? 'bg-slate-900/80 border-slate-700/80 hover:border-indigo-500/50' : 'bg-white border-blue-100 hover:border-blue-300')
                                      }`}
                                    >
                                      <div className="flex items-center gap-2.5 flex-1 min-w-0">
                                        <div className={`w-4 h-4 rounded border flex items-center justify-center shrink-0 transition-colors ${
                                          isChecked
                                            ? 'bg-emerald-500 border-emerald-500 text-white'
                                            : isDark ? 'border-slate-600 bg-slate-800' : 'border-slate-300 bg-white'
                                        }`}>
                                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                          <div className={`font-semibold text-xs truncate ${isChecked ? 'line-through opacity-70' : T.primaryText}`}>
                                            {act.task}
                                          </div>
                                          <div className={`text-[10px] ${T.secondText}`}>
                                            Assigned: <span className="font-medium text-slate-300 dark:text-slate-300">{act.role}</span> · {act.dept}
                                          </div>
                                        </div>
                                      </div>

                                      <div className="flex items-center gap-2 shrink-0">
                                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                                          act.isOverdue
                                            ? 'bg-rose-500/20 text-rose-400 border-rose-500/30 font-bold'
                                            : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
                                        }`}>
                                          {act.dueDate}
                                        </span>
                                        <span className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                                          act.priority === 'Critical' ? 'bg-rose-600 text-white' : 'bg-amber-500 text-white'
                                        }`}>
                                          {act.priority}
                                        </span>
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}

                          {/* 3. Department Compliance Progress Cards + Nudge Button */}
                          {msg.richData.complianceData && (
                            <div className="space-y-2">
                              <div className="flex items-center justify-between">
                                <span className={`text-[10px] font-bold uppercase tracking-wider ${T.labelText}`}>
                                  Department Acknowledgement Matrix:
                                </span>
                                <button
                                  onClick={handleNudge}
                                  disabled={nudged}
                                  className={`px-2.5 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 transition-all ${
                                    nudged
                                      ? 'bg-emerald-600 text-white cursor-default'
                                      : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs hover:scale-[1.02]'
                                  }`}
                                >
                                  {nudged ? (
                                    <>
                                      <CheckCircle2 className="w-3 h-3" /> Nudges Dispatched (270 Staff)
                                    </>
                                  ) : (
                                    <>
                                      <Mail className="w-3 h-3" /> ⚡ Dispatch Reminder Nudge
                                    </>
                                  )}
                                </button>
                              </div>

                              <div className="space-y-1.5">
                                {msg.richData.complianceData.map(dept => (
                                  <div key={dept.dept} className={`p-2 rounded-lg border text-xs ${
                                    isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-slate-50 border-blue-100'
                                  }`}>
                                    <div className="flex justify-between items-center mb-1 text-[11px]">
                                      <span className="font-semibold">{dept.dept}</span>
                                      <span className="font-mono font-bold">{dept.pct}% ({dept.ack}/{dept.total})</span>
                                    </div>
                                    <div className="w-full h-2 rounded-full bg-slate-700/30 overflow-hidden">
                                      <div
                                        className={`h-full rounded-full transition-all duration-500 ${
                                          dept.pct >= 95 ? 'bg-emerald-500' : dept.pct >= 90 ? 'bg-amber-500' : 'bg-rose-500'
                                        }`}
                                        style={{ width: `${dept.pct}%` }}
                                      />
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* 4. Approval Stages */}
                          {msg.richData.approvalStages && (
                            <div className="space-y-2">
                              <div className={`text-[10px] font-bold uppercase tracking-wider ${T.labelText}`}>
                                Drafts Pending Executive Approval:
                              </div>
                              <div className="space-y-1.5">
                                {msg.richData.approvalStages.map(app => (
                                  <div key={app.refNo} className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                                    isDark ? 'bg-slate-900/80 border-slate-800' : 'bg-white border-blue-100'
                                  }`}>
                                    <div>
                                      <div className="font-mono font-bold text-indigo-400">{app.refNo}</div>
                                      <div className="text-[11px] font-medium">{app.title}</div>
                                      <div className={`text-[10px] mt-0.5 ${T.secondText}`}>
                                        Current: <span className="text-amber-400 font-semibold">{app.currentApprover}</span> ({app.stage})
                                      </div>
                                    </div>
                                    <Link
                                      to="/approvals"
                                      className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[10px] transition-colors"
                                    >
                                      Review Inbox
                                    </Link>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* 5. Referenced Directives */}
                          {msg.referencedCirculars?.length && !msg.richData.actionItems && !msg.richData.complianceData && !msg.richData.approvalStages && (
                            <div className="space-y-1.5 pt-1">
                              <div className={`text-[10px] font-semibold uppercase tracking-wider ${T.labelText}`}>Referenced Governance Directives:</div>
                              {msg.referencedCirculars.map(ref => (
                                <Link
                                  key={ref.id}
                                  to={`/circulars/${ref.id}`}
                                  className={`flex items-center justify-between p-2 rounded-lg border text-[11px] font-medium transition-all group ${
                                    isDark ? 'bg-slate-900/60 border-slate-800 hover:border-indigo-500/50 text-indigo-300' : 'bg-blue-50/60 border-blue-200 hover:border-blue-400 text-blue-800'
                                  }`}
                                >
                                  <div className="flex items-center gap-2 truncate">
                                    <FileText className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                                    <span className="font-mono font-bold">{ref.refNo}</span>
                                    <span className="truncate opacity-80">— {ref.title}</span>
                                  </div>
                                  <ChevronRight className="w-3 h-3 shrink-0 group-hover:translate-x-0.5 transition-transform" />
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                    <span className={`text-[10px] mt-1 font-mono ${T.secondText}`}>{msg.timestamp}</span>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex gap-3">
                  <div className={`w-8 h-8 rounded-full border-2 overflow-hidden shrink-0 ${isDark ? 'bg-slate-800 border-slate-700' : 'bg-[#dbeafe] border-blue-200'}`}>
                    <img src="/cira-agent.jpg" alt="Cira" className="w-full h-full object-cover" />
                  </div>
                  <div className={`rounded-xl rounded-tl-sm px-4 py-3 border flex flex-col gap-1.5 ${T.typingBubble}`}>
                    <div className="flex items-center gap-2 text-[10px] font-mono text-indigo-400">
                      <Cpu className="w-3 h-3 animate-spin" />
                      <span>Processing multi-source RAG query...</span>
                    </div>
                    <div className="flex gap-1.5 items-center h-3">
                      {[0, 150, 300].map(d => (
                        <span key={d} className={`w-2 h-2 rounded-full animate-bounce ${isDark ? 'bg-indigo-400' : 'bg-blue-400'}`} style={{ animationDelay: `${d}ms` }} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Box */}
            <div className={`p-4 border-t transition-colors duration-300 ${isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-blue-50'}`}>
              <form onSubmit={e => { e.preventDefault(); handleSend(); }} className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border transition-colors ${T.inputBg}`}>
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Ask Cira about active circulars, compliance, deadlines, supersessions..."
                  className={`flex-1 bg-transparent text-xs focus:outline-none ${T.primaryText} placeholder:${T.secondText}`}
                  style={{ color: isDark ? '#e2e8f0' : '#1e3a5f' }}
                />
                <button type="submit" className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors shrink-0 shadow-sm ${isDark ? 'bg-indigo-600 hover:bg-indigo-500' : 'bg-blue-600 hover:bg-blue-700'} text-white`}>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
              <div className="flex items-center gap-1.5 mt-1.5 px-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className={`text-[10px] font-mono ${T.secondText}`}>Cira is monitoring 14 institutional directives in real-time</span>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Live Intelligence + Agent Activity ───────────────────────── */}
        <div className="flex flex-col gap-5">

          {/* NAAC Mobile Row (visible < lg) */}
          <div className={`lg:hidden flex items-center gap-2 p-3 rounded-xl border ${T.cardBg}`}>
            <span className={`text-[10px] font-bold uppercase tracking-wider ${T.labelText}`}>Accreditations</span>
            <div className="flex gap-1.5 flex-wrap">
              {accreditations.map(acc => (
                <div key={acc.label} className={`w-9 h-9 rounded-full bg-gradient-to-br ${acc.color} flex flex-col items-center justify-center`}>
                  <span className="text-[7px] font-black text-white leading-none">{acc.label}</span>
                  {acc.sub && <span className="text-[6px] text-white/90">{acc.sub}</span>}
                </div>
              ))}
            </div>
          </div>

          {/* ── LIVE INTELLIGENCE PANEL (Phase 3 Interactive Stats) ── */}
          <div className={`rounded-2xl border overflow-hidden transition-colors duration-300 ${T.cardBg}`}>
            <div className={`px-5 py-4 border-b flex items-center justify-between ${T.divider}`}>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600 dark:text-indigo-400" />
                <h2 className={`text-sm font-black uppercase tracking-wider ${T.primaryText}`}>LIVE INTELLIGENCE</h2>
              </div>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className={`text-[10px] font-semibold text-emerald-600 dark:text-emerald-400`}>Live</span>
              </span>
            </div>

            <div className="p-4 space-y-2.5">
              {[
                { key: 'active' as SlideOverKey, label: 'Active Circulars', value: activeCirculars, icon: <FileText className="w-4 h-4" />, cls: isDark ? 'bg-blue-950/60 text-blue-400 border-blue-800/60' : 'bg-blue-50 text-blue-600 border-blue-100', vc: isDark ? 'text-blue-400' : 'text-blue-700' },
                { key: 'approvals' as SlideOverKey, label: 'Pending Approvals', value: pendingApprovals, icon: <CheckSquare className="w-4 h-4" />, cls: isDark ? 'bg-amber-950/60 text-amber-400 border-amber-800/60' : 'bg-amber-50 text-amber-600 border-amber-100', vc: isDark ? 'text-amber-400' : 'text-amber-700' },
                { key: 'acknowledgements' as SlideOverKey, label: 'Pending Acknowledgements', value: pendingAck.toLocaleString(), icon: <Bell className="w-4 h-4" />, cls: isDark ? 'bg-indigo-950/60 text-indigo-400 border-indigo-800/60' : 'bg-indigo-50 text-indigo-600 border-indigo-100', vc: isDark ? 'text-indigo-400' : 'text-indigo-700' },
                { key: 'actions' as SlideOverKey, label: 'Overdue Actions', value: overdueActions, icon: <AlertCircle className="w-4 h-4" />, cls: isDark ? 'bg-rose-950/60 text-rose-400 border-rose-900/60' : 'bg-red-50 text-red-600 border-red-100', vc: isDark ? 'text-rose-400' : 'text-red-700' },
                { key: 'expiring' as SlideOverKey, label: 'Expiring Soon', value: expiringSoon, icon: <Clock className="w-4 h-4" />, cls: isDark ? 'bg-sky-950/60 text-sky-400 border-sky-800/60' : 'bg-sky-50 text-sky-600 border-sky-100', vc: isDark ? 'text-sky-400' : 'text-sky-700' },
              ].map(({ key, label, value, icon, cls, vc }) => (
                <button
                  key={label}
                  onClick={() => setActiveSlideOver(key)}
                  className={`w-full text-left flex items-center justify-between gap-3 p-3 rounded-xl border transition-all group ${T.kpiRow} cursor-pointer hover:scale-[1.01]`}
                  title={`Click to open detailed ${label} breakdown drawer`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-9 h-9 rounded-lg border flex items-center justify-center shrink-0 ${cls}`}>{icon}</div>
                    <div className={`text-xs font-medium truncate ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>{label}</div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`text-lg font-black font-mono ${vc}`}>{value}</span>
                    <ArrowRight className={`w-3.5 h-3.5 ${T.secondText} group-hover:translate-x-0.5 transition-transform`} />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* ── AGENT ACTIVITY (Phase 3 Live Stream) ── */}
          <div className={`rounded-2xl border overflow-hidden transition-colors duration-300 ${T.cardBg}`}>
            <div className={`px-5 py-4 border-b flex items-center justify-between ${T.divider}`}>
              <div className="flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-600 dark:text-indigo-400" />
                <h2 className={`text-sm font-black uppercase tracking-wider ${T.primaryText}`}>AGENT ACTIVITY</h2>
              </div>
              <button
                onClick={addSimulatedActivity}
                className="text-[10px] font-mono text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors"
                title="Simulate Real-time Agent Event"
              >
                <RefreshCw className="w-2.5 h-2.5" /> Live Pulse
              </button>
            </div>

            <div className="p-4 space-y-2">
              {activities.map(act => (
                <div key={act.id} className={`flex items-start gap-3 p-2.5 rounded-xl border border-transparent transition-colors ${T.actRow}`}>
                  <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${
                    isDark ? 'bg-indigo-950/60 text-indigo-400 border-indigo-800/60' : 'bg-blue-50 text-blue-600 border-blue-200'
                  }`}>
                    {act.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-xs font-bold flex items-center justify-between gap-1 ${T.primaryText}`}>
                      <span className="truncate">{act.action}</span>
                      <span className="text-[9px] font-mono font-normal px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                        {act.tag}
                      </span>
                    </div>
                    <div className={`text-[11px] mt-0.5 truncate ${T.secondText}`}>{act.detail}</div>
                  </div>
                  <span className={`text-[10px] font-mono shrink-0 ${T.secondText}`}>{act.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Navigation */}
          <div className={`rounded-2xl border p-4 transition-colors duration-300 ${T.cardBg}`}>
            <div className={`text-[10px] font-bold uppercase tracking-widest mb-3 ${T.labelText}`}>QUICK NAVIGATION</div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { label: 'New Circular', path: '/circulars/new', icon: BookOpen, cls: T.quickBtn1 },
                { label: 'Analytics', path: '/analytics', icon: BarChart3, cls: T.quickBtn2 },
                { label: 'Approvals', path: '/approvals', icon: CheckSquare, cls: T.quickBtn3 },
                { label: 'Archive', path: '/archive', icon: FileText, cls: T.quickBtn4 },
              ].map(({ label, path, icon: Icon, cls }) => (
                <Link key={path} to={path} className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${cls}`}>
                  <Icon className="w-3.5 h-3.5" /> {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </main>

      {/* ── INTERACTIVE SLIDE-OVER DRAWER MODAL (Phase 3 Feature) ── */}
      {activeSlideOver && (
        <div className="fixed inset-0 z-50 flex justify-end animate-in fade-in duration-200">
          {/* Backdrop */}
          <div
            onClick={() => setActiveSlideOver(null)}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Panel */}
          <div className={`relative w-full max-w-lg h-full shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300 border-l ${
            isDark ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-blue-200 text-slate-900'
          }`}>
            {/* Drawer Header */}
            <div className={`p-5 border-b flex items-center justify-between ${isDark ? 'border-slate-800' : 'border-blue-100'}`}>
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-black text-sm uppercase tracking-wide">
                    {activeSlideOver === 'active' && 'Active Circulars Telemetry'}
                    {activeSlideOver === 'approvals' && 'Pending Approvals Chain'}
                    {activeSlideOver === 'acknowledgements' && 'Pending Acknowledgements Matrix'}
                    {activeSlideOver === 'actions' && 'Action Items & Deadlines'}
                    {activeSlideOver === 'expiring' && 'Circular Review & Expiry SLAs'}
                  </h3>
                  <p className="text-[11px] text-slate-400">Institutional Governance & Compliance Metrics</p>
                </div>
              </div>

              <button
                onClick={() => setActiveSlideOver(null)}
                className={`p-2 rounded-lg border transition-colors ${
                  isDark ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white' : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-slate-900'
                }`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Drawer Content Body */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5">
              {/* Snapshot Metric Cards */}
              <div className="grid grid-cols-2 gap-3">
                <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-blue-50/60 border-blue-100'}`}>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Total Scoped</div>
                  <div className="text-2xl font-black font-mono text-indigo-400 mt-0.5">
                    {activeSlideOver === 'active' && '5 Directives'}
                    {activeSlideOver === 'approvals' && '1 Stage Pending'}
                    {activeSlideOver === 'acknowledgements' && '1,350 Staff'}
                    {activeSlideOver === 'actions' && '0 Overdue (100% SLA)'}
                    {activeSlideOver === 'expiring' && '5 Directives'}
                  </div>
                </div>

                <div className={`p-3.5 rounded-xl border ${isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-blue-50/60 border-blue-100'}`}>
                  <div className="text-[10px] uppercase font-bold text-slate-400">Status Baseline</div>
                  <div className="text-2xl font-black font-mono text-emerald-500 mt-0.5">
                    {activeSlideOver === 'active' && '100% Active'}
                    {activeSlideOver === 'approvals' && 'COO Review'}
                    {activeSlideOver === 'acknowledgements' && '94.2% Ack Rate'}
                    {activeSlideOver === 'actions' && 'On Schedule'}
                    {activeSlideOver === 'expiring' && 'All > 30 Days'}
                  </div>
                </div>
              </div>

              {/* Specific Breakdown Lists */}
              <div className="space-y-3">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
                  <span>Detailed Policy Records</span>
                  <span className="text-[10px] font-mono text-indigo-400">Vignan Repository</span>
                </div>

                <div className="space-y-2">
                  {circulars.slice(0, 4).map(circ => (
                    <div
                      key={circ.id}
                      className={`p-3 rounded-xl border transition-all ${
                        isDark ? 'bg-slate-950/40 border-slate-800 hover:border-slate-700' : 'bg-slate-50 border-slate-200 hover:border-blue-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-xs text-indigo-400">{circ.refNo}</span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          circ.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                        }`}>
                          {circ.status}
                        </span>
                      </div>
                      <div className="text-xs font-semibold mt-1 truncate">{circ.title}</div>
                      <div className="flex items-center justify-between text-[10px] text-slate-400 mt-2 pt-2 border-t border-slate-800/40 font-mono">
                        <span>{circ.issuingAuthority}</span>
                        <span>Eff: {circ.effectiveDate}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Department Breakdown Table */}
              <div className="space-y-2">
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Department Compliance Breakdown
                </div>
                <div className={`rounded-xl border overflow-hidden text-xs ${isDark ? 'border-slate-800 bg-slate-950/40' : 'border-blue-100 bg-slate-50'}`}>
                  {[
                    { dept: 'Legal & Compliance', ack: '100%', status: 'Compliant' },
                    { dept: 'IT & Cyber Security', ack: '98.8%', status: 'Compliant' },
                    { dept: 'Executive Office', ack: '92.0%', status: 'Action Needed' },
                    { dept: 'Human Resources', ack: '89.6%', status: 'Critical Nudge' },
                  ].map((row, i) => (
                    <div key={row.dept} className={`p-2.5 flex items-center justify-between ${i !== 3 ? (isDark ? 'border-b border-slate-800' : 'border-b border-blue-100') : ''}`}>
                      <span className="font-medium">{row.dept}</span>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold">{row.ack}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          row.status === 'Compliant' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                        }`}>
                          {row.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Drawer Footer Actions */}
            <div className={`p-4 border-t flex items-center gap-3 ${isDark ? 'border-slate-800 bg-slate-950' : 'border-blue-100 bg-white'}`}>
              <Link
                to="/circulars"
                onClick={() => setActiveSlideOver(null)}
                className="flex-1 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs text-center transition-colors shadow-sm"
              >
                View in Full Repository
              </Link>
              <button
                onClick={() => { handleNudge(); setActiveSlideOver(null); }}
                className="px-4 py-2 rounded-xl border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 font-bold text-xs transition-colors"
              >
                Dispatch Nudge
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── FOOTER ────────────────────────────────────────────────────────────── */}
      <footer className={`border-t py-3 px-6 transition-colors duration-300 ${T.footerBg}`}>
        <div className="max-w-[1700px] mx-auto flex items-center justify-between text-[11px]">
          <span>© 2026 CircularFlow AI · Agentic AI Hackathon · Vignan's Foundation for Science, Technology & Research</span>
          <span className="flex items-center gap-1.5 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            System Online · {isDark ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </span>
        </div>
      </footer>
    </div>
  );
};

