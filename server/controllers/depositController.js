const Deposit = require('../models/Deposit');
const User = require('../models/User');

// @desc    Get dashboard statistics (Total society balance, active members, this month's collection)
// @route   GET /api/deposits/stats
// @access  Private (Approved Members and Admins)
exports.getStats = async (req, res) => {
  try {
    // 1. Total Society Balance (verified deposits)
    const totalBalanceAgg = await Deposit.aggregate([
      { $match: { status: 'verified' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalBalance = totalBalanceAgg.length > 0 ? totalBalanceAgg[0].total : 0;

    // 2. Total Active Members (approved)
    const activeMembersCount = await User.countDocuments({ status: 'approved' });

    // 3. Total Pending Approvals (for admin indicator)
    const pendingMembersCount = await User.countDocuments({
      status: { $in: ['pending', 'not_applied'] },
      role: { $ne: 'admin' },
    });

    // 4. This Month's Collection
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

    const thisMonthAgg = await Deposit.aggregate([
      {
        $match: {
          status: 'verified',
          date: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const thisMonthTotal = thisMonthAgg.length > 0 ? thisMonthAgg[0].total : 0;

    // 5. Monthly breakdown for past 6 months (for charts/trends)
    const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const monthlyTrend = await Deposit.aggregate([
      {
        $match: {
          status: 'verified',
          date: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
          },
          total: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // 6. Top contributors / Leaderboard
    const topMembers = await User.find({ status: 'approved' })
      .sort({ totalDeposited: -1 })
      .limit(5)
      .select('name email phone avatar totalDeposited role');

    res.status(200).json({
      success: true,
      stats: {
        totalBalance,
        activeMembersCount,
        pendingMembersCount,
        thisMonthTotal,
        monthlyTrend,
        topMembers,
      },
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({
      success: false,
      message: 'পরিসংখ্যান লোড করা যায়নি (Failed to load statistics).',
      error: error.message,
    });
  }
};

// @desc    Get all ledger deposits (Filterable by member, method, date, search)
// @route   GET /api/deposits
// @access  Private (Approved Members & Admin)
exports.getAllDeposits = async (req, res) => {
  try {
    const { memberId, paymentMethod, startDate, endDate, search, page = 1, limit = 50 } = req.query;

    const query = {};

    // If regular member requests deposits, they can see all or their own, but let's allow query filter
    if (memberId) {
      query.memberId = memberId;
    }

    if (paymentMethod && paymentMethod !== 'all') {
      query.paymentMethod = paymentMethod;
    }

    if (startDate || endDate) {
      query.date = {};
      if (startDate) {
        query.date.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.date.$lte = end;
      }
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);

    let deposits = await Deposit.find(query)
      .populate('memberId', 'name email phone avatar totalDeposited')
      .populate('recordedBy', 'name role')
      .sort({ date: -1, createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    // Optional text filter on member name or trxId
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      deposits = deposits.filter((dep) => {
        const memberName = dep.memberId?.name || '';
        const memberPhone = dep.memberId?.phone || '';
        const trx = dep.trxId || '';
        const note = dep.note || '';
        return (
          searchRegex.test(memberName) ||
          searchRegex.test(memberPhone) ||
          searchRegex.test(trx) ||
          searchRegex.test(note)
        );
      });
    }

    const totalCount = await Deposit.countDocuments(query);

    res.status(200).json({
      success: true,
      count: deposits.length,
      totalCount,
      totalPages: Math.ceil(totalCount / parseInt(limit)),
      currentPage: parseInt(page),
      deposits,
    });
  } catch (error) {
    console.error('Error fetching deposits:', error);
    res.status(500).json({
      success: false,
      message: 'জমার তালিকা লোড করা যায়নি (Failed to load deposits).',
      error: error.message,
    });
  }
};

// @desc    Get deposits of current logged-in member
// @route   GET /api/deposits/my-deposits
// @access  Private (Approved Member)
exports.getMyDeposits = async (req, res) => {
  try {
    const deposits = await Deposit.find({ memberId: req.user._id })
      .populate('recordedBy', 'name')
      .sort({ date: -1 });

    const total = deposits.reduce((sum, item) => sum + (item.status === 'verified' ? item.amount : 0), 0);

    res.status(200).json({
      success: true,
      count: deposits.length,
      totalDeposited: total,
      deposits,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'আপনার ব্যক্তিগত জমার বিবরণ লোড করা যায়নি (Failed to load personal deposits).',
      error: error.message,
    });
  }
};

// @desc    Create / Record a deposit for a member
// @route   POST /api/deposits
// @access  Private (Admin only)
exports.createDeposit = async (req, res) => {
  try {
    const { memberId, amount, paymentMethod, trxId, date, note, status } = req.body;

    if (!memberId || !amount || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: 'সদস্য, জমার পরিমাণ এবং পেমেন্ট মাধ্যম আবশ্যক (Member, amount, and payment method are required).',
      });
    }

    const member = await User.findById(memberId);
    if (!member) {
      return res.status(404).json({
        success: false,
        message: 'নির্দিষ্ট সদস্য খুঁজে পাওয়া যায়নি (Member not found).',
      });
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({
        success: false,
        message: 'সঠিক জমার পরিমাণ দিন (Amount must be a positive number).',
      });
    }

    const newDeposit = await Deposit.create({
      memberId,
      amount: parsedAmount,
      paymentMethod,
      trxId: trxId ? trxId.trim() : '',
      date: date ? new Date(date) : new Date(),
      recordedBy: req.user._id,
      note: note ? note.trim() : '',
      status: status || 'verified',
    });

    const populatedDeposit = await Deposit.findById(newDeposit._id)
      .populate('memberId', 'name email phone avatar totalDeposited')
      .populate('recordedBy', 'name role');

    res.status(201).json({
      success: true,
      message: 'জমার এন্ট্রি সফলভাবে সংরক্ষণ করা হয়েছে (Deposit recorded successfully).',
      deposit: populatedDeposit,
    });
  } catch (error) {
    console.error('Error creating deposit:', error);
    res.status(500).json({
      success: false,
      message: 'জমা সংরক্ষণ করতে সমস্যা হয়েছে (Failed to record deposit).',
      error: error.message,
    });
  }
};

// @desc    Delete a deposit entry
// @route   DELETE /api/deposits/:id
// @access  Private (Admin only)
exports.deleteDeposit = async (req, res) => {
  try {
    const deposit = await Deposit.findById(req.params.id);

    if (!deposit) {
      return res.status(404).json({
        success: false,
        message: 'জমার এন্ট্রি পাওয়া যায়নি (Deposit not found).',
      });
    }

    const memberId = deposit.memberId;
    await Deposit.findByIdAndDelete(req.params.id);

    // Recalculate member total balance
    await Deposit.recalculateMemberTotal(memberId);

    res.status(200).json({
      success: true,
      message: 'জমার এন্ট্রি মুছে ফেলা হয়েছে এবং ব্যালেন্স আপডেট হয়েছে (Deposit deleted and balance updated).',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'জমার এন্ট্রি মুছতে সমস্যা হয়েছে (Failed to delete deposit).',
      error: error.message,
    });
  }
};

// @desc    Get single deposit receipt details
// @route   GET /api/deposits/:id/receipt
// @access  Private (Approved Members & Admin)
exports.getReceipt = async (req, res) => {
  try {
    const deposit = await Deposit.findById(req.params.id)
      .populate('memberId', 'name email phone totalDeposited')
      .populate('recordedBy', 'name role');

    if (!deposit) {
      return res.status(404).json({
        success: false,
        message: 'রসিদের তথ্য পাওয়া যায়নি (Receipt not found).',
      });
    }

    // Only allow admin or the member who owns this deposit
    if (
      req.user.role !== 'admin' &&
      deposit.memberId._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: 'অননুমোদিত রসিদ অনুরোধ (Unauthorized receipt request).',
      });
    }

    res.status(200).json({
      success: true,
      receipt: {
        receiptNumber: `ABS-${deposit._id.toString().slice(-8).toUpperCase()}`,
        societyName: 'আল-বারাকাহ সোসাইটি (Al-Barakah Society)',
        slogan: 'বিশ্বাসের বন্ধন',
        depositId: deposit._id,
        date: deposit.date,
        amount: deposit.amount,
        paymentMethod: deposit.paymentMethod,
        trxId: deposit.trxId,
        note: deposit.note,
        status: deposit.status,
        member: {
          name: deposit.memberId.name,
          phone: deposit.memberId.phone,
          email: deposit.memberId.email,
          totalDeposited: deposit.memberId.totalDeposited,
        },
        recordedBy: deposit.recordedBy?.name || 'Administrator',
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'রসিদ লোড করা যায়নি (Failed to load receipt).',
      error: error.message,
    });
  }
};
