export default function ValueStrip() {
  const items = [
    {
      icon: "🌱",
      title: "100% Thiên Nhiên",
      desc: "Không phụ gia, giữ nguyên hương vị gốc",
    },
    {
      icon: "🏔️",
      title: "Từ Núi Rừng Sơn La",
      desc: "Trực tiếp từ nông dân và làng bản bản địa",
    },
    {
      icon: "🚚",
      title: "Giao Hàng Toàn Quốc",
      desc: "2–3 ngày làm việc, đóng gói chuyên dụng",
    },
  ];

  return (
    <section
      className="relative"
      style={{ background: "var(--ivory)" }}
    >
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(201,222,202,0.50), transparent)" }}
      />

      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {items.map(item => (
            <div
              key={item.title}
              className="flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group hover:-translate-y-0.5"
              style={{
                background: "rgba(255,255,255,0.80)",
                border: "1px solid rgba(201,222,202,0.30)",
                boxShadow: "0 2px 12px rgba(47,86,50,0.05)",
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shrink-0 transition-transform duration-300 group-hover:scale-110"
                style={{ background: "rgba(157,196,158,0.15)" }}
              >
                {item.icon}
              </div>
              <div>
                <p className="font-bold text-sm" style={{ color: "#1a2e1b" }}>{item.title}</p>
                <p className="text-xs mt-0.5" style={{ color: "#6fa470" }}>{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className="absolute inset-x-0 bottom-0 h-px"
        style={{ background: "linear-gradient(90deg, transparent, rgba(201,222,202,0.40), transparent)" }}
      />
    </section>
  );
}