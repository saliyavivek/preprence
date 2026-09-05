"use server";

import { prisma } from "@/lib/prisma";

type SortOrder = "newest" | "oldest";

export async function getSkillExperiencePageData(
    skillSlug: string,
    sort: SortOrder = "newest",
) {
    const skill = await prisma.skill.findUnique({
        where: { slug: skillSlug },
        select: { id: true, name: true, slug: true },
    });

    if (!skill) return null;

    const where = {
        status: "published" as const,
        experienceSkills: {
            some: { skillId: skill.id }
        }
    };

    const [total, totalCompanies, experiences] = await Promise.all([
        prisma.experience.count({ where }),

        prisma.company.count({
            where: { experiences: { some: where } },
        }),

        prisma.experience.findMany({
            where,
            orderBy: { interviewDate: sort === "newest" ? "desc" : "asc" },
            select: {
                id: true,
                interviewDate: true,
                verdict: true,
                role: {
                    select: { name: true }
                },
                author: {
                    select: { degree: true, graduationYear: true },
                },
                company: {
                    select: { name: true, logoUrl: true },
                },
                rounds: {
                    select: { roundType: true },
                },
                experienceSkills: {
                    select: { skill: { select: { id: true, name: true, slug: true } } },
                },
            },
        }),
    ]);

    return {
        skill,
        total,
        totalCompanies,
        experiences: experiences.map((experience) => ({
            id: experience.id,
            company: experience.company,
            roleName: experience.role?.name || "Unknown Role",
            degree: experience.author?.degree,
            year: experience.author?.graduationYear,
            type: experience.verdict || "not_disclosed",
            timing: experience.interviewDate.toLocaleDateString("en-IN", {
                month: "short",
                year: "numeric",
            }),
            rounds: experience.rounds.map(({ roundType }) => roundType),
            skills: experience.experienceSkills.map(({ skill }) => skill.name),
        })),
    };
}