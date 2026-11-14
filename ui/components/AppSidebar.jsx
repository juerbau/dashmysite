"use client";

import Link from "next/link";
import {BarChart3, Globe, Settings} from "lucide-react";
import { LogOut } from "lucide-react";
import LogoutButton from "@/ui/components/LogoutButton";

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarFooter,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/ui/components/shadcn/sidebar";

const navigation = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: BarChart3,
    },
    {
        title: "Websites",
        url: "/dashboard/websites",
        icon: Globe,
    },
    {
        title: "Einstellungen",
        url: "/dashboard/settings",
        icon: Settings,
    },
];

export default function AppSidebar() {
    return (
        <Sidebar collapsible="icon">

            <SidebarHeader className="border-b border-sidebar-border p-4">
                <div className="flex h-8 items-center overflow-hidden">
    <span className="text-lg font-bold tracking-tight group-data-[collapsible=icon]:hidden">
      dashmy<span className="text-violet-400">site.</span>
    </span>

                    <span className="hidden text-xl font-bold tracking-tight group-data-[collapsible=icon]:block">
      d<span className="text-violet-400">.</span>
    </span>
                </div>
            </SidebarHeader>


            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Navigation</SidebarGroupLabel>

                    <SidebarGroupContent>
                        <SidebarMenu>
                            {navigation.map((item) => (
                                <SidebarMenuItem key={item.url}>
                                    <SidebarMenuButton asChild tooltip={item.title}>
                                        <Link href={item.url}>
                                            <item.icon/>
                                            <span>{item.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter className="border-t border-sidebar-border p-4">
                <LogoutButton />
            </SidebarFooter>
        </Sidebar>
    );
}
