"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import NavBar from "@/components/home/NavBar";
import { PRODUCTS } from "@/lib/data";
import ProductList from "@/components/products/ProductList";
import GiftBoxArea from "@/components/products/GiftBoxArea";
import PromotionBanner from "@/components/products/PromotionBanner";
import Footer from "@/components/home/Footer";
import type { Product } from "@/lib/data";
import type { GiftBoxItem as GiftBoxItemType } from "@/components/products/GiftBoxArea";

// ── Gift box style options ──
const GIFT_BOX_STYLES = [
  { id: "moc-mac",    label: "Mộc mạc",    emoji: "🌿", desc: "Tự nhiên, mộc mạc" },
  { id: "sang-trong", label: "Sang trọng",  emoji: "✨", desc: "Cao cấp, tinh tế" },
  { id: "don-gian",   label: "Đơn giản",    emoji: "🎀", desc: "Gọn gàng, tinh gọn" },
  { id: "thanh-lich", label: "Thanh lịch",  emoji: "🎁", desc: "Nhã nhặn, thanh lịch" },
];

export default function CreateGiftBoxClient({ products }: { products: Product[] }) {
  const router = useRouter();
  const { addGiftBox } = useCart();
  const [giftBoxItems, setGiftBoxItems] = useState<GiftBoxItemType[]>([]);
  const [isDragOverBox, setIsDragOverBox] = useState(false);
  const [draggedProduct, setDraggedProduct] = useState<Product | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [lastAddedId, setLastAddedId] = useState<number | string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState(GIFT_BOX_STYLES[0].id);

  // Discount logic: ≥5 total items
  const totalQuantity = giftBoxItems.reduce(
    (sum, item) => sum + item.quantity,
    0,
  );
  const isDiscountApplied = totalQuantity >= 5;
  const selectedProductIds = giftBoxItems.map((item) => item.product.id);

  // Confetti effect when first item added
  useEffect(() => {
    if (giftBoxItems.length === 1) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [giftBoxItems.length]);

  // ── Shared logic: add a product to the gift box ──
  const addProductToBox = useCallback((product: Product) => {
    setLastAddedId(product.id);
    setGiftBoxItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item,
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setTimeout(() => setLastAddedId(null), 400);
  }, []);

  // ── Drag & drop handlers ──
  const handleProductDragStart = (
    product: Product,
    e: React.DragEvent<HTMLDivElement>,
  ) => {
    setDraggedProduct(product);
    e.dataTransfer.effectAllowed = "copy";
    e.dataTransfer.setData("product", JSON.stringify(product));
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    setIsDragOverBox(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (e.currentTarget === e.target) {
      setIsDragOverBox(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOverBox(false);

    try {
      const productData = e.dataTransfer.getData("product");
      if (!productData) return;

      const product = JSON.parse(productData) as Product;
      addProductToBox(product);
      setDraggedProduct(null);
    } catch (error) {
      console.error("Error parsing dropped product:", error);
    }
  };

  // ── Click-to-add handler ──
  const handleProductClick = useCallback((product: Product) => {
    addProductToBox(product);
  }, [addProductToBox]);

  const getOriginalTotalPrice = () => {
    return giftBoxItems.reduce(
      (sum, item) => sum + item.product.priceNum * item.quantity,
      0,
    );
  };

  const getFinalTotalPrice = () => {
    const original = getOriginalTotalPrice();
    return isDiscountApplied ? original * 0.9 : original;
  };

  const handleAddToCart = () => {
    if (giftBoxItems.length === 0) {
      alert("Vui lòng thêm sản phẩm vào gói quà!");
      return;
    }

    const giftBoxId = `gift-box-${Date.now()}`;

    addGiftBox({
      id: giftBoxId,
      type: "gift-box",
      items: giftBoxItems.map((item) => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
      totalPrice: getFinalTotalPrice(),
      createdAt: new Date(),
      icon: "🎁",
      style: selectedStyle,
    });

    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
      setGiftBoxItems([]);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white">
      <NavBar />

      {/* Banner Section */}
      <div className="bg-green-50">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-4 text-green-600 text-sm">
            <button
              onClick={() => router.push("/")}
              className="hover:text-green-900 transition-colors"
            >
              Trang chủ
            </button>
            <span className="text-green-600">/</span>
            <span className="text-green-900 font-semibold">Tạo Gói Quà</span>
          </div>

          {/* Title and Description */}
          <h1 className="text-4xl font-bold text-green-900 mb-2">
            Tạo Gói Quà
          </h1>
          <p className="text-green-600 text-base">
            Kéo và thả hoặc nhấp vào sản phẩm yêu thích để tạo một gói quà độc
            đáo
          </p>
        </div>
      </div>

      <div className="pt-4">
        {/* Header with Back Button - now only serves as spacing */}
        <div className="max-w-7xl mx-auto px-5 sm:px-8 mb-6"></div>

        {/* Confetti Effect */}
        {showConfetti && (
          <div className="fixed inset-0 pointer-events-none z-50">
            {Array.from({ length: 30 }).map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 animate-bounce"
                style={{
                  left: Math.random() * 100 + "%",
                  top: Math.random() * 50 + "%",
                  backgroundColor: ["#22c55e", "#16a34a", "#4ade80", "#dcfce7"][
                    Math.floor(Math.random() * 4)
                  ],
                  animation: `confetti-fall 2s ease-out forwards`,
                  animationDelay: `${Math.random() * 0.5}s`,
                }}
              />
            ))}
            <style>{`
              @keyframes confetti-fall {
                to {
                  transform: translateY(100vh) rotate(360deg);
                  opacity: 0;
                }
              }
            `}</style>
          </div>
        )}

        {/* Success Message */}
        {showSuccessMessage && (
          <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-bounce">
            ✓ Gói quà đã được thêm vào giỏ hàng!
          </div>
        )}

        {/* ── Tips Section — compact redesign ── */}
        <div className="max-w-7xl mx-auto px-5 sm:px-8 mb-6">
          <div
            className="rounded-xl px-5 py-3 flex flex-wrap items-center gap-x-6 gap-y-2"
            style={{
              background: "linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%)",
              border: "1px solid rgba(201,222,202,0.40)",
            }}
          >
            <span className="text-sm font-semibold" style={{ color: "#2f5632" }}>
              💡 Mẹo:
            </span>
            <span className="text-xs" style={{ color: "#4d8550" }}>
              🎯 Nhấp hoặc kéo sản phẩm vào gói quà
            </span>
            <span className="text-xs hidden sm:inline" style={{ color: "#9dc49e" }}>·</span>
            <span className="text-xs" style={{ color: "#4d8550" }}>
              📦 Dùng nút +/− để chỉnh số lượng
            </span>
            <span className="text-xs hidden sm:inline" style={{ color: "#9dc49e" }}>·</span>
            <span className="text-xs" style={{ color: "#4d8550" }}>
              ✨ Mua 5 sản phẩm — giảm 10%
            </span>
            <span className="text-xs hidden sm:inline" style={{ color: "#9dc49e" }}>·</span>
            <span className="text-xs" style={{ color: "#4d8550" }}>
              🎁 Nhấn "Thêm vào giỏ" để hoàn tất
            </span>
          </div>
        </div>

        {/* Main Layout */}
        <div className="max-w-7xl mx-auto px-5 sm:px-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
            {/* Left Side - Product List (2 columns) */}
            <div className="lg:col-span-2 rounded-lg border border-gray-200 shadow-sm overflow-hidden bg-white">
              <ProductList
                products={products}
                onProductDragStart={handleProductDragStart}
                onProductClick={handleProductClick}
                selectedProductIds={selectedProductIds}
              />
            </div>

            {/* Right Side - Style + Promotion + Gift Box Area (1 column) */}
            <div className="flex flex-col gap-4 min-h-0">
              {/* ── Gift Box Style Selector ── */}
              <div className="shrink-0">
                <h3
                  className="text-xs font-semibold mb-2 uppercase tracking-wide"
                  style={{ color: "#6fa470" }}
                >
                  Phong cách gói quà
                </h3>
                <div className="grid grid-cols-4 gap-2">
                  {GIFT_BOX_STYLES.map((style) => {
                    const isActive = selectedStyle === style.id;
                    return (
                      <button
                        key={style.id}
                        onClick={() => setSelectedStyle(style.id)}
                        className="relative rounded-xl py-2.5 px-1 flex flex-col items-center gap-1 transition-all duration-200"
                        style={{
                          background: isActive
                            ? "linear-gradient(135deg, #2f5632, #4d8550)"
                            : "rgba(255,255,255,0.90)",
                          border: isActive
                            ? "1.5px solid #2f5632"
                            : "1px solid rgba(201,222,202,0.40)",
                          boxShadow: isActive
                            ? "0 4px 16px rgba(47,86,50,0.20)"
                            : "0 1px 4px rgba(47,86,50,0.05)",
                          color: isActive ? "#faf8f4" : "#2f5632",
                          transform: isActive ? "translateY(-1px)" : "none",
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.borderColor = "rgba(157,196,158,0.60)";
                            e.currentTarget.style.boxShadow = "0 3px 12px rgba(47,86,50,0.12)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive) {
                            e.currentTarget.style.borderColor = "rgba(201,222,202,0.40)";
                            e.currentTarget.style.boxShadow = "0 1px 4px rgba(47,86,50,0.05)";
                          }
                        }}
                      >
                        <span className="text-lg">{style.emoji}</span>
                        <span className="text-[10px] font-semibold leading-tight">
                          {style.label}
                        </span>
                        {/* Active indicator dot */}
                        {isActive && (
                          <div
                            className="absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-white"
                            style={{ background: "#22c55e" }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Promotion Banner */}
              <div className="shrink-0">
                <PromotionBanner
                  itemCount={totalQuantity}
                  isDiscountActive={isDiscountApplied}
                />
              </div>
              {/* Gift Box */}
              <div className="rounded-lg border border-gray-200 shadow-sm overflow-hidden bg-white flex-1 min-h-0">
                <GiftBoxArea
                  items={giftBoxItems}
                  onItemsChange={setGiftBoxItems}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  isDragOver={isDragOverBox}
                  isDiscountActive={isDiscountApplied}
                  lastAddedId={lastAddedId}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="max-w-7xl mx-auto px-5 sm:px-8 mb-12">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
            <button
              onClick={() => setGiftBoxItems([])}
              className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Xóa Tất Cả
            </button>
            <button
              onClick={handleAddToCart}
              disabled={giftBoxItems.length === 0}
              className="px-8 py-3 bg-gradient-to-r from-green-800 to-emerald-700 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-green-900/30 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              🎁 Thêm Gói Quà Vào Giỏ Hàng
              {giftBoxItems.length > 0 && (
                <span className="bg-white/20 px-2 py-1 rounded text-sm font-semibold">
                  {giftBoxItems.reduce((s, i) => s + i.quantity, 0)} mục
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
      `}</style>
      <Footer />
    </div>
  );
}
