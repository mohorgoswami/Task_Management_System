import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FolderOpen, Plus, Bot } from 'lucide-react';

function Navbar() {
  const location = useLocation();
  const isHomePage = location.pathname === '/' || location.pathname === '/projects';

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Title */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 text-xl font-bold text-gray-900 hover:text-primary-600 transition-colors"
          >
            <div className="bg-primary-600 p-2 rounded-lg">
              <FolderOpen className="h-6 w-6 text-white" />
            </div>
            <span>Task Manager</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            <Link
              to="/projects"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isHomePage
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              Projects
            </Link>
            
            {/* AI Badge */}
            <div className="flex items-center space-x-1 px-3 py-1 bg-gradient-to-r from-purple-100 to-pink-100 rounded-full">
              <Bot className="h-4 w-4 text-purple-600" />
              <span className="text-xs font-medium text-purple-700">AI Powered</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;