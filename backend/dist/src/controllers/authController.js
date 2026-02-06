import * as authService from "../services/authService.js";
import { registerSchema, loginSchema } from "../types/auth/index.js";
export const register = async (req, res) => {
    try {
        const parsed = registerSchema.safeParse(req.body);
        if (!parsed.success)
            return res.status(400).json({ message: "All fields required" });
        const { user, token } = await authService.register(parsed.data.email, parsed.data.password, parsed.data.name);
        if (!user || !token)
            return res.status(404).json({ message: "User or token not found" });
        res.cookie("token", token, {
            maxAge: 60 * 60 * 24 * 1000,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
            httpOnly: true,
        });
        const { password: userPassword, ...sanitizedUser } = user;
        res.status(201).json({ user: sanitizedUser, token });
    }
    catch (error) {
        console.error("Error in register (authController): ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
export const login = async (req, res) => {
    try {
        const parsed = loginSchema.safeParse(req.body);
        if (!parsed.success)
            return res.status(400).json({ message: "All fields required" });
        const { user, token } = await authService.login(parsed.data.email, parsed.data.password);
        if (!user || !token)
            return res.status(404).json({ message: "User or token not found" });
        res.cookie("token", token, {
            maxAge: 60 * 60 * 24 * 1000,
            sameSite: "strict",
            secure: process.env.NODE_ENV === "production",
            httpOnly: true,
        });
        const { password: userPassword, ...sanitizedUser } = user;
        res.status(200).json({ user: sanitizedUser, token });
    }
    catch (error) {
        console.error("Error in login (authController): ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
export const logout = async (req, res) => {
    try {
        res.clearCookie("token");
        res.status(200).json({ message: "Logged out successfully" });
    }
    catch (error) {
        console.error("Error in logout (authController): ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
export const verify = async (req, res) => {
    try {
        res.status(200).json({ user: req.user });
    }
    catch (error) {
        console.error("Error in logout (authController): ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
//# sourceMappingURL=authController.js.map