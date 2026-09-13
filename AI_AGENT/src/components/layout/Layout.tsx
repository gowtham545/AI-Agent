import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { CommandPalette } from './CommandPalette';
import { useTheme } from '../../context/ThemeContext';
import { useDatabase } from '../../context/DatabaseContext';

export const Layout: React.FC = () => {
  const { isDark } = useTheme();
  const { circulars, actions, metrics } = useDatabase();
  const [collapsed, setCollapsed] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('All Departments');

  // Collapse sidebar on small screens by default
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) setCollapsed(true);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && commandPaletteOpen) {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [commandPaletteOpen]);

  // Live overdue count from centralized database
  const overdueCount = metrics.overdueActionsCount;
  const pendingApprovalCount = metrics.pendingApprovalsCount;

  return (
    <div
      className={`min-h-screen flex relative overflow-x-hidden font-sans transition-colors duration-200 ${
        isDark ? 'bg-slate-950 text-slate-100' : 'bg-[#f0f5ff] text-slate-900'
      }`}
    >
      {/* Sidebar Navigation */}
      <Sidebar
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed(!collapsed)}
        overdueActionsCount={overdueCount}
        pendingApprovalsCount={pendingApprovalCount}
      />

      {/* Main Content Body */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          collapsed ? 'ml-20' : 'ml-64'
        }`}
      >
        {/* Top Header */}
        <TopNav
          onOpenCommandPalette={() => setCommandPaletteOpen(true)}
          selectedDepartment={selectedDepartment}
          onSelectDepartment={setSelectedDepartment}
        />

        {/* Page Content Viewport */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1400px] w-full mx-auto gradient-bg-hero">
          <Outlet context={{ selectedDepartment }} />
        </main>
      </div>

      {/* Command Palette Modal */}
      <CommandPalette
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        circulars={circulars}
      />
    </div>
  );
};
