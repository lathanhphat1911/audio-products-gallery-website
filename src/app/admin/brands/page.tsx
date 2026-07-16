import { prisma } from "@/lib/prisma";
import { Plus, ShoppingBag } from "lucide-react";
import Link from "next/link";

interface BrandWithCount {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  _count: {
    products: number;
  };
}

async function getBrands(): Promise<BrandWithCount[]> {
  const brands = await prisma.brand.findMany({
    include: {
      _count: {
        select: { products: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return brands;
}

export default async function BrandsPage() {
  const brands = await getBrands();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Quản lý Thương hiệu
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Quản lý thương hiệu sản phẩm
          </p>
        </div>

        <Link
          href="/admin/brands/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
        >
          <Plus className="w-4 h-4" />
          Thêm thương hiệu
        </Link>
      </div>

      {/* Brands Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {brands.length === 0 ? (
          <div className="col-span-full text-center py-12 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700">
            <ShoppingBag className="w-12 h-12 mx-auto mb-2 text-gray-400" />
            <p className="text-gray-500 dark:text-gray-400">
              Chưa có thương hiệu nào
            </p>
          </div>
        ) : (
          brands.map((brand) => (
            <div
              key={brand.id}
              className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-md transition"
            >
              <div className="flex items-center gap-4">
                {brand.logoUrl ? (
                  <img
                    src={brand.logoUrl}
                    alt={brand.name}
                    className="w-16 h-16 object-contain rounded-lg"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 text-gray-500" />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {brand.name}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {brand._count.products} sản phẩm
                  </p>
                </div>
                <Link
                  href={`/admin/brands/${brand.id}`}
                  className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                >
                  Chỉnh sửa
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}