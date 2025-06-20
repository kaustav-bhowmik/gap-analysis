import React from 'react';
import { Audit } from '../types';
import AuditDetail from '../components/audits/AuditDetail';

interface AuditDetailPageProps {
  audits: Audit[];
  onUpdateAudit: (updatedAudit: Audit) => void;
}

const AuditDetailPage: React.FC<AuditDetailPageProps> = ({ audits, onUpdateAudit }) => {
  return <AuditDetail audits={audits} onUpdateAudit={onUpdateAudit} />;
};

export default AuditDetailPage;