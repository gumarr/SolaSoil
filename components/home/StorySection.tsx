"use client";

import { useInView } from "@/hooks/useInView";
import { STORY_IMAGES } from "@/lib/imageConfig";

const CARDS = [
  { icon: "🤝", title: "Hợp Tác Trực Tiếp",  desc: "Làm việc trực tiếp với 50+ hộ nông dân tại Sơn La — không qua trung gian." },
  { icon: "🏔️", title: "Nguồn Gốc Rõ Ràng",  desc: "Mỗi sản phẩm có thông tin cụ thể về bản, xã, huyện sản xuất tại Sơn La." },
  { icon: "✅", title: "Kiểm Định Chặt Chẽ", desc: "100% qua kiểm định VSATTP. Không phụ gia, không hóa chất bảo quản." },
  { icon: "🎁", title: "Hộp Quà Sơn La",     desc: "Bộ quà tặng đặc sản thiết kế riêng — quà Tết, quà công ty, quà biếu." },
];

export default function StorySection() {
  const [ref, inView] = useInView(0.05);

  return (
    <section id="story" className="py-24 relative overflow-hidden" style={{ background: "#f4f7f4" }}>
      <div
        className="absolute top-0 left-0 w-1/3 h-1/2 opacity-40 pointer-events-none"
        style={{ background: "radial-gradient(ellipse, rgba(201,222,202,0.5) 0%, transparent 70%)" }}
      />

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 xl:gap-20 items-start">

          {/* Left */}
          <div
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "none" : "translateX(-24px)",
              transition: "all 0.75s cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            <div className="text-xs font-bold uppercase tracking-[0.2em] mb-4" style={{ color: "#9a6420" }}>
              Về Mộc Sơn
            </div>
            <h2
              className="font-extrabold leading-tight mb-6"
              style={{ fontSize: "clamp(1.8rem, 3.5vw, 2.8rem)", color: "#1a2e1b" }}
            >
              Mang Hương Vị Sơn La
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #4d8550, #9dc49e)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                Đến Mọi Nhà
              </span>
            </h2>
            <p className="text-sm sm:text-base leading-relaxed mb-4" style={{ color: "#4d8550" }}>
              Mộc Sơn ra đời từ tình yêu với mảnh đất Sơn La — nơi có những cánh rừng già, những bản làng dân tộc với kho tàng ẩm thực phong phú.
            </p>
            <p className="text-sm sm:text-base leading-relaxed mb-8" style={{ color: "#4d8550" }}>
              Chúng tôi làm việc trực tiếp với các hộ nông dân, phụ nữ dân tộc Thái, Mường — mỗi sản phẩm đến tay bạn là đúng truyền thống.
            </p>

            {/* 2×2 image grid — ảnh từ imageConfig */}
            <div className="grid grid-cols-2 gap-3">
              {STORY_IMAGES.map(({ src, label }) => (
                <div
                  key={label}
                  className="relative rounded-2xl overflow-hidden group"
                  style={{ aspectRatio: "4/3" }}
                >
                  <img
                    src={src}
                    alt={label}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div
                    className="absolute inset-0"
                    style={{
                      background: "linear-gradient(to top, rgba(26,46,27,0.65) 0%, transparent 50%)",
                    }}
                  />
                  <span
                    className="absolute bottom-2.5 left-3 text-[10px] font-bold"
                    style={{ color: "rgba(201,222,202,0.90)" }}
                  >
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right — feature cards */}
          <div
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            style={{
              opacity: inView ? 1 : 0,
              transform: inView ? "none" : "translateX(24px)",
              transition: "all 0.75s 180ms cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            {CARDS.map((card, i) => (
              <div
                key={card.title}
                className="rounded-2xl p-6 card-hover group"
                style={{
                  background: "rgba(255,255,255,0.90)",
                  border: "1px solid rgba(201,222,202,0.30)",
                  boxShadow: "0 2px 12px rgba(47,86,50,0.06)",
                  transitionDelay: `${i * 60}ms`,
                }}
              >
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl mb-4 transition-transform duration-300 group-hover:scale-110"
                  style={{ background: "rgba(157,196,158,0.15)" }}
                >
                  {card.icon}
                </div>
                <h3 className="font-bold mb-2" style={{ color: "#1a2e1b", fontSize: "0.95rem" }}>
                  {card.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: "#6fa470" }}>{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}