import Link from "next/link";
import {Fragment} from "react";
import {getSiteStats} from "@/lib/analytics/getSiteStats";
import {getDailyPageviews} from "@/lib/analytics/getDailyPageviews";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/ui/components/shadcn/card";
import {Button} from "@/ui/components/shadcn/button";
import {PageviewsChart} from "@/ui/components/analytics/PageviewsChart";


export default async function DashboardPage({searchParams}) {
    const params = await searchParams;

    const allowedPeriods = ["today", "7d", "30d", "all"];

    const period = allowedPeriods.includes(params.period)
        ? params.period
        : "7d";

    const site = await getSiteStats(1, period);

    const dailyPageviews = await getDailyPageviews(1, period);

    const periodOptions = [
        {value: "today", label: "Heute"},
        {value: "7d", label: "7 Tage"},
        {value: "30d", label: "30 Tage"},
        {value: "all", label: "Gesamt"},
    ];

    const periodLabels = {
        today: "heute",
        "7d": "der letzten 7 Tage",
        "30d": "der letzten 30 Tage",
        all: "seit Beginn der Aufzeichnung",
    };

    const averagePages = site?.total_visits
        ? Math.round(site.total_pageviews / site.total_visits)
        : 0;

    return (
        <main className="flex flex-col gap-6">

            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight">
                        Übersicht
                    </h1>

                    <p className="mt-2 text-sm text-muted-foreground">
                        Deine Website-Statistiken {periodLabels[period]}.
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-1 rounded-lg border p-1">
                    {periodOptions.map((option) => (
                        <Button
                            key={option.value}
                            variant={period === option.value ? "secondary" : "ghost"}
                            size="sm"
                            className="cursor-pointer"
                            asChild
                        >
                            <Link href={`/dashboard?period=${option.value}`}>
                                {option.label}
                            </Link>
                        </Button>
                    ))}
                </div>
            </div>


            <div className="grid gap-4">
                {site && (
                    <>
                        <Card>
                            <CardHeader>
                                <CardTitle>{site.site_name}</CardTitle>
                                <CardDescription>{site.domain}</CardDescription>
                            </CardHeader>

                            <CardContent className="grid grid-cols-3 gap-4">
                                <div>
                                    <div className="text-3xl font-bold">
                                        {site.total_pageviews}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Seitenaufrufe
                                    </div>
                                </div>

                                <div>
                                    <div className="text-3xl font-bold">
                                        {site.total_visits}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Besuche
                                    </div>
                                </div>

                                <div>
                                    <div className="text-3xl font-bold">
                                        {averagePages}
                                    </div>
                                    <div className="text-sm text-muted-foreground">
                                        Ø Seiten pro Besuch
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="mt-6">
                            <CardHeader>
                                <CardTitle>Seitenaufrufe im Zeitverlauf</CardTitle>
                                <CardDescription>
                                    Seitenaufrufe pro Tag – {periodLabels[period]}
                                </CardDescription>
                            </CardHeader>

                            <CardContent>
                                <PageviewsChart data={dailyPageviews} />
                            </CardContent>
                        </Card>
                    </>
                )}
            </div>
        </main>
    );
}
