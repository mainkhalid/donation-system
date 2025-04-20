const Campaign = require('../models/Campaign');
const ErrorResponse = require('../utils/errorHandler');
const asyncHandler = require('../middleware/async');

// @desc    Get all campaigns
// @route   GET /api/v1/campaigns
// @access  Public
exports.getCampaigns = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc    Get single campaign
// @route   GET /api/v1/campaigns/:id
// @access  Public
exports.getCampaign = asyncHandler(async (req, res, next) => {
  const campaign = await Campaign.findById(req.params.id);

  if (!campaign) {
    return next(
      new ErrorResponse(`No campaign with the id of ${req.params.id}`, 404)
    );
  }

  res.status(200).json({
    success: true,
    data: campaign,
  });
});

// @desc    Create campaign
// @route   POST /api/v1/campaigns
// @access  Private (Admin/Manager)
exports.createCampaign = asyncHandler(async (req, res, next) => {
  // Add user to req.body
  req.body.createdBy = req.user.id;

  const campaign = await Campaign.create(req.body);

  res.status(201).json({
    success: true,
    data: campaign,
  });
});

// @desc    Update campaign
// @route   PUT /api/v1/campaigns/:id
// @access  Private (Admin/Manager)
exports.updateCampaign = asyncHandler(async (req, res, next) => {
  let campaign = await Campaign.findById(req.params.id);

  if (!campaign) {
    return next(
      new ErrorResponse(`No campaign with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is campaign creator or admin
  if (campaign.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to update this campaign`,
        401
      )
    );
  }

  campaign = await Campaign.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: campaign,
  });
});

// @desc    Delete campaign
// @route   DELETE /api/v1/campaigns/:id
// @access  Private (Admin)
exports.deleteCampaign = asyncHandler(async (req, res, next) => {
  const campaign = await Campaign.findById(req.params.id);

  if (!campaign) {
    return next(
      new ErrorResponse(`No campaign with the id of ${req.params.id}`, 404)
    );
  }

  // Make sure user is admin
  if (req.user.role !== 'admin') {
    return next(
      new ErrorResponse(
        `User ${req.user.id} is not authorized to delete this campaign`,
        401
      )
    );
  }

  await campaign.remove();

  res.status(200).json({
    success: true,
    data: {},
  });
});