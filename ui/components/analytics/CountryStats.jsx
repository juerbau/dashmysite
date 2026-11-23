import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/ui/components/shadcn/card";
import StatsBar from "@/ui/components/analytics/StatsBar";

export default function CountryStats({countryStats}) {

    const maxVisits = countryStats[0]?.visits ?? 0;

    const countryLabels = {
        DE: "Deutschland",
        US: "USA",
        GB: "Vereinigtes Königreich",
        AT: "Österreich",
        FR: "Frankreich",
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Länder</CardTitle>
            </CardHeader>

            <CardContent>
                {maxVisits ?

                    countryStats.map((country) => {

                            const label = countryLabels[country.country] ?? country.country;
                            const percent = maxVisits > 0
                                ? (country.visits / maxVisits) * 100
                                : 0;

                            return (
                                <StatsBar
                                    key={country.country}
                                    label={label}
                                    value={country.visits}
                                    percent={percent}
                                />
                            );
                        }
                    ) :

                    <p className="pl-10">Keine Länderdaten im ausgewählten Zeitraum.</p>
                }
            </CardContent>
        </Card>
    );

}