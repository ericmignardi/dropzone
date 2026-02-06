import type { ShareLink, File } from "../../generated/prisma/client.js";
export declare const createLink: (userId: string, fileId: string, password?: string, expiresAt?: string) => Promise<ShareLink>;
export declare const accessSharedFile: (shortCode: string, password?: string) => Promise<File>;
//# sourceMappingURL=shareService.d.ts.map