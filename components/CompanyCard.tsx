import Link from "next/link";
import { CompanyMark } from "./CompanyMark";

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
      className="group flex items-center gap-3 rounded-lg border border-border bg-card px-4 py-3.5 transition-colors hover:border-primary/35"
    >
      <CompanyMark company={company} />
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold leading-5 text-foreground">{company.name}</span>
        <span className="block text-xs leading-5 text-muted-foreground">
          {count} {count === 1 ? "experience" : "experiences"}
        </span>
      </span>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="size-4 shrink-0 text-muted-foreground/60 transition-all group-hover:translate-x-0.5 group-hover:text-primary"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m9 18 6-6-6-6" />
      </svg>
    </Link>
  );
}
