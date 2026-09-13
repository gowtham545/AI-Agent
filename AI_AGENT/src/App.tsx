import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { DatabaseProvider } from './context/DatabaseContext';
import { LoginModal } from './components/auth/LoginModal';
import { Layout } from './components/layout/Layout';
import { AgenticHome } from './pages/AgenticHome';
import { Dashboard } from './pages/Dashboard';
import { CircularsList } from './pages/CircularsList';
import { CircularDetail } from './pages/CircularDetail';
import { NewCircular } from './pages/NewCircular';
import { Approvals } from './pages/Approvals';
import { Distribution } from './pages/Distribution';
import { ActionItems } from './pages/ActionItems';
import { Archive } from './pages/Archive';
import { Analytics } from './pages/Analytics';
import { Assistant } from './pages/Assistant';

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <DatabaseProvider>
          <BrowserRouter>
            <LoginModal />
            <Routes>
              {/* ── Agentic AI Hackathon Homepage ─────────────────────── */}
              <Route path="/" element={<AgenticHome />} />

              {/* ── Phase 1 & 3 Governance OS Dashboard Layout ─────────── */}
              <Route element={<Layout />}>
                <Route path="dashboard" element={<Dashboard />} />
                <Route path="circulars" element={<CircularsList />} />
                <Route path="circulars/new" element={<NewCircular />} />
                <Route path="circulars/:id" element={<CircularDetail />} />
                <Route path="approvals" element={<Approvals />} />
                <Route path="distribution" element={<Distribution />} />
                <Route path="actions" element={<ActionItems />} />
                <Route path="archive" element={<Archive />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="assistant" element={<Assistant />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </BrowserRouter>
        </DatabaseProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
