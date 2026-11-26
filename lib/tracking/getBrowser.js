export default function getBrowser(request) {

    const browser = request.headers.get("sec-ch-ua") ?? "";
    const userAgent = request.headers.get("user-agent") ?? "";

    // Spezifische Browser anhand des Client Hints

    if (browser.includes('"Microsoft Edge"')) {
        return "Edge";
    }

    if (browser.includes('"Opera"')) {
        return "Opera";
    }

    if (browser.includes('"Brave"')) {
        return "Brave";
    }

    // Spezifische Browser anhand des User-Agents

    if (/Edg\/|EdgA\/|EdgiOS\/|Edge\//.test(userAgent)) {
        return "Edge";
    }

    if (/OPR\/|OPiOS\/|Opera\//.test(userAgent)) {
        return "Opera";
    }

    if (userAgent.includes("SamsungBrowser/")) {
        return "Samsung Internet";
    }

    if (/Firefox\/|FxiOS\//.test(userAgent)) {
        return "Firefox";
    }

    // Chrome anhand des Client Hints

    if (browser.includes('"Google Chrome"')) {
        return "Chrome";
    }

    // Chromium und Chrome anhand des User-Agents

    if (userAgent.includes("Chromium/")) {
        return "Chromium";
    }

    if (/Chrome\/|CriOS\//.test(userAgent)) {
        return "Chrome";
    }

    // Safari anhand des User-Agents

    if (
        userAgent.includes("Safari/") &&
        userAgent.includes("Version/")
    ) {
        return "Safari";
    }

    // Generischer Chromium Client Hint

    if (browser.includes('"Chromium"')) {
        return "Chromium";
    }

    return "Other";
}