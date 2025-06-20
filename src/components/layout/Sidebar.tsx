import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ClipboardList, 
  FileCheck, 
  FileText, 
  Users, 
  Settings, 
  HelpCircle, 
  FileUp
} from 'lucide-react';

interface SidebarLinkProps {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ to, icon, label, isActive }) => {
  return (
    <Link
      to={to}
      className={`flex items-center px-4 py-2 text-sm font-medium rounded-md group transition-colors ${
        isActive
          ? 'bg-blue-50 text-blue-700'
          : 'text-gray-700 hover:bg-gray-50 hover:text-blue-600'
      }`}
    >
      <div className="mr-3">{icon}</div>
      {label}
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const location = useLocation();
  
  const links = [
    {
      to: '/dashboard',
      icon: <LayoutDashboard size={20} />,
      label: 'Dashboard',
    },
    {
      to: '/audits',
      icon: <ClipboardList size={20} />,
      label: 'Audits',
    },
    {
      to: '/documents',
      icon: <FileUp size={20} />,
      label: 'Documents',
    },
    {
      to: '/assessments',
      icon: <FileCheck size={20} />,
      label: 'Assessments',
    },
    {
      to: '/reports',
      icon: <FileText size={20} />,
      label: 'Reports',
    },
    {
      to: '/clients',
      icon: <Users size={20} />,
      label: 'Clients',
    },
  ];

  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex flex-col flex-grow border-r border-gray-200 bg-white overflow-y-auto">
        <div className="flex-grow flex flex-col">
          <nav className="flex-1 px-2 pb-4 pt-5 space-y-1">
            {links.map((link) => (
              <SidebarLink
                key={link.to}
                to={link.to}
                icon={link.icon}
                label={link.label}
                isActive={location.pathname === link.to}
              />
            ))}
          </nav>
          <div className="mt-auto p-4 border-t border-gray-200">
            <div className="space-y-1">
              <Link
                to="/settings"
                className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 hover:text-blue-600"
              >
                <Settings size={20} className="mr-3" />
                Settings
              </Link>
              <Link
                to="/help"
                className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 hover:bg-gray-50 hover:text-blue-600"
              >
                <HelpCircle size={20} className="mr-3" />
                Help & Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;