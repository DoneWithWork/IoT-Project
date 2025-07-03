import { AppSidebar } from "@/components/AppSideBar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";
import { ReactNode } from "react";

export default async function UserDashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  return (
    <SidebarProvider
      defaultOpen={defaultOpen}
      className="flex flex-row min-h-screen"
    >
      <AppSidebar />

      <main className="flex-1 h-screen overflow-auto">{children}</main>
    </SidebarProvider>
  );
}
