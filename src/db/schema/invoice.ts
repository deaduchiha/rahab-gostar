import { sql } from "drizzle-orm";
import { sqliteTable, text, index, integer } from "drizzle-orm/sqlite-core";

const uuid = () => crypto.randomUUID();

export const users = sqliteTable(
  "users",
  {
    id: text("id").primaryKey().$defaultFn(uuid), // e.g. uuid
    description: text("description"),
    photo: text("photo").notNull(),
    createdAt: text("created_at")
      .notNull()
      .default(sql`(current_timestamp)`),
  },
  (t) => [index("idx_id").on(t.id)]
);
