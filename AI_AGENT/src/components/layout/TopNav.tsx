import React, { useState } from 'react';
import { 
  Search, 
  Bell, 
  Sparkles, 
  ChevronDown, 
  Building2, 
  Command,
  CheckCircle,
  Sun,
  Moon,
  ShieldCheck,
  ExternalLink
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

interface TopNavProps {
  onOpenCommandPalette: () => void;
  selectedDepartment: string;
  onSelectDepartment: (dept: string) => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  onOpenCommandPalette,
  selectedDepartment,
  onSelectDepartment,
}) => {
  const { isDark, toggleTheme } = useTheme();
  const { currentUser, currentRole, openLoginModal } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showDeptDropdown, setShowDeptDropdown] = useState(false);

  const departments = [
    'All Departments',
    'Legal & Compliance',
    'Finance & Audit',
    'IT & Cyber Security',
    'Operations & Supply Chain',
    'Human Resources',
    'Executive Office',
    'Health & Safety',
  ];

  const notifications = [
    { id: 1, text: 'New Circular CIRC-2026-089 (AI Governance) effective today', time: '10m ago', unread: true },
    { id: 2, text: 'Approval requested for CIRC-2026-095 (Evacuation Policy)', time: '1h ago', unread: true },
    { id: 3, text: 'Action Item due tomorrow: ERP Approval Hierarchy setup', time: '3h ago', unread: false },
  ];

  return (
    <header className={`h-16 border-b backdrop-blur-md sticky top-0 z-20 px-4 sm:px-6 flex items-center justify-between gap-4 transition-colors duration-300 ${
      isDark ? 'border-slate-800/80 bg-slate-950/85 text-slate-100' : 'border-blue-100 bg-white/95 text-slate-900'
    }`}>
      {/* Left: Quick Search Button & Department Selector */}
      <div className="flex items-center gap-3 flex-1 max-w-xl">
        <button
          onClick={onOpenCommandPalette}
          className={`flex-1 flex items-center justify-between px-3.5 py-2 rounded-xl border text-xs transition-all group shadow-inner ${
            isDark 
              ? 'bg-slate-900/80 border-slate-800 hover:border-indigo-500/40 text-slate-400 hover:text-slate-200' 
              : 'bg-[#f0f5ff] border-blue-200 hover:border-indigo-400 text-slate-600 hover:text-slate-900'
          }`}
        >
          <div className="flex items-center gap-2">
            <Search className={`w-4 h-4 transition-colors ${isDark ? 'text-slate-500 group-hover:text-indigo-400' : 'text-blue-500 group-hover:text-indigo-600'}`} />
            <span className="truncate">Search circulars, policies, directives...</span>
          </div>
          <kbd className={`hidden sm:inline-flex items-center gap-1 font-mono text-[10px] px-2 py-0.5 rounded border ${
            isDark ? 'bg-slate-800 text-slate-400 border-slate-700' : 'bg-white text-slate-600 border-blue-200 shadow-xs'
          }`}>
            <Command className="w-3 h-3" /> K
          </kbd>
        </button>

        {/* Department Switcher Dropdown */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setShowDeptDropdown(!showDeptDropdown)}
            className={`px-3 py-2 rounded-xl border text-xs font-medium flex items-center gap-2 transition-colors ${
              isDark 
                ? 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-200' 
                : 'bg-[#f0f5ff] border-blue-200 hover:border-blue-300 text-slate-700'
            }`}
          >
            <Building2 className={`w-4 h-4 ${isDark ? 'text-indigo-400' : 'text-blue-600'}`} />
            <span className="max-w-[140px] truncate">{selectedDepartment}</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-60" />
          </button>

          {showDeptDropdown && (
            <div className={`absolute right-0 mt-2 w-56 rounded-xl border shadow-2xl py-1 z-50 text-xs animate-in fade-in zoom-in-95 duration-150 ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-blue-100 shadow-indigo-100/50'
            }`}>
              <div className={`px-3 py-1.5 font-mono text-[10px] uppercase border-b ${
                isDark ? 'text-slate-500 border-slate-800' : 'text-blue-400 border-blue-50'
              }`}>
                Filter Scope
              </div>
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => {
                    onSelectDepartment(dept);
                    setShowDeptDropdown(false);
                  }}
                  className={`w-full text-left px-3 py-2 flex items-center justify-between transition-colors ${
                    selectedDepartment === dept 
                      ? (isDark ? 'text-indigo-400 font-semibold bg-indigo-500/10' : 'text-blue-700 font-bold bg-blue-50')
                      : (isDark ? 'text-slate-300 hover:bg-slate-800' : 'text-slate-600 hover:bg-blue-50/50')
                  }`}
                >
                  <span>{dept}</span>
                  {selectedDepartment === dept && <CheckCircle className={`w-3.5 h-3.5 ${isDark ? 'text-indigo-400' : 'text-blue-600'}`} />}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right: AI Badge, Theme Toggle, Notifications, User Profile */}
      <div className="flex items-center gap-2.5">
        {/* AI Agent Status with Cira Avatar */}
        <Link
          to="/assistant"
          className={`hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-medium transition-colors group ${
            isDark 
              ? 'bg-indigo-950/60 hover:bg-indigo-900/50 border-indigo-500/30 text-indigo-300' 
              : 'bg-indigo-50 hover:bg-indigo-100 border-indigo-200 text-indigo-700 shadow-xs'
          }`}
          title="Open Cira AI Assistant"
        >
          <div className="w-5 h-5 rounded-full overflow-hidden border border-indigo-400/60 shrink-0">
            <img src="/cira-agent.jpg" alt="Cira" className="w-full h-full object-cover" />
          </div>
          <span className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Cira AI Engine Active
          </span>
        </Link>

        {/* ── Theme Toggle Button (Light / Dark) ── */}
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-xl border transition-all flex items-center justify-center shadow-xs ${
            isDark 
              ? 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-300 hover:text-white' 
              : 'bg-[#f0f5ff] border-blue-200 hover:border-blue-300 text-slate-700 hover:text-slate-900'
          }`}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle theme"
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform duration-300" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-600 hover:-rotate-12 transition-transform duration-300" />
          )}
        </button>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className={`p-2 rounded-xl border transition-colors relative ${
              isDark 
                ? 'bg-slate-900 border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200' 
                : 'bg-[#f0f5ff] border-blue-200 hover:border-blue-300 text-slate-600 hover:text-slate-900'
            }`}
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-500 animate-ping" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-indigo-500" />
          </button>

          {showNotifications && (
            <div className={`absolute right-0 mt-2 w-80 rounded-xl border shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150 ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-blue-100 shadow-indigo-100/50'
            }`}>
              <div className={`flex items-center justify-between pb-2 mb-2 border-b ${
                isDark ? 'border-slate-800' : 'border-blue-50'
              }`}>
                <span className={`font-semibold text-xs ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>System Notifications</span>
                <span className={`text-[10px] font-mono cursor-pointer ${isDark ? 'text-indigo-400' : 'text-blue-600'}`}>Mark all read</span>
              </div>
              <div className="space-y-2">
                {notifications.map((n) => (
                  <div key={n.id} className={`p-2 rounded-lg border text-xs ${
                    isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-[#f8fbff] border-blue-100'
                  }`}>
                    <p className={isDark ? 'text-slate-300' : 'text-slate-700'}>{n.text}</p>
                    <span className={`text-[10px] font-mono mt-1 block ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{n.time}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Institutional & User Profile with Role Switcher */}
        <button
          onClick={openLoginModal}
          className={`flex items-center gap-2 pl-2.5 py-1 pr-2 rounded-xl border transition-all hover:scale-[1.02] active:scale-95 ${
            isDark 
              ? 'border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900/80 bg-slate-950/60' 
              : 'border-blue-100 hover:border-blue-300 hover:bg-blue-50/60 bg-white shadow-xs'
          }`}
          title="Click to switch user profile or log in as Registrar, Faculty, or Student"
        >
          <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 p-0.5 shrink-0 shadow-xs">
            <div className={`w-full h-full rounded-[6px] flex items-center justify-center text-[10px] font-bold ${
              isDark ? 'bg-slate-950 text-slate-200' : 'bg-white text-indigo-700'
            }`}>
              {currentRole === 'Registrar' ? 'RG' : currentRole === 'Faculty' ? 'FC' : 'ST'}
            </div>
          </div>
          <div className="hidden sm:flex flex-col text-left">
            <div className="flex items-center gap-1.5">
              <span className={`font-bold text-xs truncate max-w-[130px] ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>
                {currentUser.name}
              </span>
              <span className={`text-[8px] font-mono font-bold px-1.5 py-0.2 rounded-full border ${
                currentRole === 'Registrar' 
                  ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' 
                  : currentRole === 'Faculty'
                  ? 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30'
                  : 'bg-amber-500/15 text-amber-400 border-amber-500/30'
              }`}>
                {currentRole.toUpperCase()}
              </span>
            </div>
            <span className={`text-[9px] font-mono ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Switch Profile ▾
            </span>
          </div>
        </button>
      </div>
    </header>
  );
};
