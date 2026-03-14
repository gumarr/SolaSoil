# 🎁 Tạo Gói Quà (Create Gift Box) Feature

## Overview

A complete gift box creation system that allows users to build custom gift boxes by dragging and dropping products, adjusting quantities, and adding them to cart as a single item.

---

## 📁 File Structure

```
app/
├── create-gift-box/
│   └── page.tsx                    # Main gift box creation page
├── globals.css                      # Global styles & animations (updated)
│
components/
├── products/
│   ├── ProductList.tsx             # Product list with search & filters
│   ├── GiftBoxArea.tsx             # Gift box drop zone & management
│   └── ProductsView.tsx            # (Existing)
│
components/home/
├── NavBar.tsx                       # Updated with "Tạo Gói Quà" link
│
context/
├── CartContext.tsx                 # Updated to support GiftBox items
│
hooks/
├── useGiftBoxBuilder.ts            # Hook for gift box state management
├── useInView.ts                    # (Existing)
```

---

## 🏗️ Architecture & Components

### 1. **CartContext (Updated)**

Extended to support two types of cart items:

```typescript
interface GiftBox {
  id: string;
  type: "gift-box";
  items: GiftBoxItem[];
  totalPrice: number;
  createdAt: Date;
}

type CartElement = CartItem | GiftBox;
```

**New Methods:**
- `addGiftBox(giftBox: GiftBox)` - Add a complete gift box to cart

### 2. **ProductList Component**

Features:
- **Search** - Filter products by name/description
- **Category Filter** - Filter by product category
- **Pagination** - Show 12 products per page
- **Drag Support** - Each product is draggable
- **Hover Effects** - Visual feedback on hover
- **Responsive Grid** - 2 columns on small screens, scales up

```tsx
<ProductList
  products={PRODUCTS}
  onProductDragStart={handleProductDragStart}
/>
```

### 3. **GiftBoxArea Component**

Features:
- **Drop Zone** - Accepts dragged products
- **Visual Feedback** - Changes background on drag over
- **Item Management** - Display items with:
  - Product emoji/name
  - Quantity controls (±)
  - Remove button
  - Sub-total price
- **Summary** - Shows:
  - Total weight
  - Total items
  - Total price
- **Empty State** - Beautiful placeholder with instructions

```tsx
<GiftBoxArea
  items={giftBoxItems}
  onItemsChange={setGiftBoxItems}
  onDragOver={handleDragOver}
  onDrop={handleDrop}
  isDragOver={isDragOverBox}
/>
```

### 4. **useGiftBoxBuilder Hook**

Centralized state management for gift box items:

```typescript
const {
  items,           // GiftBoxItem[]
  addItem,         // (product) => void
  removeItem,      // (productId) => void
  updateQuantity,  // (productId, qty) => void
  clear,           // () => void
  getTotalPrice,   // () => number
  getItemCount,    // () => number
} = useGiftBoxBuilder();
```

### 5. **CreateGiftBox Page (Main)**

Orchestrates the entire experience:

#### Drag & Drop Flow:
1. User drags product from ProductList
2. `onProductDragStart` sets drag data
3. GiftBoxArea captures `onDragOver` / `onDrop`
4. Product added to state with animation
5. UI updates automatically

#### Add to Cart Flow:
1. User clicks "Thêm Gói Quà Vào Giỏ Hàng"
2. Creates GiftBox object with all items
3. Calls `addGiftBox()` from context
4. Shows success message
5. Clears the form

#### Special Effects:
- **Confetti** - Triggers when first product added
- **Success Toast** - Shows when added to cart
- **Auto-clear** - Form resets after adding

---

## 🎨 UX/UI Features

### Animations

**Defined in `globals.css`:**

| Animation | Usage | Effect |
|-----------|-------|--------|
| `slideInScale` | New items in gift box | Smooth scale-in entry |
| `dropBounce` | Drop action | Bounce effect on drop |
| `fadeInGrow` | General transitions | Fade + scale growth |
| `dragPulse` | Drag state | Pulsing glow on hover |
| `shimmerGlow` | Highlight on drop | Inset glow effect |

### Colors & Styling

