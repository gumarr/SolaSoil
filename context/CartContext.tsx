"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export interface CartItem {
  id: number;
  name: string;
  priceNum: number;
  priceLabel: string;
  weight: string;
  emoji: string;
  grad: string;
  qty: number;
}

type AddItemPayload = Omit<CartItem, "qty">;

interface CartContextType {
  items: CartItem[];
  isOpen: boolean;
  count: number;
  total: number;
  addItem: (payload: AddItemPayload) => void;
  removeItem: (id: number) => void;
  updateQty: (id: number, qty: number) => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCallback((payload: AddItemPayload) => {
    setItems(prev => {
      const existing = prev.find(i => i.id === payload.id);
      if (existing) return prev.map(i => i.id === payload.id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...payload, qty: 1 }];
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((id: number) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []);

  const updateQty = useCallback((id: number, qty: number) => {
    if (qty <= 0) { removeItem(id); return; }
    setItems(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  }, [removeItem]);

  const count = items.reduce((sum, i) => sum + i.qty, 0);
  const total = items.reduce((sum, i) => sum + i.priceNum * i.qty, 0);

  return (
    <CartContext.Provider value={{
      items, isOpen, count, total,
      addItem, removeItem, updateQty,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
