import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { categorySchema } from "@/lib/validations";

// GET /api/admin/categories/:id - Lấy chi tiết danh mục
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const category = await prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      return NextResponse.json(
        {
          success: false,
          error: "Không tìm thấy danh mục",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: category,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching category:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Không thể lấy thông tin danh mục",
      },
      { status: 500 }
    );
  }
}

// PUT /api/admin/categories/:id - Cập nhật danh mục
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const validatedData = categorySchema.parse(body);

    // Kiểm tra danh mục tồn tại
    const existingCategory = await prisma.category.findUnique({
      where: { id },
    });

    if (!existingCategory) {
      return NextResponse.json(
        {
          success: false,
          error: "Không tìm thấy danh mục",
        },
        { status: 404 }
      );
    }

    // Kiểm tra slug trùng (nếu slug thay đổi)
    if (validatedData.slug !== existingCategory.slug) {
      const slugExists = await prisma.category.findUnique({
        where: { slug: validatedData.slug },
      });

      if (slugExists) {
        return NextResponse.json(
          {
            success: false,
            error: "Slug danh mục đã tồn tại",
          },
          { status: 400 }
        );
      }
    }

    // Cập nhật danh mục
    const category = await prisma.category.update({
      where: { id },
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
        message: "Cập nhật danh mục thành công",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating category:", error);

    if (error instanceof Error && "issues" in error) {
      const validationErrors: Record<string, string> = {};
      const zodError = error as { issues: Array<{ path: string[]; message: string }> };
      zodError.issues.forEach((issue) => {
        if (issue.path[0]) {
          validationErrors[issue.path[0]] = issue.message;
        }
      });

      return NextResponse.json(
        {
          success: false,
          error: "Dữ liệu không hợp lệ",
          details: validationErrors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Không thể cập nhật danh mục",
      },
      { status: 500 }
    );
  }
}