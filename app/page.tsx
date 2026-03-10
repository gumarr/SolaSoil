"use client";

import { useState } from "react";

/* ─── Data ─────────────────────────────────────────────── */
const PRODUCTS = [
  {
    id: 1,
    name: "Chè Thái Nguyên",
    type: "Chè xanh đặc sản",
    region: "Thái Nguyên",
    zone: "Miền Bắc",
    price: "85.000đ",
    weight: "200g",
    emoji: "🍵",
    grad: "from-green-900 via-green-700 to-emerald-600",
    badge: "Bán chạy",
  },
  {
    id: 2,
    name: "Bánh Đậu Xanh",
    type: "Bánh truyền thống",
    region: "Hải Dương",
    zone: "Miền Bắc",
    price: "65.000đ",
    weight: "200g",
    emoji: "🧁",
    grad: "from-yellow-700 via-amber-500 to-yellow-400",
    badge: null,
  },
  {
    id: 3,
    name: "Mắm Ruốc Huế",
    type: "Mắm đặc sản",
    region: "Huế",
    zone: "Miền Trung",
    price: "75.000đ",
    weight: "300g",
    emoji: "🫙",
    grad: "from-rose-900 via-rose-700 to-pink-600",
    badge: "Mới",
  },
  {
    id: 4,
    name: "Bánh Tráng Trảng Bàng",
    type: "Bánh gạo",
    region: "Tây Ninh",
    zone: "Miền Nam",
    price: "45.000đ",
    weight: "500g",
    emoji: "🫓",
    grad: "from-stone-700 via-amber-700 to-stone-600",
    badge: null,
  },
  {
    id: 5,
    name: "Tôm Khô Cà Mau",
    type: "Hải sản khô",
    region: "Cà Mau",
    zone: "Miền Nam",
    price: "180.000đ",
    weight: "200g",
    emoji: "🦐",
    grad: "from-orange-800 via-orange-600 to-amber-500",
    badge: "Bán chạy",
  },
  {
    id: 6,
    name: "Nước Mắm Phú Quốc",
    type: "Gia vị truyền thống",
    region: "Phú Quốc",
    zone: "Miền Nam",
    price: "95.000đ",
    weight: "500ml",
    emoji: "🍶",
    grad: "from-amber-900 via-amber-700 to-yellow-600",
    badge: null,
  },
];

const REGIONS = [
  {
    region: "Miền Bắc",
    subtitle: "Hà Nội · Thái Nguyên · Hải Dương · Sơn La",
    desc: "Nơi của chè xanh thanh mát, bánh đậu xanh béo ngọt, mật ong rừng Tây Bắc cùng hàng chục đặc sản trứ danh.",
    grad: "from-green-900 to-emerald-700",
    products: ["Chè Thái Nguyên", "Bánh Đậu Xanh Hải Dương", "Mật Ong Rừng Tây Bắc", "Miến Dong Bắc Kạn"],
    count: "40+ sản phẩm",
  },
  {
    region: "Miền Trung",
    subtitle: "Huế · Đà Nẵng · Quảng Nam · Bình Định",
    desc: "Đất của ruốc Huế đậm đà, bánh tráng cuốn thịt heo, tôm chua cay đặc sắc như chính tâm hồn người miền Trung.",
    grad: "from-amber-900 to-amber-600",
    products: ["Mắm Ruốc Huế", "Tôm Chua Huế", "Kẹo Đậu Phộng Bà Già", "Mì Quảng"],
    count: "35+ sản phẩm",
  },
  {
    region: "Miền Nam",
    subtitle: "Cà Mau · Phú Quốc · Tiền Giang · Đắk Lắk",
    desc: "Phong phú và đa dạng — tôm khô Cà Mau, nước mắm Phú Quốc, trái cây Tiền Giang và cà phê Đắk Lắk thơm lừng.",
    grad: "from-teal-900 to-teal-600",
    products: ["Tôm Khô Cà Mau", "Nước Mắm Phú Quốc", "Cà Phê Đắk Lắk", "Bơ Đắk Lắk"],
    count: "55+ sản phẩm",
  },
];

