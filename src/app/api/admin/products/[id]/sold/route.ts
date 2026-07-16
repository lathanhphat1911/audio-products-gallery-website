import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

// PATCH - Cập nhật trạng thái sold của sản phẩm
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const { id } = await params;
    const { isSold } = await request.json();

    const product = await prisma.product.update({
      where: { id },
      data: { isSold },
    });

    revalidatePath("/admin/products");
    revalidatePath("/admin");
    revalidatePath("/api/products");

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("Error updating sold status:", error);
    return NextResponse.json(
      { error: "Không thể cập nhật trạng thái sold" },
      { status: 500 }
    );
  }
}