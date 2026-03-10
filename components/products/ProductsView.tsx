"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { PRODUCTS, CATEGORY_TABS } from "@/lib/data";
import { useCart } from "@/context/CartContext";
import AnnouncementBar from "@/components/home/AnnouncementBar";
import NavBar from "@/components/home/NavBar";
import Footer from "@/components/home/Footer";

const SORT_OPTIONS = [
  { value: "featured",   label: "Nổi bật" },
  { value: "price-asc",  label: "Giá: Thấp → Cao" },
  { value: "price-desc", label: "Giá: Cao → Thấp" },
  { value: "name-asc",   label: "Tên: A → Z" },
];

export default function ProductsView() {
  const searchParams = useSearchParams();
  const initialCat = searchParams.get("cat") ?? "all";

  const [activeCategory, setActiveCategory] = useState(initialCat);
  const [sortBy, setSortBy]                 = useState("featured");
  const [search, setSearch]                 = useState("");
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const { addItem } = useCart();

  let filtered = PRODUCTS
    .filter(p => activeCategory === "all" || p.categoryId === activeCategory)
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.desc.toLowerCase().includes(search.toLowerCase()));

  filtered = [...filtered].sort((a, b) => {
    if (sortBy === "price-asc")  return a.priceNum - b.priceNum;
    if (sortBy === "price-desc") return b.priceNum - a.priceNum;
    if (sortBy === "name-asc")   return a.name.localeCompare(b.name, "vi");
    return 0;
  });

  const SidebarFilters = () => (
    <div className="space-y-7">
      {/* Search */}
      <div>
        <p className="text-xs font-bold text-green-700 uppercase tracking-wider mb-2.5">Tìm Kiếm</p>
        <div className="relative">
          <input
            type="text"
            placeholder="Tên sản phẩm..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 border border-green-200 rounded-xl text-sm text-green-900 placeholder:text-green-400 focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-100 bg-white transition-all"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"/>
          </svg>
        </div>
      </div>

      {/* Category */}
      <div>
        <p className="text-xs font-bold text-green-700 uppercase tracking-wider mb-2.5">Danh Mục</p>
        <div className="space-y-1">
          {CATEGORY_TABS.map(tab => {
            const tabCount = tab.id === "all" ? PRODUCTS.length : PRODUCTS.filter(p => p.categoryId === tab.id).length;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveCategory(tab.id)}
                className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeCategory === tab.id
                    ? "bg-green-800 text-white shadow-sm"
                    : "text-green-700 hover:bg-green-50"
                }`}
              >
                <span>{tab.icon}</span>
                <span className="flex-1 text-left">{tab.label}</span>
                <span className={`text-xs ${activeCategory === tab.id ? "text-green-300" : "text-green-400"}`}>{tabCount}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Sort */}
      <div>
        <p className="text-xs font-bold text-green-700 uppercase tracking-wider mb-2.5">Sắp Xếp</p>
        <div className="space-y-1">
          {SORT_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setSortBy(opt.value)}
              className={`w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                sortBy === opt.value
                  ? "bg-amber-50 text-amber-800 border border-amber-200"
                  : "text-green-700 hover:bg-green-50"
              }`}
            >
              {sortBy === opt.value && <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0"/>}
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reset */}
      {(activeCategory !== "all" || search || sortBy !== "featured") && (
        <button
          onClick={() => { setActiveCategory("all"); setSearch(""); setSortBy("featured"); }}
          className="w-full flex items-center justify-center gap-1.5 text-xs text-green-600 hover:text-green-900 py-2 border border-dashed border-green-200 rounded-xl hover:border-green-400 transition-colors"
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
          </svg>
          Xóa bộ lọc
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-white">
      <AnnouncementBar />
      <NavBar />

      {/* Page Header */}
      <div className="bg-green-50 border-b border-green-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-10">
          <nav className="flex items-center gap-2 text-sm text-green-500 mb-3">
            <Link href="/" className="hover:text-green-800 transition-colors">Trang chủ</Link>
            <span className="text-green-300">/</span>
            <span className="text-green-800 font-medium">Sản Phẩm</span>
          </nav>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-green-900">Tất Cả Sản Phẩm</h1>
          <p className="text-green-600 mt-2 text-sm sm:text-base">Đặc sản Sơn La — thuần khiết từ núi rừng Tây Bắc, giao tận tay bạn</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-10">
        <div className="flex gap-8 lg:gap-10">

          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-56 shrink-0">
            <div className="sticky top-24">
              <SidebarFilters />
            </div>
          </aside>

          {/* Main */}
          <div className="flex-1 min-w-0">
            {/* Top bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 mb-7 pb-5 border-b border-green-100">
              <p className="text-green-700 text-sm">
                <span className="font-bold text-green-900 text-lg">{filtered.length}</span>
                <span className="ml-1.5">sản phẩm</span>
                {activeCategory !== "all" && (
                  <span className="ml-1">trong <span className="font-semibold text-green-800">{CATEGORY_TABS.find(t => t.id === activeCategory)?.label}</span></span>
                )}
              </p>
              <button
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden flex items-center gap-2 text-sm font-semibold text-green-800 border border-green-200 rounded-full px-4 py-2 hover:bg-green-50 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M3 4h18M7 8h10M11 12h4"/></svg>
                Lọc & Sắp xếp
              </button>
            </div>

            {/* Product Grid */}
            {filtered.length === 0 ? (
              <div className="text-center py-24">
                <span className="text-5xl block mb-4">🔍</span>
                <p className="font-bold text-green-900 text-lg mb-2">Không tìm thấy sản phẩm</p>
                <p className="text-green-500 text-sm mb-6">Thử thay đổi từ khóa hoặc bộ lọc</p>
                <button onClick={() => { setSearch(""); setActiveCategory("all"); }} className="bg-green-800 text-white px-7 py-3 rounded-full text-sm font-semibold hover:bg-green-700 transition-colors">
                  Xóa bộ lọc
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
                {filtered.map(p => (
                  <div key={p.id} className="group bg-white border border-green-100 rounded-2xl overflow-hidden hover:border-green-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col">
                    {/* Image */}
                    <div className={`h-52 bg-linear-to-br ${p.grad} relative flex items-center justify-center`}>
                      {p.badge && (
                        <span className="absolute top-3 left-3 bg-white/25 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full">{p.badge}</span>
                      )}
                      <span className="text-5xl group-hover:scale-110 transition-transform duration-300 drop-shadow-lg">{p.emoji}</span>
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300 rounded-t-2xl"/>
                    </div>
                    {/* Content */}
                    <div className="p-5 flex flex-col flex-1">
                      <span className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">{p.category}</span>
                      <h3 className="font-bold text-green-900 text-base mt-1 mb-1.5 leading-snug">{p.name}</h3>
                      <p className="text-green-600 text-sm leading-relaxed line-clamp-2 flex-1">{p.desc}</p>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-green-100">
                        <div>
                          <p className="font-extrabold text-amber-700 text-lg leading-none">{p.price}</p>
                          <p className="text-green-400 text-xs mt-1">{p.weight}</p>
                        </div>
                        <button
                          onClick={() => addItem({ id: p.id, name: p.name, priceNum: p.priceNum, priceLabel: p.price, weight: p.weight, emoji: p.emoji, grad: p.grad })}
                          className="flex items-center gap-1.5 bg-green-800 hover:bg-green-700 text-white text-xs font-bold px-4 py-2.5 rounded-full transition-all hover:shadow-md hover:-translate-y-0.5"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4"/></svg>
                          Giỏ hàng
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {showMobileFilters && (
        <>
          <div className="fixed inset-0 bg-black/30 z-40" onClick={() => setShowMobileFilters(false)}/>
          <div className="fixed bottom-0 left-0 right-0 bg-white z-50 rounded-t-3xl p-6 shadow-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="font-bold text-green-900 text-lg">Lọc & Sắp xếp</h3>
              <button onClick={() => setShowMobileFilters(false)} className="w-8 h-8 rounded-full bg-green-50 flex items-center justify-center text-green-700">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
              </button>
            </div>
            <SidebarFilters />
            <button onClick={() => setShowMobileFilters(false)} className="w-full mt-6 bg-green-800 text-white font-bold py-3.5 rounded-full text-sm hover:bg-green-700 transition-colors">
              Xem {filtered.length} sản phẩm
            </button>
          </div>
        </>
      )}

      <Footer />
    </div>
  );
}
