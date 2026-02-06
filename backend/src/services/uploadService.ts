import cloudinary from "../libs/cloudinary.js";
import { prisma } from "../libs/prisma.js";
import type { File } from "../../generated/prisma/client.js";
import { emitFileDeleted, emitFileUploaded } from "../libs/socket.js";

export const uploadFile = async (file: Express.Multer.File, userId: string): Promise<File> => {
  // Convert buffer to base64 data URI for Cloudinary
  const base64 = file.buffer.toString("base64");
  const dataUri = `data:${file.mimetype};base64,${base64}`;

  const result = await cloudinary.uploader.upload(dataUri, {
    folder: "dropzone",
    resource_type: "auto",
  });

  const savedFile = await prisma.file.create({
    data: {
      name: result.public_id,
      originalName: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
      cloudinaryId: result.public_id,
      cloudinaryUrl: result.secure_url,
      userId,
    },
  });

  emitFileUploaded(userId, savedFile);

  return savedFile;
};

export const readFiles = async (userId: string): Promise<File[]> => {
  const files = await prisma.file.findMany({
    where: {
      userId,
    },
  });
  if (!files) throw new Error("Files do not exist");

  return files;
};

export const readFile = async (userId: string, fileId: string): Promise<File> => {
  const file = await prisma.file.findUnique({
    where: {
      id: fileId,
      userId,
    },
  });
  if (!file) throw new Error("File does not exist");

  return file;
};

export const deleteFile = async (userId: string, fileId: string): Promise<void> => {
  const file = await prisma.file.findUnique({
    where: { id: fileId, userId },
  });
  if (!file) throw new Error("File not found");

  // Determine resource_type based on mimeType
  let resourceType: "image" | "video" | "raw" = "image";
  if (file.mimeType.startsWith("video/") || file.mimeType.startsWith("audio/")) {
    resourceType = "video";
  } else if (file.mimeType === "application/pdf" || file.mimeType.startsWith("application/")) {
    resourceType = "raw";
  }

  // Delete from Cloudinary using the cloudinaryId
  await cloudinary.uploader.destroy(file.cloudinaryId, { resource_type: resourceType });

  await prisma.file.delete({
    where: { id: fileId },
  });

  emitFileDeleted(userId, fileId);
};

export const downloadFile = async (userId: string, fileId: string): Promise<File> => {
  const file = await prisma.file.findUnique({
    where: { id: fileId, userId },
  });
  if (!file) throw new Error("File not found");

  const updatedFile = await prisma.file.update({
    where: { id: fileId },
    data: { downloads: { increment: 1 } },
  });

  return updatedFile;
};
