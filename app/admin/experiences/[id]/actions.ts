"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/admin";
import { redirect } from "next/navigation";

export async function publishExperience(experienceId: string): Promise<void> {
    await requireAdmin();

    const experience = await prisma.experience.findUnique({
        where: {
            id: experienceId,
        },
    });

    if (!experience) {
        throw new Error("Experience not found.");
    }

    if (experience.status !== "pending_review") {
        throw new Error("Only experiences pending review can be published.");
    }

    await prisma.experience.update({
        where: {
            id: experienceId,
        },
        data: {
            status: "published",
        },
    });

    redirect(`/admin/experiences`);
}

export async function rejectExperience(experienceId: string): Promise<void> {
    await requireAdmin();

    const experience = await prisma.experience.findUnique({
        where: {
            id: experienceId,
        },
    });

    if (!experience) {
        throw new Error("Experience not found.");
    }

    if (experience.status !== "pending_review") {
        throw new Error("Only experiences pending review can be rejected.");
    }

    await prisma.experience.update({
        where: {
            id: experienceId,
        },
        data: {
            status: "rejected",
        },
    });

    redirect(`/admin/experiences`);
}