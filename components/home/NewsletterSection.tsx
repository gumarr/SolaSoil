"use client";

import { useState } from "react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [emailSent, setEmailSent] = useState(false);

  function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (email) { setEmailSent(true); setEmail(""); }
  }

  return (
    <section id="contact" className="py-20 bg-green-900">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <span className="text-green-400 text-xs uppercase tracking-widest font-semibold">Đăng Ký</span>
        <h2 className="text-4xl sm:text-5xl font-extrabold text-white mt-3 mb-4 leading-tight">Nhận Thông Báo<br/>Mùa Vụ Mới</h2>
        <p className="text-green-300 text-base sm:text-lg mb-10 leading-relaxed">
          Đăng ký để nhận thông báo khi có mận hậu, na sầu riêng, dâu tây Mộc Châu và các đặc sản khác vào đúng mùa.
        </p>
        {emailSent ? (
          <div className="bg-green-800/60 rounded-2xl px-8 py-6 border border-green-700">
            <p className="text-3xl mb-2">🎉</p>
            <p className="text-white font-bold">Cảm ơn bạn đã đăng ký!</p>
            <p className="text-green-300 text-sm mt-1">Chúng tôi sẽ báo bạn khi hàng mùa vụ mới về.</p>
          </div>
        ) : (
          <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input type="email" required placeholder="Địa chỉ email của bạn" value={email} onChange={(e) => setEmail(e.target.value)}
              className="flex-1 px-5 py-3.5 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-green-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"/>
            <button type="submit" className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-7 py-3.5 rounded-full transition-all hover:-translate-y-0.5 hover:shadow-lg whitespace-nowrap">Đăng Ký</button>
          </form>
        )}
      </div>
    </section>
  );
}
