"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { HERO_IMAGES } from "@/lib/imageConfig";

const STATS = [
  { value: "50+",  label: "Nông dân" },
  { value: "100%", label: "Thiên nhiên" },
  { value: "8+",   label: "Năm kinh nghiệm" },
];

export default function HeroSection() {
  const [visible,    setVisible]    = useState(false);
  const [activeCard, setActiveCard] = useState(0);
  const cards = HERO_IMAGES.floatingCards;

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), 80);
    const t2 = setInterval(() => setActiveCard(p => (p + 1) % cards.length), 3200);
    return () => { clearTimeout(t1); clearInterval(t2); };
  }, [cards.length]);

  const hasBg = !!HERO_IMAGES.background;

  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden bg-[#0d1a0e]">

      {/* ═══════════════════════════════════════════════════════
          BACKGROUND LAYER
          Ảnh được điều chỉnh từ lib/imageConfig.ts → HERO_IMAGES.background
          ═══════════════════════════════════════════════════════ */}
      <div className="absolute inset-0 z-0">

        {/* 1. Ảnh nền — opacity 0.38 để không lấn át chữ */}
        {hasBg && (
          <img
            src={HERO_IMAGES.background}
            alt=""
            aria-hidden
            className="absolute inset-0 w-full h-full object-cover"
            style={{ opacity: 0.38 }}
          />
        )}

        {/* 2. Gradient overlay — làm tối góc trái + bottom để text luôn đọc được */}
        <div
          className="absolute inset-0"
          style={{
            background: hasBg
              ? "linear-gradient(105deg, rgba(8,18,9,0.94) 0%, rgba(13,26,14,0.80) 38%, rgba(13,26,14,0.28) 68%, rgba(10,16,10,0.60) 100%)"
              : "linear-gradient(135deg, #0d1a0e 0%, #162318 50%, #0a1308 100%)",
          }}
        />

        {/* 3. Animated blobs — xanh lá + amber */}
        <div
          className="absolute blob"
          style={{
            width: "70vw", height: "70vw", top: "-15%", left: "-10%",
            background: "radial-gradient(circle, rgba(47,86,50,0.45) 0%, rgba(47,86,50,0.06) 50%, transparent 70%)",
          }}
        />
        <div
          className="absolute blob-delay"
          style={{
            width: "55vw", height: "55vw", bottom: "-10%", right: "-8%",
            background: "radial-gradient(circle, rgba(78,120,50,0.28) 0%, rgba(47,86,50,0.05) 55%, transparent 75%)",
            animation: "blobMorph 22s ease-in-out 5s infinite reverse",
          }}
        />
        <div
          className="absolute"
          style={{
            width: "40vw", height: "40vw", top: "30%", left: "40%",
            background: "radial-gradient(circle, rgba(154,100,32,0.14) 0%, transparent 65%)",
            animation: "blobMorph 14s ease-in-out 2s infinite",
            borderRadius: "60% 40% 70% 30% / 50% 60% 40% 70%",
          }}
        />

        {/* 4. Grid lines */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(157,196,158,1) 1px, transparent 1px), linear-gradient(90deg, rgba(157,196,158,1) 1px, transparent 1px)",
            backgroundSize: "80px 80px",
            opacity: hasBg ? 0.022 : 0.042,
          }}
        />

        {/* 5. Corner glows */}
        <div className="absolute top-0 left-0 w-[50vw] h-[50vh] bg-[radial-gradient(ellipse_at_top_left,rgba(79,121,80,0.28)_0%,transparent_60%)]" />
        <div className="absolute bottom-0 right-0 w-[40vw] h-[40vh] bg-[radial-gradient(ellipse_at_bottom_right,rgba(154,100,32,0.12)_0%,transparent_60%)]" />
      </div>

      {/* Grain texture */}
      <div
        className="absolute inset-0 z-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")",
          backgroundSize: "200px 200px",
        }}
      />

      {/* ═══════════════════════════════════════════════════════
          MAIN CONTENT
          ═══════════════════════════════════════════════════════ */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 py-24 lg:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-center">

          {/* LEFT — Text */}
          <div>
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full text-xs font-semibold tracking-widest uppercase mb-8"
              style={{
                background: "rgba(157,196,158,0.12)",
                border: "1px solid rgba(157,196,158,0.25)",
                color: "#9dc49e",
                opacity: visible ? 1 : 0,
                transform: visible ? "none" : "translateY(16px)",
                transition: "all 0.7s cubic-bezier(0.22,1,0.36,1)",
              }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#9dc49e] animate-pulse" />
              Đặc Sản Sơn La · Thuần Khiết
            </div>

            {/* Heading */}
            <h1
              className="font-extrabold leading-[1.04] mb-6"
              style={{
                fontSize: "clamp(2.6rem, 6vw, 4.8rem)",
                color: "#faf8f4",
                opacity: visible ? 1 : 0,
                transform: visible ? "none" : "translateY(28px)",
                transition: "all 0.8s 100ms cubic-bezier(0.22,1,0.36,1)",
              }}
            >
              Mộc Sơn
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #9dc49e 0%, #6fa470 40%, #f6c87a 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Hương Vị
              </span>
              <br />
              Núi Rừng
            </h1>

            {/* Description */}
            <p
              className="text-base sm:text-lg leading-relaxed mb-10 max-w-md"
              style={{
                color: "rgba(201,222,202,0.75)",
                opacity: visible ? 1 : 0,
                transform: visible ? "none" : "translateY(20px)",
                transition: "all 0.8s 220ms cubic-bezier(0.22,1,0.36,1)",
              }}
            >
              Tuyển chọn đặc sản vùng cao — thịt gác bếp hun khói, trà shan tuyết cổ thụ,
              mắc khén thơm lừng từ cao nguyên Mộc Châu.
            </p>

            {/* CTAs */}
            <div
              className="flex flex-wrap gap-4"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "none" : "translateY(16px)",
                transition: "all 0.8s 340ms cubic-bezier(0.22,1,0.36,1)",
              }}
            >
              <Link
                href="/products"
                className="btn-liquid inline-flex items-center gap-2.5 px-8 py-4 rounded-full font-bold text-sm text-[#0e1a0f]"
                style={{
                  background: "linear-gradient(135deg, #9dc49e 0%, #6fa470 100%)",
                  boxShadow: "0 0 0 1px rgba(157,196,158,0.3), 0 12px 32px rgba(79,133,80,0.35)",
                }}
              >
                Khám Phá Ngay
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/create-gift-box"
                className="btn-liquid inline-flex items-center gap-2.5 px-8 py-4 rounded-full font-bold text-sm"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "#e8f0e8",
                  backdropFilter: "blur(12px)",
                }}
              >
                🎁 Tạo Gói Quà
              </Link>
            </div>

            {/* Stats */}
            <div
              className="flex items-center gap-8 mt-12 pt-8"
              style={{
                borderTop: "1px solid rgba(157,196,158,0.12)",
                opacity: visible ? 1 : 0,
                transition: "all 0.8s 460ms cubic-bezier(0.22,1,0.36,1)",
              }}
            >
              {STATS.map(s => (
                <div key={s.label}>
                  <div className="font-extrabold text-2xl" style={{ color: "#9dc49e" }}>{s.value}</div>
                  <div className="text-xs mt-0.5" style={{ color: "rgba(201,222,202,0.55)" }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — Floating Cards */}
          <div
            className="relative hidden lg:flex items-center justify-center"
            style={{ height: 520 }}
          >
            {/* Main hero card */}
            <div
              className="absolute float"
              style={{
                width: 340, height: 400, borderRadius: 32,
                overflow: "hidden",
                background: "rgba(47,86,50,0.3)",
                backdropFilter: "blur(8px)",
                border: "1px solid rgba(255,255,255,0.12)",
                boxShadow: "0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.10)",
                left: "50%", top: "50%",
                transform: "translate(-50%, -50%)",
                opacity: visible ? 1 : 0,
                transition: "opacity 0.9s 300ms ease",
              }}
            >
              <img
                src={HERO_IMAGES.main}
                alt="Sơn La mountains"
                className="w-full h-full object-cover opacity-70"
              />
              <div
                className="absolute inset-0"
                style={{ background: "linear-gradient(to top, rgba(14,26,15,0.85) 0%, transparent 50%)" }}
              />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="text-xs font-semibold mb-1"
                  style={{ color: "rgba(201,222,202,0.7)", letterSpacing: "0.12em" }}>
                  VÙNG CAO SƠN LA
                </div>
                <div className="text-xl font-extrabold text-white">100% Thiên Nhiên</div>
              </div>
              <div
                className="absolute top-5 right-5 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold"
                style={{
                  background: "rgba(157,196,158,0.25)",
                  border: "1px solid rgba(157,196,158,0.35)",
                  color: "#9dc49e",
                  backdropFilter: "blur(12px)",
                }}
              >
                ✓ Chính Hãng
              </div>
            </div>

            {/* Floating product card — left */}
            <div
              className="absolute float-2"
              style={{
                left: -20, top: 60, width: 160, borderRadius: 20,
                overflow: "hidden",
                background: "rgba(255,255,255,0.92)",
                boxShadow: "0 16px 48px rgba(0,0,0,0.35)",
                opacity: visible ? 1 : 0,
                transition: "opacity 0.9s 500ms ease",
              }}
            >
              <div className="relative h-24 overflow-hidden">
                <img
                  src={cards[activeCard].img}
                  alt={cards[activeCard].name}
                  className="w-full h-full object-cover transition-opacity duration-400"
                />
              </div>
              <div className="p-3">
                <div className="text-[10px] font-bold mb-0.5 truncate" style={{ color: "#3a6b3d" }}>
                  {cards[activeCard].name}
                </div>
                <div className="text-sm font-extrabold" style={{ color: "#d4922b" }}>
                  {cards[activeCard].price}
                </div>
              </div>
            </div>

            {/* Toast notification — right */}
            <div
              className="absolute float-3"
              style={{
                right: -16, bottom: 110, borderRadius: 16,
                padding: "12px 16px",
                background: "rgba(14,26,15,0.85)",
                border: "1px solid rgba(157,196,158,0.20)",
                backdropFilter: "blur(16px)",
                boxShadow: "0 12px 32px rgba(0,0,0,0.40)",
                opacity: visible ? 1 : 0,
                transition: "opacity 0.9s 650ms ease",
              }}
            >
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl overflow-hidden shrink-0">
                  <img
                    src={HERO_IMAGES.toastProduct}
                    alt="Mật Ong Rừng"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <div className="text-[10px] font-semibold" style={{ color: "#9dc49e" }}>Mới Về</div>
                  <div className="text-xs font-bold text-white">Mật Ong Rừng</div>
                </div>
              </div>
            </div>

            {/* Shimmer ring */}
            <div
              className="absolute rounded-full pointer-events-none"
              style={{
                width: 380, height: 380,
                left: "50%", top: "50%",
                transform: "translate(-50%, -50%)",
                border: "1px solid rgba(157,196,158,0.08)",
                animation: "blobMorph 20s ease-in-out infinite",
                opacity: visible ? 0.6 : 0,
                transition: "opacity 1.2s ease",
              }}
            />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ opacity: visible ? 0.5 : 0, transition: "opacity 1s 800ms ease" }}
      >
        <span className="text-[10px] tracking-[0.3em] uppercase" style={{ color: "#9dc49e" }}>
          Cuộn Xuống
        </span>
        <div
          className="w-px h-10"
          style={{
            background: "linear-gradient(to bottom, #9dc49e, transparent)",
            animation: "floatY 2s ease-in-out infinite",
          }}
        />
      </div>
    </section>
  );
}