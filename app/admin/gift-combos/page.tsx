import { createClient } from '@/utils/supabase/server'
import GiftCombosClient from './GiftCombosClient'

export default async function AdminGiftCombosPage() {
  const supabase = await createClient()
  const { data: giftCombos } = await supabase.from('gift_combos').select('*').order('created_at', { ascending: false })
  return <GiftCombosClient giftCombos={giftCombos || []} />
}
