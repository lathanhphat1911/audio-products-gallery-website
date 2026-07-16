"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useFieldArray, FormProvider } from "react-hook-form";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Plus, Trash2, Loader2, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductFormProps {
  brands: { id: string; name: string }[];
  categories: { id: string; name: string }[];
}

interface ProductFormData {
  name: string;
  slug: string;
  description: string;
  brandId: string;
  categoryId: string;
  price: number;
  originalPrice: number | string;
  badge: string;
  gift: string;
  features: string;
  imageType: string;
  images: Array<{ url: string; isMain: boolean }>;
}

export function ProductForm({ brands, categories }: ProductFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const methods = useForm<ProductFormData>({
    defaultValues: {
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
      imageType: "headphones",
      images: [],
    },
  });

  const { register, handleSubmit, control, formState: { errors }, setValue, watch } = methods;
  const images = watch("images");

  const uploadImages = async (files: FileList) => {
    setIsUploading(true);
    try {
      const fileArray = Array.from(files);
      const formData = new FormData();

      fileArray.forEach((file) => formData.append("file", file));
      formData.append("folder", "products");

      const response = await fetch("/api/admin/upload/multiple", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        const newImages = data.urls.map((url: string, index: number) => ({
          url,
          isMain: images.length === 0 && index === 0,
        }));
        setValue("images", [...images, ...newImages]);
      }
    } catch (error) {
      console.error("Upload error:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setValue("images", newImages);
  };

  const handleSetMainImage = (index: number) => {
    const newImages = images.map((img, i) => ({ ...img, isMain: i === index }));
    setValue("images", newImages);
  };

  const onSubmit = async (data: ProductFormData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          price: Number(data.price),
          originalPrice: data.originalPrice ? Number(data.originalPrice) : null,
          features: data.features.split("\n").filter(Boolean),
          images: data.images,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        router.push("/admin/products");
        router.refresh();
      } else {
        alert("Lỗi: " + (result.error || "Có lỗi xảy ra"));
      }
    } catch (error) {
      alert("Không thể kết nối tới server");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Product Info */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Thông tin sản phẩm
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Tên sản phẩm
              </label>
              <input
                {...register("name")}
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
                {...register("slug")}
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
                {...register("brandId")}
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
                {...register("categoryId")}
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
                Loại ảnh
              </label>
              <select
                {...register("imageType")}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              >
                <option value="headphones">Tai nghe</option>
                <option value="speaker-tall">Loa cao</option>
                <option value="speaker-portable">Loa di động</option>
                <option value="amplifier">Amply</option>
                <option value="cable">Cáp</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Giá bán
              </label>
              <input
                {...register("price")}
                type="number"
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
                {...register("originalPrice")}
                type="number"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                min="0"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Mô tả
            </label>
            <textarea
              {...register("description")}
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              placeholder="Nhập mô tả..."
            />
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tính năng (mỗi dòng 1 tính năng)
            </label>
            <textarea
              {...register("features")}
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
              placeholder="Chống ồn ANC&#10;Driver Beryllium 40mm"
            />
          </div>
        </div>

        {/* Images Upload */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Hình ảnh sản phẩm
          </h2>

          <div
            onDrop={(e) => {
              e.preventDefault();
              uploadImages(e.dataTransfer.files);
            }}
            onDragOver={(e) => e.preventDefault()}
            className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-6 text-center mb-4"
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
              onChange={(e) => e.target.files && uploadImages(e.target.files)}
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

          {images.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {images.map((image, index) => (
                <div
                  key={index}
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
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-1 right-1 p-0.5 bg-red-500 rounded-full"
                  >
                    <Trash2 className="w-3 h-3 text-white" />
                  </button>
                  {!image.isMain && (
                    <button
                      type="button"
                      onClick={() => handleSetMainImage(index)}
                      className="absolute top-1 left-1 p-0.5 bg-blue-600 rounded-full"
                    >
                      <span className="text-white text-[10px]">★</span>
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg"
          >
            Hủy
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
            Lưu sản phẩm
          </button>
        </div>
      </form>
    </FormProvider>
  );
}