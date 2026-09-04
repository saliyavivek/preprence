type CompanyLike = {
  name: string;
  logoUrl: string | null;
};

function getInitials(name: string, length: number) {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, length)
    .toUpperCase();
}

function CompanyMarkBase({
  company,
  className,
  fallbackClassName,
  initialsLength,
  imageClassName,
}: {
  company: CompanyLike;
  className: string;
  fallbackClassName: string;
  initialsLength: number;
  imageClassName: string;
}) {
  const initials = getInitials(company.name, initialsLength);

  return (
    <span className={className}>
      {company.logoUrl ? (
        <span className="flex size-full items-center justify-center">
          <img
            src={company.logoUrl}
            alt={`${company.name} logo`}
            className={imageClassName}
          />
        </span>
      ) : (
        <span
          aria-hidden="true"
          className={fallbackClassName}
        >
          {initials}
        </span>
      )}
    </span>
  );
}

export function CompanyMarkSmall({ company }: { company: CompanyLike }) {
  return (
    <CompanyMarkBase
      company={company}
      className="relative grid size-14 shrink-0 place-items-center overflow-hidden rounded-xl border border-border bg-white/60 font-semibold tracking-tight text-muted-foreground text-base"
      fallbackClassName="flex size-full items-center justify-center"
      initialsLength={2}
      imageClassName="max-h-full max-w-full scale-150 object-contain p-2"
    />
  );
}

export function CompanyMarkMedium({ company }: { company: CompanyLike }) {
  return (
    <CompanyMarkBase
      company={company}
      className="relative grid size-20 shrink-0 place-items-center overflow-hidden rounded-lg bg-foreground"
      fallbackClassName="flex size-full items-center justify-center text-xl font-bold text-background"
      initialsLength={1}
      imageClassName="size-full rounded-lg object-contain"
    />
  );
}

export function CompanyMarkLarge({ company }: { company: CompanyLike }) {
  return (
    <CompanyMarkBase
      company={company}
      className="flex h-[134px] w-[134px] shrink-0 items-center justify-center overflow-hidden rounded-xl border-[3px] bg-white/60"
      fallbackClassName="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#ffffff] via-[#f7f7f7] to-[#ececec] text-[3.2rem] font-black tracking-[-0.12em] text-foreground"
      initialsLength={3}
      imageClassName="h-full w-full object-contain p-3"
    />
  );
}

// export function CompanyMark({ company }: { company: CompanyLike }) {
//   return <CompanyMarkSmall company={company} />;
// }
