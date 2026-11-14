"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/ui/components/shadcn/chart";

const chartConfig = {
    pageviews: {
        label: "Seitenaufrufe",
        color: "var(--chart-1)",
    },
};

export function PageviewsChart({ data }) {
    return (
        <ChartContainer
            config={chartConfig}
            className="h-[280px] w-full"
        >
            <BarChart accessibilityLayer data={data}>
                <CartesianGrid vertical={false} />

                <XAxis
                    dataKey="day"
                    tickLine={false}
                    axisLine={false}
                    tickMargin={8}
                    tickFormatter={(value) =>
                        new Date(`${value}T12:00:00`).toLocaleDateString("de-DE", {
                            day: "2-digit",
                            month: "2-digit",
                        })
                    }
                />

                <YAxis
                    allowDecimals={false}
                    tickLine={false}
                    axisLine={false}
                    width={30}
                />

                <ChartTooltip
                    content={<ChartTooltipContent />}
                />

                <Bar
                    dataKey="pageviews"
                    fill="var(--color-pageviews)"
                    radius={[4, 4, 0, 0]}
                    maxBarSize={32}
                />
            </BarChart>
        </ChartContainer>
    );
}