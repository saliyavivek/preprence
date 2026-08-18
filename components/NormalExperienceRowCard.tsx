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
      className="group flex gap-5 border-b border-border p-5 transition-colors hover:bg-muted/20 sm:p-6"
    >
      {showCompanyMark ? <CompanyMarkMedium company={experience.company} /> : null}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight group-hover:text-primary">{experience.roleTitle}</h2>
            <p className="mt-1 text-md font-medium text-foreground">{experience.company.name}</p>
            <p className="mt-1 text-sm text-muted-foreground flex gap-2">
              <span className="flex gap-1 items-center">
                <HugeiconsIcon
                  className="w-4 h-4"
                  size="100%"
                  icon={GraduationCapIcon}
                />
                {experience.degree}
              </span>
              ·
              <span className="flex gap-1 items-center">
                <HugeiconsIcon
                  className="w-4 h-4"
                  size="100%"
                  icon={School01Icon}
                />
                Class of {experience.graduationYear}
              </span>
            </p>
          </div>
          <VerdictBadge verdict={experience.verdict} />
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-muted-foreground">
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
              className="rounded-md border border-border px-3 py-1 text-xs text-muted-foreground"
            >
              {label}
            </span>
          ))}
        </div>
      </div>
      <span
        aria-hidden="true"
        className="self-center text-xl text-primary transition-transform duration-200 group-hover:translate-x-1"
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
