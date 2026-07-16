"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Headphones,
  Speaker,
  Volume2,
  ShoppingCart,
  Phone,
  Menu,
  X,
  ChevronDown,
  Sun,
  Moon,
} from "lucide-react";
import { useTheme } from "next-themes";

interface Category {
  id: string;
  name: string;
  slug: string;
  children?: Category[];
}

interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
}

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredNav, setHoveredNav] = useState<"products" | "brands" | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, systemTheme } = useTheme();
  const pathname = usePathname();
  const currentTheme = mounted ? (theme === "system" ? systemTheme : theme) : "light";

  // Fetch categories và brands từ API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setDataLoading(true);
        const [catRes, brandRes] = await Promise.allSettled([
          fetch("/api/categories"),
          fetch("/api/brands"),
        ]);

        if (catRes.status === "fulfilled") {
          const catData = await catRes.value.json();
          if (catData.success) setCategories(catData.data);
        }
        if (brandRes.status === "fulfilled") {
          const brandData = await brandRes.value.json();
          if (brandData.success) setBrands(brandData.data);
        }
      } catch (error) {
        console.error("Error fetching navigation data:", error);
      } finally {
        setDataLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle mounted state to prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const getCategoryIcon = (slug: string) => {
    const iconMap: Record<string, React.ElementType> = {
      "tai-nghe": Headphones,
      "loa": Speaker,
      "amply": Volume2,
      "phu-kien": ShoppingCart,
      "soundbar": Speaker,
      "dac": Volume2,
      "studio": Headphones,
    };
    return iconMap[slug] || Headphones;
  };

  const navItems = [
    { href: "/", label: "Trang Chủ" },
    { href: "/products", label: "Sản Phẩm" },
  ];

  return (
    <>
      {/* Desktop Header with Mega Menu */}
      <header
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
          scrolled
            ? "bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md border-b border-gray-200 dark:border-zinc-800 py-2 xs:py-3 sm:py-4 shadow-lg"
            : "bg-transparent py-3 xs:py-4 sm:py-5"
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 xs:px-4 md:px-6 flex items-center justify-between w-full">
          {/* Logo - iPhone SE optimized (320px) */}
          <Link href="/" className="flex items-center gap-1 xs:gap-1.5 sm:gap-2 group">
            <div className="relative w-7 xs:w-8 sm:w-9 h-7 xs:h-8 sm:h-9 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center shadow-[0_0_20px_rgba(245,158,11,0.3)]">
              <Headphones className="w-3.5 xs:w-4 sm:w-5 h-3.5 xs:h-4 sm:h-5 text-zinc-950 group-hover:scale-110 transition-transform duration-300" />
              <div className="absolute -inset-1 rounded-xl bg-amber-500/25 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div className="flex flex-col">
              <span className="text-sm xs:text-base sm:text-lg md:text-xl font-extrabold tracking-wider text-zinc-900 dark:text-white">
                THÀNH NAM AUDIO
              </span>
              <span className="hidden xs:inline-block text-[7px] xs:text-[8px] sm:text-[9px] text-amber-600 dark:text-amber-500 tracking-[0.15em] xs:tracking-[0.2em] uppercase font-bold -mt-0.5 xs:-mt-1">
                Hi-Fi Ref
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 text-sm font-semibold transition-colors ${
                  pathname === item.href || (pathname.startsWith("/products") && item.href === "/products")
                    ? "text-amber-600 dark:text-amber-500"
                    : "text-zinc-900 dark:text-zinc-100 hover:text-amber-600 dark:hover:text-amber-400"
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Mega Menu Categories */}
            <div
              className="relative py-2"
              onMouseEnter={() => setHoveredNav("products")}
              onMouseLeave={() => setHoveredNav(null)}
            >
              <button
                className={`px-4 py-2 text-sm font-semibold transition-colors flex items-center gap-1 ${
                  pathname.startsWith("/products") ? "text-amber-600 dark:text-amber-500" : "text-zinc-900 dark:text-zinc-100 hover:text-amber-600 dark:hover:text-amber-400"
                }`}
              >
                Danh Mục
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {/* Mega Menu Dropdown */}
              {hoveredNav === "products" && (
                <div className="absolute top-full left-0 mt-1 w-[800px] max-w-[calc(100vw-2rem)] bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-2xl z-50">
                  <div className="p-6">
                    <div className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-500 mb-4 px-2">
                      Danh Mục Sản Phẩm
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      {dataLoading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                          <div key={i} className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse"></div>
                        ))
                      ) : (
                        categories.map((cat) => {
                          const Icon = getCategoryIcon(cat.slug || cat.id);
                          return (
                            <Link
                              key={cat.id}
                              href={`/products?category=${cat.slug || cat.id}`}
                              className="flex items-center gap-2 text-zinc-900 dark:text-white font-bold text-sm hover:text-amber-600 dark:hover:text-amber-400 transition-colors py-1"
                            >
                              <Icon className="w-4 h-4 text-amber-600 dark:text-amber-500" />
                              {cat.name}
                            </Link>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Brands Mega Menu */}
            <div
              className="relative py-2"
              onMouseEnter={() => setHoveredNav("brands")}
              onMouseLeave={() => setHoveredNav(null)}
            >
              <button
                className={`px-4 py-2 text-sm font-semibold transition-colors flex items-center gap-1 ${
                  pathname.startsWith("/products") ? "text-amber-600 dark:text-amber-500" : "text-zinc-900 dark:text-zinc-100 hover:text-amber-600 dark:hover:text-amber-400"
                }`}
              >
                Thương Hiệu
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {/* Brands Dropdown */}
              {hoveredNav === "brands" && (
                <div className="absolute top-full left-0 mt-1 w-[600px] max-w-[calc(100vw-2rem)] bg-white dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-2xl shadow-2xl p-6 z-50">
                  {dataLoading ? (
                    <div className="grid grid-cols-3 gap-3">
                      {Array.from({ length: 9 }).map((_, i) => (
                        <div key={i} className="h-16 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse"></div>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                      {brands.map((brand) => (
                        <Link
                          key={brand.id}
                          href={`/products?brand=${brand.slug}`}
                          className="flex items-center justify-center p-3 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 hover:border-amber-500/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
                        >
                          {brand.logoUrl ? (
                            <img
                              src={brand.logoUrl}
                              alt={brand.name}
                              className="max-h-8 max-w-full object-contain"
                            />
                          ) : (
                            <span className="text-xs font-bold text-center text-zinc-700 dark:text-zinc-300">
                              {brand.name}
                            </span>
                          )}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </nav>

          {/* Desktop Actions */}
          <div className="hidden lg:flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={() => mounted && setTheme(currentTheme === "dark" ? "light" : "dark")}
              className="p-2 bg-zinc-200 dark:bg-zinc-800 hover:bg-zinc-300 dark:hover:bg-zinc-700 border border-gray-300 dark:border-zinc-700 rounded-xl transition-all"
              aria-label="Toggle theme"
            >
              {mounted && currentTheme === "dark" ? (
                <Sun className="w-5 h-5 text-amber-500" suppressHydrationWarning />
              ) : mounted ? (
                <Moon className="w-5 h-5 text-zinc-700" suppressHydrationWarning />
              ) : (
                <Moon className="w-5 h-5 text-zinc-700" />
              )}
            </button>

            {/* Hotline */}
            <div className="flex items-center gap-2 text-zinc-800 dark:text-zinc-300">
              <div className="p-2 bg-zinc-200 dark:bg-zinc-800 rounded-lg border border-gray-300 dark:border-zinc-700">
                <Phone className="w-4 h-4 text-amber-600 dark:text-amber-500" />
              </div>
              <div className="hidden md:flex flex-col">
                <span className="text-[10px] text-zinc-600 dark:text-zinc-400 font-semibold uppercase leading-3">Hotline 24/7</span>
                <span className="text-sm font-bold text-zinc-900 dark:text-white tracking-wide">1900.88.99.99</span>
              </div>
            </div>
          </div>

          {/* Mobile Actions - iPhone SE optimized (320px) */}
          <div className="flex lg:hidden items-center gap-1 xs:gap-1.5">
            {/* Theme Toggle */}
            <button
              onClick={() => mounted && setTheme(currentTheme === "dark" ? "light" : "dark")}
              className="p-1 xs:p-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-lg border border-gray-300 dark:border-zinc-700"
              aria-label="Toggle theme"
            >
              {mounted && currentTheme === "dark" ? (
                <Sun className="w-3.5 xs:w-4 h-3.5 xs:h-4 text-amber-500" suppressHydrationWarning />
              ) : mounted ? (
                <Moon className="w-3.5 xs:w-4 h-3.5 xs:h-4 text-zinc-700" suppressHydrationWarning />
              ) : (
                <Moon className="w-3.5 xs:w-4 h-3.5 xs:h-4 text-zinc-700" />
              )}
            </button>

            {/* Hamburger Menu */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-1 xs:p-1.5 bg-zinc-200 dark:bg-zinc-800 border border-gray-300 dark:border-zinc-700 rounded-lg"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-3.5 xs:w-4 h-3.5 xs:h-4 text-zinc-800 dark:text-zinc-200" />
              ) : (
                <Menu className="w-3.5 xs:w-4 h-3.5 xs:h-4 text-zinc-800 dark:text-zinc-200" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu - iPhone SE optimized */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-35 bg-white/95 dark:bg-zinc-950/95 pt-20 xs:pt-24 px-3 xs:px-4 md:px-6 flex flex-col w-full overflow-y-auto">
          <nav className="flex flex-col gap-2.5 xs:gap-3 text-base xs:text-lg font-bold w-full">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-zinc-800 dark:text-zinc-200 hover:text-amber-600 dark:hover:text-amber-500 border-b border-gray-200 dark:border-zinc-800 pb-1.5 xs:pb-2"
              >
                {item.label}
              </Link>
            ))}

            {/* Dynamic Categories in Mobile */}
            <div className="border-b border-gray-200 dark:border-zinc-800 pb-1.5 xs:pb-2">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-500 mb-2">
                Danh Mục
              </div>
              {dataLoading ? (
                <div className="space-y-2.5 xs:space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-3 xs:h-4 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse"></div>
                  ))}
                </div>
              ) : (
                categories.map((cat) => {
                  const Icon = getCategoryIcon(cat.slug || cat.id);
                  return (
                    <Link
                      key={cat.id}
                      href={`/products?category=${cat.slug || cat.id}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center gap-2 text-zinc-800 dark:text-zinc-200 hover:text-amber-600 dark:hover:text-amber-500 text-sm xs:text-base mb-2 last:mb-0"
                    >
                      <Icon className="w-3.5 xs:w-4 h-3.5 xs:h-4 text-amber-600 dark:text-amber-500" />
                      {cat.name}
                    </Link>
                  );
                })
              )}
            </div>

            {/* Brands in Mobile */}
            <div className="border-b border-gray-200 dark:border-zinc-800 pb-1.5 xs:pb-2">
              <div className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-500 mb-2">
                Thương Hiệu
              </div>
              {dataLoading ? (
                <div className="grid grid-cols-2 gap-2">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="h-8 xs:h-10 bg-zinc-200 dark:bg-zinc-800 rounded animate-pulse"></div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  {brands.map((brand) => (
                    <Link
                      key={brand.id}
                      href={`/products?brand=${brand.slug}`}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-center p-1.5 xs:p-2 bg-zinc-50 dark:bg-zinc-900 rounded-lg border border-gray-200 dark:border-zinc-800 hover:border-amber-500/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all"
                    >
                      {brand.logoUrl ? (
                        <img
                          src={brand.logoUrl}
                          alt={brand.name}
                          className="max-h-4 max-w-full object-contain"
                        />
                      ) : (
                        <span className="text-xs font-bold text-zinc-700 dark:text-zinc-300">
                          {brand.name}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Hotline in Mobile */}
            <div className="mt-auto mb-5 xs:mb-6 flex items-center gap-1.5 xs:gap-2 text-zinc-800 dark:text-zinc-300">
              <Phone className="w-3.5 xs:w-4 h-3.5 xs:h-4 text-amber-600 dark:text-amber-500" />
              <span className="text-sm xs:text-base font-bold text-zinc-900 dark:text-white">1900.88.99.99</span>
            </div>
          </nav>
        </div>
      )}
    </>
  );
}