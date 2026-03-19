"use client";

import { useInView } from "@/hooks/useInView";
import { CATEGORY_TABS, type Product } from "@/lib/data";
import { useCart } from "@/context/CartContext";
import LensImage from "@/components/ui/LensImage";
import { PRODUCT_IMAGES } from "@/lib/imageConfig";

interface ProductsSectionProps {
  activeCategory: string;
  onCategoryChange: (id: string) => void;
  filteredProducts: Product[];
}

export default function ProductsSection({
  activeCategory,
  onCategoryChange,
  filteredProducts,
}: ProductsSectionProps) {
  const [ref, inView] = useInView(0.05);
  const { addItem } = useCart();

  return (
    <section
      id="products"
      className="py-24 relative overflow-hidden"
      style={{ background: "var(--ivory)" }}
    >
      {/* Subtle bg tints */}
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
        {/* ── Header ── */}
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

          {/* Category pills */}
          <div
            className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide"
            style={{
              opacity: inView ? 1 : 0,
              transition: "all 0.7s 150ms cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            {CATEGORY_TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => onCategoryChange(tab.id)}
                className="shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300"
                style={
                  activeCategory === tab.id
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
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── Product Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filteredProducts.map((p, i) => {
            const imgs = PRODUCT_IMAGES[p.id];

            return (
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
                  {/* ── LensImage: ảnh thật + kính lúp reveal ── */}
                  <div className="h-52">
                    <LensImage
                      mainImage={imgs?.main}
                      revealImage={imgs?.reveal}
                      /* Gradient fallback nếu chưa cấu hình ảnh */
                      baseGrad={p.grad}
                      revealGrad={p.revealGrad}
                      emoji={p.emoji}
                      revealEmoji={p.revealEmoji}
                      lensSize={160}
                      alt={p.name}
                      className="w-full h-full"
                    >
                      {/* Badge */}
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

                      {/* Add-to-cart overlay (hover) */}
                      <div
                        className="absolute inset-x-3 bottom-3 z-10
                                   opacity-0 translate-y-2
                                   group-hover:opacity-100 group-hover:translate-y-0
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
                            });
                          }}
                          className="w-full py-2.5 rounded-xl text-xs font-bold btn-liquid"
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
                    </LensImage>
                  </div>

                  {/* ── Text Info ── */}
                  <div className="p-4">
                    <div
                      className="text-[10px] font-bold uppercase tracking-wider mb-1"
                      style={{ color: "#9a6420" }}
                    >
                      {p.category}
                    </div>
                    <h3
                      className="font-bold text-sm mb-1 leading-snug"
                      style={{ color: "#1a2e1b" }}
                    >
                      {p.name}
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
            );
          })}
        </div>

        {/* ── View all ── */}
        <div
          className="text-center mt-12"
          style={{
            opacity: inView ? 1 : 0,
            transition: "all 0.7s 500ms ease",
          }}
        >
          <a
            href="/products"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full font-bold text-sm btn-liquid"
            style={{
              border: "1px solid rgba(47,86,50,0.20)",
              color: "#2f5632",
              background: "transparent",
            }}
          >
            Xem Tất Cả Sản Phẩm
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}