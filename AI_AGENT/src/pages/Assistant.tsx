import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { mockCirculars, mockDepartmentComplianceData } from '../data/mockData';
import { mockActions } from '../data/mockActions';
import { mockRecipients } from '../data/mockRecipients';
import type { Circular, CopilotMessage, SmartAction, StructuredCard } from '../types';
import { LineageViewer } from '../components/ui/LineageViewer';
import { Bot3D } from '../components/ui/Bot3D';
import { 
  Send, 
  Sparkles, 
  FileText, 
  User, 
  CheckCircle2, 
  Activity, 
  AlertCircle, 
  Clock, 
  CheckSquare, 
  Users, 
  Zap, 
  ArrowRight, 
  Bell, 
  Mail, 
  ShieldCheck, 
  CheckCheck, 
  ChevronRight, 
  Loader2, 
  GitBranch, 
  AlertTriangle, 
  X, 
  ExternalLink,
  Search,
  Filter,
  RotateCcw,
  BookOpen,
  Calendar,
  Building2,
  HelpCircle,
  TrendingUp,
  Award,
  Layers,
} from 'lucide-react';

// ─── Filter Category Type ───────────────────────────────────────────────────
type FilterCategory = 'All' | 'Circulars' | 'Policies' | 'Acknowledgements' | 'Actions' | 'Compliance';

// ─── Agent Context for Follow-Ups ───────────────────────────────────────────
interface AgentContext {
  lastReferencedCircular?: {
    id: string;
    refNo: string;
    title: string;
    department?: string;
    effectiveDate?: string;
    expiryDate?: string;
    status?: string;
    supersedesRef?: string;
    signatoryName?: string;
    signatoryTitle?: string;
    reasonForChange?: string;
    version?: string;
  };
  lastCategory?: FilterCategory;
}

// ─── Response Return Type ───────────────────────────────────────────────────
interface AgentResponseResult {
  text: string;
  thinkingSteps: string[];
  smartActions: SmartAction[];
  referencedCirculars: Array<{ 
    id: string; 
    refNo: string; 
    title: string; 
    department?: string; 
    effectiveDate?: string; 
    status?: string; 
    supersedesRef?: string; 
    reasonForChange?: string; 
  }>;
  conflictData?: {
    oldRuleRef: string;
    oldRuleTitle: string;
    currentRuleRef: string;
    currentRuleTitle: string;
    recommendedAction: string;
    reason: string;
  };
  structuredCard?: StructuredCard;
  contextUpdate?: Partial<AgentContext>;
}

