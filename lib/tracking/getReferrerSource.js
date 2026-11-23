import googleDomains from "@/lib/tracking/googleDomains.json";

export default function getReferrerSource(urlString) {

    if (!urlString) {
        return 'direct'
    }


    try {

        const hostname = new URL(urlString).hostname;

        if (hostname === 'instagram.com' || hostname.endsWith('.instagram.com')) {
            return 'instagram';
        }

        if (hostname === 'facebook.com' || hostname.endsWith('.facebook.com')) {
            return 'facebook';
        }

        const matchesDomain = (element) => element === hostname || hostname.endsWith("." + element);
        if (googleDomains.some(matchesDomain)) {

            return 'google';
        }

        return 'other';


    } catch (error) {
        return 'other'
    }
}