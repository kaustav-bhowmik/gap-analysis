import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { Audit } from './types';
import Header from './components/layout/Header';
import AuditsPage from './pages/AuditsPage';
import CreateAuditPage from './pages/CreateAuditPage';
import AuditDetailPage from './pages/AuditDetailPage';
import GenerateReportPage from './pages/GenerateReportPage';
import ReportsPage from './pages/ReportsPage';

function App() {
  const [audits, setAudits] = useState<Audit[]>([]);

  const handleCreateAudit = (newAudit: Audit) => {
    setAudits([...audits, newAudit]);
  };

  const handleUpdateAudit = (updatedAudit: Audit) => {
    setAudits(
      audits.map(audit => 
        audit.id === updatedAudit.id ? updatedAudit : audit
      )
    );
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="min-h-screen bg-gray-50">
            <Header />
            <div className="flex">
              <div className="flex-1">
                <main className="flex-1">
                  <div className="py-6">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                      <Outlet />
                    </div>
                  </div>
                </main>
              </div>
            </div>
          </div>
        }>
          <Route index element={<Navigate to="/audits" replace />} />
          <Route path="audits" element={<AuditsPage audits={audits} />} />
          <Route path="audits/new" element={<CreateAuditPage onAuditCreate={handleCreateAudit} />} />
          <Route 
            path="audits/:id" 
            element={
              <AuditDetailPage 
                audits={audits} 
                onUpdateAudit={handleUpdateAudit} 
              />
            } 
          />
          <Route 
            path="audits/:id/report" 
            element={<GenerateReportPage audits={audits} />} 
          />
          <Route path="reports" element={<ReportsPage audits={audits} />} />
          <Route path="*" element={<Navigate to="/audits" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;