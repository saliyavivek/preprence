import Link from "next/link";
import { redirect } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { createClient } from "@/lib/supabase/server";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon, Edit02Icon, FileIcon, Tick03Icon } from "@hugeicons/core-free-icons";

import { DashboardExperienceRowCard } from "@/components/DashboardExperienceRowCard";
import { Breadcrumbs } from "@/components/Breadcrumbs";

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
    redirect(`/login?next=${encodeURIComponent("/dashboard")}`);
  }

  const { profile, experiences, stats } = await getDashboardData(user.id);
  const displayName = profile?.name?.trim() || profile?.email?.split("@")[0] || "there";
  const time = new Date().getHours();
  const greeting = time < 12 ? "morning" : time < 17 ? "afternoon" : "evening";

  return (
    <div className="mx-auto max-w-[1100px] px-5 py-10">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Dashboard" }]} />

      <header className="mt-8">
        <h1 className="text-[2rem] font-semibold tracking-[-0.02em] text-foreground sm:text-4xl">
          Good {greeting}, {displayName}!
        </h1>
        <p className="mt-2 text-[1.05rem] text-muted-foreground">Welcome to your Preprence workspace.</p>
      </header>

      <section className="mt-10 flex flex-col gap-6 rounded-2xl border border-[#d6f0ea] bg-white/60 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
        <div className="flex-1">
          <h2 className="text-[1.2rem] sm:text-[1.3rem] font-semibold tracking-tight text-foreground">Share your interview experience</h2>
          <p className="mt-1.5 max-w-[420px] text-[0.95rem] leading-relaxed text-muted-foreground">Help your juniors know what to expect by sharing your interview journey.</p>
        </div>
        <Link
          href="/experience/new"
          className="group inline-flex gap-2 items-center justify-center rounded-lg bg-[#0a6f63] px-6 py-3.5 text-[0.95rem] font-medium text-white transition-opacity hover:opacity-90"
        >
          Share experience
          <HugeiconsIcon
            icon={ArrowRight01Icon}
            className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
          />
        </Link>
      </section>

      <section className="mt-12">
        <h2 className="text-[1.3rem] sm:text-[1.4rem] font-semibold tracking-tight text-foreground">Your activity</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="flex items-center gap-5 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <span className="flex h-[3.25rem] w-[3.25rem] shrink-0 items-center justify-center rounded-full bg-[#e1ecf5] text-[#094770] text-xl">
              <HugeiconsIcon icon={FileIcon} />
            </span>
            <div>
              <p className="text-2xl font-semibold leading-none tracking-tight text-foreground">{stats.total}</p>
              <p className="mt-1.5 text-[0.95rem] font-medium text-foreground">Experiences shared</p>
              <p className="mt-1.5 text-[0.95rem] font-medium text-muted-foreground">Keep contributing</p>
            </div>
          </div>

          <div className="flex items-center gap-5 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <span className="flex h-[3.25rem] w-[3.25rem] shrink-0 items-center justify-center rounded-full bg-[#e3fbee] text-[#1c7b39] text-xl">
              <HugeiconsIcon icon={Tick03Icon} />
            </span>
            <div>
              <p className="text-2xl font-semibold leading-none tracking-tight text-foreground">{stats.published}</p>
              <p className="mt-1.5 text-[0.95rem] font-medium text-foreground">Published</p>
              <p className="mt-1.5 text-[0.95rem] font-medium text-muted-foreground">Visible to other students</p>
            </div>
          </div>

          <div className="flex items-center gap-5 rounded-2xl border border-border bg-card p-6 shadow-sm">
            <span className="flex h-[3.25rem] w-[3.25rem] shrink-0 items-center justify-center rounded-full bg-[#fdf3e1] text-[#a46600] text-xl">
              <HugeiconsIcon icon={Edit02Icon} />
            </span>
            <div>
              <p className="text-2xl font-semibold leading-none tracking-tight text-foreground">{stats.draft}</p>
              <p className="mt-1.5 text-[0.95rem] font-medium text-foreground">Draft</p>
              <p className="mt-1.5 text-[0.95rem] font-medium text-muted-foreground">Continue writing</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-12 overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex flex-row items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-5">
          <h2 className="text-[1.15rem] font-semibold tracking-tight text-foreground">Your recent experiences</h2>
          <Link
            href="/dashboard/experiences"
            className="text-[0.9rem] font-medium text-[#0a6f63] transition-colors hover:text-[#0a6f63]/80 hover:underline"
          >
            View all
          </Link>
        </div>

        {experiences.length === 0 ? (
          <div className="px-6 py-10 text-center text-muted-foreground">You haven&apos;t shared any interview experiences yet.</div>
        ) : (
          <div className="divide-y divide-border border-t border-border">
            {experiences.map((experience) => (
              <DashboardExperienceRowCard
                key={experience.id}
                experience={experience}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
