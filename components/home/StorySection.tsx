"use client";

import { useInView } from "@/hooks/useInView";

export default function StorySection() {
  const [storyRef, storyInView] = useInView(0.05);

  return (
    <section id="story" className="py-20 bg-white">
      <div ref={storyRef} className="max-w-7xl mx-auto px-6 sm:px-10 grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16">
        <div className="lg:col-span-1" style={{ opacity: storyInView?1:0, transform: storyInView?"none":"translateX(-24px)", transition: "opacity 0.7s, transform 0.7s" }}>
          <span className="text-amber-700 text-xs uppercase tracking-widest font-semibold">Về Mộc Sơn</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-green-900 mt-3 mb-5 leading-snug">Mang Hương Vị Sơn La Đến Mọi Nhà</h2>
          <p className="text-green-700 leading-relaxed mb-5 text-sm sm:text-base">
            Mộc Sơn ra đời từ tình yêu với mảnh đất Sơn La — nơi có những cánh rừng già, những bản làng
            dân tộc với kho tàng ẩm thực phong phú, độc đáo chưa từng được biết đến rộng rãi.
          </p>
          <p className="text-green-700 leading-relaxed mb-6 text-sm sm:text-base">
            Chúng tôi làm việc trực tiếp với các hộ nông dân, phụ nữ dân tộc Thái, Mường — để mỗi sản
            phẩm đến tay bạn là đúng truyền thống, đúng hương vị, đúng câu chuyện.
          </p>
          <a href="#" className="inline-flex items-center gap-1.5 text-green-800 font-bold text-sm underline underline-offset-4 hover:text-amber-700 transition-colors">Đọc câu chuyện đầy đủ →</a>
        </div>

        <div className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-5"
          style={{ opacity: storyInView?1:0, transform: storyInView?"none":"translateX(24px)", transition: "opacity 0.7s 150ms, transform 0.7s 150ms" }}>
          {[
            { icon: "🤝", title: "Hợp Tác Trực Tiếp",  desc: "Làm việc trực tiếp với 50+ hộ nông dân tại Sơn La — không qua trung gian.",          link: "Tìm hiểu thêm →" },
            { icon: "🏔️", title: "Nguồn Gốc Rõ Ràng",  desc: "Mỗi sản phẩm đều có thông tin cụ thể về bản, xã, huyện sản xuất tại Sơn La.",         link: "Xem nguồn gốc →" },
            { icon: "✅", title: "Kiểm Định Chặt Chẽ", desc: "100% qua kiểm định VSATTP. Không phụ gia, không hóa chất bảo quản.",                   link: "Tìm hiểu thêm →" },
            { icon: "🎁", title: "Hộp Quà Sơn La",     desc: "Bộ quà tặng đặc sản Sơn La thiết kế riêng — quà Tết, quà công ty, quà biếu.",         link: "Xem hộp quà →" },
          ].map((item) => (
            <div key={item.title} className="border border-green-100 rounded-2xl p-6 hover:border-green-300 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
              <span className="text-3xl">{item.icon}</span>
              <h3 className="font-bold text-green-900 mt-3 mb-2">{item.title}</h3>
              <p className="text-green-700 text-sm leading-relaxed mb-4">{item.desc}</p>
              <a href="#" className="text-green-800 text-sm font-semibold group-hover:text-amber-700 transition-colors">{item.link}</a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
