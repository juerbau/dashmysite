export default function getLanguage(request) {

    const language = request.headers.get("accept-language");

    if (!language) {
        return null;
    }

    const languages = language.split(",")
        .map((entry) => {
            const [locale, ...params] = entry.trim().split(";");

            const quality = params.find(
                (param) => param.trim().startsWith("q=")
            );

            return {
                code: locale.split("-")[0].toLowerCase(),
                quality: quality
                    ? Number(quality.trim().slice(2))
                    : 1,
            };
        })
        .filter(({ code, quality }) =>
            /^[a-z]{2,3}$/.test(code) &&
            quality > 0 &&
            quality <= 1
        )
        .sort((a, b) => b.quality - a.quality);

    return languages[0]?.code ?? null;
}