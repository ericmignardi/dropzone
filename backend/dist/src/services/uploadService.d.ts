import type { File } from "../../generated/prisma/client.js";
export declare const uploadFile: (file: Express.Multer.File, userId: string) => Promise<File>;
export declare const readFiles: (userId: string) => Promise<File[]>;
export declare const readFile: (userId: string, fileId: string) => Promise<File>;
export declare const deleteFile: (userId: string, fileId: string) => Promise<void>;
export declare const downloadFile: (userId: string, fileId: string) => Promise<File>;
//# sourceMappingURL=uploadService.d.ts.map