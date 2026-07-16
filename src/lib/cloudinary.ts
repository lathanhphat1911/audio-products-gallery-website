import { v2 as cloudinary } from "cloudinary";

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export { cloudinary };

/**
 * Upload file lên Cloudinary
 * @param buffer - File buffer
 * @param folder - Thư mục lưu trên Cloudinary (ví dụ: "products", "variants")
 * @returns URL string của ảnh đã upload
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  folder: string = "aurasound"
): Promise<string> {
  const result = await new Promise<string>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        transformation: [
          { quality: "auto", fetch_format: "auto" },
        ],
      },
      (error, result) => {
        if (error) reject(error);
        else if (result) resolve(result.secure_url);
        else reject(new Error("Upload failed"));
      }
    );

    uploadStream.end(buffer);
  });

  return result;
}

/**
 * Upload multiple files lên Cloudinary
 */
export async function uploadMultipleToCloudinary(
  files: Array<{ buffer: Buffer; filename: string }>,
  folder: string
): Promise<string[]> {
  const uploadPromises = files.map((file) => uploadToCloudinary(file.buffer, folder));
  return Promise.all(uploadPromises);
}