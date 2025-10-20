import { Hono } from "hono";
import { cors } from "hono/cors";
import type { ApiResponse } from "shared/dist";
import { authRouter } from "./routes/auth";
import { userRouter } from "./routes/user";
import { credentialsRouter } from "./routes/credentials";
import { githubRouter } from "./routes/github";
import { jiraRouter } from "./routes/jira";
import { metricsRouter } from "./routes/metrics";

export const app = new Hono()

.use(cors())

.get("/", (c) => {
	return c.text("Career Path Tracker API");
})

.get("/hello", async (c) => {
	const data: ApiResponse = {
		message: "Hello BHVR!",
		success: true,
	};

	return c.json(data, { status: 200 });
})

.route("/api/auth", authRouter)
.route("/api/user", userRouter)
.route("/api/credentials", credentialsRouter)
.route("/api/github", githubRouter)
.route("/api/jira", jiraRouter)
.route("/api/metrics", metricsRouter);

export default app;