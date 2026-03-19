import { QUOTE_BG } from "@/lib/imageConfig";

export default function QuoteSection() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background — ảnh từ imageConfig */}
      <div className="absolute inset-0">
        <img
          src={QUOTE_BG}
          alt="Rừng núi Sơn La"
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(135deg, rgba(13,26,14,0.88) 0%, rgba(26,46,27,0.75) 50%, rgba(10,19,8,0.90) 100%)",
          }}
        />
        {/* Mesh grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(157,196,158,1) 1px, transparent 1px), linear-gradient(90deg, rgba(157,196,158,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Animated blob */}
      <div
        className="absolute blob"
        style={{
          width: "50vw", height: "50vw", top: "-20%", right: "-10%",
          background: "radial-gradient(circle, rgba(47,86,50,0.25) 0%, transparent 60%)",
          animation: "blobMorph 18s ease-in-out infinite",
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto text-center px-6 py-8">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-semibold uppercase tracking-widest mb-8"
          style={{
            background: "rgba(157,196,158,0.12)",
            border: "1px solid rgba(157,196,158,0.22)",
            color: "#9dc49e",
          }}
        >
          Từ Núi Rừng Sơn La
        </div>

        <h2
          className="font-extrabold text-white leading-tight mb-6"
          style={{ fontSize: "clamp(2rem, 4.5vw, 3.5rem)" }}
        >
          Mỗi Sản Phẩm Là Một
          <br />
          <span
            style={{
              background: "linear-gradient(135deg, #9dc49e 0%, #6fa470 40%, #f6c87a 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Câu Chuyện Từ Bản Làng
          </span>
        </h2>

        <p
          className="text-base leading-relaxed max-w-2xl mx-auto mb-10"
          style={{ color: "rgba(201,222,202,0.70)" }}
        >
          Từ những người phụ nữ Thái gác thịt lên bếp lửa mỗi sáng mùa đông, đến những chàng trai leo núi hái trà shan tuyết lúc sương mờ —
          Mộc Sơn giữ trọn linh hồn núi rừng Tây Bắc.
        </p>

        <a
          href="#story"
          className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full font-bold text-sm btn-liquid"
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.18)",
            color: "#e8f0e8",
            backdropFilter: "blur(12px)",
          }}
        >
          Đọc Câu Chuyện
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>
    </section>
  );
}