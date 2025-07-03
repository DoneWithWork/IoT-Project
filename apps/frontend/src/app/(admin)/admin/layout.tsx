import { AppSidebarAdmin } from "@/components/admin/AppSidebarAdmin";
import { SidebarProvider } from "@/components/ui/sidebar";
import { checkRole } from "@/lib/roles";
import { currentUser } from "@clerk/nextjs/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function layout({ children }: { children: ReactNode }) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";
  const user = await currentUser();
  if (!user) return redirect("/");
  if (!(await checkRole("superadmin"))) {
    redirect("/");
  }
  return (
    <SidebarProvider
      defaultOpen={defaultOpen}
      className="flex flex-row min-h-screen"
    >
      <AppSidebarAdmin />

      <main className="flex-1 h-screen overflow-auto">{children}</main>
    </SidebarProvider>
  );
}
