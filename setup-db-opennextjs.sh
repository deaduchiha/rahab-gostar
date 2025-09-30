#!/bin/bash


set -e

echo "Installing drizzle-orm"
pnpm add drizzle-orm

echo "Installing drizzle-kit"
pnpm add -D drizzle-kit

cat > .env << 'EOF'
DB_ACCOUNT_ID=
DB_DATABASE_ID=
DB_TOKEN=
EOF

# Create drizzle config
cat > "drizzle.config.ts" << 'EOF'
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./src/db/schema/**/*.ts",
  out: "./src/db/migrations",
  dialect: "sqlite",
  dbCredentials: {
    accountId: process.env.DB_ACCOUNT_ID || "",
    databaseId: process.env.DB_DATABASE_ID || "",
    token: process.env.DB_TOKEN || "",
  },
});
EOF

# setup DB connection
mkdir -p "./src/db"
mkdir -p src/db/schema

# drizzle connection part
cat > "./src/db/index.ts" << 'EOF'
import { drizzle } from "drizzle-orm/d1";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function getDb() {
  const { env } = await getCloudflareContext({ async: true });
  return drizzle(env.DB);
}
EOF

# schema part
cat > "./src/db/schema/auth.ts" << 'EOF'
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
EOF

cat > "./src/db/schema/index.ts" << 'EOF'
export * from "./auth";
EOF
