"use client";

import { useInView } from "@/hooks/useInView";
import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { GIFT_BOX_IMAGES } from "@/lib/imageConfig";

const GIFT_BOXES = [
  {
    id: 101,
    name: "Hộp Rừng Núi",
    desc: "Thịt Gác Bếp, Mắc Khén, Hạt Dổi, Trà Shan Tuyết",
    price: "450.000đ", priceNum: 450000, weight: "Combo",
    emoji: "🏕️", grad: "from-stone-800 to-green-900",
    tag: "Phổ Biến",
  },
  {
    id: 102,
    name: "Hộp Cao Nguyên Xanh",
    desc: "Mật Ong Rừng, Trà Shan Tuyết Cổ Thụ, Mận Hậu Sấy",
    price: "380.000đ", priceNum: 380000, weight: "Combo",
    emoji: "🌿", grad: "from-green-800 to-teal-700",
    tag: "Mới",
  },
  {
    id: 103,
    name: "Hộp Trái Cây Mùa Vụ",
    desc: "Mận Hậu, Na Sầu Riêng, Dâu Tây Mộc Châu",
    price: "320.000đ", priceNum: 320000, weight: "Combo",
    emoji: "🍑", grad: "from-rose-800 to-purple-800",
    tag: "Theo Mùa",
  },
];

export default function GiftBoxesSection() {
  const [ref, inView] = useInView(0.05);
  const { addItem } = useCart();

  return (
    <section
      className="py-24 relative overflow-hidden"
      style={{ background: "#1a2e1b" }}
    >
      {/* Mesh background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#0d1a0e] via-[#1a2e1b] to-[#162318]" />
        <div
          className="absolute blob"
          style={{
            width: "60vw", height: "60vw", top: "-20%", right: "-10%",
            background:
              "radial-gradient(circle, rgba(47,86,50,0.35) 0%, transparent 65%)",
          }}
        />
        <div
          className="absolute"
          style={{
            width: "40vw", height: "40vw", bottom: "-10%", left: "5%",
            background:
              "radial-gradient(circle, rgba(154,100,32,0.12) 0%, transparent 65%)",
            animation: "blobMorph 16s ease-in-out 3s infinite reverse",
            borderRadius: "50%",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(157,196,158,1) 1px, transparent 1px), linear-gradient(90deg, rgba(157,196,158,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div ref={ref} className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10">
        {/* Header */}
        <div
          className="text-center mb-14"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "none" : "translateY(20px)",
            transition: "all 0.7s cubic-bezier(0.22,1,0.36,1)",
          }}
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-5"
            style={{
              background: "rgba(157,196,158,0.10)",
              border: "1px solid rgba(157,196,158,0.20)",
              color: "#9dc49e",
            }}
          >
            Được Yêu Thích
          </div>
          <h2
            className="font-extrabold text-white leading-tight"
            style={{ fontSize: "clamp(2rem, 4vw, 3.2rem)" }}
          >
            Hộp Quà Đặc Sản
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, #9dc49e 0%, #6fa470 50%, #f6c87a 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Sơn La
            </span>
          </h2>
          <p className="text-sm mt-4 max-w-md mx-auto" style={{ color: "rgba(201,222,202,0.65)" }}>
            Mỗi hộp là một hành trình qua hương vị núi rừng Tây Bắc
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {GIFT_BOXES.map((box, i) => {
            const imgSrc = GIFT_BOX_IMAGES[box.id];

            return (
              <div
                key={box.id}
                style={{
                  opacity: inView ? 1 : 0,
                  transform: inView ? "none" : "translateY(32px)",
                  transition: `all 0.65s ${i * 120}ms cubic-bezier(0.22,1,0.36,1)`,
                }}
              >
                <div
                  className="group rounded-2xl overflow-hidden card-hover"
                  style={{
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.10)",
                    backdropFilter: "blur(12px)",
                  }}
                >
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    {imgSrc ? (
                      <img
                        src={imgSrc}
                        alt={box.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    ) : (
                      /* Emoji fallback */
                      <div
                        className={`w-full h-full bg-gradient-to-br ${box.grad} flex items-center justify-center text-5xl`}
                      >
                        {box.emoji}
                      </div>
                    )}
                    <div
                      className="absolute inset-0"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(13,26,14,0.75) 0%, transparent 50%)",
                      }}
                    />
                    <div
                      className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold"
                      style={{
                        background: "rgba(0,0,0,0.45)",
                        border: "1px solid rgba(255,255,255,0.15)",
                        color: "#faf8f4",
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      {box.tag}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <h3 className="font-bold text-base mb-1.5 text-white">{box.name}</h3>
                    <p
                      className="text-xs leading-relaxed mb-4"
                      style={{ color: "rgba(201,222,202,0.65)" }}
                    >
                      {box.desc}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="font-extrabold text-lg" style={{ color: "#f6c87a" }}>
                        {box.price}
                      </span>
                      <button
                        onClick={() =>
                          addItem({
                            id: box.id,
                            name: box.name,
                            priceNum: box.priceNum,
                            priceLabel: box.price,
                            weight: box.weight,
                            emoji: box.emoji,
                            grad: box.grad,
                          })
                        }
                        className="px-4 py-2 rounded-xl text-xs font-bold btn-liquid"
                        style={{
                          background: "rgba(157,196,158,0.15)",
                          border: "1px solid rgba(157,196,158,0.25)",
                          color: "#9dc49e",
                        }}
                      >
                        + Giỏ hàng
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Custom CTA */}
        <div
          className="mt-12 text-center"
          style={{
            opacity: inView ? 1 : 0,
            transition: "all 0.7s 450ms ease",
          }}
        >
          <Link
            href="/create-gift-box"
            className="inline-flex items-center gap-2.5 px-8 py-4 rounded-full font-bold text-sm btn-liquid"
            style={{
              background:
                "linear-gradient(135deg, rgba(157,196,158,0.15), rgba(111,164,112,0.10))",
              border: "1px solid rgba(157,196,158,0.20)",
              color: "#9dc49e",
            }}
          >
            🎁 Tự Tạo Gói Quà Của Bạn
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}