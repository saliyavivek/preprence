"use client";

import { useState } from "react";
import { createRound, deleteRound, updateRound } from "./actions";
import { HugeiconsIcon } from "@hugeicons/react";
import { ChartNoAxesColumnIcon, Clock01Icon } from "@hugeicons/core-free-icons";

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
  const [isEditing, setIsEditing] = useState(false);
  const [roundType, setRoundType] = useState(round.roundType);
  const [difficulty, setDifficulty] = useState(round.difficulty ?? "");
  const [durationMinutes, setDurationMinutes] = useState(round.durationMinutes ?? "");
  const [questionsAsked, setQuestionsAsked] = useState(round.questionsAsked ?? "");

  if (isEditing) {
    return (
      <article className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6">
        <form
          action={updateRound.bind(null, experienceId, round.id)}
          className="space-y-4"
        >
          <label className="flex flex-col gap-1 text-sm font-medium">
            Round type
            <select
              name="roundType"
              value={roundType}
              onChange={(e) => setRoundType(e.target.value)}
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
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="min-h-10 rounded-md border border-input bg-card px-3 font-normal"
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
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
              className="min-h-10 rounded-md border border-input bg-card px-3 font-normal"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium">
            Questions asked
            <textarea
              name="questionsAsked"
              value={questionsAsked}
              onChange={(e) => setQuestionsAsked(e.target.value)}
              rows={4}
              className="rounded-md border border-input bg-card px-3 py-2 font-normal"
            />
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              className="min-h-10 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground sm:w-fit"
            >
              Save changes
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="min-h-10 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-muted sm:w-fit"
            >
              Cancel
            </button>
          </div>
        </form>
      </article>
    );
  }

  return (
    <article className="rounded-xl border border-border bg-card p-4 shadow-sm sm:p-6">
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 gap-4">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-full border border-primary/30 bg-primary/5 text-sm font-semibold text-primary">
            {String(round.roundNumber).padStart(2, "0")}
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-semibold tracking-tight">{roundLabels[round.roundType] ?? round.roundType}</h3>
            <div className="mt-3 flex flex-wrap gap-2 text-sm text-muted-foreground">
              {round.difficulty && (
                <span className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1">
                  <HugeiconsIcon
                    icon={ChartNoAxesColumnIcon}
                    className="w-4 h-4"
                  />
                  {difficultyLabels[round.difficulty] ?? round.difficulty}
                </span>
              )}
              {round.durationMinutes && (
                <span className="inline-flex items-center gap-1 rounded-full border border-border px-3 py-1">
                  <HugeiconsIcon
                    icon={Clock01Icon}
                    className="h-4 w-4"
                  />
                  {round.durationMinutes} min
                </span>
              )}
            </div>
            {round.questionsAsked && (
              <div className="pt-4 text-sm leading-6 text-muted-foreground">
                <p className="mb-1 font-semibold text-foreground">Questions asked</p>
                <p className="whitespace-pre-line">{round.questionsAsked}</p>
              </div>
            )}
          </div>
        </div>
        <div className="flex w-full gap-2 sm:w-auto sm:pt-1">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="min-h-10 flex-1 rounded-md border border-input px-3 py-2 text-sm font-medium text-foreground hover:bg-muted sm:flex-none"
          >
            Edit round
          </button>
          <form action={deleteRound.bind(null, experienceId, round.id)}>
            <button
              type="submit"
              className="min-h-10 w-full rounded-md border border-destructive/40 px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/5 sm:w-auto"
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
  const [isAdding, setIsAdding] = useState(false);
  const [roundType, setRoundType] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [durationMinutes, setDurationMinutes] = useState("");
  const [questionsAsked, setQuestionsAsked] = useState("");

  if (isAdding) {
    return (
      <div className="rounded-xl border border-dashed border-primary/40 bg-primary/3 p-4 sm:p-5">
        <form
          action={createRound.bind(null, experienceId)}
          className="space-y-4"
        >
          <label className="flex flex-col gap-1 text-sm font-medium">
            Round type
            <select
              name="roundType"
              value={roundType}
              onChange={(e) => setRoundType(e.target.value)}
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
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
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
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
              className="min-h-11 rounded-md border border-input bg-card px-3 font-normal"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm font-medium">
            Questions asked
            <textarea
              name="questionsAsked"
              value={questionsAsked}
              onChange={(e) => setQuestionsAsked(e.target.value)}
              rows={4}
              placeholder="What questions were asked?"
              className="rounded-md border border-input bg-card px-3 py-2 font-normal"
            />
          </label>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="submit"
              className="min-h-11 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground sm:w-fit"
            >
              Add round
            </button>
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="min-h-11 rounded-md border border-input bg-background px-5 py-3 text-sm font-medium text-foreground hover:bg-muted sm:w-fit"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setIsAdding(true)}
      className="w-full rounded-xl border border-dashed border-primary/40 bg-primary/3 p-4 text-left transition-colors hover:bg-primary/8 sm:p-5"
    >
      <div className="flex items-center gap-4 text-primary">
        <span className="flex size-9 items-center justify-center rounded-full border border-primary/40 text-xl">+</span>
        <span>
          <strong className="block">Add another round</strong>
          <span className="text-sm text-muted-foreground">Add the next stage of your interview.</span>
        </span>
      </div>
    </button>
  );
}
