const Donation = require('../models/Donation');
const Donor = require('../models/Donor');
const Campaign = require('../models/Campaign');
const ErrorResponse = require('../utils/errorHandler');
const asyncHandler = require('../middleware/async');
const emailService = require('../services/emailService');
const pdfGenerator = require('../utils/pdfGenerator');

// @desc    Get all donations
// @route   GET /api/v1/donations
// @route   GET /api/v1/campaigns/:campaignId/donations
// @access  Private (Admin/Manager)
exports.getDonations = asyncHandler(async (req, res, next) => {
  if (req.params.campaignId) {
    const donations = await Donation.find({ campaign: req.params.campaignId })
      .populate({
        path: 'donor',
        select: 'name email phone',
      })
      .populate({
        path: 'campaign',
        select: 'title',
      });

    return res.status(200).json({
      success: true,
      count: donations.length,
      data: donations,
    });
  } else {
    res.status(200).json(res.advancedResults);
  }
});

// @desc    Get single donation
// @route   GET /api/v1/donations/:id
// @access  Private (Admin/Manager)
exports.getDonation = asyncHandler(async (req, res, next) => {
  const donation = await Donation.findById(req.params.id)
    .populate({
      path: 'donor',
      select: 'name email phone',
    })
    .populate({
      path: 'campaign',
      select: 'title description',
    });

  if (!donation) {
    return next(
      new ErrorResponse(`No donation with the id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: donation,
  });
});

// @desc    Add donation
// @route   POST /api/v1/campaigns/:campaignId/donations
// @access  Public
exports.addDonation = asyncHandler(async (req, res, next) => {
  req.body.campaign = req.params.campaignId;

  const campaign = await Campaign.findById(req.params.campaignId);

  if (!campaign) {
    return next(
      new ErrorResponse(
        `No campaign with the id of ${req.params.campaignId}`,
        404
      )
    );
  }

  // Check if donor exists, if not create new donor
  let donor;
  if (req.body.donorId) {
    donor = await Donor.findById(req.body.donorId);
    if (!donor) {
      return next(
        new ErrorResponse(`No donor with the id of ${req.body.donorId}`, 404)
      );
    }
  } else {
    // Create new donor
    donor = await Donor.create(req.body.donor);
  }

  req.body.donor = donor._id;

  const donation = await Donation.create(req.body);

  // Generate receipt PDF
  const receiptPath = await pdfGenerator.generateDonationReceipt(donation);

  // Send email confirmation
  if (donor.email) {
    await emailService.sendDonationConfirmation({
      email: donor.email,
      name: donor.name,
      amount: donation.amount,
      campaign: campaign.title,
      receiptPath,
    });
  }

  res.status(201).json({
    success: true,
    data: donation,
  });
});

// @desc    Update donation
// @route   PUT /api/v1/donations/:id
// @access  Private (Admin/Manager)
exports.updateDonation = asyncHandler(async (req, res, next) => {
  let donation = await Donation.findById(req.params.id);

  if (!donation) {
    return next(
      new ErrorResponse(`No donation with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is admin or manager
  if (req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this donation`,
        401
      )
    );
  }

  donation = await Donation.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: donation,
  });
});

// @desc    Delete donation
// @route   DELETE /api/v1/donations/:id
// @access  Private (Admin)
exports.deleteDonation = asyncHandler(async (req, res, next) => {
  const donation = await Donation.findById(req.params.id);

  if (!donation) {
    return next(
      new ErrorResponse(`No donation with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is admin
  if (req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this donation`,
        401
      )
    );
  }

  await donation.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});