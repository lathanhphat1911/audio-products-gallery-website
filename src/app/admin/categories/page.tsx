import { prisma } from "@/lib/prisma";
import { Plus } from "lucide-react";
import Link from "next/link";

interface CategoryWithCount {
  id: string;
  name: string;
  slug: string;
  _count: {
    products: number;
  };
}

async function getCategories(): Promise<CategoryWithCount[]> {
  const categories = await prisma.category.findMany({
    include: {
      _count: {
        select: { products: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return categories;
}

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Quản lý Danh mục
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Quản lý danh mục sản phẩm
          </p>
        </div>

        <Link
          href="/admin/categories/new"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
        >
          <Plus className="w-4 h-4" />
          Thêm danh mục
        </Link>
      </div>

      {/* Categories Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                Tên danh mục
              </th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                Slug
              </th>
              <th className="text-left px-6 py-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                Số sản phẩm
              </th>
              <th className="text-right px-6 py-4 text-sm font-medium text-gray-700 dark:text-gray-300">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                  Chưa có danh mục nào
                </td>
              </tr>
            ) : (
              categories.map((category) => (
                <tr
                  key={category.id}
                  className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
                >
                  <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">
                    {category.name}
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                    {category.slug}
                  </td>
                  <td className="px-6 py-4 text-gray-600 dark:text-gray-400">
                    {category._count.products} sản phẩm
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link
                      href={`/admin/categories/${category.id}`}
                      className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                    >
                      Chỉnh sửa
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}