- **Primary**: Green (#22c55e) - Matches brand
- **Hover States**: Subtle shadows and color shifts
- **Drop Zone**: Changes to light green (#dcfce7) on drag over
- **Cards**: Gradient backgrounds for visual hierarchy

### Responsive Design

```
Mobile: Single column stack
Tablet: Auto-adjust columns
Desktop: 2-column + sidebar layout
```

---

## 📊 Data Flow

### Adding a Product

```
User Drags Product
    ↓
ProductList.onDragStart
    ↓ (sets e.dataTransfer.data)
GiftBoxArea.onDrop
    ↓ (parses product)
setGiftBoxItems(prev => [...prev, {product, qty: 1}])
    ↓
UI Re-renders with new item
    ↓ (if first item)
Confetti animation triggers
```

### Converting to Cart Item

```
User Clicks "Thêm Gói Quà"
    ↓
handleAddToCart()
    ↓
Create GiftBox object:
{
  id: "gift-box-{timestamp}",
  type: "gift-box",
  items: [
    { productId: 1, quantity: 2 },
    { productId: 3, quantity: 1 }
  ],
  totalPrice: 485000,
  createdAt: Date
}
    ↓
addGiftBox(giftBox)
    ↓
CartContext adds to items[]
    ↓
Success message + auto-clear
```

---

## 🎯 Key Features Implemented

### ✅ Navigation
- Added "Tạo Gói Quà" tab in NavBar
- Links to `/create-gift-box`

### ✅ Product List
- Search functionality
- Category filtering
- Pagination (12 items/page)
- Draggable items
- Hover effects
- Responsive grid

### ✅ Drag & Drop
- Smooth drag preview
- Visual drop zone feedback
- Duplicate handling (increment quantity)
- Animation on drop

### ✅ Gift Box Management
- Add/remove items
- Adjust quantities
- View totals (price, weight, count)
- Clear all items
- Beautiful empty state

### ✅ Cart Integration
- Gift box as single cart item
- Maintains all product data
- Separate from regular items

### ✅ Animations
- Confetti on first product
- Success toast notification
- Smooth transitions
- Bounce effects
- Pulsing indicators

### ✅ Responsive Design
- Mobile-friendly
- Touch-friendly controls
- Auto-adjusting layout

---

## 💻 Code Examples

### Using the Hook

```tsx
import { useGiftBoxBuilder } from "@/hooks/useGiftBoxBuilder";

export function MyComponent() {
  const { items, addItem, removeItem, updateQuantity, getTotalPrice } = 
    useGiftBoxBuilder();

  return (
    <div>
      {items.map(item => (
        <div key={item.product.id}>
          <h3>{item.product.name}</h3>
          <span>{item.quantity}</span>
          <button onClick={() => removeItem(item.product.id)}>
            Remove
          </button>
        </div>
      ))}
      <p>Total: {getTotalPrice()}</p>
    </div>
  );
}
```

### Using Cart Context

```tsx
import { useCart } from "@/context/CartContext";

export function Component() {
  const { addGiftBox, items } = useCart();

  const handleCreateBox = () => {
    addGiftBox({
      id: `gift-box-${Date.now()}`,
      type: "gift-box",
      items: [
        { productId: 1, quantity: 2 },
      ],
      totalPrice: 250000,
      createdAt: new Date(),
    });
  };

  // Display gift boxes
  items.forEach(item => {
    if ('type' in item && item.type === 'gift-box') {
      console.log("Gift box:", item);
    }
  });
}
```

---

## 🚀 Performance Optimizations

1. **Memoization** - `useMemo` for filtered products
2. **State Optimization** - Separate drag state from UI state
3. **Lazy Rendering** - Only visible items rendered
4. **CSS Animations** - GPU-accelerated animations
5. **Event Delegation** - Single drag listeners

---

## 🎓 Best Practices Followed

✅ **Component Separation** - Each component has single responsibility

✅ **Custom Hooks** - Business logic in `useGiftBoxBuilder`

✅ **Type Safety** - Full TypeScript support

✅ **Context API** - Global state management

✅ **CSS-in-JS** - Tailwind + custom animations

✅ **Accessibility** - ARIA labels, semantic HTML

✅ **Responsive Design** - Mobile-first approach

✅ **Error Handling** - Try-catch for data parsing

✅ **UX Polish** - Animations, feedback, confirmations

✅ **Clean Code** - Well-commented, organized structure

---

## 🔄 Integration with Existing Code

The feature seamlessly integrates with:

1. **CartContext** - Extended, backward compatible
2. **NavBar** - Added new link
3. **Existing Components** - No modifications needed
4. **PRODUCTS Data** - Uses existing data structure
5. **Styling** - Uses existing Tailwind setup

---

## 📱 Browser Support

- Chrome/Edge (Latest)
- Firefox (Latest)
- Safari (Latest)
- Mobile browsers with drag support

---

## 🔜 Future Enhancements

1. **Gift Box Templates** - Pre-made selections
2. **Customization** - Add box color/wrapping
3. **Messages** - Include custom gift messages
4. **Scheduling** - Send on specific date
5. **Analytics** - Track popular combinations
6. **Reviews** - Save/share custom boxes
7. **Combo Deals** - Special pricing for boxes

---

## 🐛 Troubleshooting

### Drag not working?
- Ensure browser supports HTML5 drag-drop
- Check mobile browser - add touch handlers

### Animations stuttering?
- Check Chrome DevTools > Performance
- Reduce number of simultaneous animations
- Enable hardware acceleration

### Items not adding?
- Verify Product JSON structure matches type
- Check browser console for parsing errors
- Ensure CartContext Provider wraps all components

---

## 📝 File Purposes Reference

| File | Purpose |
|------|---------|
| `page.tsx` | Main orchestration, state mgmt, event handlers |
| `ProductList.tsx` | Product display, search, filter, paginate |
| `GiftBoxArea.tsx` | Drop zone, item display, quantity controls |
| `useGiftBoxBuilder.ts` | Pure state management hook |
| `CartContext.tsx` | Global cart state + gift box support |
| `NavBar.tsx` | Navigation with new link |
| `globals.css` | Animations and theme styles |

---

## 🎉 Summary

A comprehensive gift box creation feature with:
- Intuitive drag-and-drop interface
- Smooth animations and interactions
- Full TypeScript support
- Mobile-responsive design
- Clean, maintainable code
- Seamless cart integration
- Professional UX polish

The implementation follows React best practices and maintains the existing codebase structure.
