import z from "zod";

export const createShareSchema = z.object({
  password: z.string().optional(),
  expiresAt: z.string().datetime().optional(),
});

export const accessShareSchema = z.object({
  id: z.string().min(1, "Short code required"),
});
