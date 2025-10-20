import { Hono } from "hono";
import { authMiddleware, type AuthContext } from "../middleware/auth";
import { getDecryptedToken } from "./credentials";
import { createJiraService } from "../services/jira";
import { db } from "../db";
import { jiraTickets, credentials } from "../db/schema";
import { eq, desc, and, gte } from "drizzle-orm";

export const jiraRouter = new Hono<AuthContext>();

jiraRouter.use("*", authMiddleware);

jiraRouter.post("/sync", async (c) => {
	try {
		const { userId, email } = c.get("user");
		const body = await c.req.json<{ since?: string }>();

		const token = await getDecryptedToken(userId, "jira");

		if (!token) {
			return c.json(
				{
					error: "Jira credentials not found. Please connect your account first.",
					success: false,
				},
				400
			);
		}

		const credentialData = await db.query.credentials.findFirst({
			where: eq(credentials.userId, userId),
		});

		const domain = credentialData?.metadata?.domain as string | undefined;

		if (!domain) {
			return c.json(
				{
					error: "Jira domain not configured. Please reconnect your account.",
					success: false,
				},
				400
			);
		}

		const jiraService = await createJiraService(token, email, domain);

		const since = body.since ? new Date(body.since) : undefined;
		const synced = await jiraService.syncIssues(userId, email, since);

		return c.json(
			{
				success: true,
				message: "Jira data synced successfully",
				synced,
			},
			200
		);
	} catch (error: any) {
		console.error("Jira sync error:", error);
		return c.json(
			{
				error: "Failed to sync Jira data",
				success: false,
				details: error.message,
			},
			500
		);
	}
});

jiraRouter.get("/tickets", async (c) => {
	const { userId } = c.get("user");
	const { limit = "50", offset = "0", status, issueType } = c.req.query();

	const whereConditions = [eq(jiraTickets.userId, userId)];
	if (status) {
		whereConditions.push(eq(jiraTickets.status, status));
	}
	if (issueType) {
		whereConditions.push(eq(jiraTickets.issueType, issueType));
	}

	const tickets = await db.query.jiraTickets.findMany({
		where: and(...whereConditions),
		orderBy: [desc(jiraTickets.updatedAt)],
		limit: parseInt(limit),
		offset: parseInt(offset),
	});

	return c.json({ success: true, tickets, count: tickets.length }, 200);
});

jiraRouter.get("/stats", async (c) => {
	const { userId } = c.get("user");
	const { since } = c.req.query();

	const whereConditions = [eq(jiraTickets.userId, userId)];
	if (since) {
		whereConditions.push(gte(jiraTickets.createdAt, new Date(since)));
	}

	const tickets = await db.query.jiraTickets.findMany({
		where: and(...whereConditions),
	});

	const resolvedTickets = tickets.filter((t) => t.resolvedAt);

	const stats = {
		tickets: {
			total: tickets.length,
			resolved: resolvedTickets.length,
			inProgress: tickets.filter((t) =>
				["In Progress", "In Development", "In Review"].includes(t.status)
			).length,
			todo: tickets.filter((t) =>
				["To Do", "Backlog", "Open"].includes(t.status)
			).length,
		},
		byType: {
			bug: tickets.filter((t) => t.issueType === "Bug").length,
			story: tickets.filter((t) =>
				["Story", "User Story"].includes(t.issueType)
			).length,
			task: tickets.filter((t) => t.issueType === "Task").length,
			epic: tickets.filter((t) => t.issueType === "Epic").length,
		},
		storyPoints: {
			total: tickets.reduce((sum, t) => sum + (t.storyPoints || 0), 0),
			completed: resolvedTickets.reduce(
				(sum, t) => sum + (t.storyPoints || 0),
				0
			),
		},
		timeTracking: {
			estimated: tickets.reduce((sum, t) => sum + (t.timeEstimate || 0), 0),
			spent: tickets.reduce((sum, t) => sum + (t.timeSpent || 0), 0),
		},
	};

	return c.json({ success: true, stats }, 200);
});

