import { prisma } from "@/lib/prisma";
import { MetricCard } from "@/components/admin/metric-card";
import { Package, Tags, ShoppingBag, BarChart3 } from "lucide-react";
import { ProductDistributionChart } from "./_components/product-distribution-chart";

async function getDashboardData() {
  const [productCount, categoryCount, brandCount, productsByCategory] =
    await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.brand.count(),
      prisma.product.groupBy({
        by: ["categoryId"],
        _count: {
          _all: true,
        },
      }),
    ]);

  // Lấy tên category để hiển thị trong chart
  const categoryIds = productsByCategory.map((p: { categoryId: string }) => p.categoryId);
  const categories = await prisma.category.findMany({
    where: {
      id: { in: categoryIds },
    },
    select: {
      id: true,
      name: true,
    },
  });

  const chartData = productsByCategory.map((item: { categoryId: string; _count: { _all: number } }) => {
    const category = categories.find((c) => c.id === item.categoryId);
    return {
      name: category?.name || "Unknown",
      value: item._count._all,
    };
  });

  return {
    productCount,
    categoryCount,
    brandCount,
    chartData,
  };
}

export default async function AdminDashboard() {
  const data = await getDashboardData();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Tổng quan
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Thống kê nhanh về hệ thống quản trị
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Tổng sản phẩm"
          value={data.productCount}
          icon={Package}
          change={{ value: 12, label: "so với tháng trước" }}
        />
        <MetricCard
          title="Danh mục"
          value={data.categoryCount}
          icon={Tags}
          change={{ value: 0, label: "Không thay đổi" }}
        />
        <MetricCard
          title="Thương hiệu"
          value={data.brandCount}
          icon={ShoppingBag}
          change={{ value: 2, label: "Thương hiệu mới" }}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProductDistributionChart data={data.chartData} />

        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Hoạt động gần đây
          </h3>
          <div className="space-y-4">
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <BarChart3 className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Chưa có dữ liệu hoạt động</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}