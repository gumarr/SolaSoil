"use client";

import Link from "next/link";
import AnnouncementBar from "@/components/home/AnnouncementBar";
import NavBar from "@/components/home/NavBar";
import Footer from "@/components/home/Footer";

const STATS = [
  { value: "50+", label: "Nông dân hợp tác", icon: "👨‍🌾" },
  { value: "8+",  label: "Năm kinh nghiệm",   icon: "🌿" },
  { value: "4",   label: "Danh mục đặc sản",  icon: "🏷️" },
  { value: "100%", label: "Tự nhiên & sạch",  icon: "✅" },
];

const VALUES = [
  {
    icon: "🌱",
    title: "Nông nghiệp Bền Vững",
    desc: "Chúng tôi hợp tác với nông dân bản địa canh tác theo phương pháp truyền thống, không thuốc trừ sâu, bảo vệ đất và rừng cho thế hệ sau.",
    grad: "from-green-800 to-emerald-700",
  },
  {
    icon: "🤝",
    title: "Đồng Hành Cộng Đồng",
    desc: "Mỗi đơn hàng trực tiếp hỗ trợ thu nhập cho đồng bào dân tộc Thái, Mường — những người gìn giữ văn hóa ẩm thực núi rừng Tây Bắc.",
    grad: "from-amber-800 to-orange-700",
  },
  {
    icon: "📦",
    title: "Truy Xuất Nguồn Gốc",
    desc: "Mỗi sản phẩm đều có thể truy nguồn đến tận bản làng, hộ sản xuất và mùa vụ cụ thể — minh bạch từ rừng đến tay bạn.",
    grad: "from-teal-800 to-cyan-700",
  },
  {
    icon: "🚚",
    title: "Giao Hàng Tươi Sạch",
    desc: "Quy trình đóng gói được kiểm soát nghiêm ngặt, vận chuyển lạnh nếu cần, đảm bảo sản phẩm đến tay bạn đúng như lúc mới thu hoạch.",
    grad: "from-stone-800 to-stone-600",
  },
];

