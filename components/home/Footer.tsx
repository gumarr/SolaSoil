export default function Footer() {
  return (
    <footer
      className="relative pt-16 pb-8 overflow-hidden"
      style={{ background: "#080f08" }}
    >
      {/* Subtle tint */}
      <div
        className="absolute inset-0 pointer-events-none opacity-30"
        style={{ background: "radial-gradient(ellipse 60% 50% at 20% 100%, rgba(47,86,50,0.40) 0%, transparent 65%)" }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 sm:px-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(157,196,158,0.12)", border: "1px solid rgba(157,196,158,0.20)" }}
              >
                <svg viewBox="0 0 24 24" className="w-5 h-5" style={{ fill: "#9dc49e" }}>
                  <path d="M17 8C8 10 5.9 16.17 3.82 21H5.71C6.47 19.1 7.5 17.1 9 15.5C11.07 16.8 13.92 17 17 8z" />
                </svg>
              </div>
              <div>
                <span className="font-extrabold text-base text-white block leading-none">Mộc Sơn</span>
                <span className="text-[10px] tracking-widest uppercase leading-none" style={{ color: "rgba(157,196,158,0.55)" }}>Đặc Sản Sơn La</span>
              </div>
            </div>
            <p className="text-xs leading-relaxed mb-5" style={{ color: "rgba(201,222,202,0.45)" }}>
              Nền tảng đặc sản Sơn La — kết nối người tiêu dùng với hương vị thuần khiết của núi rừng Tây Bắc.
            </p>
            <div className="flex gap-2">
              {["fb", "ig", "yt"].map(s => (
                <a
                  key={s}
                  href="#"
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-bold uppercase transition-all duration-300 hover:-translate-y-0.5"
                  style={{
                    background: "rgba(157,196,158,0.08)",
                    border: "1px solid rgba(157,196,158,0.12)",
                    color: "#9dc49e",
                  }}
                >
                  {s}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {[
            { title: "Sản Phẩm", links: ["Đồ Ăn", "Đồ Uống", "Gia Vị", "Hoa Quả Theo Mùa", "Hộp Quà Tặng"] },
            { title: "Về Mộc Sơn", links: ["Câu Chuyện", "Đối Tác Nông Dân", "Quy Trình Kiểm Định", "Blog Ẩm Thực"] },
            { title: "Hỗ Trợ", links: ["Liên Hệ", "Chính Sách Đổi Trả", "Vận Chuyển", "Câu Hỏi Thường Gặp"] },
          ].map(col => (
            <div key={col.title}>
              <h4 className="text-white font-bold mb-4 text-xs tracking-widest uppercase">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map(l => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-xs transition-colors duration-200"
                      style={{ color: "rgba(201,222,202,0.45)" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#9dc49e")}
                      onMouseLeave={e => (e.currentTarget.style.color = "rgba(201,222,202,0.45)")}
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px mb-6" style={{ background: "rgba(157,196,158,0.08)" }} />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <span className="text-[11px]" style={{ color: "rgba(201,222,202,0.30)" }}>
            © 2026 Mộc Sơn. Tất cả quyền được bảo lưu.
          </span>
          <span className="text-[11px]" style={{ color: "rgba(201,222,202,0.30)" }}>
            Làm với ❤️ vì hương vị Sơn La
          </span>
        </div>
      </div>
    </footer>
  );
}