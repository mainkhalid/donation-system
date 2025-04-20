import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import DashboardCard from '../components/admin/DashboardCard';
import RecentDonationsTable from '../components/admin/RecentDonationsTable';
import CampaignProgress from '../components/admin/CampaignProgress';
import DonationChart from '../components/admin/DonationChart';

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [apiDetails, setApiDetails] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Validate user data first
        if (!user) {
          setError('User data not available. Please log in again.');
          setLoading(false);
          return;
        }

        console.log('Fetching dashboard data for user:', user.name);
        setLoading(true);
        setError(null);
        
        // Use a single endpoint for all user types
        const endpoint = '/dashboard';
        console.log('Using API endpoint:', endpoint);
        
        // Save API details for debugging
        setApiDetails({
          endpoint,
          userRole: user.role,
          userId: user._id
        });
        
        const response = await api.get(endpoint);
        console.log('Dashboard API response:', response);
        
        if (!response.data) {
          throw new Error('No data received from server');
        }
        
        setDashboardData(response.data);
      } catch (err) {
        console.error('Dashboard fetch error:', err);
        
        // Provide more detailed error messages based on error type
        if (err.response) {
          if (err.response.status === 404) {
            setError(`API endpoint not found: ${err.response.config?.url || 'unknown endpoint'}`);
          } else if (err.response.status === 401 || err.response.status === 403) {
            setError('Authentication or permission issue. Please log in again.');
          } else {
            setError(`Server error (${err.response.status}): ${err.response.data?.message || 'Unknown error'}`);
          }
        } else if (err.request) {
          setError('No response received from server. Please check your connection.');
        } else {
          setError(`Error: ${err.message || 'Failed to fetch dashboard data'}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        <div className="text-red-500 mb-4 text-center">{error}</div>
        
        {/* Show API details for debugging */}
        {apiDetails && (
          <div className="mb-4 p-4 bg-gray-100 rounded text-sm text-gray-700 max-w-lg">
            <h3 className="font-bold mb-2">Debug Information:</h3>
            <p>User Role: {apiDetails.userRole || 'unknown'}</p>
            <p>Endpoint: {apiDetails.endpoint || 'not set'}</p>
            <p>User ID: {apiDetails.userId || 'unknown'}</p>
          </div>
        )}
        
        <button 
          onClick={handleRetry}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Retry
        </button>
      </div>
    );
  }

  // Add fallback values to prevent rendering errors
  const safeData = {
    totalDonations: dashboardData?.totalDonations || 0,
    donationGrowth: dashboardData?.donationGrowth || 0,
    totalDonors: dashboardData?.totalDonors || 0,
    donorGrowth: dashboardData?.donorGrowth || 0,
    activeCampaigns: dashboardData?.activeCampaigns || 0,
    campaignGrowth: dashboardData?.campaignGrowth || 0,
    monthlyDonations: dashboardData?.monthlyDonations || [],
    recentDonations: dashboardData?.recentDonations || [],
    campaigns: dashboardData?.campaigns || []
  };

  return (
    <div className="flex-1">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          Dashboard
        </h1>
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 font-medium">
            {user?.name?.charAt(0).toUpperCase() || '?'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <DashboardCard 
          title="Total Donations" 
          value={safeData.totalDonations} 
          isCurrency 
          change={safeData.donationGrowth} 
        />
        <DashboardCard 
          title="Total Donors" 
          value={safeData.totalDonors} 
          change={safeData.donorGrowth} 
        />
        <DashboardCard 
          title="Active Campaigns" 
          value={safeData.activeCampaigns} 
          change={safeData.campaignGrowth} 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm lg:col-span-2">
          <h3 className="font-bold mb-4">Donations by Month</h3>
          <DonationChart data={safeData.monthlyDonations} />
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="font-bold mb-4">Recent Donations</h3>
          <RecentDonationsTable 
            donations={safeData.recentDonations} 
            showDonorDetails={true} 
          />
        </div>
      </div>

      <div className="mt-6 bg-white p-6 rounded-lg shadow-sm">
        <h3 className="font-bold mb-4">Campaign Performance</h3>
        <CampaignProgress 
          campaigns={safeData.campaigns} 
          showActions={true} 
        />
      </div>
    </div>
  );
};

export default Dashboard;