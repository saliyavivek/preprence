import Link from "next/link";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";

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

async function getDashboardData(userId: string) {
  const [profile, experiences] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true },
    }),
    prisma.experience.findMany({
      where: { authorId: userId },
      include: { company: true, rounds: true },
      orderBy: { updatedAt: "desc" },
      take: 5,
    }),
  ]);

  const total = experiences.length;
  const published = experiences.filter((experience) => experience.status === "published").length;
  const draft = experiences.filter((experience) => experience.status === "draft").length;

  return {
    profile,
    experiences,
    stats: {
      total,
      published,
      draft,
    },
  };
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { profile, experiences, stats } = await getDashboardData(user.id);
  const displayName = profile?.name?.trim() || profile?.email?.split("@")[0] || "there";
  const time = new Date().getHours();
  const greeting = time < 12 ? "morning" : time < 17 ? "afternoon" : "evening";

  return (
    <div className="mx-auto max-w-[1100px] px-5 py-10">
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-2 text-[0.85rem] text-muted-foreground"
      >
        <Link
          href="/"
          className="transition-colors hover:text-foreground"
        >
          Home
        </Link>
        <span aria-hidden="true">›</span>
        <span className="text-foreground">Dashboard</span>
      </nav>

      <header className="mt-8">
        <h1 className="text-[2rem] font-semibold tracking-[-0.02em] text-foreground sm:text-4xl">
          Good {greeting}, {displayName}.
        </h1>
        <p className="mt-2 text-[1.05rem] text-muted-foreground">Welcome to your Preprence workspace.</p>
      </header>

      <section className="mt-10 flex flex-col gap-6 rounded-2xl border border-[#d6f0ea] bg-card/40 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="flex-1">
          <h2 className="text-[1.3rem] font-semibold tracking-tight text-foreground">Share your interview experience</h2>
          <p className="mt-1.5 max-w-[420px] text-[0.95rem] leading-relaxed text-muted-foreground">Help the next student know what to expect by sharing your interview journey.</p>
        </div>
        <Link
          href="/experience/new"
          className="inline-flex items-center justify-center rounded-lg bg-[#0a6f63] px-6 py-3.5 text-[0.95rem] font-medium text-white transition-opacity hover:opacity-90"
        >
          Share experience
        </Link>
      </section>

      <section className="mt-12">
        <h2 className="text-[1.15rem] font-semibold tracking-tight text-foreground">Your activity</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-center gap-5 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <span className="flex h-[3.25rem] w-[3.25rem] shrink-0 items-center justify-center rounded-full bg-[#eaf7f5] text-[#097063] text-xl">✦</span>
            <div>
              <p className="text-2xl font-semibold leading-none tracking-tight text-foreground">{stats.total}</p>
              <p className="mt-1.5 text-[0.95rem] font-medium text-foreground">Experiences shared</p>
            </div>
          </div>

          <div className="flex items-center gap-5 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <span className="flex h-[3.25rem] w-[3.25rem] shrink-0 items-center justify-center rounded-full bg-[#eefbf4] text-[#1c7b39] text-xl">✓</span>
            <div>
              <p className="text-2xl font-semibold leading-none tracking-tight text-foreground">{stats.published}</p>
              <p className="mt-1.5 text-[0.95rem] font-medium text-foreground">Published</p>
            </div>
          </div>

          <div className="flex items-center gap-5 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <span className="flex h-[3.25rem] w-[3.25rem] shrink-0 items-center justify-center rounded-full bg-[#fdf3e1] text-[#a46600] text-xl">✎</span>
            <div>
              <p className="text-2xl font-semibold leading-none tracking-tight text-foreground">{stats.draft}</p>
              <p className="mt-1.5 text-[0.95rem] font-medium text-foreground">Draft</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-12 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4 px-6 py-5">
          <h2 className="text-[1.15rem] font-semibold tracking-tight text-foreground">Your recent experiences</h2>
          <Link
            href="/dashboard/experiences"
            className="text-[0.9rem] font-medium text-[#0a6f63] transition-colors hover:text-[#0a6f63]/80"
          >
            View all experiences
          </Link>
        </div>

        {experiences.length === 0 ? (
          <div className="px-6 py-10 text-center text-muted-foreground">You haven&apos;t shared any interview experiences yet.</div>
        ) : (
          <div className="divide-y divide-border border-t border-border">
            {experiences.map((experience) => {
              const status = experience.status as keyof typeof statusLabels;
              const href = experience.status === "draft" ? `/experience/${experience.id}/edit` : `/experiences/${experience.id}`;
              const actionLabel = experience.status === "draft" ? "Continue editing" : "View";

              return (
                <div
                  key={experience.id}
                  className="flex flex-col gap-4 px-6 py-5 sm:flex-row sm:items-center"
                >
                  <div className="flex size-20 items-center justify-center overflow-hidden rounded-lg border border-border bg-background">
                    <CompanyMark
                      name={experience.company.name}
                      logoUrl={experience.company.logoUrl}
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="text-[1.05rem] font-semibold tracking-tight text-foreground">{experience.company.name}</h3>
                    <p className="mt-0.5 text-[0.95rem] text-muted-foreground">{experience.roleTitle}</p>
                    <div className="mt-2.5 flex flex-wrap items-center gap-x-5 gap-y-2 text-[0.85rem] text-muted-foreground/80">
                      <span>{experience.degree}</span>
                      <span>Batch of {experience.graduationYear}</span>
                      <span>
                        {experience.rounds.length} {experience.rounds.length === 1 ? "round" : "rounds"}
                      </span>
                      <span>Interviewed on {formatInterviewDate(experience.interviewDate)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 sm:shrink-0">
                    <Status status={status} />
                    <Link
                      href={href}
                      className="inline-flex min-h-10 items-center justify-center rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
                    >
                      {actionLabel}
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
