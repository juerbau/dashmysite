import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/ui/components/shadcn/card";
import StatsBar from "@/ui/components/analytics/StatsBar";


export default function TopPages({topPages}) {

    const maxPageviews = topPages[0]?.pageviews ?? 0;
    
    return (
        <Card>
            <CardHeader>
                <CardTitle>Meistbesuchte Seiten</CardTitle>
            </CardHeader>

            <CardContent>
                {maxPageviews ?
                    topPages.map((page) => {

                            const label = page.pathname;
                            const percent = maxPageviews > 0
                                ? (page.pageviews / maxPageviews) * 100
                                : 0;

                            return (
                                <StatsBar
                                    key={page.pathname}
                                    label={label}
                                    value={page.pageviews}
                                    percent={percent}
                                />
                            );
                        }
                    ) :
                    <p className="pl-10">Keine Seitenaufrufe im ausgewählten Zeitraum.</p>
                }
            </CardContent>
        </Card>
    );
}


