import { sqliteTable, text, index, integer } from "drizzle-orm/sqlite-core";

const uuid = () => crypto.randomUUID();

export const users = sqliteTable(
  "users",
  {
    id: text("id").primaryKey().$defaultFn(uuid), // e.g. uuid
    username: text("username").notNull().unique(),
    password: text("password"),
  },
  (t) => [index("idx_user_username").on(t.username)]
);

export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id), // Add .notNull()
  expiresAt: integer("expires_at").notNull(),
});
