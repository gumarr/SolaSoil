export default function Footer() {
  return (
    <footer className="bg-green-950 text-green-400 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-green-700 rounded-xl flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white"><path d="M17 8C8 10 5.9 16.17 3.82 21H5.71C6.47 19.1 7.5 17.1 9 15.5C11.07 16.8 13.92 17 17 8z"/></svg>
              </div>
              <div>
                <span className="font-extrabold text-white text-base block leading-none">Mộc Sơn</span>
                <span className="text-green-500 text-[10px] tracking-widest uppercase">Đặc Sản Sơn La</span>
              </div>
            </div>
            <p className="text-green-500 text-sm leading-relaxed mb-5">Nền tảng đặc sản Sơn La — kết nối người tiêu dùng với những hương vị thuần khiết nhất của núi rừng Tây Bắc.</p>
            <div className="flex gap-2.5">
              {(["fb","ig","yt"] as const).map((s) => (
                <a key={s} href="#" className="w-8 h-8 bg-green-800 hover:bg-green-700 rounded-full flex items-center justify-center text-[10px] uppercase font-bold transition-all hover:-translate-y-0.5">{s}</a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 text-sm tracking-wide">Sản Phẩm</h4>
            <ul className="space-y-2.5">{["Đồ Ăn","Đồ Uống","Gia Vị","Hoa Quả Theo Mùa","Hộp Quà Tặng"].map((l) => (<li key={l}><a href="#" className="text-sm hover:text-white transition-colors">{l}</a></li>))}</ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 text-sm tracking-wide">Về Mộc Sơn</h4>
            <ul className="space-y-2.5">{["Câu Chuyện","Đối Tác Nông Dân","Quy Trình Kiểm Định","Blog Ẩm Thực","Tuyển Dụng"].map((l) => (<li key={l}><a href="#" className="text-sm hover:text-white transition-colors">{l}</a></li>))}</ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-4 text-sm tracking-wide">Hỗ Trợ</h4>
            <ul className="space-y-2.5">{["Liên Hệ","Chính Sách Đổi Trả","Vận Chuyển","Câu Hỏi Thường Gặp","Điều Khoản"].map((l) => (<li key={l}><a href="#" className="text-sm hover:text-white transition-colors">{l}</a></li>))}</ul>
          </div>
        </div>
        <div className="border-t border-green-800/50 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-green-600">
          <span>© 2026 Mộc Sơn. Tất cả quyền được bảo lưu.</span>
          <span>Làm với ❤️ vì hương vị Sơn La</span>
        </div>
      </div>
    </footer>
  );
}
