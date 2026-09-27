import React, { useState, useEffect } from 'react';
import {
  User,
  Phone,
  Mail,
  Wallet,
  ShieldCheck,
  Calendar,
  Lock,
  CheckCircle,
  FileText,
  AlertCircle,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { showSuccessAlert, showErrorAlert } from '../utils/alerts';
import { formatCurrency, formatDate, getPaymentMethodInfo } from '../utils/formatters';
import { ReceiptModal } from '../components/common/ReceiptModal';

export const ProfilePage = () => {
  const { user, refreshUser } = useAuth();

  const [myDeposits, setMyDeposits] = useState([]);
  const [totalDeposited, setTotalDeposited] = useState(0);
  const [loading, setLoading] = useState(true);

  // Edit profile state
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [password, setPassword] = useState('');
  const [updating, setUpdating] = useState(false);
  const [statusMsg, setStatusMsg] = useState({ type: '', text: '' });

  // Receipt Modal
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  useEffect(() => {
    fetchMyDeposits();
  }, []);

  const fetchMyDeposits = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/deposits/my-deposits');
      if (data.success) {
        setMyDeposits(data.deposits);
        setTotalDeposited(data.totalDeposited);
      }
    } catch (err) {
      console.error('Failed to load my deposits:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setStatusMsg({ type: '', text: '' });

    try {
      setUpdating(true);
      const payload = { name, phone, avatar };
      if (password) payload.password = password;

      const { data } = await api.put('/users/profile', payload);
      if (data.success) {
        setStatusMsg({ type: 'success', text: 'প্রোফাইল সফলভাবে আপডেট করা হয়েছে।' });
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
    <div className="space-y-6 pb-12">
      {/* Top Banner with Member Financial Overview */}
      <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 rounded-[6px] p-5 sm:p-7 text-white border border-gold-500/40 shadow-none relative overflow-hidden">
        <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-5 relative z-10">
          <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            {/* Strictly Round Profile Picture */}
            {user?.avatar ? (
              <img
                src={user.avatar}
                alt={user.name}
                className="w-18 h-18 sm:w-20 sm:h-20 rounded-full aspect-square object-cover ring-4 ring-gold-400 shadow-none"
              />
            ) : (
              <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-full aspect-square bg-gold-500 text-emerald-950 font-bold flex items-center justify-center text-3xl font-serif">
                {user?.name?.charAt(0) || 'U'}
              </div>
            )}
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-1.5 mb-1">
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-[4px] bg-emerald-800 text-gold-300 border border-gold-500/40">
                  {user?.role === 'admin' ? 'অ্যাডমিনিস্ট্রেটর' : 'সম্মানিত সদস্য'}
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-[4px] bg-emerald-700/80 text-white">
                  অনুমোদিত (Approved)
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">{user?.name}</h2>
              <p className="text-xs text-emerald-200 mt-0.5">
                {user?.phone} • {user?.email}
              </p>
            </div>
          </div>

          {/* Member Balance Card */}
          <div className="bg-emerald-900/80 p-4 rounded-[6px] border border-gold-500/40 text-center sm:text-right min-w-[180px]">
            <p className="text-xs text-gold-300 font-semibold uppercase tracking-wider">
              আপনার সর্বমোট জমা
            </p>
            <p className="text-2xl sm:text-3xl font-bold text-white font-sans mt-0.5">
              {formatCurrency(totalDeposited)}
            </p>
            <p className="text-[10px] text-emerald-300/80 mt-1">
              আল-বারাকাহ সোসাইটি আমানত
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Detailed Personal Deposit Statement */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Wallet className="w-4 h-4 text-emerald-800" />
                <span>আমার ব্যক্তিগত জমার স্টেটমেন্ট</span>
              </h3>
              <p className="text-[11px] text-slate-500 font-medium">
                আপনার নামে এ পর্যন্ত রেকর্ডকৃত সকল জমার বিবরণ ও রসিদ
              </p>
            </div>
            <span className="text-xs font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-[4px]">
              মোট কিস্তি: {myDeposits.length} টি
            </span>
          </div>

          {loading ? (
            <div className="bg-white rounded-[6px] p-12 text-center border border-slate-200 shadow-none">
              <div className="w-8 h-8 border-3 border-emerald-900 border-t-gold-500 rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-xs text-slate-500">স্টেটমেন্ট লোড হচ্ছে...</p>
            </div>
          ) : myDeposits.length === 0 ? (
            <div className="bg-white rounded-[6px] p-10 text-center border border-slate-200 shadow-none">
              <Wallet className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-bold text-slate-700">কোনো জমার তথ্য পাওয়া যায়নি</p>
              <p className="text-xs text-slate-500 mt-1">
                আপনার একাউন্টে এখনও কোনো জমার এন্ট্রি রেকর্ড করা হয়নি।
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-[6px] border border-slate-200 shadow-none overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      <th className="py-3 px-4">তারিখ</th>
                      <th className="py-3 px-4">পেমেন্ট মাধ্যম</th>
                      <th className="py-3 px-4">বিবরণ / নোট</th>
                      <th className="py-3 px-4 text-right">পরিমাণ (টাকা)</th>
                      <th className="py-3 px-4 text-center">রসিদ</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {myDeposits.map((item) => {
                      const method = getPaymentMethodInfo(item.paymentMethod);
                      return (
                        <tr key={item._id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-4 font-medium text-slate-600 whitespace-nowrap">
                            {formatDate(item.date)}
                          </td>
                          <td className="py-3 px-4 whitespace-nowrap">
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded-[4px] text-[11px] font-semibold border ${method.badgeClass}`}
                            >
                              {method.label}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-slate-600 max-w-[200px] truncate">
                            {item.note || item.trxId || '-'}
                          </td>
                          <td className="py-3 px-4 text-right font-bold text-emerald-900 font-sans whitespace-nowrap">
                            {formatCurrency(item.amount)}
                          </td>
                          <td className="py-3 px-4 text-center whitespace-nowrap">
                            <button
                              onClick={() => {
                                setSelectedReceipt(item);
                                setReceiptModalOpen(true);
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-[4px] text-xs font-semibold border border-emerald-200 transition-colors"
                            >
                              <FileText className="w-3.5 h-3.5 text-emerald-800" />
                              <span>রসিদ</span>
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Right 1 Col: Profile Information & Password Change */}
        <div className="bg-white rounded-[6px] p-5 border border-slate-200 shadow-none space-y-4 h-fit">
          <div className="border-b border-slate-100 pb-2.5">
            <h3 className="font-bold text-sm text-slate-900">প্রোফাইল আপডেট</h3>
            <p className="text-xs text-slate-500">আপনার ব্যক্তিগত তথ্য ও পাসওয়ার্ড পরিবর্তন</p>
          </div>

          {statusMsg.text && (
            <div
              className={`p-2.5 rounded-[6px] text-xs font-semibold flex items-center gap-2 ${
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
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-[6px] text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
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
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-[6px] text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                প্রোফাইল ছবি URL (ঐচ্ছিক)
              </label>
              <input
                type="url"
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                placeholder="https://..."
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-[6px] text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase mb-1">
                নতুন পাসওয়ার্ড (পরিবর্তন করতে চাইলে)
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="কমপক্ষে ৬ অক্ষর"
                className="w-full px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-[6px] text-xs text-slate-900 focus:outline-none focus:border-emerald-600 focus:bg-white"
              />
            </div>

            <button
              type="submit"
              disabled={updating}
              className="w-full py-2 px-4 bg-emerald-900 hover:bg-emerald-950 text-gold-300 font-bold text-xs rounded-[6px] shadow-none transition-all disabled:opacity-50"
            >
              {updating ? 'আপডেট হচ্ছে...' : 'তথ্য সংরক্ষণ করুন'}
            </button>
          </form>
        </div>
      </div>

      <ReceiptModal
        isOpen={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
        receiptData={selectedReceipt}
      />
    </div>
  );
};
