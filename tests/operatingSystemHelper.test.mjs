import test from "node:test";
import assert from "node:assert/strict";
import getOperatingSystem from "../lib/tracking/getOperatingSystem.js";

const testCases = [
    {
        name: "Android ohne Client Hint",
        headers: {
            "user-agent": "Mozilla/5.0 (Linux; Android 14; Pixel 8)"
        },
        expected: "Android"
    },
    {
        name: "macOS mit Client Hint",
        headers: {
            "sec-ch-ua-platform": '"macOS"'
        },
        expected: "macOS"
    },
    {
        name: "macOS ohne Client Hint",
        headers: {
            "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"
        },
        expected: "macOS"
    },
    {
        name: "iPhone ohne Client Hint",
        headers: {
            "user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)"
        },
        expected: "iOS"
    },
    {
        name: "iPad ohne Client Hint",
        headers: {
            "user-agent": "Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X)"
        },
        expected: "iOS"
    },
    {
        name: "Windows ohne Client Hint",
        headers: {
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
        },
        expected: "Windows"
    },
    {
        name: "Chrome OS ohne Client Hint",
        headers: {
            "user-agent": "Mozilla/5.0 (X11; CrOS x86_64 14541.0.0)"
        },
        expected: "Chrome OS"
    },
    {
        name: "Linux ohne Client Hint",
        headers: {
            "user-agent": "Mozilla/5.0 (X11; Linux x86_64)"
        },
        expected: "Linux"
    },
    {
        name: "Unbekannter Client Hint mit Windows User-Agent",
        headers: {
            "sec-ch-ua-platform": '"Unknown"',
            "user-agent": "Mozilla/5.0 (Windows NT 10.0)"
        },
        expected: "Windows"
    },
    {
        name: "Nicht unterstütztes Betriebssystem",
        headers: {
            "sec-ch-ua-platform": '"FreeBSD"',
            "user-agent": "Mozilla/5.0 (X11; FreeBSD amd64)"
        },
        expected: "Other"
    },
    {
        name: "Unbekannter User-Agent",
        headers: {
            "user-agent": "Unknown"
        },
        expected: "Other"
    },
    {
        name: "Keine Header vorhanden",
        headers: {},
        expected: "Other"
    },
    {
        name: "Client Hint hat Vorrang vor User-Agent",
        headers: {
            "sec-ch-ua-platform": '"Android"',
            "user-agent": "Mozilla/5.0 (X11; Linux x86_64)"
        },
        expected: "Android"
    }
];

for (const { name, headers, expected } of testCases) {
    test(name, () => {
        const request = new Request("https://example.com", {
            headers
        });

        assert.equal(getOperatingSystem(request), expected);
    });
}