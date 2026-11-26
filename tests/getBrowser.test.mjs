import test from "node:test";
import assert from "node:assert/strict";
import getBrowser from "../lib/tracking/getBrowser.js";

const testCases = [
    {
        name: "Chrome mit Client Hint",
        headers: {
            "sec-ch-ua": '"Chromium";v="158", "Not.A/Brand";v="24", "Google Chrome";v="158"',
        },
        expected: "Chrome",
    },
    {
        name: "Safari ohne Client Hint",
        headers: {
            "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/27.2 Safari/605.1.15",
        },
        expected: "Safari",
    },
    {
        name: "Chrome ohne Client Hint",
        headers: {
            "user-agent": "Mozilla/5.0 Chrome/158.0.0.0 Safari/537.36",
        },
        expected: "Chrome",
    },
    {
        name: "Unbekannter Browser",
        headers: {
            "user-agent": "UnknownBrowser/1.0",
        },
        expected: "Other",
    },
    {
        name: "Keine Header vorhanden",
        headers: {},
        expected: "Other",
    },
    {
        name: "Edge mit Client Hint",
        headers: {
            "sec-ch-ua": '"Chromium";v="158", "Microsoft Edge";v="158"',
        },
        expected: "Edge",
    },
    {
        name: "Edge ohne Client Hint",
        headers: {
            "user-agent": "Mozilla/5.0 Chrome/158.0.0.0 Safari/537.36 Edg/158.0.0.0",
        },
        expected: "Edge",
    },
    {
        name: "Opera mit Client Hint",
        headers: {
            "sec-ch-ua": '"Chromium";v="158", "Opera";v="120"',
        },
        expected: "Opera",
    },
    {
        name: "Opera ohne Client Hint",
        headers: {
            "user-agent": "Mozilla/5.0 Chrome/158.0.0.0 Safari/537.36 OPR/120.0.0.0",
        },
        expected: "Opera",
    },
    {
        name: "Brave mit Client Hint",
        headers: {
            "sec-ch-ua": '"Chromium";v="158", "Brave";v="158"',
        },
        expected: "Brave",
    },
    {
        name: "Firefox ohne Client Hint",
        headers: {
            "user-agent": "Mozilla/5.0 Gecko/20100101 Firefox/150.0",
        },
        expected: "Firefox",
    },
    {
        name: "Samsung Internet mit Chromium Client Hint",
        headers: {
            "sec-ch-ua": '"Chromium";v="158"',
            "user-agent": "Mozilla/5.0 Chrome/158.0.0.0 SamsungBrowser/30.0 Safari/537.36",
        },
        expected: "Samsung Internet",
    },
    {
        name: "Chromium mit Client Hint",
        headers: {
            "sec-ch-ua": '"Chromium";v="158"',
        },
        expected: "Chromium",
    },
    {
        name: "Chromium ohne Client Hint",
        headers: {
            "user-agent": "Mozilla/5.0 Chromium/158.0.0.0 Chrome/158.0.0.0 Safari/537.36",
        },
        expected: "Chromium",
    },
    {
        name: "Chrome unter iOS",
        headers: {
            "user-agent": "Mozilla/5.0 CriOS/158.0.0.0 Mobile Safari/604.1",
        },
        expected: "Chrome",
    },
    {
        name: "Firefox unter iOS",
        headers: {
            "user-agent": "Mozilla/5.0 FxiOS/150.0 Mobile Safari/605.1.15",
        },
        expected: "Firefox",
    },
    {
        name: "Edge unter iOS",
        headers: {
            "user-agent": "Mozilla/5.0 EdgiOS/158.0.0.0 Mobile Safari/605.1.15",
        },
        expected: "Edge",
    },
    {
        name: "Opera unter iOS",
        headers: {
            "user-agent": "Mozilla/5.0 OPiOS/120.0 Mobile Safari/605.1.15",
        },
        expected: "Opera",
    },
    {
        name: "Samsung Internet trotz Chrome Client Hint",
        headers: {
            "sec-ch-ua": '"Chromium";v="158", "Google Chrome";v="158"',
            "user-agent": "Mozilla/5.0 Chrome/158.0.0.0 SamsungBrowser/30.0 Safari/537.36",
        },
        expected: "Samsung Internet",
    },
    {
        name: "Edge trotz Chrome Client Hint",
        headers: {
            "sec-ch-ua": '"Chromium";v="158", "Google Chrome";v="158"',
            "user-agent": "Mozilla/5.0 Chrome/158.0.0.0 Edg/158.0.0.0",
        },
        expected: "Edge",
    },
    {
        name: "Unbekannte Marke im Client Hint",
        headers: {
            "sec-ch-ua": '"Not.A/Brand";v="24"',
        },
        expected: "Other",
    },
];

for (const { name, headers, expected } of testCases) {
    test(name, () => {
        const request = new Request("https://example.com", {
            headers,
        });

        assert.equal(getBrowser(request), expected);
    });
}