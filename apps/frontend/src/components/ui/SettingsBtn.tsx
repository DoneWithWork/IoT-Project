import { Settings } from "lucide-react";
import Link from "next/link";
import { SidebarMenuButton, SidebarMenuItem } from "./sidebar";

export default function SettingsBtn() {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <Link href="/dashboard/settings">
          <Settings />
          <span>Settings</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
