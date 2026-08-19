import { CompanyCard } from "@/components/CompanyCard";
import { CompanyGrid } from "@/components/CompanyGrid";
import { prisma } from "@/lib/prisma";

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

function EmptyState() {
  return (
    <div className="border-y border-border py-12 text-center">
      <h2 className="text-lg font-semibold tracking-tight">No interview experiences yet.</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">There aren&apos;t any published interview experiences to browse yet.</p>
    </div>
  );
}

export default async function CompaniesPage() {
  const companies = await getCompanies();
  const popularCompanies = [...companies]
    .filter((company) => company._count.experiences > 0)
    .sort((a, b) => b._count.experiences - a._count.experiences || a.name.localeCompare(b.name))
    .slice(0, 3);
  return (
    <main className="min-h-[calc(100vh-8rem)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-5 py-14 sm:px-8 sm:py-16 lg:px-12">
        <header className="flex max-w-3xl flex-col gap-3">
          <h1 className="text-4xl font-semibold tracking-[-0.045em] text-gray-900 sm:text-5xl">Companies</h1>
          <p className="text-base leading-7 text-gray-500 sm:text-lg">Find interview experiences shared by students from your college.</p>
        </header>

        {companies.length === 0 ? (
          <EmptyState />
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
                  <span className="hidden sm:block text-[0.95rem] text-gray-500">{companies.length} companies found</span>
                </div>
                <p className="text-[0.95rem] text-gray-500">Browse companies and read real interview experiences shared by students.</p>
              </div>

              <CompanyGrid companies={companies} />
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
