"use client";

import { useState, useMemo } from "react";
import type { Product } from "@/lib/data";

const ITEMS_PER_PAGE = 12;

interface ProductListProps {
  products: Product[];
  onProductDragStart: (product: Product, e: React.DragEvent<HTMLDivElement>) => void;
}

export default function ProductList({
  products,
  onProductDragStart,
}: ProductListProps) {
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                           p.desc.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = !selectedCategory || p.categoryId === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, selectedCategory]);

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    page * ITEMS_PER_PAGE,
    (page + 1) * ITEMS_PER_PAGE
  );

  const categories = Array.from(new Set(products.map(p => p.categoryId)))
    .map(catId => {
      const product = products.find(p => p.categoryId === catId);
      return { id: catId, label: product?.category, icon: product?.emoji };
    });

  return (
    <div className="flex flex-col h-full border-r border-gray-200 bg-gray-50">
      {/* Search Bar */}
      <div className="p-4 border-b border-gray-200 bg-white sticky top-0 z-10">
        <input
          type="text"
          placeholder="Tìm kiếm sản phẩm..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(0);
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Category Filter */}
      <div className="px-4 py-3 border-b border-gray-200 bg-white overflow-x-auto flex gap-2">
        <button
          onClick={() => {
            setSelectedCategory(null);
            setPage(0);
          }}
          className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
            selectedCategory === null
              ? "bg-green-800 text-white"
              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          Tất Cả
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            onClick={() => {
              setSelectedCategory(cat.id);
              setPage(0);
            }}
            className={`px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
              selectedCategory === cat.id
                ? "bg-green-800 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="grid grid-cols-2 gap-3">
          {paginatedProducts.map(product => (
            <div
              key={product.id}
              draggable
              onDragStart={(e) => onProductDragStart(product, e)}
              className="bg-white rounded-lg border border-gray-200 p-3 cursor-grab active:cursor-grabbing hover:shadow-lg hover:border-green-300 transition-all group"
            >
              {/* Product Emoji */}
              <div
                className="w-full h-20 flex items-center justify-center bg-gradient-to-br rounded-lg mb-2 group-hover:scale-105 transition-transform text-4xl"
                style={{ backgroundImage: `linear-gradient(135deg, var(--tw-gradient-stops))` }}
              >
                {product.emoji}
              </div>

              {/* Product Info */}
              <h3 className="font-semibold text-sm text-gray-900 line-clamp-2">
                {product.name}
              </h3>
              <p className="text-xs text-gray-600 line-clamp-2 my-1">
                {product.desc}
              </p>

              {/* Price and Weight */}
              <div className="flex items-center justify-between mt-2">
                <span className="font-bold text-green-800 text-sm">
                  {product.price}
                </span>
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                  {product.weight}
                </span>
              </div>

              {/* Badge */}
              {product.badge && (
                <span className="text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-0.5 rounded mt-1 inline-block">
                  {product.badge}
                </span>
              )}

              {/* Drag Hint */}
              <div className="text-xs text-gray-500 mt-2 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                Kéo để thêm
              </div>
            </div>
          ))}
        </div>

        {paginatedProducts.length === 0 && (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>Không có sản phẩm nào</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="px-4 py-3 border-t border-gray-200 bg-white flex items-center justify-between sticky bottom-0">
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            className="px-3 py-1 text-sm font-medium rounded border border-gray-300 disabled:opacity-50 hover:bg-gray-50"
          >
            Trước
          </button>
          <span className="text-sm text-gray-600">
            {page + 1} / {totalPages}
          </span>
          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            className="px-3 py-1 text-sm font-medium rounded border border-gray-300 disabled:opacity-50 hover:bg-gray-50"
          >
            Tiếp
          </button>
        </div>
      )}
    </div>
  );
}
