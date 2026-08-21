export function getSiteUrl() {
    const siteUrl = process.env.NODE_ENV === "development"
        ? process.env.NEXT_PUBLIC_SITE_URL
        : process.env.NEXT_PUBLIC_VERCEL_URL;

    if (!siteUrl) {
        throw new Error("NEXT_PUBLIC_SITE_URL or NEXT_PUBLIC_VERCEL_URL must be configured");
    }

    return siteUrl.startsWith("http") ? siteUrl : `https://${siteUrl}`;
}