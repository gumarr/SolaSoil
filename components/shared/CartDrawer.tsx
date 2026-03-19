"use client";

import { useCart } from "@/context/CartContext";
import {
  isGiftBox,
  getDisplayName,
  getDisplayIcon,
  getPriceDisplay,
  getGiftBoxSummary,
  getQuantity,
} from "@/lib/cartUtils";
import { PRODUCT_IMAGES } from "@/lib/imageConfig";

export default function CartDrawer() {
  const { items, isOpen, count, total, removeItem, updateQty, closeCart } = useCart();

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
              const isBox    = isGiftBox(item);
              const icon     = getDisplayIcon(item);
              const name     = getDisplayName(item);
              const qty      = getQuantity(item);
              const price    = getPriceDisplay(item);
              // Thumbnail: real photo from config, else emoji fallback
              const thumbSrc = !isBox && "id" in item
                ? PRODUCT_IMAGES[item.id as number]?.thumb
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
                  {/* Thumbnail */}
                  <div
                    className="w-16 h-16 rounded-xl overflow-hidden shrink-0 flex items-center justify-center text-2xl"
                    style={{ background: "rgba(157,196,158,0.12)" }}
                  >
                    {thumbSrc ? (
                      <img src={thumbSrc} alt={name} className="w-full h-full object-cover" />
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
                      <p className="text-[11px] mt-0.5 line-clamp-1" style={{ color: "#9dc49e" }}>
                        {getGiftBoxSummary(item)}
                      </p>
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
                        style={{ background: "rgba(157,196,158,0.15)", color: "#4d8550" }}
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
                  {total.toLocaleString("vi-VN")}đ
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
              className="w-full py-4 rounded-2xl font-bold text-sm text-white btn-liquid"
              style={{
                background: "linear-gradient(135deg, #2f5632, #4d8550)",
                boxShadow: "0 6px 24px rgba(47,86,50,0.30)",
              }}
            >
              Thanh Toán — {total.toLocaleString("vi-VN")}đ
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
    </>
  );
}