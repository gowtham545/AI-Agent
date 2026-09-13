export type CircularStatus = 'Active' | 'Draft' | 'Under Review' | 'Superseded' | 'Archived';

export type CircularCategory = 
  | 'Policy & Compliance' 
  | 'Safety & Security' 
  | 'Financial & Delegation' 
  | 'Operations & Logistics' 
  | 'IT & Data Governance' 
  | 'HR & Workforce';

export type PriorityLevel = 'Critical' | 'High' | 'Medium' | 'Low';

export type DepartmentName = 
  | 'Legal & Compliance' 
  | 'Finance & Audit' 
  | 'IT & Cyber Security' 
  | 'Operations & Supply Chain' 
  | 'Human Resources' 
  | 'Executive Office' 
  | 'Health & Safety' 
  | 'All Departments';

export interface ActionItem {
  id: string;
  title: string;
  assigneeRole: string;
  targetDepartment: DepartmentName;
  dueDate: string;
  status: 'Pending' | 'In Progress' | 'Under Review' | 'Completed' | 'Overdue';
  verificationRequired: boolean;
  circularId: string;
  circularRef: string;
}

export interface RecipientRecord {
  id: string;
  circularId: string;
  circularRef: string;
  name: string;
  email: string;
  role: 'Student' | 'Faculty' | 'HOD' | 'Administrative Staff' | 'Dean' | 'Lab Assistant';
  department: string;
  deliveryStatus: 'Delivered' | 'Failed' | 'Pending';
  readStatus: 'Read' | 'Unread';
  acknowledgementStatus: 'Acknowledged' | 'Pending';
  lastActivity: string;
  remindersSent: number;
}

export interface DepartmentAck {
  department: DepartmentName;
  totalAudience: number;
  acknowledgedCount: number;
  percentage: number;
  lastUpdated: string;
}

export interface ApprovalStage {
  stage: number;
  title: string;
  approverRole: string;
  approverName: string;
  status: 'Approved' | 'Pending' | 'Rejected' | 'In Review';
  timestamp?: string;
  comments?: string;
}

export interface Circular {
  id: string;
  refNo: string;
  title: string;
  summary: string;
  aiExecutiveSummary: string;
  category: CircularCategory;
  status: CircularStatus;
  priority: PriorityLevel;
  issuingAuthority: string;
  signatoryName: string;
  signatoryTitle: string;
  effectiveDate: string;
  expiryDate?: string;
  supersedesId?: string;
  supersedesRef?: string;
  supersededById?: string;
  supersededByRef?: string;
  version: string;
  tags: string[];
  affectedAudience: {
    departments: DepartmentName[];
    totalCount: number;
    ackCount: number;
    ackPercentage: number;
  };
  actionItems: ActionItem[];
  approvalChain: ApprovalStage[];
  departmentBreakdown: DepartmentAck[];
  conflictCheckStatus: 'No Conflicts' | 'Minor Overlay' | 'Conflict Detected';
  conflictDetails?: string;
  reasonForChange?: string;
  whyCurrentExplanation?: string;
  lineageChain?: Array<{
    id: string;
    refNo: string;
    title: string;
    version: string;
    status: CircularStatus;
    effectiveDate: string;
    reasonForChange?: string;
  }>;
  documentUrl?: string;
  contentMarkdown: string;
  createdAt: string;
  updatedAt: string;
}

export interface CircularFilterState {
  searchQuery: string;
  status: string;
  category: string;
  priority: string;
  department: string;
}

export interface SmartAction {
  id: string;
  label: string;
  actionType: 'view_circular' | 'send_reminder' | 'check_status' | 'start_approval' | 'view_audit' | 'view_lineage';
  targetId?: string;
  targetRef?: string;
  variant?: 'primary' | 'secondary' | 'warning' | 'success';
}

export interface StructuredCard {
  cardType: 'active_circular' | 'supersession' | 'actions_summary' | 'compliance_summary' | 'recipients_summary' | 'expiring_summary' | 'no_result';
  badge?: string;
  badgeVariant?: 'emerald' | 'amber' | 'indigo' | 'sky' | 'rose';
  title: string;
  subtitle?: string;
  circularRef?: string;
  circularId?: string;
  status?: string;
  effectiveDate?: string;
  department?: string;
  supersedesRef?: string;
  keyPoints?: string[];
  metrics?: Array<{ label: string; value: string | number; color?: string }>;
}

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  thinkingSteps?: string[];
  smartActions?: SmartAction[];
  referencedCirculars?: Array<{
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
}



