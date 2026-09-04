import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import { Briefcase01Icon, Building03Icon, Calendar03Icon, ChevronRightIcon, GraduationCapIcon } from "@hugeicons/core-free-icons";
import { getRoleExperiencePageData } from "./actions";
import { CompanyMarkMedium } from "@/components/CompanyMark";
import { Breadcrumbs } from "@/components/Breadcrumbs";

type PageProps = { params: Promise<{ roleSlug: string }>; searchParams: Promise<{ page?: string; sort?: "newest" | "oldest" }> };

function ExperienceCard({ experience, roleName }: { experience: any; roleName: string }) {
  return (
    <Link
      href={`/experiences/${experience.id}`}
      className="group rounded-lg border border-border bg-white/60 transition hover:border-primary/30 hover:shadow-xs"
    >
      <article className="flex flex-col sm:flex-row gap-5 sm:gap-7 p-4 sm:p-5">
        <div className="flex flex-1 items-start sm:items-center gap-3 min-w-0">
          <CompanyMarkMedium company={experience.company} />
          <div className="min-w-0 flex flex-col sm:flex-row flex-1 gap-2 sm:gap-12">
            <div>
              <h3 className="truncate text-md font-semibold group-hover:text-primary">{experience.company.name}</h3>
              <p className="mt-0.5 text-sm text-muted-foreground">{roleName}</p>
              <div className="flex flex-col sm:flex-row items-start sm:items-center sm:gap-2">
                <div className="mt-1 flex items-center gap-1 text-sm text-muted-foreground">
                  <HugeiconsIcon
                    icon={Calendar03Icon}
                    size={14}
                    strokeWidth={2}
                  />
                  <span>{experience.timing}</span>
                </div>
                <span
                  aria-hidden="true"
                  className="hidden mt-1 text-xs text-gray-200 sm:inline"
                >
                  |
                </span>
                <div className="mt-1 flex items-center self-start gap-1 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <HugeiconsIcon
                      className="w-4 h-4"
                      size="100%"
                      icon={GraduationCapIcon}
                    />
                    {experience.degree}
                  </span>
                  <span>·</span>
                  <span>{experience.year}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t sm:border-t-0 sm:border-l border-border pt-4 sm:pt-0 sm:pl-7 flex justify-between flex-1">
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-sm font-semibold text-foreground">Interview Rounds</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {experience.rounds.map((tag: string) => (
                  <span
                    key={tag}
                    className="rounded-md capitalize border border-border bg-muted/50 px-2.5 py-1 text-xs text-muted-foreground font-semibold"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">Skills asked</p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {experience.skills.length > 0 ? (
                  experience.skills.map((skill: string) => (
                    <span
                      key={skill}
                      className="rounded-md capitalize border border-border bg-muted/50 px-2.5 py-1 text-xs text-muted-foreground font-semibold"
                    >
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">No skills recorded</span>
                )}
              </div>
            </div>
          </div>

          <div className="hidden shrink-0 items-center justify-center text-muted-foreground group-hover:text-primary sm:flex transition-transform duration-200 group-hover:translate-x-1">
            <HugeiconsIcon
              icon={ChevronRightIcon}
              size={20}
              strokeWidth={2}
            />
          </div>
        </div>
      </article>
    </Link>
  );
}

export default async function RoleExperiencesPage({ params, searchParams }: PageProps) {
  const { roleSlug } = await params;
  const query = await searchParams;
  const sort = query.sort === "oldest" ? "oldest" : "newest";
  const data = await getRoleExperiencePageData(roleSlug, sort);
  if (!data || data.total === 0) {
    return (
      <main className="mx-auto flex min-h-screen max-w-6xl items-center justify-center px-4 py-8 sm:px-8 sm:py-16">
        <p className="text-center text-muted-foreground">No interview experiences found for this role.</p>
      </main>
    );
  }
  const { role, experiences, total, totalCompanies } = data;

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:gap-8 sm:px-8 sm:py-16">
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Interview experiences", href: "/experiences" }, { label: role.name }]} />
      <header className="border-b border-border sm:pb-16 pb-10 pt-7 sm:pt-9">
        <div className="flex items-start gap-5 sm:gap-7">
          <div className="hidden size-30 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary sm:flex">
            <HugeiconsIcon
              icon={Briefcase01Icon}
              size={60}
              strokeWidth={1.5}
            />
          </div>
          <div>
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{role.name}</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">Read interview experiences for {role.name} roles.</p>
            <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-2">
                <HugeiconsIcon
                  icon={Briefcase01Icon}
                  size={15}
                />
                {total.toLocaleString("en-IN")} experiences
              </span>
              <span className="inline-flex items-center gap-2">
                <HugeiconsIcon
                  icon={Building03Icon}
                  size={15}
                />
                {totalCompanies.toLocaleString("en-IN")} companies
              </span>
            </div>
          </div>
        </div>
      </header>
      <section
        className="pt-7"
        aria-labelledby="experience-list-heading"
      >
        <div className="mb-4 flex items-center justify-between">
          <h2
            id="experience-list-heading"
            className="text-sm font-semibold"
          >
            {total.toLocaleString("en-IN")} experiences
          </h2>
        </div>
        <div className="flex flex-col gap-3">
          {experiences.map((experience: any) => (
            <ExperienceCard
              key={experience.id}
              experience={experience}
              roleName={role.name}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
