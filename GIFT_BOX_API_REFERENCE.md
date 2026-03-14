# 🎁 Gift Box Feature - API Reference & Quick Guide

## 📋 Files Overview

| File | Type | Purpose |
|------|------|---------|
| `app/create-gift-box/page.tsx` | Page | Main gift box UI & orchestration |
| `components/products/ProductList.tsx` | Component | Product list with search/filter/pagination |
| `components/products/GiftBoxArea.tsx` | Component | Drop zone & item management |
| `hooks/useGiftBoxBuilder.ts` | Hook | Pure state management |
| `context/CartContext.tsx` | Context | Global cart state (updated) |
| `components/home/NavBar.tsx` | Component | Navigation (updated) |
| `app/globals.css` | CSS | Animations (updated) |

---

## 🔌 API Reference

### useGiftBoxBuilder Hook

```typescript
function useGiftBoxBuilder(): UseGiftBoxBuilderState

interface UseGiftBoxBuilderState {
  items: GiftBoxItem[];
  addItem(product: Product): void;
  removeItem(productId: number): void;
  updateQuantity(productId: number, quantity: number): void;
  clear(): void;
  getTotalPrice(): number;
  getItemCount(): number;
}
```

**Import:**
```tsx
import { useGiftBoxBuilder } from "@/hooks/useGiftBoxBuilder";
```

**Usage:**
```tsx
const { items, addItem, removeItem, updateQuantity, getTotalPrice } = useGiftBoxBuilder();
```

---

### useCart Hook (Updated)

```typescript
function useCart(): CartContextType

interface CartContextType {
  items: CartElement[];           // CartItem | GiftBox
  isOpen: boolean;
  count: number;                  // Total items
  total: number;                  // Total price
  addItem(payload: AddItemPayload): void;
  addGiftBox(giftBox: GiftBox): void;    // NEW
  removeItem(id: number | string): void;
  updateQty(id: number | string, qty: number): void;
  openCart(): void;
  closeCart(): void;
}
```

**Usage:**
```tsx
const { addGiftBox, items } = useCart();

// Add gift box
addGiftBox({
  id: `gift-box-${Date.now()}`,
  type: "gift-box",
  items: [
    { productId: 1, quantity: 2 },
    { productId: 3, quantity: 1 }
  ],
  totalPrice: 485000,
  createdAt: new Date(),
});

// Check for gift boxes
items.forEach(item => {
  if ('type' in item && item.type === 'gift-box') {
    console.log("Gift box:", item);
  }
});
```

---

### ProductList Component

```typescript
interface ProductList {
  products: Product[];
  onProductDragStart(product: Product, e: React.DragEvent): void;
}
```

**Features:**
- 🔍 Search products
- 🏷️ Filter by category
- 📄 Pagination (12 items/page)
- 🖱️ Draggable items
- ✨ Hover effects

**Usage:**
```tsx
<ProductList
  products={PRODUCTS}
  onProductDragStart={handleDragStart}
/>
```

---

### GiftBoxArea Component

```typescript
interface GiftBoxArea {
  items: GiftBoxItem[];
  onItemsChange(items: GiftBoxItem[]): void;
  onDragOver(e: React.DragEvent): void;
  onDrop(e: React.DragEvent): void;
  isDragOver: boolean;
}
```

**Features:**
- 🎁 Visual gift box container
- 📦 Add/remove items
- ➕➖ Quantity controls
- 📊 Total summary
- 🎨 Empty state placeholder

**Usage:**
```tsx
<GiftBoxArea
  items={giftBoxItems}
  onItemsChange={setGiftBoxItems}
  onDragOver={handleDragOver}
  onDrop={handleDrop}
  isDragOver={isDragOverBox}
/>
```

---

## 🎯 Type Definitions

### GiftBox

```typescript
interface GiftBox {
  id: string;                     // "gift-box-{timestamp}"
  type: "gift-box";              // Type discriminator
  items: GiftBoxItem[];           // Products in box
  totalPrice: number;             // Total cost in VND
  createdAt: Date;                // When created
}
```

### GiftBoxItem

```typescript
interface GiftBoxItem {
  productId: number;              // Product ID
  quantity: number;               // How many (≥1)
}
```

### Product (Existing)

