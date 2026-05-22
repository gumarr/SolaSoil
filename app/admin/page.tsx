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
    { label: 'Sản phẩm', value: productsCount || 0, icon: '📦', color: 'text-emerald-400', bgColor: 'bg-emerald-950/20 border-emerald-900/30' },
    { label: 'Danh mục', value: categoriesCount || 0, icon: '📂', color: 'text-amber-400', bgColor: 'bg-amber-950/20 border-amber-900/30' },
    { label: 'Đơn hàng', value: ordersCount || 0, icon: '🛒', color: 'text-sky-400', bgColor: 'bg-sky-950/20 border-sky-900/30' },
    { label: 'Đánh giá', value: testimonialsCount || 0, icon: '⭐', color: 'text-yellow-400', bgColor: 'bg-yellow-950/20 border-yellow-900/30' },
    { label: 'Hộp quà', value: giftCombosCount || 0, icon: '🎁', color: 'text-rose-400', bgColor: 'bg-rose-950/20 border-rose-900/30' },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-zinc-100 tracking-tight">Tổng Quan</h1>
        <p className="text-zinc-500 text-sm mt-1">Quản lý toàn bộ dữ liệu hệ thống website Mộc Sơn</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
        {stats.map(s => (
          <div 
            key={s.label} 
            className="bg-zinc-900/20 border border-zinc-800/80 rounded-2xl p-6 hover:border-zinc-700 transition-all duration-200 group shadow-lg"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl mb-4 border ${s.bgColor} group-hover:scale-105 transition-transform duration-200`}>
              {s.icon}
            </div>
            <div className={`text-3xl font-black ${s.color} tracking-tight`}>
              {s.value}
            </div>
            <div className="text-zinc-400 text-xs font-bold uppercase tracking-wider mt-2">
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Quick shortcuts / helper info */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
        <div className="bg-zinc-900/25 border border-zinc-800/80 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-zinc-200 mb-3">Lối tắt thao tác nhanh</h2>
          <div className="grid grid-cols-2 gap-3">
            <a href="/admin/products" className="p-3 bg-zinc-900/50 hover:bg-zinc-800/50 border border-zinc-800 rounded-xl text-center text-xs font-bold text-zinc-300 transition-colors">
              + Thêm sản phẩm
            </a>
            <a href="/admin/categories" className="p-3 bg-zinc-900/50 hover:bg-zinc-800/50 border border-zinc-800 rounded-xl text-center text-xs font-bold text-zinc-300 transition-colors">
              + Thêm danh mục
            </a>
          </div>
        </div>
        <div className="bg-zinc-900/25 border border-zinc-800/80 rounded-2xl p-6 flex flex-col justify-center">
          <h2 className="text-lg font-bold text-zinc-200 mb-2">Hệ thống quản trị Mộc Sơn</h2>
          <p className="text-zinc-500 text-xs leading-relaxed">
            Hệ thống quản lý dữ liệu đặc sản vùng Sơn La. Bạn có quyền cấu hình sản phẩm, các danh mục chính, đánh giá phản hồi từ khách hàng và các combo gói quà tùy chọn.
          </p>
        </div>
      </div>
    </div>
  )
}
