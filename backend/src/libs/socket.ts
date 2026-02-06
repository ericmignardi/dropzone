import type { Server } from "socket.io";
import type { File, ShareLink } from "../../generated/prisma/client.js";

let io: Server;

export const initSocket = (socketServer: Server) => {
  io = socketServer;
};

export const emitFileUploaded = (userId: string, file: File) => {
  io.emit(`file:uploaded:${userId}`, { file });
};

export const emitFileDeleted = (userId: string, fileId: string) => {
  io.emit(`file:deleted:${userId}`, { fileId });
};

export const emitShareCreated = (userId: string, link: Omit<ShareLink, "password">) => {
  io.emit(`share:created:${userId}`, { link });
};

export const emitFileAccessed = (userId: string, fileId: string, views: number) => {
  io.emit(`file:accessed:${userId}`, { fileId, views });
};
