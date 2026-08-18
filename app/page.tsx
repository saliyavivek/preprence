import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { CompanyCard } from "@/components/CompanyCard";
import { ExperienceRow } from "@/components/ExperienceRow";
import { InterviewFlow } from "@/components/InterviewFlow";
import { createClient } from "@/lib/supabase/server";
import OnboardingDetailsModal from "../components/OnboardingDetailsModal";

async function getLandingData() {
  return Promise.all([
    prisma.company.findMany({
      where: {
        experiences: {
          some: {
            status: "published",
          },
        },
      },
      orderBy: [
        {
          experiences: {
            _count: "desc",
          },
        },
      ],
      take: 6,
      include: { _count: { select: { experiences: { where: { status: "published" } } } } },
    }),
    prisma.experience.findMany({
      where: { status: "published" },
      include: { company: true, rounds: true },
      orderBy: { createdAt: "desc" },
      take: 6,
    }),
  ]).then(([companies, experiences]) => ({ companies, experiences }));
}

export default async function HomePage() {
  const { companies, experiences } = await getLandingData();

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let showOnboarding = false;

  if (user) {
    const profile = await prisma.user.findUnique({
      where: {
        id: user.id,
      },
      select: {
        onboardingCompleted: true,
      },
    });

    if (profile && !profile.onboardingCompleted) {
      showOnboarding = true;
    }
  }

  return (
    <>
      <main className="overflow-x-hidden">
        <section className="relative">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 [background-image:linear-gradient(to_right,rgba(32,37,34,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(32,37,34,0.045)_1px,transparent_1px)] [background-size:6rem_6rem] [mask-image:radial-gradient(120%_85%_at_70%_25%,black,transparent_75%)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute right-[10%] top-4 size-[30rem] rounded-full bg-primary/[0.06] blur-3xl"
          />
          <div className="relative mx-auto flex max-w-6xl items-center gap-10 px-5 pb-20 pt-14 sm:px-8 sm:pb-24 sm:pt-20 lg:px-12">
            <div className="flex max-w-2xl flex-1 flex-col">
              <h1 className="mt-5 text-balance text-[2.6rem] font-semibold leading-[1.05] tracking-[-0.045em] sm:text-6xl lg:text-[4.1rem]">
                Know the interview
                <br className="hidden sm:block" /> before you face it.
              </h1>
              <p className="mt-5 max-w-md text-pretty text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">Read real interview experiences shared by students from your college.</p>

              <form
                action="/companies"
                method="get"
                className="mt-8 flex w-full max-w-[560px] flex-col gap-3 sm:flex-row"
              >
                <label
                  htmlFor="company-search"
                  className="sr-only"
                >
                  Search companies, roles, or keywords
                </label>
                <div className="relative min-w-0 flex-1">
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <circle
                      cx="11"
                      cy="11"
                      r="7"
                    />
                    <path d="m20 20-3.5-3.5" />
                  </svg>
                  <input
                    id="company-search"
                    name="search"
                    type="search"
                    placeholder="Search companies, roles, or keywords..."
                    className="h-12 w-full rounded-md border border-input bg-card pl-11 pr-4 text-base outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15"
                  />
                </div>
                <button
                  type="submit"
                  className="h-12 rounded-md bg-primary px-8 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
                >
                  Search
                </button>
              </form>
            </div>

            <InterviewFlow />
          </div>
        </section>

        <div className="mx-auto flex max-w-6xl flex-col gap-16 px-5 pb-20 pt-4 sm:px-8 sm:gap-20 sm:pb-24 lg:px-12">
          <section
            aria-labelledby="popular-companies-heading"
            className="flex flex-col gap-5"
          >
            <div className="flex items-end justify-between gap-4">
              <h2
                id="popular-companies-heading"
                className="text-2xl font-semibold tracking-[-0.02em] sm:text-[1.75rem]"
              >
                Popular companies
              </h2>
              <Link
                href="/companies"
                className="text-sm font-semibold text-primary hover:underline"
              >
                View all
              </Link>
            </div>

            {companies.length === 0 ? (
              <p className="border-t border-border py-5 text-muted-foreground">No companies available yet.</p>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {companies.map((company) => (
                  <CompanyCard
                    key={company.id}
                    company={company}
                  />
                ))}
              </div>
            )}
          </section>

          <section
            aria-labelledby="latest-experiences-heading"
            className="flex flex-col gap-5"
          >
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                <h2
                  id="latest-experiences-heading"
                  className="text-2xl font-semibold tracking-[-0.02em] sm:text-[1.75rem]"
                >
                  Latest experiences
                </h2>
              </div>
              <Link
                href="/experiences"
                className="text-sm font-semibold text-primary hover:underline"
              >
                View all
              </Link>
            </div>

            {experiences.length === 0 ? (
              <p className="border-t border-border py-5 text-muted-foreground">No published experiences yet.</p>
            ) : (
              <div className="rounded-lg border border-border bg-card px-3 sm:px-4">
                {experiences.map((experience) => (
                  <ExperienceRow
                    key={experience.id}
                    experience={experience}
                  />
                ))}
              </div>
            )}
          </section>

          <section className="flex flex-col gap-6 rounded-lg border border-primary/15 bg-primary/[0.045] px-6 py-8 sm:px-9 md:flex-row md:items-center md:justify-between md:gap-8 lg:gap-12">
            <div className="max-w-sm shrink-0">
              <h2 className="text-2xl font-semibold tracking-[-0.02em]">Been through an interview?</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">Share what you learned and help the next student prepare.</p>
            </div>

            <div className="hidden lg:flex lg:flex-1 lg:items-center lg:justify-center lg:gap-8">
              <ol
                aria-hidden="true"
                className="flex"
              >
                {["Assessment", "Technical", "Managerial", "HR"].map((label, index) => (
                  <li
                    key={label}
                    className="flex items-center"
                  >
                    <div className="flex w-[56px] flex-col items-center gap-2">
                      <span className="grid size-8 place-items-center rounded-full border border-primary/30 bg-card text-[11px] font-semibold text-primary">0{index + 1}</span>
                      <span className="text-[11px] text-muted-foreground">{label}</span>
                    </div>
                    {index < 3 && <span className="mb-5 h-px w-6 bg-primary/20" />}
                  </li>
                ))}
              </ol>
            </div>

            <div className="shrink-0">
              <Link
                href="/experience/new"
                className="rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                Share your experience
              </Link>
            </div>
          </section>
        </div>
      </main>
      {showOnboarding && <OnboardingDetailsModal />}
    </>
  );
}
