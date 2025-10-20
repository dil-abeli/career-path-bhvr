import { Hono } from "hono";
import { authMiddleware, type AuthContext } from "../middleware/auth";
import { db } from "../db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import type { UserProfile, UpdateUserProfileRequest } from "shared";

export const userRouter = new Hono<AuthContext>();

userRouter.use("*", authMiddleware);

userRouter.get("/me", async (c) => {
	const { userId } = c.get("user");

	const user = await db.query.users.findFirst({
		where: eq(users.id, userId),
	});

	if (!user) {
		return c.json({ error: "User not found", success: false }, 404);
	}

	const profile: UserProfile = {
		id: user.id,
		email: user.email,
		fullName: user.fullName,
		currentLevel: user.currentLevel,
		targetLevel: user.targetLevel || undefined,
		avatarUrl: user.avatarUrl || undefined,
		createdAt: user.createdAt.toISOString(),
	};

	return c.json({ success: true, user: profile }, 200);
});

userRouter.patch("/me", async (c) => {
	const { userId } = c.get("user");
	const body = await c.req.json<UpdateUserProfileRequest>();

	const updateData: any = {
		updatedAt: new Date(),
	};

	if (body.fullName !== undefined) updateData.fullName = body.fullName;
	if (body.currentLevel !== undefined)
		updateData.currentLevel = body.currentLevel;
	if (body.targetLevel !== undefined) updateData.targetLevel = body.targetLevel;
	if (body.avatarUrl !== undefined) updateData.avatarUrl = body.avatarUrl;

	const updatedUsers = await db
		.update(users)
		.set(updateData)
		.where(eq(users.id, userId))
		.returning();

	const updatedUser = updatedUsers[0];
	if (!updatedUser) {
		return c.json({ error: "Failed to update user", success: false }, 500);
	}

	const profile: UserProfile = {
		id: updatedUser.id,
		email: updatedUser.email,
		fullName: updatedUser.fullName,
		currentLevel: updatedUser.currentLevel,
		targetLevel: updatedUser.targetLevel || undefined,
		avatarUrl: updatedUser.avatarUrl || undefined,
		createdAt: updatedUser.createdAt.toISOString(),
	};

	return c.json({ success: true, user: profile }, 200);
});

