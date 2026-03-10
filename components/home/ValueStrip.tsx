export default function ValueStrip() {
  return (
    <section className="bg-green-50 border-y border-green-100">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 py-7 grid grid-cols-1 sm:grid-cols-3 gap-5 sm:divide-x sm:divide-green-200">
        {[
          { icon: "🌱", title: "100% Thiên Nhiên",     desc: "Không phụ gia, giữ nguyên hương vị gốc" },
          { icon: "🏔️", title: "Từ Núi Rừng Sơn La",  desc: "Trực tiếp từ nông dân và làng bản bản địa" },
          { icon: "🚚", title: "Giao Hàng Toàn Quốc", desc: "2–3 ngày làm việc, đóng gói chuyên dụng" },
        ].map((item) => (
          <div key={item.title} className="flex items-center gap-4 sm:px-6 first:pl-0 last:pr-0 hover:-translate-y-0.5 transition-transform duration-200">
            <span className="text-3xl shrink-0">{item.icon}</span>
            <div>
              <p className="font-bold text-green-900 text-sm">{item.title}</p>
              <p className="text-green-700 text-xs mt-0.5">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
