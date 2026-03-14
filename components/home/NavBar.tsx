"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

const NAV_LINKS = [
  ["/products",         "Sản Phẩm"],
  ["/create-gift-box",  "Tạo Gói Quà"],
  ["/categories",       "Danh Mục"],
  ["/about",            "Về Chúng Tôi"],
  ["/#contact",         "Liên Hệ"],
] as const;

export default function NavBar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { count, openCart } = useCart();
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

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
          
          {user ? (
            <div className="relative group/user">
              <button className="flex items-center gap-2 bg-green-50 text-green-800 hover:bg-green-100 px-3 py-2 rounded-full transition-colors font-medium text-sm">
                <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="max-w-[100px] truncate hidden sm:block">{user.user_metadata?.full_name || user.email}</span>
              </button>
              
              <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover/user:opacity-100 group-hover/user:visible transition-all duration-200 min-w-[200px]">
                <div className="bg-white rounded-xl shadow-xl border border-green-100 overflow-hidden py-1">
                  <div className="px-4 py-3 border-b border-gray-100 sm:hidden">
                    <p className="text-sm font-medium text-gray-900 truncate">{user.user_metadata?.full_name || user.email}</p>
                  </div>
                  <button onClick={handleLogout} className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                    Đăng xuất
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link href="/login" className="hidden sm:inline-flex items-center gap-1.5 bg-green-50 text-green-800 hover:bg-green-100 text-sm font-semibold px-4 py-2 rounded-full transition-all">
              Đăng nhập
            </Link>
          )}

          <Link href="/products" className="hidden lg:inline-flex items-center gap-1.5 bg-green-800 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-full transition-all hover:shadow-lg hover:shadow-green-900/30 hover:-translate-y-0.5">
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
          {!user && (
            <Link href="/login" className="text-green-800 font-semibold border-t border-gray-100 pt-4" onClick={() => setMobileMenuOpen(false)}>Đăng nhập</Link>
          )}
        </div>
      )}
    </nav>
  );
}
