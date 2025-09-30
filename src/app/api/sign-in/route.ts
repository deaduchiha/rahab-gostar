import { eq } from "drizzle-orm";

import { getDb } from "@/db";

import { CookieAttributes } from "lucia";
import { verifyPassword } from "@/lib/password";
import { getLucia } from "@/auth";
import { users } from "@/db/schema";

export async function POST(req: Request) {
  const { username, password } = (await req.json()) as {
    username: string;
    password: string;
  };

  const db = await getDb();

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.username, username))
    .limit(1);

  if (!user || !user.password) {
    return Response.json(
      { message: "نام کاربری یا رمز عبور اشتباه است" },
      { status: 401 }
    );
  }

  const ok = await verifyPassword(user.password, password);

  if (!ok)
    return Response.json(
      { message: "نام کاربری یا رمز عبور اشتباه است" },
      { status: 401 }
    );

  const lucia = await getLucia();
  const session = await lucia.createSession(user.id, {});
  const c = lucia.createSessionCookie(session.id);

  return new Response(
    JSON.stringify({
      message: "success",
      user: {
        id: user.id,
        phone: user.username,
      },
    }),
    {
      status: 200,
      headers: {
        "Set-Cookie": `${c.name}=${c.value}; ${serialize(c.attributes)}`,
      },
    }
  );
}

function serialize(a: CookieAttributes) {
  return [
    `Path=${a.path ?? "/"}`,
    a.httpOnly ? "HttpOnly" : "",
    a.secure ? "Secure" : "",
    a.sameSite ? `SameSite=${a.sameSite}` : "",
    a.maxAge ? `Max-Age=${a.maxAge}` : "",
    a.domain ? `Domain=${a.domain}` : "",
  ]
    .filter(Boolean)
    .join("; ");
}
