"use client";

import { useState, useEffect, useMemo } from "react";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";
import {
  Search,
  Filter,
  X,
  Star,
  ChevronDown,
  Gift,
  ArrowRight
} from "lucide-react";

// Product Type - matches Prisma schema exactly
interface Product {
  id: string;
  name: string;
  slug?: string;
  categoryLabel: string;
  price: number;
  originalPrice?: number | null;
  rating: number;
  reviewsCount: number;
  badge?: string | null;
  description?: string | null;
  features: string[];
  specs: Record<string, string>; // Prisma Json -> Record<string, string>
  colors?: { name: string; hex: string; previewClass: string }[] | null; // Prisma Json
  imageType: "headphones" | "speaker-tall" | "speaker-portable" | "amplifier" | "cable";
  gift?: string | null;
  imageUrl?: string | null;
  isSold?: boolean; // Thêm isSold để lọc sản phẩm đã bán
}

// API Response Type
interface ProductsResponse {
  success: boolean;
  data: Product[];
  pagination?: {
    limit: number;
    nextCursor: string | null;
    hasNext: boolean;
    total?: number;
  };
}

// API Response Type
interface ProductsResponse {
  success: boolean;
  data: Product[];
}


// Price range filters
const PRICE_RANGES = [
  { id: "all", name: "Tất cả mức giá", min: 0, max: Infinity },
  { id: "under-5m", name: "Dưới 5 triệu", min: 0, max: 5000000 },
  { id: "5-15m", name: "5-15 triệu", min: 5000000, max: 15000000 },
  { id: "over-15m", name: "Trên 15 triệu", min: 15000000, max: Infinity }
];

// Sort options
const SORT_OPTIONS = [
  { id: "price-asc", name: "Giá: Thấp đến Cao" },
  { id: "price-desc", name: "Giá: Cao đến Thấp" },
  { id: "rating", name: "Đánh giá cao nhất" },
  { id: "newest", name: "Mới nhất" }
];

// Image type to emoji mapping
const getImageEmoji = (imageType: Product["imageType"]): string => {
  const map: Record<Product["imageType"], string> = {
    "headphones": "🎧",
    "speaker-tall": "🔊",
    "speaker-portable": "📱",
    "amplifier": "⚡",
    "cable": "🎵"
  };
  return map[imageType] || "🎧";
};

