import React, { useState, useEffect } from 'react';
import { Printer, Search, FileText, ArrowLeft, RefreshCw } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { ReceiptModal } from '../components/common/ReceiptModal';
import { formatCurrency, formatDate, getPaymentMethodInfo } from '../utils/formatters';

export const ReceiptsPage = () => {
  const [deposits, setDeposits] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);

  useEffect(() => {
    fetchReceipts();
  }, []);

  const fetchReceipts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/deposits?limit=100');
      if (res.data.success) {
        setDeposits(res.data.deposits);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = deposits.filter((d) => {
    const memberName = d.memberId?.name || '';
    const phone = d.memberId?.phone || '';
    const trxId = d.trxId || '';
    const query = search.toLowerCase();
    return (
      memberName.toLowerCase().includes(query) ||
      phone.includes(query) ||
      trxId.toLowerCase().includes(query)
    );
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
              <Link
                to="/dashboard"
                className="text-slate-500 hover:text-emerald-800 transition-colors"
                title="ড্যাশবোর্ডে ফিরে যান"
              >
                <ArrowLeft className="w-6 h-6" />
              </Link>
              <span>ডিজিটাল রসিদ ও ভাউচার (Official Receipts &amp; Print)</span>
            </h1>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              যেকোনো জমার অফিসিয়াল ডিজিটাল রসিদ অনুসন্ধান ও তাৎক্ষণিক প্রিন্ট
            </p>
          </div>
        </div>

        <button
          onClick={fetchReceipts}
          className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-[6px] border border-slate-300 transition-all self-start sm:self-auto"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>রিফ্রেশ</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-[6px] border border-slate-200 shadow-none">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="সদস্যের নাম, মোবাইল নম্বর বা ট্রানজেকশন আইডি (TrxID) দিয়ে রসিদ খুঁজুন..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-[6px] text-xs sm:text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-800"
          />
        </div>
      </div>

      {/* Receipts Grid */}
      {loading ? (
        <div className="text-center py-12 text-xs text-slate-500">রসিদ লোড হচ্ছে...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-12 text-xs text-slate-500 bg-white rounded-[6px] border border-slate-200">
          কোনো রসিদ পাওয়া যায়নি
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((d) => {
            const method = getPaymentMethodInfo(d.paymentMethod);
            return (
              <div
                key={d._id}
                className="bg-white rounded-[6px] p-5 border border-slate-200 shadow-none space-y-3 hover:border-emerald-600/50 transition-colors flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-mono text-slate-500">
                      রসিদ নং: ABS-{d._id?.slice(-6).toUpperCase()}
                    </span>
                    <span className={`px-2 py-0.5 rounded-[4px] text-[10px] font-bold border ${method.badgeClass}`}>
                      {method.label}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 mt-2">
                    {d.memberId?.name || 'অজ্ঞাত সদস্য'}
                  </h3>
                  <p className="text-xs text-slate-500">{d.memberId?.phone || '-'}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block">{formatDate(d.date)}</span>
                    <span className="text-base font-bold text-emerald-900 font-sans">
                      {formatCurrency(d.amount)}
                    </span>
                  </div>

                  <button
                    onClick={() => {
                      setSelectedReceipt(d);
                      setReceiptModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-900 hover:bg-emerald-950 text-gold-300 font-bold text-xs rounded-[6px] transition-colors"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>প্রিন্ট রসিদ</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Official Printable Receipt Modal */}
      <ReceiptModal
        isOpen={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
        receiptData={selectedReceipt}
      />
    </div>
  );
};
