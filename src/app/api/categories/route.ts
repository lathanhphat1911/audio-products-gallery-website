import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/categories - Lấy danh sách danh mục cho Mega Menu
export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    // Xây dựng cây danh mục
    const categoryTree = buildCategoryTree(categories);

    return NextResponse.json(
      {
        success: true,
        data: categoryTree,
      },
      {
        headers: {
          // Cache categories trong 1 giờ, phù hợp cho navigation
          "Cache-Control": "public, max-age=3600, stale-while-revalidate=7200",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Không thể lấy danh sách danh mục",
      },
      { status: 500 }
    );
  }
}

// Helper: Trả về danh sách categories phẳng (Model hiện tại không hỗ trợ parentId)
function buildCategoryTree(categories: any[]): any[] {
  return categories.map(cat => ({ ...cat, children: [] }));
}