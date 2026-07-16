import { z } from "zod";

// Schema validation cho form đăng nhập
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email là bắt buộc")
    .email("Email không hợp lệ"),
  password: z
    .string()
    .min(1, "Mật khẩu là bắt buộc")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
});

export type LoginInput = z.infer<typeof loginSchema>;

// Schema cho form đăng ký (tạo admin)
export const registerSchema = z.object({
  name: z.string().min(1, "Tên là bắt buộc"),
  email: z
    .string()
    .min(1, "Email là bắt buộc")
    .email("Email không hợp lệ"),
  password: z
    .string()
    .min(1, "Mật khẩu là bắt buộc")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  role: z.enum(["ADMIN", "CUSTOMER"]).default("CUSTOMER"),
});

export type RegisterInput = z.infer<typeof registerSchema>;

// Schema cho hình ảnh sản phẩm
export const productImageSchema = z.object({
  url: z.string().url("URL hình ảnh không hợp lệ"),
  isMain: z.boolean().default(false),
});

// Schema cho phiên bản sản phẩm
export const variantSchema = z.object({
  sku: z.string().min(1, "SKU là bắt buộc"),
  color: z.string().optional(),
  spec: z.string().optional(),
  // 🌟 Dùng z.coerce.number() để tự động biến string thành number
  price: z.coerce.number().min(0, "Giá phải là số dương"),
  oldPrice: z.coerce.number().min(0, "Giá cũ phải là số dương").optional().or(z.literal("")),
  stock: z.coerce.number().int().min(0, "Tồn kho không được âm"),
  status: z.enum(["AVAILABLE", "OUT_OF_STOCK", "PRE_ORDER"]).default("AVAILABLE"),
  images: z.array(productImageSchema).default([]),
});

// Schema cho tạo/sửa sản phẩm
export const productSchema = z.object({
  name: z.string().min(1, "Tên sản phẩm là bắt buộc"),
  slug: z.string().min(1, "Slug là bắt buộc"),
  description: z.string().optional(),
  thumbnailUrl: z.string().url("URL không hợp lệ").optional(),
  brandId: z.string().min(1, "Thương hiệu là bắt buộc"),
  categoryId: z.string().min(1, "Danh mục là bắt buộc"),
  variants: z.array(variantSchema).min(1, "Ít nhất một phiên bản sản phẩm là bắt buộc"),
});

export type ProductImageInput = z.infer<typeof productImageSchema>;
export type VariantInput = z.infer<typeof variantSchema>;
export type ProductInput = z.infer<typeof productSchema>;

// Schema cho Category
export const categorySchema = z.object({
  name: z.string().min(1, "Tên danh mục là bắt buộc"),
  slug: z.string().min(1, "Slug là bắt buộc"),
  parentId: z.string().optional(),
});

export type CategoryInput = z.infer<typeof categorySchema>;

// Schema cho Brand
export const brandSchema = z.object({
  name: z.string().min(1, "Tên thương hiệu là bắt buộc"),
  slug: z.string().min(1, "Slug là bắt buộc"),
  logoUrl: z.string().url("URL không hợp lệ").optional(),
});

export type BrandInput = z.infer<typeof brandSchema>;