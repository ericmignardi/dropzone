import type { Request, Response } from "express";
import * as uploadService from "../services/uploadService.js";
import { fileIdSchema } from "../types/file/index.js";

export const uploadFile = async (req: Request, res: Response) => {
  try {
    if (!req.file) return res.status(400).json({ message: "File required" });
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const { userId } = req.user;

    const file = await uploadService.uploadFile(req.file, userId);

    res.status(201).json({ file });
  } catch (error) {
    console.error("Error in uploadFile (uploadController): ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const readFiles = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const { userId } = req.user;

    const files = await uploadService.readFiles(userId);

    res.status(200).json({ files });
  } catch (error) {
    console.error("Error in readFiles (uploadController): ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const readFile = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const parsed = fileIdSchema.safeParse(req.params);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid file ID" });
    }

    const { userId } = req.user;
    const file = await uploadService.readFile(userId, parsed.data.id);

    res.status(200).json({ file });
  } catch (error) {
    console.error("Error in readFile (uploadController): ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const deleteFile = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const parsed = fileIdSchema.safeParse(req.params);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid file ID" });
    }

    const { userId } = req.user;
    await uploadService.deleteFile(userId, parsed.data.id);

    res.status(204).send();
  } catch (error) {
    console.error("Error in deleteFile (uploadController): ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const downloadFile = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const parsed = fileIdSchema.safeParse(req.params);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid file ID" });
    }

    const { userId } = req.user;
    const file = await uploadService.downloadFile(userId, parsed.data.id);

    res.redirect(file.cloudinaryUrl);
  } catch (error) {
    console.error("Error in downloadFile (uploadController): ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
