import React from 'react';
import { X, Printer, CheckCircle, ShieldCheck, Sparkles } from 'lucide-react';
import { formatCurrency, formatDate, getPaymentMethodInfo } from '../../utils/formatters';

export const ReceiptModal = ({ isOpen, onClose, receiptData }) => {
  if (!isOpen || !receiptData) return null;

  const handlePrint = () => {
    window.print();
  };

  const methodInfo = getPaymentMethodInfo(receiptData.paymentMethod);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 aos-modal-backdrop">
      <div className="bg-white rounded-[6px] max-w-lg w-full shadow-none overflow-hidden border border-slate-200 aos-modal-content">
        {/* Modal Top Control Bar (hidden on print) */}
        <div className="no-print bg-slate-100 px-6 py-3.5 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-600 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-800" />
            অফিসিয়াল জমার রসিদ (Official Deposit Receipt)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold rounded-[6px] shadow-none transition-all"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>প্রিন্ট করুন</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-[6px] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Area */}
        <div id="printable-receipt" className="p-8 bg-white relative">
          {/* Watermark seal */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.04]">
            <img
              src="/logo-al-barakah.png"
              alt="Al-Barakah Watermark"
              className="w-80 h-80 object-contain grayscale"
            />
          </div>

          {/* Society Header */}
          <div className="text-center pb-6 border-b-2 border-emerald-900/20">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-[6px] bg-white p-1 mb-2 shadow-none border border-emerald-900/20 overflow-hidden">
              <img
                src="/logo-al-barakah.png"
                alt="আল-বারাকাহ সোসাইটি"
                className="w-full h-full object-contain"
              />
            </div>
            <h2 className="text-2xl font-bold text-emerald-950 font-sans">
              আল-বারাকাহ সোসাইটি
            </h2>
            <p className="text-xs font-semibold text-gold-600 tracking-wider">
              "বিশ্বাসের বন্ধন"
            </p>
            <p className="text-[11px] text-slate-500 mt-1">
              ইসলামিক স্বচ্ছ কমিউনিটি সঞ্চয় ও কল্যাণ তহবিল
            </p>
          </div>

          {/* Receipt Info Pill */}
          <div className="mt-5 mb-6 flex items-center justify-between bg-emerald-50/70 p-3 rounded-[6px] border border-emerald-200/60 text-xs">
            <div>
              <span className="text-slate-500">রসিদ নং: </span>
              <span className="font-mono font-bold text-emerald-900">
                {receiptData.receiptNumber || `ABS-${receiptData._id?.slice(-8).toUpperCase()}`}
              </span>
            </div>
            <div>
              <span className="text-slate-500">তারিখ: </span>
              <span className="font-semibold text-slate-800">
                {formatDate(receiptData.date)}
              </span>
            </div>
          </div>

          {/* Member & Payment Details Table */}
          <div className="space-y-3.5 text-sm">
            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">সদস্যের নাম:</span>
              <span className="font-bold text-slate-900">
                {receiptData.member?.name || receiptData.memberId?.name}
              </span>
            </div>

            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">মোবাইল নম্বর:</span>
              <span className="font-semibold text-slate-800">
                {receiptData.member?.phone || receiptData.memberId?.phone || '-'}
              </span>
            </div>

            <div className="flex justify-between py-2 border-b border-slate-100">
              <span className="text-slate-500">পেমেন্ট মাধ্যম:</span>
              <span className={`px-2.5 py-0.5 rounded-[6px] text-xs font-bold border ${methodInfo.badgeClass}`}>
                {methodInfo.label}
              </span>
            </div>

            {receiptData.trxId && (
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">ট্রানজেকশন আইডি (TrxID):</span>
                <span className="font-mono font-semibold text-slate-800">
                  {receiptData.trxId}
                </span>
              </div>
            )}

            {receiptData.note && (
              <div className="flex justify-between py-2 border-b border-slate-100">
                <span className="text-slate-500">বিবরণ / নোট:</span>
                <span className="font-medium text-slate-700 text-right max-w-[240px]">
                  {receiptData.note}
                </span>
              </div>
            )}

            {/* Big Amount Box */}
            <div className="mt-4 p-4 rounded-[6px] bg-gradient-to-r from-emerald-900 to-emerald-950 text-white flex items-center justify-between shadow-none">
              <div>
                <p className="text-xs text-emerald-200 uppercase font-semibold">প্রাপ্ত জমার পরিমাণ</p>
                <p className="text-2xl font-bold tracking-tight text-gold-300">
                  {formatCurrency(receiptData.amount)}
                </p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-800/80 rounded-[6px] border border-gold-500/40 text-xs text-gold-300 font-semibold">
                <CheckCircle className="w-4 h-4 text-emerald-300" />
                <span>যাচাইকৃত (Verified)</span>
              </div>
            </div>
          </div>

          {/* Footer & Signatures */}
          <div className="mt-10 pt-8 border-t border-slate-200 grid grid-cols-2 gap-8 text-center text-xs">
            <div>
              <div className="h-10 border-b border-dashed border-slate-300"></div>
              <p className="mt-1.5 text-slate-500 font-medium">সদস্যের স্বাক্ষর</p>
            </div>
            <div>
              <div className="h-10 border-b border-dashed border-slate-300 flex items-end justify-center pb-1">
                <span className="text-[11px] font-semibold text-emerald-900">
                  {receiptData.recordedBy?.name || receiptData.recordedBy || 'ম্যানেজিং অ্যাডমিন'}
                </span>
              </div>
              <p className="mt-1.5 text-slate-500 font-medium">অনুমোদিত স্বাক্ষর (অ্যাডমিন)</p>
            </div>
          </div>

          <p className="text-[10px] text-center text-slate-400 mt-6">
            এটি একটি সিস্টেম জেনারেটেড ডিজিটাল রসিদ। কোনো ভুলভ্রান্তি পরিলক্ষিত হলে অবিলম্বেই অবহিত করুন।
          </p>
        </div>
      </div>
    </div>
  );
};
