import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CompanyMarkLarge } from "@/components/CompanyMark";
import { NormalExperienceRowCard } from "@/components/NormalExperienceRowCard";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon, Edit01Icon, File02Icon, Globe02Icon, World } from "@hugeicons/core-free-icons";
import { Breadcrumbs } from "@/components/Breadcrumbs";

type Props = { params: Promise<{ slug: string }> };

async function getCompany(slug: string) {
  return prisma.company.findUnique({
    where: { slug },
    include: {
      experiences: {
        where: { status: "published" },
        include: {
          company: true,
          rounds: { orderBy: { roundNumber: "asc" } },
        },
        orderBy: { interviewDate: "desc" },
      },
    },
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
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Companies", href: "/companies" }, { label: company.name }]} />

        <section className="rounded-lg border border-border bg-card">
          <div className="flex flex-col gap-7 p-6 sm:flex-row sm:items-center sm:justify-between sm:p-8">
            <div className="flex flex-col items-center gap-5 sm:flex-row sm:gap-6">
              <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-border bg-background sm:size-32">
                <CompanyMarkLarge company={company} />
              </div>
              <div className="flex min-w-0 flex-col items-center gap-3 text-center sm:items-start sm:text-left">
                <h1 className="max-w-full break-words text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">{company.name}</h1>
                {company.websiteUrl && (
                  <span className="flex max-w-full items-center gap-1">
                    <HugeiconsIcon
                      icon={Globe02Icon}
                      className="w-4 h-4"
                    />
                    <a
                      href={company.websiteUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="max-w-full break-all text-left text-sm font-medium text-primary underline-offset-4 hover:underline"
                    >
                      {company.websiteUrl.split("//")[1] ?? company.websiteUrl}
                    </a>
                  </span>
                )}
                <p className="flex items-center gap-1 text-center text-sm text-muted-foreground sm:text-left">
                  <HugeiconsIcon
                    icon={File02Icon}
                    className="w-4 h-4"
                  />
                  {count === 0 ? "No interview experiences yet" : `${count} interview ${count === 1 ? "experience" : "experiences"} shared`}
                </p>
              </div>
            </div>
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
                <NormalExperienceRowCard
                  key={experience.id}
                  experience={experience}
                  showCompanyMark={false}
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
              className="group mx-auto mt-2 inline-flex min-h-11 items-center rounded-md bg-primary px-5 font-medium text-primary-foreground gap-2"
            >
              Share your experience
              <HugeiconsIcon
                icon={ArrowRight01Icon}
                className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
              />
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
              className="inline-flex min-h-11 items-center justify-center rounded-md bg-primary px-5 font-medium text-primary-foreground gap-2"
            >
              <HugeiconsIcon
                icon={Edit01Icon}
                className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1"
              />
              Share your experience
            </Link>
          </section>
        )}
      </div>
    </main>
  );
}
