import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Crown, FileIcon, LayoutDashboardIcon } from "lucide-react";
import Link from "next/link";

export default function AppSidebar() {
  return (
    <Sidebar side="right">
      <SidebarHeader>
        <SidebarMenuButton
          size="lg"
          className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
        >
          <div className="grid flex-1 text-right text-sm leading-tight">
            <span className="truncate font-medium">شرکت رهاب گستر</span>
            <span className="truncate text-xs">داشبورد مدیریتی</span>
          </div>

          <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
            <Crown className="size-4" />
          </div>
        </SidebarMenuButton>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-2">
            {SIDEBAR_PAGES.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <Link href={item.url} className="font-medium">
                    {item.icon}
                    {item.title}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}

const SIDEBAR_PAGES = [
  {
    title: "داشبورد",
    url: "/dashboard",
    icon: <LayoutDashboardIcon />,
  },
  {
    title: "فاکتورها",
    url: "/dashboard/invoices",
    icon: <FileIcon />,
  },
];
