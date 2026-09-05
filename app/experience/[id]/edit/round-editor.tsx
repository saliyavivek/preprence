"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import dynamic from "next/dynamic";
import ReactMarkdown from "react-markdown";
import { commands } from "@uiw/react-md-editor";
import { createRound, deleteRound, updateRound } from "./actions";
import { HugeiconsIcon } from "@hugeicons/react";
import { ChartNoAxesColumnIcon, Clock01Icon, TextBoldIcon, TextItalicIcon, Heading01Icon, LeftToRightListBulletIcon, LeftToRightListNumberIcon } from "@hugeicons/core-free-icons";
import { DeleteConfirmationModal } from "@/components/DeleteConfirmationModal"; // Adjust path if needed

// Dynamically import MDEditor with SSR disabled for Next.js App Router
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

// 1. Override the default icons with Hugeicons and increase their size
const customTitle = {
  ...commands.title,
  icon: (
    <HugeiconsIcon
      icon={Heading01Icon}
      className="h-5 w-5"
    />
  ),
};
const customBold = {
  ...commands.bold,
  icon: (
    <HugeiconsIcon
      icon={TextBoldIcon}
      className="h-5 w-5"
    />
  ),
};
const customItalic = {
  ...commands.italic,
  icon: (
    <HugeiconsIcon
      icon={TextItalicIcon}
      className="h-5 w-5"
    />
  ),
};

// Override the execute method to prevent auto-selecting the space after the bullet
const customUnorderedList = {
  ...commands.unorderedListCommand,
  icon: (
    <HugeiconsIcon
      icon={LeftToRightListBulletIcon}
      className="h-5 w-5"
    />
  ),
  execute: (state: any, api: any) => {
    if (!state.selectedText) {
      api.replaceSelection("- ");
    } else {
      const lines = state.selectedText.split("\n");
      const listLines = lines.map((line: string) => `- ${line}`);
      api.replaceSelection(listLines.join("\n"));
    }
  },
};
const customOrderedList = {
  ...commands.orderedListCommand,
  icon: (
    <HugeiconsIcon
      icon={LeftToRightListNumberIcon}
      className="h-5 w-5"
    />
  ),
  execute: (state: any, api: any) => {
    if (!state.selectedText) {
      api.replaceSelection("1. ");
    } else {
      const lines = state.selectedText.split("\n");
      const listLines = lines.map((line: string, index: number) => `${index + 1}. ${line}`);
      api.replaceSelection(listLines.join("\n"));
    }
  },
};

// 2. Specify only the requested toolbar commands
const editorCommands = [customTitle, customBold, customItalic, commands.divider, customUnorderedList, customOrderedList];

// 3. Custom Tailwind wrapper to handle the mobile stacked layout & toolbar spacing safely
const editorWrapperClasses =
  "font-normal w-full overflow-hidden rounded-md border border-input bg-white/60 [&_.w-md-editor]:!shadow-none [&_.w-md-editor-toolbar]:!flex [&_.w-md-editor-toolbar]:!items-center [&_.w-md-editor-toolbar]:!gap-1 [&_.w-md-editor-toolbar]:!min-h-11 [&_.w-md-editor-toolbar]:!h-11 [&_.w-md-editor-toolbar]:!px-1.5 [&_.w-md-editor-toolbar]:!py-1 [&_.w-md-editor-toolbar_ul]:!m-0 [&_.w-md-editor-toolbar_ul]:!flex [&_.w-md-editor-toolbar_ul]:!items-center [&_.w-md-editor-toolbar_ul]:!gap-0.5 [&_.w-md-editor-toolbar_li]:!m-0 [&_.w-md-editor-toolbar_li]:!flex [&_.w-md-editor-toolbar_li]:!items-center [&_.w-md-editor-toolbar_li>button]:!m-0 [&_.w-md-editor-toolbar_li>button]:!flex [&_.w-md-editor-toolbar_li>button]:!h-9 [&_.w-md-editor-toolbar_li>button]:!w-9 [&_.w-md-editor-toolbar_li>button]:!items-center [&_.w-md-editor-toolbar_li>button]:!justify-center [&_.w-md-editor-toolbar_li>button]:!p-0";

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

function UpdateRoundSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="min-h-10 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground sm:w-fit disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Updating..." : "Save changes"}
    </button>
  );
}

