"use client";

import { useState } from "react";

export default function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email) { setSent(true); setEmail(""); }
  }

  return (
    <section id="contact" className="relative py-24 overflow-hidden" style={{ background: "#0d1a0e" }}>

      {/* Background blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute"
          style={{
            width: "50vw", height: "50vw",
            top: "-15%", left: "25%",
            background: "radial-gradient(circle, rgba(47,86,50,0.30) 0%, transparent 65%)",
            animation: "blobMorph 20s ease-in-out infinite",
            borderRadius: "60% 40% 70% 30% / 50% 60% 40% 70%",
          }}
        />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: "linear-gradient(rgba(157,196,158,1) 1px, transparent 1px), linear-gradient(90deg, rgba(157,196,158,1) 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest mb-6"
          style={{
            background: "rgba(157,196,158,0.10)",
            border: "1px solid rgba(157,196,158,0.20)",
            color: "#9dc49e",
          }}
        >
          Đăng Ký
        </div>

        <h2
          className="font-extrabold text-white mb-4 leading-tight"
          style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}
        >
          Nhận Thông Báo
          <br />
          <span style={{
            background: "linear-gradient(135deg, #9dc49e, #f6c87a)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}>
            Mùa Vụ Mới
          </span>
        </h2>
        <p className="text-sm leading-relaxed mb-10 max-w-md mx-auto" style={{ color: "rgba(201,222,202,0.65)" }}>
          Đăng ký để nhận thông báo khi có mận hậu, na sầu riêng, dâu tây Mộc Châu vào đúng mùa.
        </p>

        {sent ? (
          <div
            className="rounded-2xl px-8 py-8"
            style={{
              background: "rgba(157,196,158,0.10)",
              border: "1px solid rgba(157,196,158,0.20)",
            }}
          >
            <p className="text-4xl mb-3">🎉</p>
            <p className="text-white font-bold mb-1">Cảm ơn bạn đã đăng ký!</p>
            <p className="text-sm" style={{ color: "rgba(201,222,202,0.70)" }}>
              Chúng tôi sẽ báo bạn khi hàng mùa vụ mới về.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-sm mx-auto">
            <input
              type="email" required
              placeholder="Địa chỉ email của bạn"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="flex-1 px-5 py-3.5 rounded-2xl text-sm outline-none focus:ring-2"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.12)",
                color: "white",
                caretColor: "#9dc49e",
                boxShadow: "none",
              }}
            />
            <button
              type="submit"
              className="px-7 py-3.5 rounded-2xl font-bold text-sm whitespace-nowrap btn-liquid"
              style={{
                background: "linear-gradient(135deg, #4d8550, #9dc49e)",
                color: "#0d1a0e",
                boxShadow: "0 4px 16px rgba(79,133,80,0.30)",
              }}
            >
              Đăng Ký
            </button>
          </form>
        )}
      </div>
    </section>
  );
}