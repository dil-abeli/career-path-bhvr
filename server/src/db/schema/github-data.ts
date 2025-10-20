import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { users } from "./users";

export const githubPullRequests = sqliteTable("github_pull_requests", {
	id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
	userId: text("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	githubId: integer("github_id").notNull(),
	number: integer("number").notNull(),
	title: text("title").notNull(),
	state: text("state").notNull(),
	repository: text("repository").notNull(),
	author: text("author").notNull(),
	createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
	mergedAt: integer("merged_at", { mode: "timestamp" }),
	closedAt: integer("closed_at", { mode: "timestamp" }),
	additions: integer("additions").notNull().default(0),
	deletions: integer("deletions").notNull().default(0),
	changedFiles: integer("changed_files").notNull().default(0),
	reviewCount: integer("review_count").notNull().default(0),
	commentCount: integer("comment_count").notNull().default(0),
	url: text("url").notNull(),
	syncedAt: integer("synced_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
});

export const githubReviews = sqliteTable("github_reviews", {
	id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
	userId: text("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	githubId: integer("github_id").notNull(),
	pullRequestNumber: integer("pull_request_number").notNull(),
	repository: text("repository").notNull(),
	state: text("state").notNull(),
	reviewer: text("reviewer").notNull(),
	submittedAt: integer("submitted_at", { mode: "timestamp" }).notNull(),
	commentCount: integer("comment_count").notNull().default(0),
	body: text("body"),
	url: text("url").notNull(),
	syncedAt: integer("synced_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
});

export const githubCommits = sqliteTable("github_commits", {
	id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
	userId: text("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	sha: text("sha").notNull(),
	repository: text("repository").notNull(),
	message: text("message").notNull(),
	author: text("author").notNull(),
	committedAt: integer("committed_at", { mode: "timestamp" }).notNull(),
	additions: integer("additions").notNull().default(0),
	deletions: integer("deletions").notNull().default(0),
	url: text("url").notNull(),
	syncedAt: integer("synced_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
});

export type GithubPullRequest = typeof githubPullRequests.$inferSelect;
export type NewGithubPullRequest = typeof githubPullRequests.$inferInsert;
export type GithubReview = typeof githubReviews.$inferSelect;
export type NewGithubReview = typeof githubReviews.$inferInsert;
export type GithubCommit = typeof githubCommits.$inferSelect;
export type NewGithubCommit = typeof githubCommits.$inferInsert;

