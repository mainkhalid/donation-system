import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import CampaignProgress from '../../components/admin/CampaignProgress';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const Campaigns = () => {
  const { user, loading: authLoading } = useAuth(); // get loading from AuthContext
  const navigate = useNavigate();
  const location = useLocation();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Debug context load
  console.log("Auth Loading:", authLoading, "User:", user);

  useEffect(() => {
    if (location.state?.refreshCampaigns) {
      setRefreshKey(prev => prev + 1);
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

  useEffect(() => {
    const fetchCampaigns = async () => {
      console.log("Fetching campaigns...");
      try {
        setLoading(true);
        const response = await api.get('/campaigns', {
          // params: {
          //   createdBy: user._id,
          //   sort: '-createdAt'
          // }
        });

        console.log("API response:", response.data);

        const campaignsData = response.data.data || [];

        const campaignsWithProgress = campaignsData.map(campaign => ({
          ...campaign,
          currentAmount: campaign.currentAmount || 0,
          progressPercentage: Math.round(((campaign.currentAmount || 0) / campaign.targetAmount) * 100)
        }));

        setCampaigns(campaignsWithProgress);
      } catch (err) {
        console.error('Error fetching campaigns:', err);
        setError(err.response?.data?.message || 'Failed to load campaigns');
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user?.id) {
      fetchCampaigns();
    }
  }, [authLoading, user?.id, refreshKey]);

  const handleDelete = async (campaignId) => {
    if (!window.confirm('Are you sure you want to delete this campaign?')) return;

    try {
      await api.delete(`/campaigns/${campaignId}`);
      setRefreshKey(prev => prev + 1);
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };

  const handleEdit = (campaignId) => {
    navigate(`/admin/campaigns/edit/${campaignId}`);
  };

  if (authLoading || loading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded mb-4">
        <p>{error}</p>
        <button
          onClick={() => setRefreshKey(prev => prev + 1)}
          className="mt-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6 text-green-400">
        <h1 className="text-2xl font-bold">All Campaigns</h1>
        <button
          onClick={() => navigate('/admin/campaigns/new')}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          + New Campaign
        </button>
      </div>

      {campaigns.length === 0 ? (
        <div className="text-center p-8 bg-gray-50 rounded-lg">
          <h2 className="text-xl mb-4">You haven't created any campaigns yet</h2>
          <button
            onClick={() => navigate('/admin/campaigns/new')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Create Your First Campaign
          </button>
        </div>
      ) : (
        <CampaignProgress
          campaigns={campaigns}
          showActions={true}
          onDelete={handleDelete}
          onEdit={handleEdit}
        />
      )}
    </div>
  );
};

export default Campaigns;
