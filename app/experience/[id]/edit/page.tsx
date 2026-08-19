import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { publishExperience } from "./actions";
import { AddRoundForm, RoundCard } from "./round-editor";
import EditableSummary from "./editable-summary";
import AddExperienceTimeline from "@/components/AddExperienceTimeline";
import ExperienceHeader from "@/components/ExperienceHeader";

type Props = { params: Promise<{ id: string }> };

export default async function EditExperiencePage({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const experience = await prisma.experience.findUnique({ where: { id }, include: { company: true, rounds: { orderBy: { roundNumber: "asc" } } } });
  if (!experience || experience.authorId !== user.id) notFound();
  const isDraft = experience.status === "draft";

  return (
    <main className="min-h-screen">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:gap-8 sm:px-8 sm:py-14 lg:px-12">
        <nav
          aria-label="Breadcrumb"
          className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground"
        >
          <Link
            href="/"
            className="hover:text-foreground"
          >
            Home
          </Link>
          <span aria-hidden="true">›</span>
          <Link
            href="/experience/new"
            className="hover:text-foreground"
          >
            Share experience
          </Link>
          <span aria-hidden="true">›</span>
          <span className="font-medium text-primary">Complete experience</span>
        </nav>
        <header className="flex flex-col gap-1">
          <h1 className="text-[2rem] font-semibold tracking-[-0.045em] sm:text-5xl">Add your interview rounds</h1>
          <p className="text-[1.05rem] leading-7 text-muted-foreground sm:text-lg">Tell the next student what actually happened during each round.</p>
        </header>

        <AddExperienceTimeline active={2} />

        <section className="flex flex-col gap-5 rounded-xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="min-w-0">
            <ExperienceHeader experience={experience} />
          </div>
          <Link
            href="/experience/new"
            className="order-last inline-flex min-h-10 w-full items-center justify-center rounded-md border border-input px-4 py-2 text-center text-sm font-medium hover:bg-muted sm:order-none sm:w-auto"
          >
            Edit interview details
          </Link>
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
          {isDraft && <AddRoundForm experienceId={experience.id} />}
        </section>

        <EditableSummary
          experience={{
            id: experience.id,
            overallTips: experience.overallTips,
            isAnonymous: experience.isAnonymous,
            status: experience.status,
          }}
        />
        {isDraft && (
          <section className="flex flex-col gap-4 rounded-xl border border-border bg-card p-4 shadow-sm sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div>
              <h2 className="text-xl font-semibold">Ready to share?</h2>
              <p className="mt-1 max-w-xl text-sm leading-6 text-muted-foreground">Make sure your interview rounds and details are accurate before publishing.</p>
            </div>
            <form
              action={publishExperience.bind(null, experience.id)}
              className="w-full sm:w-auto"
            >
              <button
                type="submit"
                disabled={!experience.rounds.length}
                className="min-h-11 w-full rounded-md bg-primary px-5 py-3 font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
              >
                Publish experience
              </button>
            </form>
          </section>
        )}
        {!isDraft && <p className="text-sm text-muted-foreground">This experience is published and can no longer be edited.</p>}
      </div>
    </main>
  );
}
