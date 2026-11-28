import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/ui/components/shadcn/card";
import StatsBar from "@/ui/components/analytics/StatsBar";

export default function DeviceStats({deviceStats}) {

    const maxVisits = deviceStats[0]?.visits ?? 0;


    const deviceLabels = {
        desktop: "Desktop",
        mobile: "Smartphone",
        tablet: "Tablet",
        unknown: "Unbekannt",
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Geräte</CardTitle>
            </CardHeader>

            <CardContent>
                {maxVisits ?

                    deviceStats.map((device) => {

                            const label = deviceLabels[device.device_type] ?? device.device_type;
                            const percent = maxVisits > 0
                                ? (device.visits / maxVisits) * 100
                                : 0;

                            return (
                                <StatsBar
                                    key={device.device_type}
                                    label={label}
                                    value={device.visits}
                                    percent={percent}
                                />
                            );
                        }
                    ) :

                    <p className="pl-10">Keine Geräte im ausgewählten Zeitraum.</p>
                }
            </CardContent>
        </Card>
    );

}