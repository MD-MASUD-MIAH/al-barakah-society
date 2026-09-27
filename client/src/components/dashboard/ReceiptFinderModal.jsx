import React, { useState, useEffect } from 'react';
import { X, Search, Printer, FileText, CheckCircle } from 'lucide-react';
import api from '../../services/api';
import { formatCurrency, formatDate, getPaymentMethodInfo } from '../../utils/formatters';

export const ReceiptFinderModal = ({ isOpen, onClose, onSelectReceipt }) => {
  const [search, setSearch] = useState('');
  const [deposits, setDeposits] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchReceipts();
    }
  }, [isOpen]);

  const fetchReceipts = async () => {
    try {
      setLoading(true);
      const res = await api.get('/deposits?limit=25');
      if (res.data.success) {
        setDeposits(res.data.deposits);
      }
    } catch (err) {
      console.error('Failed to load receipts:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs aos-modal-backdrop">
      <div className="bg-white rounded-[6px] border border-slate-200 shadow-none max-w-xl w-full max-h-[85vh] flex flex-col overflow-hidden aos-modal-content">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-900 to-emerald-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[6px] bg-cyan-600 text-white flex items-center justify-center">
              <Printer className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">অফিসিয়াল ডিজিটাল রসিদ অনুসন্ধান</h3>
              <p className="text-xs text-gold-300">যেকোনো জমার ভাউচার ও রসিদ প্রিন্ট করুন</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-[6px] text-white/80 hover:text-white hover:bg-emerald-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Input */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 shrink-0">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="সদস্যের নাম, মোবাইল বা ট্রানজেকশন আইডি দিয়ে রসিদ খুঁজুন..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white border border-slate-300 rounded-[6px] text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-800"
            />
          </div>
        </div>

        {/* Receipts List */}
        <div className="p-4 flex-1 overflow-y-auto space-y-2">
          {loading ? (
            <div className="text-center py-8 text-xs text-slate-500">রসিদ লোড হচ্ছে...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-500">কোনো রসিদ পাওয়া যায়নি</div>
          ) : (
            filtered.map((d) => {
              const method = getPaymentMethodInfo(d.paymentMethod);
              return (
                <div
                  key={d._id}
                  onClick={() => {
                    onSelectReceipt(d);
                    onClose();
                  }}
                  className="p-3 bg-white hover:bg-emerald-50/50 border border-slate-200 hover:border-emerald-600/40 rounded-[6px] flex items-center justify-between cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-[6px] bg-slate-100 group-hover:bg-emerald-100 text-slate-600 group-hover:text-emerald-900 flex items-center justify-center transition-colors">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 group-hover:text-emerald-950">
                        {d.memberId?.name || 'অজ্ঞাত সদস্য'}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] text-slate-500 mt-0.5">
                        <span>{formatDate(d.date)}</span>
                        <span>•</span>
                        <span className="font-mono">{d.trxId || method.label}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="font-bold text-sm text-emerald-900 block font-sans">
                      {formatCurrency(d.amount)}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-semibold group-hover:underline">
                      রসিদ দেখুন →
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
