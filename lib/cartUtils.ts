import type { CartItem, GiftBox } from "@/context/CartContext";
import type { Product } from "@/lib/data";
import { PRODUCTS } from "@/lib/data";

export type CartElement = CartItem | GiftBox;

/**
 * Check if an item is a GiftBox
 */
export function isGiftBox(item: CartElement): item is GiftBox {
  return 'type' in item && item.type === 'gift-box';
}

/**
 * Check if an item is a CartItem
 */
export function isCartItem(item: CartElement): item is CartItem {
  return 'qty' in item;
}

/**
 * Get display name for cart element
 */
export function getDisplayName(item: CartElement): string {
  if (isGiftBox(item)) {
    return `Gói Quà (${item.items.length} sản phẩm)`;
  }
  return item.name;
}

/**
 * Get display icon for cart element
 */
export function getDisplayIcon(item: CartElement): string {
  if (isGiftBox(item)) {
    return item.icon || '🎁';
  }
  return item.emoji;
}

/**
 * Get quantity for cart element
 */
export function getQuantity(item: CartElement): number {
  if (isGiftBox(item)) {
    return item.items.reduce((sum, gi) => sum + gi.quantity, 0);
  }
  return item.qty;
}

/**
 * Get price for cart element
 */
export function getPrice(item: CartElement): number {
  if (isGiftBox(item)) {
    return item.totalPrice;
  }
  return item.priceNum * item.qty;
}

/**
 * Get display price string for cart element
 * e.g. 455000 → "455.000đ"
 */
export function getPriceDisplay(item: CartElement): string {
  const price = getPrice(item);
  return `${price.toLocaleString("vi-VN")}đ`;
}

/**
 * Get product info for gift box items (for displaying in cart)
 */
export function getGiftBoxProductsInfo(giftBox: GiftBox): Array<{ product?: Product; quantity: number }> {
  return giftBox.items.map(item => ({
    product: PRODUCTS.find(p => p.id === item.productId),
    quantity: item.quantity,
  }));
}

/**
 * Get summary text for gift box (e.g., "🥩×2, 🍯×1")
 */
export function getGiftBoxSummary(giftBox: GiftBox): string {
  return giftBox.items
    .map(item => {
      const product = PRODUCTS.find(p => p.id === item.productId);
      return `${product?.emoji}×${item.quantity}`;
    })
    .join(', ');
}