let io;
export const initSocket = (socketServer) => {
    io = socketServer;
};
export const emitFileUploaded = (userId, file) => {
    io.emit(`file:uploaded:${userId}`, { file });
};
export const emitFileDeleted = (userId, fileId) => {
    io.emit(`file:deleted:${userId}`, { fileId });
};
export const emitShareCreated = (userId, link) => {
    io.emit(`share:created:${userId}`, { link });
};
export const emitFileAccessed = (userId, fileId, views) => {
    io.emit(`file:accessed:${userId}`, { fileId, views });
};
//# sourceMappingURL=socket.js.map