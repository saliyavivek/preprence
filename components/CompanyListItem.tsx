import Link from "next/link";
import { CompanyMark } from "./CompanyMark";

interface CompanyListItemProps {
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

export function CompanyListItem({ company }: CompanyListItemProps) {
  const count = company._count.experiences;

  return (
    <Link
      href={`/companies/${company.slug}`}
      className="group flex min-h-18 items-center justify-between gap-4 px-2 py-3 transition-colors hover:bg-muted/40 focus-visible:bg-muted/40 focus-visible:outline-none sm:px-4"
    >
      <span className="flex min-w-0 items-center gap-3 sm:gap-4">
        <CompanyMark
          company={{ name: company.name, logoUrl: company.logoUrl }}
          compact
        />
        <span className="truncate text-[1.05rem] font-medium leading-6 text-foreground group-hover:text-primary">{company.name}</span>
      </span>

      <span className="flex shrink-0 items-center gap-3 sm:gap-5">
        <span className="text-sm leading-5 text-muted-foreground">
          {count} {count === 1 ? "interview experience" : "interview experiences"}
        </span>
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="size-5 shrink-0 text-primary transition-transform group-hover:translate-x-0.5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </span>
    </Link>
  );
}
