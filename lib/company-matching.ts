const COMPANY_SUFFIXES = /\b(ltd|limited|inc|incorporated|llc|corp|corporation)\b/g;

const aliases: Record<string, string> = {
    tcs: "tata consultancy services",
};

export function normalizeCompanyName(value: string) {
    const normalized = value
        .normalize("NFKD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .replace(/&/g, " and ")
        .replace(COMPANY_SUFFIXES, " ")
        .replace(/[^a-z0-9]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    return aliases[normalized] ?? normalized;
}

function levenshtein(left: string, right: string) {
    const previous = Array.from({ length: right.length + 1 }, (_, index) => index);

    for (let leftIndex = 1; leftIndex <= left.length; leftIndex += 1) {
        let diagonal = previous[0];
        previous[0] = leftIndex;

        for (let rightIndex = 1; rightIndex <= right.length; rightIndex += 1) {
            const above = previous[rightIndex];
            previous[rightIndex] = Math.min(
                previous[rightIndex] + 1,
                previous[rightIndex - 1] + 1,
                diagonal + (left[leftIndex - 1] === right[rightIndex - 1] ? 0 : 1),
            );
            diagonal = above;
        }
    }

    return previous[right.length];
}

export function companySimilarity(left: string, right: string) {
    const normalizedLeft = normalizeCompanyName(left);
    const normalizedRight = normalizeCompanyName(right);

    if (!normalizedLeft || !normalizedRight) return 0;
    if (normalizedLeft === normalizedRight) return 1;
    if (normalizedLeft.includes(normalizedRight) || normalizedRight.includes(normalizedLeft)) return 0.92;

    const distance = levenshtein(normalizedLeft, normalizedRight);
    return 1 - distance / Math.max(normalizedLeft.length, normalizedRight.length);
}

export function isCloseCompanyMatch(left: string, right: string) {
    const normalizedLeft = normalizeCompanyName(left);
    const normalizedRight = normalizeCompanyName(right);
    const threshold = Math.max(normalizedLeft.length, normalizedRight.length) <= 6 ? 0.78 : 0.72;

    return companySimilarity(left, right) >= threshold;
}

export function slugifyCompanyName(name: string) {
    return normalizeCompanyName(name).replace(/\s+/g, "-");
}