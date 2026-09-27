import React from 'react';
import { X, CheckCircle, FileText, Calendar, CreditCard, Hash, MessageSquare, Phone, User } from 'lucide-react';
import { formatCurrency, formatDate, getPaymentMethodInfo } from '../../utils/formatters';

export const TransactionDetailModal = ({ isOpen, onClose, deposit, onViewReceipt }) => {
  if (!isOpen || !deposit) return null;

  const method = getPaymentMethodInfo(deposit.paymentMethod);
  const member = deposit.memberId;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs aos-modal-backdrop">
      <div className="bg-white rounded-[6px] border border-slate-200 shadow-none max-w-md w-full overflow-hidden aos-modal-content">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-emerald-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[6px] bg-gold-500 text-emerald-950 flex items-center justify-center font-bold">
              ৳
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">ট্রানজেকশন বিবরণ</h3>
              <p className="text-[11px] text-emerald-200">যাচাইকৃত সোসাইটি জমা রেকর্ড</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-[6px] text-white/80 hover:text-white hover:bg-emerald-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {/* Amount Box */}
          <div className="p-4 bg-slate-50 rounded-[6px] border border-slate-200 text-center">
            <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
              জমাকৃত অর্থের পরিমাণ
            </span>
            <h2 className="text-3xl font-extrabold text-emerald-900 font-sans mt-0.5">
              {formatCurrency(deposit.amount)}
            </h2>
            <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />
              <span>এডমিন দ্বারা শতভাগ যাচাইকৃত ও অনুমোদিত</span>
            </div>
          </div>

          {/* Member Card */}
          <div className="p-3 bg-white rounded-[6px] border border-slate-200 flex items-center gap-3">
            {member?.avatar ? (
              <img
                src={member.avatar}
                alt={member.name}
                className="w-12 h-12 rounded-full aspect-square object-cover ring-2 ring-emerald-600/30 shrink-0"
              />
            ) : (
              <div className="w-12 h-12 rounded-full aspect-square bg-emerald-100 text-emerald-900 font-bold flex items-center justify-center text-base shrink-0">
                {member?.name?.charAt(0) || 'M'}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-xs text-slate-500 uppercase tracking-wider">জমাদানকারী সদস্য</p>
              <h4 className="text-sm font-bold text-slate-900 truncate">
                {member?.name || 'অজ্ঞাত সদস্য'}
              </h4>
              <p className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                <Phone className="w-3.5 h-3.5 text-slate-400" />
                <span>{member?.phone || '-'}</span>
              </p>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div className="p-2.5 bg-slate-50 rounded-[6px] border border-slate-200">
              <span className="text-slate-500 flex items-center gap-1 mb-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" /> জমার তারিখ
              </span>
              <p className="font-semibold text-slate-800">{formatDate(deposit.date)}</p>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-[6px] border border-slate-200">
              <span className="text-slate-500 flex items-center gap-1 mb-1">
                <CreditCard className="w-3.5 h-3.5 text-slate-400" /> পেমেন্ট মাধ্যম
              </span>
              <p className="font-semibold text-slate-800">{method.label}</p>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-[6px] border border-slate-200 col-span-2">
              <span className="text-slate-500 flex items-center gap-1 mb-1">
                <Hash className="w-3.5 h-3.5 text-slate-400" /> ট্রানজেকশন আইডি (TrxID)
              </span>
              <p className="font-mono font-semibold text-slate-800">
                {deposit.trxId || 'প্রযোজ্য নয় (ক্যাশ লেনদেন)'}
              </p>
            </div>

            {deposit.note && (
              <div className="p-2.5 bg-slate-50 rounded-[6px] border border-slate-200 col-span-2">
                <span className="text-slate-500 flex items-center gap-1 mb-1">
                  <MessageSquare className="w-3.5 h-3.5 text-slate-400" /> বিবরণ / মন্তব্য
                </span>
                <p className="text-slate-700">{deposit.note}</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-[6px]"
          >
            বন্ধ করুন
          </button>
          {onViewReceipt && (
            <button
              onClick={() => {
                onClose();
                onViewReceipt(deposit);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-900 hover:bg-emerald-950 text-gold-300 text-xs font-bold rounded-[6px] transition-all"
            >
              <FileText className="w-4 h-4 text-gold-400" />
              <span>রসিদ ভিউ ও প্রিন্ট</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
