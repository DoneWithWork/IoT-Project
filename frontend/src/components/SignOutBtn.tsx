"use client";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { LogOutIcon } from "lucide-react";
import { SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";

export default function SignOutBtn() {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild>
        <LogoutLink>
          <LogOutIcon />
          <span>Logout</span>
        </LogoutLink>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