const TESTIMONIALS = [
  {
    name: "Nguyễn Thị Lan",
    role: "Khách hàng thân thiết",
    text: "Mắm ruốc Huế ở đây đúng vị quê hương! Tôi đã thử nhiều nơi nhưng chỉ ở đây mới tìm được đúng hương vị tôi nhớ từ thuở thơ bé.",
    location: "Hà Nội",
  },
  {
    name: "Trần Minh Đức",
    role: "Đầu bếp chuyên nghiệp",
    text: "Chè Thái Nguyên ở đây thật sự đặc biệt. Hương thơm tự nhiên, không pha tạp, rất phù hợp để pha trà cao cấp phục vụ khách hàng.",
    location: "TP. Hồ Chí Minh",
  },
  {
    name: "Phạm Thu Hương",
    role: "Food Blogger",
    text: "Tôm khô Cà Mau được đóng gói rất đẹp, sản phẩm tươi ngon và giao hàng nhanh. Rất yên tâm để mua làm quà tặng người thân.",
    location: "Đà Nẵng",
  },
];

const QUALITY_TIERS = [
  {
    mark: "★★★★★",
    label: "Xuất Sắc",
    desc: "Nguồn gốc hoàn toàn rõ ràng, hương vị thuần khiết, quy trình sản xuất bền vững và được kiểm chứng độc lập.",
    color: "bg-amber-500",
  },
  {
    mark: "★★★★",
    label: "Rất Tốt",
    desc: "Chất lượng cao, đúng hương vị vùng miền, đạt tiêu chuẩn an toàn thực phẩm được kiểm chứng bởi cơ quan chức năng.",
    color: "bg-green-600",
  },
  {
    mark: "★★★",
    label: "Đạt Chuẩn",
    desc: "Đáp ứng đủ tiêu chuẩn tối thiểu về an toàn thực phẩm, nguồn gốc xuất xứ và chất lượng cảm quan.",
    color: "bg-teal-600",
  },
  {
    mark: "Loại",
    label: "Không Đạt",
    desc: "Sản phẩm không vượt qua kiểm định của chúng tôi sẽ không được đưa lên nền tảng — không có ngoại lệ.",
    color: "bg-stone-500",
  },
];

