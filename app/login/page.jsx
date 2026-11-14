"use client";

import {useState} from "react";
import {useRouter} from "next/navigation";

import {authClient} from "@/lib/auth/auth-client";
import {Button} from "@/ui/components/shadcn/button";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/ui/components/shadcn/card";
import {Input} from "@/ui/components/shadcn/input";
import {Label} from "@/ui/components/shadcn/label";

export default function LoginPage() {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const {error} = await authClient.signIn.email({
                email,
                password,
            });

            if (error) {
                setError("E-Mail-Adresse oder Passwort ist falsch.");
                return;
            }

            router.replace("/dashboard");
            router.refresh();
        } catch {
            setError("Die Anmeldung ist fehlgeschlagen. Bitte erneut versuchen.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <main className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-zinc-50">
            <div className="w-full max-w-sm space-y-8">
                <div className="space-y-3 text-center">
                    <h1 className="text-4xl font-bold tracking-tight">
                        dashmy<span className="text-violet-400">site.</span>
                    </h1>
                    <p className="text-sm text-zinc-400">
                        Privacy-first Web Analytics
                    </p>
                </div>

                <Card className="border-zinc-800 bg-zinc-900 text-zinc-50">
                    <CardHeader>
                        <CardTitle className="text-xl">
                            Willkommen zurück
                        </CardTitle>
                        <CardDescription className="text-zinc-400">
                            Melde dich an, um dein Dashboard zu öffnen.
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <Label htmlFor="email">E-Mail-Adresse</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    autoComplete="email"
                                    placeholder="name@beispiel.de"
                                    required
                                    value={email}
                                    onChange={(event) => setEmail(event.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Passwort</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                />
                            </div>

                            {error && (
                                <p role="alert" className="text-sm text-red-400">
                                    {error}
                                </p>
                            )}

                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-violet-600 text-white hover:bg-violet-500"
                            >
                                {isLoading ? "Anmeldung läuft..." : "Anmelden"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <p className="text-center text-xs text-zinc-500">
                    Know your site. Not your visitors.
                </p>
            </div>
        </main>
    );
}
