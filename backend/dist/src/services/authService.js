import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../libs/prisma.js";
export const register = async (email, password, name) => {
    if (!email.trim() || !password.trim() || !name.trim())
        throw new Error("All fields required");
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser)
        throw new Error("Email already in use");
    const hashedPassword = await bcryptjs.hash(password, 10);
    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            name,
        },
    });
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
    return { user, token };
};
export const login = async (email, password) => {
    if (!email.trim() || !password.trim())
        throw new Error("All fields required");
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user)
        throw new Error("User not found");
    const isPasswordValid = await bcryptjs.compare(password, user.password);
    if (!isPasswordValid)
        throw new Error("Invalid credentials");
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
    return { user, token };
};
export const logout = async () => { };
export const verify = async () => { };
//# sourceMappingURL=authService.js.map