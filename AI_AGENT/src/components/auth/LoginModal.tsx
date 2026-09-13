import React, { useState, useEffect } from 'react';
import { useAuth, type UserRole, PRESET_USERS, AUTH_CREDENTIALS } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { 
  ShieldCheck, 
  GraduationCap, 
  BookOpen, 
  Lock, 
  CheckCircle2, 
  X, 
  UserCheck, 
  AlertCircle,
  Sparkles,
  ArrowRight,
  Building2,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  LogIn,
  Loader2
} from 'lucide-react';

export const LoginModal: React.FC = () => {
  const { 
    isLoginModalOpen, 
    closeLoginModal, 
    currentUser, 
    currentRole, 
    loginWithPassword 
  } = useAuth();
  const { isDark } = useTheme();

  // Safe active role
  const safeCurrentRole: UserRole = (currentRole && AUTH_CREDENTIALS[currentRole]) ? currentRole : 'Registrar';

  // State to track which card is currently being logged into
  const [selectedRole, setSelectedRole] = useState<UserRole>(safeCurrentRole);
  const [passwordInput, setPasswordInput] = useState<string>(AUTH_CREDENTIALS[safeCurrentRole]?.password || 'registrar@123');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isLoginModalOpen) {
      const activeRole: UserRole = (currentRole && AUTH_CREDENTIALS[currentRole]) ? currentRole : 'Registrar';
      setSelectedRole(activeRole);
      setPasswordInput(AUTH_CREDENTIALS[activeRole]?.password || '');
      setErrorMessage(null);
      setSuccessMessage(null);
      setShowPassword(false);
    }
  }, [isLoginModalOpen, currentRole]);

  if (!isLoginModalOpen) return null;

  const handleSelectCard = (role: UserRole) => {
    setSelectedRole(role);
    setPasswordInput(AUTH_CREDENTIALS[role]?.password || '');
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleAuthenticate = async (role: UserRole, e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!passwordInput.trim()) {
      setErrorMessage(`Please enter the password for ${role}.`);
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const email = AUTH_CREDENTIALS[role]?.email || '';
    setTimeout(async () => {
      const result = await loginWithPassword(email, passwordInput);
      setIsLoading(false);
      if (!result.success) {
        setErrorMessage(result.error || `Incorrect password for ${role}.`);
      } else {
        setSuccessMessage(`Authenticated successfully as ${PRESET_USERS[role].name}!`);
        setTimeout(() => {
          closeLoginModal();
        }, 500);
      }
    }, 400);
  };

  const rolesList: Array<{
    role: UserRole;
    title: string;
    badge: string;
    badgeColor: string;
    icon: typeof ShieldCheck;
    desc: string;
    permissions: string[];
    restrictions: string[];
  }> = [
    {
      role: 'Registrar',
      title: 'Registrar / Executive Admin',
      badge: 'FULL ADMIN ACCESS',
      badgeColor: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
      icon: ShieldCheck,
      desc: 'Author, publish, edit, approve, and manage all institutional directives and governance archives.',
      permissions: [
        'Upload & author new circulars',
        'Edit & modify published directives',
        'Authorize executive approvals (Stage 1/2/3)',
        'Broadcast reminder nudges to all cohorts',
      ],
      restrictions: [],
    },
    {
      role: 'Faculty',
      title: 'Faculty / Department Head',
      badge: 'DEPARTMENT AUTHORITY',
      badgeColor: 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30',
      icon: BookOpen,
      desc: 'Review department circulars, sign academic approvals, assign compliance actions, and acknowledge policies.',
      permissions: [
        'Draft & upload department circulars',
        'Approve departmental review stages',
        'Assign & manage action items',
        'Acknowledge institutional directives',
      ],
      restrictions: ['Cannot delete institutional policy archives'],
    },
    {
      role: 'Student',
      title: 'Student / Recipient Learner',
      badge: 'VIEW & ACKNOWLEDGE ONLY',
      badgeColor: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
      icon: GraduationCap,
      desc: 'View active academic circulars, digitally acknowledge receipts, ask Cira AI, and track student obligations.',
      permissions: [
        'View & read all active circulars',
        'Digitally acknowledge received circulars',
        'Ask Cira AI Copilot institutional questions',
        'Check personal action item deadlines',
      ],
      restrictions: [
        'RESTRICTED: Cannot upload or author new documents',
        'RESTRICTED: Cannot edit or change existing directives',
        'RESTRICTED: Cannot sign administrative approvals',
      ],
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className={`relative w-full max-w-2xl rounded-2xl border shadow-2xl overflow-hidden transition-all animate-in zoom-in-95 duration-200 ${
          isDark ? 'bg-slate-900 border-slate-700/80 shadow-indigo-950/50' : 'bg-white border-blue-200 shadow-xl'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className={`p-5 border-b flex items-center justify-between ${
          isDark ? 'border-slate-800 bg-slate-950/60' : 'border-blue-100 bg-gradient-to-r from-blue-50/80 to-indigo-50/60'
        }`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className={`text-lg font-black tracking-tight ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>
                  Select User Login Profile
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-400 border border-indigo-500/30 text-[10px] font-mono font-bold">
                  RBAC AUTH
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Select an institutional account and authenticate with password to switch permissions.
              </p>
            </div>
          </div>

          <button
            onClick={closeLoginModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Current User Active Banner */}
        <div className={`px-5 py-2.5 border-b flex items-center justify-between text-xs ${
          isDark ? 'bg-slate-950/40 border-slate-800 text-slate-300' : 'bg-blue-50/50 border-blue-100 text-slate-700'
        }`}>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase text-slate-400">Currently Active:</span>
            <span className="font-bold text-indigo-400">{currentUser.name}</span>
            <span className="text-slate-400">({currentUser.designation})</span>
          </div>
          <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            LOGGED IN
          </span>
        </div>

        {/* Role Selection Cards */}
        <div className="p-5 space-y-3.5 max-h-[62vh] overflow-y-auto">
          {rolesList.map(({ role, title, badge, badgeColor, icon: Icon, desc, permissions, restrictions }) => {
            const isCurrentlyActive = currentRole === role;
            const isCardSelected = selectedRole === role;
            const profile = PRESET_USERS[role];

            return (
              <div
                key={role}
                onClick={() => handleSelectCard(role)}
                className={`p-4 rounded-xl border transition-all cursor-pointer relative group ${
                  isCardSelected
                    ? isDark 
                      ? 'bg-indigo-950/40 border-indigo-500 ring-1 ring-indigo-500/50 shadow-md' 
                      : 'bg-blue-50/80 border-blue-500 ring-1 ring-blue-500/40 shadow-sm'
                    : isDark
                    ? 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/80'
                    : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-blue-50/30'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${
                      isCardSelected 
                        ? 'bg-indigo-600 text-white border-indigo-400' 
                        : isDark ? 'bg-slate-900 text-slate-400 border-slate-800' : 'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-bold ${isDark ? 'text-slate-100' : 'text-slate-900'}`}>{title}</span>
                        <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${badgeColor}`}>
                          {badge}
                        </span>
                      </div>
                      <div className="text-xs text-indigo-400 font-medium">
                        {profile.name} <span className="text-slate-500 font-normal">· {profile.designation}</span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                        <span className="flex items-center gap-1"><Building2 className="w-3 h-3 text-slate-500" /> {profile.department}</span>
                        <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-slate-500" /> {profile.email}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed pt-0.5">
                        {desc}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center shrink-0">
                    {isCurrentlyActive ? (
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 text-[10px] font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> ACTIVE
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectCard(role);
                        }}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-[11px] font-bold flex items-center gap-1 transition-colors shadow-xs"
                      >
                        <KeyRound className="w-3 h-3" /> Select & Login
                      </button>
                    )}
                  </div>
                </div>

                {/* Permissions vs Restrictions Pill Bar */}
                <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex flex-wrap gap-1.5 text-[10px]">
                  {permissions.map((p) => (
                    <span key={p} className="px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800 flex items-center gap-1">
                      <span className="text-emerald-400 font-bold">✓</span> {p}
                    </span>
                  ))}
                  {restrictions.map((r) => (
                    <span key={r} className="px-2 py-0.5 rounded bg-rose-950/40 text-rose-300 border border-rose-500/30 flex items-center gap-1">
                      <span className="text-rose-400 font-bold">✕</span> {r.replace('RESTRICTED: ', '')}
                    </span>
                  ))}
                </div>

                {/* Password Authentication Input for Selected Card */}
                {isCardSelected && (
                  <div 
                    className="mt-3.5 pt-3 border-t border-indigo-500/30 space-y-2.5 bg-slate-950/60 -mx-4 -mb-4 p-4 rounded-b-xl animate-in fade-in duration-200"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                        <Lock className="w-3.5 h-3.5 text-indigo-400" /> Enter Password for {profile.name.split(' ')[0]}:
                      </label>
                      <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/20">
                        Demo: <strong className="text-indigo-300">{AUTH_CREDENTIALS[role].password}</strong>
                      </span>
                    </div>

                    <form onSubmit={(e) => handleAuthenticate(role, e)} className="flex items-center gap-2">
                      <div className="relative flex-1">
                        <input
                          type={showPassword ? 'text' : 'password'}
                          value={passwordInput}
                          onChange={(e) => {
                            setPasswordInput(e.target.value);
                            setErrorMessage(null);
                          }}
                          placeholder="Enter account password"
                          className="w-full pl-3 pr-9 py-2 rounded-xl bg-slate-900 border border-slate-700 focus:border-indigo-500 text-xs font-mono text-slate-100 placeholder:text-slate-500 focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-200"
                        >
                          {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-indigo-600/30 transition-all hover:scale-105 disabled:opacity-50 shrink-0"
                      >
                        {isLoading ? (
                          <>
                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                            <span>Verifying...</span>
                          </>
                        ) : (
                          <>
                            <LogIn className="w-3.5 h-3.5" />
                            <span>Sign In</span>
                          </>
                        )}
                      </button>
                    </form>

                    {/* Error Banner */}
                    {errorMessage && selectedRole === role && (
                      <div className="p-2 rounded-lg bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2 animate-in slide-in-from-top-1">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                        <span>{errorMessage}</span>
                      </div>
                    )}

                    {/* Success Banner */}
                    {successMessage && selectedRole === role && (
                      <div className="p-2 rounded-lg bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2 animate-in slide-in-from-top-1">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                        <span>{successMessage}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className={`p-4 border-t flex items-center justify-between text-xs ${
          isDark ? 'border-slate-800 bg-slate-950/80 text-slate-400' : 'border-blue-100 bg-slate-50 text-slate-600'
        }`}>
          <div className="flex items-center gap-1.5 font-mono text-[11px]">
            <Building2 className="w-3.5 h-3.5 text-indigo-400" />
            <span>Vignan's University · Single Unified Database Active</span>
          </div>

          <button
            onClick={closeLoginModal}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
export default LoginModal;
