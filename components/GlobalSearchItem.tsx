// components/GlobalSearchItem.tsx
import Link from "next/link";
import { ArrowRight01Icon, Briefcase01Icon, CodeIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { CompanyMarkSmall } from "./CompanyMark";

export type SearchEntity = {
  id: string;
  name: string;
  slug: string;
  logoUrl?: string | null;
  _count?: { experiences: number };
  type: "company" | "role" | "skill";
};

type GlobalSearchItemProps = {
  entity: SearchEntity;
  href: string;
};

export function GlobalSearchItem({ entity, href }: GlobalSearchItemProps) {
  const count = entity._count?.experiences ?? 0;

  return (
    <Link
      href={href}
      className="group flex w-full items-center gap-3 border-b border-border/70 px-3 py-2.5 text-left transition-colors last:border-b-0 hover:bg-muted/60 focus-visible:bg-muted/60 focus-visible:outline-none sm:px-4"
    >
      <span className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted/50 text-muted-foreground">
        {entity.type === "company" ? (
          <span className="scale-75">
            <CompanyMarkSmall company={entity as any} />
          </span>
        ) : entity.type === "role" ? (
          <HugeiconsIcon
            icon={Briefcase01Icon}
            size={24}
          />
        ) : (
          <HugeiconsIcon
            icon={CodeIcon}
            size={24}
          />
        )}
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-sm font-semibold text-foreground">{entity.name}</span>
        <span className="mt-0.5 block text-xs text-muted-foreground">
          {count} interview {count === 1 ? "experience" : "experiences"}
        </span>
      </span>
      <span
        aria-hidden="true"
        className="shrink-0 text-muted-foreground"
      >
        <HugeiconsIcon
          icon={ArrowRight01Icon}
          size="100%"
          className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1"
        />
      </span>
    </Link>
  );
}
