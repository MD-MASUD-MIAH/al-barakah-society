import Swal from 'sweetalert2';

// Custom SweetAlert2 Mixin styled for Al-Barakah Society
const AlBarakahSwal = Swal.mixin({
  customClass: {
    popup: 'rounded-[6px] border border-slate-200 shadow-none font-sans',
    title: 'text-slate-900 font-bold text-base',
    htmlContainer: 'text-slate-600 text-xs leading-relaxed',
    confirmButton: 'px-4 py-2 bg-emerald-900 hover:bg-emerald-950 text-gold-300 font-bold text-xs rounded-[6px] shadow-none mx-1.5 transition-colors',
    cancelButton: 'px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-[6px] shadow-none mx-1.5 transition-colors',
  },
  buttonsStyling: false,
});

export const showSuccessAlert = (title, text = '') => {
  return AlBarakahSwal.fire({
    icon: 'success',
    title,
    text,
    confirmButtonText: 'ঠিক আছে',
    timer: 2500,
    timerProgressBar: true,
  });
};

export const showErrorAlert = (title, text = '') => {
  return AlBarakahSwal.fire({
    icon: 'error',
    title,
    text,
    confirmButtonText: 'ঠিক আছে',
  });
};

export const showConfirmAlert = async (title, text = '', confirmButtonText = 'হ্যাঁ, নিশ্চিত করুন', cancelButtonText = 'বাতিল') => {
  const result = await AlBarakahSwal.fire({
    icon: 'warning',
    title,
    text,
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText,
    reverseButtons: true,
  });
  return result.isConfirmed;
};

export const showInfoAlert = (title, text = '') => {
  return AlBarakahSwal.fire({
    icon: 'info',
    title,
    text,
    confirmButtonText: 'ঠিক আছে',
  });
};

export default AlBarakahSwal;
