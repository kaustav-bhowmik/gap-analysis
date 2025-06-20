import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle } from 'lucide-react';
import { Audit } from '../types';
import Button from '../components/ui/Button';
import AuditsList from '../components/audits/AuditsList';

interface AuditsPageProps {
  audits: Audit[];
}

const AuditsPage: React.FC<AuditsPageProps> = ({ audits }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Audits</h1>
        <Link to="/audits/new">
          <Button leftIcon={<PlusCircle size={18} />}>New Audit</Button>
        </Link>
      </div>
      
      <AuditsList audits={audits} />
    </div>
  );
};

export default AuditsPage;