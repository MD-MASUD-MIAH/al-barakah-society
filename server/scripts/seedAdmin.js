const dns = require('dns');
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const User = require('../models/User');
const Deposit = require('../models/Deposit');
const Message = require('../models/Message');

const seedData = async () => {
  try {
    console.log('Connecting to database for seeding...');
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log('✅ Connected to MongoDB.');

    // Clear existing data
    await User.deleteMany({});
    await Deposit.deleteMany({});
    await Message.deleteMany({});
    console.log('🧹 Existing collections cleared.');

    // 1. Create Admin
    const admin = await User.create({
      name: 'মুফতি হাফিজুর রহমান (অ্যাডমিন)',
      email: 'admin@albarakah.org',
      phone: '01711000001',
      password: 'password123',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      role: 'admin',
      status: 'approved',
      totalDeposited: 0,
    });
    console.log(`👤 Admin created: ${admin.email} (Password: password123)`);

    // 2. Create Approved Members
    const member1 = await User.create({
      name: 'আব্দুল্লাহ আল মামুন',
      email: 'mamun@albarakah.org',
      phone: '01811000002',
      password: 'password123',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
      role: 'member',
      status: 'approved',
      totalDeposited: 0,
    });

    const member2 = await User.create({
      name: 'মো. তারিকুল ইসলাম',
      email: 'tarik@albarakah.org',
      phone: '01911000003',
      password: 'password123',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      role: 'member',
      status: 'approved',
      totalDeposited: 0,
    });

    const member3 = await User.create({
      name: 'মাওলানা কামরুল হাসান',
      email: 'kamrul@albarakah.org',
      phone: '01611000004',
      password: 'password123',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
      role: 'member',
      status: 'approved',
      totalDeposited: 0,
    });

    const member4 = await User.create({
      name: 'ড. তানভীর আহমেদ',
      email: 'tanvir@albarakah.org',
      phone: '01511000005',
      password: 'password123',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      role: 'member',
      status: 'approved',
      totalDeposited: 0,
    });

    // 3. Create Pending Members (to test Admin Approval Request flow)
    const pending1 = await User.create({
      name: 'মুহাম্মদ সাকিব মাহমুদ',
      email: 'sakib@example.com',
      phone: '01722000006',
      password: 'password123',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
      role: 'member',
      status: 'pending',
      totalDeposited: 0,
    });

    const pending2 = await User.create({
      name: 'নাজমুল হোসেন রনি',
      email: 'nazmul@example.com',
      phone: '01822000007',
      password: 'password123',
      avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
      role: 'member',
      status: 'pending',
      totalDeposited: 0,
    });
    console.log('⏳ 2 Pending registration requests created.');

    // 4. Create Deposits
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 15);
    const thisMonth1 = new Date(now.getFullYear(), now.getMonth(), 5);
    const thisMonth2 = new Date(now.getFullYear(), now.getMonth(), 12);
    const thisMonth3 = new Date(now.getFullYear(), now.getMonth(), 20);

    const deposits = [
      {
        memberId: member1._id,
        amount: 5000,
        paymentMethod: 'bkash',
        trxId: 'BK9A87X10Z',
        date: lastMonth,
        recordedBy: admin._id,
        note: 'মাসিক সঞ্চয় ফি (পূর্ববর্তী মাস)',
        status: 'verified',
      },
      {
        memberId: member1._id,
        amount: 5000,
        paymentMethod: 'bank',
        trxId: 'IBBL-9923847',
        date: thisMonth1,
        recordedBy: admin._id,
        note: 'চলতি মাসের নিয়মিত কিস্তি',
        status: 'verified',
      },
      {
        memberId: member2._id,
        amount: 10000,
        paymentMethod: 'bank',
        trxId: 'DBBL-8847120',
        date: thisMonth2,
        recordedBy: admin._id,
        note: 'সোসাইটি কল্যাণ তহবিলে এককালীন অনুদান',
        status: 'verified',
      },
      {
        memberId: member3._id,
        amount: 4000,
        paymentMethod: 'nagad',
        trxId: 'NGD-4412903',
        date: thisMonth1,
        recordedBy: admin._id,
        note: 'মাসিক চাঁদা',
        status: 'verified',
      },
      {
        memberId: member4._id,
        amount: 8000,
        paymentMethod: 'cash',
        trxId: 'CASH-REC-001',
        date: thisMonth3,
        recordedBy: admin._id,
        note: 'অফিস ক্যাশে জমা প্রদান',
        status: 'verified',
      },
    ];

    for (const dep of deposits) {
      await Deposit.create(dep);
    }
    console.log('💰 Sample deposits recorded and member totals updated.');

    // 5. Create Community Messages
    await Message.create({
      senderId: admin._id,
      senderName: admin.name,
      senderRole: 'admin',
      senderAvatar: admin.avatar,
      message: 'আসসালামু আলাইকুম। আল-বারাকাহ সোসাইটির সকল সম্মানিত সদস্যকে স্বাগতম। প্রতি মাসের ১০ তারিখের মধ্যে আপনাদের সঞ্চয় জমা প্রদানের অনুরোধ রইল।',
      isNotice: true,
    });

    await Message.create({
      senderId: member1._id,
      senderName: member1.name,
      senderRole: 'member',
      senderAvatar: member1.avatar,
      message: 'ওয়ালাইকুম আসসালাম। চমৎকার উদ্যোগ! ব্যাংক ট্রান্সফারের মাধ্যমে আমি চলতি মাসের জমা সম্পন্ন করেছি।',
      isNotice: false,
    });

    await Message.create({
      senderId: member2._id,
      senderName: member2.name,
      senderRole: 'member',
      senderAvatar: member2.avatar,
      message: 'মাশাআল্লাহ! আল-বারাকাহ সোসাইটি আমাদের পারস্পরিক বিশ্বাসের বন্ধন সুদৃঢ় করবে ইনশাআল্লাহ।',
      isNotice: false,
    });

    console.log('💬 Community messages initialized.');
    console.log('✨ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedData();
