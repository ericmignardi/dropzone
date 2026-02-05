import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { createLink, readLink } from "../controllers/shareController.js";
import { authLimiter } from "../utils/rateLimit.js";

export const shareRouter = Router();

/**
 * @swagger
 * /api/share/{id}:
 *   post:
 *     summary: Create a share link for a file
 *     tags: [Share]
 *     security:
 *       - cookieAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: File ID to share
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 description: Optional password protection
 *               expiresAt:
 *                 type: string
 *                 format: date-time
 *                 description: Optional expiration date
 *     responses:
 *       201:
 *         description: Share link created
 *       404:
 *         description: File not found
 */
shareRouter.post("/:id", authMiddleware, authLimiter, createLink);

/**
 * @swagger
 * /api/share/{shortCode}:
 *   get:
 *     summary: Access a shared file
 *     tags: [Share]
 *     parameters:
 *       - in: path
 *         name: shortCode
 *         required: true
 *         description: Share link short code
 *         schema:
 *           type: string
 *       - in: query
 *         name: password
 *         description: Password if link is protected
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Redirects to file
 *       401:
 *         description: Password required or invalid
 *       410:
 *         description: Link expired
 */
shareRouter.get("/:id", readLink);
