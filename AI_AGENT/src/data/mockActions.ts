// ─── Phase 7: Action & Compliance Intelligence Mock Data ─────────────────────

export type ActionStatus = 'Not Started' | 'In Progress' | 'Completed' | 'Overdue';
export type ActionPriority = 'Critical' | 'High' | 'Medium' | 'Low';

export interface ComplianceAction {
  id: string;
  title: string;
  description: string;
  sourceCircularId: string;
  sourceCircularRef: string;
  sourceCircularTitle: string;
  responsibleRole: string;
  department: string;
  deadline: string;       // ISO date string
  priority: ActionPriority;
  status: ActionStatus;
  createdDate: string;    // ISO date string
}

const today = new Date('2026-09-11');
const daysDiff = (iso: string) => {
  const d = new Date(iso);
  return Math.ceil((d.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
};

export const mockActions: ComplianceAction[] = [

  // ── CIRC-2026-089: Enterprise AI Safety Governance ──────────────────────────
  {
    id: 'ca-101',
    title: 'Appoint Departmental AI Risk Officer',
    description: 'Each department head must designate a certified AI Compliance Delegate and submit credentials to the CISO office.',
    sourceCircularId: 'circ-001',
    sourceCircularRef: 'CIRC-2026-089',
    sourceCircularTitle: 'Enterprise AI Safety Governance & Data Protection Protocol (v3.0)',
    responsibleRole: 'Department Heads',
    department: 'IT & Cyber Security',
    deadline: '2026-09-30',
    priority: 'Critical',
    status: 'In Progress',
    createdDate: '2026-09-01',
  },
  {
    id: 'ca-102',
    title: 'Audit & Revoke Unapproved External API Tokens',
    description: 'Audit all third-party AI API connections and revoke tokens not whitelisted through ai-gateway.internal.',
    sourceCircularId: 'circ-001',
    sourceCircularRef: 'CIRC-2026-089',
    sourceCircularTitle: 'Enterprise AI Safety Governance & Data Protection Protocol (v3.0)',
    responsibleRole: 'Lead Security Engineer',
    department: 'IT & Cyber Security',
    deadline: '2026-09-20',
    priority: 'Critical',
    status: 'Completed',
    createdDate: '2026-09-01',
  },
  {
    id: 'ca-103',
    title: 'Staff Briefing on PII Protection in AI Workflows',
    description: 'Conduct mandatory all-staff briefing on PII data hygiene for AI tools. Attendance verified.',
    sourceCircularId: 'circ-001',
    sourceCircularRef: 'CIRC-2026-089',
    sourceCircularTitle: 'Enterprise AI Safety Governance & Data Protection Protocol (v3.0)',
    responsibleRole: 'HR Compliance Manager',
    department: 'Human Resources',
    deadline: '2026-10-15',
    priority: 'High',
    status: 'Not Started',
    createdDate: '2026-09-01',
  },
  {
    id: 'ca-104',
    title: 'Configure AI Gateway Telemetry & Token Logging',
    description: 'Enable mandatory API token logging on ai-gateway.internal per Section 2.2 of CIRC-2026-089.',
    sourceCircularId: 'circ-001',
    sourceCircularRef: 'CIRC-2026-089',
    sourceCircularTitle: 'Enterprise AI Safety Governance & Data Protection Protocol (v3.0)',
    responsibleRole: 'IT Systems Administrator',
    department: 'IT & Cyber Security',
    deadline: '2026-09-10',
    priority: 'Critical',
    status: 'Overdue',
    createdDate: '2026-09-01',
  },

  // ── CIR-2026-052: Revised Attendance & Academic Monitoring ───────────────────
  {
    id: 'ca-201',
    title: 'Sync Biometric Gate Logs with Campus ERP & LMS',
    description: 'Integrate RFID/biometric turnstile logs with ERP and LMS attendance modules. Daily automated sync required.',
    sourceCircularId: 'circ-052',
    sourceCircularRef: 'CIR-2026-052',
    sourceCircularTitle: 'Revised Attendance and Academic Monitoring Guidelines (v3.0)',
    responsibleRole: 'IT Academic Systems Lead',
    department: 'Computer Science & Engineering',
    deadline: '2026-09-15',
    priority: 'High',
    status: 'In Progress',
    createdDate: '2026-09-01',
  },
  {
    id: 'ca-202',
    title: 'Publish Weekly Attendance Shortfall Matrix',
    description: 'Faculty coordinators to publish weekly attendance shortfall matrix to department notice boards and parent portal.',
    sourceCircularId: 'circ-052',
    sourceCircularRef: 'CIR-2026-052',
    sourceCircularTitle: 'Revised Attendance and Academic Monitoring Guidelines (v3.0)',
    responsibleRole: 'Faculty Academic Coordinators',
    department: 'Computer Science & Engineering',
    deadline: '2026-09-22',
    priority: 'Medium',
    status: 'Not Started',
    createdDate: '2026-09-01',
  },
  {
    id: 'ca-203',
    title: 'Train Faculty on Biometric Attendance Override Procedures',
    description: 'Conduct workshops for all HODs on OD leave override protocol per Section 1.2.',
    sourceCircularId: 'circ-052',
    sourceCircularRef: 'CIR-2026-052',
    sourceCircularTitle: 'Revised Attendance and Academic Monitoring Guidelines (v3.0)',
    responsibleRole: 'Academic Registrar',
    department: 'Electronics & Communication Engineering',
    deadline: '2026-09-08',
    priority: 'High',
    status: 'Overdue',
    createdDate: '2026-09-01',
  },
  {
    id: 'ca-204',
    title: 'Update Student Portal to Show 80% Threshold Alert',
    description: 'Update student self-service portal to display live biometric attendance percentage with 80% threshold warning.',
    sourceCircularId: 'circ-052',
    sourceCircularRef: 'CIR-2026-052',
    sourceCircularTitle: 'Revised Attendance and Academic Monitoring Guidelines (v3.0)',
    responsibleRole: 'IT Systems Administrator',
    department: 'Computer Science & Engineering',
    deadline: '2026-09-12',
    priority: 'High',
    status: 'Overdue',
    createdDate: '2026-09-01',
  },
  {
    id: 'ca-205',
    title: 'Configure LMS Automated Deficit Email Alerts',
    description: 'Set up automated LMS job to send Monday 08:00 deficit warnings to mentors for students below 80%.',
    sourceCircularId: 'circ-052',
    sourceCircularRef: 'CIR-2026-052',
    sourceCircularTitle: 'Revised Attendance and Academic Monitoring Guidelines (v3.0)',
    responsibleRole: 'LMS Administrator',
    department: 'Computer Science & Engineering',
    deadline: '2026-09-18',
    priority: 'Medium',
    status: 'In Progress',
    createdDate: '2026-09-01',
  },

  // ── CIRC-2026-092: Financial Signing Authority & Delegation ─────────────────
  {
    id: 'ca-301',
    title: 'Reconfigure ERP Financial Approval Matrix',
    description: 'Update ERP approval routing to reflect new delegation thresholds per CIRC-2026-092 signing authority matrix.',
    sourceCircularId: 'circ-002',
    sourceCircularRef: 'CIRC-2026-092',
    sourceCircularTitle: 'Financial Signing Authority & Delegation Matrix (v2.1)',
    responsibleRole: 'ERP Systems Administrator',
    department: 'Finance & Audit',
    deadline: '2026-09-15',
    priority: 'Critical',
    status: 'Overdue',
    createdDate: '2026-09-10',
  },
  {
    id: 'ca-302',
    title: 'Distribute Updated Signing Authority Matrix to HODs',
    description: 'Circulate new financial signing authority limits to all department heads with signed acknowledgement.',
    sourceCircularId: 'circ-002',
    sourceCircularRef: 'CIRC-2026-092',
    sourceCircularTitle: 'Financial Signing Authority & Delegation Matrix (v2.1)',
    responsibleRole: 'Finance Controller',
    department: 'Finance & Audit',
    deadline: '2026-09-20',
    priority: 'High',
    status: 'Completed',
    createdDate: '2026-09-10',
  },
  {
    id: 'ca-303',
    title: 'Train Finance Staff on New Delegation Thresholds',
    description: 'Conduct mandatory refresher training for accounts payable team on revised thresholds and approval SLAs.',
    sourceCircularId: 'circ-002',
    sourceCircularRef: 'CIRC-2026-092',
    sourceCircularTitle: 'Financial Signing Authority & Delegation Matrix (v2.1)',
    responsibleRole: 'Finance Training Manager',
    department: 'Finance & Audit',
    deadline: '2026-09-25',
    priority: 'Medium',
    status: 'Not Started',
    createdDate: '2026-09-10',
  },

  // ── CIRC-2026-095: Occupational Health & Emergency Evacuation ────────────────
  {
    id: 'ca-401',
    title: 'Verify Emergency Exit Signage — All Campus Buildings',
    description: 'Physical inspection and photographic documentation of all emergency exit routes across campus buildings.',
    sourceCircularId: 'circ-003',
    sourceCircularRef: 'CIRC-2026-095',
    sourceCircularTitle: 'Occupational Health & Emergency Evacuation Directive 2026',
    responsibleRole: 'Safety Officer',
    department: 'Operations & Supply Chain',
    deadline: '2026-10-05',
    priority: 'High',
    status: 'Not Started',
    createdDate: '2026-09-10',
  },
  {
    id: 'ca-402',
    title: 'Conduct Evacuation Drill — Block A & B',
    description: 'Execute timed evacuation drill for academic blocks A and B. Record headcount and assembly zone times.',
    sourceCircularId: 'circ-003',
    sourceCircularRef: 'CIRC-2026-095',
    sourceCircularTitle: 'Occupational Health & Emergency Evacuation Directive 2026',
    responsibleRole: 'Campus Safety Coordinator',
    department: 'Operations & Supply Chain',
    deadline: '2026-10-12',
    priority: 'Medium',
    status: 'Not Started',
    createdDate: '2026-09-10',
  },
  {
    id: 'ca-403',
    title: 'Update First Aid Kit Inventory — All Labs',
    description: 'Audit all laboratory first aid kits and replenish expired/missing supplies per safety compliance checklist.',
    sourceCircularId: 'circ-003',
    sourceCircularRef: 'CIRC-2026-095',
    sourceCircularTitle: 'Occupational Health & Emergency Evacuation Directive 2026',
    responsibleRole: 'Lab Supervisor',
    department: 'Electronics & Communication Engineering',
    deadline: '2026-09-25',
    priority: 'Medium',
    status: 'Completed',
    createdDate: '2026-09-10',
  },

  // ── CIRC-2026-088: Vendor Risk Management ────────────────────────────────────
  {
    id: 'ca-501',
    title: 'Submit Vendor Risk Assessment Form for All Active Vendors',
    description: 'Complete and submit signed vendor risk assessment forms for all vendors with active contracts.',
    sourceCircularId: 'circ-004',
    sourceCircularRef: 'CIRC-2026-088',
    sourceCircularTitle: 'Vendor Risk Management Standards',
    responsibleRole: 'Procurement Manager',
    department: 'Operations & Supply Chain',
    deadline: '2026-09-09',
    priority: 'High',
    status: 'Overdue',
    createdDate: '2026-09-05',
  },
  {
    id: 'ca-502',
    title: 'Blacklist Non-Compliant Vendors in ERP Procurement Module',
    description: 'Update procurement ERP to flag and restrict purchase orders for vendors failing risk assessment criteria.',
    sourceCircularId: 'circ-004',
    sourceCircularRef: 'CIRC-2026-088',
    sourceCircularTitle: 'Vendor Risk Management Standards',
    responsibleRole: 'ERP Procurement Admin',
    department: 'Operations & Supply Chain',
    deadline: '2026-09-28',
    priority: 'Medium',
    status: 'Not Started',
    createdDate: '2026-09-05',
  },

  // ── CIRC-2026-044: Clean Desk Policy ─────────────────────────────────────────
  {
    id: 'ca-601',
    title: 'Distribute Clean Desk Policy Checklists to All Staff',
    description: 'Share physical/digital clean desk checklists to all faculty and administrative staff workstations.',
    sourceCircularId: 'circ-005',
    sourceCircularRef: 'CIRC-2026-044',
    sourceCircularTitle: 'Clean Desk & Physical Document Disposal Policy (v1.2)',
    responsibleRole: 'Administrative Officer',
    department: 'Executive Office',
    deadline: '2026-09-16',
    priority: 'Low',
    status: 'Completed',
    createdDate: '2026-09-08',
  },
  {
    id: 'ca-602',
    title: 'Install Cross-Cut Shredders in Administrative Block',
    description: 'Procure and install approved cross-cut shredders in all administrative wing offices.',
    sourceCircularId: 'circ-005',
    sourceCircularRef: 'CIRC-2026-044',
    sourceCircularTitle: 'Clean Desk & Physical Document Disposal Policy (v1.2)',
    responsibleRole: 'Facilities Manager',
    department: 'Executive Office',
    deadline: '2026-09-30',
    priority: 'Low',
    status: 'In Progress',
    createdDate: '2026-09-08',
  },
];

// ─── Computed Department Compliance ──────────────────────────────────────────
export interface DeptCompliance {
  department: string;
  total: number;
  completed: number;
  pending: number;
  overdue: number;
  compliancePercent: number;
}

export const getDeptCompliance = (actions: ComplianceAction[]): DeptCompliance[] => {
  const deptMap: Record<string, { total: number; completed: number; pending: number; overdue: number }> = {};
  actions.forEach((a) => {
    if (!deptMap[a.department]) deptMap[a.department] = { total: 0, completed: 0, pending: 0, overdue: 0 };
    deptMap[a.department].total++;
    if (a.status === 'Completed') deptMap[a.department].completed++;
    else if (a.status === 'Overdue') deptMap[a.department].overdue++;
    else deptMap[a.department].pending++;
  });
  return Object.entries(deptMap).map(([dept, stats]) => ({
    department: dept,
    ...stats,
    compliancePercent: stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0,
  }));
};

export { daysDiff };
