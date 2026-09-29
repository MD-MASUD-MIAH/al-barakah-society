import React, { useRef, useState } from 'react';
import { Camera, X, Loader2 } from 'lucide-react';
import { compressImage } from '../../utils/imageUpload';

/**
 * Modern, Minimal Photo Upload Component
 * Icon-only design for avatars with camera badge & zero text clutter.
 */
export const PhotoUpload = ({
  value,
  onChange,
  shape = 'circle',
  size = 'md', // 'sm', 'md', 'lg'
  className = '',
  disabled = false,
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
      // Compress to max 400x400 to keep it lightweight (<50KB)
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

  // Dimensions based on size
  const circleSizeClass =
    size === 'lg'
      ? 'w-24 h-24 sm:w-28 sm:h-28'
      : size === 'sm'
      ? 'w-14 h-14'
      : 'w-20 h-20 sm:w-24 sm:h-24';

  const iconBtnSize =
    size === 'lg'
      ? 'w-8 h-8'
      : size === 'sm'
      ? 'w-6 h-6'
      : 'w-7 h-7';

  if (shape === 'circle') {
    return (
      <div className={`relative inline-block ${className}`}>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          disabled={disabled || compressing}
          onChange={handleFileChange}
        />

        {/* Avatar Container with Hover Overlay & Tap Action */}
        <div
          onClick={() => !disabled && !compressing && fileInputRef.current?.click()}
          className={`relative group ${circleSizeClass} rounded-full aspect-square bg-slate-100 ring-2 ring-emerald-600/30 hover:ring-emerald-600 transition-all cursor-pointer overflow-hidden flex items-center justify-center shadow-xs`}
          title="ছবি পরিবর্তন করতে ক্লিক করুন"
        >
          {compressing ? (
            <div className="flex flex-col items-center justify-center gap-1 text-emerald-800">
              <Loader2 className="w-6 h-6 animate-spin" />
            </div>
          ) : value ? (
            <>
              <img
                src={value}
                alt="Avatar"
                className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-200"
              />
              {/* Subtle Dark Overlay on Hover */}
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-200 text-white">
                <Camera className="w-5 h-5 text-white drop-shadow" />
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-slate-400 group-hover:text-emerald-700 transition-colors">
              <Camera className="w-7 h-7" />
            </div>
          )}
        </div>

        {/* Modern Floating Camera/Edit Icon Badge */}
        {!disabled && !compressing && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className={`absolute bottom-0 right-0 ${iconBtnSize} rounded-full bg-emerald-800 hover:bg-emerald-900 text-gold-300 ring-2 ring-white shadow-md flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer z-10`}
            title="ছবি পরিবর্তন"
            aria-label="ছবি পরিবর্তন"
          >
            <Camera className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Quick Delete Badge (if avatar exists) */}
        {value && !disabled && !compressing && (
          <button
            type="button"
            onClick={handleRemove}
            className="absolute top-0 right-0 w-5 h-5 rounded-full bg-rose-600 hover:bg-rose-700 text-white ring-2 ring-white shadow-xs flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer z-10"
            title="ছবি মুছুন"
            aria-label="ছবি মুছুন"
          >
            <X className="w-3 h-3" />
          </button>
        )}

        {error && <p className="text-[10px] text-rose-600 text-center mt-1">{error}</p>}
      </div>
    );
  }

  // Passport Box Style (For Membership Application Form)
  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        disabled={disabled || compressing}
        onChange={handleFileChange}
      />

      <div
        onClick={() => !disabled && !compressing && fileInputRef.current?.click()}
        className={`w-28 h-36 sm:w-32 sm:h-40 border-2 border-dashed ${
          value ? 'border-emerald-600 bg-white' : 'border-slate-300 bg-slate-50'
        } rounded-md flex flex-col items-center justify-center overflow-hidden cursor-pointer relative group transition-all hover:border-emerald-700`}
      >
        {compressing ? (
          <div className="flex flex-col items-center justify-center text-emerald-800">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : value ? (
          <>
            <img
              src={value}
              alt="Passport Photo"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white">
              <Camera className="w-5 h-5" />
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="absolute top-1 right-1 bg-rose-600 text-white rounded-full p-1 shadow hover:bg-rose-700 z-10"
            >
              <X className="w-3 h-3" />
            </button>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center p-2 text-center text-slate-400 group-hover:text-emerald-800 transition-colors">
            <Camera className="w-6 h-6 mb-1 text-slate-400 group-hover:text-emerald-700" />
            <span className="text-xs font-semibold text-slate-700">ছবি আপলোড</span>
          </div>
        )}
      </div>

      {error && <p className="text-[10px] text-rose-600 mt-1 max-w-[130px]">{error}</p>}
    </div>
  );
};
