import type { CartItem, GiftBox } from "@/context/CartContext";
import type { Product } from "@/lib/data";
import { PRODUCTS } from "@/lib/data";

export type CartElement = CartItem | GiftBox;

/**
 * Format a numeric price to "250.000 VND" display string.
 * Uses vi-VN locale for dot-separated thousands.
 */
export function formatPrice(price: number): string {
  return `${price.toLocaleString("vi-VN")} VND`;
}

/**
 * Parse a weight/volume string to grams.
 * Handles: "1kg" → 1000, "200g" → 200, "500ml" → 500 (1ml ≈ 1g).
 * Falls back to 0 for unparseable strings.
 */
export function parseWeightToGrams(weight: string): number {
  const match = weight.trim().toLowerCase().match(/^([\d.]+)\s*(kg|g|ml)?$/);
  if (!match) return 0;

  const value = parseFloat(match[1]);
  if (isNaN(value)) return 0;

  const unit = match[2] || "g";
  switch (unit) {
    case "kg": return value * 1000;
    case "ml": return value; // 1ml ≈ 1g
    case "g":
    default:   return value;
  }
}

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
 * Get display price string for cart element — uses "X VND" format
 */
export function getPriceDisplay(item: CartElement): string {
  const price = getPrice(item);
  return formatPrice(price);
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
