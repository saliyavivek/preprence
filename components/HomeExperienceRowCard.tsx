import Link from "next/link";
import { CompanyMarkSmall } from "./CompanyMark";
import { VerdictBadge } from "./VerdictBadge";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";

interface ExperienceRowProps {
  experience: {
    id: string;
    role: {
      name: string;
      id: string;
    } | null;
    degree: string;
    graduationYear: number;
    verdict: "selected" | "rejected" | "not_disclosed" | null | undefined;
    company: {
      name: string;
      logoUrl: string | null;
    };
    rounds: Array<{
      id: string;
    }>;
    experienceSkills?: Array<{ skill: { id: string; name: string } }>;
  };
}

export function HomeExperienceRowCard({ experience }: ExperienceRowProps) {
  const rounds = experience.rounds.length;
  const allSkills = (experience.experienceSkills ?? []).map((es) => es.skill.name);
  const visibleSkills = allSkills.slice(0, 3);
  const hiddenSkillsCount = Math.max(0, allSkills.length - 3);

  return (
    <Link
      href={`/experiences/${experience.id}`}
      className="group relative grid gap-3 border-b border-border px-4 py-4 pr-12 last:border-b-0 transition-colors hover:bg-muted/20 sm:grid-cols-[minmax(220px,1.4fr)_minmax(150px,1fr)_110px_130px_auto] sm:items-center sm:gap-6 sm:px-5 sm:pr-5"
    >
      <div className="flex min-w-0 items-center gap-3">
        <CompanyMarkSmall company={experience.company} />
        <div className="min-w-0">
          <div className="flex min-w-0 items-center justify-between gap-3">
            <p className="truncate text-sm sm:text-md font-semibold leading-5 text-foreground">{experience.company.name}</p>
            <div className="shrink-0 sm:hidden">
              <VerdictBadge verdict={experience.verdict} />
            </div>
          </div>
          <p className="truncate text-sm leading-5 text-muted-foreground">{experience.role?.name}</p>
          <p className="text-[10px] sm:text-xs flex items-center gap-1 sm:mt-1 mt-2 leading-5 text-muted-foreground">
            {visibleSkills.map((skill) => (
              <span
                key={skill}
                className="max-w-full rounded-md border border-border px-1 py-0.2 sm:px-1.5 text-muted-foreground"
              >
                {skill}
              </span>
            ))}
            {hiddenSkillsCount > 0 && <span className="max-w-full rounded-md border border-border px-1 py-0.2 sm:px-1.5  text-muted-foreground">+{hiddenSkillsCount}</span>}
          </p>
        </div>
      </div>
      <p className="hidden text-sm text-muted-foreground sm:block">
        {experience.degree} <span aria-hidden="true">·</span> Class of {experience.graduationYear}
      </p>
      <p className="hidden text-sm text-muted-foreground sm:block">
        {rounds} {rounds === 1 ? "round" : "rounds"}
      </p>
      <div className="hidden sm:block">
        <VerdictBadge verdict={experience.verdict} />
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
