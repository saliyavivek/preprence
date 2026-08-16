"use client";

import { useState } from "react";

import { updateExperience } from "./actions";

type ExperienceSummary = {
  id: string;
  overallTips: string | null;
  isAnonymous: boolean;
  status: string;
};

export default function EditableSummary({ experience }: { experience: ExperienceSummary }) {
  const isDraft = experience.status === "draft";
  const [isEditing, setIsEditing] = useState(false);
  const [overallTips, setOverallTips] = useState(experience.overallTips ?? "");
  const [isAnonymous, setIsAnonymous] = useState(experience.isAnonymous);

  if (!isDraft) {
    return (
      <section className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
        <h2 className="text-xl font-semibold">Overall tips</h2>
        <p className="mt-1 text-sm text-muted-foreground">What would you tell another student preparing for a similar interview?</p>
        <p className="mt-4 whitespace-pre-line text-sm leading-6 text-muted-foreground">{experience.overallTips || "No tips added yet."}</p>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-border bg-card p-5 shadow-sm sm:p-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold">Overall tips</h2>
          <p className="mt-1 text-sm text-muted-foreground">What would you tell another student preparing for a similar interview?</p>
        </div>

        <button
          type={isEditing ? "submit" : "button"}
          form={isEditing ? "overall-tips-form" : undefined}
          onClick={() => {
            if (!isEditing) {
              setIsEditing(true);
            }
          }}
          className="rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
        >
          {isEditing ? "Save" : "Edit details"}
        </button>
      </div>

      {isEditing ? (
        <form
          id="overall-tips-form"
          action={updateExperience.bind(null, experience.id)}
          className="space-y-4"
        >
          <label className="block text-sm font-medium text-foreground">
            <span className="mb-2 block">Tips</span>
            <textarea
              name="overallTips"
              value={overallTips}
              onChange={(event) => setOverallTips(event.target.value)}
              rows={7}
              placeholder="What would you tell someone preparing for this interview?"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground"
            />
          </label>

          <label className="flex items-center gap-3 text-sm text-foreground">
            <input
              type="checkbox"
              name="isAnonymous"
              checked={isAnonymous}
              onChange={(event) => setIsAnonymous(event.target.checked)}
            />
            Submit anonymously
          </label>
        </form>
      ) : (
        <p className="whitespace-pre-line text-sm leading-6 text-muted-foreground">{experience.overallTips || "No tips added yet."}</p>
      )}
    </section>
  );
}
