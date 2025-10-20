import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { users } from "./users";

export const jiraTickets = sqliteTable("jira_tickets", {
	id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
	userId: text("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	jiraId: text("jira_id").notNull(),
	key: text("key").notNull(),
	title: text("title").notNull(),
	description: text("description"),
	status: text("status").notNull(),
	issueType: text("issue_type").notNull(),
	priority: text("priority"),
	storyPoints: real("story_points"),
	timeEstimate: integer("time_estimate"),
	timeSpent: integer("time_spent"),
	assignee: text("assignee"),
	reporter: text("reporter").notNull(),
	project: text("project").notNull(),
	createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
	updatedAt: integer("updated_at", { mode: "timestamp" }).notNull(),
	resolvedAt: integer("resolved_at", { mode: "timestamp" }),
	dueDate: integer("due_date", { mode: "timestamp" }),
	labels: text("labels", { mode: "json" }).$type<string[]>().default(sql`'[]'`),
	url: text("url").notNull(),
	syncedAt: integer("synced_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
});

export type JiraTicket = typeof jiraTickets.$inferSelect;
export type NewJiraTicket = typeof jiraTickets.$inferInsert;

