import Link from "next/link";
import { CompanyMark } from "./CompanyMark";
import { VerdictBadge } from "./VerdictBadge";

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

export function ExperienceRow({ experience }: ExperienceRowProps) {
  const rounds = experience.rounds.length;
  return (
    <article className="grid gap-3 border-b border-border px-1 py-4 last:border-b-0 sm:grid-cols-[minmax(220px,1.4fr)_minmax(150px,1fr)_110px_130px_auto] sm:items-center sm:gap-6 sm:px-2">
      <div className="flex min-w-0 items-center gap-3">
        <CompanyMark
          company={experience.company}
          compact={false}
        />
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
      <Link
        href={`/experiences/${experience.id}`}
        className="inline-flex w-fit items-center gap-1.5 rounded-md border border-border px-3.5 py-2 text-sm font-semibold text-foreground transition-colors hover:border-primary/40 hover:text-primary"
      >
        Read <span aria-hidden="true">›</span>
      </Link>
    </article>
  );
}
