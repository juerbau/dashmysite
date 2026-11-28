export default function getDeviceType(request) {

    const mobile = request.headers.get("sec-ch-ua-mobile");
    const userAgent = request.headers.get("user-agent") ?? "";

    // Tablets

    if (/iPad|Tablet|PlayBook|Silk\//i.test(userAgent)) {
        return "tablet";
    }

    if (/Android/i.test(userAgent) && !/Mobile/i.test(userAgent)) {
        return "tablet";
    }

    // Mobile Geräte

    if (mobile === "?1") {
        return "mobile";
    }

    if (/iPhone|iPod|Mobile/i.test(userAgent)) {
        return "mobile";
    }

    // Desktop

    if (/Windows|Macintosh|Linux|CrOS/i.test(userAgent)) {
        return "desktop";
    }

    return "unknown";
}