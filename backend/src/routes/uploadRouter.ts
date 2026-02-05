import { Router } from "express";
import multer from "multer";
import {
  uploadFile,
  readFile,
  readFiles,
  deleteFile,
  downloadFile,
} from "../controllers/uploadController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { uploadLimiter } from "../utils/rateLimit.js";

const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (_req, file, cb) => {
    const allowedMimeTypes = ["audio/mpeg"];

    if (!allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error("Mime type not allowed"));
    }

    cb(null, true);
  },
  limits: {
    fileSize: 1024 * 1024 * 200, // 200MB
  },
});

export const uploadRouter = Router();

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Upload a file
 *     tags: [Files]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: File uploaded successfully
 *       400:
 *         description: File required
 *       401:
 *         description: Unauthorized
 */
uploadRouter.post("/", authMiddleware, uploadLimiter, upload.single("file"), uploadFile);

/**
 * @swagger
 * /api/upload/files:
 *   get:
 *     summary: Get all user files
 *     tags: [Files]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: List of files
 *       401:
 *         description: Unauthorized
 */
uploadRouter.get("/files", authMiddleware, readFiles);

/**
 * @swagger
 * /api/upload/files/{id}:
 *   get:
 *     summary: Get a single file
 *     tags: [Files]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: File details
 *       404:
 *         description: File not found
 */
uploadRouter.get("/files/:id", authMiddleware, readFile);

/**
 * @swagger
 * /api/upload/files/{id}:
 *   delete:
 *     summary: Delete a file
 *     tags: [Files]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: File deleted
 *       404:
 *         description: File not found
 */
uploadRouter.delete("/files/:id", authMiddleware, deleteFile);

/**
 * @swagger
 * /api/upload/files/{id}/download:
 *   get:
 *     summary: Download a file
 *     tags: [Files]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Redirects to Cloudinary URL
 *       404:
 *         description: File not found
 */
uploadRouter.get("/files/:id/download", authMiddleware, downloadFile);
