import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

const DonationChart = ({ data }) => {
  return (
    <div className="h-64 mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="month" 
            axisLine={false} 
            tickLine={false} 
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tickFormatter={(value) => `$${value / 1000}k`}
          />
          <Tooltip 
            formatter={(value) => [
              new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD'
              }).format(value),
              'Amount'
            ]}
          />
          <Bar 
            dataKey="amount" 
            fill="#3b82f6" 
            radius={[4, 4, 0, 0]} 
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DonationChart;