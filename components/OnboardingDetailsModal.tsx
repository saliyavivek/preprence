"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { ArrowDown01Icon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { addOnboardingDetails } from "../app/actions";

type Props = {
  onComplete?: () => void;
};

const BRANCH_OPTIONS = [
  { value: "AI/ML", label: "AI/ML" },
  { value: "Computer Engineering", label: "Computer Engineering" },
  { value: "Information Technology", label: "Information Technology" },
  { value: "MCA", label: "MCA" },
];

export default function OnboardingDetailsModal({ onComplete }: Props) {
  const [name, setName] = useState("");
  const [branch, setBranch] = useState("");
  const [isBranchOpen, setIsBranchOpen] = useState(false);
  const [graduationYear, setGraduationYear] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const branchRootRef = useRef<HTMLDivElement>(null);
  const branchButtonRef = useRef<HTMLButtonElement>(null);

  const selectedBranch = BRANCH_OPTIONS.find((opt) => opt.value === branch);

  useEffect(() => {
    function handleOutsidePointer(event: PointerEvent) {
      if (!branchRootRef.current?.contains(event.target as Node)) setIsBranchOpen(false);
    }

    document.addEventListener("pointerdown", handleOutsidePointer);
    return () => document.removeEventListener("pointerdown", handleOutsidePointer);
  }, []);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!branch) {
      setError("Please select a branch.");
      return;
    }

    setLoading(true);
    setError("");

    const formData = new FormData();

    formData.append("name", name);
    formData.append("branch", branch);
    formData.append("graduationYear", graduationYear);

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
      <div className="w-full max-w-[440px] max-h-[90vh] flex flex-col rounded-[1.25rem] border border-border bg-card shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex-shrink-0 p-6 sm:p-8 pb-0 sm:pb-0">
          <div className="text-center">
            <h1 className="text-xl sm:text-[1.75rem] font-semibold leading-tight tracking-tight text-foreground">Tell us a little about yourself</h1>

            <p className="mt-3 px-2 text-xs sm:text-[0.95rem] leading-relaxed text-muted-foreground">These details help make your experiences more useful to other students.</p>
          </div>
        </div>

        <div className="flex-shrink-0 mx-6 sm:mx-8 my-4 sm:my-6 h-px bg-border" />

        {/* Scrollable Form Content */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-6 sm:px-8 pb-6 sm:pb-8"
        >
          <div className="space-y-3 sm:space-y-5">
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
                className="h-11 sm:h-12 w-full rounded-md border border-input bg-background px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-60"
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

              <div
                ref={branchRootRef}
                className="relative"
              >
                <button
                  ref={branchButtonRef}
                  type="button"
                  onClick={() => setIsBranchOpen(!isBranchOpen)}
                  className="flex min-h-11 sm:min-h-12 w-full items-center justify-between gap-3 rounded-md border border-input bg-background px-4 text-sm text-foreground outline-none transition-colors hover:border-input focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-60"
                  disabled={loading}
                >
                  <span className="text-left">{selectedBranch?.label || "Select your branch"}</span>
                  <HugeiconsIcon
                    icon={ArrowDown01Icon}
                    size="100%"
                    className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${isBranchOpen ? "rotate-180" : ""}`}
                  />
                </button>

                {/* Dropdown menu */}
                {isBranchOpen && (
                  <div className="absolute left-0 right-0 top-[calc(100%+0.5rem)] z-30 rounded-md border border-border bg-card shadow-xl">
                    {BRANCH_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => {
                          setBranch(option.value);
                          setIsBranchOpen(false);
                          branchButtonRef.current?.focus();
                        }}
                        className="flex w-full items-center gap-3 border-b border-border/70 px-4 py-2.5 text-left text-sm transition-colors last:border-b-0 hover:bg-muted/60 focus-visible:bg-muted/60 focus-visible:outline-none"
                      >
                        <span className="block truncate font-medium text-foreground">{option.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Hidden input for form submission */}
              <input
                type="hidden"
                name="branch"
                value={branch}
              />
            </div>

            {/* Graduation Year */}
            <div className="space-y-2">
              <label
                htmlFor="graduationYear"
                className="block text-sm font-medium text-foreground"
              >
                Graduation Year
              </label>

              <input
                id="graduationYear"
                name="graduationYear"
                type="number"
                placeholder="2027"
                value={graduationYear}
                onChange={(event) => setGraduationYear(event.target.value)}
                required
                disabled={loading}
                className="h-11 sm:h-12 w-full rounded-md border border-input bg-background px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:cursor-not-allowed disabled:opacity-60"
              />
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

            <p className="text-xs sm:text-sm leading-relaxed text-muted-foreground">You will not be able to modify this information after submitting, so please enter it carefully.</p>

            {/* Actions */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="h-11 sm:h-12 w-full rounded-md bg-primary px-4 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Saving..." : "Continue"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
