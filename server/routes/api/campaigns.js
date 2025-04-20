const express = require('express');
const router = express.Router();
const {
  getCampaigns,
  getCampaign,
  createCampaign,
  updateCampaign,
  deleteCampaign,
} = require('../../controllers/campaignController');
const { protect, authorize } = require('../../middleware/auth');

// Include donation router
const donationRouter = require('./donations');
router.use('/:campaignId/donations', donationRouter);

router
  .route('/')
  .get(getCampaigns)
  .post(protect, authorize('admin', 'manager'), createCampaign);

router
  .route('/:id')
  .get(getCampaign)
  .put(protect, authorize('admin', 'manager'), updateCampaign)
  .delete(protect, authorize('admin'), deleteCampaign);

module.exports = router;