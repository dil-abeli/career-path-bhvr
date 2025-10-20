import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const users = sqliteTable("users", {
	id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
	email: text("email").notNull().unique(),
	passwordHash: text("password_hash").notNull(),
	fullName: text("full_name").notNull(),
	avatarUrl: text("avatar_url"),
	currentLevel: text("current_level").notNull().default("junior"),
	targetLevel: text("target_level"),
	createdAt: integer("created_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
	updatedAt: integer("updated_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
});

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

