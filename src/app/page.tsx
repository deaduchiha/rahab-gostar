import { getCurrentUser } from "@/auth";
import Login from "@/components/common/login";
import { redirect } from "next/navigation";

export default async function Home() {
  let user = null;
  try {
    user = await getCurrentUser();
  } catch (error) {
    console.error(error);
  }

  if (user) redirect("/dashboard");

  return (
    <div className="flex h-screen items-center justify-center">
      <Login />
    </div>
  );
}
