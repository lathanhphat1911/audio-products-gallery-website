import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { brandSchema } from "@/lib/validations";

// GET /api/admin/brands/:id - Lấy chi tiết thương hiệu
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const brand = await prisma.brand.findUnique({
      where: { id },
    });

    if (!brand) {
      return NextResponse.json(
        {
          success: false,
          error: "Không tìm thấy thương hiệu",
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: brand,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching brand:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Không thể lấy thông tin thương hiệu",
      },
      { status: 500 }
    );
  }
}

// PUT /api/admin/brands/:id - Cập nhật thương hiệu
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const validatedData = brandSchema.parse(body);

    // Kiểm tra thương hiệu tồn tại
    const existingBrand = await prisma.brand.findUnique({
      where: { id },
    });

    if (!existingBrand) {
      return NextResponse.json(
        {
          success: false,
          error: "Không tìm thấy thương hiệu",
        },
        { status: 404 }
      );
    }

    // Kiểm tra slug trùng (nếu slug thay đổi)
    if (validatedData.slug !== existingBrand.slug) {
      const slugExists = await prisma.brand.findUnique({
        where: { slug: validatedData.slug },
      });

      if (slugExists) {
        return NextResponse.json(
          {
            success: false,
            error: "Slug thương hiệu đã tồn tại",
          },
          { status: 400 }
        );
      }
    }

    // Cập nhật thương hiệu
    const brand = await prisma.brand.update({
      where: { id },
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
        message: "Cập nhật thương hiệu thành công",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating brand:", error);

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
        error: "Không thể cập nhật thương hiệu",
      },
      { status: 500 }
    );
  }
}