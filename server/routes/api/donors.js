const express = require('express');
const router = express.Router();
const {
  getDonors,
  getDonor,
  createDonor,
  updateDonor,
  deleteDonor,
} = require('../../controllers/donorController');
const { protect, authorize } = require('../../middleware/auth');

router
  .route('/')
  .get(protect, authorize('admin', 'manager'), getDonors)
  .post(createDonor);

router
  .route('/:id')
  .get(protect, authorize('admin', 'manager'), getDonor)
  .put(protect, authorize('admin', 'manager'), updateDonor)
  .delete(protect, authorize('admin'), deleteDonor);

module.exports = router;