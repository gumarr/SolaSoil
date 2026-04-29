import { Suspense } from "react";
import ProductsView from "@/components/products/ProductsView";
import { createClient } from '@/utils/supabase/server';

export default async function ProductsPage() {
  const supabase = await createClient();

  const [
    { data: categories },
    { data: products }
  ] = await Promise.all([
    supabase.from('categories').select('*').order('name'),
    supabase.from('products').select('*, category:categories(name, icon)').eq('is_active', true).order('created_at', { ascending: false })
  ]);

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

  const categoryTabs = [
    { id: 'all', label: 'Tất Cả', icon: '✨' },
    ...(categories || []).map((c: any) => ({
      id: c.id,
      label: c.name,
      icon: c.icon || '📦'
    }))
  ];

  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin w-8 h-8 border-4 border-green-800 border-t-transparent rounded-full"/>
      </div>
    }>
      <ProductsView products={formattedProducts} categoryTabs={categoryTabs} />
    </Suspense>
  );
}
