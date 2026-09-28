import React from 'react';
import { X, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export const ShariahPolicyModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const policies = [
    'প্রতিটি সাধারণ সদস্যের জন্য প্রতি মাসে ১০০০/- (এক হাজার) টাকা ধার্য করা হলো। পরবর্তীতে সর্বসম্মত সিদ্ধান্ত অনুযায়ী টাকার পরিমাণ বাড়ানো বা কমানো যাবে।',
    'ধার্যকৃত ১০০০/- টাকা প্রত্যেক ইংরেজি মাসের ১ থেকে ১০ তারিখের মধ্যে পরিশোধ করতে হবে।',
    'প্রতি মাসের ১০ তারিখের মধ্যে টাকা পরিশোধ করা বাধ্যতামূলক। নির্ধারিত মাসের মধ্যে টাকা পরিশোধে ব্যর্থ হলে প্রতি অলঙ্ঘিত মাসের জন্য ৫০/- টাকা হারে জরিমানা যুক্ত হবে।',
    'একজন হিসাবরক্ষণ/ক্যাশিয়ার সমিতির যাবতীয় আর্থিক হিসাব সংরক্ষণ ও প্রকাশ করবেন।',
    'সমিতির জমাকৃত ফান্ড থেকে কোন সদস্য হাওলাত বা ঋণ দেওয়া হবে না।',
    'কোনো সদস্য টানা ৫ মাস বকেয়া রাখলে কমিটির সিদ্ধান্ত অনুযায়ী তাঁর সদস্যপদ বাতিল বলে গণ্য হতে পারে।',
    'কোনো সদস্য মৃত্যুবরণ করলে তাঁর জমাকৃত আমানতের টাকা অনতিবিলম্বে তাঁর মনোনীত ওয়ারিশ বা নমিনিকে প্রদান করা হবে।',
    '২ বছর পূর্ণ হওয়ার পূর্বে কোনো সদস্য চাইলেই তাঁর সদস্যপদ বাতিল করতে পারবেন না।',
    'মেয়াদ পূর্ণ হওয়ার পূর্বে কোনো সদস্য সমিতি হতে বের হতে চাইলে, তাঁর মোট জমাকৃত আমানত হতে ৫% প্রসেসিং ফি/সার্ভিস চার্জ বাবদ কর্তন করে অবশিষ্ট টাকা ২ বছর পূর্ণ হওয়ার পর ফেরত প্রদান করা হবে।',
    'উক্ত তহবিল সংগঠনটি একটি অরাজনৈতিক ও সামাজিক তহবিল সংগঠন।',
    'সমিতির যাবতীয় আমানত সম্পূর্ণ সুদমুক্ত ও শরিয়াহ সম্মত উপায়ে লাভজনক ব্যবসা বা প্রকল্পে বিনিয়োগ করা হবে। অর্জিত লাভ বা ক্ষতি সমিতির সদস্য ও নিয়মানুযায়ী বণ্টন করা হবে।',
    'এই সঞ্চয়ের টাকা দিয়ে লাভজনক ব্যবসায় বিনিয়োগ বা যা কিছু করা হবে তা সকলের আলোচনা সাপেক্ষে সিদ্ধান্ত গ্রহণ করা হবে ইনশাআল্লাহ্।',
  ];

  const banglaDigits = ['১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯', '১০', '১১', '১২'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs aos-modal-backdrop">
      <div className="bg-white rounded-[6px] border border-slate-200 shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col overflow-hidden aos-modal-content">
        
        {/* Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-emerald-900 to-emerald-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-[6px] bg-gold-500 text-emerald-950 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5 text-emerald-950" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg text-white font-serif">
                নীতিমালা ও অঙ্গীকারনামা
              </h3>
              <p className="text-xs text-gold-300">
                আল-বারাকাহ্ বহুমুখী সমবায় সমিতি
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-[6px] text-white/80 hover:text-white hover:bg-emerald-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 flex-1 overflow-y-auto space-y-5 text-xs sm:text-sm text-slate-800 leading-relaxed">
          
          {/* Ribbon 1: নীতিমালা */}
          <div className="flex justify-center">
            <div className="bg-emerald-950 text-white font-bold text-xs sm:text-sm px-8 py-1 rounded-[3px] shadow-sm tracking-wider font-serif">
              নীতিমালা
            </div>
          </div>

          {/* Rules List */}
          <div className="space-y-2.5">
            {policies.map((rule, idx) => (
              <div key={idx} className="flex items-start gap-2 p-2 bg-slate-50 rounded-[4px] border border-slate-200/80">
                <span className="font-bold text-emerald-900 shrink-0 select-none">
                  {banglaDigits[idx]}।
                </span>
                <p className="text-slate-800 font-medium text-justify">
                  {rule}
                </p>
              </div>
            ))}
          </div>

          {/* Ribbon 2: অঙ্গীকারনামা */}
          <div className="flex justify-center pt-2">
            <div className="bg-emerald-950 text-white font-bold text-xs sm:text-sm px-8 py-1 rounded-[3px] shadow-sm tracking-wider font-serif">
              অঙ্গীকারনামা
            </div>
          </div>

          {/* Pledge Text */}
          <div className="p-3.5 bg-emerald-50 rounded-[4px] border border-emerald-200 text-slate-900 space-y-2">
            <p className="font-bold text-emerald-950">
              আমি নিচে স্বাক্ষরকারী, সম্পূর্ণ সুস্থ মস্তিষ্কে ও স্বেচ্ছায় স্বজ্ঞানে অঙ্গীকার করছি যে—
            </p>
            <p className="text-slate-800 text-justify leading-relaxed">
              আমাকে উক্ত সামাজিক তহবিলের সদস্য হিসেবে অন্তর্ভুক্ত করা হলে, আমি তহবিলের পরিচালনা পরিষদ কর্তৃক প্রণীত সমস্ত বিধি-বিধান এবং সকল নিয়ম-কানুন যথাযথভাবে মেনে চলতে বাধ্য থাকব। আমি কখনো তহবিলের স্বার্থবিরোধী বা নীতিমালার পরিপন্থী কোনো কাজ করব না। এ ব্যাপারে কোনো ব্যতিক্রম ঘটলে পরিচালনা পরিষদ কর্তৃক গৃহীত যেকোনো সিদ্ধান্ত বা শর্ত মেনে নিতে বাধ্য থাকব।
            </p>
          </div>

          {/* Signatures */}
          <div className="pt-6 pb-2 grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="border-t border-dotted border-slate-700 pt-1 text-xs font-bold text-slate-800">
                সভাপতি
              </div>
              <span className="text-[10px] text-slate-500">আল-বারাকাহ্ সমবায় সমিতি</span>
            </div>
            <div className="text-center">
              <div className="border-t border-dotted border-slate-700 pt-1 text-xs font-bold text-slate-800">
                আবেদনকারীর স্বাক্ষর এবং তারিখ
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <Link
            to="/shariah-policy"
            onClick={onClose}
            className="text-xs font-bold text-emerald-800 hover:text-emerald-950 underline flex items-center gap-1"
          >
            <FileText className="w-3.5 h-3.5" />
            <span>সম্পূর্ণ পেজ ও প্রিন্ট ভিউ দেখুন</span>
          </Link>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-emerald-900 text-gold-300 font-bold text-xs rounded-[6px] hover:bg-emerald-950 transition-colors shadow-sm"
          >
            বুঝেছি ও সম্মত
          </button>
        </div>

      </div>
    </div>
  );
};
