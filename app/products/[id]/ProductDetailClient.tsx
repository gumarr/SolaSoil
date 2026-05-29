"use client";

import { useState } from "react";
import Link from "next/link";
import { useCart } from "@/context/CartContext";
import AnnouncementBar from "@/components/home/AnnouncementBar";
import NavBar from "@/components/home/NavBar";
import Footer from "@/components/home/Footer";
import LensImage from "@/components/ui/LensImage";

interface ProductDetailClientProps {
  product: {
    id: string;
    name: string;
    categoryId: string;
    category: string;
    desc: string;
    price: string;
    priceNum: number;
    weight: string;
    emoji: string;
    revealEmoji: string;
    grad: string;
    revealGrad: string;
    badge: string | null;
    image_main: string;
    image_reveal: string;
    image_thumb: string;
    detail_story?: string;
    ingredients?: string;
    usage_instructions?: string;
    benefits?: string;
  };
  relatedProducts: any[];
}

type TabType = "story" | "ingredients" | "instructions" | "benefits";

export default function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>("story");
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      priceNum: product.priceNum,
      priceLabel: product.price,
      weight: product.weight,
      emoji: product.emoji,
      grad: product.grad,
      image_thumb: product.image_thumb,
      image_main: product.image_main,
    }, quantity);
  };

  const handleQtyChange = (val: number) => {
    if (val < 1) return;
    setQuantity(val);
  };

  // Fallbacks for detail content
  const contentMap = {
    story: product.detail_story || product.desc || "Câu chuyện sản phẩm đang được cập nhật. Nông sản Tây Bắc được gieo trồng tự nhiên, chứa đựng tinh hoa núi rừng Sơn La.",
    ingredients: product.ingredients || "100% nguyên liệu tự nhiên được thu hoạch thủ công tại Sơn La. Không hương liệu nhân tạo, không hóa chất bảo quản.",
    instructions: product.usage_instructions || "Sử dụng trực tiếp hoặc dùng làm nguyên liệu gia vị chế biến món ăn gia đình. Bảo quản nơi khô ráo, thoáng mát.",
    benefits: product.benefits || "Cung cấp dinh dưỡng tự nhiên từ vùng cao nhiệt độ ôn hòa. Tốt cho sức khỏe người tiêu dùng, an toàn vệ sinh thực phẩm.",
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "var(--ivory)" }}>
      <AnnouncementBar />
      <NavBar />

      {/* ── Breadcrumbs ── */}
      <div className="bg-[#f0f4f0] border-b border-stone-200/50">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 py-5">
          <nav className="flex items-center gap-2 text-sm">
            <Link href="/" className="text-stone-400 hover:text-emerald-800 transition-colors">
              Trang chủ
            </Link>
            <span className="text-stone-300">/</span>
            <Link href="/products" className="text-stone-400 hover:text-emerald-800 transition-colors">
              Sản phẩm
            </Link>
            <span className="text-stone-300">/</span>
            <Link 
              href={`/products?cat=${product.categoryId}`} 
              className="text-stone-400 hover:text-emerald-800 transition-colors"
            >
              {product.category}
            </Link>
            <span className="text-stone-300">/</span>
            <span className="font-semibold text-emerald-950 truncate max-w-[200px] sm:max-w-none">
              {product.name}
            </span>
          </nav>
        </div>
      </div>

      {/* ── Main Detail Section ── */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 sm:px-10 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 xl:gap-14 items-start">
          
          {/* Left Column: Image Zoom */}
          <div className="lg:col-span-5 w-full">
            <div className="relative group">
              <LensImage
                mainImage={product.image_main}
                revealImage={product.image_reveal || product.image_main}
                baseGrad={product.grad}
                revealGrad={product.revealGrad}
                emoji={product.emoji}
                revealEmoji={product.revealEmoji}
                lensSize={200}
                alt={product.name}
                className="w-full aspect-[4/3] sm:aspect-square rounded-[2rem] overflow-hidden shadow-[0_12px_40px_rgba(47,86,50,0.08)] border border-stone-200 bg-white"
              />
              
              {product.badge && (
                <span 
                  className="absolute top-4 left-4 z-10 px-3 py-1 rounded-full text-xs font-bold shadow-md"
                  style={{
                    background: "rgba(250,248,244,0.95)",
                    color: "#9a6420",
                    backdropFilter: "blur(8px)",
                  }}
                >
                  {product.badge}
                </span>
              )}
            </div>
          </div>

          {/* Right Column: Base Product Info */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#9a6420]">
                {product.category}
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-stone-900 leading-tight">
                {product.name}
              </h1>
              
              <div className="flex flex-wrap items-center gap-4 text-sm mt-2">
                <span className="px-3 py-1 bg-stone-100 rounded-full font-medium text-stone-600 border border-stone-200/60">
                  Khối lượng: {product.weight || "N/A"}
                </span>
                <span className="px-3 py-1 bg-stone-100 rounded-full font-medium text-stone-600 border border-stone-200/60">
                  Xuất xứ: Sơn La
                </span>
              </div>
            </div>

            <div className="h-px bg-stone-200/80" />

            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-[#d4922b]">
                  {product.price}
                </span>
              </div>
              <p className="text-sm text-stone-400 font-medium">
                Giá đã bao gồm thuế VAT · Hỗ trợ giao hàng nhanh toàn quốc
              </p>
            </div>

            <p className="text-sm sm:text-base leading-relaxed text-stone-500 font-medium">
              {product.desc}
            </p>

            <div className="h-px bg-stone-200/80" />

            {/* Actions: Qty Select & Add to Cart */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              {/* Quantity selector */}
              <div className="flex items-center rounded-2xl overflow-hidden border border-stone-300 bg-white shadow-sm shrink-0">
                <button
                  onClick={() => handleQtyChange(quantity - 1)}
                  className="w-12 h-12 flex items-center justify-center font-bold text-lg hover:bg-stone-50 transition-colors"
                  style={{ color: "#4d8550" }}
                >
                  −
                </button>
                <span className="w-12 text-center font-bold text-base text-stone-900">
                  {quantity}
                </span>
                <button
                  onClick={() => handleQtyChange(quantity + 1)}
                  className="w-12 h-12 flex items-center justify-center font-bold text-lg hover:bg-stone-50 transition-colors"
                  style={{ color: "#4d8550" }}
                >
                  +
                </button>
              </div>

              {/* Add to cart button */}
              <button
                onClick={handleAddToCart}
                className="flex-1 min-w-[200px] h-12 rounded-2xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all btn-liquid shadow-[0_6px_20px_rgba(47,86,50,0.22)]"
                style={{
                  background: "linear-gradient(135deg, #2f5632, #4d8550)",
                }}
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Thêm vào Giỏ Hàng
              </button>
            </div>

          </div>
        </div>

        {/* ── Tabs Detailed Info ── */}
        <div className="mt-16 bg-white rounded-3xl border border-stone-200/60 shadow-[0_4px_24px_rgba(0,0,0,0.02)] overflow-hidden">
          {/* Tab headers */}
          <div className="flex border-b border-stone-200/80 overflow-x-auto scrollbar-hide bg-[#fcfcfc]">
            {[
              { id: "story", label: "Câu Chuyện Sản Phẩm", icon: "📖" },
              { id: "ingredients", label: "Thành Phần Tự Nhiên", icon: "🌱" },
              { id: "instructions", label: "Hướng Dẫn Sử Dụng", icon: "🍳" },
              { id: "benefits", label: "Công Dụng & Sức Khỏe", icon: "💖" },
            ].map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabType)}
                  className="flex-1 shrink-0 py-4 px-6 text-center font-bold text-sm flex items-center justify-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap"
                  style={{
                    color: active ? "#2f5632" : "#78716c",
                    borderColor: active ? "#2f5632" : "transparent",
                    background: active ? "#ffffff" : "transparent",
                  }}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          <div className="p-8 md:p-10">
            <div 
              className="text-stone-600 leading-relaxed font-medium whitespace-pre-line text-sm sm:text-base space-y-4"
            >
              {contentMap[activeTab]}
            </div>
          </div>
        </div>

        {/* ── Related Products ── */}
        {relatedProducts.length > 0 && (
          <div className="mt-20 space-y-8">
            <div className="flex items-end justify-between border-b border-stone-200/80 pb-4">
              <h2 className="text-2xl font-black text-stone-900">
                Sản Phẩm Liên Quan
              </h2>
              <Link 
                href="/products" 
                className="text-xs font-bold text-emerald-800 hover:text-emerald-950 transition-colors uppercase tracking-widest"
              >
                Xem tất cả →
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
              {relatedProducts.map((p) => (
                <div
                  key={p.id}
                  className="group rounded-2xl overflow-hidden flex flex-col card-hover"
                  style={{
                    background: "#ffffff",
                    border: "1px solid rgba(201,222,202,0.35)",
                    boxShadow: "0 2px 12px rgba(47,86,50,0.06)",
                  }}
                >
                  <div className="h-44 relative overflow-hidden">
                    <Link href={`/products/${p.id}`} className="block w-full h-full">
                      <LensImage
                        mainImage={p.image_main}
                        revealImage={p.image_reveal || p.image_main}
                        baseGrad={p.grad}
                        revealGrad={p.revealGrad}
                        emoji={p.emoji}
                        revealEmoji={p.revealEmoji}
                        lensSize={120}
                        alt={p.name}
                        className="w-full h-full"
                      >
                        {p.badge && (
                          <div className="relative z-10 p-2.5">
                            <span
                              className="px-2 py-0.5 rounded-full text-[9px] font-bold"
                              style={{
                                background: "rgba(250,248,244,0.92)",
                                color: "#9a6420",
                                backdropFilter: "blur(8px)",
                              }}
                            >
                              {p.badge}
                            </span>
                          </div>
                        )}
                      </LensImage>
                    </Link>

                    <div className="absolute inset-x-2.5 bottom-2.5 z-30">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          addItem({
                            id: p.id,
                            name: p.name,
                            priceNum: p.priceNum,
                            priceLabel: p.price,
                            weight: p.weight,
                            emoji: p.emoji,
                            grad: p.grad,
                            image_thumb: p.image_thumb,
                            image_main: p.image_main,
                          });
                        }}
                        className="w-full py-2 rounded-lg text-[10px] font-bold btn-liquid cursor-pointer"
                        style={{
                          background: "rgba(250,248,244,0.95)",
                          color: "#2f5632",
                          backdropFilter: "blur(12px)",
                          boxShadow: "0 3px 12px rgba(0,0,0,0.15)",
                        }}
                      >
                        + Thêm vào giỏ
                      </button>
                    </div>
                  </div>

                  <div className="p-3.5 flex flex-col flex-1">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-[#9a6420] mb-0.5">
                      {p.category}
                    </span>
                    <h3 className="font-bold text-xs text-stone-900 leading-snug line-clamp-1 mb-1.5 hover:text-emerald-800 transition-colors">
                      <Link href={`/products/${p.id}`}>{p.name}</Link>
                    </h3>
                    <div className="flex items-center justify-between mt-auto">
                      <span className="font-extrabold text-xs text-[#d4922b]">
                        {p.price}
                      </span>
                      <span className="text-[9px] font-bold text-[#4d8550] bg-[#4d8550]/5 px-2 py-0.5 rounded">
                        {p.weight}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>

      <Footer />
    </div>
  );
}
