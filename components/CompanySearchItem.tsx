import Link from "next/link";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { CompanyMarkSmall } from "./CompanyMark";

type SearchCompany = {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
  _count?: { experiences: number };
};

type CompanySearchItemProps = {
  company: SearchCompany;
  href?: string;
  onSelect?: () => void;
};

const itemClassName =
  "flex w-full items-center gap-3 border-b border-border/70 px-3 py-2.5 text-left transition-colors last:border-b-0 hover:bg-muted/60 focus-visible:bg-muted/60 focus-visible:outline-none sm:px-4";

function CompanySearchItemContent({ company, showArrow }: { company: SearchCompany; showArrow: boolean }) {
  const count = company._count?.experiences ?? 0;

  return (
    <>
      <span className="flex size-11 shrink-0 items-center justify-center overflow-hidden">
        <span className="scale-75">
          <CompanyMarkSmall company={company} />
        </span>
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-foreground">{company.name}</span>
        <span className="mt-0.5 block text-xs text-muted-foreground">
          {count} interview {count === 1 ? "experience" : "experiences"}
        </span>
      </span>
      {showArrow ? (
        <span
          aria-hidden="true"
          className="shrink-0 text-muted-foreground"
        >
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            size="100%"
            className="h-4 w-4"
          />
        </span>
      ) : null}
    </>
  );
}

export function CompanySearchItem({ company, href, onSelect }: CompanySearchItemProps) {
  if (href) {
    return (
      <Link
        href={href}
        className={itemClassName}
      >
        <CompanySearchItemContent
          company={company}
          showArrow
        />
      </Link>
    );
  }

  return (
    <button
      type="button"
      onClick={onSelect}
      className={itemClassName}
    >
      <CompanySearchItemContent
        company={company}
        showArrow={false}
      />
    </button>
  );
}
