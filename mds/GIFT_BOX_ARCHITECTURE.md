# 🎁 Gift Box Feature - System Architecture Diagram

## Complete System Flow

```
╔════════════════════════════════════════════════════════════════════════════╗
║                           USER INTERFACE LAYER                              ║
╠════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║  ┌─────────────────────────────────────────────────────────────────────┐   ║
║  │                    CREATE GIFT BOX PAGE                             │   ║
║  │                   (/create-gift-box/page.tsx)                       │   ║
║  │                                                                     │   ║
║  │  LEFT SIDE (50%)              │        RIGHT SIDE (50%)            │   ║
║  │  ─────────────────────────────┼────────────────────────────        │   ║
║  │                               │                                    │   ║
║  │  ProductList Component        │    GiftBoxArea Component           │   ║
║  │  ┌─────────────────────────┐  │    ┌──────────────────────────┐   │   ║
║  │  │ 🔍 Search Input         │  │    │ 🎁 Your Gift Box        │   │   ║
║  │  └─────────────────────────┘  │    ├──────────────────────────┤   │   ║
║  │                               │    │ Items: 0                 │   │   ║
║  │  [Tất Cả] [Đồ Ăn] [Gia Vị]   │    │ ──────────────────────   │   │   ║
║  │                               │    │                          │   │   ║
║  │  ┌─────────────────────────┐  │    │  ┌─ Empty State ─────┐  │   │   ║
║  │  │ 🥩 Thịt Gác Bếp         │  │ → │  │                    │  │   │   ║
║  │  │ 250k | 300g             │  │ (drag) │  🎁 Drag products │  │   │   ║
║  │  │ "Thịt trâu ướp mắc..."  │  │    │  │   here to create │  │   │   ║
║  │  └─────────────────────────┘  │    │  │   gift box        │  │   │   ║
║  │                               │    │  │  ───────────────  │  │   │   ║
║  │  ┌─────────────────────────┐  │    │  └──────────────────┘  │   │   ║
║  │  │ 🍯 Mật Ong Rừng         │  │    │                          │   │   ║
║  │  │ 185k | 500ml            │  │    │ [Clear All]              │   │   ║
║  │  │ "Mật ong nguyên chất"   │  │    │                          │   │   ║
║  │  └─────────────────────────┘  │    │ Total: 0 đ               │   │   ║
║  │                               │    └──────────────────────────┘   │   ║
║  │  [Prev] 1/3 [Next]            │                                    │   ║
║  │                               │                                    │   ║
║  └─────────────────────────────────────────────────────────────────────┘   ║
║                                                                              ║
║  ┌──────────────────────────────────────────────────────────────────────┐   ║
║  │ [Clear All]  [🎁 Add to Cart - 0 items]                 Total: 0 đ  │   ║
║  └──────────────────────────────────────────────────────────────────────┘   ║
║                                                                              ║
║  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐                      ║
║  │ 🎯 Drag      │  │ 📦 Adjust    │  │ ✨ Complete  │                      ║
║  │ Products     │  │ Quantities   │  │ Gift Box     │                      ║
║  └──────────────┘  └──────────────┘  └──────────────┘                      ║
║                                                                              ║
╚════════════════════════════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════════════════════════════╗
║                          COMPONENT LAYER                                    ║
╠════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║      ProductList               useGiftBoxBuilder          GiftBoxArea       ║
║    (Internal State)                 (Hook)             (Internal State)     ║
║   ┌────────────────┐          ┌──────────────┐         ┌───────────────┐   ║
║   │ - page: 0      │          │ - items[]    │         │ - items[]     │   ║
║   │ - search: ""   │   ←→     │ - addItem()  │   ←→    │ - isDragOver  │   ║
║   │ - category: "" │          │ - removeItem │         │ - onDrop()    │   ║
║   │               │          │ - updateQty  │         │ - onDragOver()│   ║
║   └────────────────┘          └──────────────┘         └───────────────┘   ║
║                                     ↑                         ↓             ║
║                                     │                         │             ║
║                        ┌────────────┴─────────────┐           │             ║
║                        │                          │           │             ║
║                        ↓                          ↓           ↓             ║
║                   ┌──────────────────────────────────────────────┐           ║
║                   │   Main Page State Management                 │           ║
║                   │  (/app/create-gift-box/page.tsx)             │           ║
║                   │                                              │           ║
║                   │  - giftBoxItems: GiftBoxItem[]              │           ║
║                   │  - isDragOverBox: boolean                   │           ║
║                   │  - draggedProduct: Product | null           │           ║
║                   │  - showConfetti: boolean                    │           ║
║                   │  - showSuccessMessage: boolean              │           ║
║                   │                                              │           ║
║                   │  Functions:                                 │           ║
║                   │  - handleProductDragStart()                 │           ║
║                   │  - handleDragOver()                         │           ║
║                   │  - handleDrop()                             │           ║
║                   │  - handleAddToCart()                        │           ║
║                   └──────────────────────────────────────────────┘           ║
║                            ↓                                                  ║
║                   ┌──────────────────────────────────────────────┐           ║
║                   │       Cart Context (Global State)            │           ║
║                   │      (/context/CartContext.tsx)              │           ║
║                   │                                              │           ║
║                   │  - items: CartElement[]                      │           ║
║                   │    ├─ CartItem[] (regular products)          │           ║
║                   │    └─ GiftBox[] (gift boxes)                │           ║
║                   │  - isOpen: boolean                           │           ║
║                   │  - count: number                             │           ║
║                   │  - total: number                             │           ║
║                   │                                              │           ║
║                   │  Methods:                                   │           ║
║                   │  - addItem(payload)      [existing]          │           ║
║                   │  - addGiftBox(giftBox)   [NEW]              │           ║
║                   │  - removeItem(id)        [updated]           │           ║
║                   │  - updateQty(id, qty)    [updated]           │           ║
║                   │  - openCart() / closeCart()                 │           ║
║                   └──────────────────────────────────────────────┘           ║
║                                       ↓                                      ║
║                            ┌──────────────────────┐                          ║
║                            │  CartDrawer          │                          ║
║                            │  Displays mixed:     │                          ║
║                            │  - Regular items     │                          ║
║                            │  - Gift boxes        │                          ║
║                            └──────────────────────┘                          ║
║                                                                              ║
╚════════════════════════════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════════════════════════════╗
║                        DRAG & DROP FLOW                                     ║
╠════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║   User Action              Handler             State Change                ║
║   ─────────────            ───────             ─────────────                ║
║                                                                              ║
║   1. Mouse down on        onMouseDown          draggedProduct = product    ║
║      product card          (implicit)                                       ║
║                                                                              ║
║   2. Start dragging       onDragStart          dataTransfer.setData()      ║
║                                                product JSON                ║
║                                                                              ║
║   3. Move over            onDragOver           isDragOverBox = true        ║
║      gift box area        (handler)            e.preventDefault()          ║
║                                                e.dropEffect = "copy"       ║
║                                                Background → green          ║
║                                                                              ║
║   4. Leave drop zone      onDragLeave          isDragOverBox = false       ║
║                           (handler)            Background → white          ║
║                                                                              ║
║   5. Drop on              onDrop               Parse product JSON          ║
║      gift box area        (handler)            Check if exists             ║
║                                                ├─ if yes: qty++            ║
║                                                └─ if no: add new           ║
║                                                                              ║
║   6. Drop complete        Animation trigger    slideInScale animation      ║
║                                                (if first) confetti effect   ║
║                                                Total price updates         ║
║                                                                              ║
╚════════════════════════════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════════════════════════════╗
║                   ADD TO CART FLOW                                          ║
╠════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║   Step                      Action              Result                      ║
║   ────                      ──────              ──────                      ║
║                                                                              ║
║   1. User clicks            onClick fired       Validate items exist       ║
║      "Add to Cart"          within button       If 0 items → alert         ║
║                                                                              ║
║   2. Validate data          Calculate total    All items summed            ║
║                            price               into totalPrice             ║
║                                                                              ║
║   3. Create GiftBox obj     Object built:      {                           ║
║                            id: timestamp       id: "gift-box-1710..."     ║
║                            type: "gift-box"   type: "gift-box",           ║
║                            items: [...]       items: [                    ║
║                            totalPrice         {productId, qty},           ║
║                            createdAt          ...                          ║
║                                               ],                           ║
║                                               totalPrice: 685000,         ║
║                                               createdAt: Date             ║
║                                               }                           ║
║                                                                              ║
║   4. Call addGiftBox()      addGiftBox(box)    CartContext updated         ║
║                                                items.push(box)             ║
║                                                                              ║
║   5. Update UI              setShowSuccess     Success toast displays      ║
║                            setTimeout          "✓ Gift box added!"         ║
║                                                                              ║
║   6. Reset form             setGiftBoxItems    giftBoxItems = []           ║
║                            []                  Page cleared                ║
║                            setShowSuccess      Ready for new box           ║
║                            false               (after 2 seconds)           ║
║                                                                              ║
║   7. Redirect (optional)    Navigate to        User sees cart              ║
║                            /cart               with gift box               ║
║                                                                              ║
╚════════════════════════════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════════════════════════════╗
║                   ANIMATION TRIGGERS                                        ║
╠════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║   Animation         Trigger              Duration    Effect                ║
║   ──────────        ───────              ────────    ──────                ║
║                                                                              ║
║   Confetti          items.length === 1   1.5s        30 particles fall     ║
║                     (first product)      (auto)      from top              ║
║                                                                              ║
║   Drop Bounce       onDrop handler       0.5s        Item bounces in       ║
║                     fires               cubic-bezier with scale effect    ║
║                                                                              ║
║   Slide In Scale    setGiftBoxItems()   0.3s        Item appears           ║
║                     updates             opacity +   with scale-in         ║
║                                         scale                             ║
║                                                                              ║
║   Success Toast     handleAddToCart()   2s          Message displays       ║
║                     success             (auto)      then disappears        ║
║                                                                              ║
║   Drag Pulse        When hovering on    2s          Pulsing glow           ║
║                     product cards      infinite     on hover               ║
║                                                                              ║
╚════════════════════════════════════════════════════════════════════════════╝

╔════════════════════════════════════════════════════════════════════════════╗
║                   DATA TRANSFORMATION                                       ║
╠════════════════════════════════════════════════════════════════════════════╣
║                                                                              ║
║   Page State                  →              Cart Context                   ║
║   ───────────                 →              ────────────                   ║
║                                                                              ║
║   giftBoxItems: [                           GiftBox: {                     ║
║     {                                         id: "gift-box-...",           ║
║       product: {                              type: "gift-box",            ║
║         id: 1,                                items: [                     ║
║         name: "Thịt Gác Bếp",                 {                           ║
║         priceNum: 250000,                       productId: 1,              ║
║         ...                                   quantity: 2                 ║
║       },                                    },                             ║
║       quantity: 2                            {                             ║
║     },                                         productId: 3,               ║
║     {                                        quantity: 1                  ║
║       product: {                            }                              ║
║         id: 3,                             ],                              ║
║         name: "Mật Ong Rừng",               totalPrice: 685000,            ║
║         priceNum: 185000,                   createdAt: Date object         ║
║         ...                                }                               ║
║       },                                                                    ║
║       quantity: 1                                                          ║
║     }                                                                       ║
║   ]                                                                         ║
║                                                                              ║
║   ┌─ Calculation ─────────────────────┐                                    ║
║   │ totalPrice = 250000*2 + 185000*1   │                                   ║
║   │            = 500000 + 185000       │                                   ║
║   │            = 685000 VND            │                                   ║
║   └────────────────────────────────────┘                                   ║
║                                                                              ║
╚════════════════════════════════════════════════════════════════════════════╝
```

