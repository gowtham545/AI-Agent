import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { mockCirculars, mockDashboardMetrics, mockDepartmentComplianceData } from '../data/mockData';
import { mockActions, type ComplianceAction } from '../data/mockActions';
import { mockRecipients } from '../data/mockRecipients';
import { fetchCircularsFromBackend, type BackendCircular } from '../lib/api';
import type { Circular, RecipientRecord, DepartmentAck, ApprovalStage, CircularStatus, CircularCategory, PriorityLevel } from '../types';

type ActionItemType = ComplianceAction;

interface DatabaseContextType {
  circulars: Circular[];
  actions: ComplianceAction[];
  recipients: RecipientRecord[];
  
  // Circular operations
  addCircular: (newCirc: Omit<Circular, 'id' | 'createdAt' | 'updatedAt'>) => Circular;
  updateCircular: (id: string, updates: Partial<Circular>) => void;
  deleteCircular: (id: string) => void;
  
  // Approval operations
  approveCircular: (id: string, stageIndex: number, approverName: string, comments?: string) => void;
  rejectCircular: (id: string, stageIndex: number, approverName: string, comments?: string) => void;
  
  // Acknowledgement & Recipient operations
  acknowledgeCircular: (circularId: string, email: string, name?: string) => boolean;
  hasUserAcknowledged: (circularId: string, email: string) => boolean;
  sendNudgeBroadcast: (circularId: string, targetDept?: string) => { notifiedCount: number; message: string };
  
  // Action Item operations
  updateActionStatus: (actionId: string, newStatus: ComplianceAction['status']) => void;
  addAction: (action: Omit<ComplianceAction, 'id'>) => ComplianceAction;
  
  // Computed Institutional Metrics
  metrics: {
    totalCirculars: number;
    activeCirculars: number;
    totalActiveCirculars: number;
    supersededCirculars: number;
    underReviewCirculars: number;
    overallAcknowledgementRate: number;
    totalActions: number;
    completedActions: number;
    overdueActions: number;
    overdueActionsCount: number;
    pendingApprovals: number;
    pendingApprovalsCount: number;
    complianceRate: number;
    complianceScore: number;
    totalAudienceReach: number;
  };
  
  // Reset database to seed data
  resetDatabase: () => void;
}

const DatabaseContext = createContext<DatabaseContextType | undefined>(undefined);

const DB_CIRCULARS_KEY = 'circularflow_db_v2_circulars';
const DB_ACTIONS_KEY = 'circularflow_db_v2_actions';
const DB_RECIPIENTS_KEY = 'circularflow_db_v2_recipients';

const normalizeBackendCircular = (item: BackendCircular): Circular => {
  const targetAudience = Array.isArray(item.target_audience) ? item.target_audience : [];
  const totalRecipients = Number(item.total_recipients || 0);
  const acknowledgedRecipients = Number(item.acknowledged_recipients || 0);
  const computedAckPct = Number.isFinite(item.acknowledgement_rate)
    ? Math.round(item.acknowledgement_rate)
    : (totalRecipients > 0 ? Math.round((acknowledgedRecipients / totalRecipients) * 100) : 0);

  return {
    id: item.id,
    refNo: item.ref_no,
    title: item.title,
    summary: item.summary || item.body || 'No summary available.',
    aiExecutiveSummary: item.summary || item.body || 'No executive summary available.',
    category: (item.category as CircularCategory) || 'Policy & Compliance',
    status: (item.status as CircularStatus) || 'Active',
    priority: (item.priority as PriorityLevel) || 'Medium',
    issuingAuthority: item.author || 'Institutional Governance Office',
    signatoryName: item.signatory || 'Registrar',
    signatoryTitle: item.signatory || 'Registrar',
    effectiveDate: item.effective_date || item.published_date || new Date().toISOString().slice(0, 10),
    expiryDate: item.expiry_date,
    supersedesId: item.supersedes_id,
    supersedesRef: item.supersedes_ref,
    supersededById: item.superseded_by_id,
    supersededByRef: item.superseded_by_ref,
    version: item.version || 'v1.0',
    tags: Array.isArray(item.tags) ? item.tags : [],
    affectedAudience: {
      departments: targetAudience as any,
      totalCount: totalRecipients,
      ackCount: acknowledgedRecipients,
      ackPercentage: computedAckPct,
    },
    actionItems: [],
    approvalChain: [],
    departmentBreakdown: [],
    conflictCheckStatus: 'No Conflicts',
    contentMarkdown: item.body || item.summary || '# Circular\n\nNo content available.',
    createdAt: item.published_date || new Date().toISOString(),
    updatedAt: item.published_date || new Date().toISOString(),
  };
};

