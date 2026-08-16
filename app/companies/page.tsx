import { CompanyCard } from "@/components/CompanyCard";
import { CompanyListItem } from "@/components/CompanyListItem";
import { prisma } from "@/lib/prisma";

type CompaniesPageProps = {
  searchParams: Promise<{ q?: string }>;
};

type Company = Awaited<ReturnType<typeof getCompanies>>[number];

async function getCompanies() {
  return prisma.company.findMany({
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

export default async function CompaniesPage({ searchParams }: CompaniesPageProps) {
  const companies = await getCompanies();
  const query = ((await searchParams).q ?? "").trim();
  const visibleCompanies = companies.filter((company) => company._count.experiences > 0);
  const filteredCompanies = query ? visibleCompanies.filter((company) => company.name.toLowerCase().includes(query.toLowerCase())) : visibleCompanies;
  const popularCompanies = [...filteredCompanies].sort((a, b) => b._count.experiences - a._count.experiences || a.name.localeCompare(b.name)).slice(0, 8);

  const groupedCompanies = filteredCompanies.reduce<Record<string, Company[]>>((groups, company) => {
    const letter = company.name.charAt(0).toUpperCase();
    (groups[letter] ??= []).push(company);
    return groups;
  }, {});

  const sortedLetters = Object.keys(groupedCompanies).sort((a, b) => a.localeCompare(b));

  return (
    <main className="min-h-[calc(100vh-8rem)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-5 py-14 sm:px-8 sm:py-16 lg:px-12">
        <header className="flex max-w-3xl flex-col gap-3">
          <h1 className="text-4xl font-semibold tracking-[-0.045em] text-foreground sm:text-5xl">Companies</h1>
          <p className="text-base leading-7 text-muted-foreground sm:text-lg">Find interview experiences shared by students from your college.</p>
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
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-xl text-muted-foreground"
            >
              ⌕
            </span>
            <input
              id="company-search"
              name="q"
              defaultValue={query}
              placeholder="Search companies..."
              className="min-h-12 w-full rounded-md border border-input bg-card pl-12 pr-4 text-foreground outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </div>
        </form>

        {visibleCompanies.length === 0 || filteredCompanies.length === 0 ? (
          <EmptyState search={query} />
        ) : (
          <div className="flex flex-col gap-12">
            <section
              aria-labelledby="popular-heading"
              className="flex flex-col gap-5"
            >
              <div className="flex items-end justify-between gap-4">
                <h2
                  id="popular-heading"
                  className="text-2xl font-semibold tracking-tight"
                >
                  Popular companies
                </h2>
                <span className="hidden text-sm text-muted-foreground sm:block">Based on published experiences</span>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {popularCompanies.map((company) => (
                  <CompanyCard
                    key={company.id}
                    company={company}
                  />
                ))}
              </div>
            </section>

            <section
              aria-labelledby="all-heading"
              className="flex flex-col gap-5"
            >
              <div className="flex items-end justify-between gap-4">
                <div className="flex flex-col gap-1">
                  <h2
                    id="all-heading"
                    className="text-2xl font-semibold tracking-tight"
                  >
                    All companies
                  </h2>
                </div>
                <span className="text-sm text-muted-foreground">{filteredCompanies.length} listed</span>
              </div>

              <div className="rounded-xl border border-border bg-card/40">
                {sortedLetters.map((letter, letterIndex) => {
                  const group = groupedCompanies[letter];

                  return (
                    <div
                      key={letter}
                      className={letterIndex > 0 ? "border-t border-border" : ""}
                    >
                      <div className="px-2 sm:px-4">
                        <div className="flex items-center gap-3 py-4 text-sm font-semibold text-foreground">
                          <span className="text-xl font-semibold text-primary">{letter}</span>
                        </div>
                      </div>

                      <div>
                        {group.map((company, companyIndex) => (
                          <div key={company.id}>
                            <CompanyListItem company={company} />
                            {companyIndex < group.length - 1 ? <div className="border-t border-border" /> : null}
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
