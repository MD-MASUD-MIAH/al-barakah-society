import React, { useState, useRef } from 'react';
import {
  X,
  Printer,
  FileText,
  CheckCircle2,
  Calendar,
  Phone,
  Mail,
  User as UserIcon,
  ShieldCheck,
  Building,
} from 'lucide-react';
import { formatDate, formatCurrency } from '../../utils/formatters';

export const MemberApplicationModal = ({ isOpen, onClose, member }) => {
  const [isClosing, setIsClosing] = useState(false);
  const formRef = useRef(null);

  if (!isOpen || !member) return null;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 200);
  };

  const mDetails = member.membershipDetails || {};
  const formNo = mDetails.formNo || `ABS-${(member._id ? member._id.slice(-6) : '100001').toUpperCase()}`;
  const admissionDate = mDetails.admissionDate || (member.createdAt ? formatDate(member.createdAt) : '');
  const monthlyPledgeAmount = mDetails.monthlyPledge || 1000;

  const handlePrint = () => {
    const printArea = document.getElementById('printable-member-form');
    if (!printArea) {
      window.print();
      return;
    }
    const printWindow = window.open('', '_blank', 'width=900,height=900');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html lang="bn">
        <head>
          <title>সদস্য ভর্তি ফরম - ${member.name}</title>
          <meta charset="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @page {
              size: A4 portrait;
              margin: 10mm 12mm;
            }
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
              background: #ffffff;
            }
            .no-print {
              display: none !important;
            }
          </style>
        </head>
        <body class="p-2 sm:p-4 text-slate-900">
          ${printArea.innerHTML}
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                window.close();
              }, 400);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto ${
        isClosing ? 'aos-modal-backdrop-closing' : 'aos-modal-backdrop'
      }`}
      onClick={handleClose}
    >
      <div
        className={`bg-white rounded-[6px] border border-slate-200 shadow-2xl max-w-4xl w-full my-4 sm:my-auto flex flex-col max-h-[94vh] overflow-hidden ${
          isClosing ? 'aos-modal-content-closing' : 'aos-modal-content'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-950 to-slate-900 text-white px-5 py-3.5 flex items-center justify-between shrink-0 border-b-2 border-gold-500/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-[6px] bg-gold-500 text-emerald-950 flex items-center justify-center font-bold">
              <FileText className="w-4 h-4 text-emerald-950" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base text-white flex items-center gap-2">
                <span>সদস্য ভর্তি আবেদন ফরম (Application Form)</span>
                <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-[4px] bg-emerald-800 text-[10px] text-gold-300 border border-gold-500/30">
                  <CheckCircle2 className="w-3 h-3 text-gold-400" />
                  অনুমোদিত সদস্য
                </span>
              </h3>
              <p className="text-[11px] text-gold-300/90 font-medium">
                {member.name} • ফরম নং: {formNo}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              type="button"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white/10 hover:bg-white/20 text-gold-300 hover:text-white rounded-[6px] text-xs font-semibold transition-all border border-gold-500/30"
              title="ফরম প্রিন্ট বা সেভ করুন"
            >
              <Printer className="w-3.5 h-3.5 text-gold-400" />
              <span className="hidden sm:inline">প্রিন্ট / PDF</span>
            </button>
            <button
              onClick={handleClose}
              className="p-1.5 rounded-[6px] text-slate-300 hover:text-white hover:bg-emerald-800 transition-colors"
              title="বন্ধ করুন"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 bg-slate-100/70">
          {/* Printable Container */}
          <div
            id="printable-member-form"
            ref={formRef}
            className="bg-white border-2 border-emerald-950 rounded-[4px] shadow-sm relative overflow-hidden text-slate-900 p-4 sm:p-7 md:p-8 space-y-4"
          >
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.03] select-none z-0">
              <div className="flex flex-col items-center text-center">
                <img
                  src="/logo-al-barakah.png"
                  alt="Watermark Logo"
                  className="w-80 h-80 object-contain filter grayscale"
                />
                <span className="text-3xl font-serif font-black tracking-widest text-slate-950 mt-2">
                  আল-বারাকাহ্ সমবায় সমিতি
                </span>
              </div>
            </div>

            <div className="relative z-10 space-y-4">
              {/* 1. Header Box */}
              <div className="bg-[#fefce8] border border-amber-300/80 rounded-[4px] p-3 sm:p-4 relative">
                <div className="text-center font-serif text-sm sm:text-base font-bold text-slate-800 tracking-wide mb-2 sm:mb-3">
                  বিসমিল্লাহির রাহমানির রাহিম
                </div>

                <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
                  {/* Left: Logo */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-emerald-800 p-1 bg-white shadow-sm flex items-center justify-center">
                      <img
                        src="/logo-al-barakah.png"
                        alt="Al-Barakah Logo"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>

                  {/* Center: Title & Address */}
                  <div className="flex-1 text-center space-y-1 px-2">
                    <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-950 tracking-tight font-serif">
                      আল-বারাকাহ্ বহুমুখী সমবায় সমিতি
                    </h2>
                    <div className="inline-block bg-emerald-800 text-white text-xs sm:text-sm font-semibold px-4 py-0.5 rounded-full shadow-sm">
                      একত্রে গড়ি সঞ্চয়, বরকতময় সুদিনের নিশ্চয়
                    </div>
                    <p className="text-xs sm:text-sm font-bold text-slate-800">
                      ঘড়িশার, নড়িয়া, শরীয়তপুর
                    </p>
                    <p className="text-[11px] sm:text-xs font-semibold text-slate-700">
                      স্থাপিতঃ ২০২৩ ইং
                    </p>
                  </div>

                  {/* Right: Member Passport Photo */}
                  <div className="shrink-0 flex flex-col items-center">
                    <div className="w-24 h-28 sm:w-28 sm:h-32 border-2 border-emerald-800 rounded-[4px] overflow-hidden bg-slate-50 flex items-center justify-center shadow-xs">
                      {member.avatar || mDetails.avatar ? (
                        <img
                          src={member.avatar || mDetails.avatar}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-emerald-100 text-emerald-900 font-bold flex flex-col items-center justify-center text-sm">
                          <UserIcon className="w-8 h-8 text-emerald-700 mb-1 opacity-70" />
                          <span>ছবি নেই</span>
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-slate-500 font-medium mt-1">সদস্যের ছবি</span>
                  </div>
                </div>
              </div>

              {/* Green Divider */}
              <div className="h-1 bg-emerald-800 w-full rounded-full"></div>

              {/* 2. Sub-Bar: Form No | Title | Date */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1 pb-2 border-b border-slate-200">
                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-900">
                  <span className="shrink-0">ফরম নং-</span>
                  <span className="px-2.5 py-0.5 bg-slate-100 border border-slate-300 rounded font-mono font-bold text-emerald-950">
                    {formNo}
                  </span>
                </div>

                <div className="bg-emerald-950 text-white font-bold text-sm sm:text-base px-6 sm:px-8 py-1 rounded-[3px] shadow-xs tracking-wide">
                  সদস্য ভর্তি ফরম
                </div>

                <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-900">
                  <span className="shrink-0">ভর্তির তারিখঃ</span>
                  <span className="px-2.5 py-0.5 bg-slate-100 border border-slate-300 rounded font-sans font-bold text-emerald-950">
                    {admissionDate || '-'}
                  </span>
                </div>
              </div>

              {/* 3. Member Personal Details */}
              <div className="space-y-2.5 text-xs sm:text-sm pt-1">
                {/* নাম */}
                <div className="flex items-baseline gap-2 border-b border-dashed border-slate-300 pb-1">
                  <span className="font-bold text-slate-900 shrink-0 w-28 sm:w-32">নামঃ</span>
                  <span className="font-bold text-slate-950 text-sm sm:text-base flex-1">
                    {member.name}
                  </span>
                </div>

                {/* পিতা/স্বামী */}
                <div className="flex items-baseline gap-2 border-b border-dashed border-slate-300 pb-1">
                  <span className="font-bold text-slate-900 shrink-0 w-28 sm:w-32">পিতা/স্বামীঃ</span>
                  <span className="font-medium text-slate-900 flex-1">
                    {mDetails.fatherOrHusbandName || '-'}
                  </span>
                </div>

                {/* মাতা */}
                <div className="flex items-baseline gap-2 border-b border-dashed border-slate-300 pb-1">
                  <span className="font-bold text-slate-900 shrink-0 w-28 sm:w-32">মাতাঃ</span>
                  <span className="font-medium text-slate-900 flex-1">
                    {mDetails.motherName || '-'}
                  </span>
                </div>

                {/* জন্ম তারিখ ও জাতীয়তা */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-b border-dashed border-slate-300 pb-1">
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-slate-900 shrink-0 w-28 sm:w-32">জন্ম তারিখঃ</span>
                    <span className="font-medium text-slate-900">{mDetails.dob || '-'}</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-slate-900 shrink-0 w-24">জাতীয়তাঃ</span>
                    <span className="font-medium text-slate-900">{mDetails.nationality || 'বাংলাদেশী'}</span>
                  </div>
                </div>

                {/* ধর্ম ও পেশা */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-b border-dashed border-slate-300 pb-1">
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-slate-900 shrink-0 w-28 sm:w-32">ধর্মঃ</span>
                    <span className="font-medium text-slate-900">{mDetails.religion || 'ইসলাম'}</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-slate-900 shrink-0 w-24">পেশাঃ</span>
                    <span className="font-medium text-slate-900">{mDetails.occupation || '-'}</span>
                  </div>
                </div>

                {/* স্থায়ী ঠিকানাঃ গ্রাম ও ডাকঘর */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-b border-dashed border-slate-300 pb-1">
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-slate-900 shrink-0 w-28 sm:w-32">স্থায়ী গ্রামঃ</span>
                    <span className="font-medium text-slate-900">{mDetails.permanentVillage || '-'}</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-slate-900 shrink-0 w-24">ডাকঘরঃ</span>
                    <span className="font-medium text-slate-900">{mDetails.permanentPost || '-'}</span>
                  </div>
                </div>

                {/* উপজেলা ও জেলা */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-b border-dashed border-slate-300 pb-1">
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-slate-900 shrink-0 w-28 sm:w-32">উপজেলাঃ</span>
                    <span className="font-medium text-slate-900">{mDetails.permanentUpazila || '-'}</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-slate-900 shrink-0 w-24">জেলাঃ</span>
                    <span className="font-medium text-slate-900">{mDetails.permanentDistrict || '-'}</span>
                  </div>
                </div>

                {/* বর্তমান ঠিকানা */}
                <div className="flex items-baseline gap-2 border-b border-dashed border-slate-300 pb-1">
                  <span className="font-bold text-slate-900 shrink-0 w-28 sm:w-32">বর্তমান ঠিকানাঃ</span>
                  <span className="font-medium text-slate-900 flex-1">
                    {mDetails.currentAddress || mDetails.permanentAddress || '-'}
                  </span>
                </div>

                {/* লিঙ্গ ও বৈবাহিক অবস্থা */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-b border-dashed border-slate-300 pb-1">
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-slate-900 shrink-0 w-28 sm:w-32">লিঙ্গঃ</span>
                    <span className="font-medium text-slate-900">{mDetails.gender || '-'}</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-slate-900 shrink-0 w-24">বৈবাহিক অবস্থাঃ</span>
                    <span className="font-medium text-slate-900">{mDetails.maritalStatus || '-'}</span>
                  </div>
                </div>

                {/* শিক্ষাগত যোগ্যতা ও ই-মেইল */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-b border-dashed border-slate-300 pb-1">
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-slate-900 shrink-0 w-28 sm:w-32">শিক্ষাগত যোগ্যতাঃ</span>
                    <span className="font-medium text-slate-900">{mDetails.education || '-'}</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-slate-900 shrink-0 w-24">ই-মেইলঃ</span>
                    <span className="font-medium text-slate-900 truncate">{member.email || mDetails.email || '-'}</span>
                  </div>
                </div>

                {/* মোবাইল নম্বর ও রক্তের গ্রুপ */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-b border-dashed border-slate-300 pb-1">
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-slate-900 shrink-0 w-28 sm:w-32">মোবাইল নাম্বারঃ</span>
                    <span className="font-bold text-emerald-950 font-mono">{member.phone || mDetails.phone || '-'}</span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="font-bold text-slate-900 shrink-0 w-24">রক্তের গ্রুপঃ</span>
                    <span className="font-bold text-red-700">{mDetails.bloodGroup || '-'}</span>
                  </div>
                </div>

                {/* জাতীয় পরিচয়পত্র / জন্ম নিবন্ধন */}
                <div className="flex items-baseline gap-2 border-b border-dashed border-slate-300 pb-1">
                  <span className="font-bold text-slate-900 shrink-0 w-28 sm:w-56">জাতীয় পরিচয়পত্র/জন্ম নিবন্ধনঃ</span>
                  <span className="font-bold text-slate-900 font-mono flex-1">
                    {mDetails.nid || '-'}
                  </span>
                </div>
              </div>

              {/* 4. Nominee Section */}
              <div className="pt-3 space-y-2.5">
                <div className="flex justify-center my-1.5">
                  <div className="bg-emerald-950 text-white font-bold text-xs sm:text-sm px-6 py-0.5 rounded-[3px] shadow-xs tracking-wide">
                    নমিনির নাম ও ঠিকানা
                  </div>
                </div>

                <div className="space-y-2.5 text-xs sm:text-sm">
                  {/* নমিনির নাম ও পিতার নাম */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-b border-dashed border-slate-300 pb-1">
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-slate-900 shrink-0 w-28 sm:w-32">নমিনির নামঃ</span>
                      <span className="font-bold text-slate-900">{mDetails.nomineeName || '-'}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-slate-900 shrink-0 w-24">পিতার নামঃ</span>
                      <span className="font-medium text-slate-900">{mDetails.nomineeFatherName || '-'}</span>
                    </div>
                  </div>

                  {/* উপজেলা ও জেলা */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-b border-dashed border-slate-300 pb-1">
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-slate-900 shrink-0 w-28 sm:w-32">উপজেলাঃ</span>
                      <span className="font-medium text-slate-900">{mDetails.nomineeUpazila || '-'}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-slate-900 shrink-0 w-24">জেলাঃ</span>
                      <span className="font-medium text-slate-900">{mDetails.nomineeDistrict || '-'}</span>
                    </div>
                  </div>

                  {/* সম্পর্ক ও মোবাইল */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border-b border-dashed border-slate-300 pb-1">
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-slate-900 shrink-0 w-28 sm:w-32">নমিনির সম্পর্কঃ</span>
                      <span className="font-medium text-slate-900">{mDetails.nomineeRelation || '-'}</span>
                    </div>
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-slate-900 shrink-0 w-24">মোবাইলঃ</span>
                      <span className="font-medium text-slate-900 font-mono">{mDetails.nomineePhone || '-'}</span>
                    </div>
                  </div>

                  {/* নমিনির NID */}
                  <div className="flex items-baseline gap-2 border-b border-dashed border-slate-300 pb-1">
                    <span className="font-bold text-slate-900 shrink-0 w-28 sm:w-56">জাতীয় পরিচয়পত্র/জন্ম নিবন্ধনঃ</span>
                    <span className="font-medium text-slate-900 font-mono flex-1">
                      {mDetails.nomineeNid || '-'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 5. Savings Commitment */}
              <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-[4px] flex flex-col sm:flex-row items-center justify-between gap-2 text-xs sm:text-sm">
                <span className="font-bold text-emerald-950">
                  মাসিক সঞ্চয় অঙ্গীকার (টাকা):
                </span>
                <div className="font-bold text-emerald-900 text-sm sm:text-base font-sans bg-white px-4 py-1 rounded border border-emerald-300 shadow-xs">
                  ৳ {Number(monthlyPledgeAmount).toLocaleString()} (টাকা) / প্রতি মাস
                </div>
              </div>

              {/* 6. Signatures */}
              <div className="pt-10 sm:pt-14 pb-2 grid grid-cols-2 gap-4">
                {/* President Signature */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-36 sm:w-48 border-t-2 border-dotted border-slate-700 pt-1 text-xs sm:text-sm font-bold text-slate-800">
                    সভাপতি
                  </div>
                  <span className="text-[10px] text-slate-500 mt-0.5">
                    আল-বারাকাহ্ সমবায় সমিতি
                  </span>
                  <span className="text-[9px] text-emerald-800 font-semibold mt-0.5">
                    (অনুমোদিত ও রেকর্ডভুক্ত)
                  </span>
                </div>

                {/* Applicant Signature */}
                <div className="flex flex-col items-center text-center">
                  <div className="w-44 sm:w-56 border-t-2 border-dotted border-slate-700 pt-1 text-xs sm:text-sm font-bold text-slate-800">
                    আবেদনকারীর স্বাক্ষর এবং তারিখ
                  </div>
                  <span className="text-[11px] font-bold text-emerald-950 mt-0.5 font-mono">
                    {mDetails.applicantSignature || member.name}
                  </span>
                  <span className="text-[10px] text-slate-500">
                    {admissionDate}
                  </span>
                </div>
              </div>

              {/* Verification Stamp Banner */}
              <div className="mt-4 pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
                <div className="flex items-center gap-1.5 text-emerald-900 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>আল-বারাকাহ্ সোসাইটি অফিসিয়াল রেকর্ডভুক্ত মূল আবেদন ফরম</span>
                </div>
                <div>
                  মোট জমাকৃত তহবিল: <span className="font-bold text-emerald-900 font-sans">{formatCurrency(member.totalDeposited || 0)}</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500 hidden sm:block">
            ক্লিক করে প্রিন্ট করুন অথবা বন্ধ করে পূর্বের তালিকায় ফিরে যান।
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handlePrint}
              type="button"
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-900 hover:bg-emerald-950 text-gold-300 font-bold text-xs rounded-[6px] transition-all shadow-sm"
            >
              <Printer className="w-3.5 h-3.5 text-gold-400" />
              <span>প্রিন্ট প্রিভিউ / PDF</span>
            </button>
            <button
              onClick={handleClose}
              type="button"
              className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs rounded-[6px] transition-colors"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
