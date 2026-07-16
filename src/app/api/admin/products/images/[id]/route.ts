import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// PUT - Cập nhật hình ảnh
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const data = await request.json();

    // Nếu đặt làm ảnh chính, bỏ ảnh chính cũ
    if (data.isMain) {
      const image = await prisma.productImage.findUnique({
        where: { id },
        select: { productId: true },
      });
      if (image) {
        await prisma.productImage.updateMany({
          where: { productId: image.productId, isMain: true },
          data: { isMain: false },
        });
      }
    }

    const image = await prisma.productImage.update({
      where: { id },
      data: {
        url: data.url,
        isMain: data.isMain ?? false,
      },
    });

    return NextResponse.json({ success: true, image });
  } catch (error) {
    console.error("Error updating image:", error);
    return NextResponse.json(
      { error: "Failed to update image" },
      { status: 500 }
    );
  }
}

// DELETE - Xóa hình ảnh
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { id } = await params;

    await prisma.productImage.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}