export default function AnnouncementBar() {
  return (
    <div
      className="relative z-50 text-center px-4 py-2.5 text-xs sm:text-sm overflow-hidden"
      style={{
        background: "linear-gradient(90deg, #1a2e1b 0%, #2f5632 40%, #3a6b3d 60%, #1a2e1b 100%)",
        color: "rgba(201,222,202,0.90)",
        letterSpacing: "0.04em",
      }}
    >
      {/* Shimmer */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.04) 50%, transparent 100%)",
          animation: "shimmerSlide 4s linear infinite",
          backgroundSize: "200% 100%",
        }}
      />
      <span className="relative">
        🏔️ Miễn phí vận chuyển đơn trên{" "}
        <strong className="text-white font-bold">300.000đ</strong>
        &nbsp;·&nbsp;
        <span style={{ color: "rgba(246,200,122,0.90)" }}>Đặc sản Sơn La — Mộc Sơn</span>
      </span>
    </div>
  );
}