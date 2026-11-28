import test from "node:test";
import assert from "node:assert/strict";
import getDeviceType from "../lib/tracking/getDeviceType.js";

const testCases = [
    {
        name: "Desktop mit Client Hint",
        headers: {
            "sec-ch-ua-mobile": "?0",
            "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
        },
        expected: "desktop",
    },
    {
        name: "Desktop ohne Client Hint",
        headers: {
            "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
        },
        expected: "desktop",
    },
    {
        name: "Smartphone mit Client Hint",
        headers: {
            "sec-ch-ua-mobile": "?1",
        },
        expected: "mobile",
    },
    {
        name: "iPhone ohne Client Hint",
        headers: {
            "user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X)",
        },
        expected: "mobile",
    },
    {
        name: "iPad ohne Client Hint",
        headers: {
            "user-agent": "Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X)",
        },
        expected: "tablet",
    },
    {
        name: "Keine Header vorhanden",
        headers: {},
        expected: "unknown",
    },
    {
        name: "Android Smartphone mit Client Hint",
        headers: {
            "sec-ch-ua-mobile": "?1",
            "user-agent": "Mozilla/5.0 (Linux; Android 14; Pixel 8) Mobile",
        },
        expected: "mobile",
    },
    {
        name: "Android Smartphone ohne Client Hint",
        headers: {
            "user-agent": "Mozilla/5.0 (Linux; Android 14; Pixel 8) Mobile",
        },
        expected: "mobile",
    },
    {
        name: "Android Tablet mit Client Hint",
        headers: {
            "sec-ch-ua-mobile": "?0",
            "user-agent": "Mozilla/5.0 (Linux; Android 14; Tablet)",
        },
        expected: "tablet",
    },
    {
        name: "Android Tablet ohne Mobile-Kennung",
        headers: {
            "user-agent": "Mozilla/5.0 (Linux; Android 14; SM-X710)",
        },
        expected: "tablet",
    },
    {
        name: "Windows Desktop",
        headers: {
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
        },
        expected: "desktop",
    },
    {
        name: "Linux Desktop",
        headers: {
            "user-agent": "Mozilla/5.0 (X11; Linux x86_64)",
        },
        expected: "desktop",
    },
    {
        name: "Chrome OS",
        headers: {
            "user-agent": "Mozilla/5.0 (X11; CrOS x86_64)",
        },
        expected: "desktop",
    },
    {
        name: "iPad trotz Mobile-Kennung",
        headers: {
            "user-agent": "Mozilla/5.0 (iPad; CPU OS 18_0 like Mac OS X) Mobile",
        },
        expected: "tablet",
    },
    {
        name: "Nicht mobiler Client Hint ohne User-Agent",
        headers: {
            "sec-ch-ua-mobile": "?0",
        },
        expected: "unknown",
    },
];

for (const { name, headers, expected } of testCases) {
    test(name, () => {
        const request = new Request("https://example.com", {
            headers,
        });

        assert.equal(getDeviceType(request), expected);
    });
}