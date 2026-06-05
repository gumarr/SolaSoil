const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  serviceRoleKey || anonKey
)

async function seed() {
  console.log('🌱 Đang nạp dữ liệu khôi phục cho gift_combos, testimonials và site_config...\n')

  // 1. GIFT COMBOS
  const { error: giftErr } = await supabase.from('gift_combos').insert([
    { name: 'Hộp Rừng Núi', description: 'Thịt Gác Bếp, Mắc Khén, Hạt Dổi, Trà Shan Tuyết', price: 450000, emoji: '🏕️', grad: 'from-stone-800 to-green-900', tag: 'Phổ Biến', image_url: 'https://dohafood.vn/wp-content/uploads/2024/11/Tet-website-anh-01.jpg' },
    { name: 'Hộp Cao Nguyên Xanh', description: 'Mật Ong Rừng, Trà Shan Tuyết Cổ Thụ, Mận Hậu Sấy', price: 380000, emoji: '🌿', grad: 'from-green-800 to-teal-700', tag: 'Mới', image_url: 'https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=600&h=420&fit=crop&q=85' },
    { name: 'Hộp Trái Cây Mùa Vụ', description: 'Mận Hậu, Na Sầu Riêng, Dâu Tây Mộc Châu', price: 320000, emoji: '🍑', grad: 'from-rose-800 to-purple-800', tag: 'Theo Mùa', image_url: 'https://images.unsplash.com/photo-1519996529931-28324d5a630e?w=600&h=420&fit=crop&q=85' },
  ])

  if (giftErr) {
    console.error('❌ Gift Combos:', giftErr.message)
  } else {
    console.log('✅ 3 Gift Combos đã nạp')
  }

  // 2. TESTIMONIALS
  const { error: testErr } = await supabase.from('testimonials').insert([
    { name: 'Nguyễn Thị Lan', role: 'Khách hàng thân thiết', text: 'Thịt gác bếp ở Mộc Sơn là ngon nhất tôi từng ăn! Vị mắc khén thơm lừng, thịt dai chắc đúng kiểu truyền thống. Sẽ mua tiếp nhiều lần.', location: 'Hà Nội', rating: 5 },
    { name: 'Trần Minh Đức', role: 'Đầu bếp chuyên nghiệp', text: 'Trà Shan Tuyết ở đây tuyệt vời — lá chè cổ thụ, pha ra màu vàng xanh trong vắt, hậu ngọt nhẹ. Rất phù hợp phục vụ khách VIP.', location: 'TP. Hồ Chí Minh', rating: 5 },
    { name: 'Phạm Thu Hương', role: 'Food Blogger', text: 'Mận hậu Sơn La mùa này ngọt lắm! Mua về còn thơm mùi tự nhiên, không gắt. Mộc Sơn ship nhanh, đóng gói chuẩn chỉnh.', location: 'Đà Nẵng', rating: 5 },
  ])

  if (testErr) {
    console.error('❌ Testimonials:', testErr.message)
  } else {
    console.log('✅ 3 Testimonials đã nạp')
  }

  // 3. SITE CONFIG
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

  if (cfgErr) {
    console.error('❌ Site Config:', cfgErr.message)
  } else {
    console.log('✅ Site Config đã nạp')
  }

  console.log('\n🎉 Hoàn tất khôi phục dữ liệu mẫu!')
}

seed()
