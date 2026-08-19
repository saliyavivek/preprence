import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/admin";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export default async function AdminPage() {
  await requireAdmin();

  const experiences = await prisma.experience.findMany({
    where: {
      status: "published",
    },
    include: {
      company: true,
      author: {
        select: {
          name: true,
          email: true,
        },
      },
      reports: {
        include: {
          reportedBy: {
            select: {
              name: true,
              email: true,
            },
          },
        },
      },
      rounds: {
        orderBy: {
          roundNumber: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const reportedExperiences = experiences.filter((experience) => experience.reports.length > 0);

  return (
    <main>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Admin" }, { label: "Experiences" }]} />
      <h1>Admin Dashboard</h1>

      <section>
        <h2>Published Experiences</h2>

        {experiences.length === 0 ? (
          <p>No published experiences on the platform.</p>
        ) : (
          <ul>
            {experiences.map((experience) => (
              <li key={experience.id}>
                <h3>{experience.company.name}</h3>

                <p>
                  {experience.degree} · {experience.roleTitle}
                </p>

                <p>Submitted by: {experience.isAnonymous ? "Anonymous" : (experience.author.name ?? experience.author.email)}</p>

                <p>
                  {experience.rounds.length} {experience.rounds.length === 1 ? "round" : "rounds"}
                </p>

                <p>Reports: {experience.reports.length}</p>

                <Link href={`/admin/experiences/${experience.id}`}>Review Experience</Link>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section>
        <h2>Reported Experiences</h2>

        {reportedExperiences.length === 0 ? (
          <p>No reported experiences.</p>
        ) : (
          <ul>
            {reportedExperiences.map((experience) => (
              <li key={experience.id}>
                <h3>{experience.company.name}</h3>

                <p>
                  {experience.degree} · {experience.roleTitle}
                </p>

                <p>{experience.reports.length} report(s) received</p>

                {experience.reports.map((report) => (
                  <p key={report.id}>
                    {report.reportedBy.name ?? report.reportedBy.email}: {report.reason ?? "No reason provided"}
                  </p>
                ))}

                <Link href={`/admin/experiences/${experience.id}`}>Review Experience</Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
