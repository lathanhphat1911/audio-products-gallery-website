"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";

// Product Type definition - aligns with Prisma schema
interface Product {
  id: string;
  name: string;
  slug: string;
  categoryLabel: string;
  price: number;
  originalPrice?: number | null;
  rating: number;
  reviewsCount: number;
  badge?: string | null;
  description?: string | null;
  features: string[];
  specs: Record<string, string>;
  colors?: { name: string; hex: string; previewClass: string }[] | null;
  imageType: "headphones" | "speaker-tall" | "speaker-portable" | "amplifier" | "cable";
  gift?: string | null;
  imageUrl?: string | null;
  isSold?: boolean;
}

// Pagination metadata
interface Pagination {
  limit: number;
  nextCursor: string | null;
  hasNext: boolean;
}

// API response type
interface ProductsResponse {
  success: boolean;
  data: Product[];
  pagination?: Pagination;
}

interface ProductTabsProps {
  // Removed onAddToCart
}

export default function ProductTabs() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Navigate to product detail page
  const navigateToProduct = (slug: string) => {
    router.push(`/products/${slug}`);
  };

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/products");
        const result: ProductsResponse = await response.json();
        if (result.success && result.data.length > 0) {
          setProducts(result.data);
        } else {
          setProducts(MOCK_PRODUCTS);
        }
      } catch (err) {
        console.log("Using mock data:", err);
        setProducts(MOCK_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Fallback mock data
  const MOCK_PRODUCTS: Product[] = [
    {
      id: "prod-1",
      slug: "aura-soundwave-anc-5",
      name: "Aura Soundwave ANC 5",
      categoryLabel: "Tai Nghe Hi-Fi",
      price: 6890000,
      originalPrice: 8500000,
      rating: 4.9,
      reviewsCount: 142,
      badge: "Bán Chạy",
      description: "Tai nghe chụp tai Hi-End tích hợp Chip xử lý âm thanh Aura-X1.",
      features: ["Chống ồn ANC Adaptive", "Driver Beryllium 40mm", "Pin lên đến 45 giờ"],
      specs: { "Tần số phản hồi": "4Hz - 45,000Hz" },
      imageType: "headphones",
      gift: "Tặng dây cáp cao cấp",
      isSold: false,
    },
    {
      id: "prod-2",
      slug: "aura-horizon-bar-duo",
      name: "Aura Horizon Bar Duo",
      categoryLabel: "Loa & Soundbar",
      price: 14990000,
      originalPrice: 17500000,
      rating: 5.0,
      reviewsCount: 88,
      badge: "Mới Nhất",
      description: "Hệ thống loa Soundbar rạp hát Dolby Atmos 7.1.2.",
      features: ["Dolby Atmos 7.1.2", "Công suất 550W", "Wi-Fi & AirPlay 2"],
      specs: { "Số kênh": "7.1.2 Kênh" },
      imageType: "speaker-tall",
      isSold: false,
    },
    {
      id: "prod-3",
      slug: "aura-pulse-go-plus",
      name: "Aura Pulse Go+",
      categoryLabel: "Loa & Soundbar",
      price: 3290000,
      originalPrice: 3990000,
      rating: 4.8,
      reviewsCount: 215,
      badge: "Ưu Đãi",
      description: "Loa bluetooth di động thế hệ mới.",
      features: ["Âm thanh 360 độ", "Chống nước IP67", "Pin 24 giờ"],
      specs: { "Công suất": "40W RMS" },
      imageType: "speaker-portable",
      isSold: false,
    },
    {
      id: "prod-4",
      slug: "aura-tube-reference-ii",
      name: "Aura Tube Reference II",
      categoryLabel: "Amply & DAC",
      price: 29900000,
      originalPrice: 32900000,
      rating: 4.9,
      reviewsCount: 34,
      badge: "Audiophile",
      description: "Amply đèn điện tử bán dẫn chất lượng tham chiếu.",
      features: ["Bóng đèn 300B", "Class-A tinh khiết", "Nhôm CNC cao cấp"],
      specs: { "Công suất đầu ra": "15W + 15W" },
      imageType: "amplifier",
      isSold: false,
    },
    {
      id: "prod-5",
      slug: "aura-master-silver-cable",
      name: "Aura Master Silver Cable",
      categoryLabel: "Phụ Kiện Cao Cấp",
      price: 1850000,
      originalPrice: 2200000,
      rating: 4.7,
      reviewsCount: 61,
      badge: "Nâng Cấp",
      description: "Dây cáp tín hiệu âm thanh Hi-End.",
      features: ["Đồng OCC tinh khiết", "Đầu mạ vàng 24K", "Giáp chống nhiễu"],
      specs: { "Chất liệu lõi": "OCC bọc bạc" },
      imageType: "cable",
      isSold: false,
    }
  ];

  const tabs = [
    { id: "all", name: "Xem tất cả" },
    { id: "under-5m", name: "Dưới 5 triệu" },
    { id: "5-10m", name: "5-10 triệu" }
  ];

  const filteredProducts = products.filter(p => {
    // Loại bỏ sản phẩm đã sold
    if (p.isSold) return false;
    if (activeTab === "under-5m") return p.price < 5000000;
    if (activeTab === "5-10m") return p.price >= 5000000 && p.price < 10000000;
    return true;
  });

  // Loading skeleton
  if (loading) {
    return (
      <section id="products" className="bg-white dark:bg-[#0A0B0E] py-16 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 rounded-xl md:rounded-2xl flex flex-col animate-pulse overflow-hidden">
                <div className="w-full h-36 md:h-48 bg-zinc-200 dark:bg-zinc-800" />
                <div className="p-3 md:p-4 flex flex-col flex-1 gap-2 md:gap-3">
                  <div className="h-3 md:h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/3" />
                  <div className="h-4 md:h-5 bg-zinc-200 dark:bg-zinc-800 rounded" />
                  <div className="h-3 md:h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-3/4" />
                  <div className="h-4 md:h-5 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2 mt-auto" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error) {
    return (
      <section id="products" className="bg-white dark:bg-[#0A0B0E] py-16 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex items-center justify-center h-64">
            <div className="text-red-500">{error}</div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="products" className="bg-white dark:bg-[#0A0B0E] py-12 md:py-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Section Header */}
        <div className="flex items-center justify-between mb-6 md:mb-8 flex-wrap gap-3">
          <h2 className="text-xl md:text-3xl lg:text-4xl font-black text-zinc-900 dark:text-white">
            Sản Phẩm <span className="text-amber-600 dark:text-amber-500">Nổi Bật</span>
          </h2>
        </div>

        
        {/* Sub Tabs - Horizontal scroll on mobile */}
        <div className="mb-6 md:mb-8">
          <div className="flex gap-2 overflow-x-auto flex-nowrap scrollbar-hide">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-3 md:px-4 py-1.5 md:py-2 text-xs font-bold rounded-lg transition-all whitespace-nowrap flex-shrink-0 ${
                  activeTab === tab.id
                    ? "bg-zinc-200 dark:bg-zinc-800 text-amber-600 dark:text-amber-500 border border-amber-300 dark:border-amber-500/30"
                    : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-800 dark:hover:text-zinc-200 hover:bg-zinc-200/50 dark:hover:bg-zinc-800/50"
                }`}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Product Grid - Responsive: 2 cols mobile, 3 tablet, 4 desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full text-center text-zinc-600 dark:text-zinc-400 py-12">
              Chưa có sản phẩm nào
            </div>
          ) : (
            filteredProducts.map((product) => {
              const discountPercentage = product.originalPrice
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : 0;

              return (
                <div
                  key={product.id}
                  onClick={() => navigateToProduct(product.slug)}
                  className="group bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800/80 rounded-xl md:rounded-2xl flex flex-col hover:border-amber-500/30 transition-all duration-300 overflow-hidden relative cursor-pointer"
                >
                  {/* Discount Badge - Responsive text size */}
                  {discountPercentage > 0 && (
                    <div className="absolute top-2 md:top-3 left-2 md:left-3 bg-red-500 text-white text-[9px] md:text-[10px] font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded-full z-10">
                      -{discountPercentage}%
                    </div>
                  )}

                  {/* Product Badge - Responsive text size */}
                  {product.badge && (
                    <div className="absolute top-2 md:top-3 right-2 md:right-3 bg-amber-500 text-zinc-950 text-[9px] md:text-[10px] font-bold px-1.5 md:px-2 py-0.5 md:py-1 rounded-full z-10">
                      {product.badge}
                    </div>
                  )}

                  {/* Product Image - Reduced height on mobile */}
                  <div className="relative w-full h-36 md:h-48 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-4xl md:text-6xl">{getProductIcon(product.imageType)}</span>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="p-3 md:p-4 flex flex-col flex-1 gap-2 md:gap-3">
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-[10px] md:text-[11px] text-zinc-600 dark:text-zinc-400 font-bold uppercase mb-1">
                        {product.categoryLabel}
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          <span className="text-zinc-700 dark:text-zinc-300">{product.rating}</span>
                        </div>
                      </div>

                      <h3 className="text-[13px] sm:text-sm md:text-base font-bold text-zinc-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2 min-h-[2.5rem] sm:min-h-[3rem]">
                        {product.name}
                      </h3>

                      <p className="text-xs text-zinc-600 dark:text-zinc-400 mt-1.5 md:mt-2 line-clamp-2">
                        {product.description}
                      </p>

                      {/* Gift Tag - Responsive */}
                      {product.gift && (
                        <div className="mt-1.5 md:mt-2 inline-block bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-500 text-[9px] md:text-[10px] px-1.5 md:px-2 py-0.5 rounded-full">
                          🎁 {product.gift}
                        </div>
                      )}
                    </div>

                    {/* Price Row - Responsive */}
                    <div className="flex items-baseline gap-1.5 md:gap-2">
                      <span className="text-base md:text-lg font-black text-amber-600 dark:text-amber-500">
                        {product.price.toLocaleString("vi-VN")}₫
                      </span>
                      {product.originalPrice && (
                        <span className="text-[10px] md:text-xs text-zinc-500 dark:text-zinc-500 line-through">
                          {product.originalPrice.toLocaleString("vi-VN")}₫
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </section>
  );
}

function getProductIcon(type: string): string {
  switch (type) {
    case "headphones": return "🎧";
    case "speaker-tall": return "🔊";
    case "speaker-portable": return "📢";
    case "amplifier": return "⚡";
    case "cable": return "🔌";
    default: return "🎵";
  }
}