export default function ProductCatalogPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [priceRange, setPriceRange] = useState<string>("all");
  const [minRating, setMinRating] = useState<number>(0);
  const [hasGift, setHasGift] = useState(false);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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
          // Fallback to mock data
          setProducts(MOCK_PRODUCTS);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
        setProducts(MOCK_PRODUCTS);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    let filtered = [...products];

    // Filter out sold products
    filtered = filtered.filter(p => !p.isSold);

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    
    // Price filter
    if (priceRange !== "all") {
      const range = PRICE_RANGES.find(r => r.id === priceRange);
      if (range) {
        filtered = filtered.filter(p =>
          p.price >= range.min && p.price <= range.max
        );
      }
    }

    // Rating filter
    if (minRating > 0) {
      filtered = filtered.filter(p => p.rating >= minRating);
    }

    // Gift filter
    if (hasGift) {
      filtered = filtered.filter(p => p.gift || (p.originalPrice && p.originalPrice > p.price));
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        case "newest":
        default:
          return 0; // Keep original order for mock data
      }
    });

    return filtered;
  }, [products, searchQuery, priceRange, minRating, hasGift, sortBy]);

  const hasActiveFilters = searchQuery || priceRange !== "all" || minRating > 0 || hasGift;

  const formatPrice = (price: number) => {
    return `${price.toLocaleString("vi-VN")}₫`;
  };

  const handleViewProduct = (slug: string) => {
    router.push(`/products/${slug}`);
  };

  const resetFilters = () => {
    setSearchQuery("");
    setPriceRange("all");
    setMinRating(0);
    setHasGift(false);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0B0E] text-zinc-900 dark:text-white selection:bg-amber-500 selection:text-black">
      <Header />
      <div className="max-w-7xl mx-auto mt-25 px-3 xs:px-4 sm:px-5 md:px-6 py-4 xs:py-6 sm:py-8 pt-20 xs:pt-24">

        {/* Catalog Header */}
        <div className="flex flex-col gap-3 xs:gap-4 mb-4 xs:mb-6">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <h1 className="text-xl xs:text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-900 dark:text-white">
              Bộ Sưu Tập Âm Thanh
            </h1>
            <span className="text-sm xs:text-base text-zinc-600 dark:text-zinc-400 font-medium">
              Hiển thị {filteredProducts.length} sản phẩm
            </span>
          </div>

          {/* Toolbar */}
          <div className="flex items-center gap-2 xs:gap-3 flex-wrap">
            {/* Search */}
            <div className="relative flex-1 min-w-[200px] max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 dark:text-zinc-400" />
              <input
                type="text"
                placeholder="Tìm kiếm sản phẩm..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-3 py-2 xs:py-2.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm xs:text-base focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-3 pr-8 py-2 xs:py-2.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm xs:text-base focus:outline-none focus:ring-2 focus:ring-amber-500"
              >
                {SORT_OPTIONS.map(opt => (
                  <option key={opt.id} value={opt.id}>{opt.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 dark:text-zinc-400 pointer-events-none" />
            </div>

            {/* Mobile Filter Button */}
            <button
              onClick={() => setIsFilterOpen(true)}
              className="lg:hidden px-3 xs:px-4 py-2 xs:py-2.5 bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl text-sm xs:text-base font-semibold flex items-center gap-2"
            >
              <Filter className="w-4 h-4" />
              Bộ lọc
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex gap-4 xs:gap-6">

          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 xl:w-72 flex-shrink-0">
            <div className="sticky top-24 space-y-6">
              <FilterPanel
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                minRating={minRating}
                setMinRating={setMinRating}
                hasGift={!!hasGift}
                setHasGift={setHasGift}
                hasActiveFilters={!!hasActiveFilters}
                resetFilters={resetFilters}
              />
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {loading ? (
              <ProductGridSkeleton />
            ) : filteredProducts.length === 0 ? (
              <EmptyState onReset={resetFilters} />
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 xs:gap-4 sm:gap-5">
                {filteredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    formatPrice={formatPrice}
                    onView={() => handleViewProduct(product.slug || product.id)}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Filter Drawer */}
        {isFilterOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div className="absolute inset-0 bg-black/50" onClick={() => setIsFilterOpen(false)} />
            <div className="absolute right-0 top-0 h-full w-full max-w-xs bg-white dark:bg-zinc-950 p-4 xs:p-5 overflow-y-auto">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg xs:text-xl font-bold text-zinc-900 dark:text-white">Bộ lọc</h2>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="p-2 rounded-lg bg-zinc-100 dark:bg-zinc-900"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <FilterPanel
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                minRating={minRating}
                setMinRating={setMinRating}
                hasGift={!!hasGift}
                setHasGift={setHasGift}
                hasActiveFilters={!!hasActiveFilters}
                resetFilters={resetFilters}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Filter Panel Component
function FilterPanel({
  priceRange,
  setPriceRange,
  minRating,
  setMinRating,
  hasGift,
  setHasGift,
  hasActiveFilters,
  resetFilters
}: {
  priceRange: string;
  setPriceRange: (v: string) => void;
  minRating: number;
  setMinRating: (v: number) => void;
  hasGift: boolean;
  setHasGift: (v: boolean) => void;
  hasActiveFilters: boolean;
  resetFilters: () => void;
}) {
  return (
    <div className="space-y-6">
      {/* Price Filter */}
      <div>
        <h3 className="text-sm xs:text-base font-bold text-zinc-800 dark:text-zinc-200 mb-3">Khoảng giá</h3>
        <div className="space-y-2">
          {PRICE_RANGES.map((range) => (
            <label key={range.id} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="price"
                checked={priceRange === range.id}
                onChange={() => setPriceRange(range.id)}
                className="w-4 h-4 text-amber-600 focus:ring-amber-500"
              />
              <span className="text-sm xs:text-base text-zinc-700 dark:text-zinc-300">{range.name}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <h3 className="text-sm xs:text-base font-bold text-zinc-800 dark:text-zinc-200 mb-3">Đánh giá</h3>
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="rating"
              checked={minRating === 0}
              onChange={() => setMinRating(0)}
              className="w-4 h-4 text-amber-600 focus:ring-amber-500"
            />
            <span className="text-sm xs:text-base text-zinc-700 dark:text-zinc-300">Tất cả</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="rating"
              checked={minRating === 4}
              onChange={() => setMinRating(4)}
              className="w-4 h-4 text-amber-600 focus:ring-amber-500"
            />
            <div className="flex items-center gap-1">
              <div className="flex">
                {Array(4).fill(0).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
                ))}
                <Star className="w-4 h-4 text-zinc-300" />
              </div>
              <span className="text-sm xs:text-base text-zinc-700 dark:text-zinc-300">trở lên</span>
            </div>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="rating"
              checked={minRating === 5}
              onChange={() => setMinRating(5)}
              className="w-4 h-4 text-amber-600 focus:ring-amber-500"
            />
            <div className="flex">
              {Array(5).fill(0).map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-amber-500 text-amber-500" />
              ))}
            </div>
          </label>
        </div>
      </div>

      {/* Gift/Discount Filter */}
      <div>
        <h3 className="text-sm xs:text-base font-bold text-zinc-800 dark:text-zinc-200 mb-3">Ưu đãi</h3>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={hasGift}
            onChange={(e) => setHasGift(e.target.checked)}
            className="w-4 h-4 text-amber-600 focus:ring-amber-500 rounded"
          />
          <span className="text-sm xs:text-base text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
            <Gift className="w-4 h-4" />
            Có quà tặng/đang giảm giá
          </span>
        </label>
      </div>

      {/* Reset Button */}
      {hasActiveFilters && (
        <button
          onClick={resetFilters}
          className="w-full py-2 xs:py-2.5 text-center text-amber-600 dark:text-amber-500 font-semibold text-sm xs:text-base border border-amber-500 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors"
        >
          Xóa tất cả bộ lọc
        </button>
      )}
    </div>
  );
}

// Product Card Component
function ProductCard({
  product,
  formatPrice,
  onView
}: {
  product: Product;
  formatPrice: (price: number) => string;
  onView: () => void;
}) {
  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="group bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl xs:rounded-2xl flex flex-col hover:border-amber-500/50 transition-all duration-300 overflow-hidden">
      {/* Discount Badge */}
      {discountPercentage > 0 && (
        <div className="absolute top-2 xs:top-3 left-2 xs:left-3 bg-red-500 text-white text-[10px] xs:text-xs font-bold px-1.5 xs:px-2 py-0.5 xs:py-1 rounded-full z-10">
          -{discountPercentage}%
        </div>
      )}

      {/* Product Badge */}
      {product.badge && (
        <div className="absolute top-2 xs:top-3 right-2 xs:right-3 bg-amber-500 text-zinc-950 text-[10px] xs:text-xs font-bold px-1.5 xs:px-2 py-0.5 xs:py-1 rounded-full z-10">
          {product.badge}
        </div>
      )}

      {/* Image */}
      <div className="relative w-full h-36 xs:h-40 sm:h-48 bg-zinc-50 dark:bg-zinc-950 flex items-center justify-center">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-4xl xs:text-5xl sm:text-6xl">{getImageEmoji(product.imageType)}</span>
        )}
      </div>

      {/* Info */}
      <div className="p-3 xs:p-4 flex flex-col flex-1 gap-2 xs:gap-3">
        <div className="flex-1">
          <div className="flex items-center justify-between text-[10px] xs:text-xs text-zinc-600 dark:text-zinc-400 font-bold uppercase mb-1">
            {product.categoryLabel}
            <div className="flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
              <span className="text-zinc-700 dark:text-zinc-300">{product.rating}</span>
            </div>
          </div>

          <h3 className="text-sm xs:text-base sm:text-lg font-bold text-zinc-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors line-clamp-2 min-h-[2.5rem] xs:min-h-[3rem] mb-2">
            {product.name}
          </h3>

          {product.gift && (
            <div className="inline-flex items-center gap-1 text-[10px] xs:text-xs text-amber-600 dark:text-amber-400 mb-2">
              <Gift className="w-3 h-3" />
              {product.gift}
            </div>
          )}

          <div className="flex items-baseline gap-2">
            <span className="text-base xs:text-lg font-black text-amber-600 dark:text-amber-500">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-[10px] xs:text-xs text-zinc-500 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <button
          onClick={onView}
          className="w-full py-2 xs:py-2.5 bg-amber-600 hover:bg-amber-500 text-zinc-950 font-semibold text-xs xs:text-sm rounded-lg xs:rounded-xl transition-all flex items-center justify-center gap-1"
        >
          Xem chi tiết
          <ArrowRight className="w-3 h-3 xs:w-4 xs:h-4" />
        </button>
      </div>
    </div>
  );
}

// Skeleton Loading
function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 xs:gap-4 sm:gap-5">
      {Array(8).fill(0).map((_, i) => (
        <div key={i} className="bg-white dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl xs:rounded-2xl overflow-hidden animate-pulse">
          <div className="h-36 xs:h-40 sm:h-48 bg-zinc-200 dark:bg-zinc-800" />
          <div className="p-3 xs:p-4 space-y-3">
            <div className="h-3 xs:h-4 bg-zinc-200 dark:bg-zinc-800 rounded" />
            <div className="h-4 xs:h-5 bg-zinc-200 dark:bg-zinc-800 rounded" />
            <div className="h-3 xs:h-4 bg-zinc-200 dark:bg-zinc-800 rounded w-1/2" />
            <div className="h-8 xs:h-10 bg-zinc-200 dark:bg-zinc-800 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

// Empty State
function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 xs:py-16">
      <div className="text-6xl xs:text-7xl mb-4">🔍</div>
      <h3 className="text-lg xs:text-xl font-bold text-zinc-900 dark:text-white mb-2">
        Không tìm thấy sản phẩm
      </h3>
      <p className="text-sm xs:text-base text-zinc-600 dark:text-zinc-400 mb-4">
        Thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm
      </p>
      <button
        onClick={onReset}
        className="px-4 xs:px-5 py-2 xs:py-2.5 bg-amber-600 hover:bg-amber-500 text-zinc-950 font-semibold rounded-xl transition-all"
      >
        Xóa bộ lọc
      </button>
    </div>
  );
}

// Mock products for fallback
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
    gift: "Tặng dây cáp cao cấp"
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
    imageType: "speaker-tall"
  },
  {
    id: "prod-3",
    slug: "aura-pulse-go-plus",
    name: "Aura Pulse Go+",
    categoryLabel: "Loa & Soundbar",
    price: 3290000,
    originalPrice: 3999000,
    rating: 4.8,
    reviewsCount: 215,
    badge: "Ưu Đãi",
    description: "Loa bluetooth di động thế hệ mới.",
    features: ["Âm thanh 360 độ", "Chống nước IP67", "Pin 24 giờ"],
    specs: { "Công suất": "40W RMS" },
    imageType: "speaker-portable"
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
    imageType: "amplifier"
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
    imageType: "cable"
  }
];