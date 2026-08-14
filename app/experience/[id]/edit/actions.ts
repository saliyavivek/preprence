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
    // 1. Authenticate user
    const supabase = await createClient();

    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error("You must be logged in.");
    }

    // 2. Load experience
    const experience = await prisma.experience.findUnique({
        where: {
            id: experienceId,
        },
    });

    if (!experience) {
        throw new Error("Experience not found.");
    }

    // 3. Make sure this user owns the experience
    if (experience.authorId !== user.id) {
        throw new Error("You are not allowed to edit this experience.");
    }

    if (experience.status !== "draft") {
        throw new Error("This experience can no longer be edited.");
    }

    // 4. Read form data
    const roundTypeValue = formData.get("roundType")?.toString();
    const difficultyValue = formData.get("difficulty")?.toString();
    const questionsAsked = formData.get("questionsAsked")?.toString().trim();
    const durationValue = formData.get("durationMinutes")?.toString();

    // 5. Validate required field
    if (!roundTypeValue) {
        throw new Error("Please select a round type.");
    }

    // 6. Validate round type
    if (!Object.values(RoundTypeEnum).includes(roundTypeValue as RoundType)) {
        throw new Error("Invalid round type.");
    }

    // 7. Validate difficulty if provided
    let difficulty: DifficultyType | undefined;

    if (difficultyValue) {
        if (!Object.values(DifficultyEnum).includes(difficultyValue as DifficultyType)) {
            throw new Error("Invalid difficulty.");
        }

        difficulty = difficultyValue as DifficultyType;
    }

    // 8. Validate duration if provided
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

    // 9. Determine next round number
    const lastRound = await prisma.round.findFirst({
        where: {
            experienceId,
        },
        orderBy: {
            roundNumber: "desc",
        },
    });

    const roundNumber = lastRound ? lastRound.roundNumber + 1 : 1;

    // 10. Create round
    const round = await prisma.round.create({
        data: {
            experienceId,
            roundNumber,
            roundType: roundTypeValue as RoundType,
            difficulty,
            questionsAsked: questionsAsked || null,
            durationMinutes,
        },
    });

    // Redirect back to the edit page to refresh data
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

    if (experience.status !== "draft") {
        throw new Error("This experience can no longer be edited.");
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

    if (experience.status !== "draft") {
        throw new Error("This experience can no longer be edited.");
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

    // Re-number remaining rounds.
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

    // Ownership check
    if (experience.authorId !== user.id) {
        throw new Error("You are not allowed to submit this experience.");
    }

    // Only drafts can be submitted.
    if (experience.status !== "draft") {
        throw new Error("Only draft experiences can be submitted for review.");
    }

    // An experience should have at least one round.
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