import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { users } from "./users";

export const metricsSnapshots = sqliteTable("metrics_snapshots", {
	id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
	userId: text("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	snapshotDate: integer("snapshot_date", { mode: "timestamp" }).notNull(),
	period: text("period").notNull(),
	prsMerged: integer("prs_merged").notNull().default(0),
	prsCreated: integer("prs_created").notNull().default(0),
	reviewsCompleted: integer("reviews_completed").notNull().default(0),
	commitsCount: integer("commits_count").notNull().default(0),
	linesAdded: integer("lines_added").notNull().default(0),
	linesDeleted: integer("lines_deleted").notNull().default(0),
	ticketsCompleted: integer("tickets_completed").notNull().default(0),
	storyPointsCompleted: real("story_points_completed").notNull().default(0),
	bugsFixed: integer("bugs_fixed").notNull().default(0),
	featuresDelivered: integer("features_delivered").notNull().default(0),
	createdAt: integer("created_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
});

export type MetricsSnapshot = typeof metricsSnapshots.$inferSelect;
export type NewMetricsSnapshot = typeof metricsSnapshots.$inferInsert;

