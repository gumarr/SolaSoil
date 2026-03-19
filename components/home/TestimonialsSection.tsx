"use client";

import { useInView } from "@/hooks/useInView";
import { TESTIMONIALS } from "@/lib/data";

export default function TestimonialsSection() {
  const [ref, inView] = useInView(0.05);

  return (
    <section className="py-24 relative overflow-hidden" style={{ background: "var(--ivory)" }}>

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 70% 60% at 50% 100%, rgba(201,222,202,0.25) 0%, transparent 65%)"
        }} />
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
            Đánh Giá
          </div>
          <h2 className="font-extrabold" style={{ fontSize: "clamp(2rem, 4vw, 3rem)", color: "#1a2e1b" }}>
            Lời Khách Hàng
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              style={{
                opacity: inView ? 1 : 0,
                transform: inView ? "none" : "translateY(28px)",
                transition: `all 0.65s ${i * 100}ms cubic-bezier(0.22,1,0.36,1)`,
              }}
            >
              <div
                className="rounded-2xl p-7 flex flex-col h-full card-hover"
                style={{
                  background: "rgba(255,255,255,0.90)",
                  border: "1px solid rgba(201,222,202,0.30)",
                  boxShadow: "0 4px 20px rgba(47,86,50,0.07)",
                }}
              >
                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, s) => (
                    <svg key={s} className="w-4 h-4" viewBox="0 0 24 24" fill="#d4922b">
                      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                    </svg>
                  ))}
                </div>

                {/* Quote */}
                <p className="text-sm leading-relaxed flex-1 italic mb-6" style={{ color: "#3a6b3d" }}>
                  &ldquo;{t.text}&rdquo;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
                    style={{ background: "linear-gradient(135deg, #2f5632, #6fa470)" }}
                  >
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-bold text-sm" style={{ color: "#1a2e1b" }}>{t.name}</p>
                    <p className="text-[11px]" style={{ color: "#9dc49e" }}>{t.role} · {t.location}</p>
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