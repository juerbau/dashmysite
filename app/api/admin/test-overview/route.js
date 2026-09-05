import {NextResponse} from "next/server";
import {getOverview} from "@/lib/database/repositories/analytics-repository";

export async function GET() {
    const result = await getOverview(
        1,
        new Date("2026-01-01"),
        new Date("2026-12-31"),
    );

    return NextResponse.json(result);
}