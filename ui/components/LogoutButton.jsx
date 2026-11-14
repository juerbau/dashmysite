
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth/auth-client";
import { LogOut } from "lucide-react";
import {
    SidebarMenuButton,
} from "@/ui/components/shadcn/sidebar";

export default function LogoutButton() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    async function handleLogout() {
        setIsLoading(true);
        setError("");

        try {
            const { error } = await authClient.signOut();

            if (error) {
                setError("Abmelden fehlgeschlagen. Bitte erneut versuchen.");
                return;
            }

            router.replace("/login");
            router.refresh();
        } catch {
            setError("Abmelden fehlgeschlagen. Bitte erneut versuchen.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div>
            <SidebarMenuButton
                type="button"
                tooltip="Abmelden"
                onClick={handleLogout}
                disabled={isLoading}
                className="cursor-pointer"
            >
                <LogOut />
                <span>{isLoading ? "Abmelden..." : "Abmelden"}</span>
            </SidebarMenuButton>

            {error && <p role="alert">{error}</p>}
        </div>
    );
}
