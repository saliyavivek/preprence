interface CompanyMarkProps {
  company: {
    name: string;
    logoUrl: string | null;
  };
  compact?: boolean;
}

export function CompanyMark({ company, compact = false }: CompanyMarkProps) {
  const initials = company.name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <span
      className={`relative grid shrink-0 place-items-center overflow-hidden rounded-md border border-border bg-card font-semibold tracking-tight text-muted-foreground ${
        compact ? "size-9 text-[11px]" : "size-10 text-xs"
      }`}
    >
      {company.logoUrl ? (
        <span className="flex size-full items-center justify-center scale-170 p-1.5">
          <img
            src={company.logoUrl}
            alt={`${company.name} logo`}
            className="max-h-full max-w-full object-contain"
          />
        </span>
      ) : (
        <span aria-hidden="true">{initials}</span>
      )}
    </span>
  );
}