// ─── Phase 8 Unified Institutional AI Intelligence & NLP Engine ──────────────
const getAgentResponse = (query: string, context: AgentContext, activeFilter: FilterCategory): AgentResponseResult => {
  const q = query.toLowerCase().trim();

  // Precomputed datasets for unified live search
  const totalActions = mockActions.length;
  const completedActions = mockActions.filter(a => a.status === 'Completed').length;
  const overdueActions = mockActions.filter(a => a.status === 'Overdue');
  const inProgressActions = mockActions.filter(a => a.status === 'In Progress');
  const notStartedActions = mockActions.filter(a => a.status === 'Not Started');
  const criticalActions = mockActions.filter(a => a.priority === 'Critical' && a.status !== 'Completed');
  const complianceRate = Math.round((completedActions / totalActions) * 100);
  const today = new Date('2026-09-11');

  const dueThisWeek = mockActions.filter(a => {
    const d = new Date(a.deadline);
    const diff = Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff >= 0 && diff <= 7 && a.status !== 'Completed';
  });

  const unacknowledgedRecipients = mockRecipients.filter(
    r => (r.circularId === 'circ-052' || r.circularRef === 'CIR-2026-052') && r.acknowledgementStatus === 'Pending'
  );

  const activeDirectives = mockCirculars.filter(c => c.status === 'Active');
  const supersededDirectives = mockCirculars.filter(c => c.status === 'Superseded');
  const reviewDirectives = mockCirculars.filter(c => c.status === 'Under Review' || c.status === 'Draft');

  const defaultThinkingSteps = [
    `Understanding request: "${query}"`,
    'Searching institutional records across circulars, actions & distribution',
    'Identifying relevant data & cross-referencing policy mandates',
    'Cross-checking circular status, versions & supersessions',
    'Generating verified institutional intelligence answer',
  ];

  // ── Context-Aware Follow-Up Handler ───────────────────────────────────────
  const isFollowUp = (
    q.includes('when did it') || 
    q.includes('what is its effective') || 
    q.includes('who signed it') || 
    q.includes('who approved it') || 
    q.includes('who is the signatory') ||
    q.includes('what does it supersede') ||
    q.includes('which circular did it replace') ||
    q.includes('show its lineage') ||
    q.includes('show its version tree') ||
    q.includes('who has not acknowledged it') ||
    q.includes('what actions does it require')
  );

  if (isFollowUp && context.lastReferencedCircular) {
    const ref = context.lastReferencedCircular;
    const fullCirc = mockCirculars.find(c => c.id === ref.id || c.refNo === ref.refNo);

    // Follow-up: Effective Date
    if (q.includes('effective') || q.includes('when did it') || q.includes('date')) {
      return {
        thinkingSteps: [
          `Understanding follow-up: Checking effective date for context directive ${ref.refNo}`,
          `Searching institutional metadata for ${ref.refNo}`,
          `Identifying effective date record: ${ref.effectiveDate || fullCirc?.effectiveDate || '01 September 2026'}`,
          `Cross-checking status: ${ref.status || fullCirc?.status || 'Active'}`,
          'Generating verified answer',
        ],
        text: `**${ref.refNo}** (*${ref.title}*) became officially effective on **${ref.effectiveDate || fullCirc?.effectiveDate || '01 September 2026'}**.\n\n• **Status:** ${ref.status || 'Active'} (Current Operational Directive)\n• **Issuing Department:** ${ref.department || fullCirc?.departmentBreakdown?.[0]?.department || 'Academic Affairs'}\n• **Expiration/Review:** ${fullCirc?.expiryDate || '2027-08-31'}`,
        smartActions: [
          { id: 'act-ctx-view', label: `View ${ref.refNo}`, actionType: 'view_circular', targetId: ref.id, targetRef: ref.refNo, variant: 'primary' },
          { id: 'act-ctx-lineage', label: 'View Lineage', actionType: 'view_lineage', targetId: ref.id, targetRef: ref.refNo, variant: 'secondary' },
        ],
        referencedCirculars: [ref],
        structuredCard: {
          cardType: 'active_circular',
          badge: 'DIRECTIVE METADATA',
          badgeVariant: 'indigo',
          title: ref.title,
          subtitle: `Reference: ${ref.refNo} (v${ref.version || '3.0'})`,
          status: ref.status || 'Active',
          effectiveDate: ref.effectiveDate || '01 September 2026',
          department: ref.department || 'Academic Affairs',
          supersedesRef: ref.supersedesRef || 'CIR-2026-041',
          keyPoints: [
            `Effective Date: ${ref.effectiveDate || '01 September 2026'}`,
            `Status: ${ref.status || 'Active'}`,
            `Issuing Authority: ${ref.signatoryTitle || fullCirc?.signatoryTitle || 'Dean'}`,
          ],
        },
      };
    }

    // Follow-up: Signatory / Approval
    if (q.includes('sign') || q.includes('approv') || q.includes('authority') || q.includes('who')) {
      const signatory = fullCirc?.signatoryName || ref.signatoryName || 'Prof. K. Rajasekhar';
      const title = fullCirc?.signatoryTitle || ref.signatoryTitle || 'Dean of Academic Affairs';
      return {
        thinkingSteps: [
          `Understanding follow-up: Looking up signatory credentials for ${ref.refNo}`,
          `Inspecting authorization chain for ${ref.refNo}`,
          `Identifying signatory: ${signatory}, ${title}`,
          'Cross-checking electronic signature validity',
          'Generating verified answer',
        ],
        text: `**${ref.refNo}** was officially authorized and signed by **${signatory}**, *${title}*.\n\n• **Issuing Authority:** ${fullCirc?.issuingAuthority || 'Directorate of Academic Affairs'}\n• **Approval Status:** Ratified & Enacted\n• **Binding Scope:** All enrolled students, faculty advisors, and departmental examination committees.`,
        smartActions: [
          { id: 'act-ctx-view-sign', label: `View ${ref.refNo}`, actionType: 'view_circular', targetId: ref.id, targetRef: ref.refNo, variant: 'primary' },
          { id: 'act-ctx-view-lineage-sign', label: 'View Lineage Tree', actionType: 'view_lineage', targetId: ref.id, targetRef: ref.refNo, variant: 'secondary' },
        ],
        referencedCirculars: [ref],
      };
    }

    // Follow-up: Supersession / Replacement
    if (q.includes('supersede') || q.includes('replace') || q.includes('lineage') || q.includes('tree')) {
      return {
        thinkingSteps: [
          `Understanding follow-up: Resolving lineage and supersession for ${ref.refNo}`,
          `Tracing predecessor branches for ${ref.refNo}`,
          `Found predecessor: ${ref.supersedesRef || 'CIR-2026-041'}`,
          'Cross-checking historical archives',
          'Generating lineage response',
        ],
        text: `**${ref.refNo}** directly supersedes **${ref.supersedesRef || 'CIR-2026-041'}**.\n\n**Lineage Progression:**\n1. **CIR-2026-018 (v1.0)** — Initial paper register standard [SUPERSEDED]\n2. **CIR-2026-041 (v2.0)** — 75% manual portal logging [SUPERSEDED]\n3. **${ref.refNo} (v3.0)** — Mandatory 80% biometric verification & LMS sync [CURRENT ACTIVE]`,
        smartActions: [
          { id: 'act-ctx-lineage-open', label: 'Open Lineage Viewer', actionType: 'view_lineage', targetId: ref.id, targetRef: ref.refNo, variant: 'primary' },
          { id: 'act-ctx-view-052', label: `View ${ref.refNo}`, actionType: 'view_circular', targetId: ref.id, targetRef: ref.refNo, variant: 'secondary' },
        ],
        referencedCirculars: [ref],
      };
    }
  }

  // ── Query 1: "Which circular is currently active for attendance?" / "What is the latest attendance policy?"
  if (
    (q.includes('attendance') && (q.includes('active') || q.includes('latest') || q.includes('current') || q.includes('policy') || q.includes('rule') || q.includes('which'))) ||
    q.includes('active attendance') ||
    q.includes('latest attendance')
  ) {
    const activeAttendance = mockCirculars.find(c => c.refNo === 'CIR-2026-052')!;
    return {
      thinkingSteps: [
        'Understanding request: Identifying active attendance governance directive',
        'Searching institutional records across 10 repository circulars',
        'Identifying relevant data: Found 3 attendance versions (CIR-2026-018, CIR-2026-041, CIR-2026-052)',
        'Cross-checking circular status: CIR-2026-052 is the sole ACTIVE directive (v3.0)',
        'Generating verified answer with structured citation card',
      ],
      text: `**CIR-2026-052** (*Revised Attendance and Academic Monitoring Guidelines*) is currently **ACTIVE** and serves as the institutional legal baseline for all academic attendance.\n\n• **Status:** ACTIVE (Effective since 01 September 2026)\n• **Issuing Authority:** Directorate of Academic Affairs (Prof. K. Rajasekhar)\n• **Mandatory Threshold:** **80.0% minimum biometric attendance** across all registered courses\n• **Supersedes:** **CIR-2026-041 (v2.0)** and legacy **CIR-2026-018 (v1.0)**\n\n**Key Rule Updates:**\n1. Replaced manual faculty register logging with automated RFID & biometric turnstiles.\n2. Automated Monday 08:00 AM LMS notifications dispatched to mentors for students below 80%.\n3. Condonation restricted strictly to certified medical emergencies with prior HOD approval.`,
      structuredCard: {
        cardType: 'active_circular',
        badge: 'CURRENT ACTIVE CIRCULAR',
        badgeVariant: 'emerald',
        title: 'Revised Attendance and Academic Monitoring Guidelines (v3.0)',
        subtitle: 'Official Academic Directive for Semester Registration & Examination Eligibility',
        circularRef: 'CIR-2026-052',
        circularId: 'circ-052',
        status: 'ACTIVE',
        effectiveDate: '01 September 2026',
        department: 'Academic Affairs & Student Governance',
        supersedesRef: 'CIR-2026-041',
        keyPoints: [
          'Mandatory 80.0% Biometric/RFID Turnstile Attendance',
          'Automated Weekly LMS Deficit Alerts to Mentors & Parents',
          'Prior CIR-2026-041 (75% manual) formally rescinded & void',
        ],
        metrics: [
          { label: 'Compliance Reach', value: '94.4%', color: 'text-emerald-400' },
          { label: 'Audience Mapped', value: '6,800', color: 'text-indigo-400' },
          { label: 'Required Actions', value: '2 Items', color: 'text-amber-400' },
        ],
      },
      smartActions: [
        { id: 'act-view-052', label: 'View Circular CIR-2026-052', actionType: 'view_circular', targetId: 'circ-052', targetRef: 'CIR-2026-052', variant: 'primary' },
        { id: 'act-lineage-052', label: 'View Attendance Lineage Tree', actionType: 'view_lineage', targetId: 'circ-052', targetRef: 'CIR-2026-052', variant: 'secondary' },
        { id: 'act-recipients-052', label: 'Check Acknowledgements (80%)', actionType: 'check_status', variant: 'secondary' },
      ],
      referencedCirculars: [
        {
          id: 'circ-052',
          refNo: 'CIR-2026-052',
          title: 'Revised Attendance and Academic Monitoring Guidelines (v3.0)',
          department: 'Academic Affairs',
          effectiveDate: '01 September 2026',
          status: 'Active',
          supersedesRef: 'CIR-2026-041',
          reasonForChange: 'Mandatory 80% biometric threshold & automated weekly LMS sync.',
        },
      ],
      conflictData: {
        oldRuleRef: 'CIR-2026-041 (v2.0)',
        oldRuleTitle: 'Allowed manual portal logging with 75% attendance criteria',
        currentRuleRef: 'CIR-2026-052 (v3.0)',
        currentRuleTitle: 'Strict 80% biometric verification with automated LMS deficit escalations',
        recommendedAction: 'Apply CIR-2026-052 because it is the latest active circular.',
        reason: 'CIR-2026-041 was formally rescinded on August 31, 2026 and carries zero legal validity.',
      },
      contextUpdate: {
        lastReferencedCircular: {
          id: 'circ-052',
          refNo: 'CIR-2026-052',
          title: 'Revised Attendance and Academic Monitoring Guidelines (v3.0)',
          department: 'Academic Affairs',
          effectiveDate: '01 September 2026',
          expiryDate: '2027-08-31',
          status: 'Active',
          supersedesRef: 'CIR-2026-041',
          signatoryName: 'Prof. K. Rajasekhar',
          signatoryTitle: 'Dean of Academic Affairs',
          version: '3.0',
        },
      },
    };
  }

  // ── Query 2: "Which circular superseded the previous one?" / "Which circular superseded the previous attendance circular?" / "Show me the history of attendance circulars."
  if (
    q.includes('superseded') || 
    q.includes('supersede') || 
    q.includes('history of attendance') || 
    q.includes('attendance history') || 
    q.includes('previous attendance') || 
    q.includes('version tree') || 
    q.includes('lineage')
  ) {
    return {
      thinkingSteps: [
        'Understanding request: Tracing supersession lineage and version evolution',
        'Searching institutional repository for historical version chains',
        'Identifying relevant data: 3 generations of Attendance Directives detected',
        'Cross-checking circular status: Validating v1.0 (2023) ➔ v2.0 (2025) ➔ v3.0 (2026)',
        'Generating verified lineage response with interactive graph links',
      ],
      text: `**CIR-2026-052 (v3.0)** superseded the previous attendance circular **CIR-2026-041 (v2.0)** on **September 1, 2026**.\n\n**Complete Attendance Directives Lineage Tree:**\n\n1. **CIR-2026-018 (v1.0)** — *Foundational Attendance & Class Engagement*\n   • *Effective:* Sep 2023 – Jul 2025 · *Status:* 🔴 **SUPERSEDED**\n   • *Baseline:* Paper registers, manual semester auditing.\n\n2. **CIR-2026-041 (v2.0)** — *Attendance & Academic Monitoring Guidelines*\n   • *Effective:* Aug 2025 – Aug 2026 · *Status:* 🔴 **SUPERSEDED**\n   • *Baseline:* Faculty portal submissions, 75% attendance criterion.\n\n3. **CIR-2026-052 (v3.0)** — *Revised Attendance and Academic Monitoring Guidelines*\n   • *Effective:* **01 Sep 2026 – Present** · *Status:* 🟢 **ACTIVE**\n   • *Baseline:* **80.0% Biometric/RFID threshold + Automated LMS deficit alerts**.\n\n*(Other active supersessions: **CIRC-2026-089** superseded **CIRC-2024-042**; **CIRC-2026-092** superseded **CIRC-2025-014**).*`,
      structuredCard: {
        cardType: 'supersession',
        badge: 'SUPERSESSION & LINEAGE AUDIT',
        badgeVariant: 'indigo',
        title: 'Institutional Attendance Policy Evolution (v1.0 ➔ v2.0 ➔ v3.0)',
        subtitle: 'Formal Legislative Lineage Chain & Deprecation Audit',
        circularRef: 'CIR-2026-052',
        circularId: 'circ-052',
        status: 'ACTIVE',
        effectiveDate: '01 September 2026',
        department: 'Academic Affairs',
        supersedesRef: 'CIR-2026-041',
        keyPoints: [
          'v1.0 (CIR-2026-018): 2023 Baseline Paper Register System [SUPERSEDED]',
          'v2.0 (CIR-2026-041): 2025 75% Manual Web Portal Logging [SUPERSEDED]',
          'v3.0 (CIR-2026-052): 2026 80% Biometric Integration & LMS Sync [ACTIVE]',
        ],
        metrics: [
          { label: 'Historical Revisions', value: '3 Generations', color: 'text-indigo-400' },
          { label: 'Active Baseline', value: 'CIR-2026-052', color: 'text-emerald-400' },
          { label: 'Archived Versions', value: '2 Directives', color: 'text-slate-400' },
        ],
      },
      smartActions: [
        { id: 'act-view-lineage-modal', label: 'View Lineage Visual Tree', actionType: 'view_lineage', targetId: 'circ-052', targetRef: 'CIR-2026-052', variant: 'primary' },
        { id: 'act-view-current-052', label: 'View CIR-2026-052 Details', actionType: 'view_circular', targetId: 'circ-052', targetRef: 'CIR-2026-052', variant: 'secondary' },
        { id: 'act-archive-registry', label: 'Explore Lineage Registry', actionType: 'view_audit', variant: 'secondary' },
      ],
      referencedCirculars: [
        { id: 'circ-052', refNo: 'CIR-2026-052', title: 'Revised Attendance Guidelines (v3.0)', department: 'Academic Affairs', effectiveDate: '01 Sep 2026', status: 'Active', supersedesRef: 'CIR-2026-041' },
        { id: 'circ-041', refNo: 'CIR-2026-041', title: 'Attendance Guidelines (v2.0) [SUPERSEDED]', department: 'Academic Affairs', effectiveDate: '01 Aug 2025', status: 'Superseded', supersedesRef: 'CIR-2026-018' },
        { id: 'circ-018', refNo: 'CIR-2026-018', title: 'Foundational Attendance (v1.0) [SUPERSEDED]', department: 'Academic Affairs', effectiveDate: '01 Sep 2023', status: 'Superseded' },
      ],
      contextUpdate: {
        lastReferencedCircular: {
          id: 'circ-052',
          refNo: 'CIR-2026-052',
          title: 'Revised Attendance and Academic Monitoring Guidelines (v3.0)',
          department: 'Academic Affairs',
          effectiveDate: '01 September 2026',
          status: 'Active',
          supersedesRef: 'CIR-2026-041',
          version: '3.0',
        },
      },
    };
  }

  // ── Query 3: "Who has not acknowledged the latest circular?" / "Who needs to be reminded?" / "Who hasn't acknowledged?"
  if (
    q.includes('who has not acknowledged') || 
    q.includes("who hasn't acknowledged") || 
    q.includes('pending ack') || 
    q.includes('not signed') ||
    q.includes('who needs to be reminded') ||
    q.includes('reminded') ||
    q.includes('pending recipients') ||
    (q.includes('who') && q.includes('acknowledged'))
  ) {
    return {
      thinkingSteps: [
        'Understanding request: Scanning acknowledgement records for latest active directive CIR-2026-052',
        'Searching institutional distribution telemetry across enrolled cohorts',
        'Identifying relevant data: 20 recipients mapped across CSE, Academic Affairs, and Operations',
        'Cross-checking signature ledger: 16 verified signatures, 4 pending sign-offs',
        'Generating recipient breakdown and one-click reminder dispatch action',
      ],
      text: `**4 recipients** have not yet acknowledged the latest circular **CIR-2026-052** (*Revised Attendance and Academic Monitoring Guidelines*):\n\n1. **Vikramaditya Rao** — *Student*, CSE (\`vikram.22cse088@vignan.ac.in\`)\n   • *Status:* 🔴 Delivered (Unopened) · Reminders sent: 1\n2. **Amit Joshi** — *Student*, Operations & Supply (\`amit.22ece012@vignan.ac.in\`)\n   • *Status:* 🟡 Read (Opened at 09:30 AM, Pending Signature)\n3. **Karthik Nambiar** — *Student*, CSE (\`karthik.22cse055@vignan.ac.in\`)\n   • *Status:* 🔴 Network Retry / Transmission Pending\n4. **Pooja Hegde** — *Student*, CSE (\`pooja.22cse189@vignan.ac.in\`)\n   • *Status:* 🔴 Delivered (Unopened)\n\n**Acknowledgement Summary:**\n• **Total Cohort:** 20 Recipients · **Acknowledged:** **80% (16/20)** · **Pending:** **20% (4/20)**\n• Faculty Compliance: **100%** (4/4 HODs & Deans acknowledged).`,
      structuredCard: {
        cardType: 'recipients_summary',
        badge: 'DISTRIBUTION & ACKNOWLEDGEMENT TELEMETRY',
        badgeVariant: 'sky',
        title: 'Recipients Acknowledgement Ledger — CIR-2026-052',
        subtitle: 'Real-time multi-channel delivery and formal digital signature tracking',
        circularRef: 'CIR-2026-052',
        circularId: 'circ-052',
        status: 'ACTIVE',
        department: 'Academic Affairs',
        keyPoints: [
          '4 pending student recipients require immediate follow-up nudge',
          'Faculty & HOD cohort achieved 100% acknowledgement compliance',
          'Automated escalation triggers in 48 hours for unacknowledged recipients',
        ],
        metrics: [
          { label: 'Overall Ack Rate', value: '80.0%', color: 'text-emerald-400' },
          { label: 'Acknowledged', value: '16 / 20', color: 'text-indigo-400' },
          { label: 'Pending Nudge', value: '4 Users', color: 'text-rose-400' },
          { label: 'Read Engagement', value: '80.0%', color: 'text-sky-400' },
        ],
      },
      smartActions: [
        { id: 'act-send-reminders-4', label: 'Send Reminders to 4 Pending', actionType: 'send_reminder', targetId: 'circ-052', targetRef: 'CIR-2026-052', variant: 'primary' },
        { id: 'act-view-recipients-ledger', label: 'View Recipients Table', actionType: 'check_status', variant: 'secondary' },
        { id: 'act-view-circ-052-ack', label: 'View Circular CIR-2026-052', actionType: 'view_circular', targetId: 'circ-052', targetRef: 'CIR-2026-052', variant: 'secondary' },
      ],
      referencedCirculars: [
        { id: 'circ-052', refNo: 'CIR-2026-052', title: 'Revised Attendance Guidelines (v3.0)', department: 'Academic Affairs', effectiveDate: '01 Sep 2026', status: 'Active' },
      ],
      contextUpdate: {
        lastReferencedCircular: {
          id: 'circ-052',
          refNo: 'CIR-2026-052',
          title: 'Revised Attendance and Academic Monitoring Guidelines (v3.0)',
          department: 'Academic Affairs',
          effectiveDate: '01 September 2026',
          status: 'Active',
          supersedesRef: 'CIR-2026-041',
          version: '3.0',
        },
      },
    };
  }

  // ── Query 4: "What actions are due this week?" / "What are upcoming actions?"
  if (
    (q.includes('due this week') || q.includes('due soon') || q.includes('upcoming action') || q.includes('this week')) &&
    (q.includes('action') || q.includes('due') || q.includes('task'))
  ) {
    return {
      thinkingSteps: [
        'Understanding request: Computing 7-day action item deadline window (Sep 11–18, 2026)',
        'Searching institutional action registry across all 6 active directives',
        'Identifying relevant data: 2 non-completed actions due within the next 7 days',
        'Cross-checking responsible roles and department assignments',
        'Generating prioritized weekly action briefing',
      ],
      text: `**${dueThisWeek.length} compliance actions are due this week** (September 11–18, 2026):\n\n${dueThisWeek.map((a, i) => {
        const diff = Math.ceil((new Date(a.deadline).getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
        return `${i + 1}. **${a.title}**\n   • *Deadline:* **${diff === 0 ? 'TODAY ⚠️' : `in ${diff} days (Sep ${new Date(a.deadline).getDate()})`}** · *Priority:* \`${a.priority}\`\n   • *Circular:* **${a.sourceCircularRef}** · *Assignee:* **${a.responsibleRole}** (${a.department})\n   • *Status:* ${a.status}`;
      }).join('\n\n')}`,
      structuredCard: {
        cardType: 'actions_summary',
        badge: 'ACTION TIMELINE BRIEFING',
        badgeVariant: 'amber',
        title: 'High-Priority Actions Due This Week (Sep 11–18, 2026)',
        subtitle: 'Enforced compliance milestones derived from active institutional directives',
        keyPoints: [
          'Sync Biometric Gate Logs with Campus ERP & LMS (CIR-2026-052) — Due Sep 15',
          'Reconfigure ERP Financial Approval Matrix (CIRC-2026-092) — Due Sep 15',
        ],
        metrics: [
          { label: 'Due This Week', value: `${dueThisWeek.length} Items`, color: 'text-amber-400' },
          { label: 'Critical Overdue', value: `${overdueActions.length} Items`, color: 'text-rose-400' },
          { label: 'Overall Completion', value: `${complianceRate}%`, color: 'text-indigo-400' },
        ],
      },
      smartActions: [
        { id: 'act-view-actions-page', label: 'View All Actions (18)', actionType: 'check_status', variant: 'primary' },
        { id: 'act-view-overdue-filter', label: 'View Overdue Items', actionType: 'check_status', variant: 'warning' },
      ],
      referencedCirculars: [
        { id: 'circ-052', refNo: 'CIR-2026-052', title: 'Revised Attendance Guidelines (v3.0)', department: 'Academic Affairs', effectiveDate: '01 Sep 2026', status: 'Active' },
        { id: 'circ-002', refNo: 'CIRC-2026-092', title: 'Financial Signing Authority (v2.1)', department: 'Finance & Audit', effectiveDate: '10 Sep 2026', status: 'Active' },
      ],
    };
  }

  // ── Query 5: "Which actions are overdue?" / "Show overdue actions"
  if (
    q.includes('overdue') || 
    q.includes('past due') || 
    q.includes('which actions are overdue') || 
    q.includes('show overdue')
  ) {
    return {
      thinkingSteps: [
        'Understanding request: Filtering compliance action registry for overdue items',
        'Searching institutional directives for missed compliance deadlines',
        'Identifying relevant data: Found 4 overdue action items requiring escalation',
        'Cross-checking responsible assignees & department HOD contacts',
        'Generating escalation notice with one-click reminder broadcast',
      ],
      text: `**${overdueActions.length} compliance actions are currently OVERDUE** and require immediate administrative escalation:\n\n${overdueActions.map((a, i) => `${i + 1}. **${a.title}** ⚠️\n   • *Source Directive:* **${a.sourceCircularRef}** (${a.sourceCircularTitle})\n   • *Responsible:* **${a.responsibleRole}** — *Dept:* **${a.department}**\n   • *Deadline:* \`${new Date(a.deadline).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}\` (PASSED)\n   • *Priority:* \`${a.priority}\``).join('\n\n')}\n\n**Executive Summary:**\n• Overdue Rate: **${Math.round((overdueActions.length / totalActions) * 100)}%** of all action mandates (${overdueActions.length}/${totalActions}).\n• Institutional Completion Rate: **${complianceRate}%** (${completedActions}/${totalActions} completed).`,
      structuredCard: {
        cardType: 'actions_summary',
        badge: 'OVERDUE ACTIONS ESCALATION',
        badgeVariant: 'rose',
        title: `${overdueActions.length} Overdue Compliance Directives Require Immediate HOD Action`,
        subtitle: 'Enforcement alerts flagged by CircularFlow AI Rule Engine',
        keyPoints: [
          'IT & Cyber Security: AI Gateway Telemetry token logging overdue (CIRC-2026-089)',
          'CSE & Academic Systems: Biometric turnstile firmware sync overdue (CIR-2026-052)',
          'Automated HOD escalation notices queued for immediate dispatch',
        ],
        metrics: [
          { label: 'Overdue Items', value: `${overdueActions.length}`, color: 'text-rose-400' },
          { label: 'Critical Risk', value: `${overdueActions.filter(a => a.priority === 'Critical').length} Items`, color: 'text-amber-400' },
          { label: 'Completed Actions', value: `${completedActions}`, color: 'text-emerald-400' },
        ],
      },
      smartActions: [
        { id: 'act-view-overdue-screen', label: `View ${overdueActions.length} Overdue Actions`, actionType: 'check_status', variant: 'primary' },
        { id: 'act-escalate-hods', label: 'Escalate to HODs (Send Nudge)', actionType: 'send_reminder', variant: 'warning' },
        { id: 'act-open-actions', label: 'Open Actions Dashboard', actionType: 'check_status', variant: 'secondary' },
      ],
      referencedCirculars: [
        { id: 'circ-001', refNo: 'CIRC-2026-089', title: 'Enterprise AI Safety Governance (v3.0)', status: 'Active', effectiveDate: '01 Sep 2026' },
        { id: 'circ-052', refNo: 'CIR-2026-052', title: 'Revised Attendance Guidelines (v3.0)', status: 'Active', effectiveDate: '01 Sep 2026' },
      ],
    };
  }

  // ── Query 6: "What is our compliance rate?" / "What is the current compliance rate?"
  if (
    q.includes('compliance rate') || 
    q.includes('compliance score') || 
    q.includes('how compliant') || 
    q.includes('what is our compliance') ||
    (q.includes('compliance') && q.includes('rate'))
  ) {
    return {
      thinkingSteps: [
        'Understanding request: Computing institutional compliance and acknowledgement benchmarks',
        'Searching institutional records across 18 action items and 10 circular distributions',
        'Identifying relevant data: Aggregating completion percentages across all departments',
        'Cross-checking action status and acknowledgement percentages',
        'Generating comprehensive compliance scorecard',
      ],
      text: `**Institutional Compliance Scorecard** as of **September 11, 2026**:\n\n• **Action Execution Compliance Rate:** **${complianceRate}%** (${completedActions} of ${totalActions} actions completed)\n• **Policy Acknowledgement Compliance Rate:** **94.2%** across 14,250 institutional recipients\n• **Active Directives in Force:** **5 Active Circulars** (4 historical circulars properly superseded)\n\n**Action Item Breakdown:**\n• ✅ **Completed:** ${completedActions} actions (${complianceRate}%)\n• 🔵 **In Progress:** ${inProgressActions.length} actions\n• ⚪ **Not Started:** ${notStartedActions.length} actions\n• ⚠️ **Overdue:** ${overdueActions.length} actions (${overdueActions.filter(a => a.priority === 'Critical').length} Critical)\n\n**Department Compliance Leaders:**\n1. Legal & Compliance: **99.4%**\n2. IT & Cyber Security: **98.8%**\n3. Finance & Audit: **98.1%**`,
      structuredCard: {
        cardType: 'compliance_summary',
        badge: 'INSTITUTIONAL COMPLIANCE METRICS',
        badgeVariant: 'emerald',
        title: 'Institutional Governance & Compliance Health Scorecard',
        subtitle: 'Audited performance across active policies, task execution, and acknowledgement signatures',
        keyPoints: [
          `Action Item Execution Rate: ${complianceRate}% (${completedActions}/${totalActions} completed)`,
          'Audience Acknowledgement Rate: 94.2% (14,250 total reach)',
          'Top Performing Department: Legal & Compliance (99.4% score)',
        ],
        metrics: [
          { label: 'Action Compliance', value: `${complianceRate}%`, color: 'text-emerald-400' },
          { label: 'Ack Rate', value: '94.2%', color: 'text-indigo-400' },
          { label: 'Active Rules', value: `${activeDirectives.length}`, color: 'text-sky-400' },
          { label: 'Overdue Items', value: `${overdueActions.length}`, color: 'text-rose-400' },
        ],
      },
      smartActions: [
        { id: 'act-view-compliance-dash', label: 'View Department Breakdown', actionType: 'check_status', variant: 'primary' },
        { id: 'act-view-overdue-comp', label: 'Inspect Overdue Tasks', actionType: 'check_status', variant: 'warning' },
        { id: 'act-view-actions-comp', label: 'Open Actions Dashboard', actionType: 'check_status', variant: 'secondary' },
      ],
      referencedCirculars: [
        { id: 'circ-001', refNo: 'CIRC-2026-089', title: 'Enterprise AI Safety Governance (v3.0)', status: 'Active', effectiveDate: '01 Sep 2026' },
        { id: 'circ-052', refNo: 'CIR-2026-052', title: 'Revised Attendance Guidelines (v3.0)', status: 'Active', effectiveDate: '01 Sep 2026' },
      ],
    };
  }

  // ── Query 7: "Which department has the most pending actions?" / "Which departments have pending compliance actions?"
  if (
    (q.includes('department') && (q.includes('pending') || q.includes('most') || q.includes('action') || q.includes('compliance'))) ||
    q.includes('which department') ||
    q.includes('department pending')
  ) {
    const deptMap: Record<string, number> = {};
    mockActions.filter(a => a.status !== 'Completed').forEach(a => {
      deptMap[a.department] = (deptMap[a.department] || 0) + 1;
    });
    const sortedDepts = Object.entries(deptMap).sort((a, b) => b[1] - a[1]);
    const topDept = sortedDepts[0];

    return {
      thinkingSteps: [
        'Understanding request: Aggregating unfinished action items by institutional department',
        'Searching institutional action registry for uncompleted tasks',
        'Identifying relevant data: Grouping 12 pending actions across 4 departments',
        'Cross-checking department risk weightings and overdue deadlines',
        'Generating ranked departmental risk distribution',
      ],
      text: `**Departmental Pending Actions Risk Ranking:**\n\n${sortedDepts.map(([dept, count], i) => `${i + 1}. **${dept}** — **${count} pending action${count > 1 ? 's' : ''}** (${mockActions.filter(a => a.department === dept && a.status === 'Overdue').length} overdue)`).join('\n')}\n\n**Highest Risk Department:** **${topDept?.[0] || 'IT & Cyber Security'}** with **${topDept?.[1] || 4} pending compliance obligations**.\n\n**Recommendation:** Prioritize HOD review with **${topDept?.[0]}** regarding overdue telemetry & gateway configurations.`,
      structuredCard: {
        cardType: 'actions_summary',
        badge: 'DEPARTMENT RISK DISTRIBUTION',
        badgeVariant: 'amber',
        title: `Highest Risk: ${topDept?.[0] || 'IT & Cyber Security'} (${topDept?.[1] || 4} Pending Actions)`,
        subtitle: 'Cross-departmental action item load and compliance risk analysis',
        keyPoints: [
          `${topDept?.[0] || 'IT & Cyber Security'} holds the highest uncompleted action backlog`,
          'Overdue critical tasks require direct HOD intervention',
          'Legal & Compliance department achieved highest on-time turnaround',
        ],
        metrics: sortedDepts.slice(0, 3).map(([d, c]) => ({
          label: d.split('&')[0].trim(),
          value: `${c} Pending`,
          color: c >= 3 ? 'text-rose-400' : 'text-amber-400',
        })),
      },
      smartActions: [
        { id: 'act-view-dept-actions', label: 'View All Pending Actions', actionType: 'check_status', variant: 'primary' },
        { id: 'act-escalate-top-dept', label: `Escalate to ${topDept?.[0] || 'HODs'}`, actionType: 'send_reminder', variant: 'warning' },
      ],
      referencedCirculars: [
        { id: 'circ-001', refNo: 'CIRC-2026-089', title: 'Enterprise AI Safety Governance (v3.0)', department: 'IT & Cyber Security', status: 'Active' },
        { id: 'circ-052', refNo: 'CIR-2026-052', title: 'Revised Attendance Guidelines (v3.0)', department: 'Academic Affairs', status: 'Active' },
      ],
    };
  }

  // ── Query 8: "Show circulars awaiting approval." / "Show circulars under review"
  if (
    q.includes('approval') || 
    q.includes('awaiting') || 
    q.includes('under review') || 
    q.includes('pending approval') || 
    q.includes('review')
  ) {
    const underReview = mockCirculars.filter(c => c.status === 'Under Review' || c.status === 'Draft');
    return {
      thinkingSteps: [
        'Understanding request: Inspecting in-flight policy drafting & signatory stages',
        'Searching circular repository for Under Review and Draft status directives',
        'Identifying relevant data: Found CIRC-2026-095 (Occupational Health & Emergency Evacuation Directive)',
        'Cross-checking stage signatures: Stage 2 of 3 (COO Sign-Off Pending)',
        'Generating approval workflow summary',
      ],
      text: `There are currently **${underReview.length} circulars awaiting executive sign-off**:\n\n1. **CIRC-2026-095** — *Occupational Health & Emergency Evacuation Directive 2026*\n   • *Stage:* **Stage 2 of 3 (COO Sign-Off Pending)**\n   • *Signatory Required:* **Dr. Eleanor Vance** (*Chief Operating Officer*)\n   • *Effective Date:* 01 October 2026\n   • *AI Conflict Check:* Minor Overlay (Assembly zone numbers verified with Facility B)\n   • *Supersession Target:* Once ratified, it will supersede legacy memo CIRC-2023-011.\n\n2. **CIRC-2026-101** — *Hybrid Workforce Attendance & Flexible Hours (Draft)*\n   • *Stage:* Draft Internal Review\n   • *Department:* Human Resources`,
      structuredCard: {
        cardType: 'expiring_summary',
        badge: 'APPROVAL WORKFLOW INBOX',
        badgeVariant: 'sky',
        title: 'CIRC-2026-095 — Awaiting Chief Operating Officer Ratification',
        subtitle: 'Stage 2/3 multi-tier electronic approval chain',
        circularRef: 'CIRC-2026-095',
        circularId: 'circ-003',
        status: 'Under Review',
        effectiveDate: '01 October 2026',
        department: 'Health, Safety & Environment',
        keyPoints: [
          'HSE Risk Assessment completed & verified by Director Evelyn Vance',
          'Legal Regulatory Scrutiny in progress by Julian Bell',
          'COO Marcus Vance pending final electronic seal',
        ],
        metrics: [
          { label: 'Stage Progress', value: 'Stage 2/3', color: 'text-amber-400' },
          { label: 'Enactment Target', value: '01 Oct 2026', color: 'text-indigo-400' },
          { label: 'Conflict Check', value: 'Minor Overlay', color: 'text-sky-400' },
        ],
      },
      smartActions: [
        { id: 'act-open-approvals', label: 'Open Approval Inbox', actionType: 'start_approval', variant: 'primary' },
        { id: 'act-view-095-circ', label: 'Review CIRC-2026-095 Draft', actionType: 'view_circular', targetId: 'circ-003', targetRef: 'CIRC-2026-095', variant: 'secondary' },
      ],
      referencedCirculars: [
        { id: 'circ-003', refNo: 'CIRC-2026-095', title: 'Occupational Health & Emergency Evacuation Directive 2026', department: 'Health & Safety', effectiveDate: '01 Oct 2026', status: 'Under Review' },
      ],
    };
  }

  // ── Query 9: "Which circulars are expiring soon?" / "Expiring circulars"
  if (
    q.includes('expiring') || 
    q.includes('expire') || 
    q.includes('expiration') || 
    q.includes('expiring soon')
  ) {
    return {
      thinkingSteps: [
        'Understanding request: Scanning institutional policy repository for expiration dates & review cycles',
        'Searching circular records for active and superseded validity windows',
        'Identifying relevant data: 2 superseded legacy policies expired; 2 active directives have annual reviews',
        'Cross-checking annual recertification calendars',
        'Generating policy expiration and review schedule',
      ],
      text: `**Institutional Policy Expiration & Renewal Schedule:**\n\n🔴 **Recently Expired / Superseded Directives (Archived):**\n1. **CIR-2026-041** (*Attendance Guidelines v2.0*) — Expired **31 August 2026** (Superseded by CIR-2026-052)\n2. **CIRC-2024-042** (*Interim AI Guidelines v2.0*) — Expired **31 August 2026** (Superseded by CIRC-2026-089)\n3. **CIRC-2025-014** (*Financial Signing Matrix*) — Expired **09 September 2026** (Superseded by CIRC-2026-092)\n\n🟢 **Active Directives with Upcoming Annual Review Cycles:**\n• **CIRC-2026-089 (AI Governance v3.0):** Active through **31 August 2027** (Annual audit due July 2027)\n• **CIR-2026-052 (Attendance v3.0):** Active through **31 August 2027** (Semester review due Dec 2026)\n• **CIRC-2026-092 (Financial Limits v2.1):** Active through **09 September 2028**`,
      structuredCard: {
        cardType: 'expiring_summary',
        badge: 'POLICY VALIDITY & EXPIRATION AUDIT',
        badgeVariant: 'amber',
        title: 'Institutional Directive Validity & Renewal Schedule',
        subtitle: 'Formal expiration dates, sunset provisions, and annual compliance audit windows',
        keyPoints: [
          'All legacy v1.0/v2.0 policies successfully sunsetted with zero active conflicts',
          'Current active v3.0 directives valid through 2027/2028 academic cycles',
          'Automated 90-day pre-expiry renewal notices enabled in CircularFlow AI',
        ],
        metrics: [
          { label: 'Active Directives', value: `${activeDirectives.length}`, color: 'text-emerald-400' },
          { label: 'Archived / Sunset', value: `${supersededDirectives.length}`, color: 'text-slate-400' },
          { label: 'Next Review', value: 'Dec 2026', color: 'text-indigo-400' },
        ],
      },
      smartActions: [
        { id: 'act-view-all-active-circ', label: 'View Active Directives', actionType: 'view_circular', variant: 'primary' },
        { id: 'act-view-lineage-registry', label: 'Inspect Lineage Registry', actionType: 'view_audit', variant: 'secondary' },
      ],
      referencedCirculars: [
        { id: 'circ-001', refNo: 'CIRC-2026-089', title: 'Enterprise AI Safety Governance (v3.0)', status: 'Active', effectiveDate: '01 Sep 2026' },
        { id: 'circ-052', refNo: 'CIR-2026-052', title: 'Revised Attendance Guidelines (v3.0)', status: 'Active', effectiveDate: '01 Sep 2026' },
      ],
    };
  }

  // ── Query 10: "Show critical actions" / "What are the critical actions?"
  if (
    q.includes('critical action') || 
    q.includes('show critical') || 
    (q.includes('critical') && q.includes('action'))
  ) {
    return {
      thinkingSteps: [
        'Understanding request: Filtering critical-priority compliance mandates',
        'Searching institutional action registry for CRITICAL rated items',
        'Identifying relevant data: 4 critical items requiring urgent operational attention',
        'Cross-checking assignees and deadlines',
        'Generating executive critical action briefing',
      ],
      text: `**${criticalActions.length} CRITICAL actions require immediate executive attention:**\n\n${criticalActions.map((a, i) => `${i + 1}. **${a.title}**\n   • *Status:* \`${a.status}\` · *Source:* **${a.sourceCircularRef}**\n   • *Assignee:* **${a.responsibleRole}** (${a.department})\n   • *Deadline:* \`${new Date(a.deadline).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}\``).join('\n\n')}\n\n**Risk Impact:** Critical actions directly govern data privacy, financial approval limits, and campus biometric systems.`,
      structuredCard: {
        cardType: 'actions_summary',
        badge: 'CRITICAL ACTIONS REGISTRY',
        badgeVariant: 'rose',
        title: `${criticalActions.length} Critical Actions Mandated by Current Active Directives`,
        subtitle: 'High-urgency governance and regulatory compliance milestones',
        keyPoints: [
          'Appoint Departmental AI Risk Officer (CIRC-2026-089) — IT & Cyber Security',
          'Configure AI Gateway Telemetry (CIRC-2026-089) — Overdue item',
          'Reconfigure ERP Financial Signing Hierarchy (CIRC-2026-092)',
        ],
        metrics: [
          { label: 'Critical Tasks', value: `${criticalActions.length}`, color: 'text-rose-400' },
          { label: 'Overdue Critical', value: `${overdueActions.filter(a => a.priority === 'Critical').length}`, color: 'text-amber-400' },
          { label: 'Total Actions', value: `${totalActions}`, color: 'text-indigo-400' },
        ],
      },
      smartActions: [
        { id: 'act-view-critical-actions', label: 'View Critical Actions', actionType: 'check_status', variant: 'primary' },
        { id: 'act-view-circ-089', label: 'View CIRC-2026-089', actionType: 'view_circular', targetId: 'circ-001', targetRef: 'CIRC-2026-089', variant: 'warning' },
      ],
      referencedCirculars: [
        { id: 'circ-001', refNo: 'CIRC-2026-089', title: 'Enterprise AI Safety Governance (v3.0)', status: 'Active', effectiveDate: '01 Sep 2026' },
        { id: 'circ-002', refNo: 'CIRC-2026-092', title: 'Financial Signing Authority (v2.1)', status: 'Active', effectiveDate: '10 Sep 2026' },
      ],
    };
  }

  // ── Query 11: General "Which circular is currently active?"
  if (
    q.includes('which circular') || 
    q.includes('which rule') || 
    q.includes('current rule') || 
    q.includes('active circular')
  ) {
    return {
      thinkingSteps: defaultThinkingSteps,
      text: `Current active institutional rules as of **September 2026**:\n\n1. **CIR-2026-052 (v3.0)** — *Revised Attendance & Academic Monitoring Guidelines*\n   • *Supersedes:* CIR-2026-041 · *Status:* 🟢 ACTIVE\n2. **CIRC-2026-089 (v3.0)** — *Enterprise AI Safety Governance & Data Protection Protocol*\n   • *Supersedes:* CIRC-2024-042 · *Status:* 🟢 ACTIVE\n3. **CIRC-2026-092 (v2.1)** — *Financial Signing Authority & Delegation Matrix*\n   • *Supersedes:* CIRC-2025-014 · *Status:* 🟢 ACTIVE\n4. **CIRC-2026-068 (v1.0)** — *Vendor Risk Management Standards*\n   • *Status:* 🟢 ACTIVE\n5. **CIRC-2026-044 (v1.2)** — *Clean Desk & Physical Document Disposal*\n   • *Status:* 🟢 ACTIVE`,
      structuredCard: {
        cardType: 'active_circular',
        badge: 'ACTIVE INSTITUTIONAL DIRECTIVES',
        badgeVariant: 'emerald',
        title: '5 Active Institutional Circulars Currently in Legal Force',
        subtitle: 'Ratified policy baselines across Academic, IT, Finance, and Safety domains',
        keyPoints: [
          'CIR-2026-052: 80% biometric attendance standard (Supersedes CIR-2026-041)',
          'CIRC-2026-089: AI Gateway routing & PII hygiene (Supersedes CIRC-2024-042)',
          'CIRC-2026-092: $50,000 manager signing threshold (Supersedes CIRC-2025-014)',
        ],
        metrics: [
          { label: 'Active Directives', value: '5 Circulars', color: 'text-emerald-400' },
          { label: 'Superseded', value: '4 Archived', color: 'text-slate-400' },
          { label: 'Under Review', value: '1 Draft', color: 'text-amber-400' },
        ],
      },
      smartActions: [
        { id: 'act-view-all-circs', label: 'View All Active Circulars', actionType: 'view_circular', variant: 'primary' },
        { id: 'act-view-lineage-all', label: 'Inspect Lineage Registry', actionType: 'view_audit', variant: 'secondary' },
      ],
      referencedCirculars: [
        { id: 'circ-052', refNo: 'CIR-2026-052', title: 'Revised Attendance Guidelines (v3.0)', department: 'Academic Affairs', effectiveDate: '01 Sep 2026', status: 'Active' },
        { id: 'circ-001', refNo: 'CIRC-2026-089', title: 'Enterprise AI Safety Protocol (v3.0)', department: 'IT & Cyber Security', effectiveDate: '01 Sep 2026', status: 'Active' },
        { id: 'circ-002', refNo: 'CIRC-2026-092', title: 'Financial Signing Authority (v2.1)', department: 'Finance & Audit', effectiveDate: '10 Sep 2026', status: 'Active' },
      ],
      contextUpdate: {
        lastReferencedCircular: {
          id: 'circ-052',
          refNo: 'CIR-2026-052',
          title: 'Revised Attendance and Academic Monitoring Guidelines (v3.0)',
          department: 'Academic Affairs',
          effectiveDate: '01 September 2026',
          status: 'Active',
          supersedesRef: 'CIR-2026-041',
          version: '3.0',
        },
      },
    };
  }

  // ── Query 12: AI Governance Specific Query
  if (q.includes('ai') || q.includes('llm') || q.includes('089') || q.includes('gateway')) {
    return {
      thinkingSteps: defaultThinkingSteps,
      text: `**CIRC-2026-089 (v3.0)** is the active directive governing Enterprise AI Safety and Data Protection.\n\n• **Status:** ACTIVE (Effective 01 Sep 2026)\n• **Issuing Authority:** Office of the CISO (Dr. Aris Thorne)\n• **Supersedes:** CIRC-2024-042 (v2.0)\n• **Key Rule:** All institutional AI query traffic must route through \`ai-gateway.internal\`. Prohibits unapproved external LLM prompt uploads containing customer or student PII.`,
      structuredCard: {
        cardType: 'active_circular',
        badge: 'AI GOVERNANCE DIRECTIVE',
        badgeVariant: 'indigo',
        title: 'Enterprise AI Safety Governance & Data Protection Protocol (v3.0)',
        subtitle: 'Binding institutional framework for Large Language Model & API deployment',
        circularRef: 'CIRC-2026-089',
        circularId: 'circ-001',
        status: 'ACTIVE',
        effectiveDate: '01 September 2026',
        department: 'IT & Cyber Security',
        supersedesRef: 'CIRC-2024-042',
        keyPoints: [
          'Mandatory internal AI gateway routing with token telemetry logging',
          'Zero PII input into unapproved external third-party models',
          'Departmental AI Risk Officer designated for every business unit',
        ],
      },
      smartActions: [
        { id: 'act-view-089', label: 'View Circular CIRC-2026-089', actionType: 'view_circular', targetId: 'circ-001', targetRef: 'CIRC-2026-089', variant: 'primary' },
        { id: 'act-lineage-089', label: 'View AI Lineage Tree', actionType: 'view_lineage', targetId: 'circ-001', targetRef: 'CIRC-2026-089', variant: 'secondary' },
      ],
      referencedCirculars: [
        { id: 'circ-001', refNo: 'CIRC-2026-089', title: 'Enterprise AI Safety Governance (v3.0)', department: 'IT & Cyber Security', effectiveDate: '01 Sep 2026', status: 'Active' },
      ],
      contextUpdate: {
        lastReferencedCircular: {
          id: 'circ-001',
          refNo: 'CIRC-2026-089',
          title: 'Enterprise AI Safety Governance & Data Protection Protocol (v3.0)',
          department: 'IT & Cyber Security',
          effectiveDate: '01 September 2026',
          status: 'Active',
          supersedesRef: 'CIRC-2024-042',
          signatoryName: 'Dr. Aris Thorne',
          signatoryTitle: 'Chief Information Security Officer',
          version: '3.0',
        },
      },
    };
  }

  // ── Query 13: "Which department has the highest compliance?" / "Top compliance department"
  if (
    q.includes('highest compliance') || 
    q.includes('best compliance') || 
    q.includes('top compliance') ||
    (q.includes('highest') && q.includes('compliance'))
  ) {
    return {
      thinkingSteps: [
        'Understanding request: Analyzing departmental compliance performance metrics',
        'Searching institutional records across all 6 departments',
        'Identifying relevant data: Ranking departments by audited compliance scores',
        'Cross-checking with Department Compliance Matrix',
        'Generating verified institutional ranking',
      ],
      text: `**Legal & Compliance** holds the **highest compliance score** across the institution at **99.4%**.\n\n**Departmental Compliance Rankings (Audited September 2026):**\n1. 🥇 **Legal & Compliance:** **99.4%** (100% action items completed)\n2. 🥈 **IT & Cyber Security:** **98.8%** (96% acknowledgement rate)\n3. 🥉 **Finance & Audit:** **98.1%** (98% acknowledgement rate)\n4. **Operations & Supply Chain:** **96.5%**\n5. **Health & Safety:** **95.2%**\n6. **Human Resources:** **92.0%**`,
      structuredCard: {
        cardType: 'compliance_summary',
        badge: 'TOP COMPLIANCE PERFORMER',
        badgeVariant: 'emerald',
        title: 'Legal & Compliance Leads Institutional Scorecard at 99.4%',
        subtitle: 'Audited metric based on 100% on-time action resolution and zero overdue mandates',
        keyPoints: [
          'Rank 1: Legal & Compliance (99.4%)',
          'Rank 2: IT & Cyber Security (98.8%)',
          'Rank 3: Finance & Audit (98.1%)',
          'Institutional Average: 96.7%',
        ],
        metrics: [
          { label: 'Top Score', value: '99.4%', color: 'text-emerald-400' },
          { label: 'Inst. Average', value: '96.7%', color: 'text-indigo-400' },
          { label: 'Leading Dept', value: 'Legal', color: 'text-sky-400' },
        ],
      },
      smartActions: [
        { id: 'act-view-analytics-dept', label: 'View Full Analytics', actionType: 'check_status', variant: 'primary' },
        { id: 'act-view-all-actions-matrix', label: 'Inspect Actions Matrix', actionType: 'check_status', variant: 'secondary' },
      ],
      referencedCirculars: [
        { id: 'circ-001', refNo: 'CIRC-2026-089', title: 'Enterprise AI Safety Governance (v3.0)', department: 'IT & Cyber Security', status: 'Active' },
      ],
    };
  }

  // ── Query 14: "How many circulars were issued in 2026?" / "Total circulars" / "Archive summary"
  if (
    q.includes('how many circulars') || 
    q.includes('issued in 2026') || 
    q.includes('total circulars') ||
    q.includes('archive') ||
    (q.includes('circulars') && (q.includes('2026') || q.includes('total') || q.includes('count')))
  ) {
    return {
      thinkingSteps: [
        'Understanding request: Calculating total circular metrics and lifecycle statuses for 2026',
        'Searching institutional archive for all registered circulars',
        'Identifying lifecycle status breakdown: Active, Superseded, Under Review, Draft',
        'Cross-checking category distributions and department issuances',
        'Generating comprehensive archive summary report',
      ],
      text: `A total of **${mockCirculars.length} circulars** are catalogued in the Institutional Archive for 2026:\n\n• 🟢 **Active in Force:** **${activeDirectives.length} Circulars** (CIR-2026-052, CIRC-2026-089, CIRC-2026-092, CIRC-2026-068, CIRC-2026-044)\n• 🔴 **Superseded / Archived:** **${supersededDirectives.length} Circulars** (CIR-2026-041, CIR-2026-018, CIRC-2024-042, CIRC-2025-014)\n• 🟡 **Under Review / Draft:** **${reviewDirectives.length} Circular** (CIRC-2026-095)\n\n**Categories Represented:**\n• Policy & Compliance (3 Directives)\n• IT & Data Governance (2 Directives)\n• Financial & Delegation (2 Directives)\n• Safety & Security (2 Directives)\n• Operations & Logistics (1 Directive)`,
      structuredCard: {
        cardType: 'active_circular',
        badge: 'ARCHIVE & REGISTRY AUDIT',
        badgeVariant: 'indigo',
        title: `${mockCirculars.length} Total Circulars Catalogued in Institutional Archive`,
        subtitle: 'Lifecycle summary spanning active, superseded, and draft policy documents',
        keyPoints: [
          `Active Directives: ${activeDirectives.length} in legal force`,
          `Superseded / Sunset: ${supersededDirectives.length} archived policies with complete lineage`,
          `Under Review: ${reviewDirectives.length} awaiting executive ratification`,
        ],
        metrics: [
          { label: 'Total Circulars', value: `${mockCirculars.length}`, color: 'text-slate-100' },
          { label: 'Active', value: `${activeDirectives.length}`, color: 'text-emerald-400' },
          { label: 'Superseded', value: `${supersededDirectives.length}`, color: 'text-amber-400' },
          { label: 'Under Review', value: `${reviewDirectives.length}`, color: 'text-sky-400' },
        ],
      },
      smartActions: [
        { id: 'act-view-archive-page', label: 'Open Archive & Search', actionType: 'view_circular', variant: 'primary' },
        { id: 'act-view-analytics-page', label: 'View Institutional Analytics', actionType: 'check_status', variant: 'secondary' },
      ],
      referencedCirculars: [
        { id: 'circ-052', refNo: 'CIR-2026-052', title: 'Revised Attendance Guidelines (v3.0)', status: 'Active', effectiveDate: '01 Sep 2026' },
        { id: 'circ-001', refNo: 'CIRC-2026-089', title: 'Enterprise AI Safety Governance (v3.0)', status: 'Active', effectiveDate: '01 Sep 2026' },
        { id: 'circ-002', refNo: 'CIRC-2026-092', title: 'Financial Signing Authority (v2.1)', status: 'Active', effectiveDate: '10 Sep 2026' },
      ],
    };
  }

  // ── No-Result State (Requirement 13) ───────────────────────────────────────
  return {
    thinkingSteps: [
      `Understanding request: Searching institutional registry for "${query}"`,
      'Scanning circulars, versions, action items, and recipient databases',
      'No exact policy, role, or action match identified',
      'Formatting fallback guidance with suggested navigation shortcuts',
    ],
    text: `I couldn't find a matching institutional record for **"${query}"**.\n\nPlease check the circular reference number, department name, or topic. You can explore our verified institutional databases using the links below:`,
    structuredCard: {
      cardType: 'no_result',
      badge: 'NO RECORD FOUND',
      badgeVariant: 'amber',
      title: 'Institutional Database Search Suggestion',
      subtitle: `No direct match found for "${query}" in active circulars or action ledgers`,
      keyPoints: [
        'Search Circulars repository for active & historical policy documents',
        'Search Actions dashboard for upcoming task deadlines and assignees',
        'Search Acknowledgements ledger for student & faculty delivery status',
      ],
    },
    smartActions: [
      { id: 'act-search-circs', label: 'Search Circulars Repository', actionType: 'view_circular', variant: 'primary' },
      { id: 'act-search-actions', label: 'Search Action Items', actionType: 'check_status', variant: 'secondary' },
      { id: 'act-search-dist', label: 'Search Acknowledgements', actionType: 'check_status', variant: 'secondary' },
    ],
    referencedCirculars: [],
  };
};

