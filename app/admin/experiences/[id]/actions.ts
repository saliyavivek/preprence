"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/admin";
import { redirect } from "next/navigation";

export async function takeDownExperience(experienceId: string) {
    await requireAdmin();

    const experience = await prisma.experience.findUnique({
        where: {
            id: experienceId,
        },
    });

    if (!experience) {
        throw new Error("Experience not found.");
    }

    if (experience.status !== "published") {
        throw new Error("Only published experiences can be taken down.");
    }

    await prisma.experience.update({
        where: {
            id: experienceId,
        },
        data: {
            status: "taken_down",
        },
    });

    redirect(`/admin/experiences`);
}