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
import VoucherPopup from "@/components/home/VoucherPopup";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("all");

  const filteredProducts = activeCategory === "all"
    ? PRODUCTS
    : PRODUCTS.filter((p) => p.categoryId === activeCategory);

  return (
    <div className="min-h-screen bg-white">
      <VoucherPopup />
      <AnnouncementBar />
      <NavBar />
      <HeroSection />
      <ValueStrip />
      <ProductsSection
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        filteredProducts={filteredProducts}
      />
      <QuoteSection />
      <CategoriesSection onCategoryChange={setActiveCategory} />
      <StorySection />
      <GiftBoxesSection />
      <TestimonialsSection />
      <NewsletterSection />
      <Footer />
    </div>
  );
}
