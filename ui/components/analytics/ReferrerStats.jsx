"use client";

import { motion } from "motion/react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/ui/components/shadcn/card";

export default function ReferrerStats({referrerStats}){

    const totalVisits = referrerStats.reduce((sum, item) => sum + item.visits, 0);

    const referrerOptions = {
        direct: "Direkt",
        social: "Social Media",
        search: "Suchmaschinen"
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Besucherquellen</CardTitle>
            </CardHeader>

            <CardContent>
                {totalVisits ?
                    referrerStats.map((ref) => {

                            const prozent = (ref.visits / totalVisits) * 100;
                            return (
                                <div className="w-full mt-5" key={ref.referrer_type}>
                                    <div className="flex flex-row justify-between">
                                        <p>{referrerOptions[ref.referrer_type] ?? ref.referrer_type}</p>
                                        <p>{ref.visits} ({Math.round(prozent)}%)</p>
                                    </div>
                                    <motion.div
                                        initial={{ width: "0%" }}
                                        whileInView={{ width: `${prozent}%` }}
                                        transition={{ duration: 0.8 }}
                                        viewport={{ once: true }}
                                        className="bg-purple-500 h-3 rounded-sm"
                                    />
                                </div>
                            )
                        }
                    ) :
                    <p className="pl-10">Keine Besuche im ausgewählten Zeitraum.</p>
                }
            </CardContent>
        </Card>
    );

}