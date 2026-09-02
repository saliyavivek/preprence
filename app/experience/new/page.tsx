import { prisma } from "@/lib/prisma";
import { createExperience } from "./actions";
import AddExperienceTimeline from "@/components/AddExperienceTimeline";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon, ArrowRight01Icon, Calendar01Icon } from "@hugeicons/core-free-icons";
import { CompanyCombobox } from "@/components/CompanyCombobox";
import { RoleCombobox } from "@/components/RoleCombobox";
import { SkillCombobox } from "@/components/SkillCombobox";
import { VerdictCombobox } from "@/components/VerdictCombobox";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";

function Field({ label, htmlFor, required = false, children }: { label: string; htmlFor: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={htmlFor}
        className="text-sm font-medium text-foreground"
      >
        {label} {required && <span className="text-destructive">*</span>}
      </label>
      {children}
    </div>
  );
}

const fieldClassName =
  "min-h-14 w-full rounded-xl border border-input bg-background px-4 text-base text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10";

export default async function NewExperiencePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=${encodeURIComponent("/experience/new")}`);

  const [companies, roles, skills] = await Promise.all([
    prisma.company.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: {
          select: {
            experiences: {
              where: { status: "published" },
            },
          },
        },
      },
    }),
    prisma.role.findMany({
      orderBy: { name: "asc" },
    }),
    prisma.skill.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <main className="min-h-[calc(100vh-10rem)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Share experience" }]} />

        <header className="flex items-center gap-5 sm:gap-8">
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl font-semibold tracking-[-0.04em] text-foreground sm:text-4xl lg:text-5xl">Share your interview experience</h1>
            <p className="text-base text-muted-foreground sm:text-lg">Help the next student know what to expect.</p>
          </div>
        </header>

        <AddExperienceTimeline active={1} />

        <form
          action={createExperience}
          className="flex flex-col gap-7"
        >
          <section className="rounded-2xl border border-border bg-card p-6 shadow-[0_8px_30px_rgba(32,37,34,0.04)] sm:p-8">
            <div className="flex flex-col gap-7">
              <h2 className="text-2xl font-semibold tracking-tight">About the interview</h2>
              <div className="grid gap-6 md:grid-cols-2">
                <Field
                  label="Company"
                  htmlFor="companyId"
                  required
                >
                  <CompanyCombobox companies={companies} />
                </Field>
                <Field
                  label="Role / Designation"
                  htmlFor="roleId"
                  required
                >
                  <RoleCombobox roles={roles} />
                </Field>
                <Field
                  label="Interview date"
                  htmlFor="interviewDate"
                  required
                >
                  <div className="relative">
                    <input
                      id="interviewDate"
                      name="interviewDate"
                      type="date"
                      required
                      className={`${fieldClassName} pr-2 [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer`}
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                    >
                      <HugeiconsIcon
                        icon={Calendar01Icon}
                        size="100%"
                        className="h-5 w-5"
                      />
                    </span>
                  </div>
                </Field>

                <Field
                  label="Verdict"
                  htmlFor="verdict"
                >
                  <VerdictCombobox defaultValue="not_disclosed" />
                  {/* <p className="text-sm text-muted-foreground">You can choose to keep this private.</p> */}
                </Field>
              </div>
              <Field
                label="Skills"
                htmlFor="skillSearch"
                required
              >
                <SkillCombobox skills={skills} />
              </Field>
              <p className="text-sm text-muted-foreground">
                <span className="text-destructive">*</span> Required fields
              </p>
            </div>
          </section>

          <section className="flex flex-col gap-6 rounded-2xl border border-border bg-card p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
            <div>
              <h2 className="font-semibold text-muted-foreground">You&apos;ll be able to add the interview rounds, tips and other details in the next step.</h2>
            </div>
            <button
              type="submit"
              className="group inline-flex min-h-14 shrink-0 items-center justify-center gap-4 rounded-xl bg-primary px-6 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-primary/20"
            >
              Continue to next step{" "}
              <span
                aria-hidden="true"
                className="text-xl transition-transform duration-200 group-hover:translate-x-1"
              >
                <HugeiconsIcon
                  size="100%"
                  className="h-4 w-4"
                  icon={ArrowRight01Icon}
                />
              </span>
            </button>
          </section>
        </form>
      </div>
    </main>
  );
}
