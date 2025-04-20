const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  getDonations,
  getDonation,
  addDonation,
  updateDonation,
  deleteDonation,
} = require('../../controllers/donationController');
const { protect, authorize } = require('../../middleware/auth');

router
  .route('/')
  .get(protect, authorize('admin', 'manager'), getDonations)
  .post(addDonation);

router
  .route('/:id')
  .get(protect, authorize('admin', 'manager'), getDonation)
  .put(protect, authorize('admin', 'manager'), updateDonation)
  .delete(protect, authorize('admin'), deleteDonation);

module.exports = router;