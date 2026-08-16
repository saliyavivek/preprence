import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ReportButton } from "./report-button";

function ExperienceCompanyLogo({ name, logoUrl }: { name: string; logoUrl: string | null }) {
  const initials = name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 3)
    .toUpperCase();

  return (
    <div className="flex h-[134px] w-[134px] shrink-0 items-center justify-center overflow-hidden rounded-xl border-[3px] bg-card">
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={`${name} logo`}
          className="h-full w-full object-contain p-3"
        />
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#ffffff] via-[#f7f7f7] to-[#ececec] text-[3.2rem] font-black tracking-[-0.12em] text-foreground">
          <span className="translate-y-0.5">{initials}</span>
        </div>
      )}
    </div>
  );
}

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
    <div className="flex w-full flex-col justify-between gap-5 rounded-xl border border-border bg-card px-5 py-4 shadow-sm">
      <div className="flex items-center gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full border-[2px] border-[#8ed8d7] bg-[#eaf9f8] text-lg font-semibold text-[#1d7f7b]">
          {String(index + 1).padStart(2, "0")}
        </span>
        <h3 className="min-w-0 text-[1.1rem] font-semibold leading-6 text-foreground sm:text-[1.1rem]">{formatRoundType(round.roundType)}</h3>
      </div>

      <div className="flex items-center gap-3 text-base text-muted-foreground">
        <span>{round.durationMinutes ? `${round.durationMinutes} min` : "—"}</span>
        <span
          aria-hidden="true"
          className="text-border"
        >
          |
        </span>
        <span className="capitalize">{round.difficulty ? round.difficulty.toLowerCase() : "Not provided"}</span>
      </div>
    </div>
  );
}

function RoundDetail({ round, isLast = false }: { round: ExperienceRound; isLast?: boolean }) {
  return (
    <article className="relative grid gap-4 sm:grid-cols-[3.5rem_minmax(0,1fr)] sm:gap-5">
      <div className="relative flex items-start justify-center">
        <span className="z-10 flex size-10 items-center justify-center rounded-full border border-primary/30 bg-background text-sm font-semibold text-primary">
          {String(round.roundNumber).padStart(2, "0")}
        </span>
        {!isLast && (
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-10 hidden h-[calc(100%-1.5rem)] w-px -translate-x-1/2 bg-border sm:block"
          />
        )}
      </div>
      <div className="rounded-lg border border-border bg-card p-5 shadow-sm sm:p-6">
        <div className="flex items-start gap-4">
          <h3 className="text-lg font-semibold tracking-tight text-foreground">{formatRoundType(round.roundType)}</h3>
        </div>
        <dl className="mt-5 grid border-b border-border pb-5 sm:grid-cols-3">
          <div>
            <dt className="text-xs text-muted-foreground">Type</dt>
            <dd className="mt-1 text-sm font-medium capitalize">{formatRoundType(round.roundType)}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Difficulty</dt>
            <dd className="mt-1 text-sm font-medium capitalize">{round.difficulty?.toLowerCase() ?? "Not provided"}</dd>
          </div>
          <div>
            <dt className="text-xs text-muted-foreground">Duration</dt>
            <dd className="mt-1 text-sm font-medium">{round.durationMinutes ? `${round.durationMinutes} minutes` : "Not provided"}</dd>
          </div>
        </dl>
        {round.questionsAsked && (
          <div className="flex flex-col gap-1 pt-4">
            <h4 className="text-sm font-semibold">Questions asked</h4>
            <p className="whitespace-pre-line text-sm leading-6 text-foreground">{round.questionsAsked}</p>
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
  const { id } = await params;
  const experience = await prisma.experience.findFirst({
    where: { id, status: "published" },
    include: { company: true, rounds: { orderBy: { roundNumber: "asc" } } },
  });

  if (!experience) notFound();

  const verdict = formatVerdict(experience.verdict);
  const interviewDate = experience.interviewDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  return (
    <main>
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:px-10">
        <section className="flex justify-between items-start border-b border-border pb-7">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:gap-6">
            <ExperienceCompanyLogo
              name={experience.company.name}
              logoUrl={experience.company.logoUrl}
            />
            <div className="flex min-w-0 flex-1 flex-col gap-2">
              <h1 className="text-2xl font-semibold tracking-[-0.045em] text-foreground sm:text-3xl lg:text-[2rem]">{experience.company.name}</h1>
              <p className="text-lg text-muted-foreground sm:text-[1.35rem] sm:leading-tight">{experience.roleTitle}</p>
              <div className="mt-1 flex flex-wrap gap-2 text-sm text-muted-foreground">
                <span className="rounded-md border border-border px-2 py-1">{experience.degree}</span>
                <span className="rounded-md border border-border px-2 py-1">Batch of {experience.graduationYear}</span>
                <span className="rounded-md border border-border px-2 py-1">Interviewed in {interviewDate}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-4 rounded-xl py-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col border border-border rounded-md px-4 py-3">
              {verdict && (
                <span className="inline-flex items-center gap-2 rounded-md  text-sm font-semibold text-emerald-600">
                  <span
                    aria-hidden="true"
                    className="text-base leading-none"
                  >
                    ✓
                  </span>
                  {verdict}
                </span>
              )}
              <p className="text-sm text-muted-foreground">Shared by a student from your college</p>
            </div>
          </div>
        </section>

        <section className="flex flex-col gap-5 border-b border-border pb-8">
          <h2 className="text-2xl font-semibold tracking-[-0.03em] text-foreground">Interview process</h2>

          <div className="flex w-full overflow-x-auto pb-4 pt-2 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <div className="flex items-center gap-3">
              {experience.rounds.map((round, index) => (
                <div
                  key={round.id}
                  className="flex shrink-0 items-center gap-3"
                >
                  <div className="w-[270px]">
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
          <div className="flex flex-col gap-4">
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
          <div className="rounded-lg border border-primary/15 bg-primary/5 px-5 py-4">
            <p className="whitespace-pre-line text-sm leading-6 text-foreground">{experience.overallTips || "No tips provided."}</p>
          </div>
        </section>

        <div className="flex flex-col gap-5 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-muted-foreground">Published on {experience.createdAt.toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}</p>
          <ReportButton experienceId={experience.id} />
        </div>
      </div>
    </main>
  );
}
