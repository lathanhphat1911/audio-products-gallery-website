"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Flame } from "lucide-react";

interface FlashSaleProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number | null;
  rating: number;
  reviewsCount: number;
  badge?: string | null;
  description?: string | null;
  features: string[];
  imageType: string;
  categoryLabel: string;
  imageUrl?: string | null;
  soldPercentage?: number;
}

export default function FlashSale() {
  const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [currentIndex, setCurrentIndex] = useState(0);
  const [products, setProducts] = useState<FlashSaleProduct[]>([]);

  // Fetch products from API
  useEffect(() => {
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setProducts(data.data);
        }
      })
      .catch(() => {});
  }, []);

  // Countdown timer - 24 hours from now
  useEffect(() => {
    const targetTime = new Date().getTime() + 24 * 60 * 60 * 1000;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference > 0) {
        setTimeLeft({
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / (1000 * 60)) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Auto scroll products
  useEffect(() => {
    if (products.length > 0) {
      const timer = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % products.length);
      }, 3000);
      return () => clearInterval(timer);
    }
  }, [products.length]);

  const visibleProducts = [];
  if (products.length > 0) {
    for (let i = 0; i < Math.min(4, products.length); i++) {
      const idx = (currentIndex + i) % products.length;
      visibleProducts.push(products[idx]);
    }
  }

  return (
    <section id="flash-sale" className="bg-white dark:bg-zinc-950 py-12 md:py-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-3 xs:px-4 md:px-6">
        {/* Section Header with Countdown */}
        <div className="flex items-center justify-between mb-6 md:mb-8 flex-wrap gap-3">
          <div className="flex items-center gap-2 xs:gap-3">
            <Flame className="w-6 xs:w-8 h-6 xs:h-8 text-red-500" />
            <h2 className="text-xl md:text-2xl lg:text-3xl font-black text-zinc-900 dark:text-white">
              Deal Ngon Chớp Nhoáng
            </h2>
          </div>

          {/* Countdown Timer - Responsive */}
          <div className="flex items-center gap-2 xs:gap-3 bg-zinc-100/50 dark:bg-zinc-900/50 border border-gray-200 dark:border-zinc-800 rounded-xl px-3 xs:px-4 py-1.5 xs:py-2">
            <span className="text-[10px] xs:text-xs text-zinc-600 dark:text-zinc-400 font-semibold">Kết thúc trong:</span>
            <div className="flex gap-1 font-mono">
              <div className="bg-red-500 text-white px-1.5 xs:px-2 py-0.5 xs:py-1 rounded font-bold text-xs xs:text-sm min-w-[32px] xs:min-w-[40px] text-center">
                {String(timeLeft.hours).padStart(2, "0")}
              </div>
              <span className="text-red-500 font-bold">:</span>
              <div className="bg-red-500 text-white px-1.5 xs:px-2 py-0.5 xs:py-1 rounded font-bold text-xs xs:text-sm min-w-[32px] xs:min-w-[40px] text-center">
                {String(timeLeft.minutes).padStart(2, "0")}
              </div>
              <span className="text-red-500 font-bold">:</span>
              <div className="bg-red-500 text-white px-1.5 xs:px-2 py-0.5 xs:py-1 rounded font-bold text-xs xs:text-sm min-w-[32px] xs:min-w-[40px] text-center">
                {String(timeLeft.seconds).padStart(2, "0")}
              </div>
            </div>
          </div>
        </div>

        {/* Flash Sale Products Carousel */}
        <div className="relative">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 xs:gap-4">
            {visibleProducts.map((product) => {
              const discountPercentage = product.originalPrice
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : 0;

              return (
                <div
                  key={product.id}
                  className="bg-white dark:bg-zinc-900/40 border border-gray-200 dark:border-zinc-800 rounded-xl xs:rounded-2xl p-3 xs:p-4 flex flex-col gap-2 xs:gap-3 hover:border-red-500/30 transition-all group relative"
                >
                  {product.badge && (
                    <span className="absolute top-2 xs:top-3 left-2 xs:left-3 bg-red-500 text-white text-[9px] xs:text-[10px] font-bold px-1.5 xs:px-2 py-0.5 xs:py-1 rounded-full">
                      {product.badge}
                    </span>
                  )}

                  {/* Product Image */}
                  <div className="w-full h-28 xs:h-32 bg-zinc-50 dark:bg-zinc-950 rounded-xl flex items-center justify-center overflow-hidden">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-3xl xs:text-4xl">{getProductIcon(product.imageType)}</span>
                    )}
                  </div>

                  <h3 className="text-xs xs:text-sm font-bold text-zinc-900 dark:text-white line-clamp-2 group-hover:text-red-500 dark:group-hover:text-red-400 transition-colors">
                    {product.name}
                  </h3>

                  {/* Progress Bar - Sold Percentage */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] xs:text-xs">
                      <span className="text-zinc-600 dark:text-zinc-400">Đã bán</span>
                      <span className="text-red-500 font-bold">{product.soldPercentage}%</span>
                    </div>
                    <div className="w-full h-1.5 xs:h-2 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-red-500 rounded-full transition-all"
                        style={{ width: `${product.soldPercentage ?? 0}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-1 xs:gap-2">
                    <span className="text-sm xs:text-lg font-black text-red-500">
                      {product.price.toLocaleString("vi-VN")}₫
                    </span>
                    <span className="text-[10px] xs:text-xs text-zinc-500 dark:text-zinc-500 line-through">
                      {product.originalPrice?.toLocaleString("vi-VN")}₫
                    </span>
                    <span className="text-[9px] xs:text-xs bg-red-100 dark:bg-red-500/20 text-red-600 dark:text-red-500 font-bold px-1 py-0.5 rounded">
                      -{discountPercentage}%
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function getProductIcon(type: string): string {
  const map: Record<string, string> = {
    "headphones": "🎧",
    "speaker-tall": "🔊",
    "speaker-portable": "📢",
    "amplifier": "⚡",
    "cable": "🔌",
  };
  return map[type] || "🎵";
}