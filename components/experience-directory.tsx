"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon, ArrowRight02Icon, Building01Icon, Edit02Icon, People } from "@hugeicons/core-free-icons";
import type { Experience } from "@/lib/types";
import { NormalExperienceRowCard } from "@/components/NormalExperienceRowCard";

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
      <div className="rounded-lg border border-border bg-white/60 p-5">
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
      <div className="rounded-lg border border-border bg-white/60 p-5">
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

type FilterState = {
  company: string;
  degree: string;
  year: string;
  sort: "newest" | "oldest";
};

const defaultFilters: FilterState = {
  company: "",
  degree: "",
  year: "",
  sort: "newest",
};

function FilterSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (value: string) => void; options: Array<{ value: string; label: string }> }) {
  const [isOpen, setIsOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.value === value);
  const displayLabel = selectedOption?.label || label;

  useEffect(() => {
    function handleOutsidePointer(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setIsOpen(false);
    }

    document.addEventListener("pointerdown", handleOutsidePointer);
    return () => document.removeEventListener("pointerdown", handleOutsidePointer);
  }, []);

  function selectOption(optionValue: string) {
    onChange(optionValue);
    setIsOpen(false);
  }

  return (
    <div
      ref={rootRef}
      className="relative min-w-0"
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="min-h-12 w-full rounded-xl border border-input bg-background px-4 text-left text-sm text-foreground outline-none transition-colors hover:border-primary/45 focus:border-primary focus:ring-4 focus:ring-primary/10 flex items-center justify-between gap-2"
      >
        <span className="truncate">{displayLabel}</span>
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          size="100%"
          className={`h-5 w-5 flex-shrink-0 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-30 max-h-64 overflow-y-auto rounded-xl border border-border bg-card shadow-xl">
          {options.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => selectOption(option.value)}
              className="flex w-full items-center gap-3 border-b border-border/70 px-4 py-2.5 text-left transition-colors last:border-b-0 hover:bg-muted/60 focus-visible:bg-muted/60 focus-visible:outline-none"
            >
              <span className="block truncate text-sm font-medium text-foreground">{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function DirectoryFilters({
  filters,
  setFilter,
  options,
  onReset,
  hasActiveFilters,
}: {
  filters: FilterState;
  setFilter: (key: keyof FilterState, value: string) => void;
  options: Pick<DirectoryFilterOptions, "companies" | "degrees" | "years">;
  onReset: () => void;
  hasActiveFilters: boolean;
}) {
  return (
    <div className="rounded-lg border border-border bg-white/60 p-3 transition-colors hover:border-primary/25 sm:p-4">
      <div className="grid grid-cols-2 gap-2 sm:flex sm:flex-wrap sm:gap-3">
        <FilterSelect
          label="All Companies"
          value={filters.company}
          onChange={(value) => setFilter("company", value)}
          options={options.companies}
        />
        <FilterSelect
          label="All Degrees"
          value={filters.degree}
          onChange={(value) => setFilter("degree", value)}
          options={options.degrees}
        />
        <FilterSelect
          label="All Years"
          value={filters.year}
          onChange={(value) => setFilter("year", value)}
          options={options.years}
        />
        <FilterSelect
          label="Sort: Newest"
          value={filters.sort}
          onChange={(value) => setFilter("sort", value)}
          options={[
            { value: "newest", label: "Newest first" },
            { value: "oldest", label: "Oldest first" },
          ]}
        />
        <button
          type="button"
          onClick={onReset}
          disabled={!hasActiveFilters}
          className="col-span-2 min-h-12 w-full justify-self-end rounded-xl border border-input px-4 py-2 text-sm font-medium text-primary transition-colors hover:border-primary/45 hover:bg-muted/40 disabled:cursor-not-allowed disabled:opacity-45 sm:col-span-1 sm:ml-auto sm:w-auto"
        >
          Clear filters
        </button>
      </div>
    </div>
  );
}

type DirectoryFilterOptions = {
  companies: Array<{ value: string; label: string }>;
  degrees: Array<{ value: string; label: string }>;
  years: Array<{ value: string; label: string }>;
};

export function ExperienceDirectory({ experiences }: { experiences: Experience[] }) {
  const [filters, setFilters] = useState(defaultFilters);
  const companies = Array.from(new Map(experiences.map((item) => [item.company.slug, item.company])).values())
    .sort((a, b) => a.name.localeCompare(b.name))
    .map((company) => ({ value: company.slug, label: company.name }));
  const degrees = Array.from(new Set(experiences.map((item) => item.author?.degree)))
    .filter(Boolean)
    .sort((a, b) => (a as string).localeCompare(b as string))
    .map((degree) => ({ value: degree as string, label: degree as string }));
  const years = Array.from(new Set(experiences.map((item) => new Date(item.interviewDate).getFullYear())))
    .sort((a, b) => b - a)
    .map((year) => ({ value: String(year), label: String(year) }));
  const options: DirectoryFilterOptions = { companies, degrees, years };
  const hasActiveFilters = Boolean(filters.company || filters.degree || filters.year || filters.sort !== "newest");
  const filteredExperiences = experiences
    .filter((experience) => {
      return (
        (!filters.company || experience.company.slug === filters.company) &&
        (!filters.degree || experience.author?.degree === filters.degree) &&
        (!filters.year || new Date(experience.interviewDate).getFullYear() === Number(filters.year))
      );
    })
    .sort((a, b) => {
      const difference = new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime();
      return filters.sort === "newest" ? difference : -difference;
    });

  function setFilter(key: keyof FilterState, value: string) {
    setFilters((current) => ({ ...current, [key]: value }));
  }

  return (
    <>
      <DirectoryFilters
        filters={filters}
        setFilter={setFilter}
        options={options}
        onReset={() => setFilters(defaultFilters)}
        hasActiveFilters={hasActiveFilters}
      />
      <div className="mt-6 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_17rem]">
        <div className="flex min-w-0 flex-col gap-6">
          <section
            className="h-fit min-w-0 overflow-hidden rounded-lg border border-border bg-white/60"
            aria-label="Interview experiences"
          >
            <div className="border-b border-border px-5 py-4 text-sm text-muted-foreground">
              {filteredExperiences.length} {filteredExperiences.length === 1 ? "experience" : "experiences"} found
            </div>
            {filteredExperiences.length ? (
              filteredExperiences.map((experience) => (
                <NormalExperienceRowCard
                  key={experience.id}
                  experience={experience}
                  showCompanyMark={true}
                />
              ))
            ) : (
              <div className="p-10 text-center text-sm text-muted-foreground">No experiences match these filters.</div>
            )}
          </section>
          <ShareCta />
        </div>
        <DirectorySidebar experiences={experiences} />
      </div>
    </>
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
        className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground sm:w-auto"
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
