"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { Verdict as VerdictEnum } from "@/app/generated/prisma/enums";
import type { Verdict as VerdictType } from "@/app/generated/prisma/enums";
import { redirect } from "next/navigation";
import { companySimilarity, isCloseCompanyMatch, normalizeCompanyName, slugifyCompanyName } from "@/lib/company-matching";

function slugifyRole(text: string) {
    return text
        .toString()
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^\w\-]+/g, '')
        .replace(/\-\-+/g, '-');
}

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
    const companyName = formData.get("companyName")?.toString().trim();
    const degree = formData.get("degree")?.toString().trim();
    const graduationYearValue = formData.get("graduationYear")?.toString();
    const roleName = formData.get("roleName")?.toString().trim();
    const interviewDate = formData.get("interviewDate")?.toString();
    const verdictValue = formData.get("verdict")?.toString();

    // 4. Basic validation
    if (
        (!companyId && !companyName) ||
        !degree ||
        !graduationYearValue ||
        !roleName ||
        !interviewDate
    ) {
        throw new Error("Please fill in all required fields.");
    }

    const graduationYear = Number(graduationYearValue);

    if (!Number.isInteger(graduationYear)) {
        throw new Error("Invalid graduation year.");
    }

    // 5. Resolve a selected company, or canonicalize/create a deliberate new company.
    const company = await prisma.$transaction(async (transaction) => {
        if (companyId) {
            const selectedCompany = await transaction.company.findUnique({ where: { id: companyId } });
            if (!selectedCompany) throw new Error("Company not found.");
            return selectedCompany;
        }

        const normalizedInput = normalizeCompanyName(companyName ?? "");
        if (!normalizedInput) throw new Error("Please select or enter a company.");

        const existingCompanies = await transaction.company.findMany({ select: { id: true, name: true, slug: true, logoUrl: true } });
        const exactCompany = existingCompanies.find((existing) => normalizeCompanyName(existing.name) === normalizedInput);
        if (exactCompany) return exactCompany;

        const closeCompany = existingCompanies
            .filter((existing) => isCloseCompanyMatch(companyName ?? "", existing.name))
            .sort((left, right) => companySimilarity(companyName ?? "", right.name) - companySimilarity(companyName ?? "", left.name))[0];
        if (closeCompany) return closeCompany;

        const baseSlug = slugifyCompanyName(companyName ?? "");
        let slug = baseSlug;
        let suffix = 2;
        while (await transaction.company.findUnique({ where: { slug } })) {
            slug = `${baseSlug}-${suffix}`;
            suffix += 1;
        }

        return transaction.company.create({
            data: { name: companyName!.replace(/\s+/g, " "), slug },
        });
    });

    // 6. Validate verdict
    let verdict: VerdictType | undefined;

    if (verdictValue) {

        if (!Object.values(VerdictEnum).includes(verdictValue as VerdictType)) {
            throw new Error("Invalid verdict.");
        }

        verdict = verdictValue as VerdictType;
    }

    // 7. Find or create role
    const roleSlug = slugifyRole(roleName);
    const role = await prisma.role.upsert({
        where: { slug: roleSlug },
        update: { name: roleName },
        create: { name: roleName, slug: roleSlug },
    });

    // 8. Create experience
    const experience = await prisma.experience.create({
        data: {
            authorId: profile.id,
            companyId: company.id,
            degree,
            graduationYear,
            roleId: role.id,
            interviewDate: new Date(interviewDate),
            verdict,
        },
    });

    redirect(`/experience/${experience.id}/edit`);
}