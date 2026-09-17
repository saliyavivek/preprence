"use client";

import { ArrowRight01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { useFormStatus } from "react-dom";

export function ContinueButton() {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      aria-disabled={pending}
      className="group inline-flex min-h-14 shrink-0 items-center justify-center gap-4 rounded-xl bg-primary px-6 font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-4 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Loading..." : "Continue to next step"}{" "}
      <span
        aria-hidden="true"
        className="text-xl transition-transform duration-200 group-hover:translate-x-1"
      >
        <HugeiconsIcon
          size="100%"
          className="h-4 w-4"
          icon={ArrowRight01Icon}
        />
      </span>
    </button>
  );
}
