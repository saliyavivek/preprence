import Link from "next/link";
import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

export function Breadcrumbs({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted-foreground"
    >
      {items.map((item, index) => {
        const isCurrent = index === items.length - 1;

        return (
          <span
            key={`${item.label}-${index}`}
            className="flex items-center gap-2"
          >
            {index > 0 && (
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                aria-hidden="true"
                className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60"
              />
            )}
            {isCurrent || !item.href ? (
              <span
                aria-current={isCurrent ? "page" : undefined}
                className={isCurrent ? "font-medium text-primary" : undefined}
              >
                {item.label}
              </span>
            ) : (
              <Link
                href={item.href}
                className="transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            )}
          </span>
        );
      })}
    </nav>
  );
}
