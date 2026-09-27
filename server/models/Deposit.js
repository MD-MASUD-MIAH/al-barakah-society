const mongoose = require('mongoose');

const depositSchema = new mongoose.Schema(
  {
    memberId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Member ID is required'],
      index: true,
    },
    amount: {
      type: Number,
      required: [true, 'Deposit amount is required'],
      min: [1, 'Amount must be greater than 0'],
    },
    paymentMethod: {
      type: String,
      enum: {
        values: ['cash', 'bkash', 'nagad', 'bank'],
        message: '{VALUE} is not a supported payment method',
      },
      required: [true, 'Payment method is required'],
    },
    trxId: {
      type: String,
      trim: true,
      default: '',
    },
    date: {
      type: Date,
      default: Date.now,
    },
    recordedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Admin who recorded this entry is required'],
    },
    note: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['verified', 'pending'],
      default: 'verified',
    },
  },
  {
    timestamps: true,
  }
);

// Static method to recalculate and sync member totalDeposited
depositSchema.statics.recalculateMemberTotal = async function (memberId) {
  try {
    const User = mongoose.model('User');
    const stats = await this.aggregate([
      {
        $match: {
          memberId: new mongoose.Types.ObjectId(memberId),
          status: 'verified',
        },
      },
      {
        $group: {
          _id: '$memberId',
          total: { $sum: '$amount' },
        },
      },
    ]);

    const totalAmount = stats.length > 0 ? stats[0].total : 0;

    await User.findByIdAndUpdate(memberId, {
      totalDeposited: Math.round(totalAmount * 100) / 100,
    });

    return totalAmount;
  } catch (error) {
    console.error('Error recalculating member total deposits:', error);
  }
};

// Post-save hook to keep User.totalDeposited automatically updated
depositSchema.post('save', async function () {
  await this.constructor.recalculateMemberTotal(this.memberId);
});

// Post-remove/post-delete hook to update User.totalDeposited
depositSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await doc.constructor.recalculateMemberTotal(doc.memberId);
  }
});

module.exports = mongoose.model('Deposit', depositSchema);
