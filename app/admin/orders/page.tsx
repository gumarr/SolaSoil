import { createClient } from '@/utils/supabase/server'
import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import OrdersClient from './OrdersClient'

export default async function AdminOrdersPage() {
  // Sử dụng supabaseAdmin trên server để đảm bảo load đầy đủ dữ liệu bất kể cấu hình RLS
  const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: orders } = await supabaseAdmin
    .from('orders')
    .select('*, order_items(*, product:products(name), gift_combo:gift_combos(name))')
    .order('created_at', { ascending: false })

  return <OrdersClient initialOrders={orders || []} />
}
