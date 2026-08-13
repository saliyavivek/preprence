import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export async function requireAdmin() {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/login");
    }

    const profile = await prisma.user.findUnique({
        where: {
            id: user.id,
        },
        select: {
            id: true,
            isAdmin: true,
        },
    });

    if (!profile || !profile.isAdmin) {
        redirect("/dashboard");
    }

    return profile;
}