"use client";

import { useState } from "react";
import { useInView } from "@/hooks/useInView";

interface Certificate {
  id: string;
  title: string;
  subtitle: string;
  imgUrl: string;
  desc: string;
}

const CERTIFICATES: Certificate[] = [
  {
    id: "quyetthanh",
    title: "Chứng Nhận Quyết Thành",
    subtitle: "Hợp tác xã dịch vụ nông nghiệp Quyết Thành",
    imgUrl: "/certificates/giay_chung_nhan_quyet_thanh.jpg",
    desc: "Chứng nhận cơ sở đủ điều kiện an toàn thực phẩm, đảm bảo quy trình sản xuất và chế biến nông sản đạt tiêu chuẩn nghiêm ngặt.",
  },
  {
    id: "vietgap",
    title: "Chứng Nhận VietGAP",
    subtitle: "Tiêu chuẩn Thực hành sản xuất nông nghiệp tốt",
    imgUrl: "/certificates/giay_chung_nhan_vietgap.jpg",
    desc: "Chứng nhận sản phẩm được sản xuất theo quy trình VietGAP, đảm bảo an toàn, chất lượng, bảo vệ môi trường và truy xuất nguồn gốc rõ ràng.",
  },
];

export default function CertificatesSection() {
  const [ref, inView] = useInView(0.05);
  const [activeCert, setActiveCert] = useState<Certificate | null>(null);

  return (
    <section id="certificates" className="py-24 relative overflow-hidden" style={{ background: "var(--ivory)" }}>
      {/* Decorative background elements */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none opacity-20"
        style={{ background: "radial-gradient(circle, var(--sage-300) 0%, transparent 70%)" }}
      />
      
      <div ref={ref} className="relative z-10 max-w-6xl mx-auto px-6 sm:px-10">
        {/* Section Header */}
        <div 
          className="text-center max-w-2xl mx-auto mb-16"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "none" : "translateY(24px)",
            transition: "all 0.8s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          <span className="text-xs font-bold uppercase tracking-[0.2em] mb-4 inline-block" style={{ color: "var(--wood-700)" }}>
            Uy Tín & Chất Lượng
          </span>
          <h2 
            className="font-extrabold leading-tight mb-4 text-gradient-sage"
            style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.5rem)" }}
          >
            Chứng Nhận Chất Lượng
          </h2>
          <p className="text-sm sm:text-base leading-relaxed" style={{ color: "var(--sage-600)" }}>
            Mộc Sơn cam kết mang đến những sản phẩm nông sản sạch, an toàn, chất lượng cao của vùng núi rừng Sơn La đến tay người tiêu dùng.
          </p>
        </div>

        {/* Certificate Grid */}
        <div 
          className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-stretch"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "none" : "translateY(36px)",
            transition: "all 0.8s 150ms cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          {CERTIFICATES.map((cert) => (
            <div
              key={cert.id}
              onClick={() => setActiveCert(cert)}
              className="group cursor-pointer rounded-3xl overflow-hidden flex flex-col justify-between transition-all duration-500 hover:-translate-y-2"
              style={{
                background: "rgba(255, 255, 255, 0.7)",
                border: "1px solid rgba(201, 222, 202, 0.4)",
                boxShadow: "0 10px 30px rgba(47, 86, 50, 0.04)",
                backdropFilter: "blur(10px)",
              }}
            >
              <div className="p-8 pb-4">
                <span className="text-xs font-bold uppercase tracking-wider block mb-2" style={{ color: "var(--sage-400)" }}>
                  {cert.subtitle}
                </span>
                <h3 className="font-extrabold mb-3 text-xl" style={{ color: "var(--sage-900)" }}>
                  {cert.title}
                </h3>
                <p className="text-sm leading-relaxed mb-6" style={{ color: "var(--sage-600)" }}>
                  {cert.desc}
                </p>
              </div>

              {/* Certificate Image Frame */}
              <div className="px-8 pb-8 flex justify-center">
                <div 
                  className="relative rounded-2xl overflow-hidden shadow-md group-hover:shadow-xl transition-shadow duration-500 w-full aspect-[3/4] bg-stone-100 max-w-[320px]"
                  style={{ border: "8px solid #fff" }}
                >
                  <img
                    src={cert.imgUrl}
                    alt={cert.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-stone-900/0 group-hover:bg-stone-900/10 transition-colors duration-500 flex items-center justify-center">
                    <span 
                      className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 text-xs font-semibold px-4 py-2 rounded-full shadow-lg"
                      style={{ background: "#fff", color: "var(--sage-800)" }}
                    >
                      🔎 Click để phóng to
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {activeCert && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md transition-opacity duration-300"
          onClick={() => setActiveCert(null)}
        >
          <button 
            className="absolute top-6 right-6 w-12 h-12 rounded-full flex items-center justify-center text-white text-2xl transition-all duration-300 hover:bg-white/10 hover:scale-110"
            onClick={() => setActiveCert(null)}
            aria-label="Close modal"
          >
            ✕
          </button>
          
          <div 
            className="relative max-w-3xl w-full max-h-[85vh] flex flex-col items-center bg-white rounded-3xl overflow-hidden shadow-2xl p-4 sm:p-6 md:p-8 animate-scale-in"
            onClick={(e) => e.stopPropagation()}
            style={{ border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <div className="w-full mb-4 text-center">
              <h3 className="text-xl font-bold text-stone-900">{activeCert.title}</h3>
              <p className="text-xs text-stone-500 mt-1">{activeCert.subtitle}</p>
            </div>
            
            <div className="relative overflow-auto max-h-[60vh] w-full flex justify-center rounded-lg bg-stone-50 p-2">
              <img 
                src={activeCert.imgUrl} 
                alt={activeCert.title} 
                className="max-h-[58vh] object-contain rounded shadow-sm"
              />
            </div>
            
            <div className="w-full mt-4 text-center text-sm text-stone-600 max-w-xl">
              {activeCert.desc}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
