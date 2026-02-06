import z from "zod";
export declare const createShareSchema: z.ZodObject<{
    password: z.ZodOptional<z.ZodString>;
    expiresAt: z.ZodOptional<z.ZodString>;
}, z.z.core.$strip>;
export declare const accessShareSchema: z.ZodObject<{
    id: z.ZodString;
}, z.z.core.$strip>;
//# sourceMappingURL=index.d.ts.map