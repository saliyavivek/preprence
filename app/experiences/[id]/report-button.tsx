"use client";

import { useState } from "react";
import { ReportExperience } from "./actions";

type Props = { experienceId: string };

export function ReportButton({ experienceId }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submitReport(formData: FormData) {
    setIsPending(true);
    setError(null);
    try {
      await ReportExperience(experienceId, formData);
      setIsOpen(false);
      setReason("");
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to submit report.");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="flex flex-col items-end gap-3">
      <button
        type="button"
        onClick={() => setIsOpen((value) => !value)}
        className="inline-flex min-h-10 items-center gap-2 rounded-md border border-input px-4 text-sm font-medium text-foreground transition-colors hover:border-destructive hover:text-destructive hover:bg-destructive/5 focus:outline-none focus:ring-2 focus:ring-destructive/20"
      >
        <span aria-hidden="true">⚑</span>
        Report this experience
      </button>
      {isOpen && (
        <form
          action={submitReport}
          className="flex w-full max-w-sm flex-col gap-3 rounded-md border border-border bg-card p-4 shadow-sm"
        >
          <label
            htmlFor="report-reason"
            className="text-sm font-medium"
          >
            Reason (optional)
          </label>
          <textarea
            id="report-reason"
            name="reason"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            rows={3}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
            placeholder="Tell us what needs attention"
          />
          {error && <p className="text-sm text-destructive">{error}</p>}
          <button
            type="submit"
            disabled={isPending}
            className="min-h-10 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isPending ? "Submitting..." : "Submit report"}
          </button>
        </form>
      )}
    </div>
  );
}
