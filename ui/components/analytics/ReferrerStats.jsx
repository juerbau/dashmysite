import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/ui/components/shadcn/card";
import StatsBar from "@/ui/components/analytics/StatsBar";

export default function ReferrerStats({referrerStats}) {

    const maxVisits = referrerStats[0]?.visits ?? 0;


    const referrerOptions = {
        google: "Google",
        instagram: "Instagram",
        facebook: "Facebook",
        direct: "Direkt",
        other: "Andere",
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Besucherquellen</CardTitle>
            </CardHeader>

            <CardContent>
                {maxVisits ?
                    referrerStats.map((ref) => {

                            const label = referrerOptions[ref.source] ?? ref.source;
                            const percent = maxVisits > 0
                                ? (ref.visits / maxVisits) * 100
                                : 0;

                            return (
                                <StatsBar
                                    key={ref.source}
                                    label={label}
                                    value={ref.visits}
                                    percent={percent}
                                />
                            )
                        }
                    ) :
                    <p className="pl-10">Keine Besucherquellen im ausgewählten Zeitraum.</p>
                }
            </CardContent>
        </Card>
    );

}