const express = require('express');
const router = express.Router();
const {
  getDonationReport,
  getCampaignReport,
  getDonorReport,
} = require('../../controllers/reportController');
const { protect, authorize } = require('../../middleware/auth');

// Route for donation reports by date range
router.get('/donations', protect, authorize('admin', 'manager'), getDonationReport);

// Route for campaign performance reports
router.get('/campaigns', protect, authorize('admin', 'manager'), getCampaignReport);

// Route for donor contribution reports
router.get('/donors', protect, authorize('admin', 'manager'), getDonorReport);

module.exports = router;