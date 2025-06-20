import React from 'react';
import { Link } from 'react-router-dom';
import { ClipboardCheck, Settings, BellRing, User } from 'lucide-react';
import Button from '../ui/Button';

const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <ClipboardCheck className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900">X Corp ISO:27001 Audit</span>
              </Link>
            </div>
            <nav className="ml-6 flex space-x-4 sm:space-x-6 items-center">
              <Link
                to="/audits"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium rounded-md"
              >
                Audits
              </Link>
              <Link
                to="/reports"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium rounded-md"
              >
                Reports
              </Link>
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-1 rounded-full text-gray-500 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <span className="sr-only">View notifications</span>
              <BellRing className="h-6 w-6" />
            </button>
            <button className="p-1 rounded-full text-gray-500 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              <span className="sr-only">Settings</span>
              <Settings className="h-6 w-6" />
            </button>
            <div className="ml-3 relative">
              <div>
                <button className="flex items-center max-w-xs bg-gray-100 p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                  <span className="sr-only">Open user menu</span>
                  <User className="h-6 w-6 text-gray-500" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;