import React from 'react';
import { Link } from 'react-router-dom';
import { PlusCircle, ClipboardList, FileText, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Audit } from '../types';

interface DashboardProps {
  audits: Audit[];
}

const Dashboard: React.FC<DashboardProps> = ({ audits }) => {
  const recentAudits = audits.slice(0, 3);

  const getAuditStatusCounts = () => {
    return {
      draft: audits.filter(audit => audit.status === 'draft').length,
      inProgress: audits.filter(audit => audit.status === 'in-progress').length,
      completed: audits.filter(audit => audit.status === 'completed').length,
    };
  };

  const statusCounts = getAuditStatusCounts();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <Link to="/audits/new">
          <Button leftIcon={<PlusCircle size={18} />}>New Audit</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="rounded-md bg-blue-100 p-3 mr-4">
                <ClipboardList className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Audits</p>
                <p className="text-2xl font-bold text-gray-900">{audits.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="rounded-md bg-yellow-100 p-3 mr-4">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">In Progress</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.inProgress + statusCounts.draft}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <div className="rounded-md bg-green-100 p-3 mr-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{statusCounts.completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Recent Audits</CardTitle>
            </CardHeader>
            <CardContent>
              {recentAudits.length > 0 ? (
                <div className="space-y-4">
                  {recentAudits.map((audit) => (
                    <Link key={audit.id} to={`/audits/${audit.id}`}>
                      <div className="flex items-center p-3 hover:bg-gray-50 rounded-md transition-colors">
                        {audit.status === 'draft' && <Clock className="h-5 w-5 text-gray-500 mr-3" />}
                        {audit.status === 'in-progress' && <AlertTriangle className="h-5 w-5 text-yellow-500 mr-3" />}
                        {audit.status === 'completed' && <CheckCircle className="h-5 w-5 text-green-500 mr-3" />}
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">{audit.name}</p>
                          <p className="text-xs text-gray-500">{audit.framework} • {audit.type}</p>
                        </div>
                        <div className="ml-4">
                          <span className="text-xs text-gray-500">
                            {new Date(audit.updatedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ClipboardList className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No audits yet</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by creating a new audit.</p>
                  <div className="mt-6">
                    <Link to="/audits/new">
                      <Button>New Audit</Button>
                    </Link>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Link to="/audits/new">
                  <Button 
                    className="w-full justify-start"
                    leftIcon={<PlusCircle size={18} />}
                  >
                    Create New Audit
                  </Button>
                </Link>
                <Link to="/audits">
                  <Button 
                    className="w-full justify-start"
                    variant="outline"
                    leftIcon={<ClipboardList size={18} />}
                  >
                    View All Audits
                  </Button>
                </Link>
                <Link to="/reports">
                  <Button 
                    className="w-full justify-start"
                    variant="outline"
                    leftIcon={<FileText size={18} />}
                  >
                    View Reports
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;