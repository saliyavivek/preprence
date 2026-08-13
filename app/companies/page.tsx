import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function CompaniesPage() {
  const companies = await prisma.company.findMany({
    orderBy: {
      name: "asc",
    },
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

  return (
    <main>
      <h1>Companies</h1>

      {companies.length === 0 ? (
        <p>No companies found.</p>
      ) : (
        <div>
          {companies.map((company) => (
            <article key={company.id}>
              <h2>{company.name}</h2>

              <p>
                {company._count.experiences} {company._count.experiences === 1 ? "interview experience" : "interview experiences"}
              </p>

              <Link href={`/companies/${company.slug}`}>View Experiences</Link>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}
