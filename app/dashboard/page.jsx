import Link from "next/link";
import {normalizePeriod} from "@/lib/analytics/periods";
import {getSiteStats} from "@/lib/analytics/getSiteStats";
import {getTopPages} from "@/lib/analytics/getTopPages";
import {Card, CardContent} from "@/ui/components/shadcn/card";
import {Button} from "@/ui/components/shadcn/button";
import TopPages from "@/ui/components/analytics/TopPages";
import PageViews from "@/ui/components/analytics/PageViews";
import {getReferrerStats} from "@/lib/analytics/getReferrerStats";
import ReferrerStats from "@/ui/components/analytics/ReferrerStats";
import {getDeviceStats} from "@/lib/analytics/getDeviceStats";
import DeviceStats from "@/ui/components/analytics/DeviceStats";
import {getBrowserStats} from "@/lib/analytics/getBrowserStats";
import BrowserStats from "@/ui/components/analytics/BrowserStats";
import {getCountryStats} from "@/lib/analytics/getCountryStats";
import CountryStats from "@/ui/components/analytics/CountryStats";
import {getOperatingSystemStats} from "@/lib/analytics/getOperatingSystemStats";
import OperatingSystemStats from "@/ui/components/analytics/OperatingSystemStats";
import {getLanguageStats} from "@/lib/analytics/getLanguageStats";
import LanguageStats from "@/ui/components/analytics/LanguageStats";
import getReferrerSource from "@/lib/tracking/getReferrerSource";


export default async function DashboardPage({searchParams}) {
    const params = await searchParams;

    const period = normalizePeriod(params.period);

    const site = await getSiteStats(1, period);

    if (!site) {
        return <p>Website nicht gefunden.</p>;
    }

    const siteId = site.site_id;

    const topPages = await getTopPages(siteId, period);

    const referrerStats = await getReferrerStats(siteId, period);

    const deviceStats = await getDeviceStats(siteId, period);

    const browserStats = await getBrowserStats(siteId, period);

    const countryStats = await getCountryStats(siteId, period);

    const operatingSystemStats = await getOperatingSystemStats(siteId, period);

    const languageStats = await getLanguageStats(siteId, period);

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


    return (
        <main className="flex flex-col gap-4">
            {/*<p>{referrerDomain}</p>*/}

            <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight">
                        {site.site_name}
                    </h1>

                    <p className="mt-2 text-lg text-muted-foreground">
                        Deine Website-Statistiken - {periodLabels[period]}
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
                <Card>
                    <CardContent className="grid grid-cols-2 gap-4">
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
                                {site.total_pageviews}
                            </div>
                            <div className="text-sm text-muted-foreground">
                                Seitenaufrufe
                            </div>
                        </div>

                    </CardContent>
                </Card>

                <PageViews
                    period={period}
                    siteId={siteId}
                />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <TopPages topPages={topPages}/>
                <ReferrerStats referrerStats={referrerStats}/>
                <DeviceStats deviceStats={deviceStats}/>
                <BrowserStats browserStats={browserStats}/>
                <CountryStats countryStats={countryStats}/>
                <OperatingSystemStats operatingSystemStats={operatingSystemStats}/>
                <LanguageStats languageStats={languageStats}/>
            </div>
        </main>
    );
}
