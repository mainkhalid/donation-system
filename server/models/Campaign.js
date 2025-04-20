const mongoose = require('mongoose');
const slugify = require('slugify');

const CampaignSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a campaign title'],
      trim: true,
      maxlength: [100, 'Title cannot be more than 100 characters'],
      unique: true
    },
    slug: String, // URL-friendly version of the title
    description: {
      type: String,
      required: [true, 'Please add a description'],
      maxlength: [500, 'Description cannot be more than 500 characters']
    },
    detailedStory: {
      type: String,
      required: [true, 'Please add the full story']
    },
    targetAmount: {
      type: Number,
      required: [true, 'Please add a target amount'],
      min: [100, 'Target amount must be at least 100']
    },
    currentAmount: {
      type: Number,
      default: 0
    },
    startDate: {
      type: Date,
      required: [true, 'Please add a start date'],
      default: Date.now
    },
    endDate: {
      type: Date,
      required: [true, 'Please add an end date'],
      validate: {
        validator: function(value) {
          return value > this.startDate;
        },
        message: 'End date must be after start date'
      }
    },
    isActive: {
      type: Boolean,
      default: true
    },
    isFeatured: {
      type: Boolean,
      default: false
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      enum: [
        'education',
        'medical',
        'environment',
        'animals',
        'disaster-relief',
        'community',
        'other'
      ]
    },
    imageCover: {
      type: String,
      default: 'default-cover.jpg'
    },
    images: [String], // Array of image URLs
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: true
    },
    beneficiaries: {
      type: [String],
      required: [true, 'Please specify who will benefit']
    },
    location: {
      // GeoJSON Point
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: {
        type: [Number],
        index: '2dsphere'
      },
      address: String,
      city: String,
      country: String
    },
    updates: [
      {
        content: String,
        date: {
          type: Date,
          default: Date.now
        }
      }
    ],
    donationCount: {
      type: Number,
      default: 0
    },
    averageDonation: {
      type: Number,
      default: 0
    },
    socialShares: {
      facebook: { type: Number, default: 0 },
      twitter: { type: Number, default: 0 },
      linkedin: { type: Number, default: 0 }
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Create campaign slug from the title
CampaignSchema.pre('save', function(next) {
  this.slug = slugify(this.title, { lower: true });
  next();
});

// Cascade delete donations when a campaign is deleted
CampaignSchema.pre('remove', async function(next) {
  await this.model('Donation').deleteMany({ campaign: this._id });
  next();
});

// Reverse populate with virtuals
CampaignSchema.virtual('donations', {
  ref: 'Donation',
  localField: '_id',
  foreignField: 'campaign',
  justOne: false
});

// Virtual property for progress percentage
CampaignSchema.virtual('progressPercentage').get(function() {
  return Math.min(Math.round((this.currentAmount / this.targetAmount) * 100), 100);
});

// Virtual property for days remaining
CampaignSchema.virtual('daysRemaining').get(function() {
  const diffTime = this.endDate - Date.now();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Static method to get stats by category
CampaignSchema.statics.getCategoryStats = async function() {
  return await this.aggregate([
    {
      $match: { isActive: true }
    },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 },
        totalRaised: { $sum: '$currentAmount' },
        avgDonation: { $avg: '$averageDonation' }
      }
    },
    {
      $sort: { totalRaised: -1 }
    }
  ]);
};

// Static method to get total platform stats
CampaignSchema.statics.getPlatformStats = async function() {
  return await this.aggregate([
    {
      $group: {
        _id: null,
        totalCampaigns: { $sum: 1 },
        activeCampaigns: {
          $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] }
        },
        totalRaised: { $sum: '$currentAmount' },
        avgDonation: { $avg: '$averageDonation' }
      }
    }
  ]);
};

// Indexes for better query performance
CampaignSchema.index({ title: 'text', description: 'text' });
CampaignSchema.index({ isActive: 1, isFeatured: 1 });
CampaignSchema.index({ currentAmount: -1 });
CampaignSchema.index({ donationCount: -1 });
CampaignSchema.index({ endDate: 1 });

module.exports = mongoose.model('Campaign', CampaignSchema);