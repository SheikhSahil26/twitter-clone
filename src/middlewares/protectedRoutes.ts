import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

// Ensure the secret is actually loaded
const JWT_SECRET_KEY = "JWT_SECRET_KEY"

export async function protectedRoutes(req: Request, res: Response, next: NextFunction) {
    const authHeader:any = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Unauthorized: Missing or malformed header" });
    }

    // Replace any potential extra quotes if they exist from localStorage mishaps
    const token = authHeader.split(" ")[1].replace(/^["'](.+)["']$/, '$1');

    if (!JWT_SECRET_KEY) {
        console.error("JWT_SECRET_KEY is missing in environment variables!");
        return res.status(500).json({ error: "Internal server configuration error" });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET_KEY);
        (req as any).user = decoded; 
        next();
    } catch (err: any) {
        console.error("JWT Verification Error:", err.message);
        return res.status(401).json({ 
            error: err.name === "TokenExpiredError" ? "Token expired" : "Invalid token" 
        });
    }
}
