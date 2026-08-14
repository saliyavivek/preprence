import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ExperiencePage({ params }: Props) {
  const { id } = await params;

  const experience = await prisma.experience.findFirst({
    where: {
      id,
      status: "published",
    },
    include: {
      company: true,
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

  return (
    <main>
      <header>
        <h1>{experience.company.name}</h1>

        <p>
          {experience.degree} · {experience.roleTitle}
        </p>

        <p>Graduation Year: {experience.graduationYear}</p>

        <p>Interview Date: {experience.interviewDate.toLocaleDateString()}</p>

        {experience.verdict && <p>Verdict: {experience.verdict}</p>}
      </header>

      <section>
        <h2>Interview Rounds</h2>

        {experience.rounds.map((round) => (
          <article key={round.id}>
            <h3>Round {round.roundNumber}</h3>

            <p>Type: {round.roundType}</p>

            {round.difficulty && <p>Difficulty: {round.difficulty}</p>}

            {round.durationMinutes && <p>Duration: {round.durationMinutes} minutes</p>}

            {round.questionsAsked && (
              <div>
                <h4>Questions Asked</h4>
                <p>{round.questionsAsked}</p>
              </div>
            )}
          </article>
        ))}
      </section>

      <section>
        <h2>Overall Tips</h2>

        {experience.overallTips ? <p>{experience.overallTips}</p> : <p>No tips provided.</p>}
      </section>

      <button>Report</button>
    </main>
  );
}