---

## Component Hierarchy

```
App
 ├── CartProvider
 │    └── value: { items, addGiftBox, ... }
 │
 ├── NavBar
 │    └── useCart() → displays cart count
 │        └── "Tạo Gói Quà" link → /create-gift-box
 │
 ├── CreateGiftBox Page
 │    │
 │    ├── State:
 │    │   ├── giftBoxItems: GiftBoxItem[]
 │    │   ├── isDragOverBox: boolean
 │    │   ├── draggedProduct: Product | null
 │    │   ├── showConfetti: boolean
 │    │   └── showSuccessMessage: boolean
 │    │
 │    ├── Children:
 │    │   ├── ConfettiEffect (conditional)
 │    │   │   └── Array of falling particles
 │    │   │
 │    │   ├── SuccessMessage (conditional)
 │    │   │   └── "✓ Gift box added to cart!"
 │    │   │
 │    │   ├── ProductList
 │    │   │   ├── SearchInput
 │    │   │   ├── CategoryButtons
 │    │   │   ├── ProductGrid
 │    │   │   │   └── ProductCard (draggable) × 12
 │    │   │   └── PaginationControls
 │    │   │
 │    │   ├── GiftBoxArea
 │    │   │   ├── Header
 │    │   │   ├── EmptyState | ItemsList
 │    │   │   │   ├── GiftBoxItem × N
 │    │   │   │   │   ├── Emoji
 │    │   │   │   │   ├── Name & Weight
 │    │   │   │   │   ├── Price
 │    │   │   │   │   ├── QuantityControls
 │    │   │   │   │   └── RemoveButton
 │    │   │   │   └── ...
 │    │   │   └── SummarySection
 │    │   │       ├── Total Weight
 │    │   │       ├── Total Items
 │    │   │       ├── Total Price
 │    │   │       └── ClearButton
 │    │   │
 │    │   ├── ActionButtons
 │    │   │   ├── ClearButton
 │    │   │   └── AddToCartButton
 │    │   │
 │    │   └── TipsSection
 │    │       ├── Drag Products Tip
 │    │       ├── Adjust Quantity Tip
 │    │       └── Complete Box Tip
 │    │
 │    └── Handlers:
 │        ├── handleProductDragStart()
 │        ├── handleDragOver()
 │        ├── handleDragLeave()
 │        ├── handleDrop()
 │        └── handleAddToCart()
 │
 └── CartDrawer
      └── useCart() → displays all items
          ├── Regular CartItems
          └── GiftBox items
```

