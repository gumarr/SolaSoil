"use client";

import { useInView } from "@/hooks/useInView";
import { CATEGORIES } from "@/lib/data";
import { CATEGORY_IMAGES } from "@/lib/imageConfig";

interface CategoriesSectionProps {
  onCategoryChange: (id: string) => void;
}

export default function CategoriesSection({ onCategoryChange }: CategoriesSectionProps) {
  const [ref, inView] = useInView(0.05);

  return (
    <section
      id="categories"
      className="py-24 relative overflow-hidden"
      style={{ background: "#f0f4f0" }}
    >
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-0 right-0 w-1/2 h-1/2"
          style={{
            background:
              "radial-gradient(ellipse at top right, rgba(201,222,202,0.50) 0%, transparent 65%)",
          }}
        />
      </div>

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10">
        <div
          className="text-center mb-14"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "none" : "translateY(20px)",
            transition: "all 0.7s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          <div className="text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color: "#9a6420" }}>
            Danh Mục
          </div>
          <h2
            className="font-extrabold"
            style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "#1a2e1b" }}
          >
            Khám Phá Theo Loại
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {CATEGORIES.map((cat, i) => {
            const imgSrc = CATEGORY_IMAGES[cat.id];

            return (
              <div
                key={cat.id}
                style={{
                  opacity: inView ? 1 : 0,
                  transform: inView ? "none" : "translateY(32px)",
                  transition: `all 0.65s ${i * 80}ms cubic-bezier(0.22,1,0.36,1)`,
                }}
              >
                <div
                  className="group rounded-2xl overflow-hidden cursor-pointer card-hover flex flex-col h-full"
                  style={{
                    background: "#ffffff",
                    border: "1px solid rgba(201,222,202,0.35)",
                    boxShadow: "0 2px 12px rgba(47,86,50,0.06)",
                  }}
                  onClick={() => {
                    onCategoryChange(cat.id);
                    document.getElementById("products")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  {/* Image / emoji fallback */}
                  <div className="relative h-48 overflow-hidden flex-shrink-0">
                    {imgSrc ? (
                      <img
                        src={imgSrc}
                        alt={cat.label}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      <div
                        className={`w-full h-full bg-gradient-to-br ${cat.grad} flex items-center justify-center text-5xl`}
                      >
                        {cat.icon}
                      </div>
                    )}
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(26,46,27,0.70) 0%, rgba(26,46,27,0.10) 55%, transparent 100%)",
                      }}
                    />
                    <div className="absolute bottom-4 left-4">
                      <div className="text-3xl mb-1.5">{cat.icon}</div>
                      <h3 className="font-extrabold text-white text-base leading-tight">{cat.label}</h3>
                    </div>
                    <div
                      className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[10px] font-bold"
                      style={{
                        background: "rgba(250,248,244,0.90)",
                        color: "#9a6420",
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      {cat.count}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col flex-1">
                    <p className="text-xs leading-relaxed mb-3" style={{ color: "#6fa470" }}>
                      {cat.desc}
                    </p>
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {cat.products.slice(0, 2).map((name) => (
                        <span
                          key={name}
                          className="text-[10px] font-medium px-2.5 py-1 rounded-full"
                          style={{
                            background: "rgba(157,196,158,0.12)",
                            color: "#4d8550",
                            border: "1px solid rgba(201,222,202,0.25)",
                          }}
                        >
                          {name}
                        </span>
                      ))}
                    </div>
                    <div
                      className="flex items-center gap-1.5 mt-4 text-xs font-bold transition-all duration-300 group-hover:gap-2.5 mt-auto"
                      style={{ color: "#3a6b3d" }}
                    >
                      Xem tất cả
                      <svg
                        className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}