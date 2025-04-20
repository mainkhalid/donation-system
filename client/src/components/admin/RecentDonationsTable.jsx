import React from 'react';
import { formatDistanceToNow } from 'date-fns';

const RecentDonationsTable = ({ donations = [] }) => {
  // Helper function to safely format dates
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return 'Recently';
      }
      return formatDistanceToNow(date, { addSuffix: true });
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Recently';
    }
  };

  // Check if donations array exists and has items
  if (!donations || donations.length === 0) {
    return <div className="text-gray-500">No recent donations</div>;
  }

  return (
    <div className="space-y-4">
      {donations.map((donation) => (
        <div key={donation._id} className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
            donation.amount >= 500
              ? 'bg-blue-100 text-blue-600'
              : 'bg-green-100 text-green-600'
          }`}>
            {donation.donor?.name?.charAt(0).toUpperCase() || '?'}
          </div>
          <div className="ml-3 flex-1">
            <p className="font-medium">{donation.donor?.name || 'Anonymous'}</p>
            <p className="text-gray-500 text-xs">
              {formatDate(donation.createdAt)}
            </p>
          </div>
          <div className="font-medium">
            {new Intl.NumberFormat('en-US', {
              style: 'currency',
              currency: 'USD'
            }).format(donation.amount || 0)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RecentDonationsTable;