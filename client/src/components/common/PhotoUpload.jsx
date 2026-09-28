import React, { useRef, useState } from 'react';
import { Camera, Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { compressImage } from '../../utils/imageUpload';

/**
 * Reusable Photo Upload Component with instant preview and client compression.
 * Props:
 * - value: base64 string or image URL
 * - onChange: callback(base64String)
 * - shape: 'passport' | 'circle' (default 'passport')
 * - label: text label
 * - required: boolean
 * - maxWidth, maxHeight, quality
 */
export const PhotoUpload = ({
  value,
  onChange,
  shape = 'passport',
  label = 'ছবি আপলোড',
  required = false,
  className = '',
}) => {
  const fileInputRef = useRef(null);
  const [compressing, setCompressing] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setCompressing(true);

    try {
      // Compress to max 400x400 to keep it featherlight (<50KB)
      const compressedBase64 = await compressImage(file, {
        maxWidth: 400,
        maxHeight: 400,
        quality: 0.82,
      });
      onChange(compressedBase64);
    } catch (err) {
      setError(err.message || 'ছবি আপলোড করতে ব্যর্থ হয়েছে');
    } finally {
      setCompressing(false);
      // Reset input value so re-selecting same file triggers change
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleRemove = (e) => {
    e.stopPropagation();
    onChange('');
    setError('');
  };

  if (shape === 'circle') {
    return (
      <div className={`flex flex-col items-center gap-2 ${className}`}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <div
          onClick={() => fileInputRef.current?.click()}
          className="relative group w-24 h-24 rounded-full border-2 border-dashed border-emerald-500/50 hover:border-emerald-600 bg-slate-50 flex items-center justify-center overflow-hidden cursor-pointer shadow-sm transition-all"
          title="ছবি আপলোড করতে ক্লিক করুন"
        >
          {compressing ? (
            <div className="flex flex-col items-center justify-center gap-1 text-emerald-700">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-[10px] font-semibold">প্রসেসিং...</span>
            </div>
          ) : value ? (
            <>
              <img
                src={value}
                alt="Uploaded avatar"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity text-white text-[10px] font-bold gap-1">
                <Camera className="w-5 h-5" />
                <span>পরিবর্তন</span>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center gap-1 text-slate-400 group-hover:text-emerald-700 transition-colors">
              <Camera className="w-6 h-6" />
              <span className="text-[10px] font-medium text-slate-600">ছবি দিন</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 flex items-center gap-1 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-[4px] border border-emerald-200 transition-all"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{value ? 'ছবি পরিবর্তন' : 'ছবি নির্বাচন'}</span>
          </button>
          {value && (
            <button
              type="button"
              onClick={handleRemove}
              className="text-xs text-rose-600 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-2 py-1 rounded-[4px] border border-rose-200"
              title="ছবি মুছুন"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {error && <p className="text-[11px] text-rose-600 text-center">{error}</p>}
      </div>
    );
  }

  // Passport Box Style (Matches official admission form's top-right "ছবি" box)
  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <div
        onClick={() => fileInputRef.current?.click()}
        className={`w-28 h-36 sm:w-32 sm:h-40 border-2 border-dashed ${
          value ? 'border-emerald-600 bg-white' : 'border-slate-400 bg-emerald-50/20'
        } rounded-[4px] flex flex-col items-center justify-center overflow-hidden cursor-pointer relative group transition-all shadow-sm hover:border-emerald-700 hover:shadow-md`}
        title="পাসপোর্ট সাইজ ছবি আপলোড করতে ক্লিক করুন"
      >
        {compressing ? (
          <div className="flex flex-col items-center justify-center gap-1.5 p-2 text-center text-emerald-800">
            <Loader2 className="w-6 h-6 animate-spin" />
            <span className="text-[11px] font-semibold">প্রসেসিং হচ্ছে...</span>
          </div>
        ) : value ? (
          <>
            <img
              src={value}
              alt="Member Passport Photo"
              className="w-full h-full object-cover"
            />
            {/* Hover overlay on desktop */}
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center transition-opacity text-white text-xs font-bold gap-1">
              <Camera className="w-5 h-5 text-gold-300" />
              <span>ছবি পরিবর্তন</span>
            </div>
            {/* Quick delete button */}
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-1 right-1 bg-rose-600 text-white rounded-full p-1 shadow hover:bg-rose-700 transition-all z-10"
              title="ছবি মুছুন"
            >
              <X className="w-3 h-3" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-2 text-center text-slate-500 group-hover:text-emerald-800 transition-colors">
            <div className="w-9 h-9 rounded-full bg-emerald-100/70 text-emerald-800 flex items-center justify-center mb-1 group-hover:scale-105 transition-transform">
              <Camera className="w-5 h-5" />
            </div>
            <span className="text-base font-bold text-slate-800 font-serif">ছবি</span>
            <span className="text-[10px] text-slate-500 mt-0.5 leading-tight">
              পাসপোর্ট সাইজ
            </span>
            <span className="text-[9px] text-emerald-700 font-medium mt-1 underline">
              আপলোড করুন
            </span>
          </div>
        )}
      </div>

      {error && <p className="text-[10px] text-rose-600 mt-1 max-w-[130px]">{error}</p>}
    </div>
  );
};
