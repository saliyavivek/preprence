"use client";

import { Experience } from "@/lib/types";
import { CompanyMarkLarge } from "./CompanyMark";
import { HugeiconsIcon } from "@hugeicons/react";
import { Calendar03Icon, GhostIcon, GraduationCapIcon, School01Icon, User03Icon } from "@hugeicons/core-free-icons";
import { VerdictBadge } from "./VerdictBadge";

export default function ExperienceHeader({ experience }: { experience: Experience }) {
  const interviewDate = experience.interviewDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  const authorLabel = experience.isAnonymous ? "Anonymous" : (experience.author?.name ?? experience.author?.email);

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-6">
      <CompanyMarkLarge company={experience.company} />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold tracking-[-0.045em] text-foreground sm:text-3xl lg:text-[2rem]">{experience.company.name}</h1>
          {experience.verdict && (
            <div className="sm:hidden block shrink-0 sm:px-4 sm:py-3">
              <VerdictBadge verdict={experience.verdict} />
            </div>
          )}
        </div>
        <p className="text-base text-muted-foreground sm:text-[1.15rem] sm:leading-tight md:text-[1.25rem]">{experience.roleTitle}</p>
        {authorLabel && (
          <p className="flex items-center gap-1 text-base text-muted-foreground sm:text-[0.9rem] sm:leading-tight">
            {experience.isAnonymous ? (
              <HugeiconsIcon
                icon={GhostIcon}
                className="h-4 w-4"
              />
            ) : (
              <HugeiconsIcon
                icon={User03Icon}
                className="h-4 w-4"
              />
            )}

            {authorLabel}
          </p>
        )}
        <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground sm:text-sm">
          <span className="flex items-center gap-1 rounded-md border border-border px-2 py-1">
            <HugeiconsIcon
              className="w-4 h-4"
              icon={GraduationCapIcon}
            />
            {experience.degree}
          </span>
          <span className="flex items-center gap-1 rounded-md border border-border px-2 py-1">
            <HugeiconsIcon
              className="w-4 h-4"
              size="100%"
              icon={School01Icon}
            />
            Class of {experience.graduationYear}
          </span>
          <span className="flex items-center gap-1 rounded-md border border-border px-2 py-1">
            <HugeiconsIcon
              className="w-4 h-4"
              size="100%"
              icon={Calendar03Icon}
            />
            {interviewDate}
          </span>
        </div>
      </div>
    </div>
  );
}
