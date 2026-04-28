import { createClient } from '@/utils/supabase/server'

export default async function AdminDashboard() {
  const supabase = await createClient()

  const [
    { count: productsCount },
    { count: categoriesCount },
    { count: ordersCount },
    { count: testimonialsCount },
    { count: giftCombosCount },
  ] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('categories').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('testimonials').select('*', { count: 'exact', head: true }),
    supabase.from('gift_combos').select('*', { count: 'exact', head: true }),
  ])

  const stats = [
    { label: 'Sản phẩm', value: productsCount || 0, icon: '📦', color: '#4d8550' },
    { label: 'Danh mục', value: categoriesCount || 0, icon: '📂', color: '#9a6420' },
    { label: 'Đơn hàng', value: ordersCount || 0, icon: '🛒', color: '#d4922b' },
    { label: 'Đánh giá', value: testimonialsCount || 0, icon: '⭐', color: '#f6c87a' },
    { label: 'Hộp quà', value: giftCombosCount || 0, icon: '🎁', color: '#9dc49e' },
  ]

  return (
    <div>
      <h1 style={{ color: '#faf8f4', fontSize: 28, fontWeight: 800, marginBottom: 8 }}>
        Tổng Quan
      </h1>
      <p style={{ color: 'rgba(201,222,202,0.5)', fontSize: 14, marginBottom: 32 }}>
        Quản lý toàn bộ dữ liệu website Mộc Sơn
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        {stats.map(s => (
          <div key={s.label} style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(157,196,158,0.12)',
            borderRadius: 16,
            padding: '24px 20px',
          }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>{s.icon}</div>
            <div style={{ color: s.color, fontSize: 36, fontWeight: 800, lineHeight: 1 }}>{s.value}</div>
            <div style={{ color: 'rgba(201,222,202,0.5)', fontSize: 12, fontWeight: 600, marginTop: 6 }}>{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
