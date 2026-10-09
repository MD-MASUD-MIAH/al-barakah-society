import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  CheckCircle,
  Clock,
  Printer,
  Sparkles,
  ArrowRight,
  AlertCircle,
  RefreshCw,
  Download,
  Building,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";
import { showSuccessAlert, showErrorAlert } from "../utils/alerts";
import { PhotoUpload } from "../components/common/PhotoUpload";

export const ApplyMembershipPage = () => {
  const { user, refreshUser, isApproved } = useAuth();
  const navigate = useNavigate();

  // Initial form values from existing profile or membership details
  const [formData, setFormData] = useState({
    // Header
    formNo:
      user?.membershipDetails?.formNo ||
      `ABS-${Date.now().toString().slice(-6)}`,
    admissionDate:
      user?.membershipDetails?.admissionDate ||
      new Date().toISOString().split("T")[0],
    avatar: user?.avatar || "",

    // Member Personal Details
    name: user?.name || "",
    fatherOrHusbandName: user?.membershipDetails?.fatherOrHusbandName || "",
    motherName: user?.membershipDetails?.motherName || "",
    dob: user?.membershipDetails?.dob || "",
    nationality: user?.membershipDetails?.nationality || "বাংলাদেশী",
    religion: user?.membershipDetails?.religion || "ইসলাম",
    occupation: user?.membershipDetails?.occupation || "",
    permanentVillage: user?.membershipDetails?.permanentVillage || "",
    permanentPost: user?.membershipDetails?.permanentPost || "",
    permanentUpazila: user?.membershipDetails?.permanentUpazila || "",
    permanentDistrict: user?.membershipDetails?.permanentDistrict || "",
    currentAddress: user?.membershipDetails?.currentAddress || "",
    gender: user?.membershipDetails?.gender || "পুরুষ",
    maritalStatus: user?.membershipDetails?.maritalStatus || "বিবাহিত",
    education: user?.membershipDetails?.education || "",
    email: user?.email || "",
    phone: user?.phone || "",
    bloodGroup: user?.membershipDetails?.bloodGroup || "O+",
    nid: user?.membershipDetails?.nid || "",

    // Nominee Details
    nomineeName: user?.membershipDetails?.nomineeName || "",
    nomineeFatherName: user?.membershipDetails?.nomineeFatherName || "",
    nomineeUpazila: user?.membershipDetails?.nomineeUpazila || "",
    nomineeDistrict: user?.membershipDetails?.nomineeDistrict || "",
    nomineeRelation: user?.membershipDetails?.nomineeRelation || "",
    nomineePhone: user?.membershipDetails?.nomineePhone || "",
    nomineeNid: user?.membershipDetails?.nomineeNid || "",

    // Society Specific
    monthlyPledge: user?.membershipDetails?.monthlyPledge || 1000,
    joinReason:
      user?.membershipDetails?.joinReason ||
      "সমিতির মাধ্যমে হালাল সঞ্চয় ও বরকতময় আর্থিক কল্যাণ",
    applicantSignature:
      user?.membershipDetails?.applicantSignature || user?.name || "",
  });

  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (base64Photo) => {
    setFormData((prev) => ({ ...prev, avatar: base64Photo }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!formData.name.trim()) {
      setError("অনুগ্রহ করে প্রার্থীর নাম প্রদান করুন");
      return;
    }
    if (!formData.fatherOrHusbandName.trim()) {
      setError("অনুগ্রহ করে পিতা / স্বামীর নাম প্রদান করুন");
      return;
    }
    if (!formData.phone.trim()) {
      setError("অনুগ্রহ করে মোবাইল নম্বর প্রদান করুন");
      return;
    }
    if (!formData.nid.trim()) {
      setError(
        "অনুগ্রহ করে আবেদনকারীর জাতীয় পরিচয়পত্র / জন্ম নিবন্ধন নং প্রদান করুন",
      );
      return;
    }
    if (!formData.nomineeName.trim()) {
      setError("অনুগ্রহ করে মনোনীত নমিনির নাম প্রদান করুন");
      return;
    }

    try {
      setLoading(true);
      const res = await api.post("/users/apply-membership", formData);
      if (res.data.success) {
        setSuccessMsg(res.data.message);
        await showSuccessAlert(
          "আবেদন সফলভাবে দাখিল হয়েছে!",
          "আপনার ভর্তি ফরমটি সফলভাবে জমা হয়েছে। অ্যাডমিন অনুমোদনের পর সম্পূর্ণ সেবা পাবেন।",
        );
        await refreshUser();
      } else {
        setError(res.data.message);
        showErrorAlert("ব্যর্থ হয়েছে", res.data.message);
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        "আবেদন জমা করতে ব্যর্থ হয়েছে। অনুগ্রহ করে পুনরায় চেষ্টা করুন।";
      setError(msg);
      showErrorAlert("ব্যর্থ হয়েছে", msg);
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCheckStatus = async () => {
    try {
      setChecking(true);
      await refreshUser();
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-4 sm:py-8 px-2 sm:px-4 space-y-6">
      {/* Top Action Bar (Hidden in Print) */}
      <div className="print:hidden flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded-[6px] border border-slate-200 shadow-sm">
        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-emerald-800" />
            <span>সদস্য ভর্তি ফরম (Membership Application Form)</span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            অফিসিয়াল ভর্তি ফরমটি পূরণ করে সরাসরি সদস্যপদের আবেদন দাখিল করুন
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs rounded-[6px] transition-all border border-slate-300"
            title="ফরম প্রিন্ট বা পিডিএফ সেভ করুন"
          >
            <Printer className="w-4 h-4 text-emerald-800" />
            <span>প্রিন্ট / PDF</span>
          </button>

          {user?.status === "pending" && (
            <button
              type="button"
              onClick={handleCheckStatus}
              disabled={checking}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-50 hover:bg-amber-100 text-amber-900 font-semibold text-xs rounded-[6px] transition-all border border-amber-300"
            >
              <RefreshCw
                className={`w-3.5 h-3.5 ${checking ? "animate-spin" : ""}`}
              />
              <span>স্ট্যাটাস রিফ্রেশ</span>
            </button>
          )}
        </div>
      </div>

      {/* Status Notice Banner (Hidden in Print) */}
      {isApproved ? (
        <div className="print:hidden p-4 bg-emerald-50 rounded-[6px] border border-emerald-300 text-xs text-emerald-950 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <CheckCircle className="w-6 h-6 text-emerald-700 shrink-0" />
            <div>
              <p className="font-bold text-sm text-emerald-900">
                অভিনন্দন, {user?.name}! আপনি অনুমোদিত সদস্য।
              </p>
              <p className="text-emerald-800">
                আপনার ফরমের তথ্য নিচে প্রদর্শিত হচ্ছে। প্রয়োজনে আপনি প্রিন্ট
                কপি সংগ্রহ করে রাখতে পারেন।
              </p>
            </div>
          </div>
          <button
            onClick={() => navigate("/dashboard")}
            className="px-4 py-2 bg-emerald-900 text-white rounded-[6px] font-bold text-xs hover:bg-emerald-950 transition-all shrink-0"
          >
            ড্যাশবোর্ডে যান
          </button>
        </div>
      ) : user?.status === "pending" ? (
        <div className="print:hidden p-4 bg-amber-50 rounded-[6px] border border-amber-300 text-xs text-amber-950 flex items-center gap-3">
          <Clock className="w-6 h-6 text-amber-700 shrink-0" />
          <div>
            <p className="font-bold text-sm text-amber-900">
              আপনার ভর্তি আবেদন পর্যালোচনায় রয়েছে (Pending Approval)
            </p>
            <p className="text-amber-800 mt-0.5">
              অ্যাডমিন যাচাই করার পর আপনার সদস্যপদ অনুমোদন করা হবে। নিচে আপনার
              দাখিলকৃত তথ্যাদি দেখতে পাচ্ছেন।
            </p>
          </div>
        </div>
      ) : null}

      {/* Error / Success Notifications */}
      {error && (
        <div className="print:hidden p-3 bg-red-50 border border-red-200 rounded-[6px] text-xs text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
          <span>{error}</span>
        </div>
      )}

      {successMsg && (
        <div className="print:hidden p-3 bg-emerald-50 border border-emerald-200 rounded-[6px] text-xs text-emerald-800 flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0 text-emerald-600" />
          <span>{successMsg}</span>
        </div>
      )}

      {/* 
        ========================================================================
        AUTHENTIC PHYSICAL ADMISSION FORM CONTAINER (MATCHES EXACT PAPER IMAGE)
        ========================================================================
      */}
      <form onSubmit={handleSubmit} className="print:m-0 print:p-0">
        <div className="bg-white border-2 border-emerald-950 rounded-none sm:rounded-[4px] shadow-md relative overflow-hidden text-slate-900 print:border-none print:shadow-none">
          {/* Subtle Authentic Background Watermark */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.035] select-none z-0">
            <div className="flex flex-col items-center text-center">
              <img
                src="/logo-al-barakah.png"
                alt="Watermark Logo"
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

          <div className="relative z-10 p-3 sm:p-6 md:p-8 space-y-4">
            {/* 
              ------------------------------------------------------------------
              1. HEADER SECTION (Cream Top Banner + Logo + Title + Photo Box)
              ------------------------------------------------------------------
            */}
            <div className="bg-[#fefce8] border border-amber-300/80 rounded-[4px] p-3 sm:p-4 relative">
              {/* Islamic Invocation */}
              <div className="text-center font-serif text-sm sm:text-base font-bold text-slate-800 tracking-wide mb-2 sm:mb-3">
                বিসমিল্লাহির রাহমানির রাহিম
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
                {/* Left: Official Circular Emblem Logo */}
                <div className="flex items-center gap-3 shrink-0">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-emerald-800 p-1 bg-white shadow-sm flex items-center justify-center">
                    <img
                      src="/logo-al-barakah.png"
                      alt="Al-Barakah Logo"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                {/* Center: Official Title, Pill Slogan & Address */}
                <div className="flex-1 text-center space-y-1.5 px-2">
                  <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-slate-950 tracking-tight font-serif">
                    আল-বারাকাহ্ বহুমুখী সমবায় সমিতি
                  </h2>

                  {/* Slogan in Rounded Pill Badge */}
                  <div className="inline-block bg-emerald-800 text-white text-xs sm:text-sm font-semibold px-4 py-0.5 rounded-full shadow-sm">
                    একত্রে গড়ি সঞ্চয়, বরকতময় সুদিনের নিশ্চয়
                  </div>

                  <p className="text-xs sm:text-sm font-bold text-slate-800">
                    ঘড়িষার, নড়িয়া, শরীয়তপুর
                  </p>
                  <p className="text-[11px] sm:text-xs font-semibold text-slate-700">
                    স্থাপিতঃ ২০২৬ ইং
                  </p>
                </div>

                {/* Right: Direct Passport Photo Upload Box */}
                <div className="shrink-0 flex flex-col items-center">
                  <PhotoUpload
                    shape="passport"
                    value={formData.avatar}
                    onChange={handlePhotoChange}
                    label="ছবি"
                  />
                  <span className="text-[10px] text-slate-500 mt-1 print:hidden">
                    (সরাসরি ছবি তুলুন / দিন)
                  </span>
                </div>
              </div>
            </div>

            {/* Solid Dark Green Divider Bar */}
            <div className="h-1 bg-emerald-800 w-full rounded-full"></div>

            {/* 
              ------------------------------------------------------------------
              2. SUB-BAR: Form No | Center Ribbon "সদস্য ভর্তি ফরম" | Admission Date
              ------------------------------------------------------------------
            */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-1 pb-2">
              {/* Left: Form No Box */}
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-900 w-full sm:w-auto justify-start">
                <span className="shrink-0">ফরম নং-</span>
                <input
                  type="text"
                  name="formNo"
                  value={formData.formNo}
                  onChange={handleChange}
                  className="w-28 sm:w-32 px-2 py-0.5 text-xs font-mono font-bold border border-slate-400 bg-white rounded-[2px] focus:outline-none focus:border-emerald-700"
                />
              </div>

              {/* Center Ribbon / Banner Badge */}
              <div className="relative">
                <div className="bg-emerald-950 text-white font-bold text-sm sm:text-base px-6 sm:px-8 py-1 rounded-[3px] shadow-sm tracking-wide">
                  সদস্য ভর্তি ফরম
                </div>
              </div>

              {/* Right: Admission Date */}
              <div className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-slate-900 w-full sm:w-auto justify-end">
                <span className="shrink-0">ভর্তির তারিখঃ</span>
                <input
                  type="date"
                  name="admissionDate"
                  value={formData.admissionDate}
                  onChange={handleChange}
                  className="w-32 sm:w-36 px-2 py-0.5 text-xs font-sans font-bold border border-slate-400 bg-white rounded-[2px] focus:outline-none focus:border-emerald-700"
                />
              </div>
            </div>

            {/* 
              ------------------------------------------------------------------
              3. MEMBER PERSONAL DETAILS (Exact lines matching paper form)
              ------------------------------------------------------------------
            */}
            <div className="space-y-3 pt-1 text-xs sm:text-sm">
              {/* নামঃ */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <label className="font-bold text-slate-900 shrink-0 sm:w-28">
                  নামঃ <span className="text-red-600">*</span>
                </label>
                <div className="flex-1 border-b border-dashed border-slate-500 focus-within:border-emerald-800">
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="আবেদনকারীর পূর্ণ নাম লিখুন"
                    className="w-full bg-transparent py-1 px-1 text-slate-900 font-semibold focus:outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* পিতা/স্বামীঃ */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <label className="font-bold text-slate-900 shrink-0 sm:w-28">
                  পিতা/স্বামীঃ <span className="text-red-600">*</span>
                </label>
                <div className="flex-1 border-b border-dashed border-slate-500 focus-within:border-emerald-800">
                  <input
                    type="text"
                    name="fatherOrHusbandName"
                    required
                    value={formData.fatherOrHusbandName}
                    onChange={handleChange}
                    placeholder="পিতা অথবা স্বামীর নাম"
                    className="w-full bg-transparent py-1 px-1 text-slate-900 font-semibold focus:outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* মাতাঃ */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <label className="font-bold text-slate-900 shrink-0 sm:w-28">
                  মাতাঃ
                </label>
                <div className="flex-1 border-b border-dashed border-slate-500 focus-within:border-emerald-800">
                  <input
                    type="text"
                    name="motherName"
                    value={formData.motherName}
                    onChange={handleChange}
                    placeholder="মাতার নাম লিখুন"
                    className="w-full bg-transparent py-1 px-1 text-slate-900 font-semibold focus:outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* জন্ম তারিখঃ | জাতীয়তাঃ */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
                <div className="flex items-center gap-2">
                  <label className="font-bold text-slate-900 shrink-0 sm:w-28">
                    জন্ম তারিখঃ
                  </label>
                  <div className="flex-1 border-b border-dashed border-slate-500 focus-within:border-emerald-800">
                    <input
                      type="date"
                      name="dob"
                      value={formData.dob}
                      onChange={handleChange}
                      className="w-full bg-transparent py-1 px-1 text-slate-900 font-semibold focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="font-bold text-slate-900 shrink-0 sm:w-24">
                    জাতীয়তাঃ
                  </label>
                  <div className="flex-1 border-b border-dashed border-slate-500 focus-within:border-emerald-800">
                    <input
                      type="text"
                      name="nationality"
                      value={formData.nationality}
                      onChange={handleChange}
                      className="w-full bg-transparent py-1 px-1 text-slate-900 font-semibold focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* ধর্মঃ | পেশাঃ */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
                <div className="flex items-center gap-2">
                  <label className="font-bold text-slate-900 shrink-0 sm:w-28">
                    ধর্মঃ
                  </label>
                  <div className="flex-1 border-b border-dashed border-slate-500 focus-within:border-emerald-800">
                    <input
                      type="text"
                      name="religion"
                      value={formData.religion}
                      onChange={handleChange}
                      className="w-full bg-transparent py-1 px-1 text-slate-900 font-semibold focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="font-bold text-slate-900 shrink-0 sm:w-24">
                    পেশাঃ
                  </label>
                  <div className="flex-1 border-b border-dashed border-slate-500 focus-within:border-emerald-800">
                    <input
                      type="text"
                      name="occupation"
                      value={formData.occupation}
                      onChange={handleChange}
                      placeholder="যেমন: ব্যবসা / চাকরি / প্রবাসী"
                      className="w-full bg-transparent py-1 px-1 text-slate-900 font-semibold focus:outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>

              {/* স্থায়ী ঠিকানাঃ গ্রামঃ | ডাকঘরঃ */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
                <div className="flex items-center gap-2">
                  <label className="font-bold text-slate-900 shrink-0 sm:w-28 text-[11px] sm:text-xs">
                    স্থায়ী ঠিকানাঃ গ্রামঃ
                  </label>
                  <div className="flex-1 border-b border-dashed border-slate-500 focus-within:border-emerald-800">
                    <input
                      type="text"
                      name="permanentVillage"
                      value={formData.permanentVillage}
                      onChange={handleChange}
                      placeholder="গ্রামের নাম"
                      className="w-full bg-transparent py-1 px-1 text-slate-900 font-semibold focus:outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="font-bold text-slate-900 shrink-0 sm:w-24">
                    ডাকঘরঃ
                  </label>
                  <div className="flex-1 border-b border-dashed border-slate-500 focus-within:border-emerald-800">
                    <input
                      type="text"
                      name="permanentPost"
                      value={formData.permanentPost}
                      onChange={handleChange}
                      placeholder="ডাকঘর / পোস্ট কোড"
                      className="w-full bg-transparent py-1 px-1 text-slate-900 font-semibold focus:outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>

              {/* উপজেলাঃ | জেলাঃ */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
                <div className="flex items-center gap-2">
                  <label className="font-bold text-slate-900 shrink-0 sm:w-28">
                    উপজেলাঃ
                  </label>
                  <div className="flex-1 border-b border-dashed border-slate-500 focus-within:border-emerald-800">
                    <input
                      type="text"
                      name="permanentUpazila"
                      value={formData.permanentUpazila}
                      onChange={handleChange}
                      placeholder="উপজেলা / থানা"
                      className="w-full bg-transparent py-1 px-1 text-slate-900 font-semibold focus:outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="font-bold text-slate-900 shrink-0 sm:w-24">
                    জেলাঃ
                  </label>
                  <div className="flex-1 border-b border-dashed border-slate-500 focus-within:border-emerald-800">
                    <input
                      type="text"
                      name="permanentDistrict"
                      value={formData.permanentDistrict}
                      onChange={handleChange}
                      placeholder="জেলার নাম"
                      className="w-full bg-transparent py-1 px-1 text-slate-900 font-semibold focus:outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>

              {/* বর্তমান ঠিকানাঃ */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <label className="font-bold text-slate-900 shrink-0 sm:w-28">
                  বর্তমান ঠিকানাঃ
                </label>
                <div className="flex-1 border-b border-dashed border-slate-500 focus-within:border-emerald-800">
                  <input
                    type="text"
                    name="currentAddress"
                    value={formData.currentAddress}
                    onChange={handleChange}
                    placeholder="বর্তমান বসবাসের বিস্তারিত ঠিকানা"
                    className="w-full bg-transparent py-1 px-1 text-slate-900 font-semibold focus:outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              {/* লিঙ্গঃ | বৈবাহিক অবস্থাঃ */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
                <div className="flex items-center gap-2">
                  <label className="font-bold text-slate-900 shrink-0 sm:w-28">
                    লিঙ্গঃ
                  </label>
                  <div className="flex-1 border-b border-dashed border-slate-500 focus-within:border-emerald-800">
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleChange}
                      className="w-full bg-transparent py-1 px-1 text-slate-900 font-semibold focus:outline-none"
                    >
                      <option value="পুরুষ">পুরুষ</option>
                      <option value="মহিলা">মহিলা</option>
                      <option value="অন্যান্য">অন্যান্য</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="font-bold text-slate-900 shrink-0 sm:w-24">
                    বৈবাহিক অবস্থাঃ
                  </label>
                  <div className="flex-1 border-b border-dashed border-slate-500 focus-within:border-emerald-800">
                    <select
                      name="maritalStatus"
                      value={formData.maritalStatus}
                      onChange={handleChange}
                      className="w-full bg-transparent py-1 px-1 text-slate-900 font-semibold focus:outline-none"
                    >
                      <option value="বিবাহিত">বিবাহিত</option>
                      <option value="অবিবাহিত">অবিবাহিত</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* শিক্ষাগত যোগ্যতাঃ | ই-মেইলঃ */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
                <div className="flex items-center gap-2">
                  <label className="font-bold text-slate-900 shrink-0 sm:w-28 text-[11px] sm:text-xs">
                    শিক্ষাগত যোগ্যতাঃ
                  </label>
                  <div className="flex-1 border-b border-dashed border-slate-500 focus-within:border-emerald-800">
                    <input
                      type="text"
                      name="education"
                      value={formData.education}
                      onChange={handleChange}
                      placeholder="যেমন: এস.এস.সি / এইচ.এস.সি / ডিগ্রি"
                      className="w-full bg-transparent py-1 px-1 text-slate-900 font-semibold focus:outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="font-bold text-slate-900 shrink-0 sm:w-24">
                    ই-মেইলঃ
                  </label>
                  <div className="flex-1 border-b border-dashed border-slate-500 focus-within:border-emerald-800">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="example@mail.com"
                      className="w-full bg-transparent py-1 px-1 text-slate-900 font-semibold focus:outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>

              {/* মোবাইল নাম্বারঃ | রক্তের গ্রুপঃ */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
                <div className="flex items-center gap-2">
                  <label className="font-bold text-slate-900 shrink-0 sm:w-28">
                    মোবাইল নাম্বারঃ <span className="text-red-600">*</span>
                  </label>
                  <div className="flex-1 border-b border-dashed border-slate-500 focus-within:border-emerald-800">
                    <input
                      type="text"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="01XXXXXXXXX"
                      className="w-full bg-transparent py-1 px-1 text-slate-900 font-semibold focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="font-bold text-slate-900 shrink-0 sm:w-24">
                    রক্তের গ্রুপঃ
                  </label>
                  <div className="flex-1 border-b border-dashed border-slate-500 focus-within:border-emerald-800">
                    <select
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleChange}
                      className="w-full bg-transparent py-1 px-1 text-slate-900 font-semibold focus:outline-none"
                    >
                      <option value="A+">A+ (পজিটিভ)</option>
                      <option value="A-">A- (নেগেটিভ)</option>
                      <option value="B+">B+ (পজিটিভ)</option>
                      <option value="B-">B- (নেগেটিভ)</option>
                      <option value="O+">O+ (পজিটিভ)</option>
                      <option value="O-">O- (নেগেটিভ)</option>
                      <option value="AB+">AB+ (পজিটিভ)</option>
                      <option value="AB-">AB- (নেগেটিভ)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* আবেদনকারীর জাতীয় পরিচয়পত্র / জন্ম নিবন্ধন নং */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 pt-1">
                <label className="font-bold text-slate-900 shrink-0 sm:w-56 text-xs sm:text-sm">
                  জাতীয় পরিচয়পত্র/জন্ম নিবন্ধনঃ{" "}
                  <span className="text-red-600">*</span>
                </label>
                <div className="flex-1 border-b border-dashed border-slate-500 focus-within:border-emerald-800">
                  <input
                    type="text"
                    name="nid"
                    required
                    value={formData.nid}
                    onChange={handleChange}
                    placeholder="আবেদনকারীর NID বা জন্ম নিবন্ধন নম্বর"
                    className="w-full bg-transparent py-1 px-1 text-slate-900 font-semibold focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 
              ------------------------------------------------------------------
              4. NOMINEE SECTION RIBBON & FIELDS (Matches paper form)
              ------------------------------------------------------------------
            */}
            <div className="pt-4 space-y-3">
              {/* Center Ribbon / Banner Badge for Nominee */}
              <div className="flex justify-center my-2">
                <div className="bg-emerald-950 text-white font-bold text-xs sm:text-sm px-6 sm:px-8 py-1 rounded-[3px] shadow-sm tracking-wide">
                  নমিনির নাম ও ঠিকানা
                </div>
              </div>

              {/* নামঃ | পিতার নামঃ */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
                <div className="flex items-center gap-2">
                  <label className="font-bold text-slate-900 shrink-0 sm:w-28">
                    নামঃ <span className="text-red-600">*</span>
                  </label>
                  <div className="flex-1 border-b border-dashed border-slate-500 focus-within:border-emerald-800">
                    <input
                      type="text"
                      name="nomineeName"
                      required
                      value={formData.nomineeName}
                      onChange={handleChange}
                      placeholder="মনোনীত নমিনির নাম"
                      className="w-full bg-transparent py-1 px-1 text-slate-900 font-semibold focus:outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="font-bold text-slate-900 shrink-0 sm:w-24">
                    পিতার নামঃ
                  </label>
                  <div className="flex-1 border-b border-dashed border-slate-500 focus-within:border-emerald-800">
                    <input
                      type="text"
                      name="nomineeFatherName"
                      value={formData.nomineeFatherName}
                      onChange={handleChange}
                      placeholder="নমিনির পিতার নাম"
                      className="w-full bg-transparent py-1 px-1 text-slate-900 font-semibold focus:outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>

              {/* উপজেলাঃ | জেলাঃ */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
                <div className="flex items-center gap-2">
                  <label className="font-bold text-slate-900 shrink-0 sm:w-28">
                    উপজেলাঃ
                  </label>
                  <div className="flex-1 border-b border-dashed border-slate-500 focus-within:border-emerald-800">
                    <input
                      type="text"
                      name="nomineeUpazila"
                      value={formData.nomineeUpazila}
                      onChange={handleChange}
                      placeholder="নমিনির উপজেলা"
                      className="w-full bg-transparent py-1 px-1 text-slate-900 font-semibold focus:outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="font-bold text-slate-900 shrink-0 sm:w-24">
                    জেলাঃ
                  </label>
                  <div className="flex-1 border-b border-dashed border-slate-500 focus-within:border-emerald-800">
                    <input
                      type="text"
                      name="nomineeDistrict"
                      value={formData.nomineeDistrict}
                      onChange={handleChange}
                      placeholder="নমিনির জেলা"
                      className="w-full bg-transparent py-1 px-1 text-slate-900 font-semibold focus:outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>

              {/* নমিনির সম্পর্কঃ | মোবাইলঃ */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-6">
                <div className="flex items-center gap-2">
                  <label className="font-bold text-slate-900 shrink-0 sm:w-28">
                    নমিনির সম্পর্কঃ
                  </label>
                  <div className="flex-1 border-b border-dashed border-slate-500 focus-within:border-emerald-800">
                    <input
                      type="text"
                      name="nomineeRelation"
                      value={formData.nomineeRelation}
                      onChange={handleChange}
                      placeholder="যেমন: স্ত্রী / পুত্র / কন্যা / মাতা"
                      className="w-full bg-transparent py-1 px-1 text-slate-900 font-semibold focus:outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <label className="font-bold text-slate-900 shrink-0 sm:w-24">
                    মোবাইলঃ
                  </label>
                  <div className="flex-1 border-b border-dashed border-slate-500 focus-within:border-emerald-800">
                    <input
                      type="text"
                      name="nomineePhone"
                      value={formData.nomineePhone}
                      onChange={handleChange}
                      placeholder="নমিনির ফোন নম্বর"
                      className="w-full bg-transparent py-1 px-1 text-slate-900 font-semibold focus:outline-none placeholder:text-slate-400"
                    />
                  </div>
                </div>
              </div>

              {/* জাতীয় পরিচয়পত্র/জন্ম নিবন্ধনঃ (নমিনির) */}
              <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2">
                <label className="font-bold text-slate-900 shrink-0 sm:w-56 text-xs sm:text-sm">
                  জাতীয় পরিচয়পত্র/জন্ম নিবন্ধনঃ
                </label>
                <div className="flex-1 border-b border-dashed border-slate-500 focus-within:border-emerald-800">
                  <input
                    type="text"
                    name="nomineeNid"
                    value={formData.nomineeNid}
                    onChange={handleChange}
                    placeholder="নমিনির জাতীয় পরিচয়পত্র বা জন্ম নিবন্ধন নং"
                    className="w-full bg-transparent py-1 px-1 text-slate-900 font-semibold focus:outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>
            </div>

            {/* 
              ------------------------------------------------------------------
              5. SOCIETY SAVINGS COMMITMENT (PLEDGE)
              ------------------------------------------------------------------
            */}
            <div className="p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-[4px] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
              <span className="font-bold text-emerald-950">
                মাসিক সঞ্চয় অঙ্গীকার (টাকা):
              </span>
              <div className="flex items-center gap-2">
                <select
                  name="monthlyPledge"
                  value={formData.monthlyPledge}
                  onChange={handleChange}
                  className="bg-white px-3 py-1.5 font-bold text-emerald-900 border border-emerald-400 rounded-[3px] focus:outline-none"
                >
                  <option value={500}>৳ ৫০০ (টাকা)</option>
                  <option value={1000}>৳ ১,০০০ (টাকা)</option>
                  <option value={1500}>৳ ১,৫০০ (টাকা)</option>
                  <option value={2000}>৳ ২,০০০ (টাকা)</option>
                  <option value={3000}>৳ ৩,০০০ (টাকা)</option>
                  <option value={5000}>৳ ৫,০০০ (টাকা)</option>
                </select>
                <span className="text-[11px] text-slate-500">/ প্রতি মাস</span>
              </div>
            </div>

            {/* 
              ------------------------------------------------------------------
              6. SIGNATURE FOOTER (Exact structure matching paper document)
              ------------------------------------------------------------------
            */}
            <div className="pt-12 sm:pt-16 pb-4 grid grid-cols-2 gap-4">
              {/* President Signature */}
              <div className="flex flex-col items-center text-center">
                <div className="w-36 sm:w-48 border-t-2 border-dotted border-slate-700 pt-1 text-xs sm:text-sm font-bold text-slate-800">
                  সভাপতি
                </div>
                <span className="text-[10px] text-slate-500 mt-0.5">
                  আল-বারাকাহ্ সমবায় সমিতি
                </span>
              </div>

              {/* Applicant Signature */}
              <div className="flex flex-col items-center text-center">
                <div className="w-44 sm:w-60 border-t-2 border-dotted border-slate-700 pt-1 text-xs sm:text-sm font-bold text-slate-800">
                  আবেদনকারীর স্বাক্ষর এবং তারিখ
                </div>
                <span className="text-[10px] font-semibold text-emerald-900 mt-0.5 font-mono">
                  {formData.name || "স্বাক্ষরিত"} ({formData.admissionDate})
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 
          ----------------------------------------------------------------------
          7. ACTION BUTTONS (SUBMIT & PRINT) - Hidden during print
          ----------------------------------------------------------------------
        */}
        <div className="print:hidden pt-4 flex flex-col sm:flex-row items-center justify-end gap-3">
          <button
            type="button"
            onClick={handlePrint}
            className="w-full sm:w-auto px-5 py-3 rounded-[6px] border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-sm"
          >
            <Printer className="w-4 h-4 text-emerald-800" />
            <span>প্রিন্ট প্রিভিউ / সেভ</span>
          </button>

          {!isApproved && (
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto px-7 py-3 rounded-[6px] bg-emerald-900 hover:bg-emerald-950 text-gold-300 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md disabled:opacity-50"
            >
              <span>{loading ? "আবেদন জমা হচ্ছে..." : "আবেদন জমা"}</span>
              <ArrowRight className="w-4 h-4 text-gold-400" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
