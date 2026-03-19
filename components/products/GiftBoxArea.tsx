"use client";

import type { Product } from "@/lib/data";
import { PRODUCT_IMAGES } from "@/lib/imageConfig";

export interface GiftBoxItem {
  product: Product;
  quantity: number;
}

interface GiftBoxAreaProps {
  items: GiftBoxItem[];
  onItemsChange: (items: GiftBoxItem[]) => void;
  onDragOver: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop: (e: React.DragEvent<HTMLDivElement>) => void;
  isDragOver: boolean;
}

export default function GiftBoxArea({
  items,
  onItemsChange,
  onDragOver,
  onDrop,
  isDragOver,
}: GiftBoxAreaProps) {

  const getTotalPrice = () =>
    items.reduce((s, i) => s + i.product.priceNum * i.quantity, 0);

  const getTotalWeight = () =>
    items.reduce((s, i) => {
      const w = parseFloat(i.product.weight);
      return s + (isNaN(w) ? 0 : w * i.quantity);
    }, 0);

  const handleRemove = (id: number) =>
    onItemsChange(items.filter(i => i.product.id !== id));

  const handleQty = (id: number, qty: number) => {
    if (qty <= 0) { handleRemove(id); return; }
    onItemsChange(items.map(i => i.product.id === id ? { ...i, quantity: qty } : i));
  };

  return (
    <div
      onDragOver={onDragOver}
      onDrop={onDrop}
      className="flex flex-col h-full transition-all duration-300"
      style={{
        background: isDragOver ? "rgba(201,222,202,0.20)" : "rgba(250,248,244,0.80)",
      }}
    >

      {/* ── Header ── */}
      <div
        className="px-4 py-3.5 flex items-center justify-between"
        style={{
          background: "rgba(250,248,244,0.95)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(201,222,202,0.22)",
        }}
      >
        <div>
          <h2 className="font-bold text-sm" style={{ color: "#1a2e1b" }}>
            Gói Quà Của Bạn
          </h2>
          <p className="text-[11px] mt-0.5" style={{ color: "#9dc49e" }}>
            {items.length} loại · {items.reduce((s, i) => s + i.quantity, 0)} mục
          </p>
        </div>
        <div
          className="text-xl w-9 h-9 rounded-xl flex items-center justify-center"
          style={{ background: "rgba(157,196,158,0.15)" }}
        >
          🎁
        </div>
      </div>

      {/* ── Empty state ── */}
      {items.length === 0 ? (
        <div
          className="flex-1 flex flex-col items-center justify-center p-6 text-center
                     transition-all duration-300 m-3 rounded-2xl"
          style={{
            background: isDragOver
              ? "rgba(201,222,202,0.25)"
              : "rgba(255,255,255,0.50)",
            border: `2px dashed ${isDragOver ? "rgba(111,164,112,0.60)" : "rgba(201,222,202,0.45)"}`,
          }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl mb-4
                       transition-transform duration-300"
            style={{
              background: isDragOver ? "rgba(157,196,158,0.25)" : "rgba(157,196,158,0.12)",
              transform: isDragOver ? "scale(1.08)" : "scale(1)",
            }}
          >
            {isDragOver ? "✨" : "🎁"}
          </div>
          <h3 className="font-bold text-sm mb-1.5" style={{ color: "#2f5632" }}>
            {isDragOver ? "Thả vào đây!" : "Tạo Gói Quà Của Bạn"}
          </h3>
          <p className="text-xs leading-relaxed" style={{ color: "#9dc49e" }}>
            {isDragOver
              ? "Sản phẩm sẽ được thêm vào gói quà"
              : "Kéo sản phẩm từ danh sách bên trái vào đây"}
          </p>
        </div>
      ) : (
        <>
          {/* ── Items list ── */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
            {items.map(item => {
              const imgs = PRODUCT_IMAGES[item.product.id];
              return (
                <div
                  key={item.product.id}
                  className="rounded-xl overflow-hidden transition-all duration-200"
                  style={{
                    background: "rgba(255,255,255,0.90)",
                    border: "1px solid rgba(201,222,202,0.30)",
                    boxShadow: "0 2px 8px rgba(47,86,50,0.05)",
                  }}
                >
                  {/* Top row */}
                  <div className="flex items-center gap-3 p-3">
                    {/* Thumbnail */}
                    <div className="w-12 h-12 rounded-lg overflow-hidden shrink-0"
                      style={{ background: "rgba(157,196,158,0.12)" }}>
                      {imgs?.thumb ? (
                        <img
                          src={imgs.thumb}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${item.product.grad}
                                        flex items-center justify-center text-xl`}>
                          {item.product.emoji}
                        </div>
                      )}
                    </div>

                    {/* Name + price */}
                    <div className="flex-1 min-w-0">
                      <h4
                        className="font-bold text-xs leading-snug line-clamp-2 mb-0.5"
                        style={{ color: "#1a2e1b" }}
                      >
                        {item.product.name}
                      </h4>
                      <p className="text-[10px]" style={{ color: "#9dc49e" }}>
                        {item.product.weight}
                      </p>
                      <p className="font-extrabold text-xs mt-0.5" style={{ color: "#d4922b" }}>
                        {item.product.price}
                      </p>
                    </div>

                    {/* Delete */}
                    <button
                      onClick={() => handleRemove(item.product.id)}
                      className="p-1.5 rounded-lg transition-all duration-200 shrink-0"
                      style={{ color: "rgba(201,222,202,0.60)" }}
                      onMouseEnter={e => {
                        e.currentTarget.style.color = "#ef4444";
                        e.currentTarget.style.background = "rgba(239,68,68,0.08)";
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.color = "rgba(201,222,202,0.60)";
                        e.currentTarget.style.background = "transparent";
                      }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>

                  {/* Bottom row — qty + subtotal */}
                  <div
                    className="flex items-center justify-between px-3 py-2"
                    style={{ borderTop: "1px solid rgba(201,222,202,0.20)" }}
                  >
                    {/* Quantity stepper */}
                    <div
                      className="flex items-center rounded-lg overflow-hidden"
                      style={{
                        border: "1px solid rgba(201,222,202,0.40)",
                        background: "rgba(255,255,255,0.80)",
                      }}
                    >
                      <button
                        onClick={() => handleQty(item.product.id, item.quantity - 1)}
                        className="w-7 h-7 flex items-center justify-center font-bold text-sm
                                   transition-colors hover:bg-[rgba(47,86,50,0.08)]"
                        style={{ color: "#4d8550" }}
                      >
                        −
                      </button>
                      <span
                        className="w-7 text-center font-bold text-sm"
                        style={{ color: "#1a2e1b" }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQty(item.product.id, item.quantity + 1)}
                        className="w-7 h-7 flex items-center justify-center font-bold text-sm
                                   transition-colors hover:bg-[rgba(47,86,50,0.08)]"
                        style={{ color: "#4d8550" }}
                      >
                        +
                      </button>
                    </div>

                    {/* Line total */}
                    <span className="text-xs font-semibold" style={{ color: "#6fa470" }}>
                      Tổng:{" "}
                      <span className="font-extrabold" style={{ color: "#d4922b" }}>
                        {((item.product.priceNum * item.quantity) / 1000).toFixed(0)}k đ
                      </span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Summary footer ── */}
          <div
            className="p-4 space-y-3"
            style={{
              background: "rgba(250,248,244,0.97)",
              backdropFilter: "blur(16px)",
              borderTop: "1px solid rgba(201,222,202,0.22)",
            }}
          >
            {/* Meta rows */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span style={{ color: "#6fa470" }}>Tổng khối lượng</span>
                <span className="font-semibold" style={{ color: "#2f5632" }}>
                  {getTotalWeight().toFixed(0)}{getTotalWeight() > 1000 ? " kg" : " g"}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span style={{ color: "#6fa470" }}>Số mục</span>
                <span className="font-semibold" style={{ color: "#2f5632" }}>
                  {items.reduce((s, i) => s + i.quantity, 0)}
                </span>
              </div>
            </div>

            {/* Grand total */}
            <div
              className="flex justify-between items-center pt-3"
              style={{ borderTop: "1px solid rgba(201,222,202,0.22)" }}
            >
              <span className="font-bold text-sm" style={{ color: "#1a2e1b" }}>Tổng giá</span>
              <span className="font-extrabold text-lg" style={{ color: "#d4922b" }}>
                {(getTotalPrice() / 1000).toFixed(0)}k đ
              </span>
            </div>

            {/* Clear all */}
            <button
              onClick={() => onItemsChange([])}
              className="w-full py-2 rounded-xl text-xs font-semibold transition-all duration-200"
              style={{
                border: "1px solid rgba(201,222,202,0.40)",
                color: "#6fa470",
                background: "transparent",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(239,68,68,0.06)";
                e.currentTarget.style.color = "#ef4444";
                e.currentTarget.style.borderColor = "rgba(239,68,68,0.20)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "#6fa470";
                e.currentTarget.style.borderColor = "rgba(201,222,202,0.40)";
              }}
            >
              Xóa Tất Cả
            </button>
          </div>
        </>
      )}
    </div>
  );
}