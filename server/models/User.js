const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide full name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
    },
    phone: {
      type: String,
      required: [true, 'Please provide phone number'],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide password'],
      minlength: [6, 'Password must be at least 6 characters long'],
      select: false, // Don't return password by default
    },
    avatar: {
      type: String,
      default: '',
    },
    role: {
      type: String,
      enum: ['user', 'member', 'admin'],
      default: 'user',
    },
    status: {
      type: String,
      enum: ['not_applied', 'pending', 'approved', 'rejected', 'suspended'],
      default: 'not_applied',
    },
    membershipDetails: {
      nid: { type: String, default: '' },
      fatherOrHusbandName: { type: String, default: '' },
      currentAddress: { type: String, default: '' },
      permanentAddress: { type: String, default: '' },
      occupation: { type: String, default: '' },
      monthlyPledge: { type: Number, default: 0 },
      nomineeName: { type: String, default: '' },
      nomineeRelation: { type: String, default: '' },
      nomineePhone: { type: String, default: '' },
      joinReason: { type: String, default: '' },
      appliedAt: { type: Date },
    },
    totalDeposited: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Encrypt password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
