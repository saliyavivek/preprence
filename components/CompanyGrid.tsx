"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { CompanyMarkSmall } from "./CompanyMark";

type Company = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  _count: {
    experiences: number;
  };
};

const INITIAL_COMPANY_COUNT = 6;

function SquareCompanyCard({ company }: { company: Company }) {
  return (
    <Link
      href={`/companies/${company.slug}`}
      className="group relative flex min-h-28 min-w-0 items-center gap-4 border border-border bg-card px-4 py-4 transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.3 hover:border-primary/45 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:px-5 rounded-md"
    >
      <CompanyMarkSmall company={company} />
      <span className="min-w-0 flex-1 pr-5">
        <span className="block line-clamp-2 text-base font-semibold leading-5 text-foreground sm:text-[1.25rem]">{company.name}</span>
        <span className="mt-2 block text-sm font-medium tracking-[0.04em] text-muted-foreground">
          {company._count.experiences > 0 ? `Read ${company._count.experiences} ${company._count.experiences === 1 ? "experience" : "experiences"}` : "No experiences"}
        </span>
      </span>
      <span
        aria-hidden="true"
        className="absolute right-4 top-4 text-primary transition-transform duration-200 group-hover:translate-x-1"
      >
        <HugeiconsIcon
          icon={ArrowRight01Icon}
          size="100%"
          className="h-4 w-4"
        />
      </span>
    </Link>
  );
}

export function CompanyGrid({ companies }: { companies: Company[] }) {
  const [showAllCompanies, setShowAllCompanies] = useState(false);
  const hasMoreCompanies = companies.length > INITIAL_COMPANY_COUNT;
  const companiesToDisplay = showAllCompanies ? companies : companies.slice(0, INITIAL_COMPANY_COUNT);

  return (
    <>
      <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:gap-4">
        {companiesToDisplay.map((company) => (
          <SquareCompanyCard
            key={company.id}
            company={company}
          />
        ))}
      </div>

      <div className="mt-8 flex flex-col items-center gap-6">
        {hasMoreCompanies ? (
          <button
            type="button"
            aria-expanded={showAllCompanies}
            onClick={() => setShowAllCompanies((current) => !current)}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-primary px-6 py-3 text-[0.95rem] font-medium text-primary transition-colors hover:bg-card/70 sm:w-auto"
          >
            {showAllCompanies ? "Show fewer companies" : "View all companies"}
          </button>
        ) : null}
        <p className="text-center text-[0.95rem] text-gray-500">
          Can&apos;t find the company you&apos;re looking for?{" "}
          <Link
            href="/experience/new"
            className="font-semibold text-[#1c7b6d] hover:underline"
          >
            Share an experience
          </Link>{" "}
          to help others.
        </p>
      </div>
    </>
  );
}
