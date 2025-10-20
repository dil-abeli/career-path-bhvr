import { Hono } from "hono";
import type { Context } from "hono";
import { authMiddleware, type AuthContext } from "../middleware/auth";
import { metricsService } from "../services/metrics";

export const metricsRouter = new Hono<AuthContext>()
	.use("/*", authMiddleware)

	.get("/dashboard", async (c: Context) => {
		const user = c.get("user");
		const userId = user.userId;

		const period = c.req.query("period") || "30";
		const days = parseInt(period, 10);

		const endDate = new Date();
		const startDate = new Date();
		startDate.setDate(startDate.getDate() - days);

		try {
			const metrics = await metricsService.getAggregatedMetrics(userId, {
				startDate,
				endDate,
			});

			return c.json(
				{
					success: true,
					data: metrics,
				},
				200,
			);
		} catch (error) {
			console.error("Error fetching dashboard metrics:", error);
			return c.json(
				{
					success: false,
					error: "Failed to fetch dashboard metrics",
				},
				500,
			);
		}
	})

	.get("/github", async (c: Context) => {
		const user = c.get("user");
		const userId = user.userId;

		const period = c.req.query("period") || "30";
		const days = parseInt(period, 10);

		const endDate = new Date();
		const startDate = new Date();
		startDate.setDate(startDate.getDate() - days);

		try {
			const metrics = await metricsService.getGitHubMetrics(userId, {
				startDate,
				endDate,
			});

			return c.json(
				{
					success: true,
					data: metrics,
				},
				200,
			);
		} catch (error) {
			console.error("Error fetching GitHub metrics:", error);
			return c.json(
				{
					success: false,
					error: "Failed to fetch GitHub metrics",
				},
				500,
			);
		}
	})

	.get("/jira", async (c: Context) => {
		const user = c.get("user");
		const userId = user.userId;

		const period = c.req.query("period") || "30";
		const days = parseInt(period, 10);

		const endDate = new Date();
		const startDate = new Date();
		startDate.setDate(startDate.getDate() - days);

		try {
			const metrics = await metricsService.getJiraMetrics(userId, {
				startDate,
				endDate,
			});

			return c.json(
				{
					success: true,
					data: metrics,
				},
				200,
			);
		} catch (error) {
			console.error("Error fetching Jira metrics:", error);
			return c.json(
				{
					success: false,
					error: "Failed to fetch Jira metrics",
				},
				500,
			);
		}
	})

	.get("/trends", async (c: Context) => {
		const user = c.get("user");
		const userId = user.userId;

		const metricType = c.req.query("type") as
			| "productivity"
			| "collaboration"
			| "quality";
		const period = c.req.query("period") || "90";
		const days = parseInt(period, 10);

		if (!metricType || !["productivity", "collaboration", "quality"].includes(metricType)) {
			return c.json(
				{
					success: false,
					error: "Invalid metric type. Must be: productivity, collaboration, or quality",
				},
				400,
			);
		}

		try {
			const trendData = await metricsService.getTrendData(
				userId,
				metricType,
				days,
			);

			return c.json(
				{
					success: true,
					data: {
						type: metricType,
						period: days,
						trends: trendData,
					},
				},
				200,
			);
		} catch (error) {
			console.error("Error fetching trend data:", error);
			return c.json(
				{
					success: false,
					error: "Failed to fetch trend data",
				},
				500,
			);
		}
	})

	.post("/snapshot", async (c: Context) => {
		const user = c.get("user");
		const userId = user.userId;

		try {
			await metricsService.createSnapshot(userId);

			return c.json(
				{
					success: true,
					message: "Metrics snapshot created successfully",
				},
				201,
			);
		} catch (error) {
			console.error("Error creating metrics snapshot:", error);
			return c.json(
				{
					success: false,
					error: "Failed to create metrics snapshot",
				},
				500,
			);
		}
	});

