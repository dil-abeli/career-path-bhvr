import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import { users } from "./users";

export const credentials = sqliteTable("credentials", {
	id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
	userId: text("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	provider: text("provider").notNull(),
	encryptedToken: text("encrypted_token").notNull(),
	encryptedIv: text("encrypted_iv").notNull(),
	metadata: text("metadata", { mode: "json" }).$type<Record<string, any>>(),
	isValid: integer("is_valid", { mode: "boolean" }).notNull().default(true),
	lastValidatedAt: integer("last_validated_at", { mode: "timestamp" }),
	createdAt: integer("created_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
	updatedAt: integer("updated_at", { mode: "timestamp" })
		.notNull()
		.default(sql`(unixepoch())`),
});

export type Credential = typeof credentials.$inferSelect;
export type NewCredential = typeof credentials.$inferInsert;

