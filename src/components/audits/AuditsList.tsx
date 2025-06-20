import React from 'react';
import { Link } from 'react-router-dom';
import { ExternalLink, ChevronRight, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { Audit } from '../../types';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import Button from '../ui/Button';

interface AuditsListProps {
  audits: Audit[];
}

const AuditsList: React.FC<AuditsListProps> = ({ audits }) => {
  if (audits.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500 mb-4">No audits found. Click below to create your first audit.</p>
        <Link to="/audits/new">
          <Button>Create New Audit</Button>
        </Link>
      </div>
    );
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'draft':
        return <Clock className="h-5 w-5 text-gray-500" />;
      case 'in-progress':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return null;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'draft':
        return 'Draft';
      case 'in-progress':
        return 'In Progress';
      case 'completed':
        return 'Completed';
      default:
        return status;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-4">
      {audits.map((audit) => (
        <Card key={audit.id} className="hover:shadow-md transition-shadow">
          <Link to={`/audits/${audit.id}`} className="block">
            <CardContent className="p-0">
              <div className="flex items-center p-4 sm:p-6">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center">
                    <h2 className="text-lg font-medium text-gray-900 truncate">{audit.name}</h2>
                    <div className="ml-2 flex items-center space-x-2">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {audit.framework}
                      </span>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {audit.type}
                      </span>
                    </div>
                  </div>
                  <div className="mt-2 flex">
                    <div className="flex items-center text-sm text-gray-500">
                      <span>Created on {formatDate(audit.createdAt)}</span>
                      <span className="mx-2">•</span>
                      <span>Updated on {formatDate(audit.updatedAt)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="flex items-center mr-4">
                    {getStatusIcon(audit.status)}
                    <span className="ml-1 text-sm font-medium text-gray-700">{getStatusText(audit.status)}</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            </CardContent>
          </Link>
        </Card>
      ))}
    </div>
  );
};

export default AuditsList;