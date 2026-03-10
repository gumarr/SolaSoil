"use client";

import { useInView } from "@/hooks/useInView";
import { TESTIMONIALS } from "@/lib/data";

export default function TestimonialsSection() {
  const [testimonialsRef, testimonialsInView] = useInView(0.05);

  return (
    <section className="py-20 bg-white">
      <div ref={testimonialsRef} className="max-w-7xl mx-auto px-6 sm:px-10">
        <div className="text-center mb-12">
          <span className="text-amber-700 text-xs uppercase tracking-widest font-semibold">Đánh Giá</span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-green-900 mt-2">Lời Khách Hàng</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} style={{ opacity: testimonialsInView?1:0, transform: testimonialsInView?"none":"translateY(28px)", transition: `opacity 0.6s ${i*120}ms, transform 0.6s ${i*120}ms` }}>
              <div className="bg-green-50 rounded-2xl p-7 border border-green-100 flex flex-col hover:-translate-y-1 hover:shadow-lg transition-all duration-300 h-full">
                <div className="flex gap-0.5 text-amber-400 text-sm mb-4">★★★★★</div>
                <p className="text-green-800 leading-relaxed mb-6 italic flex-1">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-800 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0">{t.name.charAt(0)}</div>
                  <div>
                    <p className="font-bold text-green-900 text-sm">{t.name}</p>
                    <p className="text-green-600 text-xs">{t.role} · {t.location}</p>
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
