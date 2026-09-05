import Link from "next/link";
import { CompanyMarkSmall } from "./CompanyMark";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";

interface CompanyCardProps {
  company: {
    id: string;
    name: string;
    slug: string;
    logoUrl: string | null;
    _count: {
      experiences: number;
    };
  };
}

export function CompanyCard({ company }: CompanyCardProps) {
  const count = company._count.experiences;
  return (
    <Link
      href={`/companies/${company.slug}`}
      className="group flex min-w-0 items-center gap-4 rounded-xl border border-border bg-white/60 px-5 py-4 transition-colors hover:border-primary/35"
    >
      <CompanyMarkSmall company={company} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[1.1rem] font-semibold leading-6 text-foreground">{company.name}</span>
        <span className="mt-1 block text-sm leading-5 text-muted-foreground">
          {count} interview {count === 1 ? "experience" : "experiences"}
        </span>
      </span>
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
