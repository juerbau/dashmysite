import test from "node:test";
import assert from "node:assert/strict";
import getLanguage from "../lib/tracking/getLanguage.js";

const testCases = [
    {
        name: "Safari mit deutscher Sprache",
        headers: { "accept-language": "de-DE,de;q=0.9" },
        expected: "de",
    },
    {
        name: "Chrome mit deutscher Sprache",
        headers: {
            "accept-language": "de-DE,de;q=0.9,en-US;q=0.8,en;q=0.7",
        },
        expected: "de",
    },
    {
        name: "Amerikanisches Englisch",
        headers: { "accept-language": "en-US" },
        expected: "en",
    },
    {
        name: "Österreichisches Deutsch",
        headers: { "accept-language": "de-AT" },
        expected: "de",
    },
    {
        name: "Sprache ohne Regionskennung",
        headers: { "accept-language": "fr" },
        expected: "fr",
    },
    {
        name: "Großgeschriebener Sprachcode",
        headers: { "accept-language": "DE-de" },
        expected: "de",
    },
    {
        name: "Brasilianisches Portugiesisch",
        headers: { "accept-language": "pt-BR" },
        expected: "pt",
    },
    {
        name: "Dreistelliger Sprachcode",
        headers: { "accept-language": "fil-PH" },
        expected: "fil",
    },
    {
        name: "Sprache mit höherer Gewichtung",
        headers: { "accept-language": "de;q=0.5,en;q=0.9" },
        expected: "en",
    },
    {
        name: "Sprachen mit gleicher Gewichtung",
        headers: { "accept-language": "de;q=0.8,en;q=0.8" },
        expected: "de",
    },
    {
        name: "Sprache mit Gewichtung null ignorieren",
        headers: { "accept-language": "de;q=0,en;q=0.5" },
        expected: "en",
    },
    {
        name: "Einzige Sprache mit Gewichtung null",
        headers: { "accept-language": "de;q=0" },
        expected: null,
    },
    {
        name: "Gewichtung außerhalb des gültigen Bereichs",
        headers: { "accept-language": "de;q=1.5" },
        expected: null,
    },
    {
        name: "Ungültige Gewichtung",
        headers: { "accept-language": "de;q=abc" },
        expected: null,
    },
    {
        name: "Wildcard neben gültiger Sprache",
        headers: { "accept-language": "*,en;q=0.8" },
        expected: "en",
    },
    {
        name: "Ausschließlich Wildcard",
        headers: { "accept-language": "*" },
        expected: null,
    },
    {
        name: "Ungültiger Sprachcode",
        headers: { "accept-language": "123" },
        expected: null,
    },
    {
        name: "Leerer Accept-Language-Header",
        headers: { "accept-language": "" },
        expected: null,
    },
    {
        name: "Fehlender Accept-Language-Header",
        headers: {},
        expected: null,
    },
];

for (const { name, headers, expected } of testCases) {
    test(name, () => {
        const request = new Request("https://example.com", {
            headers,
        });

        assert.equal(getLanguage(request), expected);
    });
}