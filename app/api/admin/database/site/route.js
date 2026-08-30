import crypto from "node:crypto";
import { NextResponse } from "next/server";
import * as sitesRepository from "@/lib/database/repositories/sites";

export const runtime = "nodejs";

export async function POST() {
    try {
        const existing = await sitesRepository.findByDomain("artelier8.de");

        if (existing) {
            return NextResponse.json({
                success: true,
                message: "Site already exists.",
                site: existing,
            });
        }

        const site = await sitesRepository.create({
            name: "ARTelier8",
            domain: "artelier8.de",
            apiSecretHash: crypto.randomBytes(32).toString("hex"),
        });

        return NextResponse.json(
            {
                success: true,
                site,
            },
            {
                status: 201,
            }
        );
    } catch (error) {
        console.error("Create site error:", error);

        return NextResponse.json(
            {
                success: false,
                error: error.message,
            },
            {
                status: 500,
            }
        );
    }
}