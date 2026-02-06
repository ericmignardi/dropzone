import jwt from "jsonwebtoken";
export const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    if (!token)
        return res.status(401).json({ message: "Unauthorized - Token Required" });
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch (error) {
        return res.status(401).json({ error: "Invalid token" });
    }
};
//# sourceMappingURL=authMiddleware.js.map