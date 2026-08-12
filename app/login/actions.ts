"use server";

import { createClient } from "@/lib/supabase/server";
import { isCollegeEmail } from "@/lib/auth/college-email";

export async function sendMagicLink(email: string) {
    const normalizedEmail = email.trim().toLowerCase();

    if (!isCollegeEmail(normalizedEmail)) {
        return {
            error: "Please use your college email address.",
        };
    }

    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithOtp({
        email: normalizedEmail,
        options: {
            emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
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