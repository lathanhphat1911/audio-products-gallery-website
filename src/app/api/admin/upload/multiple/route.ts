import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { uploadMultipleToCloudinary } from "@/lib/cloudinary";

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const formData = await request.formData();
    const files: Array<{ buffer: Buffer; filename: string }> = [];
    const folder = (formData.get("folder") as string) || "variants";

    // Lấy tất cả files từ formData
    for (const [key, value] of formData.entries()) {
      if (key.startsWith("file") && value instanceof File) {
        const arrayBuffer = await value.arrayBuffer();
        files.push({
          buffer: Buffer.from(arrayBuffer),
          filename: value.name,
        });
      }
    }

    if (files.length === 0) {
      return NextResponse.json(
        { error: "No files provided" },
        { status: 400 }
      );
    }

    // Upload tất cả lên Cloudinary
    const urls = await uploadMultipleToCloudinary(files, folder);

    return NextResponse.json({ success: true, urls });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to upload images" },
      { status: 500 }
    );
  }
}