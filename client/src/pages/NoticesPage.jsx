import React from 'react';
import { Megaphone, Bell, Calendar, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

export const NoticesPage = () => {
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
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            সোসাইটি নোটিশ বোর্ড ও ঘোষণা (Notice Board)
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            জরুরি আপডেট, নির্দেশনা ও সোসাইটির প্রাতিষ্ঠানিক নোটিশ
          </p>
        </div>
        <Link
          to="/dashboard"
          className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-900 hover:bg-emerald-800 text-white text-xs font-semibold rounded-[6px] border border-emerald-700 transition-all shadow-sm self-start sm:self-auto"
          title="ড্যাশবোর্ডে ফিরে যান"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>ফিরে যান</span>
        </Link>
      </div>

      {/* Notices */}
      <div className="space-y-4">
        {notices.map((n) => (
          <div
            key={n.id}
            className={`p-5 rounded-[6px] border ${
              n.priority === 'high'
                ? 'bg-amber-50/70 border-amber-300'
                : 'bg-white border-slate-200'
            } shadow-none space-y-2`}
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Bell className={`w-4 h-4 ${n.priority === 'high' ? 'text-amber-600' : 'text-emerald-700'}`} />
                <span>{n.title}</span>
              </h3>
              <span className="text-xs text-slate-500 font-medium shrink-0">{n.date}</span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed pl-6">{n.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
