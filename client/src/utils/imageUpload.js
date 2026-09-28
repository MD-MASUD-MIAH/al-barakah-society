/**
 * Client-side image compression and conversion to Base64 data URL
 * Compresses camera/phone photos (5-10MB) down to ~30-60KB
 * Works on iOS Safari, Android Chrome, and desktop browsers.
 */
export const compressImage = (file, options = {}) => {
  const {
    maxWidth = 400,
    maxHeight = 400,
    quality = 0.82,
    outputFormat = 'image/jpeg',
  } = options;

  return new Promise((resolve, reject) => {
    if (!file) {
      return reject(new Error('কোনো ফাইল নির্বাচন করা হয়নি'));
    }

    if (!file.type.startsWith('image/')) {
      return reject(new Error('অনুগ্রহ করে একটি ছবি (JPG, PNG, WebP) ফাইল নির্বাচন করুন'));
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      const img = new Image();

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate scaling
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve(e.target.result);
        }

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height);

        const compressedDataUrl = canvas.toDataURL(outputFormat, quality);
        resolve(compressedDataUrl);
      };

      img.onerror = () => {
        reject(new Error('ছবি লোড করতে সমস্যা হয়েছে'));
      };

      img.src = e.target.result;
    };

    reader.onerror = () => {
      reject(new Error('ফাইল পড়তে সমস্যা হয়েছে'));
    };

    reader.readAsDataURL(file);
  });
};
