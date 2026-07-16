import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { productSchema } from "@/lib/validations";

// POST: Tạo sản phẩm mới
export async function POST(request: NextRequest) {
  const session = await auth();

  // Kiểm tra quyền ADMIN
  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const data = await request.json();

    // Tạo sản phẩm
    const product = await prisma.product.create({
      data: {
        name: data.name,
        slug: data.slug,
        description: data.description,
        brandId: data.brandId,
        categoryId: data.categoryId,
        categoryLabel: data.categoryLabel || "Chưa phân loại",
        price: data.price,
        originalPrice: data.originalPrice,
        badge: data.badge,
        gift: data.gift,
        features: data.features || [],
        imageType: data.imageType || "headphones",
        images: {
          create: (data.images || []).map((img: { url: string; isMain?: boolean; sortOrder?: number }, index: number) => ({
            url: img.url,
            isMain: img.isMain ?? index === 0,
            sortOrder: img.sortOrder ?? index,
          })),
        },
      },
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

// GET: Lấy danh sách sản phẩm với cursor-based pagination
export async function GET(request: NextRequest) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 403 }
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const search = searchParams.get("search") || "";
  const brandId = searchParams.get("brand") || "";
  const categoryId = searchParams.get("category") || "";
  const cursor = searchParams.get("cursor"); // cursor là id của record cuối cùng (base64 encoded)
  const limit = Math.min(parseInt(searchParams.get("limit") || "10", 10), 50); // Giới hạn max 50

  // Base where clause (không bao gồm cursor)
  const baseWhere: Record<string, unknown> = {};

  if (search) {
    baseWhere.OR = [
      { name: { contains: search, mode: "insensitive" } },
      { variants: { some: { sku: { contains: search, mode: "insensitive" } } } },
    ];
  }

  if (brandId) baseWhere.brandId = brandId;
  if (categoryId) baseWhere.categoryId = categoryId;

  // Where cho query pagination (bao gồm cursor)
  const where: Record<string, unknown> = { ...baseWhere };

  // Xây dựng cursor condition - chỉ dùng id vì UUID có thứ tự thời gian
  if (cursor) {
    try {
      const cursorId = Buffer.from(cursor, 'base64').toString('utf-8');
      // Đối với Prisma cursor-based manual:
      // Khi có filter (OR), cần combine bằng AND
      if (where.OR) {
        // Chuyển OR hiện tại thành một phần của AND mới
        const existingOr = where.OR;
        delete where.OR;
        where.AND = [
          ...(Array.isArray(existingOr) ? existingOr.map((cond: any) => ({ ...cond })) : [existingOr]),
          { id: { lt: cursorId } },
        ];
      } else {
        where.id = { lt: cursorId };
      }
    } catch (e) {
      // Nếu cursor không hợp lệ, bỏ qua
    }
  }

  // Lấy limit + 1 để biết có next page không
  const products = await prisma.product.findMany({
    where,
    include: {
      brand: { select: { id: true, name: true, slug: true } },
      category: { select: { id: true, name: true, slug: true } },
      images: {
        orderBy: { sortOrder: "asc" },
        take: 1, // Chỉ lấy ảnh đầu tiên cho danh sách
      },
    },
    take: limit + 1,
    orderBy: { id: "desc" },
  });

  // Kiểm tra hasNext và tạo next cursor
  const hasNext = products.length > limit;
  const slicedProducts = hasNext ? products.slice(0, limit) : products;
  const nextCursor = hasNext
    ? Buffer.from(products[limit].id).toString('base64')
    : null;

  // Format response thêm imageUrl
  const formattedProducts = slicedProducts.map((product: any) => ({
    ...product,
    imageUrl: product.images?.[0]?.url || null,
  }));

  // Tùy chọn: Lấy total count (có thể bỏ qua nếu không cần để tăng hiệu năng)
  // Chỉ đếm khi không có cursor (trang đầu tiên) để tránh truy vấn dư thừa
  let total: number | undefined;
  if (!cursor) {
    total = await prisma.product.count({ where: baseWhere });
  }

  return NextResponse.json({
    success: true,
    data: formattedProducts,
    pagination: {
      limit,
      nextCursor,
      hasNext,
      ...(total !== undefined && { total }),
    },
  });
}