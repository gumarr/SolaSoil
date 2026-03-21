export interface Product {
  id: number;
  name: string;
  categoryId: string;
  category: string;
  desc: string;
  price: string;
  priceNum: number;
  weight: string;
  emoji: string;
  revealEmoji: string;
  grad: string;
  revealGrad: string;
  badge: string | null;
}

export interface CategoryTab {
  id: string;
  label: string;
  icon: string;
}

export interface Category {
  id: string;
  label: string;
  icon: string;
  subtitle: string;
  desc: string;
  grad: string;
  products: string[];
  count: string;
}

export interface Testimonial {
  name: string;
  role: string;
  text: string;
  location: string;
}

export const PRODUCTS: Product[] = [
  { id: 1, name: "Thịt Gác Bếp",     categoryId: "food",   category: "Đồ Ăn",   desc: "Thịt trâu ướp mắc khén hun khói truyền thống người Thái",      price: "250.000đ", priceNum: 250000, weight: "300g",  emoji: "🥩", revealEmoji: "🔥", grad: "from-stone-800 via-stone-700 to-amber-900",      revealGrad: "from-orange-700 via-red-700 to-rose-800",      badge: "Bán chạy" },
  { id: 2, name: "Trà Shan Tuyết",    categoryId: "drink",  category: "Đồ Uống", desc: "Chè cổ thụ hái tay trên đỉnh núi cao hơn 1.000m",               price: "120.000đ", priceNum: 120000, weight: "100g",  emoji: "🍃", revealEmoji: "☕", grad: "from-green-900 via-green-800 to-emerald-700",    revealGrad: "from-teal-700 via-emerald-600 to-green-500",   badge: null },
  { id: 3, name: "Mật Ong Rừng",      categoryId: "drink",  category: "Đồ Uống", desc: "Mật ong nguyên chất từ rừng nguyên sinh Sơn La",                price: "185.000đ", priceNum: 185000, weight: "500ml", emoji: "🍯", revealEmoji: "🫙", grad: "from-amber-700 via-yellow-600 to-amber-500",     revealGrad: "from-amber-900 via-orange-800 to-yellow-700",  badge: "Hữu cơ" },
  { id: 4, name: "Mắc Khén",          categoryId: "spice",  category: "Gia Vị",  desc: "Tiêu rừng Tây Bắc — linh hồn ẩm thực Sơn La",                  price: "65.000đ",  priceNum:  65000, weight: "100g",  emoji: "🫙", revealEmoji: "✨", grad: "from-stone-800 via-amber-900 to-stone-700",      revealGrad: "from-red-800 via-rose-700 to-orange-700",      badge: null },
  { id: 5, name: "Hạt Dổi",           categoryId: "spice",  category: "Gia Vị",  desc: "Hạt dổi rừng già — gia vị quý hiếm của núi rừng",               price: "90.000đ",  priceNum:  90000, weight: "50g",   emoji: "🌰", revealEmoji: "🌿", grad: "from-green-900 via-stone-800 to-green-800",      revealGrad: "from-yellow-700 via-orange-600 to-amber-500",  badge: "Hiếm" },
  { id: 6, name: "Mận Hậu",           categoryId: "fruit",  category: "Hoa Quả", desc: "Mận hậu Sơn La — vỏ tím căng mẩy, ngọt mọng nước",             price: "45.000đ",  priceNum:  45000, weight: "1kg",   emoji: "🍑", revealEmoji: "🌸", grad: "from-purple-900 via-violet-800 to-rose-700",     revealGrad: "from-rose-500 via-pink-400 to-fuchsia-400",    badge: "Đang Mùa" },
  { id: 7, name: "Na Sầu Riêng",      categoryId: "fruit",  category: "Hoa Quả", desc: "Na sầu riêng Sơn La — thịt vàng ươm, vị béo ngậy",             price: "85.000đ",  priceNum:  85000, weight: "1kg",   emoji: "🍈", revealEmoji: "💛", grad: "from-green-900 via-teal-800 to-green-700",       revealGrad: "from-yellow-500 via-amber-400 to-yellow-300",  badge: "Mới" },
  { id: 8, name: "Dâu Tây Mộc Châu", categoryId: "fruit",  category: "Hoa Quả", desc: "Dâu tây tươi ngọt trồng trên cao nguyên Mộc Châu",              price: "55.000đ",  priceNum:  55000, weight: "500g",  emoji: "🍓", revealEmoji: "❤️", grad: "from-rose-900 via-red-800 to-rose-700",          revealGrad: "from-pink-400 via-rose-300 to-red-300",        badge: "Theo Mùa" },
  { id: 9, name: "Hoa Quả Sấy",           categoryId: "fruit",  category: "Hoa Quả", desc: "Hoa quả sấy khô từ Sơn La — lành mạnh, ngon miệng, giàu chất dinh dưỡng", price: "75.000đ",  priceNum:  75000, weight: "300g",  emoji: "🍌", revealEmoji: "✨", grad: "from-yellow-900 via-amber-800 to-orange-700",   revealGrad: "from-yellow-600 via-orange-500 to-amber-400",  badge: "Mới" },
];

