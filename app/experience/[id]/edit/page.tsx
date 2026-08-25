import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { publishExperience } from "./actions";
import { AddRoundForm, RoundCard } from "./round-editor";
import EditableSummary from "./editable-summary";
import AddExperienceTimeline from "@/components/AddExperienceTimeline";
import ExperienceHeader from "@/components/ExperienceHeader";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { PublishButton } from "@/components/PublishButton";

type Props = { params: Promise<{ id: string }> };

export default async function EditExperiencePage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(`/experience/${id}/edit`)}`);

  const experience = await prisma.experience.findUnique({ where: { id }, include: { company: true, rounds: { orderBy: { roundNumber: "asc" } } } });
  if (!experience || experience.authorId !== user.id) notFound();
  const isDraft = experience.status === "draft";

  return (
    <main className="min-h-screen">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:gap-8 sm:px-8 sm:py-14 lg:px-12">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Share experience", href: "/experience/new" }, { label: "Complete experience" }]} />
        <header className="flex flex-col gap-1">
          <h1 className="text-[2rem] font-semibold tracking-[-0.045em] sm:text-5xl">{isDraft ? "Add your interview rounds" : "Edit your interview rounds"}</h1>
          <p className="text-[1.05rem] leading-7 text-muted-foreground sm:text-lg">Tell the next student what actually happened during each round.</p>
        </header>

        <AddExperienceTimeline active={2} />

        <section className="flex flex-col gap-5 rounded-xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="min-w-0">
            <ExperienceHeader experience={experience} />
          </div>
        </section>

        <section className="flex flex-col gap-5">
          <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight">Interview rounds</h2>
              <p className="mt-1 text-sm text-muted-foreground">Add the rounds you went through in the order they happened.</p>
            </div>
            <p className="text-sm leading-6 text-muted-foreground sm:text-right">You can add, edit, or remove rounds before publishing.</p>
          </div>
          {experience.rounds.length ? (
            <div className="flex flex-col gap-3">
              {experience.rounds.map((round) => (
                <RoundCard
                  key={round.id}
                  experienceId={experience.id}
                  round={round}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">No rounds yet. Add your first round below.</div>
          )}
          <AddRoundForm experienceId={experience.id} />
        </section>

        <EditableSummary
          experience={{
            id: experience.id,
            overallTips: experience.overallTips,
            isAnonymous: experience.isAnonymous,
            status: experience.status,
          }}
        />

        <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div>
            <h2 className="text-xl font-semibold">{isDraft ? "Ready to share?" : "Done editing?"}</h2>
            <p className="mt-1 max-w-xl text-sm leading-6 text-muted-foreground">
              {isDraft ? "Make sure your interview rounds and details are accurate before publishing." : "Review your changes and finalize the update."}
            </p>
          </div>
          <form
            action={publishExperience.bind(null, experience.id)}
            className="w-full sm:w-auto"
          >
            <PublishButton
              disabled={!experience.rounds.length}
              isDraft={isDraft}
            />
          </form>
        </section>
      </div>
    </main>
  );
}
