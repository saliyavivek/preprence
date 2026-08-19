import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight02Icon, Building01Icon, Edit02Icon, People } from "@hugeicons/core-free-icons";
import type { Experience } from "@/lib/types";

type Company = {
  name: string;
  slug: string;
  logoUrl: string | null;
};

export function PopularCompanyItem({ company }: { company: Company }) {
  return (
    <Link
      key={company.slug}
      href={`/companies/${company.slug}`}
      className="text-sm hover:text-primary flex gap-4 items-center"
    >
      <img
        src={company.logoUrl!}
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
          className="group mt-5 text-sm font-medium text-primary flex items-center gap-2"
        >
          <span>View all companies</span>
          <HugeiconsIcon
            icon={ArrowRight02Icon}
            className="transition-transform duration-200 group-hover:translate-x-1"
          />
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