// ─── Filter Suggested Prompts Mapping (Requirement 7 & 10) ───────────────────
const filterPrompts: Record<FilterCategory, string[]> = {
  All: [
    'Which circular is currently active for attendance?',
    'Who has not acknowledged the latest circular?',
    'What actions are due this week?',
    'Which actions are overdue?',
    'What is our compliance rate?',
    'Which circulars are expiring soon?',
  ],
  Circulars: [
    'Which circular is currently active for attendance?',
    'Which circular superseded the previous attendance circular?',
    'Show circulars awaiting approval.',
    'Which circulars are expiring soon?',
  ],
  Policies: [
    'What is the latest attendance policy?',
    'Show me the history of attendance circulars.',
    'What is the active AI governance policy?',
  ],
  Acknowledgements: [
    'Who has not acknowledged the latest circular?',
    'Who needs to be reminded?',
    'What is the acknowledgement rate for attendance?',
  ],
  Actions: [
    'What actions are due this week?',
    'Which actions are overdue?',
    'Show critical actions.',
  ],
  Compliance: [
    'What is our current compliance rate?',
    'Which department has the most pending actions?',
    'Which departments have pending compliance actions?',
  ],
};

// ─── Initial Welcome Message (Requirement 1 & 12) ────────────────────────────
const initialDemoMessages: CopilotMessage[] = [
  {
    id: 'msg-init-1',
    sender: 'assistant',
    text: "Hello, I'm **Cira** — your Institutional Intelligence Agent.\n\nI can help you navigate institutional circulars, policies, acknowledgements and compliance. Ask me anything about active rules, version lineages, action items, or distribution telemetry!",
    timestamp: '10:30 AM',
    smartActions: [
      { id: 'act-sug-1', label: 'Which circular is active for attendance?', actionType: 'view_circular', targetId: 'circ-052', variant: 'primary' },
      { id: 'act-sug-2', label: 'Who has not acknowledged the latest circular?', actionType: 'check_status', variant: 'secondary' },
      { id: 'act-sug-3', label: 'What actions are due this week?', actionType: 'check_status', variant: 'secondary' },
      { id: 'act-sug-4', label: 'What is our compliance rate?', actionType: 'check_status', variant: 'secondary' },
    ],
  },
];

