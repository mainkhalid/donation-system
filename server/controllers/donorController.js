const Donor = require('../models/Donor');
const ErrorResponse = require('../utils/errorHandler');
const asyncHandler = require('../middleware/async');

// @desc    Get all donors
// @route   GET /api/v1/donors
// @access  Private (Admin/Manager)
exports.getDonors = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single donor
// @route   GET /api/v1/donors/:id
// @access  Private (Admin/Manager)
exports.getDonor = asyncHandler(async (req, res, next) => {
  const donor = await Donor.findById(req.params.id);

  if (!donor) {
    return next(
      new ErrorResponse(`No donor with the id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: donor,
  });
});

// @desc    Create donor
// @route   POST /api/v1/donors
// @access  Public
exports.createDonor = asyncHandler(async (req, res, next) => {
  const donor = await Donor.create(req.body);

  res.status(201).json({
    success: true,
    data: donor,
  });
});

// @desc    Update donor
// @route   PUT /api/v1/donors/:id
// @access  Private (Admin/Manager)
exports.updateDonor = asyncHandler(async (req, res, next) => {
  const donor = await Donor.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!donor) {
    return next(
      new ErrorResponse(`No donor with the id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: donor,
  });
});

// @desc    Delete donor
// @route   DELETE /api/v1/donors/:id
// @access  Private (Admin)
exports.deleteDonor = asyncHandler(async (req, res, next) => {
  const donor = await Donor.findById(req.params.id);

  if (!donor) {
    return next(
      new ErrorResponse(`No donor with the id of ${req.params.id}`, 404)
    );
  }

  await donor.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});