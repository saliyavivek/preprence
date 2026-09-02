import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/admin";
import { takeDownExperience } from "./actions";
import { Breadcrumbs } from "@/components/Breadcrumbs";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminExperiencePage({ params }: Props) {
  await requireAdmin();

  const { id } = await params;

  const experience = await prisma.experience.findUnique({
    where: {
      id,
    },
    include: {
      company: true,
      author: {
        select: {
          name: true,
          email: true,
          degree: true,
          graduationYear: true,
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
      role: true,
    },
  });

  if (!experience) {
    notFound();
  }

  if (experience.status !== "published") {
    notFound();
  }

  return (
    <main>
      <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Admin", href: "/admin/experiences" }, { label: "Review experience" }]} />
      <h1>Review Experience</h1>

      <section>
        <h2>Basic Information</h2>

        <p>Company: {experience.company.name}</p>
        <p>Degree: {experience.author?.degree}</p>
        <p>Graduation Year: {experience.author?.graduationYear}</p>
        <p>Role: {experience.role?.name || "N/A"}</p>
        <p>Interview Date: {experience.interviewDate.toLocaleDateString()}</p>
        <p>Verdict: {experience.verdict ?? "Not provided"}</p>
        <p>Status: {experience.status}</p>

        <p>Author: {experience.isAnonymous ? "Anonymous" : (experience.author?.name ?? experience.author?.email)}</p>
      </section>

      <section>
        <h2>Overall Tips</h2>
        <p>{experience.overallTips || "No tips provided."}</p>
      </section>

      <section>
        <h2>Interview Rounds</h2>

        {experience.rounds.map((round) => (
          <article key={round.id}>
            <h3>Round {round.roundNumber}</h3>

            <p>Type: {round.roundType}</p>

            {round.difficulty && <p>Difficulty: {round.difficulty}</p>}

            {round.questionsAsked && <p>Questions: {round.questionsAsked}</p>}

            {round.durationMinutes && <p>Duration: {round.durationMinutes} minutes</p>}
          </article>
        ))}
      </section>

      <section>
        <h2>Reports</h2>

        {experience.reports.length === 0 ? (
          <p>No reports for this experience.</p>
        ) : (
          <>
            <ul>
              {experience.reports.map((report) => (
                <li key={report.id}>
                  <p>Reported by: {report.reportedBy.name ?? report.reportedBy.email}</p>
                  <p>Reason: {report.reason ?? "No reason provided"}</p>
                </li>
              ))}
            </ul>
            <div>
              <form action={takeDownExperience.bind(null, experience.id)}>
                <button type="submit">Take Down</button>
              </form>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
