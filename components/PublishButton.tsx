"use client";

import { useFormStatus } from "react-dom";

export function PublishButton({ disabled, isDraft }: { disabled: boolean; isDraft: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={disabled || pending}
      className="min-h-11 w-full rounded-md bg-primary px-5 py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
    >
      {pending ? (isDraft ? "Publishing..." : "Updating...") : isDraft ? "Publish experience" : "Update experience"}
    </button>
  );
}
