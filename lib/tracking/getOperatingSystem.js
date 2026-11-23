const supportedPlatforms = [
    "macOS",
    "Windows",
    "Linux",
    "Android",
    "iOS",
    "Chrome OS"
];

export default function getOperatingSystem(request) {

    const platform = request.headers
        .get("sec-ch-ua-platform")
        ?.replaceAll('"', '') ?? null;

    if (supportedPlatforms.includes(platform)) {
        return platform;
    }

    const userAgent = request.headers.get("user-agent") ?? "";

    if (/iPhone|iPad|iPod/i.test(userAgent)) {
        return "iOS";
    }

    if (userAgent.includes("Android")) {
        return "Android";
    }

    if (userAgent.includes("Macintosh")) {
        return "macOS";
    }

    if (userAgent.includes("Windows")) {
        return "Windows";
    }

    if (userAgent.includes("CrOS")) {
        return "Chrome OS";
    }

    if (userAgent.includes("Linux")) {
        return "Linux";
    }

    return "Other";
}