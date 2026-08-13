import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CompanyPage({ params }: Props) {
  const { slug } = await params;

  console.log(slug);

  const company = await prisma.company.findUnique({
    where: {
      slug,
    },
    include: {
      experiences: {
        where: {
          status: "published",
        },
        include: {
          rounds: {
            orderBy: {
              roundNumber: "asc",
            },
          },
        },
        orderBy: {
          interviewDate: "desc",
        },
      },
    },
  });

  if (!company) {
    notFound();
  }

  return (
    <main>
      <header>
        <h1>{company.name}</h1>

        {company.websiteUrl && (
          <a
            href={company.websiteUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            Official Website
          </a>
        )}
      </header>

      <section>
        <h2>Interview Experiences</h2>

        {company.experiences.length === 0 ? (
          <p>No published experiences yet.</p>
        ) : (
          <div>
            {company.experiences.map((experience) => (
              <article key={experience.id}>
                <h3>
                  {experience.degree} · {experience.roleTitle}
                </h3>

                <p>Graduation Year: {experience.graduationYear}</p>

                <p>Interview Date: {experience.interviewDate.toLocaleDateString()}</p>

                <p>
                  {experience.rounds.length} {experience.rounds.length === 1 ? "round" : "rounds"}
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
