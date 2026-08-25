"use server";

import { createClient } from "@/lib/supabase/server";
import { isCollegeEmail } from "@/lib/auth/college-email";
import { getSiteUrl } from "@/lib/site-url";

export async function sendMagicLink(email: string, nextPath = "/") {
    const normalizedEmail = email.trim().toLowerCase();

    if (!isCollegeEmail(normalizedEmail)) {
        return {
            error: "Sign in failed. Please use your @ldce.ac.in college email address.",
        };
    }

    const supabase = await createClient();

    const safeNextPath = nextPath.startsWith("/") && !nextPath.startsWith("//") ? nextPath : "/";
    const callbackUrl = new URL(`${getSiteUrl()}/auth/callback`);
    callbackUrl.searchParams.set("next", safeNextPath);

    const { error } = await supabase.auth.signInWithOtp({
        email: normalizedEmail,
        options: {
            emailRedirectTo: callbackUrl.toString(),
        },
    });

    if (error) {
        return {
            error: error.message,
        };
    }

    return {
        success: true,
    };
}