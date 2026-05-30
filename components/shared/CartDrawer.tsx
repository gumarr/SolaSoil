"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import type { GiftBox } from "@/context/CartContext";
import {
  isGiftBox,
  getDisplayName,
  getDisplayIcon,
  getPriceDisplay,
  getGiftBoxSummary,
  getGiftBoxProductsInfo,
  getQuantity,
  formatPrice,
} from "@/lib/cartUtils";

import { useRouter } from "next/navigation";

// Map style id → preview image path
const STYLE_IMAGES: Record<string, string> = {
  "moc-mac":    "/gift-box-styles/moc-mac.png",
  "sang-trong": "/gift-box-styles/sang-trong.png",
  "don-gian":   "/gift-box-styles/don-gian.png",
  "thanh-lich": "/gift-box-styles/thanh-lich.png",
};

const STYLE_LABELS: Record<string, string> = {
  "moc-mac":    "Mộc mạc",
  "sang-trong": "Sang trọng",
  "don-gian":   "Đơn giản",
  "thanh-lich": "Thanh lịch",
};

// ── GiftBox Detail Popup ──────────────────────────────────────────────────────
function GiftBoxDetailPopup({
  giftBox,
  onClose,
}: {
  giftBox: GiftBox;
  onClose: () => void;
}) {
  const products = getGiftBoxProductsInfo(giftBox);
  const totalQty = giftBox.items.reduce((s, i) => s + i.quantity, 0);
  const isDiscounted = totalQty >= 5;
  const styleLabel = giftBox.style ? (STYLE_LABELS[giftBox.style] ?? giftBox.style) : null;
  const styleImage = giftBox.style ? STYLE_IMAGES[giftBox.style] : null;

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ background: "rgba(14,26,15,0.72)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-sm rounded-3xl overflow-hidden"
        style={{
          background: "rgba(250,248,244,0.98)",
          boxShadow: "0 32px 80px rgba(14,26,15,0.35)",
          border: "1px solid rgba(201,222,202,0.25)",
          maxHeight: "90vh",
          overflowY: "auto",
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3.5 right-3.5 z-10 w-8 h-8 rounded-full flex items-center justify-center"
          style={{ background: "rgba(47,86,50,0.10)", color: "#2f5632" }}
        >
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Style preview image */}
        {styleImage && (
          <div className="relative overflow-hidden" style={{ height: 160 }}>
            <img src={styleImage} alt={styleLabel ?? "Phong cách"} className="w-full h-full object-cover" />
            <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(0,0,0,0.60) 0%, transparent 55%)" }} />
            <div className="absolute bottom-0 inset-x-0 p-3 flex items-center gap-2">
              <span className="text-lg">🎁</span>
              <div>
                <p className="text-white font-bold text-sm leading-none">Gói Quà Của Bạn</p>
                {styleLabel && (
                  <p className="text-white/75 text-[11px] mt-0.5">Phong cách: {styleLabel}</p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="p-5">
          {/* Header (khi không có ảnh style) */}
          {!styleImage && (
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                style={{ background: "rgba(157,196,158,0.15)" }}>🎁</div>
              <div>
                <p className="font-bold text-sm" style={{ color: "#1a2e1b" }}>Gói Quà Của Bạn</p>
                {styleLabel && <p className="text-[11px]" style={{ color: "#6fa470" }}>Phong cách: {styleLabel}</p>}
              </div>
            </div>
          )}

          {/* Divider */}
          <div className="h-px mb-4" style={{ background: "rgba(201,222,202,0.30)" }} />

          {/* Product list */}
          <p className="text-[10px] font-bold uppercase tracking-widest mb-2.5" style={{ color: "#9dc49e" }}>
            Danh sách sản phẩm
          </p>
          <div className="space-y-2 mb-4">
            {products.map((p, i) => (
              <div
                key={i}
                className="flex items-center justify-between gap-3 rounded-xl px-3 py-2.5"
                style={{ background: "rgba(157,196,158,0.08)", border: "1px solid rgba(201,222,202,0.20)" }}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <span className="text-lg shrink-0">{p.emoji}</span>
                  <p className="text-xs font-semibold truncate" style={{ color: "#1a2e1b" }}>{p.name}</p>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                    style={{ background: "rgba(47,86,50,0.10)", color: "#2f5632" }}
                  >
                    ×{p.quantity}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="h-px mb-4" style={{ background: "rgba(201,222,202,0.30)" }} />

          {/* Discount badge */}
          <div className="mb-3">
            {isDiscounted ? (
              <div
                className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold"
                style={{
                  background: "rgba(34,197,94,0.10)",
                  border: "1px solid rgba(34,197,94,0.25)",
                  color: "#15803d",
                }}
              >
                <span className="text-base">🎉</span>
                <span>Đã áp dụng <strong>giảm 10%</strong> (mua ≥5 sản phẩm)</span>
              </div>
            ) : (
              <div
                className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-xs"
                style={{
                  background: "rgba(157,196,158,0.08)",
                  border: "1px solid rgba(201,222,202,0.25)",
                  color: "#6fa470",
                }}
              >
                <span className="text-base">💡</span>
                <span>Thêm <strong>{5 - totalQty} sản phẩm</strong> nữa để được giảm 10%</span>
              </div>
            )}
          </div>

          {/* Price summary */}
          <div
            className="rounded-xl p-3 space-y-1.5"
            style={{ background: "rgba(157,196,158,0.07)", border: "1px solid rgba(201,222,202,0.20)" }}
          >
            <div className="flex items-center justify-between text-xs">
              <span style={{ color: "#4d8550" }}>Số mục</span>
              <span className="font-semibold" style={{ color: "#1a2e1b" }}>{totalQty}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span style={{ color: "#4d8550" }}>Tổng cộng</span>
              <span className="font-bold text-sm" style={{ color: "#d4922b" }}>
                {formatPrice(giftBox.totalPrice)}
              </span>
            </div>
            {isDiscounted && (
              <div className="flex items-center justify-between text-[10px]">
                <span style={{ color: "#6fa470" }}>Đã bao gồm giảm giá 10%</span>
                <span style={{ color: "#22c55e" }}>✓</span>
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="w-full mt-4 py-3 rounded-2xl font-bold text-sm text-white"
            style={{
              background: "linear-gradient(135deg, #2f5632, #4d8550)",
              boxShadow: "0 4px 16px rgba(47,86,50,0.25)",
            }}
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

// ── CartDrawer ────────────────────────────────────────────────────────────────
export default function CartDrawer() {
  const { items, isOpen, count, total, removeItem, updateQty, closeCart } =
    useCart();
  const router = useRouter();
  const [inspectBox, setInspectBox] = useState<GiftBox | null>(null);

  const handleCheckout = () => {
    closeCart();
    router.push("/checkout");
  };

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 transition-all duration-400"
        style={{
          background: "rgba(14,26,15,0.45)",
          backdropFilter: isOpen ? "blur(4px)" : "blur(0px)",
          WebkitBackdropFilter: isOpen ? "blur(4px)" : "blur(0px)",
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
        }}
        onClick={closeCart}
      />

      {/* Drawer */}
      <aside
        className="fixed top-0 right-0 h-full z-50 flex flex-col"
        style={{
          width: "min(420px, 100vw)",
          background: "rgba(250,248,244,0.97)",
          backdropFilter: "blur(32px) saturate(180%)",
          WebkitBackdropFilter: "blur(32px) saturate(180%)",
          borderLeft: "1px solid rgba(201,222,202,0.25)",
          boxShadow: "-24px 0 80px rgba(14,26,15,0.20)",
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          transition: "transform 0.45s cubic-bezier(0.32,0.72,0,1)",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-5"
          style={{ borderBottom: "1px solid rgba(201,222,202,0.20)" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #2f5632, #4d8550)",
                boxShadow: "0 4px 12px rgba(47,86,50,0.25)",
              }}
            >
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4L7 13zm0 0-1.4 7h12.8M9 21a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm10 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
              </svg>
            </div>
            <div>
              <h2 className="font-bold text-base leading-none" style={{ color: "#1a2e1b" }}>
                Giỏ Hàng
              </h2>
              <p className="text-xs mt-0.5" style={{ color: "#6fa470" }}>{count} sản phẩm</p>
            </div>
          </div>
          <button
            onClick={closeCart}
            className="w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
            style={{ color: "#6fa470" }}
            onMouseEnter={e => (e.currentTarget.style.background = "rgba(47,86,50,0.08)")}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto py-4 px-5 space-y-3">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center py-20 text-center">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl mb-5"
                style={{ background: "rgba(157,196,158,0.12)" }}
              >
                🛒
              </div>
              <p className="font-bold text-lg mb-2" style={{ color: "#1a2e1b" }}>Giỏ hàng trống</p>
              <p className="text-sm max-w-48" style={{ color: "#6fa470" }}>
                Thêm sản phẩm yêu thích vào đây!
              </p>
              <button
                onClick={closeCart}
                className="mt-6 px-7 py-3 rounded-full font-bold text-sm text-white btn-liquid"
                style={{
                  background: "linear-gradient(135deg, #2f5632, #4d8550)",
                  boxShadow: "0 4px 16px rgba(47,86,50,0.25)",
                }}
              >
                Khám Phá Sản Phẩm
              </button>
            </div>
          ) : (
            items.map((item) => {
              const isBox = isGiftBox(item);
              const icon = getDisplayIcon(item);
              const name = getDisplayName(item);
              const qty = getQuantity(item);
              const price = getPriceDisplay(item);
              const thumbSrc =
                !isBox && "image_thumb" in item
                  ? item.image_thumb || item.image_main || null
                  : null;

              return (
                <div
                  key={item.id}
                  className="flex items-center gap-3.5 rounded-2xl p-3.5 transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.85)",
                    border: "1px solid rgba(201,222,202,0.25)",
                    boxShadow: "0 2px 8px rgba(47,86,50,0.05)",
                  }}
                >
                  {/* Thumbnail / GiftBox preview trigger */}
                  <div
                    className={`w-16 h-16 rounded-xl overflow-hidden shrink-0 flex items-center justify-center text-2xl ${isBox ? "cursor-pointer" : ""}`}
                    style={{ background: "rgba(157,196,158,0.12)", position: "relative" }}
                    onClick={isBox ? () => setInspectBox(item as GiftBox) : undefined}
                  >
                    {isBox && item.style && STYLE_IMAGES[item.style] ? (
                      <>
                        <img
                          src={STYLE_IMAGES[item.style]}
                          alt="Gift box style"
                          className="w-full h-full object-cover"
                          suppressHydrationWarning
                        />
                        {/* Hover overlay */}
                        <div
                          className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white opacity-0 hover:opacity-100 transition-opacity duration-200"
                          style={{ background: "rgba(0,0,0,0.45)" }}
                        >
                          Xem
                        </div>
                      </>
                    ) : thumbSrc ? (
                      <img
                        src={thumbSrc}
                        alt={name}
                        className="w-full h-full object-cover"
                        suppressHydrationWarning
                      />
                    ) : (
                      icon
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm leading-snug" style={{ color: "#1a2e1b" }}>
                      {name}
                    </p>
                    {isBox ? (
                      <>
                        <p className="text-[11px] mt-0.5 line-clamp-1" style={{ color: "#9dc49e" }}>
                          {getGiftBoxSummary(item as GiftBox)}
                        </p>
                        {/* "Xem chi tiết" link */}
                        <button
                          onClick={() => setInspectBox(item as GiftBox)}
                          className="text-[10px] font-semibold mt-1 underline underline-offset-2 transition-colors"
                          style={{ color: "#4d8550" }}
                        >
                          Xem chi tiết →
                        </button>
                      </>
                    ) : (
                      <p className="text-[11px] mt-0.5" style={{ color: "#9dc49e" }}>
                        {"weight" in item ? item.weight : ""}
                      </p>
                    )}
                    <p className="font-bold text-sm mt-1" style={{ color: "#d4922b" }}>{price}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col items-end gap-2.5 shrink-0">
                    <button
                      onClick={() => removeItem(item.id)}
                      className="transition-colors duration-200"
                      style={{ color: "rgba(201,222,202,0.50)" }}
                      onMouseEnter={e => (e.currentTarget.style.color = "#ef4444")}
                      onMouseLeave={e => (e.currentTarget.style.color = "rgba(201,222,202,0.50)")}
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>

                    {!isBox && "qty" in item ? (
                      <div
                        className="flex items-center gap-1 rounded-xl overflow-hidden"
                        style={{
                          border: "1px solid rgba(201,222,202,0.35)",
                          background: "rgba(255,255,255,0.80)",
                        }}
                      >
                        <button
                          onClick={() => updateQty(item.id, item.qty - 1)}
                          className="w-7 h-7 flex items-center justify-center font-bold text-sm"
                          style={{ color: "#4d8550" }}
                        >
                          −
                        </button>
                        <span className="w-6 text-center font-bold text-sm" style={{ color: "#1a2e1b" }}>
                          {item.qty}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, item.qty + 1)}
                          className="w-7 h-7 flex items-center justify-center font-bold text-sm"
                          style={{ color: "#4d8550" }}
                        >
                          +
                        </button>
                      </div>
                    ) : (
                      <span
                        className="text-[10px] font-semibold px-2 py-1 rounded-lg"
                        style={{
                          background: "rgba(157,196,158,0.15)",
                          color: "#4d8550",
                        }}
                      >
                        {qty} mục
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div
            className="px-5 py-5 space-y-4"
            style={{ borderTop: "1px solid rgba(201,222,202,0.20)" }}
          >
            <div
              className="rounded-2xl p-4 space-y-2.5"
              style={{
                background: "rgba(157,196,158,0.08)",
                border: "1px solid rgba(201,222,202,0.20)",
              }}
            >
              <div className="flex items-center justify-between text-sm">
                <span style={{ color: "#4d8550" }}>Tạm tính ({count} sp)</span>
                <span className="font-bold" style={{ color: "#1a2e1b" }}>
                  {total.toLocaleString("vi-VN")} VND
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span style={{ color: "#4d8550" }}>Phí vận chuyển</span>
                <span className="text-xs font-medium" style={{ color: "#9dc49e" }}>
                  Tính khi thanh toán
                </span>
              </div>
              {total >= 300000 && (
                <div
                  className="flex items-center gap-1.5 text-xs rounded-xl px-3 py-2"
                  style={{
                    background: "rgba(79,133,80,0.12)",
                    color: "#3a6b3d",
                    border: "1px solid rgba(157,196,158,0.25)",
                  }}
                >
                  🎉{" "}
                  <span>
                    Đủ điều kiện <strong>miễn phí vận chuyển</strong>!
                  </span>
                </div>
              )}
            </div>

            <button
              onClick={handleCheckout}
              className="w-full py-4 rounded-2xl font-bold text-sm text-white btn-liquid"
              style={{
                background: "linear-gradient(135deg, #2f5632, #4d8550)",
                boxShadow: "0 6px 24px rgba(47,86,50,0.30)",
              }}
            >
              Thanh Toán — {total.toLocaleString("vi-VN")} VND
            </button>
            <button
              onClick={closeCart}
              className="w-full py-3 rounded-2xl font-semibold text-sm btn-liquid"
              style={{
                border: "1px solid rgba(201,222,202,0.35)",
                color: "#3a6b3d",
                background: "transparent",
              }}
            >
              Tiếp Tục Mua Sắm
            </button>
          </div>
        )}
      </aside>

      {/* GiftBox Detail Popup */}
      {inspectBox && (
        <GiftBoxDetailPopup
          giftBox={inspectBox}
          onClose={() => setInspectBox(null)}
        />
      )}
    </>
  );
}
