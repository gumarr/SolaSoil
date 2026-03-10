"use client";

import { useInView } from "@/hooks/useInView";
import LensImage from "@/components/ui/LensImage";
import { CATEGORY_TABS, type Product } from "@/lib/data";

interface ProductsSectionProps {
  activeCategory: string;
  onCategoryChange: (id: string) => void;
  filteredProducts: Product[];
  onAddToCart: () => void;
}

export default function ProductsSection({
  activeCategory,
  onCategoryChange,
  filteredProducts,
  onAddToCart,
}: ProductsSectionProps) {
  const [productsRef, productsInView] = useInView(0.05);

  return (
    <section id="products" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <div ref={productsRef} className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-5">
          <div style={{ opacity: productsInView?1:0, transform: productsInView?"none":"translateY(20px)", transition: "opacity 0.7s, transform 0.7s" }}>
            <span className="text-amber-700 text-xs uppercase tracking-widest font-semibold">Tuyển Chọn</span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-green-900 mt-2 leading-tight">Đặc Sản Nổi Bật</h2>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide" style={{ opacity: productsInView?1:0, transition: "opacity 0.7s 150ms" }}>
            {CATEGORY_TABS.map((tab) => (
              <button key={tab.id} onClick={() => onCategoryChange(tab.id)}
                className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold transition-all hover:-translate-y-0.5 ${
                  activeCategory === tab.id ? "bg-green-800 text-white shadow-md" : "bg-green-50 text-green-700 hover:bg-green-100"
                }`}>
                <span>{tab.icon}</span>{tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-6">
          {filteredProducts.map((p, i) => (
            <div key={p.id} style={{ opacity: productsInView?1:0, transform: productsInView?"none":"translateY(32px)", transition: `opacity 0.65s ${i*80}ms, transform 0.65s ${i*80}ms` }}>
              <div className="group cursor-pointer">
                <div className="rounded-2xl overflow-hidden mb-3 shadow-md group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-300 h-52 relative">
                  <LensImage baseGrad={p.grad} revealGrad={p.revealGrad} emoji={p.emoji} revealEmoji={p.revealEmoji} className="w-full h-full">
                    <div className="relative z-10 w-full h-full flex flex-col p-3">
                      {p.badge && (
                        <span className="self-start bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full">{p.badge}</span>
                      )}
                      <div className="mt-auto flex justify-end">
                        <button className="bg-white/90 hover:bg-white text-green-900 text-[10px] font-bold px-2.5 py-1.5 rounded-full opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-200 shadow" onClick={onAddToCart}>
                          + Giỏ hàng
                        </button>
                      </div>
                    </div>
                  </LensImage>
                </div>
                <div className="px-0.5">
                  <span className="text-[10px] text-amber-700 font-semibold uppercase tracking-wide">{p.category}</span>
                  <h3 className="font-bold text-green-900 text-sm mt-0.5">{p.name}</h3>
                  <p className="text-green-600 text-xs mt-0.5 leading-snug line-clamp-1">{p.desc}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="font-extrabold text-amber-700 text-sm">{p.price}</span>
                    <span className="text-green-500 text-xs">{p.weight}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
