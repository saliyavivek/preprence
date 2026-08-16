"use client";

export function ExperienceCompanyLogo({ name, logoUrl }: { name: string; logoUrl: string | null }) {
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();

  return (
    <div className="flex h-[134px] w-[134px] shrink-0 items-center justify-center overflow-hidden rounded-xl border-[3px] bg-card">
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={`${name} logo`}
          className="h-full w-full object-contain p-3"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#ffffff] via-[#f7f7f7] to-[#ececec] text-[3.2rem] font-black tracking-[-0.12em] text-foreground">
          <span className="translate-y-0.5">{initials}</span>
        </div>
      )}
    </div>
  );
}

export default function ExperienceHeader({ experience }: { experience: any }) {
  const interviewDate = experience.interviewDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-6">
      <ExperienceCompanyLogo
        name={experience.company.name}
        logoUrl={experience.company.logoUrl}
      />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-[-0.045em] text-foreground sm:text-3xl lg:text-[2rem]">{experience.company.name}</h1>
        <p className="text-lg text-muted-foreground sm:text-[1.35rem] sm:leading-tight">{experience.roleTitle}</p>
        <div className="mt-1 flex flex-wrap gap-2 text-sm text-muted-foreground">
          <span className="rounded-md border border-border px-2 py-1">{experience.degree}</span>
          <span className="rounded-md border border-border px-2 py-1">Batch of {experience.graduationYear}</span>
          <span className="rounded-md border border-border px-2 py-1">Interviewed in {interviewDate}</span>
        </div>
      </div>
    </div>
  );
}
