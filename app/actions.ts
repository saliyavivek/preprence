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
    const graduationYearValue = formData.get("graduationYear")?.toString().trim();

    if (!nameValue || !branchValue || !graduationYearValue) {
        return {
            error: "Name, branch, and graduation year are required.",
        };
    }

    const graduationYear = Number(graduationYearValue);
    if (!Number.isInteger(graduationYear) || graduationYear < 2000 || graduationYear > 2100) {
        return {
            error: "Please enter a valid graduation year.",
        };
    }

    await prisma.user.update({
        where: {
            id: user.id,
        },
        data: {
            name: nameValue,
            degree: branchValue,
            graduationYear: graduationYear,
            onboardingCompleted: true,
        },
    });

    revalidatePath("/");
    revalidatePath("/dashboard");

    return {
        success: true,
    };
}