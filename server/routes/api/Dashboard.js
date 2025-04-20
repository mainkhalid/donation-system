// api/dashboard.js
const express = require('express');
const router = express.Router();

// Simple placeholder middleware
const auth = (req, res, next) => {
  next();
};

// Dashboard data endpoint
router.get('/', auth, async (req, res) => {
  try {
    // Mock data with the correct field names matching your component
    const mockData = {
      totalDonations: 25000,
      donationGrowth: 5.2,
      totalDonors: 150,
      donorGrowth: 3.7,
      activeCampaigns: 5,
      campaignGrowth: 2.1,
      monthlyDonations: [
        { month: 'Jan', amount: 2100 },
        { month: 'Feb', amount: 2400 },
        { month: 'Mar', amount: 1800 },
        { month: 'Apr', amount: 2700 },
        { month: 'May', amount: 3500 },
        { month: 'Jun', amount: 3200 }
      ],
      recentDonations: [
        { 
          _id: '1', 
          amount: 100, 
          createdAt: '2025-04-15T10:30:00.000Z', 
          donor: { name: 'John Doe', email: 'john@example.com' } 
        },
        { 
          _id: '2', 
          amount: 250, 
          createdAt: '2025-04-12T14:45:00.000Z', 
          donor: { name: 'Jane Smith', email: 'jane@example.com' } 
        },
        { 
          _id: '3', 
          amount: 500, 
          createdAt: '2025-04-10T09:15:00.000Z', 
          donor: { name: 'Bob Johnson', email: 'bob@example.com' } 
        }
      ],
      campaigns: [
        { _id: '1', name: 'COVID-19 Relief', goal: 10000, current: 8500, status: 'active' },
        { _id: '2', name: 'Education Fund', goal: 5000, current: 3000, status: 'active' },
        { _id: '3', name: 'Community Garden', goal: 2000, current: 2000, status: 'completed' }
      ]
    };
    
    res.json(mockData);
    
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;