import { createClient } from '@/utils/supabase/server'
import ProductsClient from './ProductsClient'

export default async function AdminProductsPage() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from('products')
    .select('*, category:categories(name)')
    .order('created_at', { ascending: false })

  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .order('name')

  return <ProductsClient products={products || []} categories={categories || []} />
}
