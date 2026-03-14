# 🎁 Cart Display Enhancements

## Using `cartUtils.ts` for Gift Box Display

The file `/lib/cartUtils.ts` provides utility functions to properly display gift boxes in your cart drawer.

### Quick Example

Instead of:
```tsx
const { items } = useCart();

items.map(item => (
  <div key={item.id}>
    <span>{item.emoji}</span>  {/* ❌ GiftBox doesn't have emoji */}
    <span>{item.name}</span>    {/* ❌ GiftBox doesn't have name */}
  </div>
))
```

Use:
```tsx
import { 
  isGiftBox, 
  getDisplayName, 
  getDisplayIcon, 
  getQuantity,
  getPriceDisplay,
  getGiftBoxSummary
} from "@/lib/cartUtils";

const { items } = useCart();

items.map(item => (
  <div key={item.id}>
    <span className="text-2xl">{getDisplayIcon(item)}</span>
    <span className="font-semibold">{getDisplayName(item)}</span>
    
    {isGiftBox(item) ? (
      <p className="text-sm text-gray-600">
        {getGiftBoxSummary(item)}
      </p>
    ) : (
      <span className="text-gray-600">×{item.qty}</span>
    )}
    
    <span className="font-bold">{getPriceDisplay(item)}</span>
  </div>
))
```

## Updated CartDrawer Example

Here's how to update your CartDrawer component to handle both regular items and gift boxes:

```tsx
"use client";

import { useCart } from "@/context/CartContext";
import {
  isGiftBox,
  getDisplayName,
  getDisplayIcon,
  getQuantity,
  getPriceDisplay,
  getGiftBoxSummary,
  getGiftBoxProductsInfo,
} from "@/lib/cartUtils";

export default function CartDrawer() {
  const { items, removeItem, updateQty } = useCart();

  return (
    <div className="cart-drawer">
      <h2 className="text-2xl font-bold mb-4">Giỏ Hàng</h2>
      
      {items.length === 0 ? (
        <p className="text-gray-500">Giỏ hàng trống</p>
      ) : (
        <div className="space-y-4">
          {items.map(item => (
            <div
              key={item.id}
              className="border rounded-lg p-4 flex gap-4"
            >
              {/* Icon */}
              <div className="text-4xl">
                {getDisplayIcon(item)}
              </div>

              {/* Info */}
              <div className="flex-1">
                <h3 className="font-bold text-lg">
                  {getDisplayName(item)}
                </h3>

                {isGiftBox(item) ? (
                  <div className="mt-2 space-y-1 text-sm">
                    {/* Show gift box items summary */}
                    <p className="text-gray-600">
                      {getGiftBoxSummary(item)}
                    </p>
                    
                    {/* Show individual items */}
                    <div className="text-xs text-gray-500 space-y-1">
                      {getGiftBoxProductsInfo(item).map((info, idx) => (
                        <div key={idx}>
                          {info.product?.name} × {info.quantity}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Regular item */
                  <p className="text-gray-600 text-sm">
                    {item.weight}
                  </p>
                )}
              </div>

              {/* Price */}
              <div className="text-right">
                <p className="font-bold text-lg">
                  {getPriceDisplay(item)}
                </p>

                {/* Quantity */}
                <div className="flex gap-2 mt-2">
                  {isGiftBox(item) ? (
                    <span className="text-sm text-gray-600">
                      {getQuantity(item)} mục
                    </span>
                  ) : (
                    <div className="flex items-center gap-1 bg-gray-100 rounded">
                      <button
                        onClick={() => updateQty(item.id, item.qty - 1)}
                        className="px-2 py-1"
                      >
                        −
                      </button>
                      <span className="px-2">{item.qty}</span>
                      <button
                        onClick={() => updateQty(item.id, item.qty + 1)}
                        className="px-2 py-1"
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>

                {/* Remove */}
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-red-600 text-sm mt-2 hover:underline"
                >
                  Xóa
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Total */}
      {items.length > 0 && (
        <div className="mt-6 pt-4 border-t">
          <div className="flex justify-between text-lg font-bold mb-4">
            <span>Tổng:</span>
            <span className="text-green-800">
              {(items.reduce((sum, i) => {
                return sum + (isGiftBox(i) ? i.totalPrice : i.priceNum * i.qty);
              }, 0) / 1000).toFixed(0)}k đ
            </span>
          </div>
          <button className="w-full bg-green-800 text-white py-3 rounded-lg font-bold">
            Thanh Toán
          </button>
        </div>
      )}
    </div>
  );
}
```

## Utility Functions Reference

### `isGiftBox(item: CartElement): boolean`
Check if an item is a gift box.

### `isCartItem(item: CartElement): boolean`
Check if an item is a regular cart item.

### `getDisplayName(item: CartElement): string`
Get display name:
- Gift box: `"Gói Quà (3 sản phẩm)"`
- Regular: product name

### `getDisplayIcon(item: CartElement): string`
Get icon:
- Gift box: `"🎁"`
- Regular: product emoji

### `getQuantity(item: CartElement): number`
Get item quantity:
- Gift box: sum of all items inside
- Regular: qty

### `getPrice(item: CartElement): number`
Get total price in VND.

### `getPriceDisplay(item: CartElement): string`
Get formatted price: `"305k đ"`

### `getGiftBoxProductsInfo(giftBox: GiftBox)`
Get product details for all items in gift box.

### `getGiftBoxSummary(giftBox: GiftBox): string`
Get emoji summary: `"🥩×2, 🍯×1"`

## Key Points

✅ Gift boxes now show 🎁 icon  
✅ Gift box name shows product count: "Gói Quà (3 sản phẩm)"  
✅ Quantity shows individual items inside: "3 mục" (not "1 box")  
✅ Hover/expand shows specific items and quantities  
✅ Price displays correctly (total of all items)

## Cart Count Behavior

**Example: 1 regular item + 1 gift box with 3 items inside**

- Regular item: qty = 1
- Gift box: qty = 3 (sum of items)
- **Cart display**: "4 sản phẩm" ✓

This is now correctly calculated in CartContext:
```tsx
const count = items.reduce((sum, i) => {
  if ('qty' in i) return sum + i.qty;              // Regular: 1
  return sum + i.items.reduce((s, gi) => s + gi.quantity, 0); // GiftBox: 3
}, 0);  // Total: 4
```

## Testing

1. Add a regular product to cart
2. Create and add a gift box with multiple products
3. Check cart displays both items correctly
4. Verify count shows total items (not box count)
5. Verify gift box shows 🎁 icon
6. Verify gift box name shows item count
