import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createProduct(data: {
  name: string;
  slug: string;
  description?: string;
  brandId: string;
  categoryId: string;
  price: number;
  originalPrice?: number | null;
  categoryLabel?: string;
  imageType?: string;
  badge?: string;
  gift?: string;
  features?: string[];
  images?: { url: string; isMain?: boolean }[];
}) {
  const product = await prisma.product.create({
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      brandId: data.brandId,
      categoryId: data.categoryId,
      price: data.price,
      originalPrice: data.originalPrice || null,
      categoryLabel: data.categoryLabel || "Chưa phân loại",
      imageType: data.imageType || "headphones",
      badge: data.badge,
      gift: data.gift,
      features: data.features || [],
      images: {
        create: (data.images || []).map((img, index) => ({
          url: img.url,
          isMain: img.isMain ?? index === 0,
        })),
      },
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/admin");

  return { success: true, product };
}

export async function updateProduct(id: string, data: {
  name?: string;
  slug?: string;
  description?: string;
  price?: number;
  originalPrice?: number | null;
  badge?: string;
  gift?: string;
  features?: string[];
}) {
  const product = await prisma.product.update({
    where: { id },
    data: {
      name: data.name,
      slug: data.slug,
      description: data.description,
      price: data.price,
      originalPrice: data.originalPrice,
      badge: data.badge,
      gift: data.gift,
      features: data.features,
    },
  });

  revalidatePath("/admin/products");
  revalidatePath("/admin");

  return { success: true, product };
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({
    where: { id },
  });

  revalidatePath("/admin/products");
  revalidatePath("/admin");

  return { success: true };
}

export async function updateProductSoldStatus(id: string, isSold: boolean) {
  const product = await prisma.product.update({
    where: { id },
    data: { isSold },
  });

  revalidatePath("/admin/products");
  revalidatePath("/admin");
  revalidatePath("/api/products");

  return { success: true, product };
}