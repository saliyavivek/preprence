import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { VerdictBadge } from "@/components/VerdictBadge";

type Props = { params: Promise<{ slug: string }> };

const roundLabels: Record<string, string> = {
  aptitude: "Aptitude",
  online_assessment: "Online Assessment",
  coding: "Coding",
  technical: "Technical",
  managerial: "Managerial",
  hr: "HR",
  other: "Other",
};

const verdictLabels: Record<string, string> = {
  selected: "Selected",
  rejected: "Rejected",
  not_disclosed: "Not disclosed",
};

function CompanyMark({ name, logoUrl }: { name: string; logoUrl: string | null }) {
  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt={`${name} logo`}
        className="size-full object-contain"
      />
    );
  }
  return <span className="text-5xl font-semibold text-primary">{name.slice(0, 1).toUpperCase()}</span>;
}

function ExperienceRow({ experience }: { experience: Awaited<ReturnType<typeof getCompany>>["experiences"][number] }) {
  const roundTypes = Array.from(new Set(experience.rounds.map((round) => roundLabels[round.roundType] ?? round.roundType)));
  return (
    <Link
      href={`/experiences/${experience.id}`}
      className="group grid gap-5 border-b border-border px-5 py-6 transition-colors first:border-t hover:bg-muted/30 sm:grid-cols-[minmax(0,1fr)_auto] sm:px-7"
    >
      <div className="flex min-w-0 flex-col gap-4">
        <div className="flex items-start gap-4">
          <div className="flex size-11 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold text-primary">{experience.roleTitle.slice(0, 2).toUpperCase()}</div>
          <div className="min-w-0">
            <h3 className="text-lg font-semibold tracking-tight">{experience.roleTitle}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {experience.degree} <span aria-hidden="true">·</span> Class of {experience.graduationYear}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-2 text-sm text-muted-foreground">
          <span className="rounded border border-border px-2 py-1 text-xs">
            {experience.rounds.length} {experience.rounds.length === 1 ? "round" : "rounds"}
          </span>
          <div className="flex flex-wrap gap-2">
            {roundTypes.slice(0, 3).map((type) => (
              <span
                key={type}
                className="rounded border border-border px-2 py-1 text-xs"
              >
                {type}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end sm:justify-between">
        <div>{experience.verdict && <VerdictBadge verdict={experience.verdict} />}</div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">{experience.interviewDate.toLocaleDateString(undefined, { month: "short", year: "numeric" })}</span>
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="size-5 shrink-0 text-muted-foreground/70 transition-all group-hover:translate-x-0.5 group-hover:text-primary"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </div>
      </div>
    </Link>
  );
}

async function getCompany(slug: string) {
  return prisma.company.findUnique({
    where: { slug },
    include: { experiences: { where: { status: "published" }, include: { rounds: { orderBy: { roundNumber: "asc" } } }, orderBy: { interviewDate: "desc" } } },
  });
}

export default async function CompanyPage({ params }: Props) {
  const { slug } = await params;
  const company = await getCompany(slug);
  if (!company) notFound();
  const count = company.experiences.length;

  return (
    <main className="min-h-screen">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-3 text-sm text-muted-foreground"
        >
          <Link
            href="/companies"
            className="hover:text-foreground"
          >
            Companies
          </Link>
          <span aria-hidden="true">›</span>
          <span className="text-foreground">{company.name}</span>
        </nav>

        <section className="rounded-lg border border-border bg-card">
          <div className="flex flex-col gap-7 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div className="flex items-center gap-6">
              <div className="flex size-32 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-background">
                <CompanyMark
                  name={company.name}
                  logoUrl={company.logoUrl}
                />
              </div>
              <div className="flex flex-col gap-3">
                <h1 className="text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">{company.name}</h1>
                {company.websiteUrl && (
                  <a
                    href={company.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-fit text-sm font-medium text-primary underline-offset-4 hover:underline"
                  >
                    {company.websiteUrl.split("//")[1]}
                  </a>
                )}
                <p className="text-sm text-muted-foreground">{count === 0 ? "No interview experiences yet" : `${count} ${count === 1 ? "experience" : "experiences"}`} shared</p>
              </div>
            </div>
            <Link
              href="/experience/new"
              className="inline-flex min-h-11 items-center justify-center rounded-md border border-primary px-5 font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              Share your experience
            </Link>
          </div>
        </section>

        {count > 0 && (
          <section
            className="flex flex-col gap-4"
            aria-labelledby="experiences-heading"
          >
            <h2
              id="experiences-heading"
              className="text-2xl font-semibold tracking-tight"
            >
              Interview Experiences
            </h2>
            <div className="overflow-hidden rounded-lg border border-border bg-card">
              {company.experiences.map((experience) => (
                <ExperienceRow
                  key={experience.id}
                  experience={experience}
                />
              ))}
            </div>
          </section>
        )}

        {count === 0 && (
          <section className="flex flex-col gap-3 rounded-lg border border-dashed border-border bg-card p-8 text-center">
            <h2 className="text-xl font-semibold">No interview experiences yet.</h2>
            <p className="text-muted-foreground">Be the first student to share what your interview was like.</p>
            <Link
              href="/experience/new"
              className="mx-auto mt-2 inline-flex min-h-11 items-center rounded-md bg-primary px-5 font-medium text-primary-foreground"
            >
              Share your experience{" "}
              <span
                className="ml-2"
                aria-hidden="true"
              >
                →
              </span>
            </Link>
          </section>
        )}

        {count !== 0 && (
          <section className="flex flex-col gap-3 rounded-lg border border-primary/15 bg-primary/5 p-7 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-xl font-semibold">Have you interviewed at {company.name}?</h2>
              <p className="mt-2 text-muted-foreground">Share your experience to help other students prepare.</p>
            </div>
            <Link
              href="/experience/new"
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-5 font-medium text-primary-foreground"
            >
              Share your experience{" "}
            </Link>
          </section>
        )}
      </div>
    </main>
  );
}
