"use client";

import { useState } from "react";
import { PRODUCTS } from "@/lib/data";
import AnnouncementBar from "@/components/home/AnnouncementBar";
import NavBar from "@/components/home/NavBar";
import HeroSection from "@/components/home/HeroSection";
import ValueStrip from "@/components/home/ValueStrip";
import ProductsSection from "@/components/home/ProductsSection";
import QuoteSection from "@/components/home/QuoteSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import StorySection from "@/components/home/StorySection";
import GiftBoxesSection from "@/components/home/GiftBoxesSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import NewsletterSection from "@/components/home/NewsletterSection";
import Footer from "@/components/home/Footer";

export default function Home() {
  const [cartCount, setCartCount]           = useState(0);
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredProducts = activeCategory === "all"
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.categoryId === activeCategory);

  const add = () => setCartCount((c) => c + 1);

  return (
    <div className="min-h-screen bg-white">
      <AnnouncementBar />
      <NavBar cartCount={cartCount} onAddToCart={add} />
      <HeroSection onAddToCart={add} />
      <ValueStrip />
      <ProductsSection
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        filteredProducts={filteredProducts}
        onAddToCart={add}
      />
      <QuoteSection />
      <CategoriesSection onCategoryChange={setActiveCategory} />
      <StorySection />
      <GiftBoxesSection onAddToCart={add} />
      <TestimonialsSection />
      <NewsletterSection />
      <Footer />
    </div>
  );
}
