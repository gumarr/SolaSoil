"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import NavBar from "@/components/home/NavBar";
import { PRODUCTS } from "@/lib/data";
import ProductList from "@/components/products/ProductList";
import GiftBoxArea from "@/components/products/GiftBoxArea";
import type { Product } from "@/lib/data";
import type { GiftBoxItem as GiftBoxItemType } from "@/components/products/GiftBoxArea";

export default function CreateGiftBox() {
  const router = useRouter();
  const { addGiftBox } = useCart();
  const [giftBoxItems, setGiftBoxItems] = useState<GiftBoxItemType[]>([]);
  const [isDragOverBox, setIsDragOverBox] = useState(false);
  const [draggedProduct, setDraggedProduct] = useState<Product | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Confetti effect when first item added
  useEffect(() => {
    if (giftBoxItems.length === 1) {
      setShowConfetti(true);
      const timer = setTimeout(() => setShowConfetti(false), 1500);
      return () => clearTimeout(timer);
    }
  }, [giftBoxItems.length]);

  const handleProductDragStart = (product: Product, e: React.DragEvent<HTMLDivElement>) => {
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
    // Only set isDragOverBox to false if leaving the drop zone entirely
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
      
      // Add item with animation
      setGiftBoxItems(prev => {
        const existing = prev.find(item => item.product.id === product.id);
        if (existing) {
          return prev.map(item =>
            item.product.id === product.id
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [...prev, { product, quantity: 1 }];
      });

      // Reset dragged product
      setDraggedProduct(null);
    } catch (error) {
      console.error("Error parsing dropped product:", error);
    }
  };

  const getTotalPrice = () => {
    return giftBoxItems.reduce((sum, item) => sum + item.product.priceNum * item.quantity, 0);
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
      items: giftBoxItems.map(item => ({
        productId: item.product.id,
        quantity: item.quantity,
      })),
      totalPrice: getTotalPrice(),
      createdAt: new Date(),
      icon: "🎁",  // Set icon for display
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
          <h1 className="text-4xl font-bold text-green-900 mb-2">Tạo Gói Quà</h1>
          <p className="text-green-600 text-base">
            Kéo và thả những sản phẩm yêu thích của bạn để tạo một gói quà độc đáo
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
                  backgroundColor: ["#22c55e", "#16a34a", "#4ade80", "#dcfce7"][Math.floor(Math.random() * 4)],
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

        {/* Main Layout */}
        <div className="max-w-7xl mx-auto px-5 sm:px-8 mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[600px]">
            {/* Left Side - Product List (2 columns) */}
            <div className="lg:col-span-2 rounded-lg border border-gray-200 shadow-sm overflow-hidden bg-white">
              <ProductList
                products={PRODUCTS}
                onProductDragStart={handleProductDragStart}
              />
            </div>

            {/* Right Side - Gift Box Area (1 column) */}
            <div className="rounded-lg border border-gray-200 shadow-sm overflow-hidden bg-white">
              <GiftBoxArea
                items={giftBoxItems}
                onItemsChange={setGiftBoxItems}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                isDragOver={isDragOverBox}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons - only one total price display here */}
        <div className="max-w-7xl mx-auto px-5 sm:px-8 mb-12">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <button
              onClick={() => setGiftBoxItems([])}
              className="px-6 py-3 border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Xóa Tất Cả
            </button>
            <div className="flex items-center gap-4">
              {giftBoxItems.length > 0 && (
                <span className="text-sm text-gray-600">
                  Tổng: <span className="font-bold text-green-800 text-base">
                    {getTotalPrice().toLocaleString("vi-VN")}đ
                  </span>
                </span>
              )}
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

        {/* Tips Section */}
        <div className="bg-green-50 border-t border-green-200 py-8">
          <div className="max-w-7xl mx-auto px-5 sm:px-8">
            <h3 className="text-lg font-bold text-green-900 mb-4">💡 Mẹo Tạo Gói Quà</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <h4 className="font-semibold text-gray-900 mb-2">🎯 Kéo Sản Phẩm</h4>
                <p className="text-sm text-gray-600">
                  Kéo bất kỳ sản phẩm nào từ danh sách bên trái vào khu vực gói quà
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <h4 className="font-semibold text-gray-900 mb-2">📦 Điều Chỉnh Số Lượng</h4>
                <p className="text-sm text-gray-600">
                  Sử dụng nút + / - để điều chỉnh số lượng sản phẩm trong gói
                </p>
              </div>
              <div className="bg-white rounded-lg p-4 border border-green-200">
                <h4 className="font-semibold text-gray-900 mb-2">✨ Hoàn Thành</h4>
                <p className="text-sm text-gray-600">
                  Nhấn nút "Thêm Gói Quà Vào Giỏ Hàng" để hoàn tất tạo gói quà
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}