"use server";

import { unstable_cache } from "next/cache";
import { prisma } from "@/lib/prisma";
import { PUBLIC_BROWSE_REVALIDATE_SECONDS, PUBLIC_BROWSE_TAG } from "@/lib/public-cache";

type SortOrder = "newest" | "oldest";

const getCachedRoleExperiencePageData = unstable_cache(async (
    roleSlug: string,
    sort: SortOrder,
) => {
    const role = await prisma.role.findUnique({
        where: { slug: roleSlug },
        select: {
            id: true,
            name: true,
            slug: true,
        },
    });

    if (!role) {
        return null;
    }

    const where = {
        roleId: role.id,
        status: "published" as const,
    };

    const [total, totalCompanies, experiences] = await Promise.all([
        prisma.experience.count({ where }),

        prisma.company.count({
            where: {
                experiences: { some: where },
            },
        }),

        prisma.experience.findMany({
            where,
            orderBy: {
                interviewDate: sort === "newest" ? "desc" : "asc",
            },
            select: {
                id: true,
                interviewDate: true,
                verdict: true,

                author: {
                    select: {
                        degree: true,
                        graduationYear: true,
                    },
                },

                company: {
                    select: {
                        name: true,
                        logoUrl: true,
                    },
                },

                rounds: {
                    select: {
                        roundType: true,
                    },
                },

                experienceSkills: {
                    select: {
                        skill: {
                            select: {
                                id: true,
                                name: true,
                                slug: true,
                            },
                        },
                    },
                },
            },
        }),
    ]);

    return {
        role,
        total,
        totalCompanies,
        experiences: experiences.map((experience) => ({
            id: experience.id,
            company: experience.company,
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
}, ["role-experience-page"], { revalidate: PUBLIC_BROWSE_REVALIDATE_SECONDS, tags: [PUBLIC_BROWSE_TAG] });

export async function getRoleExperiencePageData(roleSlug: string, sort: SortOrder = "newest") {
    return getCachedRoleExperiencePageData(roleSlug, sort);
}