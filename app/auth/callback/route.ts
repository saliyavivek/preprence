import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { isCollegeEmail } from "@/lib/auth/college-email";
import { prisma } from "@/lib/prisma";

async function removeNewIneligibleProfile(userId: string, email: string, exchangeStartedAt: Date) {
    const profile = await prisma.user.findUnique({
        where: { id: userId },
        select: {
            id: true,
            email: true,
            createdAt: true,
            _count: {
                select: {
                    experiences: true,
                    reports: true,
                },
            },
        },
    });

    if (
        profile &&
        profile.email.toLowerCase() === email.toLowerCase() &&
        profile.createdAt >= exchangeStartedAt &&
        profile._count.experiences === 0 &&
        profile._count.reports === 0
    ) {
        await prisma.user.delete({ where: { id: profile.id } });
    }
}

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url);
    const exchangeStartedAt = new Date();

    const code = searchParams.get("code");
    const next = searchParams.get("next");
    const destination = next?.startsWith("/") && !next.startsWith("//") ? next : "/";
    const authError = searchParams.get("error");

    if (authError || !code) {
        return NextResponse.redirect(`${origin}/login?error=auth&next=${encodeURIComponent(destination)}`);
    }

    const supabase = await createClient();

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
        return NextResponse.redirect(`${origin}/login?error=auth&next=${encodeURIComponent(destination)}`);
    }

    const {
        data: { user },
    } = await supabase.auth.getUser();

    const email = user?.email;
    let eligible = false;
    try {
        eligible = Boolean(email && isCollegeEmail(email));
    } catch {
        await supabase.auth.signOut();
        return NextResponse.redirect(`${origin}/login?error=auth&next=${encodeURIComponent(destination)}`);
    }

    if (!user || !eligible) {
        if (user?.email) {
            await removeNewIneligibleProfile(user.id, user.email, exchangeStartedAt);
        }
        await supabase.auth.signOut();
        return NextResponse.redirect(`${origin}/login?error=college_email&next=${encodeURIComponent(destination)}`);
    }

    return NextResponse.redirect(`${origin}${destination}`);
}