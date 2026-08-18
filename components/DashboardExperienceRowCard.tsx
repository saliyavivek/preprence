import Link from "next/link";

import { CompanyMarkMedium } from "@/components/CompanyMark";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar03Icon, GraduationCapIcon, Layers01Icon, School01Icon } from "@hugeicons/core-free-icons";
import { formatInterviewDate } from "@/lib/helpers";
import { normalizeStatus, Status } from "./StatusBadge";
import { ExperienceStatus } from "@/lib/types";

export type DashboardExperienceRow = {
  id: string;
  status?: ExperienceStatus | string;
  roleTitle: string;
  degree: string;
  graduationYear: number;
  interviewDate: Date | string;
  rounds: Array<unknown>;
  company: {
    name: string;
    logoUrl: string | null;
  };
};

export function DashboardExperienceRowCard({ experience, className = "" }: { experience: DashboardExperienceRow; className?: string }) {
  const status = normalizeStatus(experience.status);
  const href = experience.status === "draft" ? `/experience/${experience.id}/edit` : `/experiences/${experience.id}`;
  const actionLabel = experience.status === "draft" ? "Continue editing" : "View";

  return (
    <article className={`flex flex-col gap-1 border border-border bg-card p-5 shadow-[0_2px_10px_rgba(32,37,34,0.04)] sm:p-6 ${className}`}>
      <div
        key={experience.id}
        className="flex flex-col gap-4 sm:flex-row sm:items-center"
      >
        <div className="flex size-20 items-center justify-center overflow-hidden rounded-lg border border-border bg-background">
          <CompanyMarkMedium company={experience.company} />
        </div>

        <div className="min-w-0 flex-1">
          <h3 className="text-[1.05rem] font-semibold tracking-tight text-foreground">{experience.company.name}</h3>
          <p className="mt-0.5 text-[0.95rem] text-muted-foreground">{experience.roleTitle}</p>
          <div className="mt-2.5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.85rem] text-muted-foreground/80">
            <span className="flex gap-1 items-center">
              <HugeiconsIcon
                className="w-4 h-4"
                size="100%"
                icon={GraduationCapIcon}
              />
              {experience.degree}
            </span>
            <span className="flex gap-1 items-center">
              <HugeiconsIcon
                className="w-4 h-4"
                size="100%"
                icon={School01Icon}
              />
              Class of {experience.graduationYear}
            </span>
            <span className="flex items-center gap-1">
              <HugeiconsIcon
                icon={Layers01Icon}
                size="100%"
                className="w-4 h-4"
              />
              {experience.rounds.length} {experience.rounds.length === 1 ? "Round" : "Rounds"}
            </span>
            <span className="flex gap-1 items-center">
              <HugeiconsIcon
                className="w-4 h-4"
                size="100%"
                icon={Calendar03Icon}
              />
              {formatInterviewDate(experience.interviewDate)}
            </span>
          </div>
        </div>

        <div className="flex gap-2 items-center">
          <Status status={status} />
          <Link
            href={href}
            className="inline-flex items-center justify-center rounded-md border border-primary px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            {actionLabel}
          </Link>
        </div>
      </div>
    </article>
  );
}
