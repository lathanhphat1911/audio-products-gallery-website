"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Loader2, Upload } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  originalPrice: number | null;
  badge: string | null;
  gift: string | null;
  features: string[];
  images: Array<{ id: string; url: string; isMain: boolean }>;
  brand: { id: string; name: string };
  category: { id: string; name: string };
  isSold: boolean;
}

interface Brand {
  id: string;
  name: string;
}

interface Category {
  id: string;
  name: string;
}

export default function EditProductPage() {
  const router = useRouter();
  const params = useParams();
  const productId = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    brandId: "",
    categoryId: "",
    price: 0,
    originalPrice: "",
    badge: "",
    gift: "",
    features: "",
    isSold: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch product data
        const productRes = await fetch(`/api/admin/products/${productId}`);
        const productResult = await productRes.json();

        if (!productRes.ok) {
          throw new Error(productResult.error || "Không thể tải sản phẩm");
        }

        const productData = productResult.data;
        setProduct(productData);
        setFormData({
          name: productData.name,
          slug: productData.slug,
          description: productData.description || "",
          brandId: productData.brand?.id || "",
          categoryId: productData.category?.id || "",
          price: productData.price,
          originalPrice: productData.originalPrice
            ? String(productData.originalPrice)
            : "",
          badge: productData.badge || "",
          gift: productData.gift || "",
          features: (productData.features || []).join("\n"),
          isSold: productData.isSold ?? false,
        });

        // Fetch brands and categories
        const [brandsRes, categoriesRes] = await Promise.all([
          fetch("/api/brands"),
          fetch("/api/categories"),
        ]);

        const brandsData = await brandsRes.json();
        const categoriesData = await categoriesRes.json();

        if (brandsRes.ok) {
          setBrands(brandsData.data || []);
        }
        if (categoriesRes.ok) {
          setCategories(categoriesData.data || []);
        }
      } catch (error) {
        console.error("Error loading data:", error);
        setErrors({ submit: "Không thể tải dữ liệu sản phẩm" });
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      fetchData();
    }
  }, [productId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleImagesUpload = async (files: FileList) => {
    setIsUploading(true);
    try {
      const fileArray = Array.from(files);
      const formDataUpload = new FormData();

      fileArray.forEach((file) => formDataUpload.append("file", file));
      formDataUpload.append("folder", "products");

      const response = await fetch("/api/admin/upload/multiple", {
        method: "POST",
        body: formDataUpload,
      });

      const result = await response.json();
      if (result.success) {
        const uploadedImages = result.urls.map((url: string, index: number) => ({
          id: `new-${Date.now()}-${index}`,
          url,
          isMain: product?.images.length === 0 && index === 0,
        }));
        setProduct((prev) =>
          prev ? { ...prev, images: [...prev.images, ...uploadedImages] } : null
        );
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/admin/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: Number(formData.price),
          originalPrice: formData.originalPrice
            ? Number(formData.originalPrice)
            : null,
          features: formData.features.split("\n").filter(Boolean),
        }),
      });

      const result = await response.json();

      if (response.ok) {
        router.push("/admin/products");
        router.refresh();
      } else {
        setErrors({ submit: result.error || "Có lỗi xảy ra" });
      }
    } catch (error) {
      setErrors({ submit: "Không thể kết nối tới server" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">
          Không tìm thấy sản phẩm
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/products"
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-300" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Chỉnh sửa sản phẩm
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Cập nhật thông tin sản phẩm
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
      >
        {/* Product Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tên sản phẩm
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              placeholder="Nhập tên sản phẩm..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Slug
            </label>
            <input
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              placeholder="ten-san-pham"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Thương hiệu
            </label>
            <select
              name="brandId"
              value={formData.brandId}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              required
            >
              <option value="">Chọn thương hiệu</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Danh mục
            </label>
            <select
              name="categoryId"
              value={formData.categoryId}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              required
            >
              <option value="">Chọn danh mục</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Giá bán
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              min="0"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Giá cũ
            </label>
            <input
              type="number"
              name="originalPrice"
              value={formData.originalPrice}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              min="0"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Badge
            </label>
            <input
              type="text"
              name="badge"
              value={formData.badge}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              placeholder="Mới, Hot, Sale..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Quà tặng
            </label>
            <input
              type="text"
              name="gift"
              value={formData.gift}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              placeholder="Tên quà tặng..."
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Mô tả
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
            placeholder="Nhập mô tả..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tính năng (mỗi dòng 1 tính năng)
          </label>
          <textarea
            name="features"
            value={formData.features}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
            placeholder="Chống ồn ANC&#10;Driver Beryllium 40mm"
          />
        </div>

        {/* Sold Status Toggle */}
        <div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              name="isSold"
              checked={formData.isSold}
              onChange={(e) => setFormData((prev) => ({ ...prev, isSold: e.target.checked }))}
              className="w-5 h-5 text-blue-600 rounded"
            />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Đánh dấu đã bán (ẩn khỏi trang chủ & catalogue)
            </span>
          </label>
        </div>

        {/* Current Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Hình ảnh hiện tại
          </label>
          {product.images.length > 0 ? (
            <div className="flex flex-wrap gap-3">
              {product.images.map((image, index) => (
                <div
                  key={image.id}
                  className="relative w-24 h-24 rounded-lg overflow-hidden border-2"
                >
                  <img
                    src={image.url}
                    alt="Product"
                    className="w-full h-full object-cover"
                  />
                  {image.isMain && (
                    <span className="absolute bottom-0 left-0 right-0 bg-blue-600 text-white text-[10px] text-center py-0.5">
                      Ảnh chính
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Chưa có hình ảnh
            </p>
          )}
        </div>

        {/* Upload new images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Thêm hình ảnh mới
          </label>
          <div
            onDrop={(e) => {
              e.preventDefault();
              handleImagesUpload(e.dataTransfer.files);
            }}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center"
          >
            {isUploading ? (
              <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" />
            ) : (
              <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            )}
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => e.target.files && handleImagesUpload(e.target.files)}
              className="hidden"
              id="product-images-upload"
            />
            <label
              htmlFor="product-images-upload"
              className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer"
            >
              Chọn ảnh
            </label>
          </div>
        </div>

        {/* Error */}
        {errors.submit && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{errors.submit}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Link
            href="/admin/products"
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg"
          >
            Hủy
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSubmitting ? "Đang lưu..." : "Lưu sản phẩm"}
          </button>
        </div>
      </form>
    </div>
  );
}