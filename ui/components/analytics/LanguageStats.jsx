import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/ui/components/shadcn/card";
import StatsBar from "@/ui/components/analytics/StatsBar";

export default function LanguageStats({languageStats}) {

    const maxVisits = languageStats[0]?.visits ?? 0;

    const languageLabels = new Intl.DisplayNames(
        ["de"],
        {type: "language"}
    );

    return (
        <Card>
            <CardHeader>
                <CardTitle>Browsersprachen</CardTitle>
            </CardHeader>

            <CardContent>
                {maxVisits ?

                    languageStats.map((language) => {

                            let label = "Unbekannt";
                            if (/^[a-z]{2,3}$/.test(language.language ?? "")) {
                                try {
                                    label = languageLabels.of(language.language);
                                } catch {
                                    label = "Unbekannt";
                                }
                            }

                            const percent = maxVisits > 0
                                ? (language.visits / maxVisits) * 100
                                : 0;

                            return (
                                <StatsBar
                                    key={language.language}
                                    label={label}
                                    value={language.visits}
                                    percent={percent}
                                />
                            );
                        }
                    ) :

                    <p className="pl-10">Keine Browsersprachen im ausgewählten Zeitraum.</p>
                }
            </CardContent>
        </Card>
    );

}