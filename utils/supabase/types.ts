// TypeScript types generated from Supabase SQL schema
// These types match the database tables exactly

export interface Category {
  id: string
  name: string
  icon: string | null
  description: string | null
  created_at: string | null
}

export interface Product {
  id: string
  category_id: string | null
  name: string
  description: string | null
  price: number
  weight: string | null
  stock_quantity: number | null
  images: string[] | null
  ocop_stars: number | null // 3-5
  origin: string | null // default 'Sơn La'
  is_active: boolean | null
  created_at: string | null
}

export interface ProductWithCategory extends Product {
  categories: Category | null
}

export interface Combo {
  id: string
  name: string
  description: string | null
  base_price: number | null
  total_price: number
  is_customizable: boolean | null
  created_at: string | null
}

export interface ComboItem {
  combo_id: string
  product_id: string
  quantity: number | null
}

export interface ComboWithItems extends Combo {
  combo_items: (ComboItem & { products: Product })[]
}

export interface User {
  id: string
  full_name: string | null
  email: string | null
  phone: string | null
  address: string | null
  role: string | null // default 'customer'
  created_at: string | null
}

export interface Order {
  id: string
  user_id: string | null
  total_amount: number
  status: string | null // 'pending' | 'processing' | 'shipped' | 'cancelled'
  shipping_address: string
  payment_method: string | null
  created_at: string | null
}

export interface OrderItem {
  id: string
  order_id: string | null
  product_id: string | null
  combo_id: string | null
  quantity: number
  price_at_purchase: number
}

export interface OrderWithItems extends Order {
  order_items: (OrderItem & {
    products: Product | null
    combos: Combo | null
  })[]
}

// Insert types (without auto-generated fields)
export interface CategoryInsert {
  name: string
  icon?: string | null
  description?: string | null
}

export interface ProductInsert {
  category_id?: string | null
  name: string
  description?: string | null
  price: number
  weight?: string | null
  stock_quantity?: number
  images?: string[] | null
  ocop_stars?: number | null
  origin?: string
  is_active?: boolean
}

export interface OrderInsert {
  user_id?: string | null
  total_amount: number
  status?: string
  shipping_address: string
  payment_method?: string | null
}

export interface OrderItemInsert {
  order_id?: string | null
  product_id?: string | null
  combo_id?: string | null
  quantity: number
  price_at_purchase: number
}