---

## Event Flow Visualization

```
        Browser Events              React Handlers              State Updates
        ──────────────              ──────────────              ──────────────

        ┌──────────────┐            
        │ mousedown on │            
        │   product    │            
        └──────┬───────┘            
               │                    
               ▼                    
        ┌──────────────┐            
        │  dragstart   │────────→  onProductDragStart()  ─→  setDraggedProduct(p)
        │ event fired  │                                     e.dataTransfer.setData()
        └──────┬───────┘            
               │                    
               ▼                    
        ┌──────────────┐            
        │   dragover   │────────→  handleDragOver()     ─→  setIsDragOverBox(true)
        │ gift box     │                                     setStyle(green)
        └──────┬───────┘            
               │                    
               ▼                    
        ┌──────────────┐            
        │  dragleave   │────────→  handleDragLeave()    ─→  setIsDragOverBox(false)
        │ gift box     │                                     setStyle(white)
        └──────┬───────┘            
               │                    
               ▼                    
        ┌──────────────┐            
        │    drop      │────────→  handleDrop()         ─→  setGiftBoxItems([...])
        │ in box       │                                     Trigger animation
        └──────┬───────┘            
               │                    
               ▼                    
        ┌──────────────┐            
        │   (optional) │────────→  useEffect()          ─→  setShowConfetti(true)
        │ first item?  │            Cleanup timer           setTimeout(1500ms)
        └──────────────┘                                     
```

