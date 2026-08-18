import Link from "next/link";
import { CompanyMarkSmall } from "./CompanyMark";
import { VerdictBadge } from "./VerdictBadge";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";

interface ExperienceRowProps {
  experience: {
    id: string;
    roleTitle: string;
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
  };
}

export function HomeExperienceRowCard({ experience }: ExperienceRowProps) {
  const rounds = experience.rounds.length;
  return (
    <Link
      href={`/experiences/${experience.id}`}
      className="group grid gap-3 border-b border-border px-4 py-4 last:border-b-0 sm:grid-cols-[minmax(220px,1.4fr)_minmax(150px,1fr)_110px_130px_auto] sm:items-center sm:gap-6 sm:px-5 transition-colors hover:bg-muted/20"
    >
      <div className="flex min-w-0 items-center gap-3">
        <CompanyMarkSmall company={experience.company} />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold leading-5 text-foreground">{experience.company.name}</p>
          <p className="truncate text-sm leading-5 text-muted-foreground">{experience.roleTitle}</p>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        {experience.degree} <span aria-hidden="true">·</span> Class of {experience.graduationYear}
      </p>
      <p className="text-sm text-muted-foreground">
        {rounds} {rounds === 1 ? "round" : "rounds"}
      </p>
      <VerdictBadge verdict={experience.verdict} />

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
