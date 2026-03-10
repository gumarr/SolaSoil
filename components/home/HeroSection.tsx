"use client";

import { useInView } from "@/hooks/useInView";
import LensImage from "@/components/ui/LensImage";

export default function HeroSection() {
  const [heroRef, heroInView] = useInView(0.04);

  return (
    <section className="relative min-h-[92vh] bg-green-950 overflow-hidden flex items-center">
      <div className="absolute inset-0 opacity-[0.11] pointer-events-none">
        <svg viewBox="0 0 1440 600" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
          <path d="M0 600 L360 200 L540 350 L720 100 L900 300 L1080 150 L1260 280 L1440 180 L1440 600Z" fill="white"/>
          <path d="M0 600 L200 370 L400 460 L600 290 L800 410 L1000 260 L1200 390 L1440 310 L1440 600Z" fill="white" opacity="0.5"/>
        </svg>
      </div>
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none">
        <svg width="100%" height="100%">
          <defs><pattern id="lp" x="0" y="0" width="64" height="64" patternUnits="userSpaceOnUse"><path d="M32 6C22 16 12 28 18 38C24 48 42 46 46 36C50 26 42 14 32 6Z" fill="white"/></pattern></defs>
          <rect width="100%" height="100%" fill="url(#lp)"/>
        </svg>
      </div>
      <div className="absolute right-0 top-0 w-1/2 h-full bg-green-800/20 hidden lg:block" style={{ clipPath: "polygon(20% 0%, 100% 0%, 100% 100%, 0% 100%)" }}/>

      <div ref={heroRef} className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 py-24 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
        <div>
          <span className="inline-block text-green-300 text-xs uppercase tracking-[0.25em] font-semibold border border-green-700 px-3 py-1 rounded-full mb-6"
            style={{ opacity: heroInView?1:0, transform: heroInView?"none":"translateY(20px)", transition: "opacity 0.7s, transform 0.7s" }}>
            🏔️ Đặc Sản Sơn La
          </span>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-white leading-[1.06] mb-6"
            style={{ opacity: heroInView?1:0, transform: heroInView?"none":"translateY(28px)", transition: "opacity 0.7s 120ms, transform 0.7s 120ms" }}>
            Mộc Sơn<br/><span className="text-amber-400">Hương Vị</span><br/>Núi Rừng
          </h1>
          <p className="text-green-200 text-lg leading-relaxed mb-10 max-w-md"
            style={{ opacity: heroInView?1:0, transform: heroInView?"none":"translateY(24px)", transition: "opacity 0.7s 240ms, transform 0.7s 240ms" }}>
            Tuyển chọn đặc sản vùng cao Sơn La — thịt gác bếp hun khói, trà shan tuyết cổ thụ,
            mắc khén thơm lừng và trái cây mùa vụ ngọt lành từ cao nguyên Mộc Châu.
          </p>
          <div className="flex flex-wrap gap-4"
            style={{ opacity: heroInView?1:0, transform: heroInView?"none":"translateY(20px)", transition: "opacity 0.7s 360ms, transform 0.7s 360ms" }}>
            <a href="#products" className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-8 py-4 rounded-full shadow-lg shadow-amber-900/30 transition-all hover:-translate-y-1 hover:shadow-xl">Khám Phá Ngay</a>
            <a href="#story" className="border border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-full font-medium transition-all hover:-translate-y-0.5">Câu Chuyện</a>
          </div>
        </div>

        <div className="hidden lg:flex justify-end">
          <div className="relative w-95 h-105">
            <div className="absolute inset-0 rounded-3xl overflow-hidden shadow-2xl border border-green-700/30"
              style={{ opacity: heroInView?1:0, transition: "opacity 0.8s 300ms" }}>
              <LensImage baseGrad="from-green-900 via-green-800 to-emerald-900" revealGrad="from-amber-700 via-orange-600 to-amber-500" emoji="🌿" revealEmoji="🏔️" className="w-full h-full">
                <div className="absolute inset-0 flex flex-col items-end justify-start p-5 pointer-events-none">
                  <span className="bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">✓ Chính Hãng</span>
                </div>
                <div className="absolute bottom-8 left-0 right-0 text-center pointer-events-none">
                  <p className="text-2xl font-bold text-white drop-shadow">100% Sơn La</p>
                  <p className="text-green-300 text-xs mt-1">Di chuyển chuột để khám phá</p>
                </div>
              </LensImage>
            </div>
            <div className="absolute -left-14 top-10 bg-white rounded-2xl p-3.5 shadow-2xl w-36 animate-float"
              style={{ opacity: heroInView?1:0, transition: "opacity 0.7s 500ms" }}>
              <div className="w-full h-20 bg-linear-to-br from-stone-700 to-amber-800 rounded-xl mb-2.5 flex items-center justify-center text-3xl">🥩</div>
              <p className="text-xs font-bold text-green-900 truncate">Thịt Gác Bếp</p>
              <p className="text-xs font-semibold text-amber-700 mt-0.5">250.000đ</p>
            </div>
            <div className="absolute -right-10 bottom-14 bg-white rounded-2xl p-3.5 shadow-2xl w-36 animate-float-delay"
              style={{ opacity: heroInView?1:0, transition: "opacity 0.7s 600ms" }}>
              <div className="w-full h-20 bg-linear-to-br from-amber-600 to-yellow-500 rounded-xl mb-2.5 flex items-center justify-center text-3xl">🍯</div>
              <p className="text-xs font-bold text-green-900 truncate">Mật Ong Rừng</p>
              <p className="text-xs font-semibold text-amber-700 mt-0.5">185.000đ</p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-green-500">
        <span className="text-[10px] tracking-[0.3em] uppercase">Cuộn Xuống</span>
        <div className="w-px h-8 bg-linear-to-b from-green-500 to-transparent animate-pulse"/>
      </div>
    </section>
  );
}
