export function isCollegeEmail(email: string) {
    const domain = process.env.COLLEGE_EMAIL_DOMAIN?.toLowerCase();

    if (!domain) {
        throw new Error("COLLEGE_EMAIL_DOMAIN is not configured");
    }

    const normalizedEmail = email.trim().toLowerCase();

    return normalizedEmail.endsWith(`@${domain}`);
}