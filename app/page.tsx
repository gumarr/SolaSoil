import { createClient } from '@/utils/supabase/server'
import AnnouncementBar from "@/components/home/AnnouncementBar"
import NavBar from "@/components/home/NavBar"
import HeroSection from "@/components/home/HeroSection"
import ValueStrip from "@/components/home/ValueStrip"
import ProductsSection from "@/components/home/ProductsSection"
import QuoteSection from "@/components/home/QuoteSection"
import CategoriesSection from "@/components/home/CategoriesSection"
import StorySection from "@/components/home/StorySection"
import CertificatesSection from "@/components/home/CertificatesSection"
import GiftBoxesSection from "@/components/home/GiftBoxesSection"
import TestimonialsSection from "@/components/home/TestimonialsSection"
import NewsletterSection from "@/components/home/NewsletterSection"
import Footer from "@/components/home/Footer"
import VoucherPopup from "@/components/home/VoucherPopup"

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>
}) {
  const supabase = await createClient()
  const { category: activeCategory = 'all' } = await searchParams

  // Fetch all data in parallel
  const [
    { data: categories },
    { data: testimonials },
    { data: giftCombos },
    { data: heroConfig },
    { data: quoteBgConfig },
    { data: storyConfig },
  ] = await Promise.all([
    supabase.from('categories').select('*').order('name'),
    supabase.from('testimonials').select('*').eq('is_active', true),
    supabase.from('gift_combos').select('*').eq('is_active', true),
    supabase.from('site_config').select('value').eq('key', 'hero').single(),
    supabase.from('site_config').select('value').eq('key', 'quote_bg').single(),
    supabase.from('site_config').select('value').eq('key', 'story_images').single(),
  ])

  // Fetch products (with optional category filter)
  let query = supabase
    .from('products')
    .select('*, category:categories(name, icon)')
    .eq('is_active', true)

  if (activeCategory !== 'all') {
    query = query.eq('category_id', activeCategory)
  }

  const { data: products } = await query.order('created_at', { ascending: false })

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
  }))

  // Map categories to frontend format
  const formattedCategories = (categories || []).map((c: any) => ({
    id: c.id,
    label: c.name,
    icon: c.icon || '📦',
    subtitle: c.subtitle || '',
    desc: c.description || '',
    grad: c.grad || 'from-stone-900 to-amber-900',
    image_url: c.image_url,
    count: `${(products || []).filter((p: any) => p.category_id === c.id).length}+ sản phẩm`,
    products: (products || []).filter((p: any) => p.category_id === c.id).map((p: any) => p.name).slice(0, 3),
  }))

  return (
    <div className="min-h-screen bg-white">
      <VoucherPopup />
      <AnnouncementBar />
      <NavBar />
      <HeroSection heroConfig={heroConfig?.value} />
      <ValueStrip />
      <ProductsSection
        activeCategory={activeCategory}
        filteredProducts={formattedProducts}
        categories={categories || []}
      />
      <QuoteSection quoteBg={quoteBgConfig?.value?.url} />
      <CategoriesSection categories={formattedCategories} />
      <StorySection storyImages={storyConfig?.value} />
      <CertificatesSection />
      <GiftBoxesSection giftCombos={giftCombos || []} />
      <TestimonialsSection testimonials={testimonials || []} />
      <NewsletterSection />
      <Footer />
    </div>
  )
}
