'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from '@/app/auth/actions'
import { createClient } from '@/utils/supabase/client'
import { 
  LayoutDashboard, 
  Package, 
  Folder, 
  Star, 
  Gift, 
  MessageSquare,
  Leaf,
  LogOut
} from 'lucide-react'

const NAV_ITEMS = [
  { href: '/admin', label: 'Tổng quan', icon: LayoutDashboard },
  { href: '/admin/products', label: 'Sản phẩm', icon: Package },
  { href: '/admin/categories', label: 'Danh mục', icon: Folder },
  { href: '/admin/testimonials', label: 'Đánh giá', icon: Star },
  { href: '/admin/gift-combos', label: 'Hộp quà', icon: Gift },
  { href: '/admin/chat', label: 'Hỗ trợ khách', icon: MessageSquare, badge: true },
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
  const [unreadCount, setUnreadCount] = useState(0)
  const supabase = createClient()

  useEffect(() => {
    // Fetch initial count
    const fetchUnreadCount = async () => {
      try {
        const res = await fetch('/api/admin/chat/unread')
        const data = await res.json()
        if (data.success) {
          setUnreadCount(data.count)
        }
      } catch (err) {
        console.error('Failed to fetch unread count:', err)
      }
    }

    fetchUnreadCount()

    // Subscribe to new messages
    const channel = supabase
      .channel('admin_unread_updates')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'chat_messages',
          filter: "sender_role=eq.customer",
        },
        (payload) => {
          setUnreadCount((prev) => prev + 1)
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'chat_messages',
          filter: "sender_role=eq.customer",
        },
        (payload) => {
          // If a message was marked as read, we might want to re-fetch the total count to be safe,
          // or we can just decrement if is_read changed to true
          if (payload.new.is_read && !payload.old.is_read) {
            setUnreadCount((prev) => Math.max(0, prev - 1))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  const handleLogout = async () => {
    await signOut()
  }

  return (
    <aside className="w-64 bg-zinc-950 border-r border-zinc-800/80 p-6 flex flex-col justify-between shrink-0">
      <div className="flex flex-col gap-8">
        {/* Branding */}
        <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-emerald-600 to-emerald-800 shadow-md">
            <Leaf size={18} className="text-white" />
          </div>
          <div>
            <div className="text-zinc-100 font-extrabold text-base tracking-tight leading-tight">Mộc Sơn</div>
            <div className="text-emerald-500 text-[10px] font-bold tracking-widest uppercase mt-0.5">ADMIN PANEL</div>
          </div>
        </Link>

        {/* Nav Links */}
        <nav className="flex flex-col gap-1.5">
          {NAV_ITEMS.map(item => {
            const isActive = item.href === '/admin' 
              ? pathname === '/admin' 
              : pathname.startsWith(item.href)
            
            const Icon = item.icon

            return (
              <Link 
                key={item.href} 
                href={item.href} 
                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all duration-150 ${
                  isActive 
                    ? 'bg-emerald-950/30 text-emerald-400 font-bold border-l-2 border-emerald-500 shadow-inner' 
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-900/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon size={16} className="shrink-0 animate-pulse-slow" />
                  <span>{item.label}</span>
                </div>
                {item.badge && unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </span>
                )}
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
          <LogOut size={14} className="shrink-0" />
          Đăng xuất
        </button>
      </div>
    </aside>
  )
}
