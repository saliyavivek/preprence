// app/api/search/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
    const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";

    if (!query) {
        return NextResponse.json({ companies: [], roles: [], skills: [] });
    }

    const searchParam = { contains: query, mode: "insensitive" as const };
    const publishedCondition = { status: "published" as const };

    const [companies, roles, skills] = await Promise.all([
        prisma.company.findMany({
            where: { name: searchParam },
            orderBy: { name: "asc" },
            take: 4,
            include: {
                _count: {
                    select: { experiences: { where: publishedCondition } },
                },
            },
        }),
        prisma.role.findMany({
            where: { name: searchParam },
            orderBy: { name: "asc" },
            take: 3,
            include: {
                _count: {
                    select: { experiences: { where: publishedCondition } },
                },
            },
        }),
        prisma.skill.findMany({
            where: { name: searchParam },
            orderBy: { name: "asc" },
            take: 3,
            include: {
                _count: {
                    // Skill joins through ExperienceSkill, so we nest the condition[cite: 7]
                    select: { experiences: { where: { experience: publishedCondition } } },
                },
            },
        })
    ]);

    return NextResponse.json({ companies, roles, skills });
}