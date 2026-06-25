import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import AdminSidebar from '@/components/admin/AdminSidebar'
import OrderNotificationHub from './OrderNotificationHub'

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
    <div className="flex min-h-screen bg-zinc-900 text-zinc-100 font-sans antialiased">
      {/* Sidebar */}
      <AdminSidebar profile={profile} userEmail={user.email || ''} />

      {/* Main content */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto bg-zinc-900">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>

      {/* Real-time Order Notifications for Admins */}
      <OrderNotificationHub />
    </div>
  )
}
