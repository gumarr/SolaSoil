"use client";

import { useState, useMemo } from "react";
import type { Product } from "@/lib/data";
import { PRODUCT_IMAGES } from "@/lib/imageConfig";
import { MagnifyingGlass, HandGrabbing, CaretLeft, CaretRight } from "@phosphor-icons/react";

const ITEMS_PER_PAGE = 12;

interface ProductListProps {
  products: Product[];
  onProductDragStart: (product: Product, e: React.DragEvent<HTMLDivElement>) => void;
  selectedProductIds?: number[];
}

export default function ProductList({ products, onProductDragStart, selectedProductIds = [] }: ProductListProps) {
  const [page,             setPage]            = useState(0);
  const [search,           setSearch]          = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = useMemo(
    () =>
      Array.from(new Set(products.map(p => p.categoryId))).map(catId => {
        const p = products.find(x => x.categoryId === catId)!;
        return { id: catId, label: p.category, icon: p.emoji };
      }),
    [products]
  );

  const filteredProducts = useMemo(
    () =>
      products.filter(p => {
        const matchSearch =
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.desc.toLowerCase().includes(search.toLowerCase());
        const matchCat = !selectedCategory || p.categoryId === selectedCategory;
        return matchSearch && matchCat;
      }),
    [products, search, selectedCategory]
  );

  const totalPages       = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    page * ITEMS_PER_PAGE,
    (page + 1) * ITEMS_PER_PAGE
  );

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "#f4f7f4", borderRight: "1px solid rgba(201,222,202,0.25)" }}
    >

      {/* ── Search ── */}
      <div
        className="p-4 sticky top-0 z-10"
        style={{
          background: "rgba(250,248,244,0.95)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(201,222,202,0.20)",
        }}
      >
        <div className="relative">
          <input
            type="text"
            placeholder="Tìm kiếm sản phẩm..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(0); }}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none transition-all"
            style={{
              background: "rgba(255,255,255,0.85)",
              border: "1px solid rgba(201,222,202,0.40)",
              color: "#1a2e1b",
            }}
          />
          <MagnifyingGlass
            weight="bold"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4"
            style={{ color: "#9dc49e" }}
          />
        </div>
      </div>

      {/* ── Category pills ── */}
      <div
        className="px-3 py-2.5 flex gap-1.5 overflow-x-auto scrollbar-hide sticky top-[57px] z-10"
        style={{
          background: "rgba(250,248,244,0.95)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(201,222,202,0.20)",
        }}
      >
        <button
          onClick={() => { setSelectedCategory(null); setPage(0); }}
          className="shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200"
          style={selectedCategory === null ? {
            background: "linear-gradient(135deg, #2f5632, #4d8550)",
            color: "#faf8f4",
            boxShadow: "0 2px 8px rgba(47,86,50,0.20)",
          } : {
            background: "rgba(47,86,50,0.08)",
            color: "#3a6b3d",
            border: "1px solid rgba(201,222,202,0.30)",
          }}
        >
          Tất Cả
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => { setSelectedCategory(cat.id); setPage(0); }}
            className="shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all duration-200"
            style={selectedCategory === cat.id ? {
              background: "linear-gradient(135deg, #2f5632, #4d8550)",
              color: "#faf8f4",
              boxShadow: "0 2px 8px rgba(47,86,50,0.20)",
            } : {
              background: "rgba(47,86,50,0.08)",
              color: "#3a6b3d",
              border: "1px solid rgba(201,222,202,0.30)",
            }}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* ── Products grid ── */}
      <div className="flex-1 overflow-y-auto p-3">
        {paginatedProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 py-12 text-center">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
              style={{ background: "rgba(157,196,158,0.12)" }}
            >
              🔍
            </div>
            <p className="text-sm font-semibold" style={{ color: "#3a6b3d" }}>
              Không có sản phẩm nào
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2.5">
            {paginatedProducts.map(product => {
              const imgs = PRODUCT_IMAGES[product.id];
              return (
                <div
                  key={product.id}
                  draggable
                  onDragStart={e => {
                    onProductDragStart(product, e);
                    const el = e.currentTarget;
                    requestAnimationFrame(() => {
                      el.style.transform = "scale(1.05)";
                      el.style.boxShadow = "0 12px 32px rgba(47,86,50,0.25)";
                      el.style.opacity = "0.85";
                      el.style.zIndex = "50";
                    });
                  }}
                  onDragEnd={e => {
                    const el = e.currentTarget;
                    el.style.transform = "";
                    el.style.boxShadow = "0 2px 8px rgba(47,86,50,0.05)";
                    el.style.opacity = "1";
                    el.style.zIndex = "";
                  }}
                  className={`group rounded-xl overflow-hidden cursor-grab active:cursor-grabbing
                             transition-all duration-250 hover:-translate-y-0.5 relative
                             ${selectedProductIds.includes(product.id) ? "ring-2 ring-green-400/60" : ""}`}
                  style={{
                    background: "#ffffff",
                    border: selectedProductIds.includes(product.id)
                      ? "1px solid rgba(74,222,128,0.50)"
                      : "1px solid rgba(201,222,202,0.30)",
                    boxShadow: "0 2px 8px rgba(47,86,50,0.05)",
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.boxShadow = "0 8px 24px rgba(47,86,50,0.14)";
                    if (!selectedProductIds.includes(product.id)) {
                      e.currentTarget.style.borderColor = "rgba(157,196,158,0.50)";
                    }
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(47,86,50,0.05)";
                    if (!selectedProductIds.includes(product.id)) {
                      e.currentTarget.style.borderColor = "rgba(201,222,202,0.30)";
                    }
                  }}
                >
                  {/* Thumbnail — dùng thumb (square 120×120) để không bị giãn */}
                  <div className="relative overflow-hidden" style={{ aspectRatio: "4/3" }}>
                    {imgs?.thumb ? (
                      <img
                        src={imgs.thumb}
                        alt={product.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      /* Gradient + emoji fallback */
                      <div
                        className={`w-full h-full bg-gradient-to-br ${product.grad}
                                   flex items-center justify-center text-3xl
                                   group-hover:scale-105 transition-transform duration-300`}
                      >
                        {product.emoji}
                      </div>
                    )}

                    {/* Drag hint overlay */}
                    <div
                      className="absolute inset-0 flex items-center justify-center
                                 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      style={{ background: "rgba(47,86,50,0.55)" }}
                    >
                      <div
                        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[10px] font-bold"
                        style={{ background: "rgba(250,248,244,0.95)", color: "#2f5632" }}
                      >
                        <HandGrabbing weight="fill" className="w-3.5 h-3.5" />
                        Kéo vào giỏ
                      </div>
                    </div>

                    {/* Badge */}
                    {product.badge && (
                      <div
                        className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold"
                        style={{
                          background: "rgba(250,248,244,0.92)",
                          color: "#9a6420",
                          backdropFilter: "blur(6px)",
                        }}
                      >
                        {product.badge}
                      </div>
                    )}

                    {/* Selected badge */}
                    {selectedProductIds.includes(product.id) && (
                      <div
                        className="absolute top-1.5 right-1.5 px-1.5 py-0.5 rounded text-[9px] font-bold"
                        style={{
                          background: "rgba(34,197,94,0.90)",
                          color: "#ffffff",
                          backdropFilter: "blur(6px)",
                        }}
                      >
                        ✓ Đã chọn
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="p-2.5">
                    <h3
                      className="font-bold text-xs leading-snug line-clamp-2 mb-1"
                      style={{ color: "#1a2e1b" }}
                    >
                      {product.name}
                    </h3>
                    <p className="text-[10px] line-clamp-1 mb-2" style={{ color: "#9dc49e" }}>
                      {product.desc}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-xs" style={{ color: "#d4922b" }}>
                        {product.price}
                      </span>
                      <span
                        className="text-[9px] font-medium px-1.5 py-0.5 rounded"
                        style={{ background: "rgba(47,86,50,0.07)", color: "#4d8550" }}
                      >
                        {product.weight}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div
          className="px-4 py-4 flex items-center justify-center gap-2 sticky bottom-0"
          style={{
            background: "linear-gradient(to top, rgba(250,248,244,1) 60%, rgba(250,248,244,0))",
            backdropFilter: "blur(4px)",
            paddingTop: "24px",
          }}
        >
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="w-8 h-8 flex items-center justify-center rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed group hover:bg-white"
            style={{
              color: "#2f5632",
              background: "rgba(255,255,255,0.6)",
              boxShadow: "0 2px 8px rgba(47,86,50,0.05)",
            }}
          >
            <CaretLeft weight="bold" className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          </button>
          
          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalPages }).map((_, i) => {
              // Show max 5 pages, if more, do some simple hiding
              if (
                totalPages > 5 &&
                i !== 0 && i !== totalPages - 1 &&
                Math.abs(i - page) > 1
              ) {
                if (i === 1 && page > 2) return <span key={i} className="text-xs text-gray-400">...</span>;
                if (i === totalPages - 2 && page < totalPages - 3) return <span key={i} className="text-xs text-gray-400">...</span>;
                return null;
              }
              
              const isActive = i === page;
              return (
                <button
                  key={i}
                  onClick={() => setPage(i)}
                  className={`w-8 h-8 flex items-center justify-center text-xs font-bold rounded-xl transition-all ${
                    isActive ? "shadow-md" : "hover:bg-white"
                  }`}
                  style={isActive ? {
                    background: "linear-gradient(135deg, #2f5632, #4d8550)",
                    color: "#ffffff",
                    boxShadow: "0 4px 12px rgba(47,86,50,0.2)",
                  } : {
                    color: "#6fa470",
                    background: "rgba(255,255,255,0.6)",
                    boxShadow: "0 2px 8px rgba(47,86,50,0.05)",
                  }}
                >
                  {i + 1}
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="w-8 h-8 flex items-center justify-center rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed group hover:bg-white"
            style={{
              color: "#2f5632",
              background: "rgba(255,255,255,0.6)",
              boxShadow: "0 2px 8px rgba(47,86,50,0.05)",
            }}
          >
            <CaretRight weight="bold" className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      )}
    </div>
  );
}