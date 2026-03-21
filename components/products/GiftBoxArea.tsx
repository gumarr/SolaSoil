"use client";

import { useState } from "react";
import type { Product } from "@/lib/data";
import { Trash } from "@phosphor-icons/react";

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
  const getTotalPrice = () => {
    return items.reduce((sum, item) => sum + item.product.priceNum * item.quantity, 0);
  };

  const getTotalWeight = () => {
    return items.reduce((sum, item) => {
      const weight = parseFloat(item.product.weight);
      return sum + (isNaN(weight) ? 0 : weight * item.quantity);
    }, 0);
  };

  const handleRemoveItem = (productId: number) => {
    onItemsChange(items.filter(item => item.product.id !== productId));
  };

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveItem(productId);
      return;
    }
    onItemsChange(
      items.map(item =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const handleClear = () => {
    onItemsChange([]);
  };

  return (
    <div
      onDragOver={onDragOver}
      onDrop={onDrop}
      className={`flex flex-col h-full border-l border-gray-200 transition-all ${
        isDragOver ? "bg-green-50" : "bg-white"
      }`}
    >
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-bold text-gray-900">Gói Quà Của Bạn</h2>
        <p className="text-sm text-gray-600">
          {items.length} loại · {items.reduce((s, i) => s + i.quantity, 0)} mục
        </p>
      </div>

      {/* Empty State */}
      {items.length === 0 ? (
        <div
          className={`flex-1 flex flex-col items-center justify-center p-8 text-center transition-colors ${
            isDragOver
              ? "bg-green-100 border-2 border-dashed border-green-400"
              : "bg-gray-50 border-2 border-dashed border-gray-300"
          }`}
        >
          <div className="text-5xl mb-3">🎁</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-1">
            Tạo Gói Quà Của Bạn
          </h3>
          <p className="text-sm text-gray-600">
            Kéo sản phẩm vào đây để tạo gói quà
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Hoặc nhấp vào "Thêm" trên sản phẩm
          </p>
        </div>
      ) : (
        <>
          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {items.map(item => (
              <div
                key={item.product.id}
                className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-3 border border-green-200 hover:shadow-md transition-shadow"
              >
                {/* Item Header */}
                <div className="flex items-start gap-3 mb-2">
                  <div className="text-3xl">{item.product.emoji}</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 text-sm">
                      {item.product.name}
                    </h4>
                    <p className="text-xs text-gray-600">
                      {item.product.weight}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRemoveItem(item.product.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors p-1"
                    title="Xóa"
                  >
                    <Trash size={18} weight="regular" />
                  </button>
                </div>

                {/* Price */}
                <div className="text-sm font-bold text-green-800 mb-3">
                  {item.product.price}
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2 bg-white rounded border border-gray-300">
                  <button
                    onClick={() => handleUpdateQuantity(item.product.id, item.quantity - 1)}
                    className="px-2 py-1 text-gray-600 hover:bg-gray-100 font-bold"
                  >
                    −
                  </button>
                  <span className="flex-1 text-center font-semibold text-gray-900">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleUpdateQuantity(item.product.id, item.quantity + 1)}
                    className="px-2 py-1 text-gray-600 hover:bg-gray-100 font-bold"
                  >
                    +
                  </button>
                </div>

                {/* Item Total — fixed format */}
                <div className="text-xs text-gray-600 mt-2">
                  Tổng:{" "}
                  <span className="font-bold text-green-800">
                    {(item.product.priceNum * item.quantity).toLocaleString("vi-VN")}đ
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Summary — fixed format */}
          <div className="border-t border-gray-200 p-4 bg-gray-50 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Tổng khối lượng:</span>
              <span className="font-semibold text-gray-900">
                {getTotalWeight() >= 1000
                  ? `${(getTotalWeight() / 1000).toFixed(2)} kg`
                  : `${getTotalWeight().toFixed(0)} g`}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Số mục:</span>
              <span className="font-semibold text-gray-900">
                {items.reduce((s, i) => s + i.quantity, 0)}
              </span>
            </div>
            <div className="pt-2 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-base font-bold text-gray-900">Tổng giá:</span>
                <span className="text-lg font-bold text-green-800">
                  {getTotalPrice().toLocaleString("vi-VN")}đ
                </span>
              </div>
            </div>
            <button
              onClick={handleClear}
              className="w-full mt-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-200 rounded border border-gray-300 transition-colors flex items-center justify-center gap-1.5"
            >
              <Trash size={14} weight="regular" />
              Xóa Tất Cả
            </button>
          </div>
        </>
      )}
    </div>
  );
}