const mongoose = require('mongoose');

const DonationSchema = new mongoose.Schema({
  donor: {
    type: mongoose.Schema.ObjectId,
    ref: 'Donor',
    required: true,
  },
  campaign: {
    type: mongoose.Schema.ObjectId,
    ref: 'Campaign',
    required: true,
  },
  amount: {
    type: Number,
    required: [true, 'Please add an amount'],
    min: [1, 'Amount must be at least 1'],
  },
  paymentMethod: {
    type: String,
    required: [true, 'Please add a payment method'],
    enum: ['credit_card', 'bank_transfer', 'paypal', 'other'],
  },
  isRecurring: {
    type: Boolean,
    default: false,
  },
  frequency: {
    type: String,
    enum: ['monthly', 'quarterly', 'yearly'],
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed', 'refunded'],
    default: 'pending',
  },
  transactionId: {
    type: String,
  },
  notes: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Static method to get total donations for a campaign
DonationSchema.statics.getTotalDonations = async function (campaignId) {
  const obj = await this.aggregate([
    {
      $match: { campaign: campaignId, status: 'completed' },
    },
    {
      $group: {
        _id: '$campaign',
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 },
      },
    },
  ]);

  try {
    await this.model('Campaign').findByIdAndUpdate(campaignId, {
      totalDonations: obj[0] ? obj[0].totalAmount : 0,
      donationCount: obj[0] ? obj[0].count : 0,
    });
  } catch (err) {
    console.error(err);
  }
};

// Call getTotalDonations after save
DonationSchema.post('save', function () {
  this.constructor.getTotalDonations(this.campaign);
});

// Call getTotalDonations after remove
DonationSchema.post('remove', function () {
  this.constructor.getTotalDonations(this.campaign);
});

module.exports = mongoose.model('Donation', DonationSchema);