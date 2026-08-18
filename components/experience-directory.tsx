import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon, Building01Icon, Calendar03Icon, Edit02Icon, People } from "@hugeicons/core-free-icons";

type Experience = {
  id: string;
  roleTitle: string;
  degree: string;
  graduationYear: number;
  interviewDate: Date;
  verdict: string | null;
  company: { name: string; slug: string; logoUrl: string | null };
  rounds: Array<{ roundType: string }>;
};

const roundLabels: Record<string, string> = {
  aptitude: "Aptitude Test",
  online_assessment: "Online Assessment",
  coding: "Coding Interview",
  technical: "Technical Interview",
  managerial: "Managerial Interview",
  hr: "HR Interview",
  other: "Other Round",
};

function CompanyMark({ company }: { company: Experience["company"] }) {
  return company.logoUrl ? (
    <img
      src={company.logoUrl}
      alt=""
      className="size-20 rounded-lg object-contain"
    />
  ) : (
    <span className="flex size-20 items-center justify-center rounded-lg bg-foreground text-xl font-bold text-background">{company.name.slice(0, 1)}</span>
  );
}

function Verdict({ verdict }: { verdict: string | null }) {
  const styles: Record<string, string> = {
    selected: "bg-emerald-50 text-emerald-700",
    rejected: "bg-red-50 text-red-700",
    not_disclosed: "bg-muted text-muted-foreground",
  };
  return (
    <span className={`rounded-md px-3 py-2 text-xs font-medium ${styles[verdict ?? ""] ?? "bg-amber-50 text-amber-700"}`}>
      {verdict === "selected" ? "Selected" : verdict === "rejected" ? "Rejected" : "Waitlisted"}
    </span>
  );
}

export function ExperienceResult({ experience }: { experience: Experience }) {
  const labels = Array.from(new Set(experience.rounds.map((round) => roundLabels[round.roundType] ?? "Interview Round"))).slice(0, 3);
  return (
    <Link
      href={`/experiences/${experience.id}`}
      className="group flex gap-5 border-b border-border p-5 transition-colors hover:bg-muted/20 sm:p-6"
    >
      <CompanyMark company={experience.company} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold tracking-tight group-hover:text-primary">{experience.roleTitle}</h2>
            <p className="mt-1 text-md font-medium text-foreground">{experience.company.name}</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {experience.degree} · Class of {experience.graduationYear}
            </p>
          </div>
          <Verdict verdict={experience.verdict} />
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
          <span>
            {/* <HugeiconsIcon icon={} /> */}
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
        className="self-center text-xl text-primary"
      >
        ›
      </span>
    </Link>
  );
}

export function PopularCompanyItem({ company }: { company: any }) {
  return (
    <Link
      key={company.slug}
      href={`/companies/${company.slug}`}
      className="text-sm hover:text-primary flex gap-4 items-center"
    >
      <img
        src={company.logoUrl}
        className="w-12 rounded-lg border"
      />
      <div>
        <span className="font-semibold">{company.name}</span>
        <span className="block text-sm text-muted-foreground">Interview experiences</span>
      </div>
    </Link>
  );
}

export function DirectorySidebar({ experiences }: { experiences: Experience[] }) {
  const companies = Array.from(new Map(experiences.map((item) => [item.company.slug, item.company])).values()).slice(0, 5);
  const roles = Array.from(new Set(experiences.map((item) => item.roleTitle))).slice(0, 5);
  return (
    <aside className="hidden flex-col gap-5 lg:flex">
      <div className="rounded-lg border border-border bg-card p-5">
        <h2 className="font-semibold">At a glance</h2>
        <div className="mt-5 flex flex-col gap-5 text-sm">
          <Stat
            value={experiences.length}
            label="Total experiences"
            iconName="people"
          />
          <Stat
            value={companies.length}
            label="Companies"
            iconName="building"
          />
        </div>
      </div>
      <div className="rounded-lg border border-border bg-card p-5">
        <h2 className="font-semibold">Popular companies</h2>
        <div className="mt-4 flex flex-col gap-4">
          {companies.map((company) => (
            <PopularCompanyItem
              key={company.slug}
              company={company}
            />
          ))}
        </div>
        <Link
          href="/companies"
          className="mt-5 text-sm font-medium text-primary flex items-center gap-2"
        >
          <span>View all companies</span>
          <HugeiconsIcon icon={ArrowRight02Icon} />
        </Link>
      </div>
    </aside>
  );
}

function Stat({ value, label, iconName }: { value: string | number; label: string; iconName: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex size-11 items-center justify-center rounded-full bg-muted text-foreground">
        {iconName === "people" ? <HugeiconsIcon icon={People} /> : <HugeiconsIcon icon={Building01Icon} />}
      </div>
      <div>
        <p className="text-lg font-semibold">{value}</p>
        <p className="text-sm text-muted-foreground">{label}</p>
      </div>
    </div>
  );
}

export function DirectoryFilters() {
  return (
    <div className="flex flex-wrap gap-3 rounded-lg border border-border bg-card p-4">
      {["All Companies", "All Roles", "All Degrees", "All Years", "Sort: Newest"].map((filter) => (
        <button
          key={filter}
          type="button"
          className="flex min-w-36 items-center justify-between rounded-md border border-input px-3 py-2 text-sm text-foreground"
        >
          {filter}
          <span aria-hidden="true">⌄</span>
        </button>
      ))}
      <button
        type="button"
        className="rounded-md border border-input px-4 py-2 text-sm font-medium text-primary"
      >
        Filters
      </button>
    </div>
  );
}

export function ShareCta() {
  return (
    <section className="flex flex-col items-start gap-4 rounded-lg border border-primary/20 bg-primary/5 p-6 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-xl font-semibold">Have you interviewed somewhere?</h2>
        <p className="mt-1 text-sm text-muted-foreground">Share your experience and help future students prepare better.</p>
      </div>
      <Link
        href="/experience/new"
        className="rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground flex gap-2 items-center"
      >
        <HugeiconsIcon
          icon={Edit02Icon}
          size="100%"
          className="w-4 h-4"
        />
        Share your experience
      </Link>
    </section>
  );
}