/* ─── Page ─────────────────────────────────────────────── */
export default function Home() {
  const [cartCount, setCartCount] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (email) {
      setEmailSent(true);
      setEmail("");
    }
  }

  return (
    <div className="min-h-screen bg-white">

      {/* ── Announcement bar ─────────────────────────────── */}
      <div className="bg-green-900 text-green-100 text-xs sm:text-sm py-2.5 text-center px-4 tracking-wide">
        🌿 Miễn phí vận chuyển cho đơn hàng trên{" "}
        <strong className="text-white">300.000đ</strong> &nbsp;·&nbsp; Cam kết
        100% đặc sản vùng miền chính hãng
      </div>

      {/* ── Navigation ───────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-white/96 backdrop-blur-md border-b border-green-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 bg-green-800 rounded-full flex items-center justify-center shadow group-hover:bg-green-700 transition-colors">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                <path d="M17 8C8 10 5.9 16.17 3.82 21H5.71C6.47 19.1 7.5 17.1 9 15.5 11.07 16.8 13.92 17 17 8z" />
              </svg>
            </div>
            <span className="font-extrabold text-green-900 text-lg tracking-tight">
              Đặc Sản Việt
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {[
              ["#products", "Sản Phẩm"],
              ["#regions", "Vùng Miền"],
              ["#story", "Câu Chuyện"],
              ["#contact", "Liên Hệ"],
            ].map(([href, label]) => (
              <a
                key={label}
                href={href}
                className="text-green-800 hover:text-green-600 text-sm font-medium transition-colors"
              >
                {label}
              </a>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCartCount((c) => c + 1)}
              className="relative text-green-800 hover:text-green-600 transition-colors p-1"
              aria-label="Giỏ hàng"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4L7 13zm0 0-1.4 7h12.8M9 21a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm10 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-amber-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            <a
              href="#products"
              className="hidden sm:inline-flex items-center gap-1.5 bg-green-800 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors"
            >
              Mua Ngay
            </a>

            {/* Mobile hamburger */}
            <button
              className="md:hidden text-green-800 p-1"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-label="Menu"
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-green-100 px-6 py-5 flex flex-col gap-4 shadow-lg">
            {[["#products", "Sản Phẩm"], ["#regions", "Vùng Miền"], ["#story", "Câu Chuyện"], ["#contact", "Liên Hệ"]].map(
              ([href, label]) => (
                <a key={label} href={href} className="text-green-900 font-semibold text-base" onClick={() => setMobileMenuOpen(false)}>
                  {label}
                </a>
              )
            )}
          </div>
        )}
      </nav>

      {/* ── Hero ─────────────────────────────────────────── */}
      <section className="relative min-h-[92vh] bg-green-950 overflow-hidden flex items-center">
        {/* Subtle leaf pattern overlay */}
        <div className="absolute inset-0 opacity-[0.07]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="leafPattern" x="0" y="0" width="64" height="64" patternUnits="userSpaceOnUse">
                <path d="M32 6 C22 16 12 28 18 38 C24 48 42 46 46 36 C50 26 42 14 32 6Z" fill="white" />
                <path d="M10 45 C6 38 8 30 14 28 C8 35 10 43 10 45Z" fill="white" opacity="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#leafPattern)" />
          </svg>
        </div>

        {/* Diagonal colour split (desktop) */}
        <div
          className="absolute right-0 top-0 w-1/2 h-full bg-green-800/30 hidden lg:block"
          style={{ clipPath: "polygon(18% 0%, 100% 0%, 100% 100%, 0% 100%)" }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
          {/* Left — headline */}
          <div>
            <span className="inline-block text-green-300 text-xs uppercase tracking-[0.25em] font-semibold border border-green-700 px-3 py-1 rounded-full mb-6">
              Đặc Sản Vùng Miền
            </span>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.08] mb-6">
              Hương Vị
              <br />
              <span className="text-amber-400">Đất Việt</span>
              <br />
              Thuần Khiết
            </h1>
            <p className="text-green-200 text-lg leading-relaxed mb-10 max-w-md">
              Chúng tôi tuyển chọn và mang đến những đặc sản thuần khiết nhất
              từ khắp mọi miền đất nước — từ chè Thái Nguyên cho đến tôm khô Cà
              Mau.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#products"
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-8 py-4 rounded-full shadow-lg shadow-amber-900/30 transition-colors"
              >
                Khám Phá Ngay
              </a>
              <a
                href="#story"
                className="border border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-full font-medium transition-colors"
              >
                Câu Chuyện
              </a>
            </div>
          </div>

          {/* Right — visual showcase */}
          <div className="hidden lg:flex justify-center lg:justify-end">
            <div className="relative w-95 h-105">
              {/* Main card */}
              <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-green-800 to-green-950 border border-green-700/40 shadow-2xl overflow-hidden flex flex-col items-center justify-center text-center p-8">
                <div className="text-8xl mb-5 drop-shadow-lg">🌿</div>
                <p className="text-2xl font-bold text-white mb-2">100% Tự Nhiên</p>
                <p className="text-green-300 text-sm leading-relaxed">
                  Tuyển chọn trực tiếp từ vùng sản xuất uy tín, không phụ gia, không chất bảo quản
                </p>
              </div>

              {/* Floating card — top left */}
              <div className="absolute -left-14 top-10 bg-white rounded-2xl p-3.5 shadow-2xl w-36">
                <div className="w-full h-20 bg-linear-to-br from-amber-500 to-orange-600 rounded-xl mb-2.5 flex items-center justify-center text-3xl">
                  🦐
                </div>
                <p className="text-xs font-bold text-green-900 truncate">Tôm Khô Cà Mau</p>
                <p className="text-xs font-semibold text-amber-700 mt-0.5">180.000đ</p>
              </div>

              {/* Floating card — bottom right */}
              <div className="absolute -right-10 bottom-14 bg-white rounded-2xl p-3.5 shadow-2xl w-36">
                <div className="w-full h-20 bg-linear-to-br from-green-700 to-green-900 rounded-xl mb-2.5 flex items-center justify-center text-3xl">
                  🍵
                </div>
                <p className="text-xs font-bold text-green-900 truncate">Chè Thái Nguyên</p>
                <p className="text-xs font-semibold text-amber-700 mt-0.5">85.000đ</p>
              </div>

              {/* Badge — top right */}
              <div className="absolute top-6 right-2 bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                ✓ Chính Hãng
              </div>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-green-500">
          <span className="text-[10px] tracking-[0.3em] uppercase">Cuộn Xuống</span>
          <div className="w-px h-8 bg-linear-to-b from-green-500 to-transparent" />
        </div>
      </section>

      {/* ── Value strip ──────────────────────────────────── */}
      <section className="bg-green-50 border-y border-green-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-7 grid grid-cols-1 sm:grid-cols-3 gap-5 sm:divide-x sm:divide-green-200">
          {[
            { icon: "🌱", title: "100% Tự Nhiên", desc: "Không hóa chất, giữ nguyên hương vị gốc" },
            { icon: "🏔️", title: "Từ Vùng Sản Xuất", desc: "Trực tiếp từ nông dân và làng nghề" },
            { icon: "🚚", title: "Giao Hàng Toàn Quốc", desc: "Trong 2–3 ngày làm việc, đóng gói kỹ lưỡng" },
          ].map((item) => (
            <div key={item.title} className="flex items-center gap-4 sm:px-6 first:pl-0 last:pr-0">
              <span className="text-3xl shrink-0">{item.icon}</span>
              <div>
                <p className="font-bold text-green-900 text-sm">{item.title}</p>
                <p className="text-green-700 text-xs mt-0.5">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured Products ────────────────────────────── */}
      <section id="products" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="text-amber-700 text-xs uppercase tracking-widest font-semibold">Tuyển Chọn</span>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-green-900 mt-2 leading-tight">
                Đặc Sản Nổi Bật
              </h2>
            </div>
            <a
              href="#regions"
              className="hidden sm:flex items-center gap-1 text-green-700 hover:text-green-900 text-sm font-semibold underline underline-offset-4"
            >
              Xem tất cả
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>

          {/* Horizontal scroll carousel */}
          <div className="flex gap-5 overflow-x-auto pb-4 -mx-6 sm:-mx-10 px-6 sm:px-10 scrollbar-hide snap-x snap-mandatory">
            {PRODUCTS.map((p) => (
              <div
                key={p.id}
                className="snap-start shrink-0 w-60 sm:w-64 group"
              >
                {/* Image area */}
                <div
                  className={`h-64 bg-linear-to-br ${p.grad} rounded-2xl overflow-hidden relative mb-4 shadow-md group-hover:shadow-xl transition-shadow duration-300`}
                >
                  {p.badge && (
                    <span className="absolute top-3 left-3 bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full z-10">
                      {p.badge}
                    </span>
                  )}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                    <span className="text-6xl drop-shadow-lg">{p.emoji}</span>
                    <span className="mt-3 bg-black/20 text-white text-xs px-2.5 py-0.5 rounded-full backdrop-blur-sm">
                      {p.weight}
                    </span>
                  </div>
                  <button
                    onClick={() => setCartCount((c) => c + 1)}
                    className="absolute bottom-3 right-3 bg-white/90 hover:bg-white text-green-900 text-xs font-bold px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 shadow"
                  >
                    + Giỏ hàng
                  </button>
                </div>

                {/* Info */}
                <div>
                  <p className="text-xs text-amber-700 font-semibold mb-0.5">
                    {p.zone} · {p.region}
                  </p>
                  <h3 className="font-bold text-green-900 text-base">{p.name}</h3>
                  <p className="text-green-700 text-sm">{p.type}</p>
                  <p className="font-extrabold text-amber-700 text-base mt-1.5">{p.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Full-width landscape / quote (like ecogreen) ─── */}
      <section className="relative overflow-hidden">
        <div className="h-[52vh] sm:h-[58vh] bg-linear-to-r from-green-950 via-green-900 to-green-800 flex items-center">
          {/* Decorative grain overlay */}
          <div className="absolute inset-0 opacity-[0.08]">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grainPat" x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
                  <ellipse cx="20" cy="20" rx="4" ry="12" fill="white" transform="rotate(-15 20 20)" />
                  <ellipse cx="60" cy="50" rx="3" ry="10" fill="white" transform="rotate(25 60 50)" />
                  <ellipse cx="40" cy="70" rx="5" ry="14" fill="white" transform="rotate(10 40 70)" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grainPat)" />
            </svg>
          </div>

          <div className="relative z-10 max-w-4xl mx-auto text-center px-6">
            <p className="text-green-400 text-xs uppercase tracking-[0.35em] mb-5">
              Hành Trình Từ Vùng Đất
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white leading-tight">
              Mỗi Sản Phẩm Là Một
              <br />
              <span className="text-amber-400">Câu Chuyện Quê Hương</span>
            </h2>
            <p className="text-green-300 mt-6 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              Từ những người nông dân Thái Nguyên hái chè lúc bình minh, đến
              những ngư dân Cà Mau phơi tôm dưới nắng — mỗi đặc sản là tinh
              túy của đất và người Việt Nam.
            </p>
            <a
              href="#story"
              className="mt-8 inline-block border border-white/30 text-white hover:bg-white/10 px-7 py-3.5 rounded-full font-medium transition-colors text-sm"
            >
              Đọc Câu Chuyện →
            </a>
          </div>
        </div>
      </section>

      {/* ── Regional categories ───────────────────────────── */}
      <section id="regions" className="py-20 bg-stone-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="text-center mb-12">
            <span className="text-amber-700 text-xs uppercase tracking-widest font-semibold">
              Ba Miền
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-green-900 mt-2">
              Khám Phá Vùng Miền
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {REGIONS.map((r) => (
              <div key={r.region} className="group cursor-pointer">
                {/* Visual card */}
                <div
                  className={`h-56 bg-linear-to-br ${r.grad} rounded-2xl relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
                  <div className="relative p-6 h-full flex flex-col justify-between">
                    <span className="self-start bg-white/15 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full">
                      {r.count}
                    </span>
                    <div>
                      <h3 className="text-3xl font-extrabold text-white mb-1">{r.region}</h3>
                      <p className="text-white/75 text-xs">{r.subtitle}</p>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="mt-5 px-1">
                  <p className="text-green-800 text-sm leading-relaxed mb-3">{r.desc}</p>
                  <ul className="space-y-1.5 mb-4">
                    {r.products.map((name) => (
                      <li key={name} className="flex items-center gap-2 text-xs text-green-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                        {name}
                      </li>
                    ))}
                  </ul>
                  <a
                    href="#"
                    className="text-green-800 text-sm font-bold group-hover:text-amber-700 transition-colors"
                  >
                    Xem tất cả →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Our model: 2-column (like ecogreen) ─────────── */}
      <section id="story" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
          {/* Left — intro */}
          <div className="lg:col-span-1">
            <span className="text-amber-700 text-xs uppercase tracking-widest font-semibold">
              Về Chúng Tôi
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-green-900 mt-3 mb-5 leading-snug">
              Sứ Mệnh Kết Nối Hương Vị Vùng Miền
            </h2>
            <p className="text-green-700 leading-relaxed mb-5 text-sm sm:text-base">
              Chúng tôi tin rằng mỗi địa phương của Việt Nam đều ẩn chứa những
              giá trị ẩm thực độc đáo cần được gìn giữ và lan tỏa. Từ nguyên
              liệu tự nhiên đến quy trình chế biến truyền thống, mỗi sản phẩm
              là di sản ẩm thực đáng trân trọng.
            </p>
            <a
              href="#"
              className="inline-flex items-center gap-1.5 text-green-800 font-bold text-sm underline underline-offset-4 hover:text-amber-700 transition-colors"
            >
              Đọc thêm về câu chuyện của chúng tôi →
            </a>
          </div>

          {/* Right — 4 pillars */}
          <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {[
              {
                icon: "🏡",
                title: "Sản Phẩm Của Chúng Tôi",
                desc: "Hàng trăm đặc sản tuyển chọn từ những làng nghề, vùng sản xuất uy tín. Đóng gói cẩn thận, bảo quản tốt.",
                link: "Xem sản phẩm →",
              },
              {
                icon: "🌾",
                title: "Câu Chuyện Nông Dân",
                desc: "Hợp tác trực tiếp với nông dân và hộ sản xuất, đảm bảo giá trị đến tay người tạo ra sản phẩm.",
                link: "Đọc câu chuyện →",
              },
              {
                icon: "✅",
                title: "Cam Kết Chất Lượng",
                desc: "100% sản phẩm qua kiểm định an toàn thực phẩm. Không phụ gia, không hóa chất, giữ nguyên hương vị tự nhiên.",
                link: "Tìm hiểu thêm →",
              },
              {
                icon: "🎁",
                title: "Hộp Quà Ý Nghĩa",
                desc: "Hộp quà đặc sản vùng miền — món quà mang theo hồn Việt, phù hợp mọi dịp lễ Tết và kỷ niệm.",
                link: "Xem hộp quà →",
              },
            ].map((item) => (
              <div
                key={item.title}
                className="border border-green-100 rounded-2xl p-6 hover:border-green-300 hover:shadow-sm transition-all group"
              >
                <span className="text-3xl">{item.icon}</span>
                <h3 className="font-bold text-green-900 mt-3 mb-2">{item.title}</h3>
                <p className="text-green-700 text-sm leading-relaxed mb-4">{item.desc}</p>
                <a
                  href="#"
                  className="text-green-800 text-sm font-semibold group-hover:text-amber-700 transition-colors"
                >
                  {item.link}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Quality tiers (Ecoscale equivalent) ──────────── */}
      <section className="py-20 bg-green-950 text-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Header */}
          <div>
            <span className="text-green-400 text-xs uppercase tracking-widest font-semibold">
              Tiêu Chuẩn
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-white mt-3 mb-6 leading-tight">
              Bộ Tiêu Chí
              <br />
              <span className="text-amber-400">Tuyển Chọn</span>
            </h2>
            <p className="text-green-300 text-base sm:text-lg leading-relaxed mb-8 max-w-md">
              Mỗi sản phẩm trên Đặc Sản Việt đều phải qua quy trình đánh giá
              nghiêm ngặt trước khi đến tay khách hàng. Không có ngoại lệ.
            </p>
            <a
              href="#"
              className="inline-block border border-green-600 text-green-300 hover:bg-green-800 hover:text-white px-6 py-3 rounded-full text-sm font-medium transition-colors"
            >
              Xem quy trình kiểm định →
            </a>
          </div>

          {/* Tier list */}
          <div className="space-y-5">
            {QUALITY_TIERS.map((tier) => (
              <div key={tier.label} className="flex gap-4 items-start">
                <span
                  className={`${tier.color} text-white text-xs font-bold px-3 py-1.5 rounded-full shrink-0 whitespace-nowrap shadow`}
                >
                  {tier.mark}
                </span>
                <div>
                  <p className="text-white font-semibold text-sm mb-0.5">{tier.label}</p>
                  <p className="text-green-400 text-sm leading-relaxed">{tier.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bestsellers mini grid ─────────────────────────── */}
      <section className="py-20 bg-amber-50">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="text-center mb-12">
            <span className="text-amber-700 text-xs uppercase tracking-widest font-semibold">
              Được Yêu Thích Nhất
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-green-900 mt-2">
              Bộ Sưu Tập Quà Tặng
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Hộp Quà Tết Bắc",
                desc: "Chè Thái Nguyên, Bánh Đậu Xanh, Mật Ong Sơn La",
                price: "350.000đ",
                grad: "from-green-800 to-green-600",
                emoji: "🎋",
              },
              {
                title: "Hộp Đặc Sản Miền Trung",
                desc: "Mắm Ruốc Huế, Kẹo Đậu Phộng, Tôm Chua Huế",
                price: "320.000đ",
                grad: "from-amber-800 to-amber-600",
                emoji: "🌸",
              },
              {
                title: "Hộp Quà Biển Nam",
                desc: "Tôm Khô Cà Mau, Nước Mắm Phú Quốc, Bánh Tráng",
                price: "390.000đ",
                grad: "from-teal-800 to-teal-600",
                emoji: "🌊",
              },
            ].map((box) => (
              <div
                key={box.title}
                className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-amber-100 group"
              >
                <div
                  className={`h-44 bg-linear-to-br ${box.grad} flex items-center justify-center text-6xl`}
                >
                  {box.emoji}
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-green-900 text-base mb-1">{box.title}</h3>
                  <p className="text-green-700 text-sm mb-3">{box.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-amber-700">{box.price}</span>
                    <button
                      onClick={() => setCartCount((c) => c + 1)}
                      className="bg-green-800 hover:bg-green-700 text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors"
                    >
                      + Giỏ hàng
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="text-center mb-12">
            <span className="text-amber-700 text-xs uppercase tracking-widest font-semibold">
              Đánh Giá
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-green-900 mt-2">
              Lời Khách Hàng
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div
                key={i}
                className="bg-green-50 rounded-2xl p-7 border border-green-100 flex flex-col"
              >
                <div className="flex gap-0.5 text-amber-400 text-sm mb-4">★★★★★</div>
                <p className="text-green-800 leading-relaxed mb-6 italic flex-1">
                  &ldquo;{t.text}&rdquo;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-800 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-green-900 text-sm">{t.name}</p>
                    <p className="text-green-600 text-xs">
                      {t.role} · {t.location}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Newsletter CTA ────────────────────────────────── */}
      <section id="contact" className="py-20 bg-green-900">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <span className="text-green-400 text-xs uppercase tracking-widest font-semibold">
            Đăng Ký
          </span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-white mt-3 mb-4 leading-tight">
            Nhận Ưu Đãi
            <br />
            Mỗi Tuần
          </h2>
          <p className="text-green-300 text-base sm:text-lg mb-10 leading-relaxed">
            Đăng ký nhận bản tin để không bỏ lỡ sản phẩm mới và ưu đãi độc
            quyền từ khắp các vùng miền trên cả nước.
          </p>

          {emailSent ? (
            <div className="bg-green-800 rounded-2xl px-8 py-6 text-center">
              <p className="text-2xl mb-2">🎉</p>
              <p className="text-white font-bold">Cảm ơn bạn đã đăng ký!</p>
              <p className="text-green-300 text-sm mt-1">Chúng tôi sẽ sớm gửi ưu đãi đến hộp thư của bạn.</p>
            </div>
          ) : (
            <form
              onSubmit={handleSubscribe}
              className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
            >
              <input
                type="email"
                required
                placeholder="Địa chỉ email của bạn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-5 py-3.5 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-green-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              />
              <button
                type="submit"
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-7 py-3.5 rounded-full transition-colors whitespace-nowrap shadow-lg"
              >
                Đăng Ký Ngay
              </button>
            </form>
          )}
        </div>
      </section>

      {/* ── Footer ───────────────────────────────────────── */}
      <footer className="bg-green-950 text-green-400 pt-16 pb-8">
        <div className="max-w-7xl mx-auto px-6 sm:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-green-700 rounded-full flex items-center justify-center">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                    <path d="M17 8C8 10 5.9 16.17 3.82 21H5.71C6.47 19.1 7.5 17.1 9 15.5 11.07 16.8 13.92 17 17 8z" />
                  </svg>
                </div>
                <span className="font-extrabold text-white">Đặc Sản Việt</span>
              </div>
              <p className="text-green-500 text-sm leading-relaxed mb-5">
                Nền tảng đặc sản vùng miền uy tín — kết nối người tiêu dùng với
                những sản vật thuần khiết nhất của đất nước.
              </p>
              <div className="flex gap-2.5">
                {(["f", "ig", "tt"] as const).map((s) => (
                  <a
                    key={s}
                    href="#"
                    className="w-8 h-8 bg-green-800 hover:bg-green-700 rounded-full flex items-center justify-center text-xs uppercase font-bold transition-colors"
                  >
                    {s}
                  </a>
                ))}
              </div>
            </div>

            {/* Sản phẩm */}
            <div>
              <h4 className="text-white font-bold mb-4 text-sm tracking-wide">
                Sản Phẩm
              </h4>
              <ul className="space-y-2.5">
                {["Đặc Sản Miền Bắc", "Đặc Sản Miền Trung", "Đặc Sản Miền Nam", "Hộp Quà Tặng", "Sản Phẩm Mới"].map(
                  (l) => (
                    <li key={l}>
                      <a href="#" className="text-sm hover:text-white transition-colors">
                        {l}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Công ty */}
            <div>
              <h4 className="text-white font-bold mb-4 text-sm tracking-wide">
                Công Ty
              </h4>
              <ul className="space-y-2.5">
                {["Về Chúng Tôi", "Câu Chuyện", "Hợp Tác", "Tuyển Dụng", "Blog Ẩm Thực"].map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm hover:text-white transition-colors">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Hỗ trợ */}
            <div>
              <h4 className="text-white font-bold mb-4 text-sm tracking-wide">
                Hỗ Trợ
              </h4>
              <ul className="space-y-2.5">
                {["Liên Hệ", "Chính Sách Đổi Trả", "Chính Sách Vận Chuyển", "Câu Hỏi Thường Gặp", "Điều Khoản"].map(
                  (l) => (
                    <li key={l}>
                      <a href="#" className="text-sm hover:text-white transition-colors">
                        {l}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>

          <div className="border-t border-green-800/50 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-green-600">
            <span>© 2026 Đặc Sản Việt. Tất cả quyền được bảo lưu.</span>
            <span>Thiết kế với ❤️ vì hương vị Việt Nam</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
