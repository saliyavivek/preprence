"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { Difficulty as DifficultyEnum } from "@/app/generated/prisma/enums";
import type { Difficulty as DifficultyType } from "@/app/generated/prisma/enums";
import { RoundType as RoundTypeEnum } from "@/app/generated/prisma/enums";
import type { RoundType } from "@/app/generated/prisma/enums";

export async function createRound(
    experienceId: string,
    formData: FormData
): Promise<void> {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("You must be logged in.");
    }

    const experience = await prisma.experience.findUnique({
        where: {
            id: experienceId,
        },
    });

    if (!experience) {
        throw new Error("Experience not found.");
    }

    if (experience.authorId !== user.id) {
        throw new Error("You are not allowed to edit this experience.");
    }

    const roundTypeValue = formData.get("roundType")?.toString();
    const difficultyValue = formData.get("difficulty")?.toString();
    const questionsAsked = formData.get("questionsAsked")?.toString().trim();
    const durationValue = formData.get("durationMinutes")?.toString();

    if (!roundTypeValue) {
        throw new Error("Please select a round type.");
    }

    if (!Object.values(RoundTypeEnum).includes(roundTypeValue as RoundType)) {
        throw new Error("Invalid round type.");
    }

    let difficulty: DifficultyType | undefined;

    if (difficultyValue) {
        if (!Object.values(DifficultyEnum).includes(difficultyValue as DifficultyType)) {
            throw new Error("Invalid difficulty.");
        }

        difficulty = difficultyValue as DifficultyType;
    }

    let durationMinutes: number | undefined;

    if (durationValue) {
        durationMinutes = Number(durationValue);

        if (
            !Number.isInteger(durationMinutes) ||
            durationMinutes <= 0
        ) {
            throw new Error("Duration must be a positive whole number.");
        }
    }

    const lastRound = await prisma.round.findFirst({
        where: {
            experienceId,
        },
        orderBy: {
            roundNumber: "desc",
        },
    });

    const roundNumber = lastRound ? lastRound.roundNumber + 1 : 1;

    await prisma.round.create({
        data: {
            experienceId,
            roundNumber,
            roundType: roundTypeValue as RoundType,
            difficulty,
            questionsAsked: questionsAsked || null,
            durationMinutes,
        },
    });

    redirect(`/experience/${experienceId}/edit`);
}

export async function updateRound(
    experienceId: string,
    roundId: string,
    formData: FormData
): Promise<void> {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("You must be logged in.");
    }

    const experience = await prisma.experience.findUnique({
        where: {
            id: experienceId,
        },
    });

    if (!experience) {
        throw new Error("Experience not found.");
    }

    if (experience.authorId !== user.id) {
        throw new Error("You are not allowed to edit this experience.");
    }

    const round = await prisma.round.findUnique({
        where: {
            id: roundId,
        },
    });

    if (!round || round.experienceId !== experienceId) {
        throw new Error("Round not found.");
    }

    const roundTypeValue = formData.get("roundType")?.toString();
    const difficultyValue = formData.get("difficulty")?.toString();
    const questionsAsked = formData.get("questionsAsked")?.toString().trim();
    const durationValue = formData.get("durationMinutes")?.toString();

    if (!roundTypeValue) {
        throw new Error("Please select a round type.");
    }

    if (!Object.values(RoundTypeEnum).includes(roundTypeValue as RoundType)) {
        throw new Error("Invalid round type.");
    }

    let difficulty: DifficultyType | null = null;

    if (difficultyValue) {
        if (!Object.values(DifficultyEnum).includes(difficultyValue as DifficultyType)) {
            throw new Error("Invalid difficulty.");
        }

        difficulty = difficultyValue as DifficultyType;
    }

    let durationMinutes: number | null = null;

    if (durationValue) {
        durationMinutes = Number(durationValue);

        if (
            !Number.isInteger(durationMinutes) ||
            durationMinutes <= 0
        ) {
            throw new Error("Duration must be a positive whole number.");
        }
    }

    await prisma.round.update({
        where: {
            id: roundId,
        },
        data: {
            roundType: roundTypeValue as RoundType,
            difficulty,
            questionsAsked: questionsAsked || null,
            durationMinutes,
        },
    });

    redirect(`/experience/${experienceId}/edit`);
}

export async function deleteRound(
    experienceId: string,
    roundId: string
): Promise<void> {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("You must be logged in.");
    }

    const experience = await prisma.experience.findUnique({
        where: {
            id: experienceId,
        },
    });

    if (!experience) {
        throw new Error("Experience not found.");
    }

    if (experience.authorId !== user.id) {
        throw new Error("You are not allowed to edit this experience.");
    }

    const round = await prisma.round.findUnique({
        where: {
            id: roundId,
        },
    });

    if (!round || round.experienceId !== experienceId) {
        throw new Error("Round not found.");
    }

    await prisma.round.delete({
        where: {
            id: roundId,
        },
    });

    const remainingRounds = await prisma.round.findMany({
        where: {
            experienceId,
        },
        orderBy: {
            roundNumber: "asc",
        },
    });

    await prisma.$transaction(
        remainingRounds.map((round, index) =>
            prisma.round.update({
                where: {
                    id: round.id,
                },
                data: {
                    roundNumber: index + 1,
                },
            })
        )
    );

    redirect(`/experience/${experienceId}/edit`);
}

export async function publishExperience(
    experienceId: string
): Promise<void> {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("You must be logged in.");
    }

    const experience = await prisma.experience.findUnique({
        where: {
            id: experienceId,
        },
        include: {
            rounds: true,
        },
    });

    if (!experience) {
        throw new Error("Experience not found.");
    }

    if (experience.authorId !== user.id) {
        throw new Error("You are not allowed to submit this experience.");
    }

    if (experience.rounds.length === 0) {
        throw new Error("Please add at least one interview round.");
    }

    await prisma.experience.update({
        where: {
            id: experienceId,
        },
        data: {
            status: "published",
        },
    });

    redirect(`/experiences/${experienceId}`);
}

export async function updateExperience(experienceId: string,
    formData: FormData
): Promise<void> {
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("You must be logged in.");
    }

    const experience = await prisma.experience.findUnique({
        where: {
            id: experienceId,
        },
    });

    if (!experience) {
        throw new Error("Experience not found.");
    }

    if (experience.authorId !== user.id) {
        throw new Error("You are not allowed to edit this experience.");
    }

    const overallTips = formData.get("overallTips")?.toString().trim();
    const isAnonymous = formData.get("isAnonymous") === "on";

    await prisma.experience.update({
        where: {
            id: experienceId
        },
        data: {
            overallTips,
            isAnonymous
        }
    })
}