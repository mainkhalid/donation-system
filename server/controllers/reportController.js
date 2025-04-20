const ErrorResponse = require('../utils/errorHandler');
const asyncHandler = require('../middleware/async');
const reportService = require('../services/reportService');

// @desc    Get donation report by date range
// @route   GET /api/v1/reports/donations
// @access  Private (Admin/Manager)
exports.getDonationReport = asyncHandler(async (req, res, next) => {
  const { startDate, endDate } = req.query;

  if (!startDate || !endDate) {
    return next(
      new ErrorResponse('Please provide both startDate and endDate parameters', 400)
    );
  }

  const report = await reportService.generateDonationReport(startDate, endDate);

  res.status(200).json({
    success: true,
    data: report,
  });
});

// @desc    Get campaign performance report
// @route   GET /api/v1/reports/campaigns
// @access  Private (Admin/Manager)
exports.getCampaignReport = asyncHandler(async (req, res, next) => {
  const report = await reportService.generateCampaignReport();

  res.status(200).json({
    success: true,
    data: report,
  });
});

// @desc    Get donor contribution report
// @route   GET /api/v1/reports/donors
// @access  Private (Admin/Manager)
exports.getDonorReport = asyncHandler(async (req, res, next) => {
  const report = await reportService.generateDonorReport();

  res.status(200).json({
    success: true,
    data: report,
  });
});