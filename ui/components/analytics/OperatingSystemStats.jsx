import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/ui/components/shadcn/card";
import StatsBar from "@/ui/components/analytics/StatsBar";

export default function OperatingSystemStats({operatingSystemStats}) {

    const maxVisits = operatingSystemStats[0]?.visits ?? 0;


    return (
        <Card>
            <CardHeader>
                <CardTitle>Betriebssysteme</CardTitle>
            </CardHeader>

            <CardContent>
                {maxVisits ?

                    operatingSystemStats.map((system) => {

                        const label = system.operating_system === "Other"
                            ? "Andere"
                            : system.operating_system;

                        const percent = maxVisits > 0
                                ? (system.visits / maxVisits) * 100
                                : 0;

                            return (
                                <StatsBar
                                    key={system.operating_system}
                                    label={label}
                                    value={system.visits}
                                    percent={percent}
                                />
                            );
                        }
                    ) :

                    <p className="pl-10">Keine Betriebssysteme im ausgewählten Zeitraum.</p>
                }
            </CardContent>
        </Card>
    );

}