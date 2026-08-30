import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ExperienceDirectory } from "@/components/experience-directory";
import { HugeiconsIcon } from "@hugeicons/react";
import { Edit02Icon } from "@hugeicons/core-free-icons";
import { Breadcrumbs } from "@/components/Breadcrumbs";

async function getExperiences() {
  return prisma.experience.findMany({
    where: { status: "published" },
    orderBy: { interviewDate: "desc" },
    include: { company: true, rounds: { orderBy: { roundNumber: "asc" } }, role: true },
  });
}

export default async function ExperiencesPage() {
  const experiences = await getExperiences();
  return (
    <main>
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:gap-8 sm:px-8 sm:py-16">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Interview experiences" }]} />
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">All Interview Experiences</h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">Real interview experiences shared by students from our college community.</p>
          </div>
          <Link
            href="/experience/new"
            className="inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-md border border-primary px-4 py-2 text-sm font-medium bg-primary text-primary-foreground transition-opacity hover:opacity-90 sm:w-auto"
          >
            <HugeiconsIcon
              icon={Edit02Icon}
              size="100%"
              className="w-4 h-4"
            />
            Share your experience
          </Link>
        </header>
        <ExperienceDirectory experiences={experiences} />
      </div>
    </main>
  );
}
