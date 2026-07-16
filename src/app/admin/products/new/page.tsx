import { prisma } from "@/lib/prisma";
import { ProductForm } from "./components/product-form";

async function getData() {
  const [brands, categories] = await Promise.all([
    prisma.brand.findMany({
      select: { id: true, name: true },
    }),
    prisma.category.findMany({
      select: { id: true, name: true },
    }),
  ]);

  return { brands, categories };
}

export default async function NewProductPage() {
  const { brands, categories } = await getData();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          Thêm sản phẩm mới
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Điền thông tin sản phẩm và các phiên bản
        </p>
      </div>

      <ProductForm brands={brands} categories={categories} />
    </div>
  );
}