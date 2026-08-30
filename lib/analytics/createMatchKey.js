import crypto from "node:crypto";

function getClientIp(req) {
    const vercelForwardedFor =
        req.headers.get("x-vercel-forwarded-for");

    if (vercelForwardedFor) {
        return vercelForwardedFor.split(",")[0].trim();
    }

    const forwardedFor =
        req.headers.get("x-forwarded-for");

    if (forwardedFor) {
        return forwardedFor.split(",")[0].trim();
    }

    return req.headers.get("x-real-ip") || "unknown";
}

function getDailyKey(date = new Date()) {
    return date.toISOString().slice(0, 10);
}

export function createMatchKey(req) {
    const secret = process.env.PULSE_MATCH_SECRET;

    if (!secret) {
        throw new Error(
            "Missing PULSE_MATCH_SECRET environment variable"
        );
    }

    const ip = getClientIp(req);
    const userAgent =
        req.headers.get("user-agent") || "unknown";

    const value = [
        ip,
        userAgent,
        getDailyKey(),
    ].join("|");

    return crypto
        .createHmac("sha256", secret)
        .update(value)
        .digest("hex");
}