import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FileText, 
  PlusCircle, 
  CheckSquare, 
  Share2, 
  ListTodo, 
  Archive, 
  BarChart3, 
  Bot, 
  ChevronLeft, 
  ChevronRight, 
  Shield, 
  Sparkles,
  Home
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { useDatabase } from '../../context/DatabaseContext';

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  pendingApprovalsCount?: number;
  overdueActionsCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  collapsed,
  onToggleCollapse,
}) => {
  const { isDark } = useTheme();
  const { currentUser, currentRole, openLoginModal } = useAuth();
  const { metrics } = useDatabase();
  const location = useLocation();

  const isStudent = currentRole === 'Student';
  const pendingApprovalsCount = metrics.pendingApprovals;
  const overdueActionsCount = metrics.overdueActions;

  const rawNavItems = [
    { label: 'Agentic AI Showcase', path: '/', icon: Home, highlightHome: true },
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { label: 'Circular Repository', path: '/circulars', icon: FileText },
    ...(currentUser.canUploadDocuments ? [
      { label: 'New Circular', path: '/circulars/new', icon: PlusCircle, highlight: true }
    ] : []),
    { 
      label: isStudent ? 'Approvals Status' : 'Approval Inbox', 
      path: '/approvals', 
      icon: CheckSquare, 
      badge: !isStudent && pendingApprovalsCount > 0 ? pendingApprovalsCount : undefined,
      badgeColor: 'bg-indigo-500 text-white' 
    },
    { label: 'Distribution Matrix', path: '/distribution', icon: Share2 },
    { 
      label: 'Actions & Deadlines', 
      path: '/actions', 
      icon: ListTodo,
      badge: overdueActionsCount > 0 ? `${overdueActionsCount} Overdue` : undefined,
      badgeColor: 'bg-rose-500/20 text-rose-500 border border-rose-500/30'
    },
    { label: 'Archive & Lineage', path: '/archive', icon: Archive },
    { label: 'Analytics & Audit', path: '/analytics', icon: BarChart3 },
    { label: 'AI Copilot (Cira)', path: '/assistant', icon: Bot, isCira: true, aiTag: true },
  ];

  const navItems = rawNavItems;

  return (
    <aside
      className={`fixed top-0 left-0 bottom-0 z-30 flex flex-col justify-between transition-all duration-300 backdrop-blur-xl ${
        isDark ? 'bg-slate-950/95 border-r border-slate-800/80 text-slate-100' : 'bg-white/95 border-r border-blue-100 text-slate-800 shadow-sm'
      } ${collapsed ? 'w-20' : 'w-64'}`}
    >
      <div className="flex flex-col flex-1 overflow-y-auto" style={{ scrollbarWidth: 'none' }}>
        {/* Brand Header */}
        <div className={`h-16 flex items-center justify-between px-3.5 border-b shrink-0 ${
          isDark ? 'border-slate-800/80' : 'border-blue-100'
        }`}>
          <NavLink to="/dashboard" className="flex items-center gap-2.5 overflow-hidden">
            {/* Vignan Institutional Shield / CircularFlow Logo */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-sky-400 p-0.5 shadow-lg shadow-indigo-500/20 shrink-0 overflow-hidden">
              <div className={`w-full h-full rounded-[10px] flex items-center justify-center p-0.5 ${
                isDark ? 'bg-slate-950' : 'bg-white'
              }`}>
                <img
                  src="/cse-shield-logo.jpg"
                  alt="Vignan CSE"
                  className="w-full h-full object-contain rounded-md"
                />
              </div>
            </div>
            {!collapsed && (
              <div className="flex flex-col">
                <span className={`font-bold text-sm tracking-tight flex items-center gap-1 leading-tight ${
                  isDark ? 'text-slate-100' : 'text-slate-900'
                }`}>
                  CircularFlow <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-500 border border-indigo-500/30">AI</span>
                </span>
                <span className={`text-[9px] font-semibold tracking-wider uppercase font-mono ${
                  isDark ? 'text-blue-400' : 'text-blue-600'
                }`}>
                  Vignan's University
                </span>
              </div>
            )}
          </NavLink>

          <button
            onClick={onToggleCollapse}
            className={`p-1.5 rounded-lg transition-colors shrink-0 ${
              isDark ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-900' : 'text-slate-500 hover:text-slate-800 hover:bg-blue-50'
            }`}
            title={collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Quick Action Button if not collapsed */}
        {!collapsed && (
          <div className="p-3 shrink-0">
            {currentUser.canUploadDocuments ? (
              <NavLink
                to="/circulars/new"
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02]"
              >
                <Sparkles className="w-3.5 h-3.5 text-blue-200" />
                <span>Issue New Circular</span>
              </NavLink>
            ) : (
              <NavLink
                to="/assistant"
                className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-indigo-600 to-sky-600 hover:from-indigo-500 hover:to-sky-500 text-white font-medium text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all hover:scale-[1.02]"
              >
                <Bot className="w-3.5 h-3.5 text-sky-200" />
                <span>Ask Cira AI Copilot</span>
              </NavLink>
            )}
          </div>
        )}

        {/* Navigation Items */}
        <nav className="p-2 space-y-1 flex-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isRoot = item.path === '/';
            const isActive = isRoot
              ? location.pathname === '/'
              : location.pathname === item.path || (location.pathname.startsWith(item.path) && item.path !== '/circulars/new');

            return (
              <NavLink
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all group ${
                  isActive
                    ? (isDark 
                        ? 'bg-indigo-600/15 text-indigo-400 font-semibold border border-indigo-500/30 shadow-sm' 
                        : 'bg-blue-50 text-blue-700 font-semibold border border-blue-200 shadow-xs')
                    : item.highlightHome
                    ? (isDark ? 'text-sky-400 hover:text-sky-300 hover:bg-sky-500/10' : 'text-blue-600 hover:text-blue-800 hover:bg-blue-50/60')
                    : (isDark ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80' : 'text-slate-600 hover:text-slate-900 hover:bg-blue-50/50')
                }`}
                title={collapsed ? item.label : undefined}
              >
                {item.isCira ? (
                  <div className="w-5 h-5 rounded-full overflow-hidden border border-sky-400/50 shrink-0 relative">
                    <img src="/cira-agent.jpg" alt="Cira" className="w-full h-full object-cover" />
                    <span className="absolute bottom-0 right-0 w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  </div>
                ) : (
                  <Icon className={`w-4 h-4 shrink-0 transition-colors ${
                    isActive 
                      ? (isDark ? 'text-indigo-400' : 'text-blue-600') 
                      : (isDark ? 'text-slate-400 group-hover:text-slate-200' : 'text-slate-500 group-hover:text-slate-800')
                  }`} />
                )}

                {!collapsed && (
                  <div className="flex-1 flex items-center justify-between overflow-hidden">
                    <span className="truncate">{item.label}</span>

                    {item.aiTag && (
                      <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded border flex items-center gap-0.5 ${
                        isDark ? 'bg-sky-500/20 text-sky-400 border-sky-500/30' : 'bg-blue-100 text-blue-700 border-blue-200'
                      }`}>
                        <Sparkles className="w-2.5 h-2.5" /> AI
                      </span>
                    )}

                    {item.badge && (
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Vignan Branding & Live status */}
      <div className={`p-3 border-t shrink-0 ${isDark ? 'border-slate-800/80' : 'border-blue-100'}`}>
        {!collapsed ? (
          <div className="space-y-2">
            {/* Vignan Logo Banner */}
            <div className={`p-2 rounded-xl border flex items-center gap-2.5 ${
              isDark ? 'bg-slate-900/60 border-slate-800/80' : 'bg-blue-50/70 border-blue-100'
            }`}>
              <img
                src="/vignan-logo.jpg"
                alt="Vignan's University"
                className="h-7 w-auto object-contain shrink-0 rounded"
              />
              <div className="overflow-hidden text-[10px]">
                <div className={`font-bold truncate ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>Vignan's University</div>
                <div className={`text-[8px] truncate ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>CSE Dept · Deemed to be Univ.</div>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs px-1">
              <span className="text-[10px] text-emerald-500 flex items-center gap-1 font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Live System
              </span>
              <span className={`text-[10px] font-mono ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>v2.4 Online</span>
            </div>
          </div>
        ) : (
          <div className="flex justify-center" title="Vignan's Foundation for Science, Technology & Research">
            <div className={`w-8 h-8 rounded-full border flex items-center justify-center overflow-hidden ${
              isDark ? 'bg-slate-900 border-slate-700' : 'bg-blue-50 border-blue-200'
            }`}>
              <img src="/vignan-logo.jpg" alt="Vignan" className="w-6 h-6 object-contain" />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
