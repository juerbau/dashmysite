import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/ui/components/shadcn/card";
import StatsBar from "@/ui/components/analytics/StatsBar";

export default function BrowserStats({browserStats}) {

    const maxVisits = browserStats[0]?.visits ?? 0;


    const browserLabels = {
        google: "Google Chrome",
        safari: "Safari",
        edge: "Edge",
        firefox: "Firefox",
        unknown: "Unbekannt",
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Browser</CardTitle>
            </CardHeader>

            <CardContent>
                {maxVisits ?

                    browserStats.map((browser) => {

                            const label = browserLabels[browser.browser] ?? browser.browser;
                            const percent = maxVisits > 0
                                ? (browser.visits / maxVisits) * 100
                                : 0;

                            return (
                                <StatsBar
                                    key={browser.browser}
                                    label={label}
                                    value={browser.visits}
                                    percent={percent}
                                />
                            );
                        }
                    ) :

                    <p className="pl-10">Keine Browserdaten im ausgewählten Zeitraum.</p>
                }
            </CardContent>
        </Card>
    );

}