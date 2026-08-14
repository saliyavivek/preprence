import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { createRound, deleteRound, publishExperience, updateRound } from "./actions";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditExperiencePage({ params }: Props) {
  const { id } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const experience = await prisma.experience.findUnique({
    where: {
      id,
    },
    include: {
      company: true,
      rounds: true,
    },
  });

  if (!experience) {
    notFound();
  }

  // Important: don't allow users to edit someone else's experience.
  if (experience.authorId !== user.id) {
    notFound();
  }

  return (
    <main>
      <h1>Edit Interview Experience</h1>

      <p>Company: {experience.company.name}</p>
      <p>Degree: {experience.degree}</p>
      <p>Graduation Year: {experience.graduationYear}</p>
      <p>Role: {experience.roleTitle}</p>
      <p>Status: {experience.status}</p>

      <hr />

      <section>
        <h2>Interview Rounds</h2>

        {experience.status === "draft" ? (
          <>
            {experience.rounds.length === 0 ? (
              <p>No interview rounds added yet.</p>
            ) : (
              experience.rounds.map((round) => (
                <article key={round.id}>
                  <h3>Round {round.roundNumber}</h3>

                  <form action={updateRound.bind(null, experience.id, round.id)}>
                    <div>
                      <label htmlFor={`roundType-${round.id}`}>Round Type</label>

                      <select
                        id={`roundType-${round.id}`}
                        name="roundType"
                        defaultValue={round.roundType}
                        required
                      >
                        <option value="aptitude">Aptitude</option>
                        <option value="online_assessment">Online Assessment</option>
                        <option value="coding">Coding</option>
                        <option value="technical">Technical</option>
                        <option value="managerial">Managerial</option>
                        <option value="hr">HR</option>
                        <option value="other">Other</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor={`difficulty-${round.id}`}>Difficulty</label>

                      <select
                        id={`difficulty-${round.id}`}
                        name="difficulty"
                        defaultValue={round.difficulty ?? ""}
                      >
                        <option value="">Not specified</option>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor={`questions-${round.id}`}>Questions Asked</label>

                      <textarea
                        id={`questions-${round.id}`}
                        name="questionsAsked"
                        defaultValue={round.questionsAsked ?? ""}
                      />
                    </div>

                    <div>
                      <label htmlFor={`duration-${round.id}`}>Duration</label>

                      <input
                        id={`duration-${round.id}`}
                        name="durationMinutes"
                        type="number"
                        min="1"
                        defaultValue={round.durationMinutes ?? ""}
                      />
                    </div>

                    <button type="submit">Save Changes</button>
                  </form>

                  <form action={deleteRound.bind(null, experience.id, round.id)}>
                    <button type="submit">Delete Round</button>
                  </form>
                </article>
              ))
            )}

            <hr />

            <h3>Add Round</h3>

            <form action={createRound.bind(null, experience.id)}>
              <div>
                <label htmlFor="roundType">Round Type</label>

                <select
                  id="roundType"
                  name="roundType"
                  required
                >
                  <option value="">Select round type</option>
                  <option value="aptitude">Aptitude</option>
                  <option value="online_assessment">Online Assessment</option>
                  <option value="coding">Coding</option>
                  <option value="technical">Technical</option>
                  <option value="managerial">Managerial</option>
                  <option value="hr">HR</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="difficulty">Difficulty</label>

                <select
                  id="difficulty"
                  name="difficulty"
                >
                  <option value="">Not specified</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>

              <div>
                <label htmlFor="questionsAsked">Questions Asked</label>

                <textarea
                  id="questionsAsked"
                  name="questionsAsked"
                  placeholder="What questions were asked?"
                />
              </div>

              <div>
                <label htmlFor="durationMinutes">Duration (minutes)</label>

                <input
                  id="durationMinutes"
                  name="durationMinutes"
                  type="number"
                  min="1"
                  placeholder="45"
                />
              </div>

              <button type="submit">Add Round</button>
            </form>
          </>
        ) : (
          // For non-draft statuses (published) show rounds read-only
          <>
            {experience.rounds.length === 0 ? (
              <p>No interview rounds added yet.</p>
            ) : (
              experience.rounds.map((round) => (
                <article key={round.id}>
                  <h3>Round {round.roundNumber}</h3>
                  <p>Type: {round.roundType}</p>
                  {round.difficulty && <p>Difficulty: {round.difficulty}</p>}
                  {round.questionsAsked && <p>Questions: {round.questionsAsked}</p>}
                  {round.durationMinutes && <p>Duration: {round.durationMinutes} minutes</p>}
                </article>
              ))
            )}
          </>
        )}
      </section>

      {experience.status === "draft" && (
        <form action={publishExperience.bind(null, experience.id)}>
          <button
            type="submit"
            disabled={experience.rounds.length === 0}
          >
            Publish
          </button>
        </form>
      )}
    </main>
  );
}
