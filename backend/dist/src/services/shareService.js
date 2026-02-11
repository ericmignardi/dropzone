import bcryptjs from "bcryptjs";
import { randomUUID } from "crypto";
import { prisma } from "../libs/prisma.js";
import { emitFileAccessed, emitShareCreated } from "../libs/socket.js";
export const createLink = async (userId, fileId, password, expiresAt) => {
    const file = await prisma.file.findUnique({ where: { id: fileId, userId } });
    if (!file)
        throw new Error("File does not exist");
    const shortCode = randomUUID().slice(0, 8);
    const hashedPassword = password ? await bcryptjs.hash(password, 10) : null;
    const expiration = expiresAt ? new Date(expiresAt) : null;
    const shareLink = await prisma.shareLink.create({
        data: {
            shortCode,
            password: hashedPassword,
            expiresAt: expiration,
            fileId,
        },
    });
    const { password: _, ...sanitizedLink } = shareLink;
    emitShareCreated(userId, sanitizedLink);
    return shareLink;
};
export const accessSharedFile = async (shortCode, password) => {
    const shareLink = await prisma.shareLink.findUnique({
        where: { shortCode },
        include: { file: true },
    });
    if (!shareLink)
        throw new Error("Share link not found");
    if (shareLink.expiresAt && shareLink.expiresAt < new Date()) {
        throw new Error("Link expired");
    }
    if (shareLink.password) {
        if (!password)
            throw new Error("Password required");
        const isValid = await bcryptjs.compare(password, shareLink.password);
        if (!isValid)
            throw new Error("Invalid password");
    }
    const updatedFile = await prisma.file.update({
        where: { id: shareLink.fileId },
        data: { views: { increment: 1 } },
    });
    emitFileAccessed(shareLink.file.userId, shareLink.fileId, updatedFile.views);
    return shareLink.file;
};
//# sourceMappingURL=shareService.js.map