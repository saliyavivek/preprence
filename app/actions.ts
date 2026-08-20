"use server";

import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

export async function addOnboardingDetails(formData: FormData) {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return {
            error: "You must be logged in.",
        };
    }

    const profile = await prisma.user.findUnique({
        where: {
            id: user.id,
        },
    });

    if (!profile) {
        return {
            error: "User profile not found.",
        };
    }

    const nameValue = formData.get("name")?.toString().trim();
    const branchValue = formData.get("branch")?.toString().trim();

    if (!nameValue || !branchValue) {
        return {
            error: "Name and branch are required.",
        };
    }

    await prisma.user.update({
        where: {
            id: user.id,
        },
        data: {
            name: nameValue,
            branch: branchValue,
            onboardingCompleted: true,
        },
    });

    revalidatePath("/");

    return {
        success: true,
    };
}