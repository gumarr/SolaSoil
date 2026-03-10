"use client";

import { useInView } from "@/hooks/useInView";

interface GiftBoxesSectionProps {
  onAddToCart: () => void;
}

export default function GiftBoxesSection({ onAddToCart }: GiftBoxesSectionProps) {
  const [giftRef, giftInView] = useInView(0.05);

  return (
    <section className="py-20 bg-amber-50">
      <div ref={giftRef} className="max-w-7xl mx-auto px-6 sm:px-10">
        <div className="text-center mb-12" style={{ opacity: giftInView?1:0, transform: giftInView?"none":"translateY(20px)", transition: "opacity 0.7s, transform 0.7s" }}>
          <span className="text-amber-700 text-xs uppercase tracking-widest font-semibold">Được Yêu Thích</span>
          <h2 className="text-4xl sm:text-5xl font-extrabold text-green-900 mt-2">Hộp Quà Đặc Sản Sơn La</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { title: "Hộp Rừng Núi",         desc: "Thịt Gác Bếp, Mắc Khén, Hạt Dổi, Trà Shan Tuyết",   price: "450.000đ", grad: "from-stone-800 to-green-900", emoji: "🏕️" },
            { title: "Hộp Cao Nguyên Xanh",  desc: "Mật Ong Rừng, Trà Shan Tuyết Cổ Thụ, Mận Hậu Sấy", price: "380.000đ", grad: "from-green-800 to-teal-700",   emoji: "🌿" },
            { title: "Hộp Trái Cây Mùa Vụ", desc: "Mận Hậu, Na Sầu Riêng, Dâu Tây Mộc Châu",           price: "320.000đ", grad: "from-rose-800 to-purple-800",  emoji: "🍑" },
          ].map((box, i) => (
            <div key={box.title} style={{ opacity: giftInView?1:0, transform: giftInView?"none":"translateY(32px)", transition: `opacity 0.6s ${i*120}ms, transform 0.6s ${i*120}ms` }}>
              <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border border-amber-100 group">
                <div className={`h-44 bg-linear-to-br ${box.grad} flex items-center justify-center text-6xl group-hover:scale-105 transition-transform duration-500`}>{box.emoji}</div>
                <div className="p-5">
                  <h3 className="font-bold text-green-900 text-base mb-1">{box.title}</h3>
                  <p className="text-green-700 text-sm mb-4 leading-relaxed">{box.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-extrabold text-amber-700 text-lg">{box.price}</span>
                    <button onClick={onAddToCart} className="bg-green-800 hover:bg-green-700 text-white text-xs font-semibold px-4 py-2 rounded-full transition-all hover:shadow-md hover:-translate-y-0.5">+ Giỏ hàng</button>
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
