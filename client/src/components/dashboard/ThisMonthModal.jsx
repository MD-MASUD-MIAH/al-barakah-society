import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarCheck, X, ArrowRight, CheckCircle2 } from 'lucide-react';
import { formatCurrency, formatDate, getPaymentMethodInfo } from '../../utils/formatters';

export const ThisMonthModal = ({ isOpen, onClose, totalThisMonth = 0, deposits = [] }) => {
  const navigate = useNavigate();
  if (!isOpen) return null;

  // Filter deposits made in the current month
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const thisMonthDeposits = deposits.filter((d) => {
    if (!d.date) return false;
    const dDate = new Date(d.date);
    return dDate.getMonth() === currentMonth && dDate.getFullYear() === currentYear;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs aos-modal-backdrop">
      <div className="bg-white rounded-[6px] border border-slate-200 shadow-none max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden aos-modal-content">
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-gradient-to-r from-emerald-900 to-emerald-950 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[6px] bg-gradient-to-br from-gold-400 to-amber-500 text-emerald-950 flex items-center justify-center">
              <CalendarCheck className="w-5 h-5 text-emerald-950" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">চলতি মাসের জমা তথ্য</h3>
              <p className="text-xs text-gold-300">বর্তমান মাসের সংগৃহীত তহবিলের তালিকা</p>
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
        <div className="p-5 flex-1 overflow-y-auto space-y-4">
          <div className="p-4 bg-amber-50/80 rounded-[6px] border border-amber-200 text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-900">
              চলতি মাসের সর্বমোট সংগ্রহ
            </span>
            <h2 className="text-3xl font-extrabold text-amber-950 font-sans mt-1">
              {formatCurrency(totalThisMonth)}
            </h2>
            <p className="text-xs text-amber-800 mt-1">
              মোট সংগৃহীত কিস্তি / এন্ট্রি: {thisMonthDeposits.length} টি
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              সাম্প্রতিক জমা তালিকা:
            </h4>
            <div className="space-y-2">
              {thisMonthDeposits.length === 0 ? (
                <div className="p-4 text-center bg-slate-50 rounded-[6px] border border-slate-200 text-xs text-slate-500">
                  চলতি মাসে এখনও কোনো জমা রেকর্ড করা হয়নি অথবা ফিল্টার প্রযোজ্য নয়।
                </div>
              ) : (
                thisMonthDeposits.map((item) => {
                  const method = getPaymentMethodInfo(item.paymentMethod);
                  return (
                    <div
                      key={item._id}
                      className="flex items-center justify-between p-3 rounded-[6px] border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-center gap-2.5">
                        {item.memberId?.avatar ? (
                          <img
                            src={item.memberId.avatar}
                            alt={item.memberId.name}
                            className="w-8 h-8 rounded-full aspect-square object-cover ring-1 ring-slate-200"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full aspect-square bg-emerald-100 text-emerald-900 font-bold flex items-center justify-center text-xs">
                            {item.memberId?.name?.charAt(0) || 'M'}
                          </div>
                        )}
                        <div>
                          <p className="text-xs font-bold text-slate-900">
                            {item.memberId?.name || 'অজ্ঞাত'}
                          </p>
                          <p className="text-[11px] text-slate-500">
                            {formatDate(item.date)} • {method.label}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <span className="text-xs font-bold text-emerald-900 font-sans">
                          {formatCurrency(item.amount)}
                        </span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
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
            <span>সম্পূর্ণ লেজার দেখুন</span>
            <ArrowRight className="w-4 h-4 text-gold-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
