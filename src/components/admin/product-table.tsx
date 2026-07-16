"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { Edit, Trash2, Package } from "lucide-react";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  isSold: boolean;
  price: number;
  originalPrice?: number | null;
  brand: {
    id: string;
    name: string;
    slug: string;
  };
  category: {
    id: string;
    name: string;
    slug: string;
  };
}

interface ProductTableProps {
  products: Product[];
  brands: { id: string; name: string }[];
  categories: { id: string; name: string }[];
}

export function ProductTable({ products, brands, categories }: ProductTableProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [search, setSearch] = useState(searchParams.get("search") || "");

  // Handle search with debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams);
      if (search) {
        params.set("search", search);
      } else {
        params.delete("search");
      }
      router.replace(`${pathname}?${params.toString()}`);
    }, 300);

    return () => clearTimeout(timer);
  }, [search, searchParams, pathname, router]);

  const handleEdit = (productId: string) => {
    router.push(`/admin/products/${productId}/edit`);
  };

  const handleDelete = (productId: string) => {
    if (confirm("Bạn có chắc muốn xóa sản phẩm này?")) {
      fetch(`/api/admin/products/${productId}`, { method: "DELETE" })
        .then(() => router.refresh());
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
      {/* Filters */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            />
          </div>
          <select
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            onChange={(e) => {
              const params = new URLSearchParams(searchParams);
              if (e.target.value) {
                params.set("brand", e.target.value);
              } else {
                params.delete("brand");
              }
              router.replace(`${pathname}?${params.toString()}`);
            }}
          >
            <option value="">Tất cả thương hiệu</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
          <select
            className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
            onChange={(e) => {
              const params = new URLSearchParams(searchParams);
              if (e.target.value) {
                params.set("category", e.target.value);
              } else {
                params.delete("category");
              }
              router.replace(`${pathname}?${params.toString()}`);
            }}
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-gray-700">
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                Sản phẩm
              </th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                Thương hiệu
              </th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                Danh mục
              </th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                Giá
              </th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                Đã bán
              </th>
              <th className="text-right px-6 py-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {products.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <Package className="w-12 h-12 text-gray-400 mb-2" />
                    <p className="text-gray-500 dark:text-gray-400">
                      Không có sản phẩm nào
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                >
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {product.name}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {product.slug}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-700 dark:text-gray-300">
                      {product.brand.name}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-700 dark:text-gray-300">
                      {product.category.name}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {formatPrice(product.price)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={async () => {
                        const confirmed = confirm(
                          product.isSold
                            ? "Bỏ đánh dấu đã bán?"
                            : "Đánh dấu đã bán?"
                        );
                        if (confirmed) {
                          try {
                            const response = await fetch(
                              `/api/admin/products/${product.id}/sold`,
                              {
                                method: "PATCH",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ isSold: !product.isSold }),
                              }
                            );
                            if (response.ok) {
                              window.location.reload();
                            }
                          } catch (error) {
                            console.error("Error updating sold status:", error);
                          }
                        }
                      }}
                      className={cn(
                        "px-2 py-1 text-xs font-medium rounded-full transition",
                        product.isSold
                          ? "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/40"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      )}
                    >
                      {product.isSold ? "Đã bán" : "Có sẵn"}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(product.id)}
                        className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
                        title="Chỉnh sửa"
                      >
                        <Edit className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition"
                        title="Xóa"
                      >
                        <Trash2 className="w-4 h-4 text-red-600 dark:text-red-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Hiển thị {products.length} sản phẩm
          </p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition disabled:opacity-50">
              Trước
            </button>
            <button className="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition disabled:opacity-50">
              Sau
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}