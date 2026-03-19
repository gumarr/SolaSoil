/**
 * ============================================================
 *  MỘCSƠN — CENTRAL IMAGE CONFIG
 *  Tất cả URL ảnh của dự án được quản lý tại đây.
 *  Thay đổi ảnh chỉ cần sửa file này, không cần chỉnh component.
 * ============================================================
 */

// ----------------------------------------------------------
// PRODUCTS — ánh xạ product.id → { main, reveal, thumb }
// main   : ảnh card bình thường (landscape 4:3)
// reveal : ảnh trong kính lúp khi di chuột
// thumb  : ảnh nhỏ vuông dùng trong giỏ hàng & drag list
// ----------------------------------------------------------
export const PRODUCT_IMAGES: Record<
  number,
  { main: string; reveal: string; thumb: string }
> = {
  // 1 — Thịt Gác Bếp
  1: {
    main:   "https://images.unsplash.com/photo-1668887472791-6269817b563c?q=80&w=1812&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    reveal: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=600&h=450&fit=crop&q=85",
    thumb:  "https://images.unsplash.com/photo-1668887472791-6269817b563c?q=80&w=1812&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  // 2 — Trà Shan Tuyết
  2: {
    main:   "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=600&h=450&fit=crop&q=85",
    reveal: "https://images.unsplash.com/photo-1433891248364-3ce993ff0e92?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    thumb:  "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=160&h=160&fit=crop&q=80",
  },
  // 3 — Mật Ong Rừng
  3: {
    main:   "https://images.unsplash.com/photo-1587049352851-8d4e89133924?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    reveal: "https://images.unsplash.com/photo-1471943311424-646960669fbc?w=600&h=450&fit=crop&q=85",
    thumb:  "https://images.unsplash.com/photo-1587049352851-8d4e89133924?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  // 4 — Mắc Khén
  4: {
    main:   "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&h=450&fit=crop&q=85",
    reveal: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&h=450&fit=crop&q=85",
    thumb:  "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=160&h=160&fit=crop&q=80",
  },
  // 5 — Hạt Dổi
  5: {
    main:   "https://plus.unsplash.com/premium_photo-1674654419483-e9b8c9d2f3df?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    reveal: "https://images.unsplash.com/photo-1516684732162-798a0062be99?w=600&h=450&fit=crop&q=85",
    thumb:  "https://plus.unsplash.com/premium_photo-1674654419483-e9b8c9d2f3df?q=80&w=1740&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  // 6 — Mận Hậu
  6: {
    main:   "https://images.unsplash.com/photo-1518834903818-7d1557333fda?q=80&w=1548&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    reveal: "https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=600&h=450&fit=crop&q=85",
    thumb:  "https://images.unsplash.com/photo-1518834903818-7d1557333fda?q=80&w=1548&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  // 7 — Na Sầu Riêng
  7: {
    main:   "https://images.unsplash.com/photo-1680008702737-aad40d0f1e56?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    reveal: "https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=600&h=450&fit=crop&q=85",
    thumb:  "https://images.unsplash.com/photo-1680008702737-aad40d0f1e56?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  // 8 — Dâu Tây Mộc Châu
  8: {
    main:   "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600&h=450&fit=crop&q=85",
    reveal: "https://images.unsplash.com/photo-1543528176-61b239494933?w=600&h=450&fit=crop&q=85",
    thumb:  "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=160&h=160&fit=crop&q=80",
  },
};

// ----------------------------------------------------------
// GIFT BOXES — id → ảnh hộp quà
// ----------------------------------------------------------
export const GIFT_BOX_IMAGES: Record<number, string> = {
  101: "https://images.unsplash.com/photo-1513639776629-7b61b0ac49cb?w=600&h=420&fit=crop&q=85",
  102: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600&h=420&fit=crop&q=85",
  103: "https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=600&h=420&fit=crop&q=85",
};

// ----------------------------------------------------------
// CATEGORIES — categoryId → ảnh nền thẻ danh mục
// ----------------------------------------------------------
export const CATEGORY_IMAGES: Record<string, string> = {
  food:  "https://images.unsplash.com/photo-1544025162-d76694265947?w=500&h=360&fit=crop&q=85",
  drink: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=500&h=360&fit=crop&q=85",
  spice: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&h=360&fit=crop&q=85",
  fruit: "https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=500&h=360&fit=crop&q=85",
};

// ----------------------------------------------------------
// STORY SECTION — lưới 2×2 ảnh kể chuyện
// ----------------------------------------------------------
export const STORY_IMAGES = [
  {
    src:   "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop&q=85",
    label: "Núi rừng Sơn La",
  },
  {
    src:   "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop&q=85",
    label: "Thịt Gác Bếp",
  },
  {
    src:   "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&h=300&fit=crop&q=85",
    label: "Vườn Trà Shan Tuyết",
  },
  {
    src:   "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop&q=85",
    label: "Nông dân bản địa",
  },
];

// ----------------------------------------------------------
// HERO SECTION
// ----------------------------------------------------------
export const HERO_IMAGES = {
  /**
   * ══════════════════════════════════════════════════
   *  🖼️  HERO BACKGROUND — đổi URL này để thay nền hero
   *
   *  Yêu cầu: ảnh landscape ≥ 1600×900, có nhiều vùng
   *  tối / rừng / núi để text trắng dễ đọc.
   *
   *  Đặt thành "" để tắt ảnh, dùng mesh gradient thuần.
   * ══════════════════════════════════════════════════
   */
  background: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=1800&h=1000&fit=crop&q=90",

  // ── Lựa chọn thay thế — bỏ comment dòng muốn dùng ──
  // "https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1800&h=1000&fit=crop&q=90"  // rừng xanh aerial
  // "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1800&h=1000&fit=crop&q=90"  // rừng sương mờ
  // "https://images.unsplash.com/photo-1518173946687-a4c8892bbd9f?w=1800&h=1000&fit=crop&q=90"  // đồi trà xanh
  // "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?w=1800&h=1000&fit=crop&q=90"  // hồ núi tuyết
  // ""  // tắt ảnh → thuần CSS gradient

  /** Ảnh card lớn bên phải (floating hero card) */
  main: "https://images.unsplash.com/photo-1553307236-8783cc0a3b9e?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",

  /** Carousel ảnh nhỏ floating card trái */
  floatingCards: [
    {
      name:  "Thịt Gác Bếp",
      price: "250.000đ",
      img:   "https://images.unsplash.com/photo-1544025162-d76694265947?w=320&h=240&fit=crop&q=80",
    },
    {
      name:  "Dâu Tây Mộc Châu",
      price: "55.000đ",
      img:   "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600&h=450&fit=crop&q=85",
    },
    {
      name:  "Trà Shan Tuyết",
      price: "120.000đ",
      img:   "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=320&h=240&fit=crop&q=80",
    },
  ],

  /** Ảnh toast notification góc phải */
  toastProduct: "https://images.unsplash.com/photo-1587049352851-8d4e89133924?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
};

// ----------------------------------------------------------
// QUOTE / BANNER SECTION — ảnh nền cảnh rừng full-width
// ----------------------------------------------------------
export const QUOTE_BG =
  "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1400&h=600&fit=crop&q=85";

// ----------------------------------------------------------
// ABOUT PAGE
// ----------------------------------------------------------
export const ABOUT_IMAGES = {
  banner: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1400&h=500&fit=crop&q=85",
  team: [
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&q=80",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&q=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&q=80",
  ],
};