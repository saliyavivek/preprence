import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createExperience } from "./actions";
import AddExperienceTimeline from "@/components/AddExperienceTimeline";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowDown01Icon, ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { CompanyCombobox } from "@/components/CompanyCombobox";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

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

const selectClassName = `${fieldClassName} appearance-none pr-12`;

function SelectField({ id, name, defaultValue, required = false, children }: { id: string; name: string; defaultValue: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="relative">
      <select
        id={id}
        name={name}
        required={required}
        className={selectClassName}
        defaultValue={defaultValue}
      >
        {children}
      </select>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
      >
        <HugeiconsIcon
          icon={ArrowDown01Icon}
          size="100%"
          className="h-5 w-5"
        />
      </span>
    </div>
  );
}

export default async function NewExperiencePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=${encodeURIComponent("/experience/new")}`);

  const companies = await prisma.company.findMany({
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
  });

  return (
    <main className="min-h-[calc(100vh-10rem)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-3 text-sm text-muted-foreground"
        >
          <Link
            href="/"
            className="hover:text-foreground"
          >
            Home
          </Link>
          <span
            aria-hidden="true"
            className="text-lg"
          >
            ›
          </span>
          <span className="font-medium text-primary">Share experience</span>
        </nav>

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
                  htmlFor="roleTitle"
                  required
                >
                  <input
                    id="roleTitle"
                    name="roleTitle"
                    placeholder="e.g. Systems Engineer"
                    required
                    className={fieldClassName}
                  />
                </Field>
                <Field
                  label="Degree"
                  htmlFor="degree"
                  required
                >
                  <input
                    id="degree"
                    name="degree"
                    placeholder="e.g. MCA"
                    required
                    className={fieldClassName}
                  />
                </Field>
                <Field
                  label="Graduation year"
                  htmlFor="graduationYear"
                  required
                >
                  <input
                    id="graduationYear"
                    name="graduationYear"
                    type="number"
                    placeholder="e.g. 2027"
                    required
                    className={fieldClassName}
                  />
                </Field>
                <Field
                  label="Interview date"
                  htmlFor="interviewDate"
                  required
                >
                  <input
                    id="interviewDate"
                    name="interviewDate"
                    type="date"
                    required
                    className={fieldClassName}
                  />
                </Field>
                <Field
                  label="Verdict"
                  htmlFor="verdict"
                >
                  <SelectField
                    id="verdict"
                    name="verdict"
                    defaultValue="not_disclosed"
                  >
                    <option value="not_disclosed">Prefer not to say</option>
                    <option value="selected">Selected</option>
                    <option value="rejected">Rejected</option>
                  </SelectField>
                  <p className="text-sm text-muted-foreground">You can choose to keep this private.</p>
                </Field>
              </div>
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
