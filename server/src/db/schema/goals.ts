import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { users } from "./users";

export const goals = sqliteTable("goals", {
	id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
	userId: text("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	title: text("title").notNull(),
	description: text("description"),
	metricType: text("metric_type").notNull(),
	targetValue: real("target_value").notNull(),
	currentValue: real("current_value").notNull().default(0),
	unit: text("unit").notNull(),
	deadline: integer("deadline", { mode: "timestamp" }),
	status: text("status").notNull().default("active"),
	isTemplate: integer("is_template", { mode: "boolean" })
		.notNull()
		.default(false),
	completedAt: integer("completed_at", { mode: "timestamp" }),
	createdAt: integer("created_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
	updatedAt: integer("updated_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
});

export type Goal = typeof goals.$inferSelect;
export type NewGoal = typeof goals.$inferInsert;

