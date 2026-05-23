import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import ProductDetailClient from "./ProductDetailClient";

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("name, description")
    .eq("id", id)
    .single();

  if (!product) {
    return {
      title: "Sản phẩm không tồn tại | Mộc Sơn",
    };
  }

  return {
    title: `${product.name} | Mộc Sơn Đặc Sản Sơn La`,
    description: product.description || `Mua trực tuyến ${product.name} chất lượng cao, đặc sản OCOP chính hãng từ Sơn La tại Mộc Sơn.`,
  };
}

export default async function ProductDetailPage({ params }: PageProps) {
  const { id } = await params;
  const supabase = await createClient();

  // 1. Fetch main product
  const { data: p, error } = await supabase
    .from("products")
    .select("*, category:categories(name, icon)")
    .eq("id", id)
    .single();

  if (error || !p) {
    notFound();
  }

  // 2. Fetch related products in the same category
  const { data: related } = await supabase
    .from("products")
    .select("*, category:categories(name, icon)")
    .eq("category_id", p.category_id)
    .eq("is_active", true)
    .neq("id", id)
    .limit(4);

  // Helper to format product fields
  const formatProduct = (prod: any) => ({
    id: prod.id,
    name: prod.name,
    categoryId: prod.category_id,
    category: prod.category?.name || "Chưa phân loại",
    desc: prod.description,
    price: new Intl.NumberFormat("vi-VN").format(prod.price) + " VND",
    priceNum: Number(prod.price),
    weight: prod.weight,
    emoji: prod.emoji || prod.category?.icon || "📦",
    revealEmoji: prod.reveal_emoji || "✨",
    grad: prod.grad || "from-stone-800 via-stone-700 to-amber-900",
    revealGrad: prod.reveal_grad || "from-orange-700 via-red-700 to-rose-800",
    badge: prod.badge || (prod.ocop_stars ? `OCOP ${prod.ocop_stars} sao` : null),
    images: [prod.image_main, prod.image_reveal, prod.image_thumb].filter(Boolean),
    image_main: prod.image_main,
    image_reveal: prod.image_reveal,
    image_thumb: prod.image_thumb,
    // New detail fields
    detail_story: prod.detail_story,
    ingredients: prod.ingredients,
    usage_instructions: prod.usage_instructions,
    benefits: prod.benefits,
  });

  const formattedProduct = formatProduct(p);
  const formattedRelated = (related || []).map(formatProduct);

  return (
    <ProductDetailClient
      product={formattedProduct}
      relatedProducts={formattedRelated}
    />
  );
}
