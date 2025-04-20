import React from 'react';
import { Outlet } from 'react-router-dom';
import Navigation from '../components/common/Navigation';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const AdminLayout = () => {
  const [activePage, setActivePage] = React.useState('dashboard');
  const { user, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Navigation activePage={activePage} onPageChange={setActivePage} />
      <div className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminLayout;