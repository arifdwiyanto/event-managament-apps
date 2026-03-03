import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import { cloudinary } from "../config/cloudinary.js";

// Generic Multer Storage Factory for Cloudinary
export const uploadcloudinaryImage = (subfolder: string) => {
  const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
      return {
        folder: `event_management_assets/${subfolder}`,
        allowed_formats: ["jpeg", "png", "jpg", "webp"],
      };
    },
  });
  
  return multer({ storage });
};

// Helper to delete an image by its URL
export const deleteCloudinaryImage = async (imageUrl: string) => {
  try {
    if (!imageUrl || !imageUrl.includes("cloudinary.com")) return;

    const parts = imageUrl.split("/");
    const filename = parts.pop()?.split(".")[0];
    const folderIndex = parts.findIndex((p) => p === "event_management_assets");
    
    if (filename && folderIndex !== -1) {
      const folderString = parts.slice(folderIndex).join("/");
      const publicId = `${folderString}/${filename}`;
      await cloudinary.uploader.destroy(publicId);
      console.log(`Deleted old Cloudinary image: ${publicId}`);
    }
  } catch (error) {
    console.error("Failed to delete old image from Cloudinary:", error);
  }
};
