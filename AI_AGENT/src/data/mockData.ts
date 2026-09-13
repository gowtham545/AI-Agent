import type { Circular, ActionItem, CircularCategory, DepartmentName } from '../types';

export const mockCirculars: Circular[] = [
  // ─── 1. Active: AI Governance (v3.0) ──────────────────────────────────────
  {
    id: 'circ-001',
    refNo: 'CIRC-2026-089',
    title: 'Enterprise AI Safety Governance & Data Protection Protocol (v3.0)',
    summary: 'Establishes mandatory security boundaries, model usage permissions, and compliance logging for all AI tools deployed within institutional infrastructure.',
    aiExecutiveSummary: 'AI Circular #089 replaces CIRC-2024-042. Mandates multi-factor authentication for AI model endpoints, restricts sensitive PII uploads, and introduces quarterly compliance logging. High compliance urgency for IT, Legal, and HR.',
    category: 'IT & Data Governance',
    status: 'Active',
    priority: 'Critical',
    issuingAuthority: 'Office of the Chief Information Security Officer',
    signatoryName: 'Dr. Aris Thorne',
    signatoryTitle: 'Chief Information Security Officer',
    effectiveDate: '2026-09-01',
    expiryDate: '2027-08-31',
    supersedesId: 'circ-006',
    supersedesRef: 'CIRC-2024-042',
    version: '3.0',
    tags: ['AI Governance', 'Data Privacy', 'Security', 'GDPR', 'Compliance'],
    reasonForChange: 'Mandated strict internal AI Gateway routing (ai-gateway.internal), prohibited unapproved third-party LLM PII data ingestion, and added certified AI Compliance Officer requirements.',
    whyCurrentExplanation: 'Formally signed into law by CISO Dr. Aris Thorne on Sep 1, 2026. Fully supersedes and voids legacy interim guidelines (CIRC-2024-042). All departmental query routing must strictly adhere to v3.0 telemetry specifications.',
    affectedAudience: {
      departments: ['IT & Cyber Security', 'Legal & Compliance', 'Human Resources', 'Executive Office'],
      totalCount: 4250,
      ackCount: 3980,
      ackPercentage: 93.6,
    },
    conflictCheckStatus: 'No Conflicts',
    contentMarkdown: `
# DIRECTIVE CIRC-2026-089
**SUBJECT:** Enterprise AI Safety Governance & Data Protection Protocol (v3.0)  
**ISSUED BY:** Office of the Chief Information Security Officer  
**DATE:** September 1, 2026  

---

### 1. Purpose & Scope
This circular establishes binding governance controls across all business units regarding operational deployment, API access, and user interaction with Generative AI and Machine Learning systems.

### 2. Key Mandates
1. **Sanitized Input Mandates:** Zero raw Customer Personally Identifiable Information (PII) or confidential institutional assets may be inputted into external LLMs.
2. **Access Control & Telemetry:** All corporate AI query traffic must route through the internal API Gateway (\`ai-gateway.internal\`) with mandatory token tracking.
3. **Departmental AI Risk Officer:** Each department director must designate a certified AI Compliance Delegate by **September 30, 2026**.

### 3. Supersession Notice
This directive formally supersedes **CIRC-2024-042 (Interim AI Guidelines v2.0)**.
    `,
    actionItems: [
      {
        id: 'act-101',
        title: 'Appoint Departmental AI Risk Officer & Submit Credentials',
        assigneeRole: 'Department Heads',
        targetDepartment: 'IT & Cyber Security',
        dueDate: '2026-09-30',
        status: 'In Progress',
        verificationRequired: true,
        circularId: 'circ-001',
        circularRef: 'CIRC-2026-089',
      },
      {
        id: 'act-102',
        title: 'Audit and Revoke Direct External API Tokens for Unapproved Vendors',
        assigneeRole: 'Lead Security Engineer',
        targetDepartment: 'IT & Cyber Security',
        dueDate: '2026-09-20',
        status: 'Completed',
        verificationRequired: true,
        circularId: 'circ-001',
        circularRef: 'CIRC-2026-089',
      },
      {
        id: 'act-103',
        title: 'Conduct Staff Briefing on PII Protection Rules in AI Workflows',
        assigneeRole: 'HR Compliance Manager',
        targetDepartment: 'Human Resources',
        dueDate: '2026-10-15',
        status: 'Pending',
        verificationRequired: false,
        circularId: 'circ-001',
        circularRef: 'CIRC-2026-089',
      },
    ],
    approvalChain: [
      { stage: 1, title: 'Drafting & Legal Scrutiny', approverRole: 'Senior Legal Counsel', approverName: 'Elena Rostova', status: 'Approved', timestamp: '2026-08-25 14:20' },
      { stage: 2, title: 'CISO Technical Verification', approverRole: 'Chief Info Security Officer', approverName: 'Dr. Aris Thorne', status: 'Approved', timestamp: '2026-08-28 09:15' },
      { stage: 3, title: 'Executive Committee Approval', approverRole: 'Chief Operating Officer', approverName: 'Marcus Vance', status: 'Approved', timestamp: '2026-08-31 16:45' },
    ],
    departmentBreakdown: [
      { department: 'IT & Cyber Security', totalAudience: 850, acknowledgedCount: 840, percentage: 98.8, lastUpdated: '2026-09-10' },
      { department: 'Legal & Compliance', totalAudience: 320, acknowledgedCount: 320, percentage: 100.0, lastUpdated: '2026-09-08' },
      { department: 'Human Resources', totalAudience: 580, acknowledgedCount: 520, percentage: 89.6, lastUpdated: '2026-09-09' },
      { department: 'Executive Office', totalAudience: 2500, acknowledgedCount: 2300, percentage: 92.0, lastUpdated: '2026-09-11' },
    ],
    createdAt: '2026-08-20',
    updatedAt: '2026-09-01',
  },

  // ─── 2. Active: Attendance & Academic Monitoring (v3.0 - CIR-2026-052) ────
  {
    id: 'circ-052',
    refNo: 'CIR-2026-052',
    title: 'Revised Attendance and Academic Monitoring Guidelines (v3.0)',
    summary: 'Binding institutional standard for minimum 80% biometric attendance, Automated LMS weekly deficit flagging, and revised exam eligibility criteria.',
    aiExecutiveSummary: 'CIR-2026-052 is the ACTIVE current attendance rule. Supersedes CIR-2026-041 and CIR-2026-018. Raises threshold to 80% biometric verification and automates student shortfall escalations.',
    category: 'Policy & Compliance',
    status: 'Active',
    priority: 'High',
    issuingAuthority: 'Directorate of Academic Affairs & Student Governance',
    signatoryName: 'Prof. K. Rajasekhar',
    signatoryTitle: 'Dean of Academic Affairs',
    effectiveDate: '2026-09-01',
    expiryDate: '2027-08-31',
    supersedesId: 'circ-041',
    supersedesRef: 'CIR-2026-041',
    version: '3.0',
    tags: ['Attendance', 'Academic Policy', 'Biometric', 'LMS Sync', 'Exam Rules'],
    reasonForChange: 'Upgraded from manual register entry to RFID/biometric gates, raised requirement from 75% to 80%, and instituted weekly auto-email warnings to parents & faculty advisors.',
    whyCurrentExplanation: 'Formally approved by the Academic Council on August 28, 2026 and effective September 1, 2026. This directive renders CIR-2026-041 completely obsolete. All semester grade registrations and hall ticket permissions are verified strictly against CIR-2026-052 standards.',
    affectedAudience: {
      departments: ['Legal & Compliance', 'Operations & Supply Chain', 'Human Resources', 'Executive Office'],
      totalCount: 6800,
      ackCount: 6420,
      ackPercentage: 94.4,
    },
    conflictCheckStatus: 'No Conflicts',
    contentMarkdown: `
# DIRECTIVE CIR-2026-052
**SUBJECT:** Revised Attendance and Academic Monitoring Guidelines (v3.0)  
**ISSUED BY:** Directorate of Academic Affairs  
**EFFECTIVE DATE:** September 1, 2026  

---

### 1. Attendance Standard
1. Minimum aggregate attendance threshold is established at **80.0%** across all registered laboratory and theory courses.
2. Attendance is captured via automated biometric & RFID turnstiles. Manual faculty overwrites are restricted to documented on-duty (OD) leaves.

### 2. Deficit Escalation Workflow
- **Weekly LMS Sync:** Students falling below 80% trigger automated alerts to mentors on Mondays at 08:00.
- **Exam Ineligibility:** Condonation is strictly limited to medical emergencies with prior HOD endorsement (>70% absolute minimum).

### 3. Supersession
This directive formally supersedes **CIR-2026-041 (v2.0)** and **CIR-2026-018 (v1.0)**.
    `,
    actionItems: [
      {
        id: 'act-5201',
        title: 'Sync Biometric Gate Logs with Campus ERP & LMS System',
        assigneeRole: 'IT Academic Systems Lead',
        targetDepartment: 'IT & Cyber Security',
        dueDate: '2026-09-15',
        status: 'In Progress',
        verificationRequired: true,
        circularId: 'circ-052',
        circularRef: 'CIR-2026-052',
      },
      {
        id: 'act-5202',
        title: 'Publish Weekly Attendance Shortfall Matrix to Department Notice Boards',
        assigneeRole: 'Faculty Academic Coordinators',
        targetDepartment: 'Operations & Supply Chain',
        dueDate: '2026-09-22',
        status: 'Pending',
        verificationRequired: false,
        circularId: 'circ-052',
        circularRef: 'CIR-2026-052',
      },
    ],
    approvalChain: [
      { stage: 1, title: 'Academic Regulations Committee', approverRole: 'Convener', approverName: 'Dr. S. Meenakshi', status: 'Approved', timestamp: '2026-08-20 10:00' },
      { stage: 2, title: 'Dean Academic Affairs Review', approverRole: 'Dean Academic Affairs', approverName: 'Prof. K. Rajasekhar', status: 'Approved', timestamp: '2026-08-25 15:30' },
      { stage: 3, title: 'Vice Chancellor Ratification', approverRole: 'Vice Chancellor', approverName: 'Prof. P. Nagabhushan', status: 'Approved', timestamp: '2026-08-28 17:00' },
    ],
    departmentBreakdown: [
      { department: 'Operations & Supply Chain', totalAudience: 3400, acknowledgedCount: 3200, percentage: 94.1, lastUpdated: '2026-09-11' },
      { department: 'Human Resources', totalAudience: 600, acknowledgedCount: 580, percentage: 96.6, lastUpdated: '2026-09-10' },
      { department: 'Executive Office', totalAudience: 2800, acknowledgedCount: 2640, percentage: 94.2, lastUpdated: '2026-09-11' },
    ],
    createdAt: '2026-08-15',
    updatedAt: '2026-09-01',
  },

  // ─── 3. Superseded: Attendance Guidelines (v2.0 - CIR-2026-041) ───────────
  {
    id: 'circ-041',
    refNo: 'CIR-2026-041',
    title: 'Attendance and Academic Monitoring Guidelines (v2.0) [SUPERSEDED]',
    summary: 'Previous academic guidelines setting minimum 75% attendance threshold with manual weekly portal data submissions.',
    aiExecutiveSummary: 'THIS CIRCULAR HAS BEEN SUPERSEDED BY CIR-2026-052 (v3.0). It is NO LONGER ACTIVE. The 75% attendance threshold has been superseded by the current 80% biometric standard.',
    category: 'Policy & Compliance',
    status: 'Superseded',
    priority: 'Medium',
    issuingAuthority: 'Office of Academic Affairs',
    signatoryName: 'Prof. K. Rajasekhar',
    signatoryTitle: 'Dean of Academic Affairs',
    effectiveDate: '2025-08-01',
    expiryDate: '2026-08-31',
    supersedesId: 'circ-018',
    supersedesRef: 'CIR-2026-018',
    supersededById: 'circ-052',
    supersededByRef: 'CIR-2026-052',
    version: '2.0',
    tags: ['Legacy', 'Attendance', 'Superseded'],
    reasonForChange: 'Transitioned from paper registers to web-based faculty portal entry with a 75% threshold.',
    whyCurrentExplanation: 'Superseded on Sep 1, 2026 by CIR-2026-052. Contains outdated 75% manual logging rules that are not valid under current academic regulations.',
    affectedAudience: {
      departments: ['Operations & Supply Chain', 'Human Resources'],
      totalCount: 5400,
      ackCount: 5400,
      ackPercentage: 100.0,
    },
    conflictCheckStatus: 'Conflict Detected',
    conflictDetails: 'Potential conflict: CIR-2026-041 permits manual 75% threshold, whereas current active CIR-2026-052 strictly requires 80% biometric attendance.',
    contentMarkdown: `
# SUPERSEDED DIRECTIVE CIR-2026-041
> [!WARNING]  
> **THIS POLICY IS HISTORICAL AND SUPERSEDED.**  
> Refer to CIR-2026-052 for active academic attendance regulations.
    `,
    actionItems: [],
    approvalChain: [
      { stage: 1, title: 'Archived Signoff', approverRole: 'Registrar', approverName: 'Academic Archive', status: 'Approved', timestamp: '2026-09-01' }
    ],
    departmentBreakdown: [],
    createdAt: '2025-07-15',
    updatedAt: '2026-09-01',
  },

  // ─── 4. Superseded: Foundational Attendance (v1.0 - CIR-2026-018) ─────────
  {
    id: 'circ-018',
    refNo: 'CIR-2026-018',
    title: 'Foundational Attendance & Class Engagement Regulations (v1.0) [SUPERSEDED]',
    summary: 'Original foundational regulation from 2023 establishing physical ledger book attendance and semester paper auditing.',
    aiExecutiveSummary: 'ORIGINAL BASELINE DIRECTIVE (v1.0). Superseded first by CIR-2026-041 and currently superseded by CIR-2026-052.',
    category: 'Policy & Compliance',
    status: 'Superseded',
    priority: 'Low',
    issuingAuthority: 'Office of Academic Affairs',
    signatoryName: 'Dr. V. Prasad',
    signatoryTitle: 'Former Dean of Academics',
    effectiveDate: '2023-09-01',
    expiryDate: '2025-07-31',
    supersededById: 'circ-041',
    supersededByRef: 'CIR-2026-041',
    version: '1.0',
    tags: ['Legacy', 'Attendance', 'Initial Version', 'Archived'],
    reasonForChange: 'Original institutional policy baseline formulated for physical classroom logging.',
    whyCurrentExplanation: 'Archived historical document (v1.0). Superseded sequentially by v2.0 and v3.0.',
    affectedAudience: {
      departments: ['Operations & Supply Chain'],
      totalCount: 4000,
      ackCount: 4000,
      ackPercentage: 100.0,
    },
    conflictCheckStatus: 'No Conflicts',
    contentMarkdown: `
# HISTORICAL DIRECTIVE CIR-2026-018 (v1.0)
Original baseline paper register policy. Formally rescinded.
    `,
    actionItems: [],
    approvalChain: [],
    departmentBreakdown: [],
    createdAt: '2023-08-10',
    updatedAt: '2025-08-01',
  },

  // ─── 5. Active: Financial Delegation (v2.1 - CIRC-2026-092) ───────────────
  {
    id: 'circ-002',
    refNo: 'CIRC-2026-092',
    title: 'Financial Delegation of Authority & Capital Expenditure Thresholds',
    summary: 'Re-aligns signing thresholds for departmental purchases, capital projects, software licensing, and emergency operational disbursements.',
    aiExecutiveSummary: 'CIRC-2026-092 raises Manager sign-off limits to $50,000 and requires dual C-level approval for commitments exceeding $500,000. All active procurement workflows must update routing logic immediately.',
    category: 'Financial & Delegation',
    status: 'Active',
    priority: 'High',
    issuingAuthority: 'Office of the Chief Financial Officer',
    signatoryName: 'Victoria Sterling',
    signatoryTitle: 'Chief Financial Officer',
    effectiveDate: '2026-09-10',
    expiryDate: '2028-09-09',
    supersedesId: 'circ-007',
    supersedesRef: 'CIRC-2025-014',
    version: '2.1',
    tags: ['Finance', 'Approval Limits', 'CapEx', 'Audit', 'Procurement'],
    reasonForChange: 'Adjusted for inflation and expanded departmental autonomous procurement to $50,000, while introducing mandatory dual executive sign-offs for capital outlays >$500,000.',
    whyCurrentExplanation: 'Ratified by CFO Victoria Sterling and Executive Board on Sep 9, 2026. Supersedes CIRC-2025-014 and is actively embedded in ERP SAP approval routes.',
    affectedAudience: {
      departments: ['Finance & Audit', 'Operations & Supply Chain', 'Executive Office'],
      totalCount: 1850,
      ackCount: 1620,
      ackPercentage: 87.5,
    },
    conflictCheckStatus: 'No Conflicts',
    contentMarkdown: `
# DIRECTIVE CIRC-2026-092
**SUBJECT:** Financial Delegation of Authority & Capital Expenditure Thresholds  
**ISSUED BY:** Office of the Chief Financial Officer  
**DATE:** September 10, 2026  

---

### 1. New Financial Limits
- **Tier 1 (Operational Manager):** Up to $50,000 per single transaction.
- **Tier 2 (Vice President / General Manager):** Up to $250,000.
- **Tier 3 (Executive Vice President / CFO):** Up to $500,000.
- **Tier 4 (Board / CEO + CFO Dual Approval):** Over $500,000.
    `,
    actionItems: [
      {
        id: 'act-201',
        title: 'Reconfigure SAP / ERP Financial Approval Hierarchy Matrix',
        assigneeRole: 'ERP Systems Administrator',
        targetDepartment: 'Finance & Audit',
        dueDate: '2026-09-15',
        status: 'In Progress',
        verificationRequired: true,
        circularId: 'circ-002',
        circularRef: 'CIRC-2026-092',
      },
    ],
    approvalChain: [
      { stage: 1, title: 'Internal Audit Assessment', approverRole: 'Head of Audit', approverName: 'David Chen', status: 'Approved', timestamp: '2026-09-02 11:00' },
      { stage: 2, title: 'CFO Authorization', approverRole: 'Chief Financial Officer', approverName: 'Victoria Sterling', status: 'Approved', timestamp: '2026-09-09 15:30' },
    ],
    departmentBreakdown: [
      { department: 'Finance & Audit', totalAudience: 420, acknowledgedCount: 415, percentage: 98.8, lastUpdated: '2026-09-11' },
      { department: 'Operations & Supply Chain', totalAudience: 980, acknowledgedCount: 810, percentage: 82.6, lastUpdated: '2026-09-11' },
      { department: 'Executive Office', totalAudience: 450, acknowledgedCount: 395, percentage: 87.7, lastUpdated: '2026-09-10' },
    ],
    createdAt: '2026-09-01',
    updatedAt: '2026-09-10',
  },

  // ─── 6. Under Review: Emergency Evacuation (CIRC-2026-095) ────────────────
  {
    id: 'circ-003',
    refNo: 'CIRC-2026-095',
    title: 'Occupational Health & Emergency Evacuation Directive 2026',
    summary: 'Standardizes mandatory evacuation protocols, floor warden assignments, assembly points, and bi-annual safety drill schedules across regional campuses.',
    aiExecutiveSummary: 'Mandatory fire & emergency safety updates. All site facility leads must verify emergency exits and warden rosters before October 1, 2026.',
    category: 'Safety & Security',
    status: 'Under Review',
    priority: 'Critical',
    issuingAuthority: 'Directorate of Health, Safety & Environment (HSE)',
    signatoryName: 'Commander Evelyn Vance',
    signatoryTitle: 'Director of HSE Operations',
    effectiveDate: '2026-10-01',
    expiryDate: '2027-09-30',
    version: '1.0',
    tags: ['Safety', 'Emergency', 'OSHA', 'Evacuation', 'Facility'],
    reasonForChange: 'New comprehensive campus safety standard integrating multi-building muster point telemetry.',
    whyCurrentExplanation: 'Pending stage 2 and 3 executive approval. Once ratified, it will supersede legacy safety memo CIRC-2023-011.',
    affectedAudience: {
      departments: ['Health & Safety', 'Operations & Supply Chain', 'All Departments'],
      totalCount: 8200,
      ackCount: 1200,
      ackPercentage: 14.6,
    },
    conflictCheckStatus: 'Minor Overlay',
    conflictDetails: 'Minor overlap with CIRC-2023-011 on assembly zone numbers at Facility B.',
    contentMarkdown: `
# DRAFT DIRECTIVE CIRC-2026-095
**SUBJECT:** Occupational Health & Emergency Evacuation Directive 2026  
**STATUS:** PENDING EXECUTIVE SIGN-OFF  
    `,
    actionItems: [
      {
        id: 'act-301',
        title: 'Verify Emergency Exit Signage and Floor Warden Badging',
        assigneeRole: 'Facility Managers',
        targetDepartment: 'Health & Safety',
        dueDate: '2026-10-05',
        status: 'Pending',
        verificationRequired: true,
        circularId: 'circ-003',
        circularRef: 'CIRC-2026-095',
      },
    ],
    approvalChain: [
      { stage: 1, title: 'HSE Risk Assessment', approverRole: 'Director of HSE', approverName: 'Evelyn Vance', status: 'Approved', timestamp: '2026-09-10 10:00' },
      { stage: 2, title: 'Legal Regulatory Review', approverRole: 'Compliance Officer', approverName: 'Julian Bell', status: 'In Review', timestamp: undefined },
      { stage: 3, title: 'COO Approval', approverRole: 'Chief Operating Officer', approverName: 'Marcus Vance', status: 'Pending', timestamp: undefined },
    ],
    departmentBreakdown: [
      { department: 'Health & Safety', totalAudience: 150, acknowledgedCount: 150, percentage: 100.0, lastUpdated: '2026-09-11' },
      { department: 'Operations & Supply Chain', totalAudience: 2400, acknowledgedCount: 450, percentage: 18.75, lastUpdated: '2026-09-11' },
      { department: 'All Departments', totalAudience: 5650, acknowledgedCount: 600, percentage: 10.6, lastUpdated: '2026-09-11' },
    ],
    createdAt: '2026-09-08',
    updatedAt: '2026-09-11',
  },

  // ─── 7. Active: Third-Party Vendor Risk (CIRC-2026-068) ────────────────────
  {
    id: 'circ-005',
    refNo: 'CIRC-2026-068',
    title: 'Vendor Risk Management & Third-Party Audit Standards',
    summary: 'Binding standards for external supplier security vetting, cloud API access controls, and quarterly vulnerability reporting.',
    aiExecutiveSummary: 'CIRC-2026-068 requires SOC2 Type II certifications for all Tier 1 vendors.',
    category: 'Policy & Compliance',
    status: 'Active',
    priority: 'High',
    issuingAuthority: 'Office of Legal & Risk Compliance',
    signatoryName: 'Robert Langdon',
    signatoryTitle: 'Head of Enterprise Risk',
    effectiveDate: '2026-07-01',
    expiryDate: '2028-06-30',
    version: '1.0',
    tags: ['Vendor Risk', 'SOC2', 'Compliance', 'Audit'],
    reasonForChange: 'Initial comprehensive third-party vendor risk framework.',
    whyCurrentExplanation: 'Active directive ratified on June 28, 2026.',
    affectedAudience: {
      departments: ['Legal & Compliance', 'Operations & Supply Chain', 'Finance & Audit'],
      totalCount: 3100,
      ackCount: 3010,
      ackPercentage: 97.1,
    },
    conflictCheckStatus: 'No Conflicts',
    contentMarkdown: `
# DIRECTIVE CIRC-2026-068
**SUBJECT:** Vendor Risk Management & Third-Party Audit Standards  
    `,
    actionItems: [],
    approvalChain: [],
    departmentBreakdown: [],
    createdAt: '2026-06-15',
    updatedAt: '2026-07-01',
  },

  // ─── 8. Superseded: Interim AI Guidelines (CIRC-2024-042) ──────────────────
  {
    id: 'circ-006',
    refNo: 'CIRC-2024-042',
    title: 'Interim AI Usage & Data Guidelines (v2.0) [SUPERSEDED]',
    summary: 'Initial interim policy governing early deployment of machine translation and document summary tools.',
    aiExecutiveSummary: 'SUPERSEDED BY CIRC-2026-089 (v3.0). It is NO LONGER ACTIVE.',
    category: 'IT & Data Governance',
    status: 'Superseded',
    priority: 'Medium',
    issuingAuthority: 'Office of the Chief Information Security Officer',
    signatoryName: 'Dr. Aris Thorne',
    signatoryTitle: 'Chief Information Security Officer',
    effectiveDate: '2024-05-10',
    expiryDate: '2026-08-31',
    supersededById: 'circ-001',
    supersededByRef: 'CIRC-2026-089',
    version: '2.0',
    tags: ['Legacy', 'AI Policy', 'Superseded'],
    reasonForChange: 'Legacy guideline allowed basic public LLM test experiments with manager sign-off.',
    whyCurrentExplanation: 'Superseded on Sep 1, 2026 by CIRC-2026-089 which bans direct external API calls and mandates ai-gateway routing.',
    affectedAudience: {
      departments: ['IT & Cyber Security'],
      totalCount: 2400,
      ackCount: 2400,
      ackPercentage: 100.0,
    },
    conflictCheckStatus: 'Conflict Detected',
    conflictDetails: 'Conflict: CIRC-2024-042 permitted direct external prompt testing, while active CIRC-2026-089 strictly prohibits external LLM PII input.',
    contentMarkdown: `
# SUPERSEDED DIRECTIVE CIRC-2024-042
> [!WARNING]  
> Refer to CIRC-2026-089 for active directives.
    `,
    actionItems: [],
    approvalChain: [],
    departmentBreakdown: [],
    createdAt: '2024-05-01',
    updatedAt: '2026-09-01',
  },

  // ─── 9. Superseded: Financial Matrix 2025 (CIRC-2025-014) ─────────────────
  {
    id: 'circ-007',
    refNo: 'CIRC-2025-014',
    title: 'Financial Signing Authority Matrix 2025 [SUPERSEDED]',
    summary: 'Previous delegation matrix for departmental expenditure and purchase approval routing.',
    aiExecutiveSummary: 'SUPERSEDED BY CIRC-2026-092 (v2.1). Refer to CIRC-2026-092 for updated limit thresholds.',
    category: 'Financial & Delegation',
    status: 'Superseded',
    priority: 'Medium',
    issuingAuthority: 'Office of the Chief Financial Officer',
    signatoryName: 'Victoria Sterling',
    signatoryTitle: 'Chief Financial Officer',
    effectiveDate: '2025-01-15',
    expiryDate: '2026-09-09',
    supersededById: 'circ-002',
    supersededByRef: 'CIRC-2026-092',
    version: '1.5',
    tags: ['Legacy', 'Finance', 'Superseded'],
    reasonForChange: 'Legacy manager limit was capped at $20,000.',
    whyCurrentExplanation: 'Superseded by CIRC-2026-092 which increased manager sign-off to $50,000.',
    affectedAudience: {
      departments: ['Finance & Audit'],
      totalCount: 1500,
      ackCount: 1500,
      ackPercentage: 100.0,
    },
    conflictCheckStatus: 'Conflict Detected',
    conflictDetails: 'Conflict: Outdated $20,000 cap contradicts current $50,000 authorization.',
    contentMarkdown: `
# SUPERSEDED DIRECTIVE CIRC-2025-014
    `,
    actionItems: [],
    approvalChain: [],
    departmentBreakdown: [],
    createdAt: '2025-01-02',
    updatedAt: '2026-09-10',
  },

  // ─── 10. Active: Clean Desk & Paper Shredding (CIRC-2026-044) ─────────────
  {
    id: 'circ-008',
    refNo: 'CIRC-2026-044',
    title: 'Clean Desk & Physical Document Disposal Regulations',
    summary: 'Mandatory shredding procedures for physical documents containing proprietary business secrets or employee data.',
    aiExecutiveSummary: 'Requires secure locked disposal bins in all open floor offices and daily end-of-day desk clearings.',
    category: 'Safety & Security',
    status: 'Active',
    priority: 'Medium',
    issuingAuthority: 'Corporate Facilities & Physical Security',
    signatoryName: 'Michael Vance',
    signatoryTitle: 'Head of Physical Security',
    effectiveDate: '2026-04-01',
    expiryDate: '2028-03-31',
    version: '1.2',
    tags: ['Physical Security', 'Clean Desk', 'Document Shredding'],
    reasonForChange: 'Mandatory ISO 27001 physical security control update.',
    whyCurrentExplanation: 'Active protocol implemented on April 1, 2026.',
    affectedAudience: {
      departments: ['All Departments'],
      totalCount: 9500,
      ackCount: 9120,
      ackPercentage: 96.0,
    },
    conflictCheckStatus: 'No Conflicts',
    contentMarkdown: `
# DIRECTIVE CIRC-2026-044
    `,
    actionItems: [],
    approvalChain: [],
    departmentBreakdown: [],
    createdAt: '2026-03-20',
    updatedAt: '2026-04-01',
  }
];

