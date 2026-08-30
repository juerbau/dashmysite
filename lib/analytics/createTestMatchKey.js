import crypto from "node:crypto";

export function createTestMatchKey({
                                       ip,
                                       userAgent,
                                       secret = "pulse-local-development",
                                       date = new Date(),
                                   }) {
    const day = date.toISOString().slice(0, 10);

    return crypto
        .createHmac("sha256", secret)
        .update(`${ip}|${userAgent}|${day}`)
        .digest("hex");
}
