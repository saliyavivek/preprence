"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

import { updateExperience } from "./actions";

type ExperienceSummary = {
  id: string;
  overallTips: string | null;
  isAnonymous: boolean;
  status: string;
};

export default function EditableSummary({ experience }: { experience: ExperienceSummary }) {
  const isDraft = experience.status === "draft";
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [overallTips, setOverallTips] = useState(experience.overallTips ?? "");
  const [isAnonymous, setIsAnonymous] = useState(experience.isAnonymous);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await updateExperience(experience.id, new FormData(event.currentTarget));
    setIsEditing(false);
    router.refresh();
  }

  function handleEdit() {
    setOverallTips(experience.overallTips ?? "");
    setIsAnonymous(experience.isAnonymous);
    setIsEditing(true);
  }

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

        {!isEditing && (
          <button
            type="button"
            onClick={handleEdit}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            Edit details
          </button>
        )}
      </div>

      {isEditing ? (
        <form
          onSubmit={handleSubmit}
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

          <div className="rounded-lg border border-border bg-muted/20 p-4">
            <label className="flex items-center gap-3 text-base font-medium text-foreground">
              <input
                type="checkbox"
                name="isAnonymous"
                checked={isAnonymous}
                onChange={(event) => setIsAnonymous(event.target.checked)}
                className="size-5 accent-primary"
              />
              Submit anonymously
            </label>
            <p className="mt-2 pl-8 text-sm text-muted-foreground">Your name won&apos;t be shown with this experience.</p>
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Save
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="rounded-md border border-input bg-background px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <p className="whitespace-pre-line text-sm leading-6 text-muted-foreground">{experience.overallTips || "No tips added yet."}</p>
      )}
    </section>
  );
}