export function RoundCard({ experienceId, round }: { experienceId: string; round: Round }) {
  const [isEditing, setIsEditing] = useState(false);
  const [roundType, setRoundType] = useState(round.roundType);
  const [difficulty, setDifficulty] = useState(round.difficulty ?? "");
  const [durationMinutes, setDurationMinutes] = useState(round.durationMinutes ?? "");
  const [questionsAsked, setQuestionsAsked] = useState(round.questionsAsked ?? "");

  if (isEditing) {
    return (
      <article className="rounded-xl border border-border bg-white/60 p-4 shadow-sm sm:p-6">
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
              className="min-h-10 rounded-md border border-input bg-white/60 px-3 font-normal"
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
              className="min-h-10 rounded-md border border-input bg-white/60 px-3 font-normal"
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
              className="min-h-10 rounded-md border border-input bg-white/60 px-3 font-normal"
            />
          </label>

          <div className="flex flex-col gap-1 text-sm font-medium">
            <span className="mb-1 block">Questions asked</span>
            <input
              type="hidden"
              name="questionsAsked"
              value={questionsAsked}
            />
            <div
              data-color-mode="light"
              className={`${editorWrapperClasses} questions-markdown-editor`}
            >
              <div className="w-full min-w-0">
                <MDEditor
                  value={questionsAsked}
                  onChange={(val) => setQuestionsAsked(val || "")}
                  commands={editorCommands}
                  extraCommands={[]}
                  height={550}
                  preview="live"
                  className="w-full min-w-0"
                />

                <style
                  jsx
                  global
                >{`
                  /* Counteract Tailwind's preflight resets in the preview pane */
                  .questions-markdown-editor .wmde-markdown strong,
                  .questions-markdown-editor .wmde-markdown b,
                  .questions-markdown-editor .wmde-markdown h1,
                  .questions-markdown-editor .wmde-markdown h2,
                  .questions-markdown-editor .wmde-markdown h3,
                  .questions-markdown-editor .wmde-markdown h4,
                  .questions-markdown-editor .wmde-markdown h5,
                  .questions-markdown-editor .wmde-markdown h6 {
                    font-weight: 600 !important;
                  }

                  /* Restore list styles stripped by Tailwind */
                  .questions-markdown-editor .wmde-markdown ul {
                    list-style-type: disc !important;
                    padding-left: 1.5rem !important;
                  }

                  .questions-markdown-editor .wmde-markdown ol {
                    list-style-type: decimal !important;
                    padding-left: 1.5rem !important;
                  }

                  .questions-markdown-editor .wmde-markdown li {
                    display: list-item !important;
                  }

                  @media (max-width: 639px) {
                    .questions-markdown-editor .w-md-editor {
                      height: 640px !important;
                    }

                    .questions-markdown-editor .w-md-editor-content {
                      height: auto !important;
                      overflow: visible !important;
                    }

                    /* MDEditor's edit pane is .w-md-editor-input, not .w-md-editor-text. */
                    .questions-markdown-editor .w-md-editor-input {
                      width: 100% !important;
                      height: 300px !important;
                      overflow: auto !important;
                    }

                    /* The library positions preview absolutely on desktop.
                       On mobile it must become a normal block below the editor. */
                    .questions-markdown-editor .w-md-editor-preview {
                      position: relative !important;
                      inset: auto !important;
                      width: 100% !important;
                      height: 300px !important;
                      min-height: 300px !important;
                      padding: 16px !important;
                      overflow: auto !important;
                      border-left: 0 !important;
                      border-top: 1px solid var(--md-editor-box-shadow-color) !important;
                      box-shadow: none !important;
                    }

                    .questions-markdown-editor .w-md-editor-bar {
                      display: none !important;
                    }
                  }
                `}</style>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <UpdateRoundSubmitButton />
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
    <article className="rounded-xl border border-border bg-white/60 p-4 shadow-sm sm:p-6">
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
                    className="h-4 w-4"
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
              <div className="pt-5 text-sm leading-6 text-muted-foreground">
                <p className="mb-3 font-semibold text-foreground">Questions asked</p>
                <ReactMarkdown
                  components={{
                    ul: (props) => (
                      <ul
                        className="ml-5 list-disc space-y-1"
                        {...props}
                      />
                    ),
                    ol: (props) => (
                      <ol
                        className="ml-5 list-decimal space-y-1"
                        {...props}
                      />
                    ),
                    li: (props) => (
                      <li
                        className="pl-1"
                        {...props}
                      />
                    ),
                    h1: (props) => (
                      <h1
                        className="mb-2 mt-4 text-xl font-semibold text-foreground"
                        {...props}
                      />
                    ),
                    h2: (props) => (
                      <h2
                        className="mb-2 mt-4 text-lg font-semibold text-foreground"
                        {...props}
                      />
                    ),
                    h3: (props) => (
                      <h3
                        className="mb-2 mt-3 text-base font-semibold text-foreground"
                        {...props}
                      />
                    ),
                    p: (props) => (
                      <p
                        className="whitespace-pre-wrap leading-relaxed"
                        {...props}
                      />
                    ),
                    strong: (props) => (
                      <strong
                        className="font-semibold text-foreground"
                        {...props}
                      />
                    ),
                    em: (props) => (
                      <em
                        className="italic"
                        {...props}
                      />
                    ),
                  }}
                >
                  {round.questionsAsked}
                </ReactMarkdown>
              </div>
            )}
          </div>
        </div>
        <div className="flex w-full shrink-0 gap-2 sm:w-auto sm:pt-1">
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="min-h-10 flex-1 whitespace-nowrap rounded-md border border-input px-3 py-2 text-sm font-medium transition-colors text-foreground hover:bg-primary/8 sm:flex-none"
          >
            Edit round
          </button>
          <DeleteConfirmationModal
            action={deleteRound.bind(null, experienceId, round.id)}
            title="Delete this round?"
            description="This action is permanent. This interview round will be deleted."
            buttonText="Delete round"
            pendingText="Deleting..."
          />
        </div>
      </div>
    </article>
  );
}

function AddRoundSubmitButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="min-h-11 rounded-md bg-primary px-5 py-3 text-sm font-medium text-primary-foreground sm:w-fit disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Adding..." : "Add round"}
    </button>
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
              className="min-h-11 rounded-md border border-input bg-white/60 px-3 font-normal"
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
              className="min-h-11 rounded-md border border-input bg-white/60 px-3 font-normal"
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
              className="min-h-11 rounded-md border border-input bg-white/60 px-3 font-normal"
            />
          </label>

          <div className="flex flex-col gap-1 text-sm font-medium">
            <span className="block text-base">Questions asked</span>
            <span className="mb-2 block font-normal text-muted-foreground">Add the questions that were asked in this round.</span>
            <input
              type="hidden"
              name="questionsAsked"
              value={questionsAsked}
            />
            <div
              data-color-mode="light"
              className={`${editorWrapperClasses} questions-markdown-editor`}
            >
              <div className="w-full min-w-0">
                <MDEditor
                  value={questionsAsked}
                  onChange={(val) => setQuestionsAsked(val || "")}
                  commands={editorCommands}
                  extraCommands={[]}
                  height={550}
                  preview="live"
                  className="w-full min-w-0"
                />

                <style
                  jsx
                  global
                >{`
                  /* Counteract Tailwind's preflight resets in the preview pane */
                  .questions-markdown-editor .wmde-markdown strong,
                  .questions-markdown-editor .wmde-markdown b,
                  .questions-markdown-editor .wmde-markdown h1,
                  .questions-markdown-editor .wmde-markdown h2,
                  .questions-markdown-editor .wmde-markdown h3,
                  .questions-markdown-editor .wmde-markdown h4,
                  .questions-markdown-editor .wmde-markdown h5,
                  .questions-markdown-editor .wmde-markdown h6 {
                    font-weight: 600 !important;
                  }

                  /* Restore list styles stripped by Tailwind */
                  .questions-markdown-editor .wmde-markdown ul {
                    list-style-type: disc !important;
                    padding-left: 1.5rem !important;
                  }

                  .questions-markdown-editor .wmde-markdown ol {
                    list-style-type: decimal !important;
                    padding-left: 1.5rem !important;
                  }

                  .questions-markdown-editor .wmde-markdown li {
                    display: list-item !important;
                  }

                  @media (max-width: 639px) {
                    .questions-markdown-editor .w-md-editor {
                      height: 640px !important;
                    }

                    .questions-markdown-editor .w-md-editor-content {
                      height: auto !important;
                      overflow: visible !important;
                    }

                    /* MDEditor's edit pane is .w-md-editor-input, not .w-md-editor-text. */
                    .questions-markdown-editor .w-md-editor-input {
                      width: 100% !important;
                      height: 300px !important;
                      overflow: auto !important;
                    }

                    /* The library positions preview absolutely on desktop.
                       On mobile it must become a normal block below the editor. */
                    .questions-markdown-editor .w-md-editor-preview {
                      position: relative !important;
                      inset: auto !important;
                      width: 100% !important;
                      height: 300px !important;
                      min-height: 300px !important;
                      padding: 16px !important;
                      overflow: auto !important;
                      border-left: 0 !important;
                      border-top: 1px solid var(--md-editor-box-shadow-color) !important;
                      box-shadow: none !important;
                    }

                    .questions-markdown-editor .w-md-editor-bar {
                      display: none !important;
                    }
                  }
                `}</style>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <AddRoundSubmitButton />
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
          <strong className="block">Add round</strong>
          <span className="text-sm text-muted-foreground">Add the next stage of your interview.</span>
        </span>
      </div>
    </button>
  );
}
