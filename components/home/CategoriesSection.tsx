"use client";

import { useInView } from "@/hooks/useInView";
import { CATEGORIES } from "@/lib/data";

interface CategoriesSectionProps {
  onCategoryChange: (id: string) => void;
}

export default function CategoriesSection({ onCategoryChange }: CategoriesSectionProps) {
  const [categoriesRef, categoriesInView] = useInView(0.05);

  return (
    <section id="categories" className="py-20 bg-stone-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <div className="text-center mb-12">
          <span className="text-amber-700 text-xs uppercase tracking-widest font-semibold">Danh Mục</span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-green-900 mt-2">Khám Phá Theo Loại</h2>
        </div>
        <div ref={categoriesRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map((cat, i) => (
            <div key={cat.id} style={{ opacity: categoriesInView?1:0, transform: categoriesInView?"none":"translateY(32px)", transition: `opacity 0.6s ${i*100}ms, transform 0.6s ${i*100}ms` }}>
              <div className="group cursor-pointer hover:-translate-y-2 transition-transform duration-300"
                onClick={() => { onCategoryChange(cat.id); document.getElementById("products")?.scrollIntoView({ behavior: "smooth" }); }}>
                <div className={`h-52 bg-linear-to-br ${cat.grad} rounded-2xl relative overflow-hidden group-hover:shadow-2xl shadow-md transition-shadow duration-300`}>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"/>
                  <div className="relative p-5 h-full flex flex-col justify-between">
                    <div className="flex items-center justify-between">
                      <span className="text-4xl">{cat.icon}</span>
                      <span className="bg-white/15 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full">{cat.count}</span>
                    </div>
                    <div>
                      <h3 className="text-xl font-extrabold text-white mb-1">{cat.label}</h3>
                      <p className="text-white/70 text-[11px] leading-snug">{cat.subtitle}</p>
                    </div>
                  </div>
                </div>
                <div className="mt-4 px-1">
                  <p className="text-green-800 text-sm leading-relaxed mb-3">{cat.desc}</p>
                  <ul className="space-y-1.5 mb-3">
                    {cat.products.map((name) => (
                      <li key={name} className="flex items-center gap-2 text-xs text-green-700">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0"/>
                        {name}
                      </li>
                    ))}
                  </ul>
                  <span className="text-green-800 text-sm font-bold group-hover:text-amber-700 transition-colors">Xem tất cả →</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
