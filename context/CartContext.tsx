"use client";

import { createContext, useContext, useState, useCallback, type ReactNode } from "react";

export interface GiftBoxItem {
  productId: number;
  quantity: number;
}

export interface GiftBox {
  id: string;
  type: "gift-box";
  items: GiftBoxItem[];
  totalPrice: number;
  createdAt: Date;
  icon?: string;  // Visual icon for display
}

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

export type CartElement = CartItem | GiftBox;

type AddItemPayload = Omit<CartItem, "qty">;

interface CartContextType {
  items: CartElement[];
  isOpen: boolean;
  count: number;
  total: number;
  addItem: (payload: AddItemPayload) => void;
  addGiftBox: (giftBox: GiftBox) => void;
  removeItem: (id: number | string) => void;
  updateQty: (id: number | string, qty: number) => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartElement[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const addItem = useCallback((payload: AddItemPayload) => {
    setItems(prev => {
      const existing = prev.find(i => 'qty' in i && i.id === payload.id);
      if (existing && 'qty' in existing) {
        return prev.map(i => 'qty' in i && i.id === payload.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...payload, qty: 1 }];
    });
    setIsOpen(true);
  }, []);

  const addGiftBox = useCallback((giftBox: GiftBox) => {
    setItems(prev => [...prev, giftBox]);
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((id: number | string) => {
    setItems(prev => prev.filter(i => ('id' in i ? i.id : '') !== id));
  }, []);

  const updateQty = useCallback((id: number | string, qty: number) => {
    if (qty <= 0) { removeItem(id); return; }
    setItems(prev => prev.map(i => {
      if ('qty' in i && i.id === id) {
        return { ...i, qty };
      }
      return i;
    }));
  }, [removeItem]);

  const count = items.reduce((sum, i) => {
    if ('qty' in i) return sum + i.qty;
    return sum + i.items.reduce((s, gi) => s + gi.quantity, 0);
  }, 0);

  const total = items.reduce((sum, i) => {
    if ('qty' in i) return sum + i.priceNum * i.qty;
    return sum + i.totalPrice;
  }, 0);

  return (
    <CartContext.Provider value={{
      items, isOpen, count, total,
      addItem, addGiftBox, removeItem, updateQty,
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
