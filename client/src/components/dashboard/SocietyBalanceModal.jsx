import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet, X, ArrowRight, CheckCircle2, TrendingUp, CreditCard } from 'lucide-react';
import { formatCurrency } from '../../utils/formatters';

export const SocietyBalanceModal = ({ isOpen, onClose, stats, deposits = [] }) => {
  const navigate = useNavigate();
  if (!isOpen) return null;

  // Calculate payment methods breakdown from deposits
  const breakdown = deposits.reduce(
    (acc, item) => {
      const method = item.paymentMethod || 'cash';
      if (!acc[method]) acc[method] = { count: 0, amount: 0 };
      acc[method].count += 1;
      acc[method].amount += Number(item.amount || 0);
      return acc;
    },
    {}
  );

  const methodNames = {
    bkash: { name: 'বিকাশ (bKash)', color: 'bg-pink-50 border-pink-200 text-pink-700' },
    nagad: { name: 'নগদ (Nagad)', color: 'bg-orange-50 border-orange-200 text-orange-700' },
    bank: { name: 'ব্যাংক স্থানান্তর (Bank)', color: 'bg-blue-50 border-blue-200 text-blue-700' },
    cash: { name: 'নগদ ক্যাশ (Office Cash)', color: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs aos-modal-backdrop">
      <div className="bg-white rounded-[6px] border border-slate-200 shadow-none max-w-lg w-full overflow-hidden aos-modal-content">
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-gradient-to-r from-emerald-900 to-emerald-950 text-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[6px] bg-gold-500 text-emerald-950 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-emerald-950" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">সোসাইটির মোট জমা ফান্ড</h3>
              <p className="text-xs text-gold-300">তহবিল সংক্রান্ত বিস্তারিত পরিসংখ্যান</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-[6px] text-white/80 hover:text-white hover:bg-emerald-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Main Balance Box */}
          <div className="p-4 bg-emerald-50/70 rounded-[6px] border border-emerald-200 text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
              সর্বমোট সংগৃহীত সঞ্চয় ব্যালেন্স
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-emerald-950 font-sans mt-1">
              {formatCurrency(stats?.totalBalance || 0)}
            </h2>
            <p className="text-xs text-emerald-700 mt-1 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>প্রতিটি ট্রানজেকশন শতভাগ স্বচ্ছ ও নিরীক্ষিত</span>
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-3 text-center">
            <div className="p-3 bg-slate-50 rounded-[6px] border border-slate-200">
              <span className="text-[11px] text-slate-500">চলতি মাসের আদায়</span>
              <p className="text-lg font-bold text-slate-900 font-sans mt-0.5">
                {formatCurrency(stats?.thisMonthTotal || 0)}
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-[6px] border border-slate-200">
              <span className="text-[11px] text-slate-500">অনুমোদিত সক্রিয় সদস্য</span>
              <p className="text-lg font-bold text-slate-900 mt-0.5">
                {stats?.activeMembersCount || 0} জন
              </p>
            </div>
          </div>

          {/* Breakdown by Payment Channel */}
          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4 text-emerald-800" />
              <span>পেমেন্ট মাধ্যমভিত্তিক পরিসংখ্যান</span>
            </h4>
            <div className="space-y-2">
              {Object.keys(breakdown).length === 0 ? (
                <div className="p-3 bg-slate-50 rounded-[6px] border border-slate-200 text-xs text-slate-500 text-center">
                  সাম্প্রতিক লেনদেনের তথ্য পাওয়া যায়নি
                </div>
              ) : (
                Object.entries(breakdown).map(([key, data]) => {
                  const meta = methodNames[key] || {
                    name: key,
                    color: 'bg-slate-50 border-slate-200 text-slate-700',
                  };
                  return (
                    <div
                      key={key}
                      className={`flex items-center justify-between p-2.5 rounded-[6px] border text-xs ${meta.color}`}
                    >
                      <span className="font-semibold">{meta.name}</span>
                      <div className="text-right">
                        <span className="font-bold font-sans">{formatCurrency(data.amount)}</span>
                        <span className="text-[10px] ml-1 text-slate-500">({data.count} টি জমা)</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-[6px]"
          >
            বন্ধ করুন
          </button>
          <button
            onClick={() => {
              onClose();
              navigate('/ledger');
            }}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-900 hover:bg-emerald-950 text-white text-xs font-bold rounded-[6px] transition-all"
          >
            <span>সম্পূর্ণ লেজারে যান</span>
            <ArrowRight className="w-4 h-4 text-gold-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
