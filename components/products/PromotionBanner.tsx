"use client";

interface PromotionBannerProps {
  itemCount: number;
  isDiscountActive: boolean;
}

export default function PromotionBanner({
  itemCount,
  isDiscountActive,
}: PromotionBannerProps) {
  const progress = Math.min(itemCount / 5, 1) * 100;

  return (
    <div
      className={`
        relative overflow-hidden rounded-xl p-4 transition-all duration-500
        ${isDiscountActive
          ? "shadow-[0_0_24px_rgba(34,197,94,0.35)]"
          : "shadow-md"
        }
      `}
      style={{
        background: isDiscountActive
          ? "linear-gradient(135deg, #059669 0%, #16a34a 50%, #22c55e 100%)"
          : "linear-gradient(135deg, #047857 0%, #059669 50%, #10b981 100%)",
      }}
    >
      {/* Decorative sparkle dots */}
      <div className="absolute top-2 right-3 text-white/20 text-2xl pointer-events-none select-none">
        ✦
      </div>
      <div className="absolute bottom-1 left-4 text-white/15 text-lg pointer-events-none select-none">
        ✧
      </div>

      {/* Header row */}
      <div className="flex items-center gap-2.5 mb-3">
        <div
          className={`
            w-9 h-9 rounded-lg flex items-center justify-center text-lg
            transition-transform duration-500
            ${isDiscountActive ? "scale-110" : ""}
          `}
          style={{ background: "rgba(255,255,255,0.20)" }}
        >
          {isDiscountActive ? "🎉" : "✨"}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold text-sm leading-tight">
            {isDiscountActive
              ? "Bạn đã nhận được giảm giá 10%!"
              : "Mua 5 sản phẩm — Giảm ngay 10%"}
          </h3>
          <p className="text-white/70 text-[11px] mt-0.5">
            {isDiscountActive
              ? "Giảm giá đã tự động áp dụng"
              : `Đã chọn: ${itemCount} / 5 sản phẩm`}
          </p>
        </div>
      </div>

      {/* Progress bar */}
      <div className="relative h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.20)" }}>
        <div
          className="absolute inset-y-0 left-0 rounded-full transition-all duration-500 ease-out"
          style={{
            width: `${progress}%`,
            background: isDiscountActive
              ? "rgba(255,255,255,0.95)"
              : "rgba(255,255,255,0.80)",
            boxShadow: isDiscountActive
              ? "0 0 12px rgba(255,255,255,0.6)"
              : "none",
          }}
        />
      </div>

      {/* Progress label */}
      <div className="flex items-center justify-between mt-1.5">
        <span className="text-[10px] text-white/60 font-medium">
          {itemCount} / 5
        </span>
        {isDiscountActive && (
          <span className="text-[10px] text-white font-bold px-2 py-0.5 rounded-full"
            style={{ background: "rgba(255,255,255,0.20)" }}>
            -10%
          </span>
        )}
      </div>

      {/* Completion glow animation */}
      {isDiscountActive && (
        <div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            animation: "promo-glow 2s ease-in-out infinite",
          }}
        />
      )}

      <style>{`
        @keyframes promo-glow {
          0%, 100% {
            box-shadow: inset 0 0 20px rgba(255,255,255,0.05);
          }
          50% {
            box-shadow: inset 0 0 30px rgba(255,255,255,0.15);
          }
        }
      `}</style>
    </div>
  );
}
