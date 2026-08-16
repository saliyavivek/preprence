import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

const statusLabels = {
  draft: "Draft",
  published: "Published",
  taken_down: "Taken down",
} as const;

function formatInterviewDate(date: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

function CompanyMark({ name, logoUrl }: { name: string; logoUrl: string | null }) {
  if (logoUrl) {
    return (
      <img
        src={logoUrl}
        alt=""
        className="size-full object-contain"
      />
    );
  }

  return (
    <span
      aria-hidden="true"
      className="text-xl font-semibold text-primary"
    >
      {name.slice(0, 1).toUpperCase()}
    </span>
  );
}

function ExperienceCard({ experience }: { experience: Awaited<ReturnType<typeof getExperiences>>[number] }) {
  const status = experience.status as keyof typeof statusLabels;
  const isDraft = status === "draft";
  const href = isDraft ? `/experience/${experience.id}/edit` : `/experiences/${experience.id}`;
  const actionLabel = isDraft ? "Continue editing" : "View";

  return (
    <article className="flex flex-col gap-1 rounded-xl border border-border bg-card p-5 shadow-[0_2px_10px_rgba(32,37,34,0.04)] sm:p-6 lg:grid lg:grid-cols-[7.5rem_minmax(0,1fr)_auto] lg:items-center lg:gap-3">
      <div className="flex size-24 items-center justify-center overflow-hidden rounded-lg border border-border bg-background">
        <CompanyMark
          name={experience.company.name}
          logoUrl={experience.company.logoUrl}
        />
      </div>

      <div className="min-w-0 flex flex-col">
        <div className="mb-5 flex flex-wrap items-start justify-between gap-3 lg:hidden">
          <Status status={status} />
        </div>
        <h2 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">{experience.company.name}</h2>
        <p className="mt-1 text-base text-muted-foreground">{experience.roleTitle}</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-border pb-4 text-sm text-muted-foreground">
          <span>{experience.degree}</span>
          <span>Batch of {experience.graduationYear}</span>
          <span>Interviewed on {formatInterviewDate(experience.interviewDate)}</span>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">
          {experience.rounds.length} {experience.rounds.length === 1 ? "round" : "rounds"}
        </p>
      </div>

      <div className="flex flex-col items-start gap-5 lg:items-end">
        <div className="hidden lg:block">
          <Status status={status} />
        </div>
        <Link
          href={href}
          className="inline-flex min-h-10 items-center justify-center rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
        >
          {actionLabel}{" "}
        </Link>
      </div>
    </article>
  );
}

function Status({ status }: { status: keyof typeof statusLabels }) {
  return (
    <span
      className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-medium ${status === "published" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : status === "taken_down" ? "border-red-200 bg-red-50 text-red-700" : "border-amber-200 bg-amber-50 text-amber-700"}`}
    >
      <span
        aria-hidden="true"
        className="size-1.5 rounded-full bg-current"
      />
      {statusLabels[status]}
    </span>
  );
}

async function getExperiences(userId: string) {
  return prisma.experience.findMany({
    where: { authorId: userId },
    include: { company: true, rounds: true },
    orderBy: { updatedAt: "desc" },
  });
}

export default async function MyExperiencesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const experiences = await getExperiences(user.id);

  return (
    <main className="min-h-[calc(100vh-8rem)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-3 text-sm text-muted-foreground"
        >
          <Link
            href="/"
            className="hover:text-foreground"
          >
            Home
          </Link>
          <span aria-hidden="true">›</span>
          <span className="text-primary">Your experiences</span>
        </nav>

        <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-semibold tracking-[-0.045em] text-foreground sm:text-5xl">Your experiences</h1>
            <p className="text-base leading-7 text-muted-foreground sm:text-lg">Manage the interview experiences you&apos;ve shared.</p>
          </div>
          <Link
            href="/experience/new"
            className="inline-flex min-h-12 items-center justify-center rounded-md bg-primary px-5 font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/30"
          >
            <span
              aria-hidden="true"
              className="mr-2 text-xl leading-none"
            >
              +
            </span>{" "}
            Share an experience
          </Link>
        </header>

        {experiences.length === 0 ? (
          <section className="flex flex-col items-center gap-5 rounded-xl border border-border bg-card px-6 py-16 text-center">
            <div
              className="flex size-14 items-center justify-center rounded-full bg-muted text-2xl text-primary"
              aria-hidden="true"
            >
              ↗
            </div>
            <div className="flex max-w-md flex-col gap-2">
              <h2 className="text-xl font-semibold">You haven&apos;t shared any interview experiences yet.</h2>
              <p className="leading-7 text-muted-foreground">Share your first experience and help the next student prepare.</p>
            </div>
            <Link
              href="/experience/new"
              className="rounded-md bg-primary px-5 py-3 font-medium text-primary-foreground hover:bg-primary/90"
            >
              Share your first experience
            </Link>
          </section>
        ) : (
          <section
            aria-label="Your interview experiences"
            className="flex flex-col gap-4"
          >
            {experiences.map((experience) => (
              <ExperienceCard
                key={experience.id}
                experience={experience}
              />
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
