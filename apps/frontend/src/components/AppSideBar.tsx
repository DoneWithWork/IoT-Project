"use client";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { UserDashboardLinks } from "@/lib/constants";
import Link from "next/link";
import SignOutBtn from "./SignOutBtn";
import SettingsBtn from "./ui/SettingsBtn";

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" className="w-64">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {UserDashboardLinks.map((project, index) => (
                <SidebarMenuItem key={index}>
                  <SidebarMenuButton asChild>
                    <Link href={`/dashboard${project.href}`}>
                      <project.icon />
                      <span>{project.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SettingsBtn />
          <SignOutBtn />
          <SidebarTrigger />
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
