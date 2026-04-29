import { createClient } from '@/utils/supabase/server';
import CreateGiftBoxClient from './CreateGiftBoxClient';

export default async function CreateGiftBoxPage() {
  const supabase = await createClient();

  const { data: products } = await supabase
    .from('products')
    .select('*, category:categories(name, icon)')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  // Map products to frontend format
  const formattedProducts = (products || []).map((p: any) => ({
    id: p.id,
    name: p.name,
    categoryId: p.category_id,
    category: p.category?.name || 'Chưa phân loại',
    desc: p.description,
    price: new Intl.NumberFormat('vi-VN').format(p.price) + ' VND',
    priceNum: Number(p.price),
    weight: p.weight,
    emoji: p.emoji || p.category?.icon || '📦',
    revealEmoji: p.reveal_emoji || '✨',
    grad: p.grad || 'from-stone-800 via-stone-700 to-amber-900',
    revealGrad: p.reveal_grad || 'from-orange-700 via-red-700 to-rose-800',
    badge: p.badge || (p.ocop_stars ? `OCOP ${p.ocop_stars} sao` : null),
    images: [p.image_main, p.image_reveal, p.image_thumb].filter(Boolean),
    image_main: p.image_main,
    image_reveal: p.image_reveal,
    image_thumb: p.image_thumb,
  }));

  return <CreateGiftBoxClient products={formattedProducts} />;
}
