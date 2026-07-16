"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Package } from "lucide-react";

interface BrandCategory {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
  _count?: { products: number };
}

export default function BrandCategories() {
  const router = useRouter();
  const [brands, setBrands] = useState<BrandCategory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/brands")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setBrands(data.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <section id="brands" className="bg-white dark:bg-zinc-950 py-12 md:py-16 border-y border-gray-200 dark:border-zinc-800/50 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-3 xs:px-4 md:px-6">
          <div className="flex flex-col items-center text-center gap-2 md:gap-3 mb-8 md:mb-12">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-500">Thương hiệu</span>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-zinc-900 dark:text-white leading-tight">
              Thương Hiệu <span className="text-amber-600 dark:text-amber-500">Uy Tín</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 xs:gap-4 md:gap-6">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="flex flex-col items-center gap-3 p-4 bg-zinc-50 dark:bg-zinc-900/30 rounded-xl animate-pulse">
                <div className="w-20 h-20 rounded-xl bg-zinc-200 dark:bg-zinc-800" />
                <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  const handleClick = (slug: string) => {
    router.push(`/products?brand=${slug}`);
  };

  return (
    <section id="brands" className="bg-white dark:bg-zinc-950 py-12 md:py-16 border-y border-gray-200 dark:border-zinc-800/50 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-3 xs:px-4 md:px-6">
        <div className="flex flex-col items-center text-center gap-2 md:gap-3 mb-8 md:mb-12">
          <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-500">Thương hiệu</span>
          <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-zinc-900 dark:text-white leading-tight">
            Thương Hiệu <span className="text-amber-600 dark:text-amber-500">Uy Tín</span>
          </h2>
          <div className="w-12 md:w-16 h-1 bg-amber-600 dark:bg-amber-500 rounded-full mt-1"></div>
        </div>

        {/* Brands Grid - Responsive */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 xs:gap-4 md:gap-6">
          {brands.length === 0 ? (
            // Placeholder brands
            ["AuraSound", "Sony", "Bose", "Sennheiser", "Audio-Technica", "AKG"].map((name, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-3 p-4 bg-zinc-50 dark:bg-zinc-900/30 border border-gray-200 dark:border-zinc-800 rounded-xl hover:border-amber-500/50 transition-all group cursor-pointer"
              >
                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <Package className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-sm font-bold text-zinc-900 dark:text-white">{name}</h3>
              </div>
            ))
          ) : (
            brands.map((brand) => (
              <div
                key={brand.id}
                onClick={() => handleClick(brand.slug)}
                className="flex flex-col items-center gap-3 p-4 bg-zinc-50 dark:bg-zinc-900/30 border border-gray-200 dark:border-zinc-800 rounded-xl hover:border-amber-500/50 transition-all group cursor-pointer"
              >
                <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center overflow-hidden shadow-lg group-hover:scale-110 transition-transform">
                  {brand.logoUrl ? (
                    <img
                      src={brand.logoUrl}
                      alt={brand.name}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <Package className="w-10 h-10 text-white" />
                  )}
                </div>
                <div className="text-center">
                  <h3 className="text-sm font-bold text-zinc-900 dark:text-white">{brand.name}</h3>
                  {brand._count && (
                    <span className="text-xs text-zinc-600 dark:text-zinc-400">{brand._count.products} sản phẩm</span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}