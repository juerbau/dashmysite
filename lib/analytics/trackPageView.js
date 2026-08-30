import { withTransaction } from "@/lib/database/transactions";
import * as sitesRepository from "@/lib/database/repositories/sites";
import * as sessionsRepository from "@/lib/database/repositories/sessions";
import * as pageViewsRepository from "@/lib/database/repositories/pageViews";
import { verifyApiSecret } from "@/lib/security/apiSecret";
import {
    UnknownSiteError,
    InactiveSiteError,
    InvalidApiSecretError,
    InvalidTrackingDataError,
} from "@/lib/analytics/errors";

export async function trackPageView({
                                        siteKey,
                                        apiSecret,
                                        matchKey,
                                        pathname,
                                        referrerDomain = null,
                                        referrerType = "direct",
                                        browser = null,
                                        operatingSystem = null,
                                        deviceType = "unknown",
                                        language = null,
                                        country = null,
                                    }) {
    const site = await sitesRepository.findBySiteKey(siteKey);

    if (!site) {
        throw new UnknownSiteError();
    }

    if (!site.is_active) {
        throw new InactiveSiteError();
    }

    if (!verifyApiSecret(apiSecret, site.api_secret_hash)) {
        throw new InvalidApiSecretError();
    }

    if (!matchKey) {
        throw new InvalidTrackingDataError("Missing match key");
    }

    if (!pathname) {
        throw new InvalidTrackingDataError("Missing pathname");
    }

    return withTransaction(async (client) => {
        const existingSession =
            await sessionsRepository.findActiveByMatchKey(
                {
                    siteId: site.id,
                    matchKey,
                },
                client
            );

        if (existingSession) {
            const pageView = await pageViewsRepository.create(
                {
                    sessionId: existingSession.id,
                    pathname,
                },
                client
            );

            const session = await sessionsRepository.touch(
                existingSession.id,
                client
            );

            return {
                isNewSession: false,
                session,
                pageView,
            };
        }

        const session = await sessionsRepository.create(
            {
                siteId: site.id,
                matchKey,
                entryPath: pathname,
                referrerDomain,
                referrerType,
                browser,
                operatingSystem,
                deviceType,
                language,
                country,
            },
            client
        );

        const pageView = await pageViewsRepository.create(
            {
                sessionId: session.id,
                pathname,
            },
            client
        );

        return {
            isNewSession: true,
            session,
            pageView,
        };
    });
}