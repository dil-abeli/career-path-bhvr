import { Hono } from "hono";
import { db } from "../db";
import { users } from "../db/schema";
import { hashPassword, verifyPassword, generateToken } from "../utils/auth";
import { eq } from "drizzle-orm";
import type {
	RegisterRequest,
	LoginRequest,
	AuthResponse,
} from "shared";

export const authRouter = new Hono();

authRouter.post("/register", async (c) => {
	try {
		const body = await c.req.json<RegisterRequest>();
		const { email, password, fullName } = body;

		if (!email || !password || !fullName) {
			return c.json(
				{ error: "Missing required fields", success: false },
				400
			);
		}

		const existingUser = await db.query.users.findFirst({
			where: eq(users.email, email),
		});

		if (existingUser) {
			return c.json({ error: "Email already exists", success: false }, 409);
		}

		const passwordHash = await hashPassword(password);

		const newUsers = await db
			.insert(users)
			.values({
				email,
				passwordHash,
				fullName,
				currentLevel: "junior",
			})
			.returning();

		const newUser = newUsers[0];
		if (!newUser) {
			return c.json({ error: "Failed to create user", success: false }, 500);
		}

		const token = generateToken({ userId: newUser.id, email: newUser.email });

		const response: AuthResponse = {
			success: true,
			token,
			user: {
				id: newUser.id,
				email: newUser.email,
				fullName: newUser.fullName,
				currentLevel: newUser.currentLevel,
				targetLevel: newUser.targetLevel || undefined,
				avatarUrl: newUser.avatarUrl || undefined,
			},
		};

		return c.json(response, 201);
	} catch (error) {
		console.error("Registration error:", error);
		return c.json({ error: "Registration failed", success: false }, 500);
	}
});

authRouter.post("/login", async (c) => {
	try {
		const body = await c.req.json<LoginRequest>();
		const { email, password } = body;

		if (!email || !password) {
			return c.json(
				{ error: "Missing required fields", success: false },
				400
			);
		}

		const user = await db.query.users.findFirst({
			where: eq(users.email, email),
		});

		if (!user) {
			return c.json({ error: "Invalid credentials", success: false }, 401);
		}

		const isValid = await verifyPassword(password, user.passwordHash);

		if (!isValid) {
			return c.json({ error: "Invalid credentials", success: false }, 401);
		}

		const token = generateToken({ userId: user.id, email: user.email });

		const response: AuthResponse = {
			success: true,
			token,
			user: {
				id: user.id,
				email: user.email,
				fullName: user.fullName,
				currentLevel: user.currentLevel,
				targetLevel: user.targetLevel || undefined,
				avatarUrl: user.avatarUrl || undefined,
			},
		};

		return c.json(response, 200);
	} catch (error) {
		console.error("Login error:", error);
		return c.json({ error: "Login failed", success: false }, 500);
	}
});

