import React, { useState, useEffect } from 'react';
import {
  Search,
  Filter,
  Download,
  PlusCircle,
  Calendar,
  RotateCcw,
  Receipt,
  FileSpreadsheet,
} from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';
import { LedgerTable } from '../components/ledger/LedgerTable';
import { DepositFormModal } from '../components/ledger/DepositFormModal';
import { ReceiptModal } from '../components/common/ReceiptModal';
import { TransactionDetailModal } from '../components/ledger/TransactionDetailModal';
import { showConfirmAlert, showSuccessAlert, showErrorAlert } from '../utils/alerts';
import { formatCurrency } from '../utils/formatters';

export const LedgerPage = () => {
  const { isAdmin } = useAuth();

  const [deposits, setDeposits] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [search, setSearch] = useState('');
  const [selectedMember, setSelectedMember] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Modals
  const [depositModalOpen, setDepositModalOpen] = useState(false);
  const [receiptModalOpen, setReceiptModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [selectedTx, setSelectedTx] = useState(null);

  useEffect(() => {
    fetchApprovedMembers();
  }, []);

  useEffect(() => {
    fetchDeposits();
  }, [selectedMember, selectedMethod, startDate, endDate]);

  const fetchApprovedMembers = async () => {
    try {
      const { data } = await api.get('/users/approved');
      if (data.success) {
        setMembers(data.users);
      }
    } catch (err) {
      console.error('Failed to load members list:', err);
    }
  };

  const fetchDeposits = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedMember) params.append('memberId', selectedMember);
      if (selectedMethod && selectedMethod !== 'all') params.append('paymentMethod', selectedMethod);
      if (startDate) params.append('startDate', startDate);
      if (endDate) params.append('endDate', endDate);
      if (search) params.append('search', search);

      const { data } = await api.get(`/deposits?${params.toString()}`);
      if (data.success) {
        setDeposits(data.deposits);
      }
    } catch (err) {
      console.error('Failed to load deposits:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchDeposits();
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedMember('');
    setSelectedMethod('all');
    setStartDate('');
    setEndDate('');
  };

  const handleDeleteDeposit = async (id) => {
    const confirmed = await showConfirmAlert(
      'জমার এন্ট্রি মুছবেন?',
      'আপনি কি নিশ্চিত যে এই জমার এন্ট্রি মুছে ফেলতে চান? সদস্যের মোট ব্যালেন্স স্বয়ংক্রিয়ভাবে সমন্বয় করা হবে।'
    );
    if (!confirmed) return;

    try {
      const { data } = await api.delete(`/deposits/${id}`);
      if (data.success) {
        await showSuccessAlert('মুছে ফেলা হয়েছে', 'জমার এন্ট্রি সফলভাবে মুছে ফেলা হয়েছে।');
        fetchDeposits();
      }
    } catch (err) {
      showErrorAlert('ব্যর্থ হয়েছে', err.response?.data?.message || 'জমার এন্ট্রি মুছতে সমস্যা হয়েছে।');
    }
  };

  // Export current filtered ledger to CSV
  const handleExportCSV = () => {
    if (deposits.length === 0) return;

    const headers = ['রসিদ নং', 'তারিখ', 'সদস্যের নাম', 'মোবাইল', 'পদ্ধতি', 'ট্রানজেকশন আইডি', 'পরিমাণ', 'নোট'];
    const rows = deposits.map((d) => [
      `ABS-${d._id.slice(-8).toUpperCase()}`,
      new Date(d.date).toLocaleDateString('en-GB'),
      d.memberId?.name || '',
      d.memberId?.phone || '',
      d.paymentMethod,
      d.trxId || '',
      d.amount,
      `"${(d.note || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `al-barakah-ledger-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Calculate sum of currently displayed deposits
  const currentTotal = deposits.reduce((sum, d) => sum + (d.status === 'verified' ? d.amount : 0), 0);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Receipt className="w-6 h-6 text-emerald-800" />
            <span>আর্থিক লেজার ও জমা খতিয়ান</span>
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-1">
            সোসাইটির সকল জমার পুঙ্খানুপুঙ্খ রেকর্ড, অনুসন্ধান ও রসিদ যাচাই
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            disabled={deposits.length === 0}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs rounded-[6px] border border-slate-300 shadow-none transition-all disabled:opacity-50"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-700" />
            <span>CSV ডাউনলোড</span>
          </button>

          {isAdmin && (
            <button
              onClick={() => setDepositModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-emerald-900 hover:bg-emerald-950 text-gold-300 font-bold text-xs rounded-[6px] shadow-none transition-all"
            >
              <PlusCircle className="w-4 h-4 text-gold-400" />
              <span>জমা রেকর্ড করুন</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-[6px] border border-slate-200/80 shadow-none space-y-4">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="সদস্যের নাম, মোবাইল, ট্রানজেকশন আইডি বা নোট দিয়ে খুঁজুন..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-[6px] text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-emerald-800 focus:bg-white text-slate-900"
            />
          </div>
          <button
            type="submit"
            className="px-4 sm:px-5 py-2.5 bg-emerald-900 text-white rounded-[6px] text-xs font-semibold hover:bg-emerald-950 transition-colors"
          >
            অনুসন্ধান
          </button>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-slate-100">
          {/* Member filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
              নির্দিষ্ট সদস্য
            </label>
            <select
              value={selectedMember}
              onChange={(e) => setSelectedMember(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-[6px] text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-800"
            >
              <option value="">সকল সদস্য</option>
              {members.map((m) => (
                <option key={m._id} value={m._id}>
                  {m.name} ({m.phone})
                </option>
              ))}
            </select>
          </div>

          {/* Payment Method filter */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
              পেমেন্ট মাধ্যম
            </label>
            <select
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-[6px] text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-800"
            >
              <option value="all">সকল মাধ্যম</option>
              <option value="cash">নগদ ক্যাশ (Cash)</option>
              <option value="bkash">বিকাশ (bKash)</option>
              <option value="nagad">নগদ (Nagad)</option>
              <option value="bank">ব্যাংক (Bank)</option>
            </select>
          </div>

          {/* Date from */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
              শুরুর তারিখ
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-[6px] text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-800"
            />
          </div>

          {/* Date to & reset */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 uppercase mb-1">
              শেষ তারিখ
            </label>
            <div className="flex gap-2">
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-[6px] text-xs text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-800"
              />
              <button
                type="button"
                onClick={handleResetFilters}
                title="ফিল্টার রিসেট করুন"
                className="p-2 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-[6px] transition-colors shrink-0"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary of currently filtered records */}
      <div className="flex items-center justify-between px-2 text-xs">
        <p className="text-slate-500">
          মোট রেকর্ড: <span className="font-bold text-slate-800">{deposits.length} টি</span>
        </p>
        <p className="text-slate-600">
          নির্বাচিত মোট জমা:{' '}
          <span className="font-bold text-base text-emerald-900 font-sans ml-1">
            {formatCurrency(currentTotal)}
          </span>
        </p>
      </div>

      {/* Ledger Table */}
      <LedgerTable
        deposits={deposits}
        loading={loading}
        onRowClick={(deposit) => setSelectedTx(deposit)}
        onViewReceipt={(deposit) => {
          setSelectedReceipt(deposit);
          setReceiptModalOpen(true);
        }}
        onDeleteDeposit={handleDeleteDeposit}
        isAdmin={isAdmin}
      />

      {/* Modals */}
      {isAdmin && (
        <DepositFormModal
          isOpen={depositModalOpen}
          onClose={() => setDepositModalOpen(false)}
          onSuccess={fetchDeposits}
        />
      )}

      <ReceiptModal
        isOpen={receiptModalOpen}
        onClose={() => setReceiptModalOpen(false)}
        receiptData={selectedReceipt}
      />

      <TransactionDetailModal
        isOpen={!!selectedTx}
        onClose={() => setSelectedTx(null)}
        transaction={selectedTx}
      />
    </div>
  );
};
