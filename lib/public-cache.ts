import { updateTag } from "next/cache";

export const PUBLIC_BROWSE_TAG = "public-browse";
export const PUBLIC_BROWSE_REVALIDATE_SECONDS = 300;

export function invalidatePublicBrowseCache() {
    updateTag(PUBLIC_BROWSE_TAG);
}