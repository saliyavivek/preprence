import { statusLabels } from "@/components/StatusBadge";

export type Experience = {
    id: string;
    status?: ExperienceStatus | string;
    role: { id: string; name: string } | null;
    interviewDate: Date;
    verdict: string | null;
    isAnonymous: boolean;
    author?: { id?: string; name?: string | null; email?: string; degree?: string | null; graduationYear?: number | null } | null;
    company: { name: string; slug: string; logoUrl: string | null };
    rounds: Array<{ roundType: string; roundNumber?: number }>;
    experienceSkills?: Array<{ skill: { id: string; name: string } }>;
    createdAt?: Date;
};

export type ExperienceStatus = keyof typeof statusLabels;