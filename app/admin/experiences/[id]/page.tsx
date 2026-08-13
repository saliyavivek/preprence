import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth/admin";
import { publishExperience, rejectExperience } from "./actions";

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
        },
      },
      rounds: {
        orderBy: {
          roundNumber: "asc",
        },
      },
    },
  });

  if (!experience) {
    notFound();
  }

  if (experience.status !== "pending_review") {
    notFound();
  }

  return (
    <main>
      <h1>Review Experience</h1>

      <section>
        <h2>Basic Information</h2>

        <p>Company: {experience.company.name}</p>
        <p>Degree: {experience.degree}</p>
        <p>Graduation Year: {experience.graduationYear}</p>
        <p>Role: {experience.roleTitle}</p>
        <p>Interview Date: {experience.interviewDate.toLocaleDateString()}</p>
        <p>Verdict: {experience.verdict ?? "Not provided"}</p>

        <p>Author: {experience.isAnonymous ? "Anonymous" : (experience.author.name ?? experience.author.email)}</p>
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

      <div>
        <form action={publishExperience.bind(null, experience.id)}>
          <button type="submit">Publish</button>
        </form>

        <form action={rejectExperience.bind(null, experience.id)}>
          <button type="submit">Reject</button>
        </form>
      </div>
    </main>
  );
}
