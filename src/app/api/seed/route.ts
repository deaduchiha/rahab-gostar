import { getDb } from "@/db";
import { users } from "@/db/schema";
import { hashPassword } from "@/lib/password";

export async function GET() {
  try {
    const db = await getDb();

    const existingUser = await db.query.users.findFirst({
      where: (users, { eq }) => eq(users.username, "ahoora"),
    });

    if (!existingUser) {
      const hashedPassword = await hashPassword("!@Ahoora123");

      await db.insert(users).values({
        id: crypto.randomUUID(),
        username: "bahman",
        password: hashedPassword,
      });
    }

    return Response.json(
      { message: "User Created Successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.log(error);

    return Response.json(
      { message: "مشکلی در سرور رخ داده است." },
      { status: 500 }
    );
  }
}
