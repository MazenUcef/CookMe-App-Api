import { Request, Response } from "express";
import { db } from "../index";
import { usersTable } from "../modals/Schema";
import { eq } from "drizzle-orm";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Extend Express Request interface to include 'user'
declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: number;
                email?: string;
            };
        }
    }
}


// Cookie options
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

const SignUp = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body
        const existingUser = await db.select().from(usersTable)
            .where(eq(usersTable.email, email))
        if (existingUser.length > 0) {
            res.status(400).json({ message: "User Already Exists" })
            return
        }

        const hashedPassword = bcrypt.hashSync(password, 10)

        const [newUser] = await db.insert(usersTable).values({
            email,
            password: hashedPassword,
        }).returning();

        const accessToken = jwt.sign(
            { userId: newUser.id, email: newUser.email },
            process.env.JWT_SECRET as string,
            { expiresIn: '15m' }
        )

        const refreshToken = jwt.sign(
            { userId: newUser.id },
            process.env.JWT_REFRESH_SECRET as string,
            { expiresIn: '7d' }
        )


        await db.update(usersTable)
            .set({ refreshToken })
            .where(eq(usersTable.id, newUser.id))

        // Set cookies (optional - can be removed if using only local storage)
        res.cookie('accessToken', accessToken, cookieOptions);
        res.cookie('refreshToken', refreshToken, cookieOptions);


        res.status(201).json({
            message: "User created successfully",
            accessToken,
            refreshToken,
            user: {
                id: newUser.id,
                email: newUser.email
            }
        });
    } catch (error) {
        console.error("Signup error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


const SignIn = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const [user] = await db.select().from(usersTable)
            .where(eq(usersTable.email, email))


        if (!user) {
            res.status(401).json({ message: "Invalid credentials" });
            return
        }

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ message: "Invalid credentials" });
            return
        }

        // Generate tokens
        const accessToken = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET as string,
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            { userId: user.id },
            process.env.JWT_REFRESH_SECRET as string,
            { expiresIn: '7d' }
        );

        // Update user with refresh token
        await db.update(usersTable)
            .set({ refreshToken })
            .where(eq(usersTable.id, user.id));

        // Set cookies (optional - can be removed if using only local storage)
        res.cookie('accessToken', accessToken, cookieOptions);
        res.cookie('refreshToken', refreshToken, cookieOptions);

        res.status(200).json({
            message: "Login successful",
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email
            }
        });
    } catch (error) {
        console.error("Signin error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


const refreshToken = async (req: Request, res: Response) => {
    try {

        const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

        if (!refreshToken) {
            res.status(401).json({ message: "Refresh token required" });
            return
        }


        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET as string) as { userId: string };


        const [user] = await db.select().from(usersTable)
            .where(eq(usersTable.id, Number(decoded.userId)));

        if (!user || user.refreshToken !== refreshToken) {
            res.status(401).json({ message: "Invalid refresh token" });
            return
        }

        const newAccessToken = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET as string,
            { expiresIn: '15m' }
        );


        res.cookie('accessToken', newAccessToken, cookieOptions);

        res.status(200).json({
            accessToken: newAccessToken
        });
    } catch (error) {
        console.error("Refresh token error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}


const SignOut = async (req: Request, res: Response) => {
    try {
        const userId = req.user?.userId;

        if (userId) {
            await db.update(usersTable)
                .set({ refreshToken: null })
                .where(eq(usersTable.id, userId));
        }


        res.clearCookie('accessToken');
        res.clearCookie('refreshToken');

        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export default {
    SignIn,
    SignOut,
    SignUp,
    refreshToken
}