```typescript
interface Product {
  id: number;
  name: string;
  categoryId: string;
  category: string;
  desc: string;
  price: string;                  // Display: "250.000đ"
  priceNum: number;               // Value: 250000
  weight: string;                 // "300g"
  emoji: string;                  // Product icon
  revealEmoji: string;
  grad: string;                   // Tailwind gradient
  revealGrad: string;
  badge: string | null;           // "Bán chạy" or null
}
```

---

## 🎨 Animations

All animations defined in `app/globals.css`

### Predefined Animations

| Name | Duration | Use Case |
|------|----------|----------|
| `slideInScale` | 0.3s | New items appearing |
| `dropBounce` | 0.5s | Product drop effect |
| `fadeInGrow` | 0.3s | General fade-in |
| `dragPulse` | 2s | Hover state pulse |
| `shimmerGlow` | 1s | Glow on drop |

### Apply Animations to Elements

```tsx
// HTML
<div className="animate-slide-in-scale">New item</div>

// Or with custom animation
<div style={{ animation: `dropBounce 0.5s ease-out` }}>
  Drop animation
</div>
```

---

## 🚀 Quick Start

### 1. Install (No installation needed - all files created!)

### 2. Navigate to Gift Box Page

```
URL: /create-gift-box
Button: "Tạo Gói Quà" in navbar
```

### 3. Basic Flow

```
1. User clicks "Tạo Gói Quà" in navbar
2. Page loads with ProductList (left) + GiftBoxArea (right)
3. User drags products to gift box area
4. Product appears with animation
5. User adjusts quantities if needed
6. Clicks "Thêm Gói Quà Vào Giỏ Hàng"
7. Gift box added to cart
8. Success message shows
9. Form resets
```

---

## 📊 Data Structure Examples

### Adding to Gift Box

**Before:**
```typescript
items: []
```

**After dragging 2 products:**
```typescript
items: [
  {
    product: { id: 1, name: "Thịt Gác Bếp", priceNum: 250000, ... },
    quantity: 1
  },
  {
    product: { id: 3, name: "Mật Ong Rừng", priceNum: 185000, ... },
    quantity: 2
  }
]
```

### Creating GiftBox for Cart

```typescript
{
  id: "gift-box-1710429600000",
  type: "gift-box",
  items: [
    { productId: 1, quantity: 1 },
    { productId: 3, quantity: 2 }
  ],
  totalPrice: 620000,
  createdAt: 2024-03-14T10:00:00.000Z
}
```

### Cart with Mixed Items

```typescript
[
  // Regular product item
  {
    id: 5,
    name: "Hạt Dổi",
    priceNum: 90000,
    qty: 1,
    ...
  },
  
  // Gift box item
  {
    id: "gift-box-1710429600000",
    type: "gift-box",
    items: [{ productId: 1, quantity: 1 }],
    totalPrice: 250000,
    createdAt: ...
  }
]
```

---

## 🔧 Customization Guide

### Change Confetti Count

In `/app/create-gift-box/page.tsx`:

```tsx
// Current: 30 pieces
{Array.from({ length: 30 }).map(...)}

// Change to 50:
{Array.from({ length: 50 }).map(...)}
```

### Change Pagination Size

In `/components/products/ProductList.tsx`:

```tsx
// Current: 12 items per page
const ITEMS_PER_PAGE = 12;

// Change to 20:
const ITEMS_PER_PAGE = 20;
```

### Change Animation Duration

In `/app/globals.css`:

```css
/* Current: 0.5s */
animation: dropBounce 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);

/* Change to 0.8s */
animation: dropBounce 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
```

### Change Colors

In component files - search for `from-green-800`, `bg-green-50`, etc.

```tsx
// Replace all 'green' strings with your brand color
// Example: 'emerald', 'teal', 'blue'
className="from-emerald-800 to-emerald-700"
```

---

## ✅ Features Checklist

- [x] NavBar link "Tạo Gói Quà"
- [x] Product list with search
- [x] Product filtering by category
- [x] Product pagination
- [x] Draggable products
- [x] Drag-over visual feedback
- [x] Drop into gift box
- [x] Quantity increment on duplicate
- [x] Update quantities
- [x] Remove items
- [x] Clear all items
- [x] Total price calculation
- [x] Total weight calculation
- [x] Item count
- [x] Add to cart button
- [x] Success message
- [x] Confetti animation
- [x] Drop bounce animation
- [x] Responsive design
- [x] Type safety
- [x] Empty state UI

