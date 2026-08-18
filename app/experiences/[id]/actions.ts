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

export async function deleteExperience(
    experienceId: string,
    userId: string,
): Promise<void> {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("You must be logged in.");
    }

    if (user.id !== userId) {
        throw new Error("You are not allowed to delete this experience.");
    }

    const experience = await prisma.experience.findUnique({
        where: {
            id: experienceId,
            authorId: userId,
        },
        include: {
            rounds: true,
            reports: true,
        },
    });

    if (!experience) {
        throw new Error("You must be the author of this experience to delete it.");
    }

    await prisma.$transaction([
        prisma.report.deleteMany({
            where: {
                experienceId,
            },
        }),
        prisma.round.deleteMany({
            where: {
                experienceId,
            },
        }),
        prisma.experience.delete({
            where: {
                id: experienceId,
                authorId: userId,
            },
        }),
    ]);

    redirect('/dashboard/experiences');
}
