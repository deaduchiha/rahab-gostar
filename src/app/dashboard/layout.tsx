import { getCurrentUser } from "@/auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import AppSidebar from "@/components/common/app-sidebar";

const layout = async ({ children }: { children: ReactNode }) => {
  let user = null;

  try {
    user = await getCurrentUser();
  } catch (error) {
    console.log(error);
  }

  if (!user) redirect("/");

  return (
    <SidebarProvider>
      <AppSidebar />

      <main className="flex-1 p-4">
        <SidebarTrigger />
        {children}
      </main>
    </SidebarProvider>
  );
};

export default layout;
