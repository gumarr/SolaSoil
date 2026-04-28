import { createClient } from '@/utils/supabase/server'
import CategoriesClient from './CategoriesClient'

export default async function AdminCategoriesPage() {
  const supabase = await createClient()
  const { data: categories } = await supabase.from('categories').select('*').order('name')
  return <CategoriesClient categories={categories || []} />
}
