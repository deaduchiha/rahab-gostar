import { getCurrentUser } from "@/auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

const layout = async ({ children }: { children: ReactNode }) => {
  let user = null;

  try {
    user = await getCurrentUser();
  } catch (error) {
    console.log(error);
  }

  if (!user) redirect("/");

  return children;
};

export default layout;
