import { Hono } from "hono";
import { authMiddleware, type AuthContext } from "../middleware/auth";
import { getDecryptedToken } from "./credentials";
import { createGitHubService } from "../services/github";
import { db } from "../db";
import {
	githubPullRequests,
	githubReviews,
	githubCommits,
} from "../db/schema";
import { eq, desc, and, gte } from "drizzle-orm";

export const githubRouter = new Hono<AuthContext>();

githubRouter.use("*", authMiddleware);

githubRouter.post("/sync", async (c) => {
	try {
		const { userId } = c.get("user");
		const body = await c.req.json<{ since?: string }>();

		const token = await getDecryptedToken(userId, "github");

		if (!token) {
			return c.json(
				{
					error: "GitHub credentials not found. Please connect your account first.",
					success: false,
				},
				400
			);
		}

		const githubService = await createGitHubService(token);

		const since = body.since ? new Date(body.since) : undefined;
		const result = await githubService.syncAll(userId, since);

		return c.json(
			{
				success: true,
				message: "GitHub data synced successfully",
				synced: result,
			},
			200
		);
	} catch (error: any) {
		console.error("GitHub sync error:", error);
		return c.json(
			{ error: "Failed to sync GitHub data", success: false, details: error.message },
			500
		);
	}
});

githubRouter.get("/pull-requests", async (c) => {
	const { userId } = c.get("user");
	const { limit = "50", offset = "0", state } = c.req.query();

	const whereConditions = [eq(githubPullRequests.userId, userId)];
	if (state) {
		whereConditions.push(eq(githubPullRequests.state, state));
	}

	const prs = await db.query.githubPullRequests.findMany({
		where: and(...whereConditions),
		orderBy: [desc(githubPullRequests.createdAt)],
		limit: parseInt(limit),
		offset: parseInt(offset),
	});

	return c.json({ success: true, pullRequests: prs, count: prs.length }, 200);
});

githubRouter.get("/reviews", async (c) => {
	const { userId } = c.get("user");
	const { limit = "50", offset = "0" } = c.req.query();

	const reviews = await db.query.githubReviews.findMany({
		where: eq(githubReviews.userId, userId),
		orderBy: [desc(githubReviews.submittedAt)],
		limit: parseInt(limit),
		offset: parseInt(offset),
	});

	return c.json({ success: true, reviews, count: reviews.length }, 200);
});

githubRouter.get("/commits", async (c) => {
	const { userId } = c.get("user");
	const { limit = "50", offset = "0" } = c.req.query();

	const commits = await db.query.githubCommits.findMany({
		where: eq(githubCommits.userId, userId),
		orderBy: [desc(githubCommits.committedAt)],
		limit: parseInt(limit),
		offset: parseInt(offset),
	});

	return c.json({ success: true, commits, count: commits.length }, 200);
});

githubRouter.get("/stats", async (c) => {
	const { userId } = c.get("user");
	const { since } = c.req.query();

	const whereConditions = [eq(githubPullRequests.userId, userId)];
	if (since) {
		whereConditions.push(gte(githubPullRequests.createdAt, new Date(since)));
	}

	const prs = await db.query.githubPullRequests.findMany({
		where: and(...whereConditions),
	});

	const reviews = await db.query.githubReviews.findMany({
		where: since
			? and(
					eq(githubReviews.userId, userId),
					gte(githubReviews.submittedAt, new Date(since))
			  )
			: eq(githubReviews.userId, userId),
	});

	const commits = await db.query.githubCommits.findMany({
		where: since
			? and(
					eq(githubCommits.userId, userId),
					gte(githubCommits.committedAt, new Date(since))
			  )
			: eq(githubCommits.userId, userId),
	});

	const stats = {
		pullRequests: {
			total: prs.length,
			merged: prs.filter((pr) => pr.mergedAt).length,
			open: prs.filter((pr) => pr.state === "open").length,
			closed: prs.filter((pr) => pr.state === "closed" && !pr.mergedAt).length,
		},
		reviews: {
			total: reviews.length,
			approved: reviews.filter((r) => r.state === "APPROVED").length,
			changesRequested: reviews.filter((r) => r.state === "CHANGES_REQUESTED")
				.length,
			commented: reviews.filter((r) => r.state === "COMMENTED").length,
		},
		commits: {
			total: commits.length,
			linesAdded: commits.reduce((sum, c) => sum + c.additions, 0),
			linesDeleted: commits.reduce((sum, c) => sum + c.deletions, 0),
		},
	};

	return c.json({ success: true, stats }, 200);
});

