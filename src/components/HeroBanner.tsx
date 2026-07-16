"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Package, Speaker, Zap, Cable, Tag, Disc } from "lucide-react";
import { useTheme } from "next-themes";

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice: number | null;
  badge: string | null;
  description: string | null;
  imageUrl: string | null;
  imageType: "headphones" | "speaker-tall" | "speaker-portable" | "amplifier" | "cable";
  brand: { name: string } | null;
  isSold?: boolean;
}

// Icon mapping cho categories
const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  "tai-nghe": <Package className="w-5 h-5" />,
  "loa": <Speaker className="w-5 h-5" />,
  "amply": <Zap className="w-5 h-5" />,
  "phu-kien": <Cable className="w-5 h-5" />,
  "studio": <Disc className="w-5 h-5" />,
  "hang-cu": <Tag className="w-5 h-5" />,
};

export default function HeroBanner() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const { theme, systemTheme } = useTheme();
  const currentTheme = theme === "system" ? systemTheme : theme;

  // Fetch categories from API
  useEffect(() => {
    fetch("/api/categories")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setCategories(data.data || []);
        }
      })
      .catch(() => {});
  }, []);

  // Fetch featured products for slideshow
  useEffect(() => {
    fetch("/api/products?limit=5")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          // Lọc sản phẩm có hình ảnh, badge và chưa sold
          setProducts(
            data.data.filter((p: Product) => p.imageUrl && !p.isSold && (p.badge || p.originalPrice))
          );
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!isAutoPlaying || products.length === 0) return;

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % products.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [isAutoPlaying, products.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  // Theme-aware styles
  const isDark = currentTheme === "dark";
  const sidebarBg = isDark ? "bg-zinc-900/50 border-zinc-800" : "bg-zinc-100 border-zinc-200";
  const sidebarTitleColor = isDark ? "text-amber-500" : "text-amber-700";
  const sidebarLinkColor = isDark ? "text-zinc-300 hover:text-white hover:bg-zinc-800/50" : "text-zinc-700 hover:text-zinc-900 hover:bg-zinc-200";
  const sidebarArrowColor = isDark ? "text-zinc-600" : "text-zinc-400";
  const arrowBg = isDark ? "bg-black/30 hover:bg-black/50" : "bg-white/30 hover:bg-white/50";

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  // Show skeleton loading while fetching data
  if (loading) {
    return (
      <section className="relative bg-white dark:bg-[#0A0B0E] transition-colors duration-300 pt-20 xs:pt-24 sm:pt-28 lg:pt-32 pb-8 md:pb-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            <div className="hidden lg:block lg:col-span-3">
              <div className="border rounded-2xl p-4 space-y-3">
                {Array(5).fill(0).map((_, i) => (
                  <div key={i} className="h-10 bg-zinc-200 dark:bg-zinc-800 rounded-xl animate-pulse" />
                ))}
              </div>
            </div>
            <div className="lg:col-span-9">
              <div className="relative rounded-2xl h-[260px] sm:h-[280px] md:h-[350px] lg:h-[400px] bg-zinc-200 dark:bg-zinc-800 animate-pulse" />
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
      <section className="relative bg-white dark:bg-[#0A0B0E] transition-colors duration-300 pt-20 xs:pt-24 sm:pt-28 lg:pt-32 pb-8 md:pb-12">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
        {/* Main Banner with Sidebar Categories */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* Left: Categories Sidebar */}
          <div className="hidden lg:block lg:col-span-3">
            <div className={`${sidebarBg} border rounded-2xl p-4`}>
              <h3 className={`text-sm font-bold uppercase mb-3 px-2 ${sidebarTitleColor}`}>
                Danh Mục Sản Phẩm
              </h3>
              <ul className="space-y-1">
                {categories.length > 0 ? (
                  categories.map((cat) => (
                    <li key={cat.id}>
                      <a
                        href={`/products?category=${cat.slug}`}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium ${sidebarLinkColor}`}
                      >
                        {CATEGORY_ICONS[cat.slug] || <Package className="w-5 h-5" />}
                        <span className="truncate max-w-[150px]">{cat.name}</span>
                        <span className={`ml-auto text-xs ${sidebarArrowColor}`}>→</span>
                      </a>
                    </li>
                  ))
                ) : (
                  // Fallback categories
                  [
                    { id: "tai-nghe", name: "Tai Nghe Hi-Fi" },
                    { id: "loa", name: "Loa & Soundbar" },
                    { id: "amply", name: "Amply & DAC" },
                    { id: "phu-kien", name: "Phụ Kiện" },
                    { id: "studio", name: "Thiết Bị Studio" },
                  ].map((cat) => (
                    <li key={cat.id}>
                      <a
                        href={`#${cat.id}`}
                        className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm font-medium ${sidebarLinkColor}`}
                      >
                        <Package className="w-5 h-5" />
                        <span className="truncate max-w-[150px]">{cat.name}</span>
                        <span className={`ml-auto text-xs ${sidebarArrowColor}`}>→</span>
                      </a>
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>

          {/* Right: Main Slider Banner */}
          <div className="lg:col-span-9">
            <div className="relative rounded-2xl h-[260px] sm:h-[280px] md:h-[350px] lg:h-[400px] pt-2 xs:pt-3 sm:pt-4 pb-8 xs:pb-10 sm:pb-12">
              {/* Slide Content */}
              <div className="h-full w-full p-1 xs:p-2">
                {products.length > 0 ? (
                  products.map((product, index) => {
                    const discountPercentage = product.originalPrice
                      ? Math.round(
                          ((product.originalPrice - product.price) / product.originalPrice) * 100
                        )
                      : 0;

                    return (
                      <div
                        key={product.id}
                        className={`absolute inset-0 transition-opacity duration-700 ${
                          index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
                        }`}
                      >
                        {/* SỬA TẠI ĐÂY: Thêm rounded-2xl và overflow-hidden cho slide */}
                        <div className="h-full w-full bg-gradient-to-r from-amber-600 via-orange-500 to-red-600 rounded-2xl overflow-hidden flex items-center justify-center px-4 sm:px-8 md:px-12 relative">
                          
                          {/* Decorative elements - background glow */}
                          <div className="absolute top-0 right-0 w-48 h-48 sm:w-64 sm:h-64 md:w-80 md:h-80 bg-white/5 rounded-full blur-2xl sm:blur-3xl translate-x-24 -translate-y-24 hidden xs:block"></div>
                          <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-black/10 rounded-full blur-xl sm:blur-2xl -translate-x-16 translate-y-16 hidden xs:block"></div>

                          {/* SỬA TẠI ĐÂY: Thay đổi flex-col thành md:flex-row trên màn hình lớn để ảnh và chữ nằm song song */}
                          <div className="relative z-10 flex flex-col md:flex-row items-center justify-center md:justify-between gap-4 md:gap-10 w-full h-full py-4 md:py-6">
                            
                            {/* Product Image - Tối ưu kích thước linh hoạt theo màn hình */}
                            <div className="w-20 h-20 xs:w-24 xs:h-24 sm:w-28 sm:h-28 md:w-40 md:h-40 lg:w-48 lg:h-48 rounded-2xl overflow-hidden bg-white/10 backdrop-blur flex-shrink-0 shadow-2xl border border-white/25 flex items-center justify-center">
                              {product.imageUrl ? (
                                <img
                                  src={product.imageUrl}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-4xl sm:text-5xl md:text-6xl">
                                  🎧
                                </div>
                              )}
                            </div>

                            {/* Product Info - Căn lề trái mượt mà trên PC, căn giữa trên Mobile */}
                            <div className="text-center md:text-left flex-1 min-w-0 flex flex-col justify-center">
                              {product.badge && (
                                <span className="inline-block bg-white/20 backdrop-blur text-white text-[10px] md:text-xs font-bold px-3 py-1 rounded-full mb-1.5 md:mb-2.5 self-center md:self-start">
                                  {product.badge}
                                </span>
                              )}
                              
                              <h2 className="text-base sm:text-lg md:text-xl lg:text-3xl font-black text-white mb-1.5 md:mb-2.5 leading-tight line-clamp-2">
                                {product.name}
                              </h2>
                              
                              <p className="text-xs sm:text-xs md:text-sm text-white/90 mb-2 md:mb-4 line-clamp-2 hidden sm:block">
                                {product.brand?.name ? `${product.brand.name} • ` : ""}
                                {product.description || "Khám phá sản phẩm cao cấp tại Thành Nam Audio."}
                              </p>
                              
                              <div className="flex items-center justify-center md:justify-start gap-2.5 md:gap-3.5 mb-3 md:mb-5">
                                <span className="text-lg sm:text-xl md:text-2xl font-black text-white">
                                  {formatPrice(product.price)}
                                </span>
                                {product.originalPrice && (
                                  <span className="text-xs sm:text-sm text-white/70 line-through">
                                    {formatPrice(product.originalPrice)}
                                  </span>
                                )}
                                {discountPercentage > 0 && (
                                  <span className="bg-red-500 text-white text-[10px] md:text-xs font-bold px-1.5 py-0.5 rounded">
                                    -{discountPercentage}%
                                  </span>
                                )}
                              </div>
                              
                              <div className="self-center md:self-start">
                                <a
                                  href={`/products/${product.slug}`}
                                  className="inline-block px-4 py-2 md:px-6 md:py-2.5 bg-white text-zinc-950 font-bold text-[11px] md:text-xs rounded-xl transition-all shadow-lg hover:bg-zinc-100 hover:scale-105 active:scale-95 duration-200"
                                >
                                  Xem Chi Tiết
                                </a>
                              </div>
                            </div>

                          </div>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  // Fallback banner slides
                  [
                    {
                      id: "fallback-1",
                      title: "AuraSound - Âm Thanh Thiên Đường",
                      bgGradient: "from-red-600 via-orange-500 to-amber-500",
                      emoji: "🎵",
                    },
                    {
                      id: "fallback-2",
                      title: "Thành Nam Audio",
                      bgGradient: "from-amber-600 via-yellow-500 to-amber-400",
                      emoji: "🔊",
                    },
                  ].map((slide, index) => (
                    <div
                      key={slide.id}
                      className={`absolute inset-0 transition-opacity duration-700 ${
                        index === currentSlide ? "opacity-100" : "opacity-0 pointer-events-none"
                      }`}
                    >
                      <div
                        className={`h-full w-full bg-gradient-to-r ${slide.bgGradient} flex flex-col xs:flex-row items-center justify-center p-2 xs:p-3 sm:p-4 gap-2 xs:gap-3 sm:gap-4`}
                      >
                        <span className="text-5xl sm:text-6xl md:text-7xl">{slide.emoji}</span>
                        <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white text-center sm:text-left">
                          {slide.title}
                        </h2>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Navigation Arrows */}
              {products.length > 1 && (
                <>
                  <button
                    onClick={() => {
                      setCurrentSlide(
                        (prev) => (prev - 1 + products.length) % products.length
                      );
                      setIsAutoPlaying(false);
                    }}
                    className={`absolute left-2 xs:left-4 top-1/2 -translate-y-1/2 w-8 h-8 xs:w-10 xs:h-10 z-20 ${arrowBg} rounded-full flex items-center justify-center text-white transition-all cursor-pointer`}
                  >
                    <ChevronLeft className="w-4 h-4 xs:w-5 xs:h-5" />
                  </button>
                  <button
                    onClick={() => {
                      setCurrentSlide((prev) => (prev + 1) % products.length);
                      setIsAutoPlaying(false);
                    }}
                    className={`absolute right-2 xs:right-4 top-1/2 -translate-y-1/2 w-8 h-8 xs:w-10 xs:h-10 z-20 ${arrowBg} rounded-full flex items-center justify-center text-white transition-all cursor-pointer`}
                  >
                    <ChevronRight className="w-4 h-4 xs:w-5 xs:h-5" />
                  </button>
                </>
              )}

              {/* Dots Navigation */}
              {products.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                  {products.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => goToSlide(idx)}
                      className={`w-2 h-2 rounded-full transition-all ${
                        idx === currentSlide ? "bg-white w-8" : "bg-white/40"
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}