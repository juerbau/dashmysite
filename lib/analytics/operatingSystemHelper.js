

export default function operatingSystemHelper(request){

    const platform = request.headers
        .get("sec-ch-ua-platform")
        ?.replaceAll('"', '') ?? null;

    if (!platform) {
        const userAgent = request.headers.get("user-agent");

        if (userAgent?.includes("Macintosh")) {
            return "macOS";
        }

        if (userAgent?.includes("Windows")) {
            return "Windows";
        }

        if (userAgent?.includes("Linux")) {
            return "Linux";
        }

        if (userAgent?.includes("Android")) {
            return "Android";
        }

        if (userAgent?.includes("iOS")) {
            return "iOS";
        }

        if (userAgent?.includes("ChromeOS")) {
            return "Chrome OS";
        }
    }

    return platform;

}


// const operatingSystem = request.headers.get("user-agent")?.includes('Macintosh') ? "macOS" : null