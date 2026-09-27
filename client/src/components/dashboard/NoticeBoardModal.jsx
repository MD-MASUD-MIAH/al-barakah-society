import React from 'react';
import { X, Megaphone, Bell, Calendar, Sparkles } from 'lucide-react';

export const NoticeBoardModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const notices = [
    {
      id: 1,
      title: 'চলতি মাসের মাসিক চাঁদা জমার সময়সীমা',
      date: '২৫ সেপ্টেম্বর, ২০২৬',
      priority: 'high',
      body: 'সম্মানিত সদস্যবৃন্দ, চলতি মাসের চাঁদা নির্ধারিত তারিখের মধ্যে বিকাশ, নগদ বা ব্যাংক অ্যাকাউন্টে জমা দিয়ে ট্রানজেকশন আইডি আপডেট করার জন্য অনুরোধ করা হচ্ছে।',
    },
    {
      id: 2,
      title: 'আগামী ত্রৈমাসিক সাধারণ সভা সংক্রান্ত নোটিশ',
      date: '২০ সেপ্টেম্বর, ২০২৬',
      priority: 'normal',
      body: 'ইনশাআল্লাহ আগামী মাসে সোসাইটির ত্রৈমাসিক অডিট ও পরিকল্পনা সভা অনুষ্ঠিত হবে। বিস্তারিত সময়সূচী ও আলোচ্যসূচি পরবর্তীতে জানানো হবে।',
    },
    {
      id: 3,
      title: 'নতুন সদস্য অন্তর্ভুক্তি ও নীতিমালা স্মরণিকা',
      date: '১৫ সেপ্টেম্বর, ২০২৬',
      priority: 'normal',
      body: 'সোসাইটিতে নতুন মেম্বার যুক্ত করার ক্ষেত্রে জাতীয় পরিচয়পত্র ও নমিনির তথ্যসহ আলাদা সদস্য ফরম পূরণপূর্বক কার্যনির্বাহী কমিটির অনুমোদন বাধ্যতামূলক।',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs aos-modal-backdrop">
      <div className="bg-white rounded-[6px] border border-slate-200 shadow-none max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden aos-modal-content">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-900 to-emerald-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[6px] bg-purple-600 text-white flex items-center justify-center">
              <Megaphone className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">সোসাইটি নোটিশ বোর্ড ও ঘোষণা</h3>
              <p className="text-xs text-gold-300">গুরুত্বপূর্ণ আপডেট ও নির্দেশনাবলী</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-[6px] text-white/80 hover:text-white hover:bg-emerald-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notices List */}
        <div className="p-5 flex-1 overflow-y-auto space-y-3">
          {notices.map((n) => (
            <div
              key={n.id}
              className={`p-3.5 rounded-[6px] border ${
                n.priority === 'high'
                  ? 'bg-amber-50/70 border-amber-300'
                  : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <h4 className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-1.5">
                  <Bell className={`w-3.5 h-3.5 ${n.priority === 'high' ? 'text-amber-600' : 'text-emerald-700'}`} />
                  <span>{n.title}</span>
                </h4>
                <span className="text-[10px] text-slate-500 shrink-0 font-medium">{n.date}</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed pl-5">{n.body}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
