import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/ui/components/shadcn/card";
import StatsBar from "@/ui/components/analytics/StatsBar";

export default function LanguageStats({languageStats}) {

    const maxVisits = languageStats[0]?.visits ?? 0;

    const countryLabels = {
        de: "Deutsch",
        en: "Englisch",
        fr: "Französisch",
        unknown: "Unbekannt",
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Sprachräume</CardTitle>
            </CardHeader>

            <CardContent>
                {maxVisits ?

                    languageStats.map((language) => {

                            const label = countryLabels[language.language] ?? language.language;
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

                    <p className="pl-10">Keine Sprachräume im ausgewählten Zeitraum.</p>
                }
            </CardContent>
        </Card>
    );

}