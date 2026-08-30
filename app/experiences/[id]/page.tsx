import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ReportButton } from "./report-button";
import ExperienceHeader from "@/components/ExperienceHeader";
import { DeleteConfirmationModal } from "@/components/DeleteConfirmationModal";
import { VerdictBadge } from "@/components/VerdictBadge";
import { createClient } from "@/lib/supabase/server";
import { deleteExperience } from "./actions";
import { HugeiconsIcon } from "@hugeicons/react";
import { ChartNoAxesColumnIcon, Clock01Icon, Edit03Icon, QuoteUpIcon } from "@hugeicons/core-free-icons";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import Link from "next/link";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

function formatVerdict(verdict: string | null) {
  return verdict ? verdict.replaceAll("_", " ") : null;
}

// Helper function to format round types (e.g., "online_assessment" -> "Online Assessment")
function formatRoundType(type: string) {
  if (type.toLowerCase() === "hr") return "HR";

  return type
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function RoundSummary({ round, index }: { round: ExperienceRound; index: number }) {
  return (
    <div className="flex w-full flex-col justify-between gap-4 rounded-xl border border-border bg-card px-4 py-4 shadow-sm sm:gap-5 sm:px-5">
      <div className="flex items-center gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-primary/10 text-lg font-semibold text-[#1d7f7b]">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="min-w-0 text-[1.1rem] font-semibold leading-6 text-foreground sm:text-[1.1rem]">{formatRoundType(round.roundType)}</h3>
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted-foreground sm:text-base">
        <span className="flex items-center gap-1">
          <HugeiconsIcon
            icon={Clock01Icon}
            className="w-4 h-4"
          />
          {round.durationMinutes ? `${round.durationMinutes} min` : "—"}
        </span>
        <span
          aria-hidden="true"
          className="text-border sm:inline"
        >
          |
        </span>
        <span className="capitalize flex items-center gap-1">
          <HugeiconsIcon
            icon={ChartNoAxesColumnIcon}
            className="w-4 h-4"
          />
          {round.difficulty ? round.difficulty.toLowerCase() : "Not provided"}
        </span>
      </div>
    </div>
  );
}

function RoundDetail({ round, isLast = false }: { round: ExperienceRound; isLast?: boolean }) {
  return (
    <article className="relative grid gap-4 sm:grid-cols-[3.5rem_minmax(0,1fr)] sm:gap-5">
      <div className="relative flex items-start justify-start sm:justify-center">
        <span className="z-10 flex size-10 items-center justify-center rounded-full border  bg-primary/10 border-primary text-sm font-semibold text-primary">
          {String(round.roundNumber).padStart(2, "0")}
        </span>
        {!isLast && (
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-10 hidden h-[calc(100%-1.5rem)] w-px -translate-x-1/2 bg-border sm:block"
          />
        )}
      </div>
      <div className="rounded-lg border border-border bg-card shadow-sm">
        <div className="flex items-start gap-4 rounded-t-lg bg-primary/10 px-4 py-3 sm:px-6">
          <h3 className="w-full text-lg font-semibold tracking-tight text-foreground">{formatRoundType(round.roundType)}</h3>
        </div>
        <dl className="mx-4 mt-5 grid gap-3 border-b border-border pb-5 sm:mx-6 sm:grid-cols-3 sm:gap-0">
          <div>
            <dt className="text-sm text-muted-foreground">Difficulty</dt>
            <dd className="mt-1 text-md font-medium capitalize">{round.difficulty?.toLowerCase() ?? "Not provided"}</dd>
          </div>
          <div>
            <dt className="text-sm text-muted-foreground">Duration</dt>
            <dd className="mt-1 text-md font-medium">{round.durationMinutes ? `${round.durationMinutes} minutes` : "Not provided"}</dd>
          </div>
        </dl>
        {round.questionsAsked && (
          <div className="mx-4 flex flex-col gap-1 pb-4 pt-4 sm:mx-6 sm:pb-6">
            <h4 className="text-sm font-semibold">Questions asked</h4>
            <p className="whitespace-pre-line text-md leading-6 text-foreground">{round.questionsAsked}</p>
          </div>
        )}
      </div>
    </article>
  );
}

type ExperienceRound = {
  id: string;
  roundNumber: number;
  roundType: string;
  difficulty: string | null;
  durationMinutes: number | null;
  questionsAsked: string | null;
};

export default async function ExperiencePage({ params }: Props) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { id } = await params;
  const experience = await prisma.experience.findFirst({
    where: { id, status: "published" },
    include: { company: true, rounds: { orderBy: { roundNumber: "asc" } }, role: true, experienceSkills: { include: { skill: true } } },
  });

  if (!experience) notFound();

  const author = experience.isAnonymous
    ? null
    : await prisma.user.findUnique({
        where: { id: experience.authorId },
        select: { name: true, email: true },
      });

  const verdict = formatVerdict(experience.verdict);

  return (
    <main>
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 sm:gap-10 sm:px-8 sm:py-16 lg:px-10">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Interview experiences", href: "/experiences" }, { label: experience.company.name }]} />
        <section className="flex flex-col gap-5 border-b border-border pb-7 sm:flex-row sm:items-start sm:justify-between">
          <ExperienceHeader experience={{ ...experience, author }} />
          {verdict && (
            <div className="hidden sm:flex shrink-0 sm:px-4 sm:py-3">
              <VerdictBadge verdict={verdict} />
            </div>
          )}
        </section>

        <section className="flex flex-col gap-5 border-b border-border pb-8">
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-foreground">Interview process</h2>

          <div className="scrollbar-none flex w-full overflow-x-auto pb-4 pt-2 [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex items-center gap-3">
              {experience.rounds.map((round, index) => (
                <div
                  key={round.id}
                  className="flex shrink-0 items-center gap-3"
                >
                  <div className="w-64 sm:w-68">
                    <RoundSummary
                      round={round}
                      index={index}
                    />
                  </div>
                  {index < experience.rounds.length - 1 && (
                    <span
                      aria-hidden="true"
                      className="h-px w-10 shrink-0 border-t-2 border-dashed border-muted-foreground/40"
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-5">
          <h2 className="text-xl font-semibold tracking-tight">Interview rounds (detailed)</h2>
          <div className="flex flex-col gap-8 sm:gap-4">
            {experience.rounds.map((round, index) => (
              <RoundDetail
                key={round.id}
                round={round}
                isLast={index === experience.rounds.length - 1}
              />
            ))}
          </div>
        </section>

        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold tracking-tight">Overall tips</h2>
          <div className="flex items-start gap-3 rounded-lg border border-primary/15 bg-primary/5 px-4 py-4 sm:gap-4 sm:px-5">
            <HugeiconsIcon
              icon={QuoteUpIcon}
              className="mt-0.5 shrink-0"
            />
            <p className="whitespace-pre-line text-sm leading-6 text-foreground sm:text-base">{experience.overallTips || "No tips provided."}</p>
          </div>
        </section>

        <div className="flex flex-col gap-5 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">Published on {experience.createdAt.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}</p>

          {user?.id === experience.authorId ? (
            <div className="flex items-center gap-2">
              <Link
                href={`/experience/${experience.id}/edit`}
                className="inline-flex flex-1 w-full items-center justify-center gap-2 rounded-md bg-primary hover:bg-primary/90 px-3 py-2 text-sm font-medium text-primary-foreground sm:w-auto"
              >
                <HugeiconsIcon
                  icon={Edit03Icon}
                  size="100%"
                  className="w-4 h-4"
                />
                Edit
              </Link>
              <div className="w-full sm:w-auto">
                <DeleteConfirmationModal action={deleteExperience.bind(null, experience.id, user.id)} />
              </div>
            </div>
          ) : (
            <ReportButton experienceId={experience.id} />
          )}
        </div>
      </div>
    </main>
  );
}
