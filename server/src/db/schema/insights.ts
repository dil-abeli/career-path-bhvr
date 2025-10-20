import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { users } from "./users";

export const insights = sqliteTable("insights", {
	id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
	userId: text("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	type: text("type").notNull(),
	title: text("title").notNull(),
	content: text("content").notNull(),
	metadata: text("metadata", { mode: "json" }).$type<Record<string, any>>(),
	periodStart: integer("period_start", { mode: "timestamp" }),
	periodEnd: integer("period_end", { mode: "timestamp" }).notNull(),
	isRead: integer("is_read", { mode: "boolean" }).notNull().default(false),
	createdAt: integer("created_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
});

export type Insight = typeof insights.$inferSelect;
export type NewInsight = typeof insights.$inferInsert;

