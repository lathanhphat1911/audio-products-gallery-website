import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/lib/validations";

// POST /api/admin/categories - Tạo danh mục mới
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = categorySchema.parse(body);

    // Kiểm tra slug đã tồn tại chưa
    const existingCategory = await prisma.category.findUnique({
      where: { slug: validatedData.slug },
    });

    if (existingCategory) {
      return NextResponse.json(
        {
          success: false,
          error: "Slug danh mục đã tồn tại",
        },
        { status: 400 }
      );
    }

    // Tạo danh mục mới
    const category = await prisma.category.create({
      data: {
        name: validatedData.name,
        slug: validatedData.slug,
        parentId: validatedData.parentId || null,
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: category,
        message: "Tạo danh mục thành công",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating category:", error);

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
        error: "Không thể tạo danh mục",
      },
      { status: 500 }
    );
  }
}