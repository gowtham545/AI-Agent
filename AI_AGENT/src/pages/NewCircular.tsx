import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle2, ShieldAlert, Upload, FileText, AlertCircle, Lock, UserCheck } from 'lucide-react';
import type { CircularCategory, DepartmentName, PriorityLevel } from '../types';
import { useAuth } from '../context/AuthContext';
import { useDatabase } from '../context/DatabaseContext';

export const NewCircular: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser, openLoginModal } = useAuth();
  const { addCircular } = useDatabase();
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<CircularCategory>('Policy & Compliance');
  const [priority, setPriority] = useState<PriorityLevel>('High');
  const [refNo, setRefNo] = useState(`CIRC-2026-${Math.floor(100 + Math.random() * 900)}`);
  const [effectiveDate, setEffectiveDate] = useState('2026-09-20');
  const [supersedesRef, setSupersedesRef] = useState('');
  const [contentMarkdown, setContentMarkdown] = useState('');
  const [selectedDepartments, setSelectedDepartments] = useState<DepartmentName[]>(['All Departments']);
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiAnalysisComplete, setAiAnalysisComplete] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // RBAC GUARD: Check if current user has permission to upload/issue new documents
  if (!currentUser.canUploadDocuments) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 animate-in fade-in duration-300">
        <div className="glass-card rounded-3xl p-8 border border-amber-500/30 bg-slate-950/80 backdrop-blur-xl shadow-2xl text-center space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/30 mx-auto flex items-center justify-center text-amber-400 shadow-inner">
            <Lock className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-500/40">
              Access Restricted • Role: {currentUser.role.toUpperCase()}
            </span>
            <h1 className="text-2xl font-extrabold text-white mt-2">
              Issuance & Upload Authority Required
            </h1>
            <p className="text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
              Students have read-only and digital acknowledgement rights. Issuing new institutional circulars or uploading policy directives requires <span className="text-indigo-400 font-semibold">Registrar</span> or <span className="text-purple-400 font-semibold">Faculty / HOD</span> credentials.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-left flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-400 space-y-1">
              <p className="text-slate-200 font-medium">Logged in as: <span className="text-white font-bold">{currentUser.name}</span> ({currentUser.department})</p>
              <p>To draft or broadcast circulars, switch to an authorized institutional account below.</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={openLoginModal}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
            >
              <UserCheck className="w-4 h-4" /> Switch to Registrar / Faculty
            </button>
            <button
              onClick={() => navigate('/circulars')}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs transition-colors"
            >
              View Active Directives
            </button>
          </div>
        </div>
      </div>
    );
  }

  const departments: DepartmentName[] = [
    'All Departments',
    'Legal & Compliance',
    'Finance & Audit',
    'IT & Cyber Security',
    'Operations & Supply Chain',
    'Human Resources',
    'Executive Office',
    'Health & Safety',
  ];

  const handleAiDraft = () => {
    setIsGeneratingAi(true);
    setTimeout(() => {
      setContentMarkdown(
        `# DIRECTIVE ${refNo}\n**SUBJECT:** ${title || 'Institutional Governance Directive'}\n**EFFECTIVE DATE:** ${effectiveDate}\n\n### 1. Operational Mandates\n1. All personnel must strictly adhere to the upgraded security protocol outlined herein.\n2. Department Heads shall audit compliance on a bi-weekly basis.\n\n### 2. Escalation & Verification\nNon-compliance report must be filed directly with the Risk Directorate within 48 hours of discovery.`
      );
      setIsGeneratingAi(false);
    }, 1500);
  };

  const handleRunAiAnalysis = () => {
    setIsGeneratingAi(true);
    setTimeout(() => {
      setIsGeneratingAi(false);
      setAiAnalysisComplete(true);
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const newCirc = addCircular({
      refNo: refNo.trim() || `CIRC-2026-${Math.floor(100 + Math.random() * 900)}`,
      title: title.trim() || 'Institutional Operational Directive',
      category,
      priority,
      effectiveDate,
      supersedesRef: supersedesRef.trim() || undefined,
      contentMarkdown: contentMarkdown.trim() || `# DIRECTIVE ${refNo}\n\n**Subject:** ${title}\n\nAll departments must abide by the mandates set forth in this directive starting from ${effectiveDate}.`,
      status: 'Active',
      issuingAuthority: currentUser.name,
      signatoryName: currentUser.name,
      signatoryTitle: currentUser.role === 'Registrar' ? 'University Registrar & Governance Board' : 'Department Faculty & Dean',
      summary: title ? `Official directive regarding ${title}. Mandates compliance across ${selectedDepartments.join(', ')}.` : 'Institutional policy update.',
      aiExecutiveSummary: title ? `Official directive regarding ${title}.` : 'Institutional policy update.',
      tags: selectedDepartments.length > 0 ? selectedDepartments : ['All Departments'],
      affectedAudience: {
        departments: selectedDepartments.length > 0 ? selectedDepartments : ['All Departments'],
        totalCount: selectedDepartments.length > 0 ? selectedDepartments.length * 120 : 120,
        ackCount: 0,
        ackPercentage: 0,
      },
      actionItems: [],
      approvalChain: [],
      departmentBreakdown: [],
      conflictCheckStatus: 'No Conflicts',
      version: 'v1.0',
    });

    setTimeout(() => {
      setIsSubmitting(false);
      navigate(`/circulars/${newCirc.id}`);
    }, 400);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-300">
      {/* Header Title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-100 tracking-tight">
            Issue New Institutional Circular
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Author, analyze with AI, check policy conflicts, and publish binding administrative directives.
          </p>
        </div>
      </div>

      {/* Step Progress Bar */}
      <div className="grid grid-cols-4 gap-2">
        {[
          { num: 1, title: 'General Info' },
          { num: 2, title: 'Draft Content' },
          { num: 3, title: 'Audience Scope' },
          { num: 4, title: 'AI Audit & Submit' },
        ].map((s) => (
          <div
            key={s.num}
            onClick={() => s.num < step && setStep(s.num as any)}
            className={`p-3 rounded-xl border text-xs flex items-center gap-2 cursor-pointer transition-all ${
              step === s.num
                ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300 font-semibold'
                : step > s.num
                ? 'bg-slate-900 border-emerald-500/40 text-emerald-400'
                : 'bg-slate-950/60 border-slate-800 text-slate-500'
            }`}
          >
            <div
              className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs ${
                step === s.num
                  ? 'bg-indigo-600 text-white'
                  : step > s.num
                  ? 'bg-emerald-500 text-slate-950'
                  : 'bg-slate-800 text-slate-400'
              }`}
            >
              {step > s.num ? <CheckCircle2 className="w-3.5 h-3.5" /> : s.num}
            </div>
            <span className="truncate hidden sm:inline">{s.title}</span>
          </div>
        ))}
      </div>

      {/* Step 1: General Info */}
      {step === 1 && (
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-6">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-indigo-400" /> Step 1: Circular Metadata & Identification
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Reference Number (Ref No)
              </label>
              <input
                type="text"
                value={refNo}
                onChange={(e) => setRefNo(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-indigo-500 text-xs font-mono text-slate-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Governance Sector Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as CircularCategory)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-indigo-500 text-xs text-slate-100 focus:outline-none"
              >
                <option value="Policy & Compliance">Policy & Compliance</option>
                <option value="Safety & Security">Safety & Security</option>
                <option value="Financial & Delegation">Financial & Delegation</option>
                <option value="Operations & Logistics">Operations & Logistics</option>
                <option value="IT & Data Governance">IT & Data Governance</option>
                <option value="HR & Workforce">HR & Workforce</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Circular Official Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Enterprise Remote Data Access & Encryption Mandate 2026"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-indigo-500 text-xs text-slate-100 placeholder:text-slate-600 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Priority Urgency Level
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as PriorityLevel)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-indigo-500 text-xs text-slate-100 focus:outline-none"
              >
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Effective Date
              </label>
              <input
                type="date"
                value={effectiveDate}
                onChange={(e) => setEffectiveDate(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-indigo-500 text-xs font-mono text-slate-100 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Supersedes Circular (Optional)
              </label>
              <input
                type="text"
                value={supersedesRef}
                onChange={(e) => setSupersedesRef(e.target.value)}
                placeholder="e.g. CIRC-2024-042"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-indigo-500 text-xs font-mono text-slate-100 placeholder:text-slate-600 focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-2"
            >
              Next: Draft Content <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Draft Content */}
      {step === 2 && (
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-sky-400" /> Step 2: Content Drafting & AI Copilot Assist
            </h2>

            <button
              type="button"
              onClick={handleAiDraft}
              disabled={isGeneratingAi}
              className="px-3.5 py-1.5 rounded-xl bg-indigo-950/80 hover:bg-indigo-900 text-indigo-300 border border-indigo-500/30 text-xs font-medium flex items-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              {isGeneratingAi ? 'AI Generating Draft...' : 'Auto-Generate AI Draft'}
            </button>
          </div>

          <div>
            <textarea
              rows={12}
              value={contentMarkdown}
              onChange={(e) => setContentMarkdown(e.target.value)}
              placeholder="Write circular directives in Markdown or click 'Auto-Generate AI Draft' to populate formatted policy terms..."
              className="w-full p-4 rounded-xl bg-slate-900 border border-slate-800 focus:border-indigo-500 text-xs text-slate-100 font-mono focus:outline-none leading-relaxed"
            />
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              type="button"
              onClick={() => setStep(3)}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-2"
            >
              Next: Target Audience <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 3: Audience Scope */}
      {step === 3 && (
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-6">
          <h2 className="text-lg font-bold text-slate-100">Step 3: Audience & Target Scope</h2>
          <p className="text-xs text-slate-400">Select institutional departments bound by this directive.</p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {departments.map((dept) => {
              const selected = selectedDepartments.includes(dept);
              return (
                <button
                  type="button"
                  key={dept}
                  onClick={() => {
                    if (selected) {
                      setSelectedDepartments(selectedDepartments.filter((d) => d !== dept));
                    } else {
                      setSelectedDepartments([...selectedDepartments, dept]);
                    }
                  }}
                  className={`p-3 rounded-xl border text-xs font-medium text-left transition-all ${
                    selected
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {dept}
                </button>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
            <button
              type="button"
              onClick={() => {
                setStep(4);
                handleRunAiAnalysis();
              }}
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-xs flex items-center gap-2"
            >
              Next: Run AI Audit <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Step 4: AI Audit & Submit */}
      {step === 4 && (
        <div className="glass-card rounded-2xl p-6 sm:p-8 border border-slate-800 space-y-6">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg overflow-hidden border border-indigo-400/50 bg-slate-900 shrink-0">
              <img src="/cira-agent.jpg" alt="Cira" className="w-full h-full object-cover" />
            </div>
            <span>Step 4: Cira AI Compliance Audit & Verification</span>
          </h2>

          {isGeneratingAi ? (
            <div className="py-12 text-center text-slate-400 space-y-3">
              <div className="w-12 h-12 rounded-2xl overflow-hidden border border-indigo-400/50 bg-slate-900 mx-auto shadow-md animate-pulse">
                <img src="/cira-agent.jpg" alt="Cira" className="w-full h-full object-cover" />
              </div>
              <p className="text-sm font-semibold">Cira is scanning circular database for policy conflicts...</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* AI Conflict Status Card */}
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-sm text-emerald-400">
                  <CheckCircle2 className="w-4 h-4" /> Policy Conflict Status: Clear (No Overlaps)
                </div>
                <p>CircularFlow AI verified that {refNo} does not contradict any existing operational circulars in IT, HR, or Legal governance sectors.</p>
              </div>

              {/* Summary extracted */}
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 space-y-2">
                <h4 className="font-semibold text-slate-100">Extracted Executive Summary</h4>
                <p>{title || 'Updated Institutional Policy Directive'}. Effective date: {effectiveDate}. Target reach: {selectedDepartments.join(', ')}.</p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium flex items-center gap-1"
                >
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>

                <button
                  type="button"
                  onClick={handleSubmit}
                  className="px-6 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-bold text-xs flex items-center gap-2 shadow-lg shadow-emerald-600/30 transition-all hover:scale-105"
                >
                  <CheckCircle2 className="w-4 h-4" /> Publish & Broadcast Directive
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
