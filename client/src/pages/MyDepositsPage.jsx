import React, { useState, useEffect } from 'react';
import { TrendingUp, ArrowLeft, RefreshCw, FileText, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { formatCurrency, formatDate, getPaymentMethodInfo } from '../utils/formatters';

export const MyDepositsPage = () => {
  const { user } = useAuth();
  const [deposits, setDeposits] = useState([]);
  const [totalDeposited, setTotalDeposited] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMyDeposits();
  }, []);

  const fetchMyDeposits = async () => {
    try {
      setLoading(true);
      const res = await api.get('/deposits/my-deposits');
      if (res.data.success) {
        setDeposits(res.data.deposits || []);
        if (typeof res.data.totalDeposited === 'number') {
          setTotalDeposited(res.data.totalDeposited);
        }
      }
    } catch (err) {
      console.error('Failed to load my deposits:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            আমার জমার স্টেটমেন্ট (My Deposit Statement)
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            আপনার ব্যক্তিগত তহবিলের বর্তমান ব্যালেন্স ও লেনদেন রেকর্ড
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={fetchMyDeposits}
            className="flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-[6px] border border-slate-300 transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>রিফ্রেশ</span>
          </button>
          <Link
            to="/dashboard"
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-semibold rounded-[6px] border border-emerald-700 transition-all shadow-sm"
            title="ড্যাশবোর্ডে ফিরে যান"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>ফিরে যান</span>
          </Link>
        </div>
      </div>

      {/* Balance Card */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-950 to-emerald-900 rounded-[6px] p-6 text-white border border-gold-500/40">
        <p className="text-xs font-semibold uppercase tracking-wider text-emerald-200">
          আপনার বর্তমান জমাকৃত মোট সঞ্চয়
        </p>
        <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-gold-300 font-sans mt-1">
          {formatCurrency(totalDeposited || user?.totalDeposited || 0)}
        </h2>
        <p className="text-xs text-emerald-200/80 mt-2">
          সদস্যের নাম: {user?.name} | মোবাইল: {user?.phone}
        </p>
      </div>

      {/* Deposits Table */}
      <div className="bg-white rounded-[6px] border border-slate-200 shadow-none overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-900">আপনার ব্যক্তিগত জমার তালিকা</h3>
          <span className="text-xs text-slate-500">{deposits.length} টি রেকর্ড</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="p-3">তারিখ</th>
                <th className="p-3">পেমেন্ট মাধ্যম</th>
                <th className="p-3">ট্রানজেকশন আইডি</th>
                <th className="p-3">বিবরণ / নোট</th>
                <th className="p-3 text-right">পরিমাণ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-slate-500">লোড হচ্ছে...</td>
                </tr>
              ) : deposits.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-slate-500">কোনো জমার এন্ট্রি পাওয়া যায়নি</td>
                </tr>
              ) : (
                deposits.map((d) => {
                  const method = getPaymentMethodInfo(d.paymentMethod);
                  return (
                    <tr key={d._id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="p-3 text-slate-500">{formatDate(d.date)}</td>
                      <td className="p-3">
                        <span className={`px-2 py-0.5 rounded-[4px] text-[10px] font-bold border ${method.badgeClass}`}>
                          {method.label}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-slate-600">{d.trxId || '-'}</td>
                      <td className="p-3 text-slate-600">{d.note || '-'}</td>
                      <td className="p-3 text-right font-bold text-emerald-900 font-sans">
                        {formatCurrency(d.amount)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
