import React from 'react';
import { Link } from 'react-router-dom';
import { FileText, Download, ExternalLink } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Audit } from '../types';

interface ReportsPageProps {
  audits: Audit[];
}

const ReportsPage: React.FC<ReportsPageProps> = ({ audits }) => {
  const completedAudits = audits.filter(audit => audit.status === 'completed');
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
      </div>
      
      {completedAudits.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {completedAudits.map((audit) => (
            <Card key={audit.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start">
                  <div className="mr-4 flex-shrink-0">
                    <FileText className="h-10 w-10 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{audit.name}</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {audit.framework} • {audit.type}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Generated on {new Date(audit.updatedAt).toLocaleDateString()}
                    </p>
                    <div className="mt-4 flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        leftIcon={<Download size={16} />}
                      >
                        Download
                      </Button>
                      <Link to={`/reports/${audit.id}`}>
                        <Button 
                          size="sm"
                          leftIcon={<ExternalLink size={16} />}
                        >
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No reports available</h3>
          <p className="mt-1 text-sm text-gray-500">
            Complete an audit to generate a report.
          </p>
          <div className="mt-6">
            <Link to="/audits">
              <Button>View Audits</Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;