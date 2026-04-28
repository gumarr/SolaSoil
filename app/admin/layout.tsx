import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const NAV_ITEMS = [
  { href: '/admin', label: 'Tổng quan', icon: '📊' },
  { href: '/admin/products', label: 'Sản phẩm', icon: '📦' },
  { href: '/admin/categories', label: 'Danh mục', icon: '📂' },
  { href: '/admin/testimonials', label: 'Đánh giá', icon: '⭐' },
  { href: '/admin/gift-combos', label: 'Hộp quà', icon: '🎁' },
]

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('users')
    .select('role, full_name, email')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') redirect('/')

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#0f1a10' }}>
      {/* Sidebar */}
      <aside style={{
        width: 260,
        background: 'linear-gradient(180deg, #0d1a0e 0%, #162318 100%)',
        borderRight: '1px solid rgba(157,196,158,0.12)',
        padding: '24px 16px',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <Link href="/" style={{
          display: 'flex', alignItems: 'center', gap: 10,
          marginBottom: 32, textDecoration: 'none',
        }}>
          <span style={{ fontSize: 28 }}>🌿</span>
          <div>
            <div style={{ color: '#9dc49e', fontWeight: 800, fontSize: 18 }}>Mộc Sơn</div>
            <div style={{ color: 'rgba(201,222,202,0.5)', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em' }}>ADMIN PANEL</div>
          </div>
        </Link>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4, flex: 1 }}>
          {NAV_ITEMS.map(item => (
            <Link key={item.href} href={item.href} style={{
              display: 'flex', alignItems: 'center', gap: 10,
              padding: '10px 14px', borderRadius: 12,
              color: '#c9deca', fontSize: 14, fontWeight: 500,
              textDecoration: 'none',
              transition: 'all 0.2s',
            }}>
              <span style={{ fontSize: 18 }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        <div style={{
          padding: '12px 14px', borderRadius: 12,
          background: 'rgba(157,196,158,0.08)',
          border: '1px solid rgba(157,196,158,0.12)',
        }}>
          <div style={{ color: '#9dc49e', fontSize: 12, fontWeight: 600 }}>
            {profile?.full_name || user.email}
          </div>
          <div style={{ color: 'rgba(201,222,202,0.4)', fontSize: 10 }}>
            Admin
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: '32px 40px', overflow: 'auto' }}>
        {children}
      </main>
    </div>
  )
}
