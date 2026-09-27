import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, X, ArrowRight, CheckCircle2, Receipt } from 'lucide-react';
import { formatCurrency, formatDate, getPaymentMethodInfo } from '../../utils/formatters';

export const MyDepositsModal = ({ isOpen, onClose, user, deposits = [], onViewReceipt }) => {
  const navigate = useNavigate();
  if (!isOpen) return null;

  // Filter user's personal deposits
  const myDeposits = deposits.filter(
    (d) =>
      d.memberId?._id === user?._id ||
      d.memberId?.id === user?._id ||
      d.memberId === user?._id
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs aos-modal-backdrop">
      <div className="bg-white rounded-[6px] border border-slate-200 shadow-none max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden aos-modal-content">
        {/* Header */}
        <div className="flex items-center justify-between p-5 bg-gradient-to-r from-emerald-900 to-emerald-950 text-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[6px] bg-gold-500 text-emerald-950 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-950" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">আমার ব্যক্তিগত জমা বিবরণ</h3>
              <p className="text-xs text-gold-300">আপনার জমাকৃত তহবিলের বিস্তারিত স্টেটমেন্ট</p>
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
          <div className="p-4 bg-emerald-50 rounded-[6px] border border-emerald-200 text-center">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
              আপনার সর্বমোট সঞ্চয় তহবিল
            </span>
            <h2 className="text-3xl font-extrabold text-emerald-950 font-sans mt-1">
              {formatCurrency(user?.totalDeposited || 0)}
            </h2>
            <p className="text-xs text-emerald-700 mt-1 flex items-center justify-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>সোসাইটির তহবিলে আপনার আমানত সংরক্ষিত</span>
            </p>
          </div>

          <div>
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              আপনার সাম্প্রতিক জমার তালিকা:
            </h4>
            <div className="space-y-2">
              {myDeposits.length === 0 ? (
                <div className="p-4 text-center bg-slate-50 rounded-[6px] border border-slate-200 text-xs text-slate-500">
                  সাম্প্রতিক তালিকায় আপনার কোনো জমা পাওয়া যায়নি।
                </div>
              ) : (
                myDeposits.map((item) => {
                  const method = getPaymentMethodInfo(item.paymentMethod);
                  return (
                    <div
                      key={item._id}
                      className="flex items-center justify-between p-3 rounded-[6px] border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-900">
                          {formatDate(item.date)}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          মাধ্যম: {method.label} {item.trxId && `• Trx: ${item.trxId}`}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-emerald-900 font-sans">
                          {formatCurrency(item.amount)}
                        </span>
                        {onViewReceipt && (
                          <button
                            onClick={() => {
                              onClose();
                              onViewReceipt(item);
                            }}
                            className="p-1.5 rounded-[4px] bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-900 transition-colors"
                            title="রসিদ দেখুন"
                          >
                            <Receipt className="w-4 h-4" />
                          </button>
                        )}
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
              navigate('/profile');
            }}
            className="flex items-center gap-2 px-4 py-2 bg-emerald-900 hover:bg-emerald-950 text-white text-xs font-bold rounded-[6px] transition-all"
          >
            <span>সম্পূর্ণ প্রোফাইল স্টেটমেন্ট</span>
            <ArrowRight className="w-4 h-4 text-gold-400" />
          </button>
        </div>
      </div>
    </div>
  );
};
