import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import CampaignProgress from '../../components/admin/CampaignProgress';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

const Campaigns = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);
  
  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        const response = await api.get('/campaigns', {
          params: {
            createdBy: user._id, // Only show user's campaigns
            sort: '-createdAt' // Newest first
          }
        });
        setCampaigns(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load campaigns');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCampaigns();
  }, [user._id, refreshKey]);
  
  const handleDelete = async (campaignId) => {
    if (!window.confirm('Are you sure you want to delete this campaign?')) return;
    
    try {
      await api.delete(`/campaigns/${campaignId}`);
      setRefreshKey(prev => prev + 1); // Trigger refresh
    } catch (err) {
      setError(err.response?.data?.message || 'Delete failed');
    }
  };
  
  const handleEdit = (campaignId) => {
    navigate(`/admin/campaigns/edit/${campaignId}`);
  };
  
  if (loading) return <LoadingSpinner />;
  
  if (error) return (
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
  
  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Your Campaigns</h1>
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {campaigns.map(campaign => (
            <div key={campaign._id} className="border rounded-lg p-4 shadow-sm">
              <h3 className="font-bold text-lg mb-2">{campaign.name}</h3>
              <p className="text-gray-600 mb-3">{campaign.description}</p>
              
              <CampaignProgress campaign={campaign} />
              
              <div className="mt-4 flex justify-between">
                <button
                  onClick={() => handleEdit(campaign._id)}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(campaign._id)}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Campaigns;