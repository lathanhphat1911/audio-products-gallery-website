import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { brandSchema } from "@/lib/validations";

// POST /api/admin/brands - Tạo thương hiệu mới
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = brandSchema.parse(body);

    // Kiểm tra slug đã tồn tại chưa
    const existingBrand = await prisma.brand.findUnique({
      where: { slug: validatedData.slug },
    });

    if (existingBrand) {
      return NextResponse.json(
        {
          success: false,
          error: "Slug thương hiệu đã tồn tại",
        },
        { status: 400 }
      );
    }

    // Tạo thương hiệu mới
    const brand = await prisma.brand.create({
      data: {
        name: validatedData.name,
        slug: validatedData.slug,
        logoUrl: validatedData.logoUrl || null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: brand,
        message: "Tạo thương hiệu thành công",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating brand:", error);

    if (error instanceof Error && "issues" in error) {
      return NextResponse.json(
        {
          success: false,
          error: "Dữ liệu không hợp lệ",
          details: error,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Không thể tạo thương hiệu",
      },
      { status: 500 }
    );
  }
}