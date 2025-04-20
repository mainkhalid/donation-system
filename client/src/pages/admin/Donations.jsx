import React from 'react';
import DonationChart from '../../components/admin/DonationChart';

const Donations = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Donation Records</h1>
      {/* Your donation management content */}
      <DonationChart /> 
    </div>
  );
};

export default Donations;