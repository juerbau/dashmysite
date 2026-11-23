import { z } from "zod";

export const dashMySiteEventSchema = z.object({
    siteKey: z.uuid(),

    matchKey: z.uuid(),

    pathname: z
        .string()
        .min(1)
        .max(2048)
        .startsWith("/"),

    referrer: z
        .string()
        .max(2048)
        .nullable()
        .optional(),

    browser: z
        .string()
        .max(50)
        .nullable()
        .optional(),

    operatingSystem: z
        .string()
        .max(50)
        .nullable()
        .optional(),

    deviceType: z
        .enum([
            "desktop",
            "mobile",
            "tablet",
            "unknown",
        ])
        .default("unknown"),

    language: z
        .string()
        .max(10)
        .nullable()
        .optional(),

    country: z
        .string()
        .regex(/^[A-Z]{2}$/)
        .nullable()
        .optional(),
});