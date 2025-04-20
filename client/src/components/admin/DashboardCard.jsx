import React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';

const DashboardCard = ({ title, value, isCurrency = false, change }) => {
  const isPositive = change >= 0;
  
  const formatValue = (val) => {
    if (isCurrency) {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0
      }).format(val);
    }
    return new Intl.NumberFormat('en-US').format(val);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-gray-500 text-sm mb-2">{title}</h3>
      <div className="flex items-baseline">
        <span className="text-2xl font-bold">{formatValue(value)}</span>
        <span className={`ml-2 text-sm flex items-center ${
          isPositive ? 'text-green-500' : 'text-red-500'
        }`}>
          {isPositive ? <ArrowUp size={14} /> : <ArrowDown size={14} />}
          {Math.abs(change)}%
        </span>
      </div>
    </div>
  );
};

export default DashboardCard;