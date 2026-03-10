"use client";

import Link from "next/link";
import { CATEGORIES } from "@/lib/data";
import AnnouncementBar from "@/components/home/AnnouncementBar";
import NavBar from "@/components/home/NavBar";
import Footer from "@/components/home/Footer";

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-white">
      <AnnouncementBar />
      <NavBar />

      {/* Page Header */}
      <div className="bg-green-50 border-b border-green-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-12 text-center">
          <nav className="flex justify-center items-center gap-2 text-sm text-green-500 mb-4">
            <Link href="/" className="hover:text-green-800 transition-colors">Trang chủ</Link>
            <span className="text-green-300">/</span>
            <span className="text-green-800 font-medium">Danh Mục</span>
          </nav>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-green-900 mb-3">Khám Phá Danh Mục</h1>
          <p className="text-green-600 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Tất cả đặc sản Sơn La phân loại rõ ràng — từ thịt hun khói đến trái cây mùa vụ ngọt lành.
          </p>
        </div>
      </div>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-6 sm:px-10 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-7">
          {CATEGORIES.map((cat) => (
            <Link key={cat.id} href={`/products?cat=${cat.id}`} className="group block">
              <div className="bg-white rounded-3xl overflow-hidden border border-green-100 hover:border-green-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                {/* Gradient Banner */}
                <div className={`h-56 bg-linear-to-br ${cat.grad} relative flex items-center justify-between px-8`}>
                  <div className="absolute inset-0 bg-black/15 group-hover:bg-black/5 transition-colors duration-300"/>
                  <div className="relative z-10">
                    <span className="text-5xl drop-shadow">{cat.icon}</span>
                    <h2 className="text-2xl font-extrabold text-white mt-3 leading-snug">{cat.label}</h2>
                    <p className="text-white/70 text-sm mt-1">{cat.subtitle}</p>
                  </div>
                  <div className="relative z-10 flex flex-col items-end gap-3">
                    <span className="bg-white/20 backdrop-blur-sm text-white text-sm font-semibold px-3 py-1.5 rounded-full">
                      {cat.count}
                    </span>
                    <div className="w-10 h-10 bg-white/15 backdrop-blur-sm rounded-full flex items-center justify-center text-white group-hover:bg-white/30 group-hover:translate-x-1 transition-all duration-300">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Details */}
                <div className="p-6">
                  <p className="text-green-700 text-sm leading-relaxed mb-4">{cat.desc}</p>
                  <div className="flex flex-wrap gap-2 mb-5">
                    {cat.products.map(name => (
                      <span key={name} className="bg-green-50 text-green-700 text-xs font-medium px-3 py-1 rounded-full border border-green-100 group-hover:border-green-200 transition-colors">
                        {name}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 text-green-800 font-bold text-sm group-hover:text-amber-700 transition-colors">
                    <span>Xem tất cả {cat.label.toLowerCase()}</span>
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* All Products CTA */}
        <div className="text-center mt-14 py-12 bg-green-50 rounded-3xl border border-green-100">
          <span className="text-4xl mb-4 block">🌿</span>
          <h3 className="font-extrabold text-green-900 text-2xl mb-2">Muốn xem tất cả?</h3>
          <p className="text-green-600 text-sm mb-6 max-w-sm mx-auto">Duyệt toàn bộ đặc sản Sơn La trong một trang với bộ lọc tiện lợi.</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-green-800 hover:bg-green-700 text-white font-bold px-8 py-3.5 rounded-full transition-all hover:shadow-lg hover:shadow-green-900/30 hover:-translate-y-0.5 text-sm"
          >
            Xem Tất Cả Sản Phẩm
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"/>
            </svg>
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
