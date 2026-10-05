const User = require('../models/User');
const Deposit = require('../models/Deposit');

// @desc    Get all users (Filterable by status, role, search)
// @route   GET /api/users
// @access  Private (Admin only)
exports.getAllUsers = async (req, res) => {
  try {
    const { status, role, search } = req.query;
    const query = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (role && role !== 'all') {
      query.role = role;
    }

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [{ name: searchRegex }, { email: searchRegex }, { phone: searchRegex }];
    }

    const users = await User.find(query).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'ব্যবহারকারীদের তালিকা লোড করা যায়নি (Failed to load users).',
      error: error.message,
    });
  }
};

// @desc    Get pending approval requests
// @route   GET /api/users/pending
// @access  Private (Admin only)
exports.getPendingUsers = async (req, res) => {
  try {
    const pendingUsers = await User.find({
      status: { $in: ['pending', 'not_applied'] },
      role: { $ne: 'admin' },
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: pendingUsers.length,
      users: pendingUsers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'অনুমোদনের তালিকা লোড করা যায়নি (Failed to load pending users).',
      error: error.message,
    });
  }
};

// @desc    Get list of all approved members (for deposit dropdown & directory)
// @route   GET /api/users/approved
// @access  Private (Approved Members & Admin)
exports.getApprovedMembers = async (req, res) => {
  try {
    const approvedMembers = await User.find({ status: 'approved' })
      .select('name email phone avatar totalDeposited role createdAt membershipDetails')
      .sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: approvedMembers.length,
      users: approvedMembers,
      members: approvedMembers,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'সদস্যদের তালিকা লোড করা যায়নি (Failed to load approved members).',
      error: error.message,
    });
  }
};

// @desc    Approve a pending user
// @route   PUT /api/users/:id/approve
// @access  Private (Admin only)
exports.approveUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'ব্যবহারকারী খুঁজে পাওয়া যায়নি (User not found).',
      });
    }

    user.status = 'approved';
    if (user.role !== 'admin') {
      user.role = 'member';
    }
    await user.save();

    res.status(200).json({
      success: true,
      message: `সদস্য "${user.name}" সফলভাবে অনুমোদিত হয়েছে (User approved successfully).`,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'অনুমোদন করতে সমস্যা হয়েছে (Failed to approve user).',
      error: error.message,
    });
  }
};

// @desc    Reject a pending user
// @route   PUT /api/users/:id/reject
// @access  Private (Admin only)
exports.rejectUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'ব্যবহারকারী খুঁজে পাওয়া যায়নি (User not found).',
      });
    }

    user.status = 'rejected';
    await user.save();

    res.status(200).json({
      success: true,
      message: `সদস্য "${user.name}" এর আবেদন বাতিল করা হয়েছে (User request rejected).`,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'আবেদন বাতিল করতে সমস্যা হয়েছে (Failed to reject user).',
      error: error.message,
    });
  }
};

// @desc    Update user role or status (Admin only)
// @route   PATCH /api/users/:id/manage
// @access  Private (Admin only)
exports.updateUserRoleOrStatus = async (req, res) => {
  try {
    const { role, status } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'ব্যবহারকারী খুঁজে পাওয়া যায়নি (User not found).',
      });
    }

    // Prevent admin from removing their own admin role
    if (user._id.toString() === req.user._id.toString() && role && role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'আপনি নিজের অ্যাডমিন পদবী পরিবর্তন করতে পারবেন না (Cannot revoke your own admin role).',
      });
    }

    if (role && ['member', 'admin'].includes(role)) {
      user.role = role;
    }

    if (status && ['pending', 'approved', 'rejected', 'suspended'].includes(status)) {
      user.status = status;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'সদস্যের তথ্য সফলভাবে হালনাগাদ করা হয়েছে (User updated successfully).',
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'তথ্য হালনাগাদ করতে সমস্যা হয়েছে (Failed to update user).',
      error: error.message,
    });
  }
};

// @desc    Delete user account (Admin only)
// @route   DELETE /api/users/:id
// @access  Private (Admin only)
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'ব্যবহারকারী খুঁজে পাওয়া যায়নি (User not found).',
      });
    }

    // Prevent admin from deleting themselves
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({
        success: false,
        message: 'আপনি নিজের অ্যাকাউন্ট মুছতে পারবেন না (Cannot delete your own account).',
      });
    }

    // Remove user and any associated deposits
    await Deposit.deleteMany({ memberId: user._id });
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: `"${user.name}" অ্যাকাউন্ট ও সংশ্লিষ্ট তথ্য সম্পূর্ণ মুছে ফেলা হয়েছে (User deleted successfully).`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'অ্যাকাউন্ট মুছতে সমস্যা হয়েছে (Failed to delete user).',
      error: error.message,
    });
  }
};

