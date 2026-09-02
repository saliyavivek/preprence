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
  role: { id: string; name: string } | null;
  author: { degree: string | null; graduationYear: number | null } | null;
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
    <article className={`border border-border rounded-sm bg-card p-4 shadow-[0_2px_10px_rgba(32,37,34,0.04)] sm:p-6 ${className}`}>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:gap-6">
        <div className="flex min-w-0 flex-1 items-start gap-4">
          <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-background">
            <CompanyMarkMedium company={experience.company} />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex justify-between items-center">
              <h3 className="truncate text-[1.05rem] font-semibold tracking-tight text-foreground sm:text-lg">{experience.company.name}</h3>
              <Status status={status} />
            </div>

            <p className="mt-0.5 truncate text-[0.95rem] text-muted-foreground">{experience.role?.name || "N/A"}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-between sm:items-center">
              <div className="grid grid-cols-2 gap-x-3 gap-y-2 text-[0.8rem] sm:text-[0.9rem] text-muted-foreground/80 sm:flex sm:flex-wrap sm:items-center sm:gap-x-5">
                <span className="flex min-w-0 items-center gap-1">
                  <HugeiconsIcon
                    className="w-4 h-4"
                    size="100%"
                    icon={GraduationCapIcon}
                  />
                  <span className="truncate">{experience.author?.degree}</span>
                </span>
                <span
                  aria-hidden="true"
                  className="hidden text-xs text-gray-200 sm:inline"
                >
                  |
                </span>
                <span className="flex min-w-0 items-center gap-1">
                  <HugeiconsIcon
                    className="w-4 h-4"
                    size="100%"
                    icon={School01Icon}
                  />
                  <span className="truncate">Class of {experience.author?.graduationYear}</span>
                </span>
                <span
                  aria-hidden="true"
                  className="hidden text-xs text-gray-200 sm:inline"
                >
                  |
                </span>
                <span className="flex min-w-0 items-center gap-1">
                  <HugeiconsIcon
                    icon={Layers01Icon}
                    size="100%"
                    className="w-4 h-4"
                  />
                  <span className="truncate">
                    {experience.rounds.length} {experience.rounds.length === 1 ? "Round" : "Rounds"}
                  </span>
                </span>
                <span
                  aria-hidden="true"
                  className="hidden text-xs text-gray-200 sm:inline"
                >
                  |
                </span>
                <span className="flex min-w-0 items-center gap-1">
                  <HugeiconsIcon
                    className="w-4 h-4"
                    size="100%"
                    icon={Calendar03Icon}
                  />
                  <span className="truncate">{formatInterviewDate(experience.interviewDate)}</span>
                </span>
              </div>
              <Link
                href={href}
                className="inline-flex w-full sm:w-fit flex-1 items-center justify-center rounded-md border border-primary px-3 py-1.5 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 sm:flex-none"
              >
                {actionLabel}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
