const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

// Use service_role key to bypass RLS when seeding
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

if (!serviceRoleKey) {
  console.warn('⚠️  SUPABASE_SERVICE_ROLE_KEY not found in .env.local')
  console.warn('   Seed sẽ dùng anon key — có thể bị RLS chặn.')
  console.warn('   Thêm SUPABASE_SERVICE_ROLE_KEY=... vào .env.local\n')
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  serviceRoleKey || anonKey
)

async function seed() {
  console.log('🌱 Đang nạp dữ liệu mẫu SolaSOIL...\n')

  // ── 1. CATEGORIES ─────────────────────────────────────────
  const { data: cats, error: catErr } = await supabase.from('categories').insert([
    { name: 'Đồ Ăn',   icon: '🥩', description: 'Đặc sản thịt hun khói truyền thống của đồng bào dân tộc Thái, Mường.', subtitle: 'Thịt Gác Bếp · Thịt Trâu Muối · Cá Suối', grad: 'from-stone-900 to-amber-900', image_url: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500&h=360&fit=crop&q=85' },
    { name: 'Đồ Uống', icon: '🍵', description: 'Trà cổ thụ và mật ong nguyên chất từ rừng nguyên sinh Sơn La.', subtitle: 'Trà Shan Tuyết · Mật Ong Rừng · Rượu Cần', grad: 'from-green-900 to-teal-700', image_url: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=500&h=360&fit=crop&q=85' },
    { name: 'Gia Vị',  icon: '🌶️', description: 'Gia vị bản địa từ rừng rậm Tây Bắc — linh hồn ẩm thực Sơn La.', subtitle: 'Mắc Khén · Hạt Dổi · Ớt Rừng', grad: 'from-amber-900 to-orange-900', image_url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=500&h=360&fit=crop&q=85' },
    { name: 'Hoa Quả', icon: '🍑', description: 'Trái cây mùa vụ từ cao nguyên Mộc Châu — tươi ngon, sạch tự nhiên.', subtitle: 'Mận Hậu · Na Thái · Na Sầu Riêng · Dâu Tây', grad: 'from-rose-900 to-purple-800', image_url: 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=500&h=360&fit=crop&q=85' },
  ]).select()

  if (catErr) { console.error('❌ Categories:', catErr.message); return }
  console.log('✅ 4 Categories đã nạp')

  const catMap = {}
  cats.forEach(c => { catMap[c.name] = c.id })

  // ── 2. PRODUCTS ────────────────────────────────────────────
  const { error: prodErr } = await supabase.from('products').insert([
    { category_id: catMap['Đồ Ăn'], name: 'Thịt Gác Bếp', description: 'Thịt trâu ướp mắc khén hun khói truyền thống người Thái', price: 250000, weight: '300g', emoji: '🥩', reveal_emoji: '🔥', grad: 'from-stone-800 via-stone-700 to-amber-900', reveal_grad: 'from-orange-700 via-red-700 to-rose-800', badge: 'Bán chạy', ocop_stars: 5, origin: 'Mộc Châu, Sơn La', image_main: 'https://images.unsplash.com/photo-1668887472791-6269817b563c?q=80&w=1812&auto=format&fit=crop', image_reveal: 'https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=600&h=450&fit=crop&q=85', image_thumb: 'https://images.unsplash.com/photo-1668887472791-6269817b563c?q=80&w=400&auto=format&fit=crop' },
    { category_id: catMap['Đồ Uống'], name: 'Trà Shan Tuyết', description: 'Chè cổ thụ hái tay trên đỉnh núi cao hơn 1.000m', price: 120000, weight: '100g', emoji: '🍃', reveal_emoji: '☕', grad: 'from-green-900 via-green-800 to-emerald-700', reveal_grad: 'from-teal-700 via-emerald-600 to-green-500', badge: null, ocop_stars: 5, origin: 'Tà Xùa, Sơn La', image_main: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=600&h=450&fit=crop&q=85', image_reveal: 'https://images.unsplash.com/photo-1433891248364-3ce993ff0e92?q=80&w=1740&auto=format&fit=crop', image_thumb: 'https://bizweb.dktcdn.net/100/201/525/articles/tra-shan-tuyet.jpg?v=1736063499550' },
    { category_id: catMap['Đồ Uống'], name: 'Mật Ong Rừng', description: 'Mật ong nguyên chất từ rừng nguyên sinh Sơn La', price: 185000, weight: '500ml', emoji: '🍯', reveal_emoji: '🫙', grad: 'from-amber-700 via-yellow-600 to-amber-500', reveal_grad: 'from-amber-900 via-orange-800 to-yellow-700', badge: 'Hữu cơ', ocop_stars: 4, origin: 'Sông Mã, Sơn La', image_main: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?q=80&w=774&auto=format&fit=crop', image_reveal: 'https://us.nuxe.com/cdn/shop/articles/mag-1200x672-what-are-the-virtues-of-honey-and-other-treasures-of-the-hive-1.jpg?v=1751244173&width=2048', image_thumb: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?q=80&w=400&auto=format&fit=crop' },
    { category_id: catMap['Gia Vị'], name: 'Mắc Khén', description: 'Tiêu rừng Tây Bắc — linh hồn ẩm thực Sơn La', price: 65000, weight: '100g', emoji: '🫙', reveal_emoji: '✨', grad: 'from-stone-800 via-amber-900 to-stone-700', reveal_grad: 'from-red-800 via-rose-700 to-orange-700', badge: null, ocop_stars: 4, origin: 'Sơn La', image_main: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600&h=450&fit=crop&q=85', image_reveal: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&h=450&fit=crop&q=85', image_thumb: 'https://huyenhashop.com/wp-content/uploads/2021/12/hat-mac-khen-nguyen-chat.jpg' },
    { category_id: catMap['Gia Vị'], name: 'Hạt Dổi', description: 'Hạt dổi rừng già — gia vị quý hiếm của núi rừng', price: 90000, weight: '50g', emoji: '🌰', reveal_emoji: '🌿', grad: 'from-green-900 via-stone-800 to-green-800', reveal_grad: 'from-yellow-700 via-orange-600 to-amber-500', badge: 'Hiếm', ocop_stars: 3, origin: 'Sơn La', image_main: 'https://plus.unsplash.com/premium_photo-1674654419483-e9b8c9d2f3df?q=80&w=1740&auto=format&fit=crop', image_reveal: 'https://images.unsplash.com/photo-1516684732162-798a0062be99?w=600&h=450&fit=crop&q=85', image_thumb: 'https://plus.unsplash.com/premium_photo-1674654419483-e9b8c9d2f3df?q=80&w=400&auto=format&fit=crop' },
    { category_id: catMap['Hoa Quả'], name: 'Mận Hậu', description: 'Mận hậu Sơn La — vỏ tím căng mẩy, ngọt mọng nước', price: 45000, weight: '1kg', emoji: '🍑', reveal_emoji: '🌸', grad: 'from-purple-900 via-violet-800 to-rose-700', reveal_grad: 'from-rose-500 via-pink-400 to-fuchsia-400', badge: 'Đang Mùa', ocop_stars: 4, origin: 'Mộc Châu', image_main: 'https://images.unsplash.com/photo-1518834903818-7d1557333fda?q=80&w=1548&auto=format&fit=crop', image_reveal: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=600&h=450&fit=crop&q=85', image_thumb: 'https://images.unsplash.com/photo-1518834903818-7d1557333fda?q=80&w=400&auto=format&fit=crop' },
    { category_id: catMap['Hoa Quả'], name: 'Na Sầu Riêng', description: 'Na sầu riêng Sơn La — thịt vàng ươm, vị béo ngậy', price: 85000, weight: '1kg', emoji: '🍈', reveal_emoji: '💛', grad: 'from-green-900 via-teal-800 to-green-700', reveal_grad: 'from-yellow-500 via-amber-400 to-yellow-300', badge: 'Mới', ocop_stars: 4, origin: 'Sơn La', image_main: 'https://images.unsplash.com/photo-1680008702737-aad40d0f1e56?q=80&w=774&auto=format&fit=crop', image_reveal: 'https://vcdn1-kinhdoanh.vnecdn.net/2024/10/27/na12-1729993858-1729993895-3401-1729994265.jpg?w=680&h=0&q=100&dpr=2&fit=crop', image_thumb: 'https://images.unsplash.com/photo-1680008702737-aad40d0f1e56?q=80&w=400&auto=format&fit=crop' },
    { category_id: catMap['Hoa Quả'], name: 'Dâu Tây Mộc Châu', description: 'Dâu tây tươi ngọt trồng trên cao nguyên Mộc Châu', price: 55000, weight: '500g', emoji: '🍓', reveal_emoji: '❤️', grad: 'from-rose-900 via-red-800 to-rose-700', reveal_grad: 'from-pink-400 via-rose-300 to-red-300', badge: 'Theo Mùa', ocop_stars: 3, origin: 'Mộc Châu', image_main: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600&h=450&fit=crop&q=85', image_reveal: 'https://images.unsplash.com/photo-1543528176-61b239494933?w=600&h=450&fit=crop&q=85', image_thumb: 'https://storage.googleapis.com/onelife-public/blog.onelife.vn/2024/01/e1da1556-dau-tay-moc-chau-1024x576.png' },
    { category_id: catMap['Hoa Quả'], name: 'Hoa Quả Sấy', description: 'Hoa quả sấy khô từ Sơn La — lành mạnh, ngon miệng', price: 75000, weight: '300g', emoji: '🍌', reveal_emoji: '✨', grad: 'from-yellow-900 via-amber-800 to-orange-700', reveal_grad: 'from-yellow-600 via-orange-500 to-amber-400', badge: 'Mới', ocop_stars: 3, origin: 'Sơn La', image_main: 'https://suckhoedoisong.qltns.mediacdn.vn/324455921873985536/2023/1/5/hoa-qua-kho-1672887194389642956447.jpg', image_reveal: 'https://maysay.vn/wp-content/uploads/2022/07/hoa-qua%CC%89-sa%CC%82%CC%81y-kho%CC%82.jpeg', image_thumb: 'https://suckhoedoisong.qltns.mediacdn.vn/324455921873985536/2023/1/5/hoa-qua-kho-1672887194389642956447.jpg' },
  ])

  if (prodErr) { console.error('❌ Products:', prodErr.message); return }
  console.log('✅ 9 Products đã nạp')

  // ── 3. GIFT COMBOS ────────────────────────────────────────
  const { error: giftErr } = await supabase.from('gift_combos').insert([
    { name: 'Hộp Rừng Núi', description: 'Thịt Gác Bếp, Mắc Khén, Hạt Dổi, Trà Shan Tuyết', price: 450000, emoji: '🏕️', grad: 'from-stone-800 to-green-900', tag: 'Phổ Biến', image_url: 'https://dohafood.vn/wp-content/uploads/2024/11/Tet-website-anh-01.jpg' },
    { name: 'Hộp Cao Nguyên Xanh', description: 'Mật Ong Rừng, Trà Shan Tuyết Cổ Thụ, Mận Hậu Sấy', price: 380000, emoji: '🌿', grad: 'from-green-800 to-teal-700', tag: 'Mới', image_url: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600&h=420&fit=crop&q=85' },
    { name: 'Hộp Trái Cây Mùa Vụ', description: 'Mận Hậu, Na Sầu Riêng, Dâu Tây Mộc Châu', price: 320000, emoji: '🍑', grad: 'from-rose-800 to-purple-800', tag: 'Theo Mùa', image_url: 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=600&h=420&fit=crop&q=85' },
  ])

  if (giftErr) { console.error('❌ Gift Combos:', giftErr.message); return }
  console.log('✅ 3 Gift Combos đã nạp')

  // ── 4. TESTIMONIALS ───────────────────────────────────────
  const { error: testErr } = await supabase.from('testimonials').insert([
    { name: 'Nguyễn Thị Lan', role: 'Khách hàng thân thiết', text: 'Thịt gác bếp ở Mộc Sơn là ngon nhất tôi từng ăn! Vị mắc khén thơm lừng, thịt dai chắc đúng kiểu truyền thống. Sẽ mua tiếp nhiều lần.', location: 'Hà Nội', rating: 5 },
    { name: 'Trần Minh Đức', role: 'Đầu bếp chuyên nghiệp', text: 'Trà Shan Tuyết ở đây tuyệt vời — lá chè cổ thụ, pha ra màu vàng xanh trong vắt, hậu ngọt nhẹ. Rất phù hợp phục vụ khách VIP.', location: 'TP. Hồ Chí Minh', rating: 5 },
    { name: 'Phạm Thu Hương', role: 'Food Blogger', text: 'Mận hậu Sơn La mùa này ngọt lắm! Mua về còn thơm mùi tự nhiên, không gắt. Mộc Sơn ship nhanh, đóng gói chuẩn chỉnh.', location: 'Đà Nẵng', rating: 5 },
  ])

  if (testErr) { console.error('❌ Testimonials:', testErr.message); return }
  console.log('✅ 3 Testimonials đã nạp')

  // ── 5. SITE CONFIG ────────────────────────────────────────
  const { error: cfgErr } = await supabase.from('site_config').upsert([
    { key: 'hero', value: {
      background: 'https://cafefcdn.com/thumb_w/640/203337114487263232/2023/2/25/photo-13-16773246143791014803577.jpg',
      main: 'https://images.unsplash.com/photo-1553307236-8783cc0a3b9e?q=80&w=774&auto=format&fit=crop',
      floatingCards: [
        { name: 'Thịt Gác Bếp', price: '250.000đ', img: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=320&h=240&fit=crop&q=80' },
        { name: 'Dâu Tây Mộc Châu', price: '55.000đ', img: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600&h=450&fit=crop&q=85' },
        { name: 'Trà Shan Tuyết', price: '120.000đ', img: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=320&h=240&fit=crop&q=80' },
      ],
      toastProduct: 'https://images.unsplash.com/photo-1587049352851-8d4e89133924?q=80&w=774&auto=format&fit=crop',
    }},
    { key: 'quote_bg', value: { url: 'https://cafefcdn.com/thumb_w/640/203337114487263232/2023/2/25/photo-14-16773246173881768150307.jpg' }},
    { key: 'story_images', value: [
      { src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400&h=300&fit=crop&q=85', label: 'Núi rừng Sơn La' },
      { src: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop&q=85', label: 'Thịt Gác Bếp' },
      { src: 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&h=300&fit=crop&q=85', label: 'Vườn Trà Shan Tuyết' },
      { src: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&h=300&fit=crop&q=85', label: 'Nông dân bản địa' },
    ]},
  ])

  if (cfgErr) { console.error('❌ Site Config:', cfgErr.message); return }
  console.log('✅ Site Config đã nạp')

  console.log('\n🎉 Hoàn tất! Tất cả dữ liệu đã được nạp vào Supabase.')
}

seed()
