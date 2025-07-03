"use client";
import { SignOutButton } from "@clerk/nextjs";
import { LogOutIcon } from "lucide-react";
import { SidebarMenuButton, SidebarMenuItem } from "./ui/sidebar";

export default function SignOutBtn() {
  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild className="hover:cursor-pointer">
        <SignOutButton>
          <div className="flex flex-row items-center">
            <LogOutIcon />
            <span>Logout</span>
          </div>
        </SignOutButton>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
