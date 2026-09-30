import React from 'react';
import { ShieldCheck, ArrowLeft, Printer, Scale, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const ShariahPolicyPage = () => {
  const { user } = useAuth();

  const handlePrint = () => {
    window.print();
  };

  const policies = [
    'প্রতিটি সাধারণ সদস্যের জন্য প্রতি মাসে ১০০০/- (এক হাজার) টাকা ধার্য করা হলো। পরবর্তীতে সর্বসম্মত সিদ্ধান্ত অনুযায়ী টাকার পরিমাণ বাড়ানো বা কমানো যাবে।',
    'ধার্যকৃত ১০০০/- টাকা প্রত্যেক ইংরেজি মাসের ১ থেকে ১০ তারিখের মধ্যে পরিশোধ করতে হবে।',
    'প্রতি মাসের ১০ তারিখের মধ্যে টাকা  পরিশোধ করা বাধ্যতামূলক। নির্ধারিত মাসের মধ্যে টাকা পরিশোধে ব্যর্থ হলে প্রতি অলঙ্ঘিত মাসের জন্য ৫০/- টাকা হারে জরিমানা যুক্ত হবে।',
    'একজন সদস্য চাইলে একাধিক শেয়ার/নাম গ্রহণ করতে পারবেন। পরবর্তীতে নতুন কোনো সদস্য সমিতিতে যুক্ত হতে চাইলে, তাকে পূর্ববর্তী সকল মাসের বকেয়া টাকা পরিশোধ করে যুক্ত হতে হবে।',
    'একজন হিসাবরক্ষণ/ক্যাশিয়ার সমিতির যাবতীয় আর্থিক হিসাব সংরক্ষণ ও প্রকাশ করবেন।',
    'সমিতির জমাকৃত ফান্ড থেকে কোন সদস্যকে হাওলাত বা ঋণ দেওয়া হবে না।',
    'কোনো সদস্য টানা ৫ মাস বকেয়া রাখলে কমিটির সিদ্ধান্ত অনুযায়ী তাঁর সদস্যপদ বাতিল বলে গণ্য হতে পারে।',
    'কোনো সদস্য মৃত্যুবরণ করলে তাঁর জমাকৃত আমানতের টাকা অনতিবিলম্বে তাঁর মনোনীত ওয়ারিশ বা নমিনিকে প্রদান করা হবে।',
    '২ বছর পূর্ণ হওয়ার পূর্বে কোনো সদস্য চাইলেই তাঁর সদস্যপদ বাতিল করতে পারবেন না।',
    'মেয়াদ পূর্ণ হওয়ার পূর্বে কোনো সদস্য সমিতি হতে বের হতে চাইলে, তাঁর মোট জমাকৃত আমানত হতে ৫% প্রসেসিং ফি/সার্ভিস চার্জ বাবদ কর্তন করে অবশিষ্ট টাকা ২ বছর পূর্ণ হওয়ার পর ফেরত প্রদান করা হবে।',
    'উক্ত তহবিল সংগঠনটি একটি অরাজনৈতিক ও সামাজিক তহবিল সংগঠন।',
    'সমিতির যাবতীয় আমানত সম্পূর্ণ সুদমুক্ত ও শরিয়াহ সম্মত উপায়ে লাভজনক ব্যবসা বা প্রকল্পে বিনিয়োগ করা হবে। অর্জিত লাভ বা ক্ষতি সমিতির সদস্য ও নিয়মানুযায়ী বণ্টন করা হবে।"',
    'এই সঞ্চয়ের টাকা দিয়ে লাভজনক ব্যবসায় বিনিয়োগ বা যা কিছু করা হবে তা সকলের আলোচনা সাপেক্ষে সিদ্ধান্ত গ্রহন করা হবে ইনশাআল্লাহ। মাইটি',
  ];

  const banglaDigits = ['১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯', '১০', '১১', '১২', '১৩'];

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-8 px-2 sm:px-4 space-y-6">
      {/* Top Navigation & Action Header (Hidden in Print) */}
      <div className="print:hidden flex items-center justify-between gap-3 pb-4 border-b border-slate-200">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
            শরীয়াহ নীতিমালা ও আমানত শর্তাবলী
          </h1>
          <p className="text-xs text-slate-500 font-medium mt-0.5">
            আল-বারাকাহ বহুমুখী সমবায় সমিতি — অফিসিয়াল নীতিমালা ও অঙ্গীকারনামা
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-[6px] transition-all border border-slate-300"
            title="নীতিমালা প্রিন্ট বা PDF ডাউনলোড করুন"
          >
            <Printer className="w-4 h-4 text-emerald-800" />
            <span>প্রিন্ট / PDF</span>
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

      {/* 
        ========================================================================
        AUTHENTIC PHYSICAL DOCUMENT STYLE (MATCHES USER IMAGE SAME-TO-SAME)
        ========================================================================
      */}
      <div className="bg-white border-2 border-slate-300 rounded-[4px] shadow-sm relative overflow-hidden text-slate-900 print:border-none print:shadow-none p-5 sm:p-10 md:p-12">
        
        {/* Subtle Background Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.035] select-none z-0">
          <div className="flex flex-col items-center text-center">
            <img
              src="/logo-al-barakah.png"
              alt="Al-Barakah Logo"
              className="w-80 h-80 object-contain filter grayscale"
            />
            <span className="text-3xl font-serif font-black tracking-widest text-slate-950 mt-2">
              আল-বারাকাহ্ সমবায় সমিতি
            </span>
            <span className="text-xl font-bold tracking-wider text-slate-800">
              বিশ্বাসের বন্ধন
            </span>
          </div>
        </div>

        <div className="relative z-10 space-y-6 sm:space-y-8">
          
          {/* Section 1: Center Angled Ribbon Badge "নীতিমালা" */}
          <div className="flex justify-center pt-2">
            <div className="bg-emerald-950 text-white font-bold text-base sm:text-lg px-10 sm:px-14 py-1.5 rounded-[3px] shadow-sm tracking-widest font-serif">
              নীতিমালা
            </div>
          </div>

          {/* 12 Rules & Regulations List (Exact Word-for-Word) */}
          <div className="space-y-3 sm:space-y-3.5 text-xs sm:text-[13px] md:text-sm text-slate-900 leading-relaxed font-sans">
            {policies.map((rule, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <span className="font-bold text-slate-950 shrink-0 select-none">
                  {banglaDigits[idx]}।
                </span>
                <p className="text-slate-800 font-medium text-justify">
                  {rule}
                </p>
              </div>
            ))}
          </div>

          {/* Section 2: Center Angled Ribbon Badge "অঙ্গীকারনামা" */}
          <div className="flex justify-center pt-6 sm:pt-8">
            <div className="bg-emerald-950 text-white font-bold text-base sm:text-lg px-10 sm:px-14 py-1.5 rounded-[3px] shadow-sm tracking-widest font-serif">
              অঙ্গীকারনামা
            </div>
          </div>

          {/* Pledge Text (Exact Word-for-Word from Picture) */}
          <div className="text-xs sm:text-[13px] md:text-sm text-slate-900 leading-relaxed space-y-3 font-sans">
            <p className="font-bold text-slate-950">
              আমি নিচে স্বাক্ষরকারী, সম্পূর্ণ সুস্থ মস্তিষ্কে ও স্বেচ্ছায় স্বজ্ঞানে অঙ্গীকার করছি যে-
            </p>
            <p className="text-slate-800 font-medium text-justify leading-relaxed">
              আমাকে উক্ত সামাজিক তহবিলের সদস্য হিসেবে অন্তর্ভুক্ত করা হলে, আমি তহবিলের পরিচালনা পরিষদ কর্তৃক প্রণীত সমস্ত বিধি-বিধান এবং সকল নিয়ম-কানুন যথায়থভাবে মেনে চলতে বাধ্য থাকব। আমি কখনো তহবিলের স্বার্থবিরোধী বা নীতিমালার পরিপন্থী কোনো কাজ করব না। এ ব্যাপারে কোনো ব্যতিক্রম ঘটলে পরিচালনা পরিষদ কর্তৃক গৃহিত যেকোনো সিদ্ধান্ত বা শর্ত মেনে নিতে বাধ্য থাকব।
            </p>
          </div>

          {/* Section 3: Signatures Footer (Exact from Picture) */}
          <div className="pt-16 sm:pt-20 pb-4 grid grid-cols-2 gap-4">
            {/* President Signature */}
            <div className="flex flex-col items-center text-center">
              <div className="w-36 sm:w-52 border-t-2 border-dotted border-slate-700 pt-1 text-xs sm:text-sm font-bold text-slate-800">
                সভাপতি
              </div>
              <span className="text-[10px] sm:text-xs text-slate-500 mt-0.5">
                আল-বারাকাহ্ সমবায় সমিতি
              </span>
            </div>

            {/* Applicant Signature */}
            <div className="flex flex-col items-center text-center">
              <div className="w-44 sm:w-64 border-t-2 border-dotted border-slate-700 pt-1 text-xs sm:text-sm font-bold text-slate-800">
                আবেদনকারীর স্বাক্ষর এবং তারিখ
              </div>
              <span className="text-[10px] sm:text-xs font-semibold text-emerald-900 mt-0.5 font-mono">
                {user?.name ? `${user.name} (${new Date().toLocaleDateString('bn-BD')})` : ''}
              </span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
