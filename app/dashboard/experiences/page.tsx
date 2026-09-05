import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { DashboardExperienceRowCard } from "@/components/DashboardExperienceRowCard";
import { HugeiconsIcon } from "@hugeicons/react";
import { Edit01Icon } from "@hugeicons/core-free-icons";
import { Breadcrumbs } from "@/components/Breadcrumbs";

async function getExperiences(userId: string) {
  return prisma.experience.findMany({
    where: { authorId: userId },
    include: {
      company: true,
      author: {
        select: {
          degree: true,
          graduationYear: true,
        },
      },
      rounds: true,
      role: true,
      experienceSkills: { include: { skill: true } },
    },
    orderBy: { updatedAt: "desc" },
  });
}

export default async function MyExperiencesPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=${encodeURIComponent("/dashboard/experiences")}`);

  const experiences = await getExperiences(user.id);

  return (
    <main className="min-h-[calc(100vh-8rem)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Dashboard", href: "/dashboard" }, { label: "Your experiences" }]} />

        <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-semibold tracking-[-0.045em] text-foreground sm:text-5xl">Your experiences</h1>
            <p className="text-base leading-7 text-muted-foreground sm:text-lg">Manage the interview experiences you&apos;ve shared.</p>
          </div>
          <Link
            href="/experience/new"
            className="inline-flex min-h-12 items-center justify-center rounded-md bg-primary px-5 font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/30 gap-2"
          >
            <HugeiconsIcon
              icon={Edit01Icon}
              className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
            />
            Share an experience
          </Link>
        </header>

        {experiences.length === 0 ? (
          <section className="flex flex-col items-center gap-5 rounded-xl border border-border bg-white/60 px-6 py-16 text-center">
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
              <DashboardExperienceRowCard
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
