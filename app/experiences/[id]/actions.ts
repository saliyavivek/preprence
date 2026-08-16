"use server";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export async function ReportExperience(
    experienceId: string,
    formData: FormData
): Promise<void> {
    // 1. Authenticate user
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("You must be logged in.");
    }

    const report = await prisma.report.findFirst({
        where: {
            experienceId,
            reportedById: user.id
        }
    });

    if (report) throw new Error("You've already reported this interview experience.");

    const reason = formData.get("reason")?.toString();

    await prisma.report.create({
        data: {
            experienceId,
            reportedById: user.id,
            reason,
        }
    })

    redirect(`/experiences/${experienceId}`)
}
