"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { PRODUCTS, CATEGORY_TABS } from "@/lib/data";
import { useCart } from "@/context/CartContext";
import AnnouncementBar from "@/components/home/AnnouncementBar";
import NavBar from "@/components/home/NavBar";
import Footer from "@/components/home/Footer";
import LensImage from "@/components/ui/LensImage";
import { PRODUCT_IMAGES } from "@/lib/imageConfig";

const SORT_OPTIONS = [
  { value: "featured",   label: "Nổi bật" },
  { value: "price-asc",  label: "Giá: Thấp → Cao" },
  { value: "price-desc", label: "Giá: Cao → Thấp" },
  { value: "name-asc",   label: "Tên: A → Z" },
];

export default function ProductsView() {
  const searchParams  = useSearchParams();
  const initialCat    = searchParams.get("cat") ?? "all";

  const [activeCategory,    setActiveCategory]    = useState(initialCat);
  const [sortBy,            setSortBy]            = useState("featured");
  const [search,            setSearch]            = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const { addItem } = useCart();

  let filtered = PRODUCTS
    .filter(p => activeCategory === "all" || p.categoryId === activeCategory)
    .filter(p =>
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.desc.toLowerCase().includes(search.toLowerCase())
    );

  filtered = [...filtered].sort((a, b) => {
    if (sortBy === "price-asc")  return a.priceNum - b.priceNum;
    if (sortBy === "price-desc") return b.priceNum - a.priceNum;
    if (sortBy === "name-asc")   return a.name.localeCompare(b.name, "vi");
    return 0;
  });

  /* ── Sidebar filters (shared desktop + mobile) ── */
  const SidebarFilters = () => (
    <div className="space-y-6">

      {/* Search */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] mb-3"
          style={{ color: "#9a6420" }}>
          Tìm Kiếm
        </p>
        <div className="relative">
          <input
            type="text"
            placeholder="Tên sản phẩm..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
            style={{
              background: "rgba(255,255,255,0.80)",
              border: "1px solid rgba(201,222,202,0.40)",
              color: "#1a2e1b",
            }}
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: "#9dc49e" }}
            fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round"
              d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
          </svg>
        </div>
      </div>

      {/* Category */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] mb-3"
          style={{ color: "#9a6420" }}>
          Danh Mục
        </p>
        <div className="space-y-0.5">
          {CATEGORY_TABS.map(tab => {
            const cnt = tab.id === "all"
              ? PRODUCTS.length
              : PRODUCTS.filter(p => p.categoryId === tab.id).length;
            const active = activeCategory === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                style={active ? {
                  background: "linear-gradient(135deg, #2f5632, #4d8550)",
                  color: "#faf8f4",
                  boxShadow: "0 4px 12px rgba(47,86,50,0.20)",
                } : {
                  color: "#3a6b3d",
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(47,86,50,0.07)"; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
              >
                <span>{tab.icon}</span>
                <span className="flex-1 text-left">{tab.label}</span>
                <span className="text-xs" style={{ color: active ? "rgba(201,222,202,0.65)" : "#9dc49e" }}>
                  {cnt}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sort */}
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.18em] mb-3"
          style={{ color: "#9a6420" }}>
          Sắp Xếp
        </p>
        <div className="space-y-0.5">
          {SORT_OPTIONS.map(opt => {
            const active = sortBy === opt.value;
            return (
              <button
                key={opt.value}
                onClick={() => setSortBy(opt.value)}
                className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200"
                style={active ? {
                  background: "rgba(246,200,122,0.15)",
                  color: "#9a6420",
                  border: "1px solid rgba(246,200,122,0.25)",
                } : {
                  color: "#3a6b3d",
                }}
                onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(47,86,50,0.07)"; }}
                onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
              >
                {active && (
                  <span className="w-1.5 h-1.5 rounded-full shrink-0"
                    style={{ background: "#d4922b" }} />
                )}
                {opt.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Reset */}
      {(activeCategory !== "all" || search || sortBy !== "featured") && (
        <button
          onClick={() => { setActiveCategory("all"); setSearch(""); setSortBy("featured"); }}
          className="w-full flex items-center justify-center gap-1.5 text-xs py-2.5 rounded-xl transition-all duration-200"
          style={{
            border: "1px dashed rgba(201,222,202,0.50)",
            color: "#6fa470",
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = "#9dc49e"; e.currentTarget.style.color = "#2f5632"; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = "rgba(201,222,202,0.50)"; e.currentTarget.style.color = "#6fa470"; }}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
          Xóa bộ lọc
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: "var(--ivory)" }}>
      <AnnouncementBar />
      <NavBar />

      {/* ── Page Header ── */}
      <div
        className="relative overflow-hidden"
        style={{ background: "#f0f4f0", borderBottom: "1px solid rgba(201,222,202,0.25)" }}
      >
        {/* Subtle tint */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at top right, rgba(201,222,202,0.40) 0%, transparent 60%)" }} />

        <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10 py-10">
          <nav className="flex items-center gap-2 text-sm mb-4">
            <Link
              href="/"
              className="transition-colors duration-200"
              style={{ color: "#9dc49e" }}
              onMouseEnter={e => (e.currentTarget.style.color = "#2f5632")}
              onMouseLeave={e => (e.currentTarget.style.color = "#9dc49e")}
            >
              Trang chủ
            </Link>
            <span style={{ color: "rgba(201,222,202,0.60)" }}>/</span>
            <span className="font-semibold" style={{ color: "#2f5632" }}>Sản Phẩm</span>
          </nav>
          <h1
            className="font-extrabold leading-tight mb-2"
            style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", color: "#1a2e1b" }}
          >
            Tất Cả Sản Phẩm
          </h1>
          <p className="text-sm" style={{ color: "#6fa470" }}>
            Đặc sản Sơn La — thuần khiết từ núi rừng Tây Bắc, giao tận tay bạn
          </p>
        </div>
      </div>

      {/* ── Main Layout ── */}
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-10">
        <div className="flex gap-8 lg:gap-10">

          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-52 shrink-0">
            <div
              className="sticky top-24 rounded-2xl p-5"
              style={{
                background: "rgba(255,255,255,0.80)",
                border: "1px solid rgba(201,222,202,0.30)",
                boxShadow: "0 4px 20px rgba(47,86,50,0.06)",
                backdropFilter: "blur(12px)",
              }}
            >
              <SidebarFilters />
            </div>
          </aside>

          {/* Product area */}
          <div className="flex-1 min-w-0">

            {/* Topbar */}
            <div
              className="flex flex-wrap items-center justify-between gap-3 mb-8 pb-5"
              style={{ borderBottom: "1px solid rgba(201,222,202,0.25)" }}
            >
              <p className="text-sm" style={{ color: "#4d8550" }}>
                <span className="font-extrabold text-xl" style={{ color: "#1a2e1b" }}>
                  {filtered.length}
                </span>
                <span className="ml-1.5">sản phẩm</span>
                {activeCategory !== "all" && (
                  <span className="ml-1">
                    trong{" "}
                    <span className="font-semibold" style={{ color: "#2f5632" }}>
                      {CATEGORY_TABS.find(t => t.id === activeCategory)?.label}
                    </span>
                  </span>
                )}
              </p>

              {/* Mobile filter btn */}
              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all btn-liquid"
                style={{
                  border: "1px solid rgba(201,222,202,0.35)",
                  color: "#2f5632",
                  background: "rgba(255,255,255,0.80)",
                }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 8h10M11 12h4" />
                </svg>
                Lọc & Sắp xếp
              </button>
            </div>

            {/* Empty */}
            {filtered.length === 0 ? (
              <div className="text-center py-24">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mb-5 mx-auto"
                  style={{ background: "rgba(157,196,158,0.12)" }}
                >
                  🔍
                </div>
                <p className="font-bold text-xl mb-2" style={{ color: "#1a2e1b" }}>
                  Không tìm thấy sản phẩm
                </p>
                <p className="text-sm mb-6" style={{ color: "#6fa470" }}>
                  Thử thay đổi từ khóa hoặc bộ lọc
                </p>
                <button
                  onClick={() => { setSearch(""); setActiveCategory("all"); }}
                  className="px-7 py-3 rounded-full text-sm font-bold text-white btn-liquid"
                  style={{
                    background: "linear-gradient(135deg, #2f5632, #4d8550)",
                    boxShadow: "0 4px 16px rgba(47,86,50,0.25)",
                  }}
                >
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {filtered.map(p => {
                  const imgs = PRODUCT_IMAGES[p.id];
                  return (
                    <div
                      key={p.id}
                      className="group rounded-2xl overflow-hidden flex flex-col card-hover"
                      style={{
                        background: "#ffffff",
                        border: "1px solid rgba(201,222,202,0.30)",
                        boxShadow: "0 2px 12px rgba(47,86,50,0.06)",
                      }}
                    >
                      {/* LensImage */}
                      <div className="h-52 shrink-0">
                        <LensImage
                          mainImage={imgs?.main}
                          revealImage={imgs?.reveal}
                          baseGrad={p.grad}
                          revealGrad={p.revealGrad}
                          emoji={p.emoji}
                          revealEmoji={p.revealEmoji}
                          lensSize={160}
                          alt={p.name}
                          className="w-full h-full"
                        >
                          {p.badge && (
                            <div className="relative z-10 p-3">
                              <span
                                className="px-2.5 py-1 rounded-full text-[10px] font-bold"
                                style={{
                                  background: "rgba(250,248,244,0.92)",
                                  color: "#9a6420",
                                  backdropFilter: "blur(8px)",
                                }}
                              >
                                {p.badge}
                              </span>
                            </div>
                          )}
                        </LensImage>
                      </div>

                      {/* Info */}
                      <div className="p-5 flex flex-col flex-1">
                        <span
                          className="text-[10px] font-bold uppercase tracking-wider mb-1"
                          style={{ color: "#9a6420" }}
                        >
                          {p.category}
                        </span>
                        <h3
                          className="font-bold text-base mb-1.5 leading-snug"
                          style={{ color: "#1a2e1b" }}
                        >
                          {p.name}
                        </h3>
                        <p
                          className="text-sm leading-relaxed line-clamp-2 flex-1"
                          style={{ color: "#6fa470" }}
                        >
                          {p.desc}
                        </p>
                        <div
                          className="flex items-center justify-between mt-4 pt-4"
                          style={{ borderTop: "1px solid rgba(201,222,202,0.25)" }}
                        >
                          <div>
                            <p className="font-extrabold text-lg leading-none"
                              style={{ color: "#d4922b" }}>
                              {p.price}
                            </p>
                            <p className="text-xs mt-1" style={{ color: "#9dc49e" }}>
                              {p.weight}
                            </p>
                          </div>
                          <button
                            onClick={() =>
                              addItem({
                                id: p.id, name: p.name, priceNum: p.priceNum,
                                priceLabel: p.price, weight: p.weight,
                                emoji: p.emoji, grad: p.grad,
                              })
                            }
                            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full text-xs font-bold text-white btn-liquid"
                            style={{
                              background: "linear-gradient(135deg, #2f5632, #4d8550)",
                              boxShadow: "0 4px 12px rgba(47,86,50,0.22)",
                            }}
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24"
                              stroke="currentColor" strokeWidth={2.5}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                            </svg>
                            Giỏ hàng
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile filter bottom sheet ── */}
      {showMobileFilters && (
        <>
          <div
            className="fixed inset-0 z-40 transition-all duration-300"
            style={{ background: "rgba(14,26,15,0.45)", backdropFilter: "blur(4px)" }}
            onClick={() => setShowMobileFilters(false)}
          />
          <div
            className="fixed bottom-0 left-0 right-0 z-50 rounded-t-3xl p-6
                       max-h-[82vh] overflow-y-auto"
            style={{
              background: "rgba(250,248,244,0.97)",
              backdropFilter: "blur(24px) saturate(180%)",
              boxShadow: "0 -16px 60px rgba(47,86,50,0.18)",
              borderTop: "1px solid rgba(201,222,202,0.25)",
            }}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-lg" style={{ color: "#1a2e1b" }}>
                Lọc & Sắp xếp
              </h3>
              <button
                onClick={() => setShowMobileFilters(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center transition-all"
                style={{ background: "rgba(47,86,50,0.08)", color: "#4d8550" }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <SidebarFilters />

            <button
              onClick={() => setShowMobileFilters(false)}
              className="w-full mt-6 py-4 rounded-2xl font-bold text-sm text-white btn-liquid"
              style={{
                background: "linear-gradient(135deg, #2f5632, #4d8550)",
                boxShadow: "0 4px 16px rgba(47,86,50,0.25)",
              }}
            >
              Xem {filtered.length} sản phẩm
            </button>
          </div>
        </>
      )}

      <Footer />
    </div>
  );
}