'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

// ── Helper: kiểm tra quyền admin ────────────────────────────
async function requireAdmin() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) throw new Error('Chưa đăng nhập')

  const { data: profile } = await supabase
    .from('users')
    .select('role')
    .eq('id', user.id)
    .single()

  if (profile?.role !== 'admin') throw new Error('Không có quyền admin')

  return { supabase, user }
}

// ══════════════════════════════════════════════════════════════
// PRODUCTS
// ══════════════════════════════════════════════════════════════

export async function createProduct(formData: FormData) {
  const { supabase } = await requireAdmin()

  const { error } = await supabase.from('products').insert({
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    price: Number(formData.get('price')),
    weight: formData.get('weight') as string,
    category_id: formData.get('category_id') as string || null,
    ocop_stars: Number(formData.get('ocop_stars')) || null,
    origin: formData.get('origin') as string || 'Sơn La',
    badge: formData.get('badge') as string || null,
    emoji: formData.get('emoji') as string || '📦',
    reveal_emoji: formData.get('reveal_emoji') as string || '✨',
    grad: formData.get('grad') as string || 'from-stone-800 via-stone-700 to-amber-900',
    reveal_grad: formData.get('reveal_grad') as string || 'from-orange-700 via-red-700 to-rose-800',
    image_main: formData.get('image_main') as string || null,
    image_reveal: formData.get('image_reveal') as string || null,
    image_thumb: formData.get('image_thumb') as string || null,
    stock_quantity: Number(formData.get('stock_quantity')) || 0,
  })

  if (error) return { error: error.message }
  revalidatePath('/')
  revalidatePath('/admin/products')
  return { success: true }
}

export async function updateProduct(id: string, formData: FormData) {
  const { supabase } = await requireAdmin()

  const { error } = await supabase.from('products').update({
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    price: Number(formData.get('price')),
    weight: formData.get('weight') as string,
    category_id: formData.get('category_id') as string || null,
    ocop_stars: Number(formData.get('ocop_stars')) || null,
    origin: formData.get('origin') as string || 'Sơn La',
    badge: formData.get('badge') as string || null,
    emoji: formData.get('emoji') as string || '📦',
    image_main: formData.get('image_main') as string || null,
    image_reveal: formData.get('image_reveal') as string || null,
    image_thumb: formData.get('image_thumb') as string || null,
    stock_quantity: Number(formData.get('stock_quantity')) || 0,
    is_active: formData.get('is_active') === 'true',
  }).eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/')
  revalidatePath('/admin/products')
  return { success: true }
}

export async function deleteProduct(id: string) {
  const { supabase } = await requireAdmin()
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/')
  revalidatePath('/admin/products')
  return { success: true }
}

// ══════════════════════════════════════════════════════════════
// CATEGORIES
// ══════════════════════════════════════════════════════════════

export async function createCategory(formData: FormData) {
  const { supabase } = await requireAdmin()

  const { error } = await supabase.from('categories').insert({
    name: formData.get('name') as string,
    icon: formData.get('icon') as string || '📦',
    description: formData.get('description') as string || null,
    subtitle: formData.get('subtitle') as string || null,
    grad: formData.get('grad') as string || 'from-stone-900 to-amber-900',
    image_url: formData.get('image_url') as string || null,
  })

  if (error) return { error: error.message }
  revalidatePath('/')
  revalidatePath('/admin/categories')
  return { success: true }
}

export async function updateCategory(id: string, formData: FormData) {
  const { supabase } = await requireAdmin()

  const { error } = await supabase.from('categories').update({
    name: formData.get('name') as string,
    icon: formData.get('icon') as string || '📦',
    description: formData.get('description') as string || null,
    subtitle: formData.get('subtitle') as string || null,
    grad: formData.get('grad') as string || 'from-stone-900 to-amber-900',
    image_url: formData.get('image_url') as string || null,
  }).eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/')
  revalidatePath('/admin/categories')
  return { success: true }
}

export async function deleteCategory(id: string) {
  const { supabase } = await requireAdmin()
  const { error } = await supabase.from('categories').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/')
  revalidatePath('/admin/categories')
  return { success: true }
}

// ══════════════════════════════════════════════════════════════
// TESTIMONIALS
// ══════════════════════════════════════════════════════════════

export async function createTestimonial(formData: FormData) {
  const { supabase } = await requireAdmin()

  const { error } = await supabase.from('testimonials').insert({
    name: formData.get('name') as string,
    role: formData.get('role') as string,
    text: formData.get('text') as string,
    location: formData.get('location') as string,
    rating: Number(formData.get('rating')) || 5,
  })

  if (error) return { error: error.message }
  revalidatePath('/')
  revalidatePath('/admin/testimonials')
  return { success: true }
}

export async function updateTestimonial(id: string, formData: FormData) {
  const { supabase } = await requireAdmin()

  const { error } = await supabase.from('testimonials').update({
    name: formData.get('name') as string,
    role: formData.get('role') as string,
    text: formData.get('text') as string,
    location: formData.get('location') as string,
    rating: Number(formData.get('rating')) || 5,
    is_active: formData.get('is_active') === 'true',
  }).eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/')
  revalidatePath('/admin/testimonials')
  return { success: true }
}

export async function deleteTestimonial(id: string) {
  const { supabase } = await requireAdmin()
  const { error } = await supabase.from('testimonials').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/')
  revalidatePath('/admin/testimonials')
  return { success: true }
}

// ══════════════════════════════════════════════════════════════
// GIFT COMBOS
// ══════════════════════════════════════════════════════════════

export async function createGiftCombo(formData: FormData) {
  const { supabase } = await requireAdmin()

  const { error } = await supabase.from('gift_combos').insert({
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    price: Number(formData.get('price')),
    emoji: formData.get('emoji') as string || '🎁',
    grad: formData.get('grad') as string || 'from-stone-800 to-green-900',
    tag: formData.get('tag') as string || null,
    image_url: formData.get('image_url') as string || null,
  })

  if (error) return { error: error.message }
  revalidatePath('/')
  revalidatePath('/admin/gift-combos')
  return { success: true }
}

export async function updateGiftCombo(id: string, formData: FormData) {
  const { supabase } = await requireAdmin()

  const { error } = await supabase.from('gift_combos').update({
    name: formData.get('name') as string,
    description: formData.get('description') as string,
    price: Number(formData.get('price')),
    emoji: formData.get('emoji') as string || '🎁',
    grad: formData.get('grad') as string || 'from-stone-800 to-green-900',
    tag: formData.get('tag') as string || null,
    image_url: formData.get('image_url') as string || null,
    is_active: formData.get('is_active') === 'true',
  }).eq('id', id)

  if (error) return { error: error.message }
  revalidatePath('/')
  revalidatePath('/admin/gift-combos')
  return { success: true }
}

export async function deleteGiftCombo(id: string) {
  const { supabase } = await requireAdmin()
  const { error } = await supabase.from('gift_combos').delete().eq('id', id)
  if (error) return { error: error.message }
  revalidatePath('/')
  revalidatePath('/admin/gift-combos')
  return { success: true }
}
