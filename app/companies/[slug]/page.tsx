import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { CompanyMarkLarge } from "@/components/CompanyMark";
import { NormalExperienceRowCard } from "@/components/NormalExperienceRowCard";

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
                <CompanyMarkLarge company={company} />
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
