"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import {
  Star,
  CheckCircle,
  Gift,
  Zap,
  Shield,
  Package,
  ArrowLeft
} from "lucide-react";

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
  images?: { url: string; isMain: boolean }[];
}

const getImageEmoji = (imageType: Product["imageType"]): string => {
  const mapping: Record<Product["imageType"], string> = {
    "headphones": "🎧",
    "speaker-tall": "🔊",
    "speaker-portable": "📱",
    "amplifier": "⚡",
    "cable": "🎵"
  };
  return mapping[imageType] || "🎧";
};

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>;
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const [product, setProduct] = useState<Product | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"specs" | "features">("specs");
  const router = useRouter();

  useEffect(() => {
    params.then(({ slug }) => {
      fetch(`/api/products/${slug}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setProduct(data.data);
          }
        })
        .catch(() => setProduct(null));
    });
  }, [params]);

  if (!product) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#0A0B0E] flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-xl xs:text-2xl font-bold text-zinc-900 dark:text-white mb-4">
            Đang tải...
          </h1>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return `${price.toLocaleString("vi-VN")}₫`;
  };

  const galleryImages = product.images && product.images.length > 0
    ? product.images
    : Array(4).fill(null).map(() => ({ emoji: getImageEmoji(product.imageType), color: null }));

  return (
    <div className="min-h-screen bg-white dark:bg-[#0A0B0E] text-zinc-900 dark:text-white selection:bg-amber-500 selection:text-black pt-16 xs:pt-20">
      <Header />
      <div className="max-w-7xl mx-auto px-4 xs:px-5 sm:px-6 py-6 xs:py-8 sm:py-10">

        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-2 mb-6 xs:mb-8 text-zinc-600 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4 xs:w-5 xs:h-5" />
          <span className="text-sm xs:text-base font-medium">Quay lại</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 xs:gap-8 lg:gap-10">

          {/* Image Gallery */}
          <div className="lg:col-span-5">
            <div className="space-y-4 xs:space-y-5">
              <div className="relative aspect-square max-w-md mx-auto lg:mx-0">
                <div className="absolute inset-0 rounded-2xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-orange-500/10 to-transparent blur-2xl scale-90"></div>
                  <div className="relative h-full w-full bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800/50 dark:to-zinc-900/50 rounded-2xl flex items-center justify-center border border-zinc-200 dark:border-zinc-700">
                    {product.images?.[currentImageIndex]?.url ? (
                      <img
                        src={product.images[currentImageIndex].url}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-7xl xs:text-8xl sm:text-9xl">
                        {getImageEmoji(product.imageType)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {galleryImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2 xs:gap-3 max-w-md mx-auto lg:mx-0">
                  {galleryImages.map((img: any, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentImageIndex(idx)}
                      className={`aspect-square rounded-xl overflow-hidden border-2 transition-all ${
                        idx === currentImageIndex
                          ? "border-amber-500 scale-105"
                          : "border-zinc-200 dark:border-zinc-700 hover:border-amber-400"
                      }`}
                    >
                      <div className="h-full w-full bg-gradient-to-br from-zinc-100 to-zinc-200 dark:from-zinc-800 dark:to-zinc-900 flex items-center justify-center text-2xl xs:text-3xl">
                        {img?.emoji || getImageEmoji(product.imageType)}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="lg:col-span-7 space-y-4 xs:space-y-5">
            <div>
              <span className="inline-block px-3 py-1 bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs xs:text-sm font-semibold rounded-full mb-3">
                {product.categoryLabel}
              </span>
              <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl font-black text-zinc-900 dark:text-white leading-tight">
                {product.name}
              </h1>
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl xs:text-4xl sm:text-5xl font-extrabold text-amber-600 dark:text-amber-500">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && product.originalPrice > product.price && (
                  <span className="text-lg xs:text-xl sm:text-2xl text-zinc-500 dark:text-zinc-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="inline-block px-2.5 py-0.5 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-xs xs:text-sm font-bold rounded">
                  GIẢM {Math.round((1 - product.price / product.originalPrice) * 100)}%
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-3 xs:gap-4">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 xs:w-5 xs:h-5 ${
                      i < Math.floor(product.rating)
                        ? "fill-amber-500 text-amber-500"
                        : "text-zinc-300 dark:text-zinc-600"
                    }`}
                  />
                ))}
                <span className="text-sm xs:text-base font-semibold text-zinc-700 dark:text-zinc-300 ml-1">
                  {product.rating.toFixed(1)}
                </span>
              </div>
              <span className="text-sm xs:text-base text-zinc-600 dark:text-zinc-400">
                ({product.reviewsCount} đánh giá)
              </span>
            </div>

            <div className="flex flex-wrap gap-2">
              {product.badge && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-gradient-to-r from-amber-600 to-orange-500 text-zinc-950 font-bold text-sm xs:text-base rounded-xl shadow-lg">
                  <Zap className="w-3.5 h-3.5 xs:w-4 xs:h-4" />
                  {product.badge}
                </span>
              )}
              {product.gift && (
                <span className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 font-semibold text-sm xs:text-base rounded-xl border border-emerald-200 dark:border-emerald-800">
                  <Gift className="w-3.5 h-3.5 xs:w-4 xs:h-4" />
                  {product.gift}
                </span>
              )}
            </div>

            {product.description && (
              <p className="text-base xs:text-lg text-zinc-700 dark:text-zinc-300 leading-relaxed">
                {product.description}
              </p>
            )}

            {/* Tabs */}
            <div className="border-b border-zinc-200 dark:border-zinc-800">
              <div className="flex gap-6 xs:gap-8">
                <button
                  onClick={() => setActiveTab("specs")}
                  className={`pb-3 xs:pb-4 text-base xs:text-lg font-semibold transition-colors ${
                    activeTab === "specs"
                      ? "text-amber-600 dark:text-amber-500 border-b-2 border-amber-600 dark:border-amber-500"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                  }`}
                >
                  Thông số kỹ thuật
                </button>
                <button
                  onClick={() => setActiveTab("features")}
                  className={`pb-3 xs:pb-4 text-base xs:text-lg font-semibold transition-colors ${
                    activeTab === "features"
                      ? "text-amber-600 dark:text-amber-500 border-b-2 border-amber-600 dark:border-amber-500"
                      : "text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200"
                  }`}
                >
                  Tính năng nổi bật
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="min-h-[200px] xs:min-h-[250px]">
              {activeTab === "specs" && (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <tbody>
                      {Object.entries(product.specs || {}).map(([key, value]) => (
                        <tr key={key} className="border-b border-zinc-200 dark:border-zinc-800 last:border-0">
                          <td className="px-3 xs:px-4 py-3 xs:py-4 text-sm xs:text-base font-medium text-zinc-600 dark:text-zinc-400 w-1/3">
                            {key}
                          </td>
                          <td className="px-3 xs:px-4 py-3 xs:py-4 text-sm xs:text-base font-semibold text-zinc-900 dark:text-white">
                            {String(value)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === "features" && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 xs:gap-4">
                  {product.features.map((feature, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 xs:p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-200 dark:border-zinc-800"
                    >
                      <CheckCircle className="w-5 h-5 xs:w-6 xs:h-6 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm xs:text-base text-zinc-800 dark:text-zinc-200">{feature}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* CTA Buttons */}
            <div className="pt-4 xs:pt-6 space-y-3 xs:space-y-4">
              <button className="w-full py-4 xs:py-5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-zinc-950 font-bold text-base xs:text-lg rounded-xl transition-all shadow-lg transform hover:scale-[1.02]">
                Đặt lịch trải nghiệm miễn phí phòng VIP
              </button>
              <button className="w-full py-3 xs:py-4 bg-transparent border-2 border-zinc-300 dark:border-zinc-600 text-zinc-800 dark:text-zinc-200 font-semibold text-base xs:text-lg rounded-xl transition-all hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-500">
                Liên hệ tư vấn lắp đặt tận nơi
              </button>
            </div>

            <div className="pt-4 xs:pt-6 flex flex-wrap items-center gap-4 xs:gap-6 text-sm xs:text-base text-zinc-600 dark:text-zinc-400">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 xs:w-5 xs:h-5 text-amber-600 dark:text-amber-500" />
                <span>Bảo hành chính hãng 24 tháng</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="w-4 h-4 xs:w-5 xs:h-5 text-amber-600 dark:text-amber-500" />
                <span>Giao hàng miễn phí toàn quốc</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}