const TEAM = [
  {
    name: "Nguyễn Văn Tùng",
    role: "Nhà Sáng Lập",
    desc: "Sinh ra và lớn lên ở Sơn La, anh Tùng dành 8 năm xây dựng chuỗi cung ứng trực tiếp từ nông dân đến người tiêu dùng toàn quốc.",
    emoji: "👨‍💼",
    grad: "from-green-800 to-green-600",
  },
  {
    name: "Lò Thị Mai",
    role: "Chuyên Gia Thu Mua",
    desc: "Người Thái bản địa với hơn 15 năm kinh nghiệm tuyển chọn đặc sản, chị Mai là người đảm bảo chất lượng sản phẩm trước khi đến tay khách hàng.",
    emoji: "👩‍🌾",
    grad: "from-amber-800 to-amber-600",
  },
  {
    name: "Phạm Quốc Bảo",
    role: "Vận Hành & Logistics",
    desc: "Quản lý toàn bộ quy trình đóng gói và giao vận, anh Bảo đảm bảo mỗi đơn hàng được xử lý đúng hạn và an toàn nhất.",
    emoji: "📦",
    grad: "from-teal-800 to-teal-600",
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <AnnouncementBar />
      <NavBar />

      {/* Hero */}
      <section className="relative bg-green-950 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-green-700/30 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,var(--tw-gradient-stops))] from-amber-900/20 via-transparent to-transparent pointer-events-none" />
        <div className="relative max-w-5xl mx-auto px-6 sm:px-10 py-24 sm:py-32 text-center">
          <nav className="flex justify-center items-center gap-2 text-sm text-green-400 mb-8">
            <Link href="/" className="hover:text-green-300 transition-colors">Trang chủ</Link>
            <span className="text-green-600">/</span>
            <span className="text-green-200 font-medium">Về Chúng Tôi</span>
          </nav>
          <div className="inline-flex items-center gap-2 bg-green-800/50 border border-green-700/40 text-green-300 text-xs font-semibold px-4 py-2 rounded-full mb-6 backdrop-blur-sm">
            <span>🌿</span> Từ bản làng Sơn La
          </div>
          <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight mb-4">
            Từ Núi Rừng Sơn La<br/>
            <span className="text-green-400">Đến Mâm Cơm Việt</span>
          </h1>
          <p className="text-green-300 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed mt-4">
            Mộc Sơn kết nối trực tiếp nông dân bản địa với người yêu đặc sản — không qua trung gian, không hóa chất, chỉ là hương vị nguyên bản của núi rừng Tây Bắc.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="max-w-6xl mx-auto px-6 sm:px-10 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">
          <div>
            <span className="text-green-600 font-semibold text-sm tracking-widest uppercase mb-3 block">Câu Chuyện Của Chúng Tôi</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-green-900 mb-6 leading-tight">
              Bắt đầu từ tình yêu<br/>với quê hương Sơn La
            </h2>
            <p className="text-green-700 leading-relaxed mb-4">
              Mộc Sơn ra đời năm 2016 với một sứ mệnh đơn giản: đưa những gì ngon nhất từ bản làng Sơn La đến mọi mâm cơm Việt. Người sáng lập nhận ra rằng những đặc sản quý — thịt gác bếp, trà shan tuyết, mắc khén rừng — đang dần biến mất hoặc bị làm giả tràn lan trên thị trường.
            </p>
            <p className="text-green-700 leading-relaxed mb-4">
              Chúng tôi chọn làm theo hướng khác: trực tiếp đến từng bản, ký kết hợp đồng dài hạn với nông dân, học hỏi kỹ thuật chế biến truyền thống, rồi mang sản phẩm về đóng gói chuẩn và giao đến tay người tiêu dùng.
            </p>
            <p className="text-green-700 leading-relaxed">
              Hôm nay, chúng tôi hợp tác với hơn 50 hộ dân ở 4 huyện của Sơn La và phục vụ hàng nghìn khách hàng trên toàn quốc mỗi tháng — tất cả vì chất lượng thật, hương vị thật.
            </p>
          </div>

          {/* Image grid placeholder */}
          <div className="grid grid-cols-2 gap-3 h-96">
            {[
              { grad: "from-green-900 to-emerald-800", emoji: "🏔️", label: "Núi rừng Sơn La" },
              { grad: "from-amber-900 to-orange-800",  emoji: "🔥", label: "Thịt Gác Bếp" },
              { grad: "from-teal-900 to-green-800",    emoji: "🍃", label: "Vườn Trà Shan Tuyết" },
              { grad: "from-stone-900 to-stone-700",   emoji: "👨‍🌾", label: "Nông dân bản địa" },
            ].map(({ grad, emoji, label }) => (
              <div key={label} className={`bg-linear-to-br ${grad} rounded-2xl flex flex-col items-center justify-center gap-2 text-white`}>
                <span className="text-4xl">{emoji}</span>
                <p className="text-xs font-semibold text-white/70 text-center px-2">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-green-900">
        <div className="max-w-5xl mx-auto px-6 sm:px-10 py-14 grid grid-cols-2 sm:grid-cols-4 gap-8">
          {STATS.map(({ value, label, icon }) => (
            <div key={label} className="text-center">
              <div className="text-3xl mb-2">{icon}</div>
              <div className="text-4xl font-extrabold text-white mb-1">{value}</div>
              <div className="text-green-300 text-sm">{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="bg-green-50">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 py-20">
          <div className="text-center mb-12">
            <span className="text-green-600 font-semibold text-sm tracking-widest uppercase mb-3 block">Giá Trị Cốt Lõi</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-green-900">Chúng tôi tin vào điều gì</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUES.map(({ icon, title, desc, grad }) => (
              <div key={title} className="bg-white rounded-2xl p-6 border border-green-100 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200">
                <div className={`w-12 h-12 bg-linear-to-br ${grad} rounded-xl flex items-center justify-center text-xl mb-4 text-white`}>
                  {icon}
                </div>
                <h3 className="font-bold text-green-900 mb-2 text-base">{title}</h3>
                <p className="text-green-600 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="max-w-5xl mx-auto px-6 sm:px-10 py-20">
        <div className="text-center mb-12">
          <span className="text-green-600 font-semibold text-sm tracking-widest uppercase mb-3 block">Con Người</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-green-900">Đội Ngũ Mộc Sơn</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-7">
          {TEAM.map(({ name, role, desc, emoji, grad }) => (
            <div key={name} className="bg-white rounded-2xl overflow-hidden border border-green-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className={`h-36 bg-linear-to-br ${grad} flex items-center justify-center text-6xl`}>
                {emoji}
              </div>
              <div className="p-6">
                <h3 className="font-extrabold text-green-900 text-lg">{name}</h3>
                <p className="text-green-500 text-xs font-semibold uppercase tracking-wider mt-0.5 mb-3">{role}</p>
                <p className="text-green-700 text-sm leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-green-900 text-white">
        <div className="max-w-3xl mx-auto px-6 sm:px-10 py-20 text-center">
          <span className="text-5xl mb-5 block">🌿</span>
          <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">Sẵn sàng thử đặc sản Sơn La?</h2>
          <p className="text-green-300 text-base leading-relaxed mb-8 max-w-xl mx-auto">
            Hàng trăm khách hàng đã tin tưởng Mộc Sơn mỗi tháng. Hãy để chúng tôi đem hương vị núi rừng đến mâm cơm của bạn.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/products"
              className="inline-flex items-center justify-center gap-2 bg-white text-green-900 font-bold px-8 py-3.5 rounded-full hover:bg-green-50 transition-all hover:shadow-lg hover:-translate-y-0.5 text-sm"
            >
              Xem Sản Phẩm
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
              </svg>
            </Link>
            <Link
              href="/#contact"
              className="inline-flex items-center justify-center gap-2 bg-green-800 border border-green-700 text-white font-bold px-8 py-3.5 rounded-full hover:bg-green-700 transition-all text-sm"
            >
              Liên Hệ Chúng Tôi
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
