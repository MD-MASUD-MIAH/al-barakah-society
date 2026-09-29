import React, { useState, useMemo } from 'react';
import {
  X,
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  FileText,
  Search,
} from 'lucide-react';
import { formatCurrency, formatDate, getPaymentMethodInfo } from '../../utils/formatters';

/**
 * Modern slide-over Drawer / Modal for viewing transactions
 * Supports Credit, Debit, Pending, Date, Amount, Payment Method, and Receipt view
 */
export const TransactionDrawerModal = ({
  isOpen,
  onClose,
  deposits = [],
  totalBalance = 0,
  userName = '',
  onViewReceipt,
}) => {
  const [filterType, setFilterType] = useState('all'); // 'all', 'credit', 'debit', 'pending'
  const [searchQuery, setSearchQuery] = useState('');

  // Process & filter deposits
  const filteredTransactions = useMemo(() => {
    return deposits.filter((tx) => {
      // Determine transaction type
      const isPending = tx.status === 'pending';
      const isDebit = tx.type === 'debit' || (tx.amount < 0);
      const isCredit = !isDebit && !isPending;

      if (filterType === 'credit' && (isDebit || isPending)) return false;
      if (filterType === 'debit' && !isDebit) return false;
      if (filterType === 'pending' && !isPending) return false;

      if (!searchQuery.trim()) return true;

      const q = searchQuery.toLowerCase();
      const matchTrx = tx.trxId?.toLowerCase().includes(q);
      const matchNote = tx.note?.toLowerCase().includes(q);
      const matchMethod = tx.paymentMethod?.toLowerCase().includes(q);
      const matchAmount = String(tx.amount).includes(q);
      const matchDate = tx.date?.includes(q);

      return matchTrx || matchNote || matchMethod || matchAmount || matchDate;
    });
  }, [deposits, filterType, searchQuery]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity duration-300 animate-in fade-in"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 p-5 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gold-400/20 border border-gold-400/40 flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-gold-300" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white leading-tight">
                    লেনদেন বিবরণী
                  </h3>
                  <p className="text-[11px] text-emerald-200">
                    {userName ? `${userName} - এর হিসাব` : 'আমার লেনদেনসমূহ'}
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors focus:outline-none"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Total Balance Card */}
            <div className="mt-4 p-3 bg-white/10 rounded-lg border border-gold-400/30 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-gold-300 font-medium">মোট জমা ব্যালেন্স</span>
                <p className="text-2xl font-bold font-sans text-white">
                  {formatCurrency(totalBalance)}
                </p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-800 text-[10px] font-semibold text-emerald-200 border border-emerald-600/40">
                {deposits.length} টি লেনদেন
              </span>
            </div>
          </div>

          {/* Filters & Search */}
          <div className="p-4 border-b border-slate-100 bg-slate-50/80 space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="লেনদেন খুঁজুন (আইডি, মাধ্যম, নোট)..."
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5">
              {[
                { key: 'all', label: 'সকল' },
                { key: 'credit', label: 'জমা (Credit)' },
                { key: 'debit', label: 'উত্তোলন (Debit)' },
                { key: 'pending', label: 'অপেক্ষমাণ' },
              ].map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilterType(tab.key)}
                  className={`flex-1 py-1 px-2 rounded text-[11px] font-semibold transition-all text-center ${
                    filterType === tab.key
                      ? 'bg-emerald-900 text-white shadow-xs'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Transaction List */}
          <div className="flex-1 overflow-y-auto p-4 divide-y divide-slate-100 space-y-1">
            {filteredTransactions.length === 0 ? (
              <div className="py-16 text-center">
                <Wallet className="w-10 h-10 text-slate-300 mx-auto mb-2" />
                <p className="text-sm font-semibold text-slate-700">কোনো লেনদেন পাওয়া যায়নি</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  {searchQuery ? 'ভিন্ন কিওয়ার্ড দিয়ে চেষ্টা করুন' : 'এখনও কোনো লেনদেনের রেকর্ড নেই'}
                </p>
              </div>
            ) : (
              filteredTransactions.map((item) => {
                const method = getPaymentMethodInfo(item.paymentMethod);
                const isDebit = item.type === 'debit' || item.amount < 0;
                const isPending = item.status === 'pending';

                return (
                  <div
                    key={item._id}
                    className="py-3 hover:bg-slate-50/80 -mx-2 px-2 rounded-lg transition-colors flex items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      {/* Icon Indicator */}
                      <div
                        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                          isPending
                            ? 'bg-amber-100 text-amber-700'
                            : isDebit
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {isPending ? (
                          <Clock className="w-4 h-4" />
                        ) : isDebit ? (
                          <ArrowUpRight className="w-4 h-4" />
                        ) : (
                          <ArrowDownLeft className="w-4 h-4" />
                        )}
                      </div>

                      {/* Details */}
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-xs font-semibold text-slate-900 truncate">
                            {isPending
                              ? 'জমা (অপেক্ষমাণ)'
                              : isDebit
                              ? 'উত্তোলন / ডেবিট'
                              : 'তহবিল জমা (Credit)'}
                          </span>
                          <span
                            className={`text-[10px] font-medium px-1.5 py-0.2 rounded border ${method.badgeClass}`}
                          >
                            {method.label}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-500">
                          <span>{formatDate(item.date)}</span>
                          {item.trxId && (
                            <>
                              <span>•</span>
                              <span className="font-mono text-[10px] text-slate-600 bg-slate-100 px-1 rounded">
                                {item.trxId}
                              </span>
                            </>
                          )}
                        </div>

                        {item.note && (
                          <p className="text-[11px] text-slate-600 mt-0.5 truncate max-w-[200px]">
                            {item.note}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Amount & Receipt */}
                    <div className="text-right shrink-0">
                      <p
                        className={`text-sm font-bold font-sans ${
                          isPending
                            ? 'text-amber-700'
                            : isDebit
                            ? 'text-rose-600'
                            : 'text-emerald-800'
                        }`}
                      >
                        {isDebit ? '-' : '+'} {formatCurrency(Math.abs(item.amount))}
                      </p>

                      {onViewReceipt && (
                        <button
                          onClick={() => onViewReceipt(item)}
                          className="inline-flex items-center gap-1 text-[11px] text-emerald-800 hover:text-emerald-950 font-medium hover:underline mt-0.5"
                        >
                          <FileText className="w-3 h-3 text-emerald-700" />
                          <span>রসিদ</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Note */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
            <p className="text-[11px] text-slate-500">
              আল-বারাকাহ সোসাইটি • ডিজিটাল আমানত হিসাব
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
