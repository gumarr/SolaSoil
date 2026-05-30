"use client";

import { useState, useEffect } from "react";
import { useInView } from "@/hooks/useInView";
import { type Product } from "@/lib/data";
import { useCart } from "@/context/CartContext";
import LensImage from "@/components/ui/LensImage";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

interface Category {
  id: string;
  name: string;
  icon: string | null;
}

interface ProductsSectionProps {
  activeCategory: string;
  filteredProducts: Product[];
  categories: Category[];
}

export default function ProductsSection({
  activeCategory,
  filteredProducts,
  categories,
}: ProductsSectionProps) {
  const [ref, inView] = useInView(0.05);
  const { addItem } = useCart();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const router = useRouter();

  // Reset to page 1 when category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory]);

  const onCategoryChange = (id: string) => {
    const params = new URLSearchParams();
    if (id !== 'all') params.set('category', id);
    router.push(`/?${params.toString()}`, { scroll: false });
  };

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section
      id="products"
      className="py-24 relative overflow-hidden"
      style={{ background: "var(--ivory)" }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 right-0 w-[40%] h-[60%] opacity-30"
          style={{
            background:
              "radial-gradient(ellipse at top right, rgba(201,222,202,0.60) 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-[35%] h-[50%] opacity-20"
          style={{
            background:
              "radial-gradient(ellipse at bottom left, rgba(214,185,122,0.40) 0%, transparent 65%)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10">
        <div
          ref={ref}
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-12 gap-6"
        >
          <div
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "none" : "translateY(20px)",
              transition: "all 0.7s cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            <div
              className="text-xs font-bold uppercase tracking-[0.20em] mb-3"
              style={{ color: "#6fa470" }}
            >
              Tuyển Chọn Tinh Tế
            </div>
            <h2
              className="font-extrabold leading-tight"
              style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "#1a2e1b" }}
            >
              Đặc Sản Nổi Bật
            </h2>
          </div>

          <div
            className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide"
            style={{
              opacity: inView ? 1 : 0,
              transition: "all 0.7s 150ms cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            <button
              onClick={() => onCategoryChange('all')}
              className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300"
              style={
                activeCategory === 'all'
                  ? {
                      background: "linear-gradient(135deg, #2f5632, #4d8550)",
                      color: "#faf8f4",
                      boxShadow: "0 4px 16px rgba(47,86,50,0.25)",
                    }
                  : {
                      background: "rgba(47,86,50,0.07)",
                      color: "#3a6b3d",
                      border: "1px solid rgba(201,222,202,0.35)",
                    }
              }
            >
              🌿 Tất Cả
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onCategoryChange(cat.id)}
                className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300"
                style={
                  activeCategory === cat.id
                    ? {
                        background: "linear-gradient(135deg, #2f5632, #4d8550)",
                        color: "#faf8f4",
                        boxShadow: "0 4px 16px rgba(47,86,50,0.25)",
                        transform: "translateY(-1px)",
                      }
                    : {
                        background: "rgba(47,86,50,0.07)",
                        color: "#3a6b3d",
                        border: "1px solid rgba(201,222,202,0.35)",
                      }
                }
              >
                <span>{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {paginatedProducts.length > 0 ? paginatedProducts.map((p, i) => (
            <div
              key={p.id}
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "none" : "translateY(32px)",
                transition: `all 0.65s ${i * 70}ms cubic-bezier(0.22,1,0.36,1)`,
              }}
            >
              <div
                className="group rounded-2xl overflow-hidden card-hover"
                style={{
                  background: "#ffffff",
                  border: "1px solid rgba(201,222,202,0.35)",
                  boxShadow: "0 2px 12px rgba(47,86,50,0.06)",
                }}
              >
                <div className="h-52 relative overflow-hidden">
                  <Link href={`/products/${p.id}`} className="block w-full h-full">
                    <LensImage
                      mainImage={p.image_main}
                      revealImage={p.image_reveal || p.image_main}
                      baseGrad={p.grad}
                      revealGrad={p.revealGrad}
                      emoji={p.emoji}
                      revealEmoji={p.revealEmoji}
                      lensSize={130}
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
                  </Link>

                  <div
                    className="absolute inset-x-3 bottom-3 z-30
                               opacity-100 translate-y-0
                               transition-all duration-300"
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addItem({
                          id: p.id,
                          name: p.name,
                          priceNum: p.priceNum,
                          priceLabel: p.price,
                          weight: p.weight,
                          emoji: p.emoji,
                          grad: p.grad,
                          image_thumb: p.image_thumb,
                          image_main: p.image_main,
                        });
                      }}
                      className="w-full py-2.5 rounded-xl text-xs font-bold btn-liquid cursor-pointer"
                      style={{
                        background: "rgba(250,248,244,0.95)",
                        color: "#2f5632",
                        backdropFilter: "blur(12px)",
                        boxShadow: "0 4px 16px rgba(0,0,0,0.20)",
                      }}
                    >
                      + Thêm vào giỏ
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <div
                    className="text-[10px] font-bold uppercase tracking-wider mb-1"
                    style={{ color: "#9a6420" }}
                  >
                    {p.category}
                  </div>
                  <h3
                    className="font-bold text-sm mb-1 leading-snug hover:text-emerald-700 transition-colors"
                    style={{ color: "#1a2e1b" }}
                  >
                    <Link href={`/products/${p.id}`}>{p.name}</Link>
                  </h3>
                  <p
                    className="text-xs leading-relaxed line-clamp-2 mb-3"
                    style={{ color: "#6fa470" }}
                  >
                    {p.desc}
                  </p>
                  <div className="flex items-center justify-between">
                    <span
                      className="font-extrabold text-base"
                      style={{ color: "#d4922b" }}
                    >
                      {p.price}
                    </span>
                    <span
                      className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
                      style={{
                        background: "rgba(47,86,50,0.08)",
                        color: "#4d8550",
                      }}
                    >
                      {p.weight}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )) : (
            <div className="col-span-full py-20 text-center text-stone-400 font-medium">
              Chưa có sản phẩm nào trong mục này.
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div
            className="flex items-center justify-center gap-2 mt-12"
            style={{
              opacity: inView ? 1 : 0,
              transition: "all 0.7s 500ms ease",
            }}
          >
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-2.5 rounded-xl transition-all duration-300 flex items-center justify-center"
              style={{
                background: currentPage === 1 
                  ? "rgba(201,222,202,0.20)" 
                  : "rgba(47,86,50,0.12)",
                border: "1px solid rgba(201,222,202,0.30)",
                color: currentPage === 1 ? "#9dc49e" : "#2f5632",
              }}
              aria-label="Previous page"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className="min-w-[36px] h-9 rounded-lg font-semibold text-sm transition-all duration-300"
                  style={
                    currentPage === page
                      ? {
                          background: "linear-gradient(135deg, #2f5632, #4d8550)",
                          color: "#faf8f4",
                          boxShadow: "0 4px 12px rgba(47,86,50,0.25)",
                        }
                      : {
                          background: "rgba(47,86,50,0.08)",
                          color: "#2f5632",
                          border: "1px solid rgba(201,222,202,0.25)",
                        }
                  }
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="p-2.5 rounded-xl transition-all duration-300 flex items-center justify-center"
              style={{
                background: currentPage === totalPages 
                  ? "rgba(201,222,202,0.20)" 
                  : "rgba(47,86,50,0.12)",
                border: "1px solid rgba(201,222,202,0.30)",
                color: currentPage === totalPages ? "#9dc49e" : "#2f5632",
              }}
              aria-label="Next page"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </section>
  );
}