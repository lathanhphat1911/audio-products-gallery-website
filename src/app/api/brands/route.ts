import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/brands - Lấy danh sách thương hiệu
export async function GET() {
  try {
    const brands = await prisma.brand.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        logoUrl: true,
      },
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: brands,
      },
      {
        headers: {
          "Cache-Control": "no-cache, no-store, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching brands:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Không thể lấy danh sách thương hiệu",
      },
      { status: 500 }
    );
  }
}