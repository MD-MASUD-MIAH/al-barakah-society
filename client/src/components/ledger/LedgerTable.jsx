import React from 'react';
import {
  FileText,
  Trash2,
  CheckCircle,
  ExternalLink,
  Smartphone,
  Landmark,
  Banknote,
  Search,
} from 'lucide-react';
import { formatCurrency, formatDate, getPaymentMethodInfo } from '../../utils/formatters';

export const LedgerTable = ({
  deposits = [],
  loading = false,
  onViewReceipt,
  onRowClick,
  onDeleteDeposit,
  isAdmin = false,
}) => {
  if (loading) {
    return (
      <div className="bg-white rounded-[6px] p-12 text-center border border-slate-200 shadow-none">
        <div className="w-10 h-10 border-4 border-emerald-900 border-t-gold-500 rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-sm font-semibold text-slate-600">লেজার তালিকা লোড হচ্ছে...</p>
      </div>
    );
  }

  if (deposits.length === 0) {
    return (
      <div className="bg-white rounded-[6px] p-12 text-center border border-slate-200 shadow-none">
        <div className="w-12 h-12 bg-emerald-50 rounded-[6px] flex items-center justify-center mx-auto mb-3 text-emerald-800">
          <Search className="w-6 h-6" />
        </div>
        <h4 className="font-bold text-slate-800 text-sm">কোনো জমার রেকর্ড পাওয়া যায়নি</h4>
        <p className="text-xs text-slate-500 mt-1">
          নির্বাচিত ফিল্টারের আওতায় কোনো এন্ট্রি নেই অথবা এখনও কোনো জমা রেকর্ড করা হয়নি।
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-[6px] border border-slate-200 shadow-none overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              <th className="py-3 px-4">তারিখ</th>
              <th className="py-3 px-4">সদস্যের তথ্য</th>
              <th className="py-3 px-4">পেমেন্ট মাধ্যম</th>
              <th className="py-3 px-4">ট্রানজেকশন আইডি</th>
              <th className="py-3 px-4">বিবরণ / নোট</th>
              <th className="py-3 px-4 text-right">পরিমাণ (টাকা)</th>
              <th className="py-3 px-4 text-center">স্ট্যাটাস</th>
              <th className="py-3 px-4 text-center">অ্যাকশন</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs">
            {deposits.map((item) => {
              const method = getPaymentMethodInfo(item.paymentMethod);
              const member = item.memberId;

              return (
                <tr
                  key={item._id}
                  onClick={() => onRowClick && onRowClick(item)}
                  className="hover:bg-emerald-50/50 transition-colors group cursor-pointer"
                  title="বিস্তারিত ট্রানজেকশন দেখতে ক্লিক করুন"
                >
                  {/* Date */}
                  <td className="py-3 px-4 font-medium text-slate-600 whitespace-nowrap">
                    {formatDate(item.date)}
                  </td>

                  {/* Member info with strictly round avatar */}
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      {member?.avatar ? (
                        <img
                          src={member.avatar}
                          alt={member.name}
                          className="w-8 h-8 rounded-full aspect-square object-cover ring-1 ring-slate-200 shrink-0"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full aspect-square bg-emerald-100 text-emerald-900 font-bold flex items-center justify-center text-xs shrink-0">
                          {member?.name ? member.name.charAt(0) : 'M'}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-slate-900 leading-tight">
                          {member?.name || 'অজ্ঞাত সদস্য'}
                        </p>
                        <p className="text-[11px] text-slate-500">{member?.phone || '-'}</p>
                      </div>
                    </div>
                  </td>

                  {/* Payment Method */}
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] text-[11px] font-semibold border ${method.badgeClass}`}
                    >
                      {method.label}
                    </span>
                  </td>

                  {/* TrxID */}
                  <td className="py-3 px-4 font-mono text-xs text-slate-600 whitespace-nowrap">
                    {item.trxId ? (
                      <span className="bg-slate-100 px-1.5 py-0.5 rounded-[4px] text-slate-700">
                        {item.trxId}
                      </span>
                    ) : (
                      <span className="text-slate-400 italic">প্রযোজ্য নয়</span>
                    )}
                  </td>

                  {/* Note */}
                  <td className="py-3 px-4 text-xs text-slate-600 max-w-[180px] truncate">
                    {item.note || '-'}
                  </td>

                  {/* Amount */}
                  <td className="py-3 px-4 text-right whitespace-nowrap">
                    <span className="font-bold text-sm text-emerald-900 font-sans">
                      {formatCurrency(item.amount)}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <CheckCircle className="w-3 h-3 text-emerald-600" />
                      যাচাইকৃত
                    </span>
                  </td>

                  {/* Action buttons */}
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onViewReceipt(item)}
                        title="রসিদ দেখুন ও প্রিন্ট করুন"
                        className="p-1 rounded-[4px] text-slate-600 hover:text-emerald-900 hover:bg-emerald-100 transition-colors"
                      >
                        <FileText className="w-4 h-4 text-emerald-800" />
                      </button>

                      {isAdmin && (
                        <button
                          onClick={() => onDeleteDeposit(item._id)}
                          title="এন্ট্রি মুছুন"
                          className="p-1 rounded-[4px] text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
