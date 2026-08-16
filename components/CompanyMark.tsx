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
      className={`relative grid shrink-0 place-items-center overflow-hidden rounded-xl border border-border bg-card font-semibold tracking-tight text-muted-foreground ${
        compact ? "size-11 text-[11px]" : "size-14 text-base"
      }`}
    >
      {company.logoUrl ? (
        <span className="flex size-full items-center justify-center scale-150 p-2">
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
