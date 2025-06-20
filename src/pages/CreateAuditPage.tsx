import React from 'react';
import { Audit } from '../types';
import CreateAuditForm from '../components/audits/CreateAuditForm';

interface CreateAuditPageProps {
  onAuditCreate: (audit: Audit) => void;
}

const CreateAuditPage: React.FC<CreateAuditPageProps> = ({ onAuditCreate }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">New Audit</h1>
      </div>
      
      <CreateAuditForm onAuditCreate={onAuditCreate} />
    </div>
  );
};

export default CreateAuditPage;