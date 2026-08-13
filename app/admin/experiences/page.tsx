import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/admin";

export default async function AdminPage() {
  await requireAdmin();

  const experiences = await prisma.experience.findMany({
    where: {
      status: "pending_review",
    },
    include: {
      company: true,
      author: {
        select: {
          name: true,
          email: true,
        },
      },
      rounds: {
        orderBy: {
          roundNumber: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "asc",
    },
  });

  return (
    <main>
      <h1>Admin Dashboard</h1>

      <h2>Pending Experiences</h2>

      {experiences.length === 0 ? (
        <p>No experiences waiting for review.</p>
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

              <Link href={`/admin/experiences/${experience.id}`}>Review Experience</Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
