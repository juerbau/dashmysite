import {getDailyPageviews} from "@/lib/analytics/getDailyPageviews";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/ui/components/shadcn/card";
import {PageviewsChart} from "@/ui/components/analytics/PageviewsChart";


export default async function PageViews({period, siteId}){

    const dailyPageviews = await getDailyPageviews(siteId, period);


    return (
        <Card>
            <CardHeader>
                <CardTitle>Seitenaufrufe im Zeitverlauf</CardTitle>
            </CardHeader>

            <CardContent>
                <PageviewsChart data={dailyPageviews} />
            </CardContent>
        </Card>
    )
}