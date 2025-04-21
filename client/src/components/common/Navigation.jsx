import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Home, Users, DollarSign, Flag,
  BarChart2, Settings, LogOut, Plus
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Navigation = ({ activePage, onPageChange }) => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const isAdmin = user?.role === 'admin';
  
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <Home size={20} />, path: '/admin/dashboard' },
    { id: 'donors', label: 'Donors', icon: <Users size={20} />, path: '/admin/donors' },
    { id: 'donations', label: 'Donations', icon: <DollarSign size={20} />, path: '/admin/donations' },
    { id: 'campaigns', label: 'Campaigns', icon: <Flag size={20} />, path: '/admin/campaigns' },
    ...(isAdmin ? [
      { id: 'reports', label: 'Reports', icon: <BarChart2 size={20} />, path: '/admin/reports' },
      { id: 'settings', label: 'Settings', icon: <Settings size={20} />, path: '/admin/settings' }
    ] : [])
  ];
  
  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  
  return (
    <div className="bg-gray-800 text-white w-64 fixed top-0 left-0 h-screen flex flex-col z-10 border-r border-gray-700">
      <div className="p-4">
        <div className="bg-blue-600 text-white rounded p-2 font-bold text-center mb-8">
          DONATION PLATFORM
        </div>
      
        {isAdmin && (
          <div className="mb-6">
            <Link
              to="/admin/campaigns/new"
              className="flex items-center w-full p-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors mb-2"
            >
              <Plus size={18} className="mr-3" />
              <span>New Campaign</span>
            </Link>
          </div>
        )}
      </div>
      
      <nav className="flex-1 overflow-y-auto px-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.id}>
              <Link
                to={item.path}
                onClick={() => onPageChange && onPageChange(item.id)}
                className={`flex items-center w-full p-3 rounded-lg transition-colors ${
                  location.pathname.startsWith(item.path)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="mt-auto p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center w-full p-3 rounded-lg text-gray-300 hover:bg-gray-700 transition-colors"
        >
          <LogOut size={18} className="mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

// This is the main layout component that should wrap your app content
const AppLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Navigation />
      <div className="ml-64 flex-1 overflow-auto">
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export { Navigation, AppLayout };