import Link from "next/link";
import { CompanyCard } from "@/components/CompanyCard";
import { prisma } from "@/lib/prisma";
import { CompanyMarkLarge } from "@/components/CompanyMark";

type CompaniesPageProps = {
  searchParams: Promise<{ q?: string; showAll?: string }>;
};

type Company = Awaited<ReturnType<typeof getCompanies>>[number];

async function getCompanies() {
  return prisma.company.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: {
          experiences: {
            where: {
              status: "published",
            },
          },
        },
      },
    },
  });
}

function EmptyState({ search }: { search?: string }) {
  if (search) {
    return (
      <div className="border-y border-border py-12 text-center">
        <h2 className="text-lg font-semibold tracking-tight">No companies found</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">We couldn&apos;t find a company matching your search.</p>
      </div>
    );
  }

  return (
    <div className="border-y border-border py-12 text-center">
      <h2 className="text-lg font-semibold tracking-tight">No interview experiences yet.</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">There aren&apos;t any published interview experiences to browse yet.</p>
    </div>
  );
}

// Custom Square Card designed for the "All companies" grid
function SquareCompanyCard({ company }: { company: Company }) {
  return (
    <Link
      href={`/companies/${company.slug}`}
      className="group flex flex-col items-center justify-center gap-4"
    >
      <CompanyMarkLarge company={company} />
      <h3 className="line-clamp-2 text-[0.9rem] md:text-[1.1rem] font-semibold leading-tight tracking-tight text-gray-900 text-center">{company.name}</h3>
    </Link>
  );
}

export default async function CompaniesPage({ searchParams }: CompaniesPageProps) {
  const params = await searchParams;
  const companies = await getCompanies();
  const query = (params.q ?? "").trim();
  const showAllCompanies = params.showAll === "true" || params.showAll === "1";
  const filteredCompanies = query ? companies.filter((company) => company.name.toLowerCase().includes(query.toLowerCase())) : companies;
  const popularCompanies = [...filteredCompanies]
    .filter((company) => company._count.experiences > 0)
    .sort((a, b) => b._count.experiences - a._count.experiences || a.name.localeCompare(b.name))
    .slice(0, 3);
  const initialCompanyCount = 8;
  const hasMoreCompanies = filteredCompanies.length > initialCompanyCount;
  const companiesToDisplay = showAllCompanies ? filteredCompanies : filteredCompanies.slice(0, initialCompanyCount);
  const companiesHref = query ? `/companies?q=${encodeURIComponent(query)}&showAll=1` : "/companies?showAll=1";
  const collapseCompaniesHref = query ? `/companies?q=${encodeURIComponent(query)}` : "/companies";

  return (
    <main className="min-h-[calc(100vh-8rem)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-5 py-14 sm:px-8 sm:py-16 lg:px-12">
        <header className="flex max-w-3xl flex-col gap-3">
          <h1 className="text-4xl font-semibold tracking-[-0.045em] text-gray-900 sm:text-5xl">Companies</h1>
          <p className="text-base leading-7 text-gray-500 sm:text-lg">Find interview experiences shared by students from your college.</p>
        </header>

        <form
          action="/companies"
          className="max-w-2xl"
        >
          <label
            htmlFor="company-search"
            className="sr-only"
          >
            Search companies
          </label>
          <div className="relative">
            <span
              aria-hidden="true"
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl text-gray-400"
            >
              ⌕
            </span>
            <input
              id="company-search"
              name="q"
              defaultValue={query}
              placeholder="Search companies..."
              className="min-h-12 w-full rounded-lg border border-gray-200 bg-white pl-12 pr-4 text-gray-900 outline-none placeholder:text-gray-400 focus:border-[#1c7b6d] focus:ring-1 focus:ring-[#1c7b6d] shadow-sm"
            />
          </div>
        </form>

        {companies.length === 0 || filteredCompanies.length === 0 ? (
          <EmptyState search={query} />
        ) : (
          <div className="flex flex-col gap-14">
            {/* Popular Companies (Kept for continuity, you can remove if not needed) */}
            <section
              aria-labelledby="popular-heading"
              className="flex flex-col gap-6"
            >
              <div className="flex items-end justify-between gap-4">
                <h2
                  id="popular-heading"
                  className="text-2xl font-semibold tracking-tight text-gray-900"
                >
                  Popular companies
                </h2>
                <span className="hidden text-sm text-gray-500 sm:block">Based on published experiences</span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {popularCompanies.map((company) => (
                  <CompanyCard
                    key={`popular-${company.id}`}
                    company={company}
                  />
                ))}
              </div>
            </section>

            {/* All Companies - Redesigned Section */}
            <section
              aria-labelledby="all-heading"
              className="flex flex-col gap-6 border-t border-gray-200 pt-10"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-end justify-between gap-4">
                  <h2
                    id="all-heading"
                    className="text-[1.75rem] font-semibold tracking-tight text-gray-900"
                  >
                    All companies
                  </h2>
                  <span className="text-[0.95rem] text-gray-500">{filteredCompanies.length} listed</span>
                </div>
                <p className="text-[0.95rem] text-gray-500">Browse companies and read real interview experiences shared by students.</p>
              </div>

              {/* 4-Column Grid */}
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6 mt-2">
                {companiesToDisplay.map((company) => (
                  <SquareCompanyCard
                    key={company.id}
                    company={company}
                  />
                ))}
              </div>

              {/* Footer Actions */}
              <div className="mt-8 flex flex-col items-center gap-6">
                {hasMoreCompanies ? (
                  <Link
                    href={showAllCompanies ? collapseCompaniesHref : companiesHref}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-[#1c7b6d] px-6 py-3 text-[0.95rem] font-medium text-[#1c7b6d] shadow-sm transition-colors hover:bg-[#1c7b6d]/5 sm:w-auto"
                  >
                    {showAllCompanies ? "Show fewer companies" : "View all companies"}
                  </Link>
                ) : null}
                <p className="text-[0.95rem] text-gray-500 text-center">
                  Can&apos;t find the company you&apos;re looking for?{" "}
                  <Link
                    href="/experience/new"
                    className="font-semibold text-[#1c7b6d] hover:underline"
                  >
                    Share an experience
                  </Link>{" "}
                  to help others.
                </p>
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
