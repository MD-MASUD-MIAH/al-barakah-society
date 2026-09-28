import React, { useState, useEffect } from 'react';
import { X, PlusCircle, Check, AlertCircle, Banknote, Smartphone, Landmark } from 'lucide-react';
import confetti from 'canvas-confetti';
import api from '../../services/api';
import { formatCurrency } from '../../utils/formatters';

export const DepositFormModal = ({ isOpen, onClose, onSuccess }) => {
  const [members, setMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    memberId: '',
    amount: '',
    paymentMethod: 'bkash',
    trxId: '',
    date: new Date().toISOString().split('T')[0],
    note: '',
    status: 'verified',
  });

  useEffect(() => {
    if (isOpen) {
      fetchApprovedMembers();
      setError('');
    }
  }, [isOpen]);

  const fetchApprovedMembers = async () => {
    try {
      setLoadingMembers(true);
      const { data } = await api.get('/users/approved');
      const list = data.users || data.members || [];
      if (data.success && list.length > 0) {
        setMembers(list);
        if (!formData.memberId) {
          setFormData((prev) => ({ ...prev, memberId: list[0]._id }));
        }
      }
    } catch (err) {
      console.error('Failed to load members for deposit form:', err);
    } finally {
      setLoadingMembers(false);
    }
  };

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.memberId) {
      setError('অনুগ্রহ করে সদস্য নির্বাচন করুন');
      return;
    }

    const amountNum = parseFloat(formData.amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('সঠিক জমার পরিমাণ (টাকা) প্রদান করুন');
      return;
    }

    try {
      setSubmitting(true);
      const res = await api.post('/deposits', formData);
      if (res.data.success) {
        // Trigger celebratory confetti
        confetti({
          particleCount: 70,
          spread: 60,
          origin: { y: 0.7 },
          colors: ['#0F5132', '#D4AF37', '#166534'],
        });

        if (onSuccess) onSuccess(res.data.deposit);
        onClose();
        // Reset form
        setFormData({
          memberId: members[0]?._id || '',
          amount: '',
          paymentMethod: 'bkash',
          trxId: '',
          date: new Date().toISOString().split('T')[0],
          note: '',
          status: 'verified',
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || 'জমা রেকর্ড করতে ব্যর্থ হয়েছে।');
    } finally {
      setSubmitting(false);
    }
  };

  const selectedMember = members.find((m) => m._id === formData.memberId);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 aos-modal-backdrop">
      <div className="bg-white rounded-[6px] max-w-lg w-full shadow-none overflow-hidden border border-slate-200 aos-modal-content">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 to-emerald-950 px-6 py-4 text-white flex items-center justify-between border-b border-gold-500/30">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-[6px] bg-gold-500 text-emerald-950 font-bold flex items-center justify-center shadow-none">
              <PlusCircle className="w-5 h-5 text-emerald-950" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">নতুন জমা রেকর্ড করুন</h3>
              <p className="text-xs text-gold-300 font-medium">সদস্যের তহবিলে আর্থিক এন্ট্রি যুক্ত করুন</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-emerald-300 hover:text-white hover:bg-emerald-800 rounded-[6px] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-[6px] flex items-center gap-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Member Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
              সদস্য নির্বাচন করুন *
            </label>
            {loadingMembers ? (
              <p className="text-xs text-slate-500">সদস্যদের তালিকা লোড হচ্ছে...</p>
            ) : (
              <select
                name="memberId"
                value={formData.memberId}
                onChange={handleChange}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-[6px] text-sm font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent transition-all"
              >
                {members.map((member) => (
                  <option key={member._id} value={member._id}>
                    {member.name} — {member.phone} (বর্তমান জমা: {formatCurrency(member.totalDeposited)})
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
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-[6px] text-base font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:border-transparent"
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
                        ? 'border-emerald-700 bg-emerald-50 text-emerald-950 ring-2 ring-emerald-700/20 shadow-none'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600 bg-white'
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
              placeholder="যেমন: মাসিক চাঁদা - অক্টোবর বা কল্যাণ তহবিল"
              value={formData.note}
              onChange={handleChange}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-[6px] text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-700"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-[6px] transition-colors"
            >
              বাতিল
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-900 hover:bg-emerald-950 text-gold-300 font-semibold text-xs rounded-[6px] shadow-none transition-all disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>{submitting ? 'সংরক্ষণ হচ্ছে...' : 'জমা নিশ্চিত করুন'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
