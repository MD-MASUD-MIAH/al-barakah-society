import React, { useState, useEffect } from 'react';
import { PlusCircle, ArrowLeft, Check, Smartphone, Landmark, Banknote } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { showSuccessAlert, showErrorAlert } from '../utils/alerts';
import { formatCurrency } from '../utils/formatters';

export const AddDepositPage = () => {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    memberId: '',
    amount: '',
    paymentMethod: 'bkash',
    trxId: '',
    date: new Date().toISOString().split('T')[0],
    note: '',
  });

  useEffect(() => {
    fetchApprovedMembers();
  }, []);

  const fetchApprovedMembers = async () => {
    try {
      setLoadingMembers(true);
      const res = await api.get('/users/approved');
      const list = res.data.members || res.data.users || [];
      if (res.data.success && list.length > 0) {
        setMembers(list);
        setFormData((prev) => ({ ...prev, memberId: list[0]._id }));
      }
    } catch (err) {
      console.error('Failed to load approved members:', err);
    } finally {
      setLoadingMembers(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.memberId || !formData.amount || Number(formData.amount) <= 0) {
      showErrorAlert('সতর্কতা', 'সঠিক সদস্য ও জমার পরিমাণ প্রদান করুন।');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.post('/deposits', {
        ...formData,
        amount: Number(formData.amount),
      });

      if (res.data.success) {
        await showSuccessAlert(
          'জমা সফল হয়েছে!',
          `${formatCurrency(formData.amount)} টাকা তহবিলে যুক্ত হয়েছে।`
        );
        navigate('/ledger');
      }
    } catch (err) {
      showErrorAlert('ব্যর্থ হয়েছে', err.response?.data?.message || 'জমা রেকর্ড করতে ব্যর্থ হয়েছে।');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedMember = members.find((m) => m._id === formData.memberId);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            নতুন জমা রেকর্ড ফরম (Add Deposit Entry)
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            সদস্যের সঞ্চয় তহবিলে নতুন আর্থিক এন্ট্রি যুক্ত করুন
          </p>
        </div>
        <Link
          to="/dashboard"
          className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-semibold rounded-[6px] border border-emerald-700 transition-all shadow-sm self-start sm:self-auto"
          title="ড্যাশবোর্ডে ফিরে যান"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ফিরে যান</span>
        </Link>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-[6px] p-6 border border-slate-200 shadow-none space-y-4">
        {/* Member Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            সদস্য নির্বাচন করুন *
          </label>
          {loadingMembers ? (
            <p className="text-xs text-slate-500">সদস্য তালিকা লোড হচ্ছে...</p>
          ) : (
            <select
              name="memberId"
              value={formData.memberId}
              onChange={handleChange}
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-[6px] text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            >
              {members.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.name} — {m.phone} (বর্তমান জমা: {formatCurrency(m.totalDeposited)})
                </option>
              ))}
            </select>
          )}
          {selectedMember && (
            <p className="mt-1 text-[11px] text-slate-500 flex justify-between">
              <span>ইমেইল: {selectedMember.email}</span>
              <span className="font-semibold text-emerald-800">
                বর্তমান স্থিতি: {formatCurrency(selectedMember.totalDeposited)}
              </span>
            </p>
          )}
        </div>

        {/* Deposit Amount */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            জমার পরিমাণ (টাকা ৳) *
          </label>
          <div className="relative">
            <span className="absolute left-3.5 top-2.5 text-base font-bold text-slate-500">৳</span>
            <input
              type="number"
              name="amount"
              min="1"
              step="any"
              placeholder="যেমন: 5000"
              value={formData.amount}
              onChange={handleChange}
              required
              className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-[6px] text-base font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            পেমেন্ট মাধ্যম *
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'bkash', label: 'বিকাশ', icon: Smartphone, color: 'text-pink-600' },
              { id: 'nagad', label: 'নগদ', icon: Smartphone, color: 'text-orange-600' },
              { id: 'bank', label: 'ব্যাংক', icon: Landmark, color: 'text-blue-600' },
              { id: 'cash', label: 'ক্যাশ', icon: Banknote, color: 'text-emerald-700' },
            ].map((item) => {
              const isSelected = formData.paymentMethod === item.id;
              const Icon = item.icon;
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setFormData((prev) => ({ ...prev, paymentMethod: item.id }))}
                  className={`flex flex-col items-center gap-1 p-2.5 rounded-[6px] border text-xs font-semibold transition-all ${
                    isSelected
                      ? 'border-emerald-700 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-700/20'
                      : 'border-slate-200 text-slate-600 bg-white hover:border-slate-300'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${item.color}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* TrxID & Date in 2 columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              ট্রানজেকশন আইডি (TrxID)
            </label>
            <input
              type="text"
              name="trxId"
              placeholder="যেমন: BK9A87X10Z"
              value={formData.trxId}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-[6px] text-xs font-mono text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              তারিখ *
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-[6px] text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>
        </div>

        {/* Note / Remarks */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
            বিবরণ / নোট
          </label>
          <input
            type="text"
            name="note"
            placeholder="যেমন: মাসিক চাঁদা - অক্টোবর"
            value={formData.note}
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-[6px] text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
          />
        </div>

        {/* Submit */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
          <Link
            to="/dashboard"
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-[6px] transition-colors"
          >
            বাতিল
          </Link>
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-2 px-5 py-2.5 bg-emerald-900 hover:bg-emerald-950 text-gold-300 font-bold text-xs rounded-[6px] transition-all disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            <span>{submitting ? 'সংরক্ষণ হচ্ছে...' : 'জমা নিশ্চিত করুন'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
