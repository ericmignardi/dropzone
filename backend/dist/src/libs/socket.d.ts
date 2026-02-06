import type { Server } from "socket.io";
import type { File, ShareLink } from "../../generated/prisma/client.js";
export declare const initSocket: (socketServer: Server) => void;
export declare const emitFileUploaded: (userId: string, file: File) => void;
export declare const emitFileDeleted: (userId: string, fileId: string) => void;
export declare const emitShareCreated: (userId: string, link: Omit<ShareLink, "password">) => void;
export declare const emitFileAccessed: (userId: string, fileId: string, views: number) => void;
//# sourceMappingURL=socket.d.ts.map