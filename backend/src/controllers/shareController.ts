import type { Request, Response } from "express";
import * as shareService from "../services/shareService.js";
import { fileIdSchema } from "../types/file/index.js";
import { createShareSchema } from "../types/share/index.js";

export const createLink = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const paramsParsed = fileIdSchema.safeParse(req.params);
    if (!paramsParsed.success) {
      return res.status(400).json({ message: "Invalid file ID" });
    }

    const bodyParsed = createShareSchema.safeParse(req.body);
    if (!bodyParsed.success) {
      return res.status(400).json({ message: "Invalid request body" });
    }

    const { userId } = req.user;
    const link = await shareService.createLink(
      userId,
      paramsParsed.data.id,
      bodyParsed.data.password,
      bodyParsed.data.expiresAt
    );

    const { password: linkPassword, ...sanitizedLink } = link;

    res.status(201).json({ link: sanitizedLink });
  } catch (error) {
    console.error("Error in createLink (shareController): ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const readLink = async (req: Request, res: Response) => {
  try {
    const shortCode = String(req.params.id);
    const password = typeof req.query.password === "string" ? req.query.password : undefined;

    const file = await shareService.accessSharedFile(shortCode, password);

    res.json({ url: file.cloudinaryUrl });
  } catch (error: any) {
    console.error("Error in readLink (shareController): ", error);

    if (error.message === "Link expired") {
      return res.status(410).json({ message: "Link has expired" });
    }
    if (error.message === "Password required" || error.message === "Invalid password") {
      return res.status(401).json({ message: error.message });
    }

    res.status(500).json({ message: "Internal Server Error" });
  }
};
