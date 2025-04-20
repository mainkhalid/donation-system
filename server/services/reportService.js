const Donation = require('../models/Donation');
const Campaign = require('../models/Campaign');
const moment = require('moment');

// Generate donation report by date range
exports.generateDonationReport = async (startDate, endDate) => {
  const donations = await Donation.find({
    createdAt: {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    },
    status: 'completed',
  })
    .populate('donor')
    .populate('campaign');

  const totalAmount = donations.reduce((sum, donation) => sum + donation.amount, 0);

  return {
    startDate,
    endDate,
    totalDonations: donations.length,
    totalAmount,
    donations,
  };
};

// Generate campaign performance report
exports.generateCampaignReport = async () => {
  const campaigns = await Campaign.find().sort({ totalDonations: -1 });

  return {
    totalCampaigns: campaigns.length,
    totalRaised: campaigns.reduce((sum, campaign) => sum + campaign.totalDonations, 0),
    campaigns,
  };
};

// Generate donor report
exports.generateDonorReport = async () => {
  const donors = await Donation.aggregate([
    {
      $match: { status: 'completed' },
    },
    {
      $group: {
        _id: '$donor',
        totalDonated: { $sum: '$amount' },
        donationCount: { $sum: 1 },
      },
    },
    {
      $lookup: {
        from: 'donors',
        localField: '_id',
        foreignField: '_id',
        as: 'donor',
      },
    },
    {
      $unwind: '$donor',
    },
    {
      $project: {
        'donor.name': 1,
        'donor.email': 1,
        'donor.phone': 1,
        totalDonated: 1,
        donationCount: 1,
      },
    },
    {
      $sort: { totalDonated: -1 },
    },
  ]);

  return {
    totalDonors: donors.length,
    totalAmount: donors.reduce((sum, donor) => sum + donor.totalDonated, 0),
    donors,
  };
};