import React from 'react';
import DonationChart from '../../components/admin/DonationChart';

const Reports = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-green-400">System Reports</h1>
      {/* Admin-only reports content */}
      
      <DonationChart />
    </div>
  );
};

export default Reports;