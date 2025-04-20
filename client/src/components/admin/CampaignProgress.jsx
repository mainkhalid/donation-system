import React from 'react';
import { Link } from 'react-router-dom';
import { formatDate, currencyFormat } from '../../utils/format';

const CampaignProgress = ({ 
  campaigns = [], 
  showActions = false, 
  onDelete, 
  onEdit 
}) => {
  const calculateStatus = (startDate, endDate) => {
    const now = new Date();
    if (new Date(startDate) > now) return 'Upcoming';
    if (new Date(endDate) < now) return 'Ended';
    return 'Active';
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <table className="w-full">
        <thead className="bg-gray-50">
          <tr className="text-left text-gray-500">
            <th className="px-6 py-3">Campaign</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Goal</th>
            <th className="px-6 py-3">Progress</th>
            <th className="px-6 py-3">End Date</th>
            {showActions && <th className="px-6 py-3">Actions</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {campaigns.map((campaign) => (
            <tr key={campaign._id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <Link
                  to={`/admin/campaigns/${campaign._id}`}
                  className="text-blue-600 hover:underline font-medium"
                >
                  {campaign.title}
                </Link>
                <p className="text-sm text-gray-500 mt-1">
                  {campaign.category}
                </p>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  calculateStatus(campaign.startDate, campaign.endDate) === 'Active' 
                    ? 'bg-green-100 text-green-800' 
                    : calculateStatus(campaign.startDate, campaign.endDate) === 'Upcoming'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
                }`}>
                  {calculateStatus(campaign.startDate, campaign.endDate)}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {currencyFormat(campaign.targetAmount)}
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                    <div
                      className="h-2.5 rounded-full"
                      style={{ 
                        width: `${campaign.progressPercentage}%`,
                        backgroundColor: campaign.progressPercentage >= 100 
                          ? '#10B981' // Green for completed
                          : '#3B82F6' // Blue for in-progress
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-500">
                    {campaign.progressPercentage}%
                  </span>
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  {currencyFormat(campaign.currentAmount)} raised
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                {formatDate(campaign.endDate)}
              </td>
              {showActions && (
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEdit(campaign._id)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => onDelete(campaign._id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CampaignProgress;