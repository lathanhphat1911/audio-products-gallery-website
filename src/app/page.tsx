"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import Header from "@/components/Header";
import HeroBanner from "@/components/HeroBanner";
import FlashSale from "@/components/FlashSale";
import BrandCategories from "@/components/BrandCategories";
import ProductTabs from "@/components/ProductTabs";
import NewsReview from "@/components/NewsReview";
import EcommerceFooter from "@/components/EcommerceFooter";
import ShoppingCartDrawer from "@/components/ShoppingCartDrawer";
import BookingModal from "@/components/BookingModal";

// Product Type definition
interface Product {
  id: string;
  name: string;
  category: "tai-nghe" | "loa" | "amply" | "phu-kien" | "soundbar" | "dac" | "studio";
  categoryLabel: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  badge?: string;
  description: string;
  features: string[];
  specs: Record<string, string>;
  colors?: { name: string; hex: string; previewClass: string }[];
  imageType: "headphones" | "speaker-tall" | "speaker-portable" | "amplifier" | "cable";
  gift?: string;
}

export default function Home() {
  // Cart State
  const [cart, setCart] = useState<{ product: Product; quantity: number; selectedColor?: string }[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [showToast, setShowToast] = useState<string | null>(null);

  // Booking Modal State
  const [isBookingOpen, setIsBookingOpen] = useState(false);

  // Cart actions
  const addToCart = (product: Product, colorName?: string) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedColor === colorName
      );
      if (existingIndex > -1) {
        const nextCart = [...prev];
        nextCart[existingIndex].quantity += 1;
        return nextCart;
      }
      return [...prev, { product, quantity: 1, selectedColor: colorName }];
    });

    setShowToast(`Đã thêm "${product.name}" vào giỏ hàng!`);
    setTimeout(() => setShowToast(null), 3500);
  };

  const removeFromCart = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQuantity = (index: number, change: number) => {
    setCart((prev) => {
      const nextCart = [...prev];
      const newQty = nextCart[index].quantity + change;
      if (newQty <= 0) {
        return prev.filter((_, i) => i !== index);
      }
      nextCart[index].quantity = newQty;
      return nextCart;
    });
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.product.price * item.quantity, 0);
  };

  return (
    <div>
      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-24 right-6 z-50 flex items-center gap-3 bg-zinc-900 border-l-4 border-amber-500 px-5 py-4 rounded-r-lg shadow-2xl animate-[slideIn_0.3s_ease-out] max-w-sm">
          <div className="p-1 bg-amber-500/20 rounded-full">
            <Check className="w-5 h-5 text-amber-500" />
          </div>
          <p className="text-sm font-medium text-white">{showToast}</p>
        </div>
      )}

      {/* Custom Animations */}
      <style jsx global>{`
        @keyframes slideIn {
          from { transform: translateX(120%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideDown {
          from { transform: translateY(-20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>

      {/* --- HEADER --- */}
      <Header />

      <main>
        {/* --- HERO BANNER - Mega Menu + Slider --- */}
        <HeroBanner />

        {/* --- SERVICE BENEFITS --- */}
    

        {/* --- FLASH SALE SECTION --- */}
        {/* --- BRAND CATEGORIES --- */}
        

        {/* --- PRODUCT TABS SECTION --- */}
        <ProductTabs />
        <BrandCategories />

      </main>

      {/* --- FOOTER --- */}
      <EcommerceFooter />

      {/* --- MODALS & DRAWERS --- */}
      <ShoppingCartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cart}
        onRemove={removeFromCart}
        onUpdateQuantity={updateQuantity}
        total={getCartTotal()}
      />

      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
      />

    </div>
  );
}