---

## 🐛 Debugging

### Enable Console Logging

Edit `/app/create-gift-box/page.tsx`:

```tsx
// Add logging in drop handler
const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
  console.log("Drop product:", product);
  console.log("Current items:", giftBoxItems);
  // ... rest of code
};
```

### Check Type in Cart

```tsx
const { items } = useCart();

items.forEach(item => {
  console.log('type' in item ? item.type : 'regular');
});
```

### Verify Animations

In browser DevTools:
1. Press F12
2. Go to Elements tab
3. Click on animated element
4. Check "Animations" panel (or use Performance tab)

---

## 📱 Browser Compatibility

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Drag & Drop | ✅ | ✅ | ✅ | ✅ |
| CSS Animations | ✅ | ✅ | ✅ | ✅ |
| ES6 | ✅ | ✅ | ✅ | ✅ |
| React Hooks | ✅ | ✅ | ✅ | ✅ |

**Mobile Support:**
- ✅ iOS Safari (with touch handlers)
- ✅ Android Chrome
- ⚠️ Drag-drop on mobile requires additional handlers

---

## 🔒 Type Safety Tips

### Checking Item Type

```tsx
// ❌ Might fail
items.forEach(item => {
  console.log(item.name); // Could be GiftBox!
});

// ✅ Safe
items.forEach(item => {
  if ('qty' in item) {
    // It's a CartItem
    console.log(item.name);
  } else if ('type' in item && item.type === 'gift-box') {
    // It's a GiftBox
    console.log(item.items);
  }
});
```

### Creating GiftBox

```tsx
// ✅ Fully typed
const giftBox: GiftBox = {
  id: `gift-box-${Date.now()}`,
  type: "gift-box",  // Must be literal "gift-box"
  items: [
    { productId: 1, quantity: 2 }
  ],
  totalPrice: 500000,
  createdAt: new Date(),
};
```

---

## 📚 Component Tree

```
CreateGiftBox (page.tsx)
├── HeaderSection
├── ConfettiEffect (conditionally rendered)
├── SuccessMessage (conditionally rendered)
├── MainLayout
│   ├── ProductList
│   │   ├── SearchInput
│   │   ├── CategoryFilter
│   │   ├── ProductGrid
│   │   │   └── ProductCard (draggable)
│   │   └── Pagination
│   └── GiftBoxArea
│       ├── Header
│       ├── EmptyState || ItemsList
│       │   └── GiftBoxItem
│       │       ├── Emoji
│       │       ├── Info
│       │       ├── RemoveButton
│       │       └── QuantityControls
│       └── Summary
├── ActionButtons
│   ├── ClearButton
│   └── AddToCartButton
└── TipsSection
```

---

## 🎯 Next Steps

1. ✅ **Implementation Complete** - Feature is ready to use
2. 📖 **Documentation** - Review GIFT_BOX_FEATURE.md
3. 🧪 **Testing** - Follow testing checklist
4. 🎨 **Customization** - Adjust colors, animations, layout
5. 📊 **Analytics** - Add tracking for user interactions
6. 💾 **Database** - Save gift box templates if needed

---

## 🤝 Support & Troubleshooting

**Issue: Products not dragging?**
- Check browser console for errors
- Verify `onProductDragStart` is connected
- Ensure `draggable` attribute is on product div

**Issue: Items not adding to cart?**
- Verify CartProvider wraps the app
- Check `addGiftBox` is being called
- Look at console for any parsing errors

**Issue: Animations not smooth?**
- Check GPU acceleration in DevTools
- Reduce number of confetti pieces
- Monitor Performance tab for jank

---

## 📞 Integration Notes

- ✅ Compatible with existing CartContext
- ✅ Uses existing Product data structure
- ✅ Follows existing component patterns
- ✅ Uses existing Tailwind setup
- ✅ Backward compatible with regular cart items

---

## 🎉 You're Ready!

Everything is set up and ready to use. Navigate to `/create-gift-box` and start creating gift boxes!

For detailed implementation examples, see `GIFT_BOX_IMPLEMENTATION.md`

For feature overview, see `GIFT_BOX_FEATURE.md`