// @desc    Update current user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone, avatar, password } = req.body;
    const user = await User.findById(req.user._id).select('+password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'ব্যবহারকারী পাওয়া যায়নি (User not found).',
      });
    }

    if (name) user.name = name.trim();
    if (phone) user.phone = phone.trim();
    if (avatar !== undefined) user.avatar = avatar;
    if (password && password.length >= 6) {
      user.password = password;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: 'প্রোফাইল সফলভাবে আপডেট করা হয়েছে (Profile updated successfully).',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        status: user.status,
        membershipDetails: user.membershipDetails,
        totalDeposited: user.totalDeposited,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'প্রোফাইল আপডেট করা যায়নি (Failed to update profile).',
      error: error.message,
    });
  }
};

// @desc    Apply for membership
// @route   POST /api/users/apply-membership
// @access  Private (Registered User)
exports.applyMembership = async (req, res) => {
  try {
    const {
      formNo,
      admissionDate,
      name,
      phone,
      avatar,
      nid,
      fatherOrHusbandName,
      motherName,
      dob,
      nationality,
      religion,
      occupation,
      permanentVillage,
      permanentPost,
      permanentUpazila,
      permanentDistrict,
      permanentAddress,
      currentAddress,
      gender,
      maritalStatus,
      education,
      email,
      bloodGroup,
      nomineeName,
      nomineeFatherName,
      nomineeUpazila,
      nomineeDistrict,
      nomineeRelation,
      nomineePhone,
      nomineeNid,
      monthlyPledge,
      joinReason,
      applicantSignature,
    } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'ব্যবহারকারী খুঁজে পাওয়া যায়নি (User not found).',
      });
    }

    if (user.status === 'approved') {
      return res.status(400).json({
        success: false,
        message: 'আপনি ইতিমধ্যে একজন অনুমোদিত সদস্য (You are already an approved member).',
      });
    }

    // Update user basic profile if provided
    if (name && name.trim()) user.name = name.trim();
    if (phone && phone.trim()) user.phone = phone.trim();
    if (avatar && avatar.trim()) user.avatar = avatar.trim();

    user.status = 'pending';
    user.membershipDetails = {
      formNo: formNo || `ABS-${Date.now().toString().slice(-6)}`,
      admissionDate: admissionDate || new Date().toISOString().split('T')[0],
      nid: nid || '',
      fatherOrHusbandName: fatherOrHusbandName || '',
      motherName: motherName || '',
      dob: dob || '',
      nationality: nationality || 'বাংলাদেশী',
      religion: religion || 'ইসলাম',
      occupation: occupation || '',
      permanentVillage: permanentVillage || '',
      permanentPost: permanentPost || '',
      permanentUpazila: permanentUpazila || '',
      permanentDistrict: permanentDistrict || '',
      permanentAddress:
        permanentAddress ||
        (permanentVillage
          ? `গ্রাম: ${permanentVillage}, ডাকঘর: ${permanentPost || ''}, উপজেলা: ${permanentUpazila || ''}, জেলা: ${permanentDistrict || ''}`
          : ''),
      currentAddress: currentAddress || '',
      gender: gender || '',
      maritalStatus: maritalStatus || '',
      education: education || '',
      email: email || user.email || '',
      phone: phone || user.phone || '',
      bloodGroup: bloodGroup || '',
      nomineeName: nomineeName || '',
      nomineeFatherName: nomineeFatherName || '',
      nomineeUpazila: nomineeUpazila || '',
      nomineeDistrict: nomineeDistrict || '',
      nomineeRelation: nomineeRelation || '',
      nomineePhone: nomineePhone || '',
      nomineeNid: nomineeNid || '',
      monthlyPledge: Number(monthlyPledge) || 0,
      joinReason: joinReason || '',
      applicantSignature: applicantSignature || user.name,
      appliedAt: new Date(),
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: 'আপনার সদস্যপদ আবেদনটি সফলভাবে জমা হয়েছে! অ্যাডমিন অনুমোদনের পর সম্পূর্ণ সোসাইটি সুবিধা পাবেন।',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        status: user.status,
        membershipDetails: user.membershipDetails,
        totalDeposited: user.totalDeposited,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'সদস্যপদ আবেদন জমা করতে ব্যর্থ হয়েছে (Failed to submit membership application).',
      error: error.message,
    });
  }
};

