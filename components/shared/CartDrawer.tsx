"use client";

import { useCart } from "@/context/CartContext";

export default function CartDrawer() {
  const { items, isOpen, count, total, removeItem, updateQty, closeCart } = useCart();

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-105 bg-white z-50 flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-green-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-green-800 rounded-xl flex items-center justify-center shadow-sm">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4L7 13zm0 0-1.4 7h12.8M9 21a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm10 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
              </svg>
            </div>
            <div>
              <h2 className="font-bold text-green-900 text-base leading-none">Giỏ Hàng</h2>
              <p className="text-green-500 text-xs mt-0.5">{count} sản phẩm</p>
            </div>
          </div>
          <button
            onClick={closeCart}
            className="w-8 h-8 rounded-full hover:bg-green-50 flex items-center justify-center text-green-500 hover:text-green-900 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto py-4 px-5 space-y-3">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center py-20 text-center">
              <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center text-4xl mb-5">🛒</div>
              <p className="font-bold text-green-900 text-lg mb-2">Giỏ hàng trống</p>
              <p className="text-green-500 text-sm leading-relaxed max-w-55">Thêm sản phẩm yêu thích vào đây để bắt đầu!</p>
              <button
                onClick={closeCart}
                className="mt-6 bg-green-800 hover:bg-green-700 text-white font-semibold px-7 py-3 rounded-full text-sm transition-all hover:-translate-y-0.5"
              >
                Khám Phá Sản Phẩm
              </button>
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="flex items-center gap-3.5 bg-white border border-green-100 rounded-2xl p-3.5 hover:border-green-200 transition-colors">
                <div className={`w-16 h-16 rounded-xl bg-linear-to-br ${item.grad} flex items-center justify-center text-2xl shrink-0 shadow-sm`}>
                  {item.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-green-900 text-sm leading-snug">{item.name}</p>
                  <p className="text-green-400 text-xs mt-0.5">{item.weight}</p>
                  <p className="font-bold text-amber-700 text-sm mt-1">{item.priceLabel}</p>
                </div>
                <div className="flex flex-col items-end gap-2.5 shrink-0">
                  <button onClick={() => removeItem(item.id)} className="text-green-300 hover:text-red-500 transition-colors">
                    <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                    </svg>
                  </button>
                  <div className="flex items-center gap-1">
                    <button onClick={() => updateQty(item.id, item.qty - 1)} className="w-7 h-7 rounded-full border border-green-200 bg-white hover:bg-green-50 flex items-center justify-center text-green-800 font-bold text-sm transition-colors">−</button>
                    <span className="w-6 text-center font-bold text-green-900 text-sm">{item.qty}</span>
                    <button onClick={() => updateQty(item.id, item.qty + 1)} className="w-7 h-7 rounded-full border border-green-200 bg-white hover:bg-green-50 flex items-center justify-center text-green-800 font-bold text-sm transition-colors">+</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-green-100 px-5 py-5 space-y-3 bg-white">
            <div className="bg-green-50 rounded-xl p-4 space-y-2.5">
              <div className="flex items-center justify-between text-sm">
                <span className="text-green-700">Tạm tính ({count} sp)</span>
                <span className="font-bold text-green-900">{total.toLocaleString("vi-VN")}đ</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-green-700">Phí vận chuyển</span>
                <span className="text-green-500 text-xs font-medium">Tính khi thanh toán</span>
              </div>
              {total >= 300000 && (
                <div className="flex items-center gap-1.5 text-xs text-green-700 bg-green-100 rounded-lg px-3 py-1.5">
                  <span>🎉</span>
                  <span className="font-medium">Đủ điều kiện <strong>miễn phí vận chuyển</strong>!</span>
                </div>
              )}
            </div>
            <button className="w-full bg-green-800 hover:bg-green-700 text-white font-bold py-4 rounded-full transition-all hover:shadow-lg hover:shadow-green-900/20 text-sm tracking-wide">
              Thanh Toán — {total.toLocaleString("vi-VN")}đ
            </button>
            <button onClick={closeCart} className="w-full border border-green-200 hover:bg-green-50 text-green-800 font-semibold py-3 rounded-full transition-all text-sm">
              Tiếp Tục Mua Sắm
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