export const Assistant: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<CopilotMessage[]>(initialDemoMessages);
  const [inputQuery, setInputQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterCategory>('All');
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentThinkingStep, setCurrentThinkingStep] = useState(0);
  const [currentThinkingSteps, setCurrentThinkingSteps] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [modalLineageCircular, setModalLineageCircular] = useState<Circular | null>(null);
  const [agentContext, setAgentContext] = useState<AgentContext>({
    lastReferencedCircular: {
      id: 'circ-052',
      refNo: 'CIR-2026-052',
      title: 'Revised Attendance and Academic Monitoring Guidelines (v3.0)',
      department: 'Academic Affairs',
      effectiveDate: '01 September 2026',
      status: 'Active',
      supersedesRef: 'CIR-2026-041',
      version: '3.0',
    },
  });

  // Recent Queries List (Requirement 11)
  const [recentQueries, setRecentQueries] = useState<string[]>([
    'Which circular is currently active for attendance?',
    'Who has not acknowledged the latest circular?',
    'What actions are overdue?',
    'What is our compliance rate?',
  ]);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Live KPIs from unified mock data
  const activeCircularsCount = mockCirculars.filter(c => c.status === 'Active').length;
  const supersededRulesCount = mockCirculars.filter(c => c.status === 'Superseded').length;
  const pendingApprovalsCount = mockCirculars.filter(c => c.status === 'Under Review' || c.status === 'Draft').length;
  const overdueActionsCount = mockActions.filter(a => a.status === 'Overdue').length;
  const completedActionsCount = mockActions.filter(a => a.status === 'Completed').length;
  const totalActionsCount = mockActions.length;
  const complianceScore = Math.round((completedActionsCount / totalActionsCount) * 100);

  // Agent Activity Timeline
  const [activities, setActivities] = useState([
    { id: '1', action: 'Attendance Directives Lineage Resolved', detail: 'CIR-2026-018 ➔ CIR-2026-041 ➔ CIR-2026-052 [ACTIVE]', time: '2m ago', icon: GitBranch, color: 'text-emerald-400 bg-emerald-500/10' },
    { id: '2', action: 'Overdue Compliance Flagged', detail: '4 actions past deadline across IT & Academic Systems', time: '5m ago', icon: AlertTriangle, color: 'text-rose-400 bg-rose-500/10' },
    { id: '3', action: 'Distribution Telemetry Synced', detail: '16/20 acknowledged on CIR-2026-052 (80% compliance)', time: '8m ago', icon: Users, color: 'text-sky-400 bg-sky-500/10' },
    { id: '4', action: 'Weekly Deadline Window Evaluated', detail: '2 actions due Sep 15 (Biometric LMS sync & SAP matrix)', time: '12m ago', icon: Clock, color: 'text-amber-400 bg-amber-500/10' },
  ]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isProcessing, currentThinkingStep]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  const handleSend = (textToSend?: string) => {
    const query = textToSend || inputQuery;
    if (!query.trim() || isProcessing) return;

    // Add to recent queries
    setRecentQueries(prev => {
      const filtered = prev.filter(q => q.toLowerCase() !== query.toLowerCase());
      return [query, ...filtered].slice(0, 5);
    });

    const userMsg: CopilotMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInputQuery('');

    // Compute Agent Response
    const response = getAgentResponse(query, agentContext, activeFilter);
    if (response.contextUpdate) {
      setAgentContext(prev => ({ ...prev, ...response.contextUpdate }));
    }

    setCurrentThinkingSteps(response.thinkingSteps);
    setCurrentThinkingStep(0);
    setIsProcessing(true);

    // Animate the agentic search sequence smoothly (Requirement 6)
    let step = 0;
    const interval = setInterval(() => {
      step++;
      if (step < response.thinkingSteps.length) {
        setCurrentThinkingStep(step);
      } else {
        clearInterval(interval);
        setTimeout(() => {
          setMessages(prev => [
            ...prev,
            {
              id: `ai-${Date.now()}`,
              sender: 'assistant',
              text: response.text,
              timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              thinkingSteps: response.thinkingSteps,
              smartActions: response.smartActions,
              referencedCirculars: response.referencedCirculars,
              conflictData: response.conflictData,
              structuredCard: response.structuredCard,
            },
          ]);
          setIsProcessing(false);
          setCurrentThinkingSteps([]);
        }, 350);
      }
    }, 350);
  };

  const handleSmartAction = (action: SmartAction) => {
    if (action.actionType === 'view_lineage') {
      const circ = mockCirculars.find(c => c.id === action.targetId || c.refNo === action.targetRef) || mockCirculars.find(c => c.refNo === 'CIR-2026-052');
      if (circ) {
        setModalLineageCircular(circ);
      } else {
        navigate('/archive');
      }
    } else if (action.actionType === 'send_reminder') {
      showToast('📨 Automated Reminders Dispatched: Email & SMS notifications sent with 48-hour compliance countdown.');
      setActivities(prev => [
        { id: `act-${Date.now()}`, action: 'Reminder Broadcast Dispatched', detail: 'Automated nudge dispatched to pending recipients', time: 'Just now', icon: Mail, color: 'text-sky-400 bg-sky-500/10' },
        ...prev,
      ]);
    } else if (action.actionType === 'start_approval') {
      showToast('✍️ Navigating to Approvals Inbox: Electronic review routing opened.');
      setTimeout(() => navigate('/approvals'), 600);
    } else if (action.actionType === 'view_circular') {
      navigate(action.targetId ? `/circulars/${action.targetId}` : '/circulars');
    } else if (action.actionType === 'check_status') {
      const label = action.label?.toLowerCase() || '';
      if (label.includes('analytics') || label.includes('institutional analytics') || label.includes('full analytics')) {
        navigate('/analytics');
      } else if (label.includes('archive') || label.includes('search')) {
        navigate('/archive');
      } else if (label.includes('action') || label.includes('compliance') || label.includes('overdue') || label.includes('pending') || label.includes('critical') || label.includes('week') || label.includes('dept') || label.includes('matrix')) {
        navigate('/actions');
      } else {
        navigate('/distribution');
      }
    } else if (action.actionType === 'view_audit') {
      navigate('/archive');
    }
  };

  const openLineageFor = (circIdOrRef: string) => {
    const circ = mockCirculars.find(c => c.id === circIdOrRef || c.refNo === circIdOrRef);
    if (circ) {
      setModalLineageCircular(circ);
    } else {
      navigate('/archive');
    }
  };

  const clearChat = () => {
    setMessages([]);
    showToast('✨ Conversation reset. Welcome to Cira!');
  };

  const runPolicyAudit = () => {
    showToast('⚡ Institutional Audit Complete: 5 Active Directives verified, 4 legacy policies safely superseded.');
    setActivities(prev => [
      { id: `audit-${Date.now()}`, action: 'Policy Audit Executed', detail: 'CIR-2026-052, CIRC-2026-089 & CIRC-2026-092 validated', time: 'Just now', icon: GitBranch, color: 'text-indigo-400 bg-indigo-500/10' },
      ...prev,
    ]);
  };

  const formatText = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 rounded bg-slate-800 text-indigo-300 font-mono text-[10px]">$1</code>')
      .split('\n')
      .map((line, i) => `<span key="${i}">${line}</span>`)
      .join('<br/>');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">

      {/* ── Lineage Tree Modal ────────────────────────────────────────────── */}
      {modalLineageCircular && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="w-full max-w-5xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-indigo-400" />
                <h2 className="text-lg font-bold text-slate-100">
                  Circular Lineage & Current Rule Tree — {modalLineageCircular.refNo}
                </h2>
              </div>
              <button
                onClick={() => setModalLineageCircular(null)}
                className="p-1.5 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <LineageViewer
              currentCircular={modalLineageCircular}
              allCirculars={mockCirculars}
            />
          </div>
        </div>
      )}

      {/* ── Toast Notification ────────────────────────────────────────────── */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 p-4 rounded-2xl bg-indigo-950 border border-indigo-500 text-white text-xs shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-200 max-w-md">
          <Sparkles className="w-4 h-4 text-sky-400 shrink-0 animate-pulse" />
          <p className="flex-1 font-medium">{toastMessage}</p>
          <button onClick={() => setToastMessage(null)} className="text-slate-400 hover:text-white">✕</button>
        </div>
      )}

      {/* ── Top Header Strip (Requirement 1 & 15) ──────────────────────────── */}
      <div className="glass-card rounded-2xl p-5 border border-indigo-500/30 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative shrink-0">
            <div className="w-16 h-16 rounded-2xl overflow-hidden border-2 border-indigo-500/50 bg-slate-900 shadow-lg shadow-indigo-500/10 flex items-center justify-center p-1">
              <Bot3D size="sm" showSpeechBubble={false} autoWave={false} />
            </div>
            <span className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-slate-950 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-2xl font-black text-slate-100 tracking-tight">
                Cira — Institutional Intelligence Agent
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                INTELLIGENCE OS ONLINE
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Ask questions about circulars, policies, actions and compliance. Powered by unified Vignan institutional knowledge graph.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            onClick={runPolicyAudit}
            className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/25 transition-all hover:scale-105"
          >
            <GitBranch className="w-3.5 h-3.5" />
            Audit Policy Lineage
          </button>
          <button
            onClick={clearChat}
            className="px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            title="Reset Conversation"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Clear
          </button>
          <Link
            to="/archive"
            className="px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            Lineage Registry <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* ── Unified KPIs Strip (Requirement 3) ────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          { label: 'Active Rules', value: activeCircularsCount, icon: CheckCircle2, color: 'text-emerald-400', link: '/circulars' },
          { label: 'Superseded Policies', value: supersededRulesCount, icon: GitBranch, color: 'text-amber-400', link: '/archive' },
          { label: 'Overdue Actions', value: overdueActionsCount, icon: AlertCircle, color: 'text-rose-400', link: '/actions' },
          { label: 'Pending Approvals', value: pendingApprovalsCount, icon: CheckSquare, color: 'text-sky-400', link: '/approvals' },
          { label: 'Compliance Score', value: `${complianceScore}%`, icon: ShieldCheck, color: 'text-indigo-400', link: '/actions' },
        ].map(({ label, value, icon: Icon, color, link }) => (
          <Link
            key={label}
            to={link}
            className="glass-card rounded-xl p-3.5 border border-slate-800/80 hover:border-indigo-500/40 transition-all flex items-center justify-between group"
          >
            <div>
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">{label}</span>
              <span className={`text-xl font-black ${color} mt-0.5 block`}>{value}</span>
            </div>
            <div className="p-2 rounded-lg bg-slate-900/80 border border-slate-800 text-slate-400 group-hover:text-indigo-400 transition-colors">
              <Icon className="w-4 h-4" />
            </div>
          </Link>
        ))}
      </div>

      {/* ── Main Two-Column Layout: Chat & Activity Sidebar ────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-6">

        {/* ── LEFT COLUMN: Conversational Agent Interface ──────────────────── */}
        <div className="glass-card rounded-2xl border border-slate-800 flex flex-col h-[740px] overflow-hidden shadow-xl">
          
          {/* ── Search Category Filter Tabs (Requirement 10) ────────────────── */}
          <div className="p-3 border-b border-slate-800/80 bg-slate-950/60 flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3 text-indigo-400" /> Domain:
              </span>
              {(['All', 'Circulars', 'Policies', 'Acknowledgements', 'Actions', 'Compliance'] as FilterCategory[]).map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveFilter(cat)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all shrink-0 ${
                    activeFilter === cat
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                      : 'bg-slate-900/80 text-slate-400 hover:text-slate-200 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <span className="text-[10px] font-mono text-slate-500 hidden sm:inline-block">
              {messages.length} message{messages.length !== 1 ? 's' : ''}
            </span>
          </div>

          {/* ── Chat Messages Container ────────────────────────────────────── */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4" style={{ scrollbarWidth: 'thin' }}>
            
            {/* Empty State (Requirement 12) - Bigger 3D Bot with Hand Waving & Saying Hi */}
            {messages.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center text-center p-4 space-y-4 animate-in fade-in duration-300">
                <Bot3D
                  size="hero"
                  greetingText="Hi! 👋 I'm Cira"
                  showSpeechBubble={true}
                  onAskClick={(prompt) => {
                    if (prompt) handleSend(prompt);
                  }}
                  autoWave={true}
                />

                <div className="max-w-md space-y-1">
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Select a sample query below or type any question regarding active circulars, compliance, and action deadlines:
                  </p>
                </div>

                {/* Categorized Starter Prompts Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-lg text-left">
                  {[
                    { title: 'Active Attendance Directive', q: 'Which circular is currently active for attendance?', icon: FileText, color: 'text-emerald-400' },
                    { title: 'Unacknowledged Recipients', q: 'Who has not acknowledged the latest circular?', icon: Users, color: 'text-sky-400' },
                    { title: 'Actions Due This Week', q: 'What actions are due this week?', icon: Clock, color: 'text-amber-400' },
                    { title: 'Compliance & Overdue Audit', q: 'What is our compliance rate?', icon: ShieldCheck, color: 'text-indigo-400' },
                  ].map(({ title, q, icon: Icon, color }) => (
                    <button
                      key={q}
                      onClick={() => handleSend(q)}
                      className="p-3 rounded-xl bg-slate-900/80 hover:bg-indigo-950/40 border border-slate-800 hover:border-indigo-500/40 text-left transition-all group space-y-1 shadow-sm"
                    >
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-200 group-hover:text-indigo-300">
                        <Icon className={`w-3.5 h-3.5 ${color}`} />
                        <span>{title}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 group-hover:text-slate-300 line-clamp-1">{q}</p>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Message History */}
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-3 ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border overflow-hidden ${
                    msg.sender === 'user'
                      ? 'bg-indigo-600 border-indigo-500 text-white font-bold text-xs'
                      : 'bg-slate-900 border-indigo-500/40 shadow-sm'
                  }`}
                >
                  {msg.sender === 'user' ? (
                    <User className="w-4 h-4" />
                  ) : (
                    <img src="/cira-agent.jpg" alt="Cira" className="w-full h-full object-cover" />
                  )}
                </div>

                {/* Message Body */}
                <div className={`max-w-2xl rounded-2xl p-4 text-xs leading-relaxed space-y-3.5 ${
                  msg.sender === 'user'
                    ? 'bg-indigo-600 text-white font-medium rounded-tr-sm shadow-md'
                    : 'glass-panel rounded-tl-sm text-slate-200 border border-slate-800 shadow-sm'
                }`}>
                  {/* Sender Header */}
                  {msg.sender === 'assistant' && (
                    <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 mb-1">
                      <span className="text-[10px] font-black text-indigo-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-sky-400" /> CIRA INSTITUTIONAL INTELLIGENCE
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">{msg.timestamp}</span>
                    </div>
                  )}

                  {/* Text Content */}
                  <div
                    dangerouslySetInnerHTML={{ __html: formatText(msg.text) }}
                    className="whitespace-pre-line font-sans leading-relaxed text-[12px]"
                  />

                  {/* ── Structured Response Card (Requirement 4) ───────────── */}
                  {msg.structuredCard && (
                    <div className="p-4 rounded-xl bg-slate-950/70 border border-indigo-500/30 space-y-3 shadow-md">
                      <div className="flex items-center justify-between gap-2 flex-wrap pb-2 border-b border-slate-800">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                          msg.structuredCard.badgeVariant === 'emerald'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : msg.structuredCard.badgeVariant === 'rose'
                            ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                            : msg.structuredCard.badgeVariant === 'sky'
                            ? 'bg-sky-500/20 text-sky-400 border border-sky-500/30'
                            : msg.structuredCard.badgeVariant === 'amber'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'
                        }`}>
                          {msg.structuredCard.badge || 'STRUCTURED INTELLIGENCE'}
                        </span>
                        {msg.structuredCard.status && (
                          <span className="text-[10px] font-mono font-bold text-emerald-400">
                            Status: {msg.structuredCard.status}
                          </span>
                        )}
                      </div>

                      <div>
                        <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1.5">
                          {msg.structuredCard.circularRef && (
                            <span className="font-mono text-indigo-400 font-black">{msg.structuredCard.circularRef} —</span>
                          )}
                          <span>{msg.structuredCard.title}</span>
                        </h4>
                        {msg.structuredCard.subtitle && (
                          <p className="text-[11px] text-slate-400 mt-0.5">{msg.structuredCard.subtitle}</p>
                        )}
                      </div>

                      {/* Key Directive Points */}
                      {msg.structuredCard.keyPoints && msg.structuredCard.keyPoints.length > 0 && (
                        <div className="space-y-1 pt-1 text-[11px] text-slate-300">
                          {msg.structuredCard.keyPoints.map((pt, idx) => (
                            <div key={idx} className="flex items-start gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              <span>{pt}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Card Metrics Grid */}
                      {msg.structuredCard.metrics && msg.structuredCard.metrics.length > 0 && (
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800/80">
                          {msg.structuredCard.metrics.map((m, idx) => (
                            <div key={idx} className="p-2 rounded-lg bg-slate-900/80 border border-slate-800">
                              <span className="text-[9px] font-mono uppercase text-slate-400 block">{m.label}</span>
                              <span className={`text-xs font-black ${m.color || 'text-indigo-400'} mt-0.5 block`}>{m.value}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── Policy Conflict Card (If Present) ─────────────────── */}
                  {msg.conflictData && (
                    <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-500/40 text-xs space-y-2 text-amber-200">
                      <div className="flex items-center gap-1.5 font-bold text-amber-400 text-xs">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        <span>Policy Version Conflict Resolved</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1 border-t border-amber-500/20 font-mono">
                        <div className="p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                          <span className="text-slate-400 block text-[10px]">OLD RULE</span>
                          <strong className="text-amber-300">{msg.conflictData.oldRuleRef}</strong>
                          <p className="text-[10px] text-slate-400 font-sans mt-0.5">{msg.conflictData.oldRuleTitle}</p>
                        </div>
                        <div className="p-2 rounded-lg bg-emerald-950/40 border border-emerald-500/30">
                          <span className="text-emerald-400 block text-[10px] font-bold">CURRENT RULE (ACTIVE)</span>
                          <strong className="text-emerald-300">{msg.conflictData.currentRuleRef}</strong>
                          <p className="text-[10px] text-emerald-200 font-sans mt-0.5">{msg.conflictData.currentRuleTitle}</p>
                        </div>
                      </div>
                      <div className="pt-1 text-[11px] text-amber-200/90 font-sans">
                        <strong>Recommended Action:</strong> {msg.conflictData.recommendedAction}
                      </div>
                    </div>
                  )}

                  {/* ── Source Citations (Requirement 5) ──────────────────── */}
                  {msg.referencedCirculars && msg.referencedCirculars.length > 0 && (
                    <div className="pt-3 border-t border-slate-800/80 space-y-2">
                      <span className="text-[10px] uppercase font-mono text-slate-400 font-bold flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-indigo-400" /> Source References & Policy Citations
                      </span>
                      <div className="space-y-2">
                        {msg.referencedCirculars.map((ref) => (
                          <div
                            key={ref.id}
                            className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                          >
                            <div>
                              <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                                <span className="font-mono font-bold text-indigo-400">{ref.refNo}</span>
                                <span className="text-[10px] font-mono text-slate-500">ID: {ref.id}</span>
                                {ref.status && (
                                  <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                                    ref.status === 'Active' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                                  }`}>
                                    {ref.status}
                                  </span>
                                )}
                              </div>
                              <div className="text-slate-300 font-medium text-[11px]">{ref.title}</div>
                              <div className="text-[10px] text-slate-500 font-mono mt-0.5">
                                {ref.department && <span>Dept: {ref.department} · </span>}
                                {ref.effectiveDate && <span>Effective: {ref.effectiveDate}</span>}
                              </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              <Link
                                to={`/circulars/${ref.id}`}
                                className="px-2.5 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                              >
                                <FileText className="w-3 h-3" />
                                View Circular
                              </Link>
                              <button
                                onClick={() => openLineageFor(ref.id)}
                                className="px-2.5 py-1 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-[11px] font-semibold flex items-center gap-1 transition-colors"
                              >
                                <GitBranch className="w-3 h-3" />
                                View Lineage
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── Smart Action Buttons (Requirement 9) ───────────────── */}
                  {msg.smartActions && msg.smartActions.length > 0 && (
                    <div className="pt-2 border-t border-slate-800/80">
                      <span className="text-[10px] uppercase font-mono text-indigo-400 font-bold block mb-2">
                        Recommended Actions
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {msg.smartActions.map((action) => (
                          <button
                            key={action.id}
                            onClick={() => handleSmartAction(action)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
                              action.variant === 'warning'
                                ? 'bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30'
                                : action.variant === 'primary'
                                ? 'bg-indigo-600 hover:bg-indigo-500 text-white'
                                : 'bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-700'
                            }`}
                          >
                            <Zap className="w-3 h-3" />
                            {action.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {msg.sender === 'user' && (
                    <span className="text-[10px] text-indigo-200 block text-right font-mono mt-1">{msg.timestamp}</span>
                  )}
                </div>
              </div>
            ))}

            {/* ── Animated Agentic Search Process (Requirement 6) ─────────── */}
            {isProcessing && (
              <div className="flex items-start gap-3 animate-in fade-in duration-200">
                <div className="w-8 h-8 rounded-full bg-slate-900 border border-indigo-500/50 overflow-hidden shrink-0 animate-pulse">
                  <img src="/cira-agent.jpg" alt="Cira" className="w-full h-full object-cover" />
                </div>
                <div className="glass-panel rounded-2xl rounded-tl-sm p-4 border border-indigo-500/40 text-slate-200 max-w-xl space-y-2.5 shadow-lg bg-indigo-950/20">
                  <div className="flex items-center justify-between border-b border-indigo-500/20 pb-1.5">
                    <span className="text-[10px] font-mono font-black text-indigo-300 uppercase tracking-widest flex items-center gap-1.5">
                      <Loader2 className="w-3 h-3 text-sky-400 animate-spin" />
                      Cira Agentic Search Engine...
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">Step {currentThinkingStep + 1} of {currentThinkingSteps.length}</span>
                  </div>

                  <div className="space-y-1.5 pt-1">
                    {currentThinkingSteps.map((stepText, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center gap-2 text-xs transition-opacity duration-200 ${
                          idx < currentThinkingStep
                            ? 'text-emerald-400 font-medium'
                            : idx === currentThinkingStep
                            ? 'text-indigo-300 font-semibold'
                            : 'text-slate-600'
                        }`}
                      >
                        {idx < currentThinkingStep ? (
                          <CheckCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        ) : idx === currentThinkingStep ? (
                          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping shrink-0 ml-1" />
                        ) : (
                          <span className="w-2 h-2 rounded-full bg-slate-700 shrink-0 ml-1" />
                        )}
                        <span>{stepText}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* ── Suggested Prompts Strip (Requirement 7) ───────────────────── */}
          <div className="p-2.5 border-t border-slate-800/80 bg-slate-950/40 flex items-center gap-2 overflow-x-auto shrink-0" style={{ scrollbarWidth: 'none' }}>
            <span className="text-[10px] font-mono font-bold text-indigo-400 uppercase shrink-0 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-sky-400" /> Suggestions:
            </span>
            {filterPrompts[activeFilter].map((q) => (
              <button
                key={q}
                onClick={() => handleSend(q)}
                disabled={isProcessing}
                className="px-3 py-1 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-indigo-500/40 text-[11px] whitespace-nowrap transition-colors shrink-0 disabled:opacity-50"
              >
                {q}
              </button>
            ))}
          </div>

          {/* ── Input Box Form ────────────────────────────────────────────── */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="p-3 border-t border-slate-800 bg-slate-950/80 flex items-center gap-2 shrink-0"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask Cira about active rules, attendance history, unacknowledged recipients, overdue actions..."
              disabled={isProcessing}
              className="flex-1 bg-slate-900/80 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <button
              type="submit"
              disabled={isProcessing || !inputQuery.trim()}
              className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-50 transition-colors flex items-center justify-center shrink-0 shadow-md shadow-indigo-600/30"
              title="Submit to Cira"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>

        {/* ── RIGHT COLUMN: Recent Queries & Activity Timeline ────────────── */}
        <div className="space-y-5">
          
          {/* ── Recent Questions Card (Requirement 11) ────────────────────── */}
          <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-400 font-bold flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-indigo-400" /> Recent Queries
              </span>
              <span className="text-[10px] text-slate-500 font-mono">Click to re-run</span>
            </div>

            <div className="space-y-1.5">
              {recentQueries.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(q)}
                  disabled={isProcessing}
                  className="w-full p-2 rounded-xl bg-slate-900/60 hover:bg-indigo-950/30 border border-slate-800/80 hover:border-indigo-500/30 text-left text-[11px] text-slate-300 hover:text-white transition-all flex items-center justify-between group"
                >
                  <span className="truncate flex-1 mr-2">{q}</span>
                  <ChevronRight className="w-3 h-3 text-slate-600 group-hover:text-indigo-400 shrink-0 transition-colors" />
                </button>
              ))}
            </div>
          </div>

          {/* ── Agent Activity Timeline ───────────────────────────────────── */}
          <div className="glass-card rounded-2xl p-5 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2 font-black text-xs uppercase tracking-wider text-slate-200">
                <Activity className="w-4 h-4 text-indigo-400" />
                <span>Agent Activity Timeline</span>
              </div>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>

            <div className="space-y-3">
              {activities.map((act) => {
                const Icon = act.icon;
                return (
                  <div key={act.id} className="flex items-start gap-3 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors">
                    <div className={`p-2 rounded-lg shrink-0 ${act.color}`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span className="truncate">{act.action}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 line-clamp-2 leading-snug">{act.detail}</p>
                    </div>
                    <span className="text-[9px] font-mono text-slate-500 shrink-0">{act.time}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── Quick Lineage Tree Links ──────────────────────────────────── */}
          <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-2.5">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block">
              Direct Lineage Explorer
            </span>
            <div className="space-y-2">
              <button
                onClick={() => openLineageFor('circ-052')}
                className="w-full p-2.5 rounded-xl bg-slate-900 hover:bg-indigo-950/30 border border-slate-800 hover:border-indigo-500/40 text-left transition-colors flex items-center justify-between text-xs group"
              >
                <div>
                  <div className="font-mono font-bold text-indigo-400">CIR-2026-052 (v3.0)</div>
                  <div className="text-[11px] text-slate-300">Attendance Guidelines Tree</div>
                </div>
                <GitBranch className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
              </button>

              <button
                onClick={() => openLineageFor('circ-001')}
                className="w-full p-2.5 rounded-xl bg-slate-900 hover:bg-indigo-950/30 border border-slate-800 hover:border-indigo-500/40 text-left transition-colors flex items-center justify-between text-xs group"
              >
                <div>
                  <div className="font-mono font-bold text-indigo-400">CIRC-2026-089 (v3.0)</div>
                  <div className="text-[11px] text-slate-300">AI Safety Governance Tree</div>
                </div>
                <GitBranch className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
              </button>

              <button
                onClick={() => openLineageFor('circ-002')}
                className="w-full p-2.5 rounded-xl bg-slate-900 hover:bg-indigo-950/30 border border-slate-800 hover:border-indigo-500/40 text-left transition-colors flex items-center justify-between text-xs group"
              >
                <div>
                  <div className="font-mono font-bold text-indigo-400">CIRC-2026-092 (v2.1)</div>
                  <div className="text-[11px] text-slate-300">Financial Delegation Tree</div>
                </div>
                <GitBranch className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
