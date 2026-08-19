import Link from "next/link";
import { ArrowRight01Icon, Calendar03Icon, GraduationCapIcon, Layers01Icon, School01Icon } from "@hugeicons/core-free-icons";
import type { Experience } from "@/lib/types";
import { CompanyMarkMedium } from "./CompanyMark";
import { VerdictBadge } from "./VerdictBadge";
import { HugeiconsIcon } from "@hugeicons/react";

const roundLabels: Record<string, string> = {
  aptitude: "Aptitude Test",
  online_assessment: "Online Assessment",
  coding: "Coding Interview",
  technical: "Technical Interview",
  managerial: "Managerial Interview",
  hr: "HR Interview",
  other: "Other Round",
};

export function NormalExperienceRowCard({ experience, showCompanyMark = true }: { experience: Experience; showCompanyMark?: boolean }) {
  const labels = Array.from(new Set(experience.rounds.map((round) => roundLabels[round.roundType] ?? "Interview Round"))).slice(0, 3);
  return (
    <Link
      href={`/experiences/${experience.id}`}
      className="group relative flex gap-3 border-b border-border p-4 pr-11 transition-colors hover:bg-muted/20 sm:gap-5 sm:p-6"
    >
      {showCompanyMark ? <CompanyMarkMedium company={experience.company} /> : null}
      <div className="min-w-0 flex-1">
        <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
          <div className="min-w-0">
            <div className="flex min-w-0 items-start justify-between gap-3">
              <h2 className="min-w-0 truncate text-lg font-semibold tracking-tight group-hover:text-primary">{experience.roleTitle}</h2>
              <div className="shrink-0 sm:hidden">
                <VerdictBadge verdict={experience.verdict} />
              </div>
            </div>
            <p className="mt-1 text-md font-medium text-foreground">{experience.company.name}</p>
            <p className="mt-1 flex gap-2 flex-wrap text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <HugeiconsIcon
                  className="w-4 h-4"
                  size="100%"
                  icon={GraduationCapIcon}
                />
                {experience.degree}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <HugeiconsIcon
                  className="w-4 h-4"
                  size="100%"
                  icon={School01Icon}
                />
                Class of {experience.graduationYear}
              </span>
            </p>
          </div>
          <div className="hidden shrink-0 sm:block">
            <VerdictBadge verdict={experience.verdict} />
          </div>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground sm:mt-4 sm:gap-x-5">
          <span className="flex gap-1 items-center">
            <HugeiconsIcon
              className="w-4 h-4"
              size="100%"
              icon={Calendar03Icon}
            />
            {experience.interviewDate.toLocaleDateString("en-US", { month: "short", year: "numeric" })}
          </span>
          <span className="text-xs text-gray-200">|</span>
          <span className="flex items-center gap-1">
            <HugeiconsIcon
              icon={Layers01Icon}
              size="100%"
              className="w-4 h-4"
            />
            {experience.rounds.length} {experience.rounds.length === 1 ? "Round" : "Rounds"}
          </span>
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          {labels.map((label) => (
            <span
              key={label}
              className="max-w-full rounded-md border border-border px-2.5 py-1 text-[11px] md:text-[12px] text-muted-foreground sm:px-3"
            >
              {label}
            </span>
          ))}
        </div>
      </div>
      <span
        aria-hidden="true"
        className="absolute right-4 top-1/2 -translate-y-1/2 text-xl text-primary transition-transform duration-200 group-hover:translate-x-1 sm:static sm:translate-y-0 sm:self-center"
      >
        <HugeiconsIcon
          size="100%"
          className="h-4 w-4"
          icon={ArrowRight01Icon}
        />
      </span>
    </Link>
  );
}
