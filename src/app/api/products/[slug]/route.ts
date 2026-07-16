import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/products/[slug] - Chi tiết sản phẩm
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;

    const product = await prisma.product.findUnique({
      where: { slug },
      include: {
        brand: { select: { id: true, name: true } },
        category: { select: { id: true, name: true } },
        images: {
          orderBy: [{ isMain: "desc" }, { sortOrder: "asc" }],
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Product not found" },
        { status: 404 }
      );
    }

    // Không cho xem sản phẩm đã sold
    if (product.isSold) {
      return NextResponse.json(
        { success: false, error: "Sản phẩm đã ngừng kinh doanh" },
        { status: 403 }
      );
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}