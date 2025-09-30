import { Lucia } from "lucia";
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { cookies } from "next/headers";
import { cache } from "react";
import { sessions, users } from "./db/schema";
import { getDb } from "./db";

// Create a new instance for each request because D1 bindings are runtime scoped
export async function getLucia() {
  const db = await getDb();
  const adapter = new DrizzleSQLiteAdapter(db, sessions, users);

  const lucia = new Lucia(adapter, {
    // Keep session cookies long-lived; Next can’t always extend during render
    sessionCookie: {
      expires: false,
      attributes: {
        secure: process.env.NODE_ENV === "production",
      },
    },
    // Map DB user columns -> exposed user fields
    getUserAttributes: (attrs) => ({
      username: attrs.username,
    }),
  });

  return lucia;
}

// Typed module augmentation
declare module "lucia" {
  interface Register {
    Lucia: ReturnType<typeof getLucia>; // use the instance type
    DatabaseUserAttributes: {
      username: string;
    };
  }
  interface User {
    username: string;
  }
}

// Helper used by server components & actions
export const getCurrentUser = cache(async () => {
  // Refresh or clear cookie as needed (inside try: Next can throw when rendering)
  try {
    const lucia = await getLucia();
    const sessionId =
      (await cookies()).get(lucia.sessionCookieName)?.value ?? null;
    const { user, session } = await lucia.validateSession(sessionId ?? "");

    if (session && session.fresh) {
      const c = lucia.createSessionCookie(session.id);
      (await cookies()).set(c.name, c.value, c.attributes);
    }
    if (!session) {
      const c = lucia.createBlankSessionCookie();
      (await cookies()).set(c.name, c.value, c.attributes);
    }

    return user;
  } catch {}
});
