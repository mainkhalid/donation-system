const express = require('express');
const router = express.Router();

// Import route files
const authRoutes = require('./api/auth');
const donorRoutes = require('./api/donors');
const donationRoutes = require('./api/donations');
const reportRoutes = require('./api/reports');
const campaignRoutes = require('./api/campaigns'); 
const dashboardRoutes = require('./api/Dashboard');

// Mount routers
router.use('/auth', authRoutes);
router.use('/donors', donorRoutes);
router.use('/donations', donationRoutes);
router.use('/reports', reportRoutes);
router.use('/campaigns', campaignRoutes);
router.use('/dashboard', dashboardRoutes);

module.exports = router;