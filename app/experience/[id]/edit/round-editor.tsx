import { createRound, deleteRound, updateRound } from "./actions";

type Round = {
  id: string;
  roundNumber: number;
  roundType: string;
  difficulty: string | null;
  questionsAsked: string | null;
  durationMinutes: number | null;
};

const roundLabels: Record<string, string> = {
  aptitude: "Aptitude",
  online_assessment: "Online Assessment",
  coding: "Coding Interview",
  technical: "Technical Interview",
  managerial: "Managerial Interview",
  hr: "HR Interview",
  other: "Other Round",
};

const difficultyLabels: Record<string, string> = { easy: "Easy", medium: "Medium", hard: "Hard" };

export function RoundCard({ experienceId, round }: { experienceId: string; round: Round }) {
  return (
    <article className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 gap-4">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/5 text-sm font-semibold text-primary">
            {String(round.roundNumber).padStart(2, "0")}
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold tracking-tight">{roundLabels[round.roundType] ?? round.roundType}</h3>
            <div className="mt-3 flex flex-wrap gap-2 text-sm text-muted-foreground">
              {round.difficulty && <span className="rounded-full border border-border px-3 py-1">Difficulty · {difficultyLabels[round.difficulty] ?? round.difficulty}</span>}
              {round.durationMinutes && <span className="rounded-full border border-border px-3 py-1">Duration · {round.durationMinutes} min</span>}
            </div>
            {round.questionsAsked && (
              <div className="pt-4 text-sm leading-6 text-muted-foreground">
                <p className="mb-1 font-semibold text-foreground">Questions asked</p>
                <p className="whitespace-pre-line">{round.questionsAsked}</p>
              </div>
            )}
          </div>
        </div>
        <div className="flex shrink-0 gap-2 sm:pt-1">
          <details className="group">
            <summary className="cursor-pointer list-none rounded-md border border-input px-3 py-2 text-sm font-medium text-foreground hover:bg-muted [&::-webkit-details-marker]:hidden">
              Edit round
            </summary>
            <form
              action={updateRound.bind(null, experienceId, round.id)}
              className="mt-3 flex w-full min-w-64 flex-col gap-3 rounded-lg border border-border bg-background p-4 sm:absolute sm:mr-20 sm:w-72"
            >
              <label className="flex flex-col gap-1 text-sm font-medium">
                Round type
                <select
                  name="roundType"
                  defaultValue={round.roundType}
                  required
                  className="min-h-10 rounded-md border border-input bg-card px-3 font-normal"
                >
                  <option value="aptitude">Aptitude</option>
                  <option value="online_assessment">Online Assessment</option>
                  <option value="coding">Coding</option>
                  <option value="technical">Technical</option>
                  <option value="managerial">Managerial</option>
                  <option value="hr">HR</option>
                  <option value="other">Other</option>
                </select>
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium">
                Difficulty
                <select
                  name="difficulty"
                  defaultValue={round.difficulty ?? ""}
                  className="min-h-10 rounded-md border border-input bg-card px-3 font-normal"
                >
                  <option value="">Not specified</option>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium">
                Duration
                <input
                  name="durationMinutes"
                  type="number"
                  min="1"
                  defaultValue={round.durationMinutes ?? ""}
                  className="min-h-10 rounded-md border border-input bg-card px-3 font-normal"
                />
              </label>
              <label className="flex flex-col gap-1 text-sm font-medium">
                Questions asked
                <textarea
                  name="questionsAsked"
                  defaultValue={round.questionsAsked ?? ""}
                  rows={4}
                  className="rounded-md border border-input bg-card px-3 py-2 font-normal"
                />
              </label>
              <button
                type="submit"
                className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground"
              >
                Save changes
              </button>
            </form>
          </details>
          <form action={deleteRound.bind(null, experienceId, round.id)}>
            <button
              type="submit"
              className="rounded-md border border-destructive/40 px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/5"
            >
              Delete
            </button>
          </form>
        </div>
      </div>
    </article>
  );
}

export function AddRoundForm({ experienceId }: { experienceId: string }) {
  return (
    <details className="rounded-xl border border-dashed border-primary/40 bg-primary/[0.03] p-5">
      <summary className="flex cursor-pointer list-none items-center gap-4 text-primary [&::-webkit-details-marker]:hidden">
        <span className="flex size-9 items-center justify-center rounded-full border border-primary/40 text-xl">+</span>
        <span>
          <strong className="block">Add another round</strong>
          <span className="text-sm text-muted-foreground">Add the next stage of your interview.</span>
        </span>
      </summary>
      <form
        action={createRound.bind(null, experienceId)}
        className="mt-5 grid gap-4 border-t border-border pt-5 sm:grid-cols-2"
      >
        <label className="flex flex-col gap-1 text-sm font-medium">
          Round type
          <select
            name="roundType"
            required
            className="min-h-11 rounded-md border border-input bg-card px-3 font-normal"
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
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Difficulty
          <select
            name="difficulty"
            className="min-h-11 rounded-md border border-input bg-card px-3 font-normal"
          >
            <option value="">Not specified</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium">
          Duration (minutes)
          <input
            name="durationMinutes"
            type="number"
            min="1"
            placeholder="45"
            className="min-h-11 rounded-md border border-input bg-card px-3 font-normal"
          />
        </label>
        <label className="flex flex-col gap-1 text-sm font-medium sm:col-span-2">
          Questions asked
          <textarea
            name="questionsAsked"
            rows={4}
            placeholder="What questions were asked?"
            className="rounded-md border border-input bg-card px-3 py-2 font-normal"
          />
        </label>
        <button
          type="submit"
          className="w-fit rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground"
        >
          Add round
        </button>
      </form>
    </details>
  );
}
