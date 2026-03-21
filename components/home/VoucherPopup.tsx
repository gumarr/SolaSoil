'use client';

import { useState, useEffect } from 'react';
import { X, Gift, Mail, Phone, User, CheckCircle2 } from 'lucide-react';

interface FormData {
  fullName: string;
  email: string;
  phone: string;
}

interface FormErrors {
  email?: string;
  phone?: string;
}

export default function VoucherPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimatingOut, setIsAnimatingOut] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  // Check if popup has been shown before
  useEffect(() => {
    const hasShown = localStorage.getItem('voucherPopupShown');
    if (!hasShown) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateVietnamesePhone = (phone: string): boolean => {
    const phoneRegex = /^(\+84|0)[\d\s]{8,11}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
  };

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: FormErrors = {};

    if (formData.email && !validateEmail(formData.email)) {
      newErrors.email = 'Vui lòng nhập email hợp lệ';
    }
    if (formData.phone && !validateVietnamesePhone(formData.phone)) {
      newErrors.phone = 'Vui lòng nhập số điện thoại Việt Nam hợp lệ (0xxx xxx xxx)';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitted(true);
    localStorage.setItem('voucherPopupShown', 'true');

    setTimeout(() => {
      handleClose();
    }, 2500);
  };

  // Handle popup close
  const handleClose = () => {
    setIsAnimatingOut(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsAnimatingOut(false);
      localStorage.setItem('voucherPopupShown', 'true');
    }, 350);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-350 ${
          isAnimatingOut ? 'opacity-0' : 'opacity-100'
        }`}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal wrapper — full-screen centering */}
      <div
        className={`fixed inset-0 z-50 flex items-center justify-center pt-20 px-4 pb-4 sm:px-6 sm:pb-6 overflow-hidden transition-all duration-350 ${
          isAnimatingOut ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
        }`}
        style={{
          animation: isAnimatingOut
            ? undefined
            : 'voucherFadeUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) both',
        }}
      >
        <style>{`
          @keyframes voucherFadeUp {
            from { opacity: 0; transform: translateY(32px) scale(0.96); }
            to   { opacity: 1; transform: translateY(0)    scale(1);    }
          }
        `}</style>

        {/* Modal container — ~2/3 screen */}
        <div className="relative w-full max-w-5xl max-h-full rounded-2xl lg:rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row">

          {/* ── LEFT: Visual / background panel ── */}
          <div
            className="relative flex-shrink-0 w-full md:w-[45%] min-h-[220px] md:min-h-0 bg-green-900"
            style={{
              backgroundImage: "url('/voucher-bg.png')",
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60 md:bg-gradient-to-r md:from-black/10 md:via-black/20 md:to-black/50" />

            {/* Floating badge */}
            <div className="absolute inset-0 flex flex-col items-center justify-end pb-8 md:justify-center md:pb-0 md:items-start md:pl-8">
              <div className="relative z-10 flex flex-col items-center md:items-start gap-3">
                <span className="inline-flex items-center gap-2 bg-green-500/90 backdrop-blur-sm text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg tracking-wide uppercase">
                  <Gift size={14} />
                  Ưu đãi đặc biệt
                </span>
                <h2 className="text-white text-3xl sm:text-4xl md:text-5xl font-extrabold leading-tight drop-shadow-lg text-center md:text-left">
                  Giảm tới<br />
                  <span className="text-green-300">20%</span>
                </h2>
                <p className="text-white/80 text-sm md:text-base text-center md:text-left max-w-[200px] drop-shadow">
                  Đặc sản vùng cao Việt Nam — hương vị thứ thiệt từ thiên nhiên
                </p>
              </div>
            </div>

            {/* Decorative corner glow */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-green-400/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
          </div>

          {/* ── RIGHT: Form panel ── */}
          <div className="flex-1 bg-white flex flex-col justify-center px-7 py-7 sm:px-10 sm:py-8 relative overflow-hidden">
            {/* Subtle decorative blobs */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-green-50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-50 rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none" />

            {/* Close button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all duration-200 hover:scale-110 hover:rotate-90 z-10"
              aria-label="Đóng popup"
            >
              <X size={20} />
            </button>

            <div className="relative z-10 w-full max-w-sm mx-auto">
              {/* ── SUCCESS STATE ── */}
              {submitted ? (
                <div className="flex flex-col items-center text-center gap-5 py-8 animate-[voucherFadeUp_0.4s_ease_both]">
                  <div className="flex items-center justify-center w-20 h-20 rounded-full bg-green-100 shadow-inner">
                    <CheckCircle2 className="text-green-500" size={44} strokeWidth={1.8} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-extrabold text-gray-900 mb-1">Cảm ơn bạn! 🎉</h3>
                    <p className="text-gray-500 text-sm leading-relaxed">
                      Voucher giảm giá <span className="font-semibold text-green-600">20%</span> đã được gửi.
                      Kiểm tra email của bạn trong vài phút nhé!
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div className="mb-7">
                    <p className="text-green-600 font-semibold text-sm uppercase tracking-widest mb-1">Dành riêng cho bạn</p>
                    <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 leading-tight mb-2">
                      Nhận Voucher Giảm Giá
                    </h2>
                    <p className="text-gray-500 text-sm">
                      Điền thông tin bên dưới — chúng tôi sẽ gửi voucher qua email trong vòng 24 giờ.
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Full Name */}
                    <div className="group">
                      <label htmlFor="fullName" className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                        Họ và tên <span className="font-normal normal-case text-gray-400">(tùy chọn)</span>
                      </label>
                      <div className="relative">
                        <User size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors duration-200" />
                        <input
                          id="fullName"
                          name="fullName"
                          type="text"
                          value={formData.fullName}
                          onChange={handleInputChange}
                          placeholder="Nguyễn Văn A"
                          className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent focus:bg-white transition-all duration-200 hover:border-gray-300"
                        />
                      </div>
                    </div>

                    {/* Email */}
                    <div className="group">
                      <label htmlFor="email" className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                        Email <span className="font-normal normal-case text-gray-400">(tùy chọn)</span>
                      </label>
                      <div className="relative">
                        <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors duration-200" />
                        <input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          placeholder="your@email.com"
                          className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all duration-200 hover:border-gray-300 ${
                            errors.email
                              ? 'border-red-400 focus:ring-red-400'
                              : 'border-gray-200 focus:ring-green-500 focus:border-transparent'
                          }`}
                        />
                      </div>
                      {errors.email && (
                        <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                          <span>⚠</span> {errors.email}
                        </p>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="group">
                      <label htmlFor="phone" className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                        Số điện thoại <span className="font-normal normal-case text-gray-400">(tùy chọn)</span>
                      </label>
                      <div className="relative">
                        <Phone size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-green-500 transition-colors duration-200" />
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="0123 456 789"
                          className={`w-full pl-10 pr-4 py-3 bg-gray-50 border rounded-xl text-gray-900 placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:bg-white transition-all duration-200 hover:border-gray-300 ${
                            errors.phone
                              ? 'border-red-400 focus:ring-red-400'
                              : 'border-gray-200 focus:ring-green-500 focus:border-transparent'
                          }`}
                        />
                      </div>
                      {errors.phone && (
                        <p className="text-red-500 text-xs mt-1.5 flex items-center gap-1">
                          <span>⚠</span> {errors.phone}
                        </p>
                      )}
                    </div>

                    {/* CTA Button */}
                    <button
                      type="submit"
                      className="w-full mt-2 py-3.5 px-6 bg-gradient-to-r from-green-600 to-emerald-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-green-500/30 hover:shadow-green-500/50 hover:scale-[1.02] hover:from-green-500 hover:to-emerald-400 active:scale-[0.98] transition-all duration-200 tracking-wide"
                    >
                      🎁 Nhận Voucher Ngay
                    </button>

                    {/* Terms */}
                    <p className="text-xs text-gray-400 text-center leading-relaxed">
                      Voucher được gửi trong vòng 24 giờ. Không spam, cam kết bảo mật thông tin.
                    </p>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
