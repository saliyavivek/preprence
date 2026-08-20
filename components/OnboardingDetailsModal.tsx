"use client";

import { FormEvent, useState } from "react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { addOnboardingDetails } from "../app/actions";

type Props = {
  onComplete?: () => void;
};

export default function OnboardingDetailsModal({ onComplete }: Props) {
  const [name, setName] = useState("");
  const [branch, setBranch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);
    setError("");

    const formData = new FormData();

    formData.append("name", name);
    formData.append("branch", branch);

    const result = await addOnboardingDetails(formData);

    if (result.error) {
      setError(result.error);
      setLoading(false);
      return;
    }

    onComplete?.();
    setLoading(false);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 p-4 backdrop-blur-[2px]">
      <div className="w-full max-w-[440px] rounded-[1.25rem] border border-border bg-card p-8 shadow-xl sm:p-10">
        {/* Logo */}
        <div className="mb-6 flex justify-center">
          <span className="text-xl font-bold tracking-tight text-foreground">
            preprence<span className="text-primary">.</span>
          </span>
        </div>

        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-[1.75rem] font-semibold leading-tight tracking-tight text-foreground">Tell us a little about yourself</h1>

          <p className="mt-3 px-2 text-[0.95rem] leading-relaxed text-muted-foreground">These details help make your experiences more useful to other students.</p>
        </div>

        <div className="mb-8 h-px bg-border" />

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          {/* Name */}
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-foreground"
            >
              Name
            </label>

            <input
              id="name"
              name="name"
              type="text"
              placeholder="Your name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              required
              disabled={loading}
              className="h-12 w-full rounded-md border border-input bg-background px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </div>

          {/* Branch */}
          <div className="space-y-2">
            <label
              htmlFor="branch"
              className="block text-sm font-medium text-foreground"
            >
              Branch
            </label>

            <div className="relative">
              <select
                id="branch"
                name="branch"
                value={branch}
                onChange={(event) => setBranch(event.target.value)}
                required
                disabled={loading}
                className="h-12 w-full appearance-none rounded-md border border-input bg-background px-4 pr-10 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <option value="">Select your branch</option>
                <option value="AI/ML">AI/ML</option>
                <option value="Computer Engineering">Computer Engineering</option>
                <option value="Information Technology">Information Technology</option>
                <option value="MCA">MCA</option>
              </select>
              <HugeiconsIcon
                icon={ArrowDown01Icon}
                aria-hidden="true"
                className="pointer-events-none absolute right-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              />
            </div>
          </div>

          {/* Error */}
          {error && (
            <p
              className="text-sm text-destructive"
              role="alert"
            >
              {error}
            </p>
          )}

          <p className="text-sm leading-relaxed text-muted-foreground">You will not be able to modify this information after submitting, so please enter it carefully.</p>

          {/* Actions */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="h-12 w-full rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Saving..." : "Continue"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
