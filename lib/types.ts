import { statusLabels } from "@/components/StatusBadge";

export type Experience = {
    id: string;
    status?: ExperienceStatus | string;
    roleTitle: string;
    degree: string;
    graduationYear: number;
    interviewDate: Date;
    verdict: string | null;
    company: { name: string; slug: string; logoUrl: string | null };
    rounds: Array<{ roundType: string; roundNumber?: number }>;
};

export type ExperienceStatus = keyof typeof statusLabels;