"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

export interface GiftBoxItem {
  productId: number | string;
  quantity: number;
}

export interface GiftBox {
  id: string;
  type: "gift-box";
  items: GiftBoxItem[];
  totalPrice: number;
  createdAt: Date;
  icon?: string;  // Visual icon for display
  style?: string; // Gift box style (e.g. "Sang trọng", "Mộc mạc")
}

export interface CartItem {
  id: number | string;
  name: string;
  priceNum: number;
  priceLabel: string;
  weight: string;
  emoji: string;
  grad: string;
  qty: number;
  image_thumb?: string;
  image_main?: string;
}

export type CartElement = CartItem | GiftBox;

type AddItemPayload = Omit<CartItem, "qty">;

interface CartContextType {
  items: CartElement[];
  cartItems: CartItem[];
  giftBoxes: GiftBox[];
  isOpen: boolean;
  count: number;
  total: number;
  addItem: (payload: AddItemPayload) => void;
  addGiftBox: (giftBox: GiftBox) => void;
  removeItem: (id: number | string) => void;
  updateQty: (id: number | string, qty: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
}

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartElement[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Load cart from localStorage once mounted
  useEffect(() => {
    try {
      const stored = localStorage.getItem("solasoil_cart");
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load cart from localStorage", e);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem("solasoil_cart", JSON.stringify(items));
      } catch (e) {
        console.error("Failed to save cart to localStorage", e);
      }
    }
  }, [items, isLoaded]);

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

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const cartItems = items.filter((i): i is CartItem => !('type' in i));
  const giftBoxes = items.filter((i): i is GiftBox => 'type' in i && i.type === 'gift-box');

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
      items, cartItems, giftBoxes, isOpen, count, total,
      addItem, addGiftBox, removeItem, updateQty, clearCart,
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
