import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// DTO cho danh sách sản phẩm (catalogue view)
interface ProductCatalogueDTO {
  id: string;
  name: string;
  slug: string;
  price: number;
  originalPrice: number | null;
  badge: string | null;
  rating: number | null;
  reviewsCount: number | null;
  imageType: string;
  imageUrl: string | null;
  isSold: boolean;
  category: {
    id: string;
    name: string;
    slug: string;
  };
  brand: {
    id: string;
    name: string;
    slug: string;
  };
}

// GET /api/products - Lấy danh sách sản phẩm với cursor-based pagination
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get("category");
    const brand = searchParams.get("brand");
    const cursorId = searchParams.get("cursor");
    const limit = Math.min(parseInt(searchParams.get("limit") || "20", 10), 100);

    // Build where clause - chỉ lấy sản phẩm còn bán
    const whereClause: any = {
      isSold: false,
    };
    if (category) {
      whereClause.category = { slug: category };
    }
    if (brand) {
      whereClause.brand = { slug: brand };
    }

    // Cursor condition
    if (cursorId) {
      whereClause.id = { lt: cursorId };
    }

    // Fetch products với thông tin tối giản
    const products = await prisma.product.findMany({
      where: whereClause,
      include: {
        brand: { select: { id: true, name: true, slug: true } },
        category: { select: { id: true, name: true, slug: true } },
        images: {
          orderBy: { sortOrder: "asc" },
          take: 1, // Chỉ lấy ảnh đầu tiên cho danh sách
        },
      },
      take: limit + 1,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
    });

    // Check has next page
    const hasNext = products.length > limit;
    const slicedProducts = hasNext ? products.slice(0, limit) : products;

    // Format response - chỉ trả về fields cần thiết cho catalogue
    const formattedProducts: ProductCatalogueDTO[] = slicedProducts.map(
      (product) => ({
        id: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        originalPrice: product.originalPrice,
        badge: product.badge,
        rating: product.rating,
        reviewsCount: product.reviewsCount,
        imageType: product.imageType,
        imageUrl: product.images?.[0]?.url || null,
        isSold: product.isSold || false,
        category: product.category,
        brand: product.brand,
      })
    );

    const nextCursor = hasNext ? slicedProducts[slicedProducts.length - 1]?.id : null;

    return NextResponse.json({
      success: true,
      data: formattedProducts,
      pagination: {
        limit,
        nextCursor,
        hasNext,
      },
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Không thể lấy danh sách sản phẩm",
      },
      { status: 500 }
    );
  }
}