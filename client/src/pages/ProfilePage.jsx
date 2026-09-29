import React, { useState, useEffect, useRef } from 'react';
import {
  Phone,
  Mail,
  Wallet,
  CheckCircle,
  AlertCircle,
  Camera,
  ChevronRight,
  Shield,
  CreditCard,
  Calendar,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { showSuccessAlert, showErrorAlert } from '../utils/alerts';
import { formatCurrency, formatDate } from '../utils/formatters';
import { ReceiptModal } from '../components/common/ReceiptModal';
import { TransactionDrawerModal } from '../components/common/TransactionDrawerModal';
import { compressImage } from '../utils/imageUpload';

export const ProfilePage = () => {
  const { user, refreshUser } = useAuth();

  const [myDeposits, setMyDeposits] = useState([]);
  const [totalDeposited, setTotalDeposited] = useState(0);
  const [_loading, setLoading] = useState(true);

  // Edit profile state
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [password, setPassword] = useState('');
  const [updating, setUpdating] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  // Modals
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // File input ref for direct avatar upload
  const avatarInputRef = useRef(null);

  useEffect(() => {
    fetchMyDeposits();
  }, []);

  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  const fetchMyDeposits = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/deposits/my-deposits');
      if (data.success) {
        setMyDeposits(data.deposits || []);
        setTotalDeposited(data.totalDeposited || 0);
      }
    } catch (err) {
      console.error('Failed to load my deposits:', err);
    } finally {
      setLoading(false);
    }
  };

  // Direct avatar file selection & instant update
  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingAvatar(true);
      const compressedBase64 = await compressImage(file, {
        maxWidth: 400,
        maxHeight: 400,
        quality: 0.85,
      });

      const { data } = await api.put('/users/profile', { avatar: compressedBase64 });
      if (data.success) {
        refreshUser();
        showSuccessAlert('ছবি সফলভাবে আপডেট হয়েছে', '');
      }
    } catch (err) {
      showErrorAlert('ব্যর্থ হয়েছে', err.message || 'ছবি আপলোড করা যায়নি');
    } finally {
      setUploadingAvatar(false);
      if (avatarInputRef.current) {
        avatarInputRef.current.value = '';
      }
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setStatusMsg({ type: '', text: '' });

    try {
      setUpdating(true);
      const payload = { name, phone };
      if (password) payload.password = password;

      const { data } = await api.put('/users/profile', payload);
      if (data.success) {
        setStatusMsg({ type: 'success', text: 'প্রোফাইল তথ্য সফলভাবে সংরক্ষিত হয়েছে।' });
        setPassword('');
        await showSuccessAlert('আপডেট সম্পন্ন', 'আপনার প্রোফাইল তথ্য সফলভাবে সংরক্ষণ করা হয়েছে।');
        refreshUser();
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'প্রোফাইল আপডেট করতে সমস্যা হয়েছে।';
      setStatusMsg({
        type: 'error',
        text: msg,
      });
      showErrorAlert('ব্যর্থ হয়েছে', msg);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Hidden file input for direct avatar upload */}
      <input
        ref={avatarInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleAvatarChange}
      />

      {/* Top Banner with Member Financial Overview */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 rounded-xl p-5 sm:p-7 text-white border border-gold-500/30 shadow-sm relative overflow-hidden">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-5 relative z-10">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            {/* Minimal Avatar with Icon-only Camera button & Hover Active State */}
            <div className="relative group shrink-0">
              <div
                onClick={() => !uploadingAvatar && avatarInputRef.current?.click()}
                className="w-20 h-20 sm:w-22 sm:h-22 rounded-full aspect-square ring-4 ring-gold-400/80 overflow-hidden cursor-pointer bg-gold-500 text-emerald-950 font-bold flex items-center justify-center text-3xl font-serif shadow-md transition-transform group-hover:scale-102"
                title="ছবি পরিবর্তন করুন"
              >
                {uploadingAvatar ? (
                  <div className="w-full h-full bg-slate-900/60 flex items-center justify-center">
                    <div className="w-6 h-6 border-2 border-white border-t-gold-400 rounded-full animate-spin" />
                  </div>
                ) : user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full object-cover transition-opacity group-hover:opacity-85"
                  />
                ) : (
                  user?.name?.charAt(0) || 'U'
                )}

                {/* Hover camera overlay */}
                <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
                  <Camera className="w-6 h-6 text-gold-300 drop-shadow" />
                </div>
              </div>

              {/* Floating Camera Button badge (Hover / Tap active) */}
              <button
                type="button"
                onClick={() => !uploadingAvatar && avatarInputRef.current?.click()}
                className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-emerald-800 hover:bg-emerald-700 text-gold-300 ring-2 ring-white shadow-md flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer z-10"
                title="ছবি পরিবর্তন"
                aria-label="ছবি পরিবর্তন"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Member Details */}
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1.5 flex-wrap">
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-800 text-gold-300 border border-gold-500/40">
                  {user?.role === 'admin' ? 'অ্যাডমিনিস্ট্রেটর' : 'সোসাইটি সদস্য'}
                </span>
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-700/60 text-emerald-100">
                  যাচাইকৃত একাউন্ট
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
                {user?.name}
              </h2>
              <div className="flex items-center justify-center sm:justify-start gap-3 text-xs text-emerald-200/90 mt-1 flex-wrap">
                {user?.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-gold-400" />
                    {user.phone}
                  </span>
                )}
                {user?.email && (
                  <span className="flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-gold-400" />
                    {user.email}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Interactive Total Balance Card (Triggers Transaction Modal) */}
          <div
            onClick={() => setDrawerOpen(true)}
            className="group relative cursor-pointer bg-white/10 hover:bg-white/15 p-4 sm:p-5 rounded-xl border border-gold-400/40 hover:border-gold-400 text-center sm:text-right transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg min-w-[220px]"
            title="লেনদেন বিবরণী দেখতে ক্লিক করুন"
          >
            <div className="flex items-center justify-center sm:justify-end gap-1.5 text-xs text-gold-300 font-semibold tracking-wide">
              <Wallet className="w-3.5 h-3.5 text-gold-400" />
              <span>মোট ব্যালেন্স</span>
            </div>
            <p className="text-2xl sm:text-3xl font-bold text-white font-sans mt-1">
              {formatCurrency(totalDeposited)}
            </p>
            <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold-400/20 text-gold-200 text-[11px] font-semibold group-hover:bg-gold-400 group-hover:text-emerald-950 transition-colors">
              <span>লেনদেন ইতিহাস দেখুন</span>
              <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>
        </div>
      </div>

      {/* Clean 2-Column Layout: Account Overview & Profile Settings (No cluttered inline transaction table) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Account Details & Quick Transaction Trigger */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900">অ্যাকাউন্ট ওভারভিউ</h3>
              <p className="text-xs text-slate-500">আপনার সদস্যপদ ও তহবিলের বিবরণ</p>
            </div>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/60">
              সক্রিয় সদস্য
            </span>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between py-2 border-b border-slate-50">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-slate-400" />
                মেম্বার রোল
              </span>
              <span className="font-semibold text-slate-900 capitalize">
                {user?.role === 'admin' ? 'অ্যাডমিনিস্ট্রেটর' : 'সাধারণ সদস্য'}
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-50">
              <span className="text-slate-500 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-slate-400" />
                মোট জমা কিস্তি
              </span>
              <span className="font-bold text-slate-900 font-sans">
                {myDeposits.length} টি
              </span>
            </div>

            <div className="flex items-center justify-between py-2 border-b border-slate-50">
              <span className="text-slate-500 flex items-center gap-1.5">
                <Wallet className="w-3.5 h-3.5 text-slate-400" />
                সর্বমোট সঞ্চিত ফান্ড
              </span>
              <span className="font-bold text-emerald-850 font-sans text-sm">
                {formatCurrency(totalDeposited)}
              </span>
            </div>

            {user?.createdAt && (
              <div className="flex items-center justify-between py-2">
                <span className="text-slate-500 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  নিবন্ধন তারিখ
                </span>
                <span className="font-medium text-slate-700">
                  {formatDate(user.createdAt)}
                </span>
              </div>
            )}
          </div>

          {/* Quick Button to open Transaction History Modal */}
          <div className="pt-2">
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              className="w-full py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 font-bold text-xs rounded-lg border border-emerald-200 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-2xs"
            >
              <Wallet className="w-4 h-4 text-emerald-800" />
              <span>আমার সকল লেনদেন দেখুন ({myDeposits.length})</span>
              <ChevronRight className="w-3.5 h-3.5 text-emerald-700" />
            </button>
          </div>
        </div>

        {/* Profile Settings & Password Change Form */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-2xs space-y-4">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="font-bold text-sm text-slate-900">প্রোফাইল তথ্য আপডেট</h3>
            <p className="text-xs text-slate-500">নাম, মোবাইল নম্বর ও পাসওয়ার্ড পরিবর্তন</p>
          </div>

          {statusMsg.text && (
            <div
              className={`p-2.5 rounded-lg text-xs font-semibold flex items-center gap-2 ${
                statusMsg.type === 'success'
                  ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {statusMsg.type === 'success' ? (
                <CheckCircle className="w-4 h-4 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 shrink-0" />
              )}
              <span>{statusMsg.text}</span>
            </div>
          )}

          <form onSubmit={handleUpdateProfile} className="space-y-3.5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                পূর্ণ নাম
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                মোবাইল নম্বর
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                নতুন পাসওয়ার্ড
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="পরিবর্তন না করতে চাইলে ফাঁকা রাখুন"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white transition-colors"
              />
            </div>

            <button
              type="submit"
              disabled={updating}
              className="w-full py-2.5 px-4 bg-emerald-900 hover:bg-emerald-950 text-gold-300 font-bold text-xs rounded-lg shadow-xs transition-all disabled:opacity-50 cursor-pointer"
            >
              {updating ? 'সংরক্ষণ হচ্ছে...' : 'তথ্য সংরক্ষণ করুন'}
            </button>
          </form>
        </div>
      </div>

      {/* Transaction Slide-over Drawer / Modal (Opened when clicking total balance or button) */}
      <TransactionDrawerModal
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        deposits={myDeposits}
        totalBalance={totalDeposited}
        userName={user?.name}
        onViewReceipt={(receipt) => {
          setSelectedReceipt(receipt);
          setReceiptModalOpen(true);
        }}
      />

      {/* Receipt Modal */}
      <ReceiptModal
        isOpen={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
        receiptData={selectedReceipt}
      />
    </div>
  );
};
