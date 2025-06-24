import { LogOutIcon } from "lucide-react";
import { redirect } from "next/navigation";
import { signOut } from "supertokens-auth-react/recipe/session";
import { SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";

export default function SignOutBtn() {
  async function onLogout() {
    await signOut();
    redirect("/");
  }
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild onClick={onLogout}>
        <div>
          <LogOutIcon />
          <span>Logout</span>
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
