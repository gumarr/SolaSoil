import { Suspense } from "react";
import ProductsView from "@/components/products/ProductsView";

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin w-8 h-8 border-4 border-green-800 border-t-transparent rounded-full"/>
      </div>
    }>
      <ProductsView />
    </Suspense>
  );
}
