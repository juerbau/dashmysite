
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth/auth";
import AppSidebar from "@/ui/components/AppSidebar";

import {
    SidebarProvider,
    SidebarInset,
    SidebarTrigger,
} from "@/ui/components/shadcn/sidebar";
import { TooltipProvider } from "@/ui/components/shadcn/tooltip";

export default async function DashboardLayout({ children }) {
    const session = await auth.api.getSession({
        headers: await headers(),
    });

    if (!session || session.user.role !== "admin") {
        redirect("/login");
    }

    return (
        <TooltipProvider>
            <SidebarProvider>
                <AppSidebar />

                <SidebarInset>
                    <header className="flex h-16 shrink-0 items-center gap-4 border-b px-6">
                        <SidebarTrigger />

                        <span className="text-sm font-medium text-muted-foreground">
            DashMySite
          </span>
                    </header>

                    <div className="flex flex-1 flex-col p-6">
                        {children}
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </TooltipProvider>

);
}
