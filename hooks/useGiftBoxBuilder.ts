import { useState, useCallback } from "react";
import type { Product } from "@/lib/data";

export interface GiftBoxItem {
  product: Product;
  quantity: number;
}

interface UseGiftBoxBuilderState {
  items: GiftBoxItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clear: () => void;
  getTotalPrice: () => number;
  getItemCount: () => number;
}

export function useGiftBoxBuilder(): UseGiftBoxBuilderState {
  const [items, setItems] = useState<GiftBoxItem[]>([]);

  const addItem = useCallback((product: Product) => {
    setItems(prev => {
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
  }, []);

  const removeItem = useCallback((productId: number) => {
    setItems(prev => prev.filter(item => item.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems(prev =>
      prev.map(item =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  }, [removeItem]);

  const clear = useCallback(() => {
    setItems([]);
  }, []);

  const getTotalPrice = useCallback(() => {
    return items.reduce((sum, item) => sum + item.product.priceNum * item.quantity, 0);
  }, [items]);

  const getItemCount = useCallback(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clear,
    getTotalPrice,
    getItemCount,
  };
}
