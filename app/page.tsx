import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function HomePage() {
  const [companies, recentExperiences] = await Promise.all([
    prisma.company.findMany({
      orderBy: {
        name: "asc",
      },
      take: 8,
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
    }),

    prisma.experience.findMany({
      where: {
        status: "published",
      },
      include: {
        company: true,
        rounds: true,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 6,
    }),
  ]);

  return (
    <main>
      {/* Hero */}
      <section>
        <h1>Find real interview experiences from students.</h1>

        <p>Explore interview experiences, rounds, questions, and tips shared by candidates.</p>

        <Link href="/companies">Browse Companies</Link>
      </section>

      {/* Popular companies */}
      <section>
        <h2>Companies</h2>

        {companies.length === 0 ? (
          <p>No companies available yet.</p>
        ) : (
          <div>
            {companies.map((company) => (
              <Link
                key={company.id}
                href={`/companies/${company.slug}`}
              >
                <article>
                  <h3>{company.name}</h3>

                  <p>
                    {company._count.experiences} {company._count.experiences === 1 ? "experience" : "experiences"}
                  </p>
                </article>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Recent experiences */}
      <section>
        <h2>Recent Interview Experiences</h2>

        {recentExperiences.length === 0 ? (
          <p>No published experiences yet.</p>
        ) : (
          <div>
            {recentExperiences.map((experience) => (
              <article key={experience.id}>
                <h3>{experience.company.name}</h3>

                <p>
                  {experience.degree} · {experience.roleTitle}
                </p>

                <p>
                  {experience.graduationYear} · {experience.rounds.length} {experience.rounds.length === 1 ? "round" : "rounds"}
                </p>

                {experience.verdict && <p>Verdict: {experience.verdict}</p>}

                <Link href={`/experiences/${experience.id}`}>Read Experience</Link>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
