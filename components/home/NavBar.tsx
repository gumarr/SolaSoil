"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";

const NAV_LINKS = [
  ["/products",   "Sản Phẩm"],
  ["/categories", "Danh Mục"],
  ["/about",      "Về Chúng Tôi"],
  ["/#contact",   "Liên Hệ"],
] as const;

export default function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { count, openCart } = useCart();

  return (
    <nav className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-green-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 bg-green-800 rounded-xl flex items-center justify-center shadow-md transition-all group-hover:bg-green-700 group-hover:rotate-6 group-hover:scale-110">
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
              <path d="M17 8C8 10 5.9 16.17 3.82 21H5.71C6.47 19.1 7.5 17.1 9 15.5C11.07 16.8 13.92 17 17 8z"/>
            </svg>
          </div>
          <div>
            <span className="font-extrabold text-green-900 text-lg tracking-tight leading-none block">Mộc Sơn</span>
            <span className="text-green-600 text-[10px] tracking-widest uppercase leading-none">Đặc Sản Sơn La</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-7">
          {NAV_LINKS.map(([href, label]) => (
            <Link key={label} href={href} className="relative text-green-800 hover:text-green-600 text-sm font-medium transition-colors group/link">
              {label}
              <span className="absolute -bottom-0.5 left-0 w-0 h-0.5 bg-amber-500 group-hover/link:w-full transition-all duration-300"/>
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <button onClick={openCart} className="relative text-green-800 hover:text-green-600 transition-colors p-1.5 hover:bg-green-50 rounded-lg" aria-label="Giỏ hàng">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4L7 13zm0 0-1.4 7h12.8M9 21a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm10 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
            </svg>
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-amber-600 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">{count}</span>
            )}
          </button>
          <Link href="/products" className="hidden sm:inline-flex items-center gap-1.5 bg-green-800 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-full transition-all hover:shadow-lg hover:shadow-green-900/30 hover:-translate-y-0.5">
            Mua Ngay
          </Link>
          <button className="md:hidden text-green-800 p-1" onClick={() => setMobileMenuOpen((v) => !v)}>
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d={mobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}/>
            </svg>
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-green-100 px-6 py-5 flex flex-col gap-4 shadow-lg">
          {NAV_LINKS.map(([href, label]) => (
            <Link key={label} href={href} className="text-green-900 font-semibold" onClick={() => setMobileMenuOpen(false)}>{label}</Link>
          ))}
        </div>
      )}
    </nav>
  );
}