---

## State Flow Diagram

```
              Initial State
                   │
                   ▼
    ┌──────────────────────────────┐
    │ giftBoxItems: []             │
    │ isDragOverBox: false         │
    │ draggedProduct: null         │
    │ showConfetti: false          │
    │ showSuccessMessage: false    │
    └──────────────────────────────┘
              │
              ▼ (User drags product)
    ┌──────────────────────────────┐
    │ giftBoxItems: []             │
    │ isDragOverBox: true  ◄───┐   │  (visual feedback)
    │ draggedProduct: {...}   │   │
    │ showConfetti: false     │   │
    │ showSuccessMessage: false    │
    └──────────────────────────────┘
              │
              ▼ (User drops product)
    ┌──────────────────────────────┐
    │ giftBoxItems: [{...}]        │  (1 item added)
    │ isDragOverBox: false         │  (reset)
    │ draggedProduct: null         │  (reset)
    │ showConfetti: true ◄──┐      │  (animation trigger)
    │ showSuccessMessage: false   │
    └──────────────────────────────┘
              │
              ├─→ Confetti animation (1.5s)
              │
              ▼ (User clicks Add to Cart)
    ┌──────────────────────────────┐
    │ giftBoxItems: [{...}]        │
    │ isDragOverBox: false         │
    │ draggedProduct: null         │
    │ showConfetti: false          │  (animation ended)
    │ showSuccessMessage: true ◄──┐│  (success toast)
    └──────────────────────────────┘
              │
              ├─→ Success message (2s)
              │
              ▼ (Auto-reset)
    ┌──────────────────────────────┐
    │ giftBoxItems: []             │  (cleared)
    │ isDragOverBox: false         │
    │ draggedProduct: null         │
    │ showConfetti: false          │
    │ showSuccessMessage: false    │  (cleared)
    └──────────────────────────────┘
              │
              ▼ (Ready for new box)
         [READY STATE]
```

---

## Integration Points

```
Your App's Existing Code          New Gift Box Feature
──────────────────────────        ──────────────────────

                          ┌─ NavBar.tsx (updated)
                          │  - Added "Tạo Gói Quà" link
                          │  - Routes to /create-gift-box
                          │
PRODUCTS Data ────────→  ProductList Component
                          │  ├─ Displays products
                          │  ├─ Search/filter
                          │  └─ Drag handling
                          │
                          ├─ GiftBoxArea Component
                          │  ├─ Drop zone
                          │  └─ Item management
                          │
CartContext (updated) ←──┤ useGiftBoxBuilder Hook
                          │  └─ Local state management
                          │
                          └─ CreateGiftBox Page
                             └─ Orchestration & flows

CartContext now stores:
├─ CartItem[] (existing)
└─ GiftBox[] (new type)
```

---

This architecture diagram provides a complete visual understanding of how all components work together!
