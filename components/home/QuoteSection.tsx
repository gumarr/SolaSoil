export default function QuoteSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="min-h-[50vh] bg-linear-to-r from-green-950 via-green-900 to-stone-900 flex items-center">
        <div className="absolute inset-0 opacity-[0.07] pointer-events-none">
          <svg width="100%" height="100%">
            <defs><pattern id="gp" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
              <ellipse cx="20" cy="20" rx="4" ry="12" fill="white" transform="rotate(-15 20 20)"/>
              <ellipse cx="60" cy="50" rx="3" ry="10" fill="white" transform="rotate(25 60 50)"/>
            </pattern></defs>
            <rect width="100%" height="100%" fill="url(#gp)"/>
          </svg>
        </div>
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6 py-16">
          <p className="text-green-400 text-xs uppercase tracking-[0.35em] mb-5">Từ Núi Rừng Sơn La</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
            Mỗi Sản Phẩm Là Một<br/><span className="text-amber-400">Câu Chuyện Từ Bản Làng</span>
          </h2>
          <p className="text-green-300 mt-6 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            Từ những người phụ nữ Thái gác thịt lên bếp lửa mỗi sáng mùa đông, đến những chàng trai
            leo núi hái trà shan tuyết lúc sương mờ — Mộc Sơn giữ trọn linh hồn của núi rừng Tây Bắc.
          </p>
          <a href="#story" className="mt-8 inline-block border border-white/30 text-white hover:bg-white/10 px-7 py-3.5 rounded-full font-medium transition-all hover:-translate-y-0.5 text-sm">Đọc Câu Chuyện →</a>
        </div>
      </div>
    </section>
  );
}