export const CATEGORY_TABS: CategoryTab[] = [
  { id: "all",   label: "Tất Cả",  icon: "🌿" },
  { id: "food",  label: "Đồ Ăn",   icon: "🥩" },
  { id: "drink", label: "Đồ Uống", icon: "🍵" },
  { id: "spice", label: "Gia Vị",  icon: "🌶️" },
  { id: "fruit", label: "Hoa Quả", icon: "🍑" },
];

export const CATEGORIES: Category[] = [
  { id: "food",  label: "Đồ Ăn",             icon: "🥩",  subtitle: "Thịt Gác Bếp · Thịt Trâu Muối · Cá Suối",            desc: "Đặc sản thịt hun khói truyền thống của đồng bào dân tộc Thái, Mường — mang vị đậm đà của núi rừng Sơn La.", grad: "from-stone-900 to-amber-900",    products: ["Thịt Trâu Gác Bếp", "Thịt Bò Khô Mắc Khén", "Cá Khô Suối"],               count: "5+ sản phẩm" },
  { id: "drink", label: "Đồ Uống",            icon: "🍵",  subtitle: "Trà Shan Tuyết · Mật Ong Rừng · Rượu Cần",            desc: "Trà cổ thụ và mật ong nguyên chất từ những cánh rừng nguyên sinh, mang hương vị tinh túy của đất trời Sơn La.", grad: "from-green-900 to-teal-700",    products: ["Trà Shan Tuyết Cổ Thụ", "Mật Ong Rừng Nguyên Chất", "Rượu Cần Truyền Thống"], count: "8+ sản phẩm" },
  { id: "spice", label: "Gia Vị",             icon: "🌶️", subtitle: "Mắc Khén · Hạt Dổi · Ớt Rừng",                       desc: "Gia vị bản địa từ rừng rậm Tây Bắc — linh hồn của mọi món đặc sản, cho vị thơm cay khó quên.",               grad: "from-amber-900 to-orange-900",  products: ["Mắc Khén Rang Xay", "Hạt Dổi Rừng", "Ớt Rừng Khô"],                       count: "6+ sản phẩm" },
  { id: "fruit", label: "Hoa Quả Theo Mùa",  icon: "🍑",  subtitle: "Mận Hậu · Na Thái · Na Sầu Riêng · Dâu Tây",          desc: "Trái cây mùa vụ từ cao nguyên Mộc Châu — tươi ngon, sạch tự nhiên, hái đúng độ chín.",                       grad: "from-rose-900 to-purple-800",   products: ["Mận Hậu Sơn La", "Na Sầu Riêng", "Dâu Tây Mộc Châu", "Na Thái"],          count: "10+ sản phẩm" },
];

export const TESTIMONIALS: Testimonial[] = [
  { name: "Nguyễn Thị Lan",  role: "Khách hàng thân thiết", text: "Thịt gác bếp ở Mộc Sơn là ngon nhất tôi từng ăn! Vị mắc khén thơm lừng, thịt dai chắc đúng kiểu truyền thống. Sẽ mua tiếp nhiều lần.", location: "Hà Nội" },
  { name: "Trần Minh Đức",   role: "Đầu bếp chuyên nghiệp", text: "Trà Shan Tuyết ở đây tuyệt vời — lá chè cổ thụ, pha ra màu vàng xanh trong vắt, hậu ngọt nhẹ. Rất phù hợp phục vụ khách VIP.", location: "TP. Hồ Chí Minh" },
  { name: "Phạm Thu Hương",  role: "Food Blogger",           text: "Mận hậu Sơn La mùa này ngọt lắm! Mua về còn thơm mùi tự nhiên, không gắt. Mộc Sơn ship nhanh, đóng gói chuẩn chỉnh.", location: "Đà Nẵng" },
];
