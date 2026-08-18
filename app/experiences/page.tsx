import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { DirectoryFilters, DirectorySidebar, ExperienceResult, ShareCta } from "@/components/experience-directory";
import { HugeiconsIcon } from "@hugeicons/react";
import { Edit02Icon } from "@hugeicons/core-free-icons";

async function getExperiences() {
  return prisma.experience.findMany({
    where: { status: "published" },
    orderBy: { interviewDate: "desc" },
    include: { company: true, rounds: { orderBy: { roundNumber: "asc" } } },
  });
}

export default async function ExperiencesPage() {
  const experiences = await getExperiences();
  return (
    <main>
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-12 sm:px-8 sm:py-16">
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">All Interview Experiences</h1>
            <p className="mt-2 text-muted-foreground">Real interview experiences shared by students from our college community.</p>
          </div>
          <Link
            href="/experience/new"
            className="rounded-md border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-white flex items-center gap-2"
          >
            <HugeiconsIcon
              icon={Edit02Icon}
              size="100%"
              className="w-4 h-4"
            />
            Share your experience
          </Link>
        </header>
        <DirectoryFilters />
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_17rem]">
          <section
            className="min-w-0 overflow-hidden rounded-lg border border-border bg-card"
            aria-label="Interview experiences"
          >
            <div className="border-b border-border px-5 py-4 text-sm text-muted-foreground">
              {experiences.length} {experiences.length === 1 ? "experience" : "experiences"} found
            </div>
            {experiences.length ? (
              experiences.map((experience) => (
                <ExperienceResult
                  key={experience.id}
                  experience={experience}
                />
              ))
            ) : (
              <div className="p-10 text-center text-sm text-muted-foreground">No published interview experiences yet.</div>
            )}
          </section>
          <DirectorySidebar experiences={experiences} />
        </div>
        <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
          <span>← Prev</span>
          <span className="rounded-md bg-primary px-3 py-2 text-primary-foreground">1</span>
          <span>2</span>
          <span>3</span>
          <span>Next →</span>
        </div>
        <ShareCta />
      </div>
    </main>
  );
}
