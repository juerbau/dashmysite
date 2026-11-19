"use client";

import { motion } from "motion/react";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/ui/components/shadcn/card";


export default function TopPages({topPages}) {

    const maxPageViews = topPages[0] ? topPages[0].pageviews : null;


    return (
        <Card>
            <CardHeader>
                <CardTitle>Meistbesuchte Seiten</CardTitle>
            </CardHeader>

            <CardContent>
                {maxPageViews ?
                    topPages.map((page) => {

                            const prozent = (page.pageviews / maxPageViews) * 100;
                            return (
                                <div className="w-full mt-5" key={page.pathname}>
                                    <div className="flex flex-row justify-between">
                                        <p>{page.pathname}</p>
                                        <p>{page.pageviews}</p>
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
                    <p className="pl-10">Keine Seitenaufrufe im ausgewählten Zeitraum.</p>
                }
            </CardContent>
        </Card>
    );
}


