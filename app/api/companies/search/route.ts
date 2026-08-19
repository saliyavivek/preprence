import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
    const query = new URL(request.url).searchParams.get("q")?.trim() ?? "";

    if (!query) {
        return NextResponse.json({ companies: [] });
    }

    const companies = await prisma.company.findMany({
        where: {
            name: {
                contains: query,
                mode: "insensitive",
            },
            experiences: {
                some: { status: "published" },
            },
        },
        orderBy: { name: "asc" },
        take: 6,
        include: {
            _count: {
                select: {
                    experiences: {
                        where: { status: "published" },
                    },
                },
            },
        },
    });

    return NextResponse.json({ companies });
}