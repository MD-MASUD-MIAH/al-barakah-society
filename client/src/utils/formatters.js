// Format Bangladeshi Taka (BDT)
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null) return '৳০';
  const num = Number(amount);
  return '৳' + num.toLocaleString('en-IN');
};

// Format Date
export const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('bn-BD', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

// Format Date (English fallback)
export const formatDateEn = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

// Format Time
export const formatTime = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Payment Method Labels and Badges
export const getPaymentMethodInfo = (method) => {
  switch (method?.toLowerCase()) {
    case 'bkash':
      return {
        label: 'বিকাশ (bKash)',
        badgeClass: 'bg-pink-100 text-pink-700 border-pink-200',
        iconName: 'Smartphone',
      };
    case 'nagad':
      return {
        label: 'নগদ (Nagad)',
        badgeClass: 'bg-orange-100 text-orange-700 border-orange-200',
        iconName: 'SmartphoneCharging',
      };
    case 'bank':
      return {
        label: 'ব্যাংক ট্রান্সফার (Bank)',
        badgeClass: 'bg-blue-100 text-blue-700 border-blue-200',
        iconName: 'Landmark',
      };
    case 'cash':
    default:
      return {
        label: 'নগদ ক্যাশ (Cash)',
        badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        iconName: 'Banknote',
      };
  }
};