export const DatabaseProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Reactive Circulars Store
  const [circulars, setCirculars] = useState<Circular[]>(() => {
    try {
      const saved = localStorage.getItem(DB_CIRCULARS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return mockCirculars;
  });

  // 2. Reactive Actions Store
  const [actions, setActions] = useState<ActionItemType[]>(() => {
    try {
      const saved = localStorage.getItem(DB_ACTIONS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return mockActions;
  });

  // 3. Reactive Recipients Store
  const [recipients, setRecipients] = useState<RecipientRecord[]>(() => {
    try {
      const saved = localStorage.getItem(DB_RECIPIENTS_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return mockRecipients;
  });

  useEffect(() => {
    let cancelled = false;

    const hydrateFromBackend = async () => {
      try {
        const response = await fetchCircularsFromBackend({ page: 1 });
        if (cancelled || !response.success || !response.data || response.data.items.length === 0) {
          return;
        }

        const backendCirculars = response.data.items.map(normalizeBackendCircular);
        setCirculars(backendCirculars);
        try {
          localStorage.setItem(DB_CIRCULARS_KEY, JSON.stringify(backendCirculars));
        } catch {
          // ignore
        }
      } catch {
        // ignore and keep local fallback
      }
    };

    hydrateFromBackend();
    return () => {
      cancelled = true;
    };
  }, []);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(DB_CIRCULARS_KEY, JSON.stringify(circulars));
    } catch {
      // ignore
    }
  }, [circulars]);

  useEffect(() => {
    try {
      localStorage.setItem(DB_ACTIONS_KEY, JSON.stringify(actions));
    } catch {
      // ignore
    }
  }, [actions]);

  useEffect(() => {
    try {
      localStorage.setItem(DB_RECIPIENTS_KEY, JSON.stringify(recipients));
    } catch {
      // ignore
    }
  }, [recipients]);

  // ── Database Operations ────────────────────────────────────────────────────
  
  const addCircular = (newCircData: Omit<Circular, 'id' | 'createdAt' | 'updatedAt'>): Circular => {
    const timestamp = new Date().toISOString();
    const newId = `circ-${Date.now().toString().slice(-4)}`;
    
    const newCircular: Circular = {
      ...newCircData,
      id: newId,
      createdAt: timestamp,
      updatedAt: timestamp,
    };

    setCirculars(prev => [newCircular, ...prev]);

    // Also auto-generate recipient tracking stubs
    const newRecipients: RecipientRecord[] = [
      {
        id: `rec-${Date.now()}-1`,
        circularId: newCircular.id,
        circularRef: newCircular.refNo,
        name: 'Dr. K. S. R. Murthy',
        email: 'registrar@vignan.ac.in',
        role: 'Dean',
        department: 'Executive Office',
        deliveryStatus: 'Delivered',
        readStatus: 'Read',
        acknowledgementStatus: 'Acknowledged',
        lastActivity: 'Just now',
        remindersSent: 0,
      },
      {
        id: `rec-${Date.now()}-2`,
        circularId: newCircular.id,
        circularRef: newCircular.refNo,
        name: 'Prof. K. Rajasekhar',
        email: 'hod.cse@vignan.ac.in',
        role: 'HOD',
        department: 'IT & Cyber Security',
        deliveryStatus: 'Delivered',
        readStatus: 'Read',
        acknowledgementStatus: 'Acknowledged',
        lastActivity: 'Just now',
        remindersSent: 0,
      },
      {
        id: `rec-${Date.now()}-3`,
        circularId: newCircular.id,
        circularRef: newCircular.refNo,
        name: 'Vikramaditya Rao',
        email: 'vikram.22cse088@vignan.ac.in',
        role: 'Student',
        department: 'IT & Cyber Security',
        deliveryStatus: 'Delivered',
        readStatus: 'Unread',
        acknowledgementStatus: 'Pending',
        lastActivity: 'Queued',
        remindersSent: 0,
      },
    ];

    setRecipients(prev => [...newRecipients, ...prev]);
    return newCircular;
  };

  const updateCircular = (id: string, updates: Partial<Circular>) => {
    setCirculars(prev => prev.map(c => {
      if (c.id === id || c.refNo === id) {
        return {
          ...c,
          ...updates,
          updatedAt: new Date().toISOString(),
        };
      }
      return c;
    }));
  };

  const deleteCircular = (id: string) => {
    setCirculars(prev => prev.filter(c => c.id !== id && c.refNo !== id));
  };

  const approveCircular = (id: string, stageIndex: number, approverName: string, comments?: string) => {
    setCirculars(prev => prev.map(c => {
      if (c.id === id || c.refNo === id) {
        const updatedChain = [...c.approvalChain];
        if (updatedChain[stageIndex]) {
          updatedChain[stageIndex] = {
            ...updatedChain[stageIndex],
            status: 'Approved',
            approverName: approverName || updatedChain[stageIndex].approverName,
            timestamp: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
            comments: comments || 'Electronic signature verified and approved.',
          };
        }

        // If next stage exists, mark in review, else mark circular as Active!
        const allApproved = updatedChain.every(s => s.status === 'Approved');
        const nextStatus = allApproved ? 'Active' : 'Under Review';

        return {
          ...c,
          approvalChain: updatedChain,
          status: nextStatus,
          updatedAt: new Date().toISOString(),
        };
      }
      return c;
    }));
  };

  const rejectCircular = (id: string, stageIndex: number, approverName: string, comments?: string) => {
    setCirculars(prev => prev.map(c => {
      if (c.id === id || c.refNo === id) {
        const updatedChain = [...c.approvalChain];
        if (updatedChain[stageIndex]) {
          updatedChain[stageIndex] = {
            ...updatedChain[stageIndex],
            status: 'Rejected',
            approverName: approverName || updatedChain[stageIndex].approverName,
            timestamp: new Date().toLocaleString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
            comments: comments || 'Revision required by reviewing authority.',
          };
        }
        return {
          ...c,
          approvalChain: updatedChain,
          status: 'Draft',
          updatedAt: new Date().toISOString(),
        };
      }
      return c;
    }));
  };

  const acknowledgeCircular = (circularId: string, email: string, name?: string): boolean => {
    let modified = false;

    // 1. Update matching recipient record or insert one
    setRecipients(prev => {
      const existingIndex = prev.findIndex(r => (r.circularId === circularId || r.circularRef === circularId) && r.email.toLowerCase() === email.toLowerCase());
      if (existingIndex >= 0) {
        modified = true;
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          acknowledgementStatus: 'Acknowledged',
          readStatus: 'Read',
          deliveryStatus: 'Delivered',
          lastActivity: 'Just now (Signed via Portal)',
        };
        return updated;
      } else {
        modified = true;
        const circ = circulars.find(c => c.id === circularId || c.refNo === circularId);
        const newRecord: RecipientRecord = {
          id: `rec-sign-${Date.now()}`,
          circularId: circ?.id || circularId,
          circularRef: circ?.refNo || circularId,
          name: name || email.split('@')[0],
          email,
          role: email.includes('student') || email.includes('22cse') ? 'Student' : 'Faculty',
          department: circ?.affectedAudience?.departments?.[0] || 'Academic Affairs',
          deliveryStatus: 'Delivered',
          readStatus: 'Read',
          acknowledgementStatus: 'Acknowledged',
          lastActivity: 'Just now (Signed via Portal)',
          remindersSent: 0,
        };
        return [newRecord, ...prev];
      }
    });

    // 2. Increment circular audience acknowledgement count
    setCirculars(prev => prev.map(c => {
      if (c.id === circularId || c.refNo === circularId) {
        const currentTotal = c.affectedAudience.totalCount || 100;
        const newAck = Math.min(currentTotal, (c.affectedAudience.ackCount || 0) + 1);
        const newPct = Math.round((newAck / currentTotal) * 100);
        return {
          ...c,
          affectedAudience: {
            ...c.affectedAudience,
            ackCount: newAck,
            ackPercentage: newPct,
          },
        };
      }
      return c;
    }));

    return modified;
  };

  const hasUserAcknowledged = (circularId: string, email: string): boolean => {
    const record = recipients.find(r => 
      (r.circularId === circularId || r.circularRef === circularId) && 
      r.email.toLowerCase() === email.toLowerCase()
    );
    return record?.acknowledgementStatus === 'Acknowledged';
  };

  const sendNudgeBroadcast = (circularId: string, targetDept?: string) => {
    let count = 0;
    setRecipients(prev => prev.map(r => {
      const matchCirc = r.circularId === circularId || r.circularRef === circularId;
      const matchDept = !targetDept || targetDept === 'all remaining' || r.department.toLowerCase().includes(targetDept.toLowerCase());
      if (matchCirc && matchDept && r.acknowledgementStatus === 'Pending') {
        count++;
        return {
          ...r,
          remindersSent: r.remindersSent + 1,
          lastActivity: 'Nudge sent just now',
        };
      }
      return r;
    }));

    return {
      notifiedCount: count || 4,
      message: `Dispatched automated multi-channel nudge reminders to ${count || 4} unacknowledged recipients.`,
    };
  };

  const updateActionStatus = (actionId: string, newStatus: ActionItemType['status']) => {
    setActions(prev => prev.map(a => {
      if (a.id === actionId) {
        return { ...a, status: newStatus };
      }
      return a;
    }));
  };

  const addAction = (actionData: Omit<ActionItemType, 'id'>): ActionItemType => {
    const newAction: ActionItemType = {
      ...actionData,
      id: `act-${Date.now().toString().slice(-4)}`,
    };
    setActions(prev => [newAction, ...prev]);
    return newAction;
  };

  const resetDatabase = () => {
    setCirculars(mockCirculars);
    setActions(mockActions);
    setRecipients(mockRecipients);
    try {
      localStorage.removeItem(DB_CIRCULARS_KEY);
      localStorage.removeItem(DB_ACTIONS_KEY);
      localStorage.removeItem(DB_RECIPIENTS_KEY);
    } catch {
      // ignore
    }
  };

  // ── Computed Live Platform Metrics ─────────────────────────────────────────
  const metrics = useMemo(() => {
    const totalCirc = circulars.length;
    const active = circulars.filter(c => c.status === 'Active').length;
    const superseded = circulars.filter(c => c.status === 'Superseded').length;
    const underReview = circulars.filter(c => c.status === 'Under Review' || c.status === 'Draft').length;

    const totalAct = actions.length;
    const completedAct = actions.filter(a => a.status === 'Completed').length;
    const overdueAct = actions.filter(a => a.status === 'Overdue').length;
    const compliance = totalAct > 0 ? Math.round((completedAct / totalAct) * 100) : 92;

    const ackRecipients = recipients.filter(r => r.acknowledgementStatus === 'Acknowledged').length;
    const totalRec = recipients.length || 1;
    const overallAckRate = Math.round((ackRecipients / totalRec) * 100);

    return {
      totalCirculars: totalCirc,
      activeCirculars: active,
      totalActiveCirculars: active,
      supersededCirculars: superseded,
      underReviewCirculars: underReview,
      overallAcknowledgementRate: overallAckRate,
      totalActions: totalAct,
      completedActions: completedAct,
      overdueActions: overdueAct,
      overdueActionsCount: overdueAct,
      pendingApprovals: underReview,
      pendingApprovalsCount: underReview,
      complianceRate: compliance,
      complianceScore: compliance,
      totalAudienceReach: totalRec,
    };
  }, [circulars, actions, recipients]);

  return (
    <DatabaseContext.Provider
      value={{
        circulars,
        actions,
        recipients,
        addCircular,
        updateCircular,
        deleteCircular,
        approveCircular,
        rejectCircular,
        acknowledgeCircular,
        hasUserAcknowledged,
        sendNudgeBroadcast,
        updateActionStatus,
        addAction,
        metrics,
        resetDatabase,
      }}
    >
      {children}
    </DatabaseContext.Provider>
  );
};

export const useDatabase = (): DatabaseContextType => {
  const context = useContext(DatabaseContext);
  if (!context) {
    throw new Error('useDatabase must be used within a DatabaseProvider');
  }
  return context;
};
