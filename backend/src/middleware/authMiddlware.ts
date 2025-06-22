// src/middleware/authMiddleware.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { db } from "../index";
import { usersTable } from "../modals/Schema";
import { eq } from "drizzle-orm";

export const authenticateToken = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        // Get token from cookies or Authorization header
        const token = req.cookies?.accessToken ||
            req.headers.authorization?.split(" ")[1];

        if (!token) {
            res.status(401).json({ message: "Authentication required" });
            return
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
            userId: number;
            email: string;
        };

        // Get user from database
        const [user] = await db.select().from(usersTable)
            .where(eq(usersTable.id, decoded.userId));

        if (!user) {
            res.status(401).json({ message: "Invalid token - user not found" });
            return
        }

        // Attach user to request
        req.user = {
            userId: user.id,
            email: user.email
        };

        next();
    } catch (error) {
        console.error("Authentication error:", error);

        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({ message: "Token expired" });
            return
        }

        if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({ message: "Invalid token" });
            return
        }

        res.status(500).json({ message: "Authentication failed" });
    }
};