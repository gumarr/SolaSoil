"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

const NAV_LINKS = [
  ["/products",        "Sản Phẩm"],
  ["/create-gift-box", "Tạo Gói Quà"],
  ["/categories",      "Danh Mục"],
  ["/about",           "Về Chúng Tôi"],
  ["/#contact",        "Liên Hệ"],
] as const;

export default function NavBar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { count, openCart } = useCart();
  const [user, setUser] = useState<User | null>(null);
  const supabase = createClient();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) =>
      setUser(session?.user ?? null)
    );
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_e, session) => setUser(session?.user ?? null)
    );
    return () => subscription.unsubscribe();
  }, [supabase.auth]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <nav
      className="sticky top-0 z-50"
      style={{
        background: "rgba(250,248,244,0.92)",
        backdropFilter: "blur(24px) saturate(180%)",
        WebkitBackdropFilter: "blur(24px) saturate(180%)",
        borderBottom: "1px solid rgba(201,222,202,0.22)",
        boxShadow: "0 2px 20px rgba(47,86,50,0.07)",
      }}
    >
      <div className="max-w-7xl mx-auto px-5 sm:px-8 flex items-center justify-between h-16">

        {/* ── Logo ── */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center
                       transition-all duration-300 group-hover:scale-110 group-hover:rotate-6"
            style={{
              background: "linear-gradient(135deg, #2f5632, #4d8550)",
              boxShadow: "0 4px 12px rgba(47,86,50,0.25)",
            }}
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
              <path d="M17 8C8 10 5.9 16.17 3.82 21H5.71C6.47 19.1 7.5 17.1 9 15.5C11.07 16.8 13.92 17 17 8z" />
            </svg>
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight leading-none block"
              style={{ color: "#1a2e1b" }}>
              Mộc Sơn
            </span>
            <span className="text-[10px] tracking-widest uppercase leading-none"
              style={{ color: "#6fa470" }}>
              Đặc Sản Sơn La
            </span>
          </div>
        </Link>

        {/* ── Desktop links ── */}
        <div className="hidden md:flex items-center gap-6">
          {NAV_LINKS.map(([href, label]) => (
            <Link
              key={label}
              href={href}
              className="relative text-sm font-medium transition-colors duration-200 group/link"
              style={{ color: "#2f5632" }}
            >
              {label}
              <span
                className="absolute -bottom-0.5 left-0 w-0 h-[1.5px] group-hover/link:w-full transition-all duration-300"
                style={{ background: "linear-gradient(90deg, #4d8550, #9dc49e)" }}
              />
            </Link>
          ))}
        </div>

        {/* ── Right actions ── */}
        <div className="flex items-center gap-2.5">

          {/* Cart */}
          <button
            onClick={openCart}
            className="relative p-2.5 rounded-xl transition-all duration-200
                       hover:bg-[rgba(47,86,50,0.07)]"
            style={{ border: "1px solid rgba(201,222,202,0.35)", color: "#2f5632" }}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4L7 13zm0 0-1.4 7h12.8M9 21a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm10 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
            </svg>
            {count > 0 && (
              <span
                className="absolute -top-1 -right-1 w-5 h-5 rounded-full
                           text-[10px] font-bold flex items-center justify-center text-white"
                style={{ background: "linear-gradient(135deg, #4d8550, #6fa470)" }}
              >
                {count}
              </span>
            )}
          </button>

          {/* Auth */}
          {user ? (
            <div className="relative group/user hidden sm:block">
              <button
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-semibold
                           transition-all duration-200 hover:bg-[rgba(47,86,50,0.07)]"
                style={{ border: "1px solid rgba(201,222,202,0.35)", color: "#2f5632" }}
              >
                <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="max-w-[90px] truncate hidden lg:block">
                  {user.user_metadata?.full_name || user.email}
                </span>
              </button>

              {/* Dropdown */}
              <div className="absolute right-0 top-full pt-2 opacity-0 invisible
                             group-hover/user:opacity-100 group-hover/user:visible
                             transition-all duration-200 w-48">
                <div
                  className="rounded-2xl overflow-hidden py-1"
                  style={{
                    background: "rgba(250,248,244,0.97)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(201,222,202,0.25)",
                    boxShadow: "0 12px 40px rgba(47,86,50,0.14)",
                  }}
                >
                  <div className="px-4 py-3"
                    style={{ borderBottom: "1px solid rgba(201,222,202,0.20)" }}>
                    <p className="text-xs font-bold truncate" style={{ color: "#2f5632" }}>
                      {user.email}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2.5 text-sm flex items-center gap-2
                               transition-colors hover:bg-red-50"
                    style={{ color: "#ef4444" }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Đăng xuất
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link
              href="/login"
              className="hidden sm:inline-flex items-center gap-1.5 px-4 py-2.5
                         rounded-xl text-sm font-semibold transition-all duration-200
                         hover:bg-[rgba(47,86,50,0.07)]"
              style={{ border: "1px solid rgba(201,222,202,0.35)", color: "#2f5632" }}
            >
              Đăng nhập
            </Link>
          )}

          {/* Primary CTA */}
          <Link
            href="/products"
            className="hidden lg:inline-flex items-center gap-2 px-5 py-2.5
                       rounded-xl text-sm font-bold btn-liquid"
            style={{
              background: "linear-gradient(135deg, #2f5632, #4d8550)",
              color: "#faf8f4",
              boxShadow: "0 4px 16px rgba(47,86,50,0.28)",
            }}
          >
            Mua Ngay
          </Link>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2.5 rounded-xl transition-all duration-200
                       hover:bg-[rgba(47,86,50,0.07)]"
            style={{ border: "1px solid rgba(201,222,202,0.35)", color: "#2f5632" }}
            onClick={() => setMobileOpen(v => !v)}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round"
                d={mobileOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>
      </div>

      {/* ── Mobile menu ── */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300"
        style={{
          maxHeight: mobileOpen ? 380 : 0,
          borderTop: mobileOpen ? "1px solid rgba(201,222,202,0.20)" : "none",
        }}
      >
        <div className="px-5 py-4 flex flex-col gap-1">
          {NAV_LINKS.map(([href, label]) => (
            <Link
              key={label}
              href={href}
              className="px-4 py-3 rounded-xl font-semibold text-sm transition-colors
                         hover:bg-[rgba(47,86,50,0.07)]"
              style={{ color: "#2f5632" }}
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </Link>
          ))}
          {!user && (
            <Link
              href="/login"
              className="mt-2 px-4 py-3 rounded-xl font-bold text-center text-sm text-white btn-liquid"
              style={{ background: "linear-gradient(135deg, #2f5632, #4d8550)" }}
              onClick={() => setMobileOpen(false)}
            >
              Đăng nhập
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}