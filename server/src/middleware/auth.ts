import type { Context, Next } from "hono";
import { verifyToken, type JWTPayload } from "../utils/auth";

export type AuthContext = {
	Variables: {
		user: JWTPayload;
	};
};

export async function authMiddleware(c: Context, next: Next) {
	const authHeader = c.req.header("Authorization");

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return c.json({ error: "Unauthorized", success: false }, 401);
	}

	const token = authHeader.substring(7);
	const payload = verifyToken(token);

	if (!payload) {
		return c.json({ error: "Invalid token", success: false }, 401);
	}

	c.set("user", payload);
	await next();
}

