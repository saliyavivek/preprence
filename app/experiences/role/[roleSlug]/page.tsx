import { HugeiconsIcon } from "@hugeicons/react";
import { Briefcase01Icon, Building03Icon } from "@hugeicons/core-free-icons";
import { getRoleExperiencePageData } from "./actions";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { SkillRoleExperienceRowCard } from "@/components/SkillRoleExperienceRowCard";

type PageProps = { params: Promise<{ roleSlug: string }>; searchParams: Promise<{ page?: string; sort?: "newest" | "oldest" }> };

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
            <SkillRoleExperienceRowCard
              key={experience.id}
              experience={experience}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
