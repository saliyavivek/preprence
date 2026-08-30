import { statusLabels } from "@/components/StatusBadge";

export type Experience = {
    id: string;
    status?: ExperienceStatus | string;
    role: { id: string; name: string } | null;
    degree: string;
    graduationYear: number;
    interviewDate: Date;
    verdict: string | null;
    isAnonymous: boolean;
    author?: { name: string | null; email: string } | null;
    company: { name: string; slug: string; logoUrl: string | null };
    rounds: Array<{ roundType: string; roundNumber?: number }>;
    experienceSkills?: Array<{ skill: { id: string; name: string } }>;
};

export type ExperienceStatus = keyof typeof statusLabels;