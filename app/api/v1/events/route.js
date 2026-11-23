import { NextResponse } from "next/server";
import { trackPageView } from "@/lib/analytics/trackPageView";
import {
    UnknownSiteError,
    InactiveSiteError,
    InvalidApiSecretError,
    InvalidTrackingDataError,
} from "@/lib/analytics/errors";
import { dashMySiteEventSchema } from "@/lib/validation/dashmysite-event-schema";
import getOperatingSystem from "@/lib/tracking/getOperatingSystem";

export const runtime = "nodejs";

function getBearerToken(request) {
    const authorization = request.headers.get("authorization");

    if (!authorization?.startsWith("Bearer ")) {
        return null;
    }

    return authorization.slice(7).trim() || null;
}

export async function POST(request) {

    try {
        const apiSecret = getBearerToken(request);

        if (!apiSecret) {
            return NextResponse.json(
                {
                    success: false,
                    error: "unauthorized",
                },
                {
                    status: 401,
                }
            );
        }

        const operatingSystem = getOperatingSystem(request);

        const body = await request.json();

        const validationResult = dashMySiteEventSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: "invalid_request",
                },
                {
                    status: 400,
                }
            );
        }

        const {
            siteKey,
            matchKey,
            pathname,
            referrer,
            browser,
            deviceType,
            language,
            country,
        } = validationResult.data;

        const result = await trackPageView({
            siteKey,
            apiSecret,
            matchKey,
            pathname,
            referrer,
            browser,
            operatingSystem,
            deviceType,
            language,
            country,
        });

        return NextResponse.json(
            {
                success: true,
                isNewSession: result.isNewSession,
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        if (
            error instanceof UnknownSiteError ||
            error instanceof InactiveSiteError ||
            error instanceof InvalidApiSecretError
        ) {
            return NextResponse.json(
                {
                    success: false,
                    error: "unauthorized",
                },
                {
                    status: 401,
                }
            );
        }

        if (error instanceof InvalidTrackingDataError) {
            return NextResponse.json(
                {
                    success: false,
                    error: "invalid_request",
                },
                {
                    status: 400,
                }
            );
        }

        console.error("DashMySite event error:", error);

        return NextResponse.json(
            {
                success: false,
                error: "event_processing_failed",
            },
            {
                status: 500,
            }
        );
    }
}