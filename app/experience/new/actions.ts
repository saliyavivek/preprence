"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { Verdict as VerdictEnum } from "@/app/generated/prisma/enums";
import type { Verdict as VerdictType } from "@/app/generated/prisma/enums";
import { redirect } from "next/navigation";

export async function createExperience(formData: FormData): Promise<void> {
    const supabase = await createClient();

    // 1. Get authenticated Supabase user
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("You must be logged in to submit an experience.");
    }

    // 2. Make sure the user exists in our Prisma database
    const profile = await prisma.user.findUnique({
        where: {
            id: user.id,
        },
    });

    if (!profile) {
        throw new Error("User profile not found.");
    }

    // 3. Read form data
    const companyId = formData.get("companyId")?.toString();
    const degree = formData.get("degree")?.toString().trim();
    const graduationYearValue = formData.get("graduationYear")?.toString();
    const roleTitle = formData.get("roleTitle")?.toString().trim();
    const interviewDate = formData.get("interviewDate")?.toString();
    const verdictValue = formData.get("verdict")?.toString();
    const overallTips = formData.get("overallTips")?.toString().trim();
    const isAnonymous = formData.get("isAnonymous") === "on";

    // 4. Basic validation
    if (
        !companyId ||
        !degree ||
        !graduationYearValue ||
        !roleTitle ||
        !interviewDate
    ) {
        throw new Error("Please fill in all required fields.");
    }

    const graduationYear = Number(graduationYearValue);

    if (!Number.isInteger(graduationYear)) {
        throw new Error("Invalid graduation year.");
    }

    // 5. Check that company exists
    const company = await prisma.company.findUnique({
        where: {
            id: companyId,
        },
    });

    if (!company) {
        throw new Error("Company not found.");
    }

    // 6. Validate verdict
    let verdict: VerdictType | undefined;

    if (verdictValue) {

        if (!Object.values(VerdictEnum).includes(verdictValue as VerdictType)) {
            throw new Error("Invalid verdict.");
        }

        verdict = verdictValue as VerdictType;
    }

    // 7. Create experience
    const experience = await prisma.experience.create({
        data: {
            authorId: profile.id,
            companyId: company.id,
            degree,
            graduationYear,
            roleTitle,
            interviewDate: new Date(interviewDate),
            verdict,
            overallTips: overallTips || null,
            isAnonymous,
        },
    });

    redirect(`/experience/${experience.id}/edit`);
}