export const mockDashboardMetrics = {
  totalActiveCirculars: 5,
  overallAcknowledgementRate: 94.2,
  pendingApprovalsCount: 2,
  overdueActionsCount: 2,
  totalAudienceReach: 14250,
  aiScannedPoliciesThisMonth: 34,
  complianceScore: 96,
  supersededRulesCount: 4,
  conflictsDetectedCount: 3,
};

export const mockDepartmentComplianceData = [
  { department: 'Legal & Compliance', rate: 99.4, total: 320, acked: 318 },
  { department: 'IT & Cyber Security', rate: 98.8, total: 850, acked: 840 },
  { department: 'Finance & Audit', rate: 98.1, total: 420, acked: 412 },
  { department: 'Executive Office', rate: 94.5, total: 2500, acked: 2362 },
  { department: 'HR & Workforce', rate: 89.6, total: 580, acked: 520 },
  { department: 'Operations & Supply', rate: 84.2, total: 2400, acked: 2020 },
  { department: 'Health & Safety', rate: 78.5, total: 1800, acked: 1413 },
];

export const mockCategoryDistribution = [
  { name: 'Policy & Compliance', count: 4, color: '#10b981' },
  { name: 'IT & Data Governance', count: 3, color: '#3b82f6' },
  { name: 'Financial & Delegation', count: 2, color: '#8b5cf6' },
  { name: 'Safety & Security', count: 2, color: '#f59e0b' },
  { name: 'HR & Workforce', count: 1, color: '#ec4899' },
];

export const mockMonthlyTrends = [
  { month: 'Apr', issued: 4, ackRate: 91.2 },
  { month: 'May', issued: 6, ackRate: 92.5 },
  { month: 'Jun', issued: 3, ackRate: 95.0 },
  { month: 'Jul', issued: 5, ackRate: 93.8 },
  { month: 'Aug', issued: 7, ackRate: 96.1 },
  { month: 'Sep', issued: 5, ackRate: 94.2 },
];

export const mockCopilotPrompts = [
  'Which circular is currently active for attendance?',
  'Which circular superseded the previous attendance policy?',
  'What is the latest attendance rule?',
  'Show me the history of attendance circulars.',
  'When did the current rule become effective?',
];

export const mockInitialMessages = [
  {
    id: 'msg-1',
    sender: 'assistant' as const,
    text: 'Hello! I am **Cira**, your Circular Intelligence Agent. I can identify current active rules, trace version lineages (e.g. CIR-2026-018 ➔ CIR-2026-041 ➔ CIR-2026-052), detect policy conflicts, and audit compliance.\n\nAsk me about any institutional rule or policy revision history!',
    timestamp: '10:30 AM',
  }
];
