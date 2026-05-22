'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from '@/app/auth/actions'

const NAV_ITEMS = [
  { href: '/admin', label: 'Tổng quan', icon: '📊' },
  { href: '/admin/products', label: 'Sản phẩm', icon: '📦' },
  { href: '/admin/categories', label: 'Danh mục', icon: '📂' },
  { href: '/admin/testimonials', label: 'Đánh giá', icon: '⭐' },
  { href: '/admin/gift-combos', label: 'Hộp quà', icon: '🎁' },
]

interface AdminSidebarProps {
  profile: {
    full_name: string | null
    email: string | null
  } | null
  userEmail: string
}

export default function AdminSidebar({ profile, userEmail }: AdminSidebarProps) {
  const pathname = usePathname()

  const handleLogout = async () => {
    await signOut()
  }

  return (
    <aside className="w-64 bg-zinc-950 border-r border-zinc-800/80 p-6 flex flex-col justify-between shrink-0">
      <div className="flex flex-col gap-8">
        {/* Branding */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-emerald-600 to-emerald-800 shadow-md">
            <span className="text-xl">🌿</span>
          </div>
          <div>
            <div className="text-zinc-100 font-extrabold text-base tracking-tight leading-tight">Mộc Sơn</div>
            <div className="text-emerald-500 text-[10px] font-bold tracking-widest uppercase mt-0.5">ADMIN PANEL</div>
          </div>
        </Link>

        {/* Nav Links */}
        <nav className="flex flex-col gap-1.5">
          {NAV_ITEMS.map(item => {
            // Match active path exactly for /admin, or startsWith for subpaths
            const isActive = item.href === '/admin' 
              ? pathname === '/admin' 
              : pathname.startsWith(item.href)

            return (
              <Link 
                key={item.href} 
                href={item.href} 
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-all duration-150 ${
                  isActive 
                    ? 'bg-emerald-950/30 text-emerald-400 font-bold border-l-2 border-emerald-500 shadow-inner' 
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
                }`}
              >
                <span className="text-base shrink-0">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>
      </div>

      {/* User Info & Logout */}
      <div className="flex flex-col gap-3 pt-4 border-t border-zinc-800/60">
        <div className="px-3 py-2 rounded-xl bg-zinc-900/40 border border-zinc-900">
          <div className="text-zinc-300 text-xs font-bold truncate">
            {profile?.full_name || 'Quản trị viên'}
          </div>
          <div className="text-zinc-500 text-[10px] truncate mt-0.5">
            {profile?.email || userEmail}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-red-400 hover:text-red-300 hover:bg-red-950/20 border border-transparent hover:border-red-900/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Đăng xuất
        </button>
      </div>
    </aside>
  )
}
