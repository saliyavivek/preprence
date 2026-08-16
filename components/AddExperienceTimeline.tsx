"use client";

export default function AddExperienceTimeline({ active }: { active: number }) {
  return (
    <section
      aria-label="Contribution steps"
      className="flex items-start gap-4 sm:gap-8"
    >
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <span
          className={`flex size-10 shrink-0 items-center justify-center rounded-full text-lg font-semibold ${active === 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
        >
          1
        </span>
        <div className="flex flex-col gap-1 pt-1">
          <span className={`font-semibold ${active === 1 ? "text-primary" : "text-foreground"}`}>Interview details</span>
          <span className="text-sm text-muted-foreground">Basic information</span>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="mt-5 hidden h-px flex-1 border-t border-dashed border-muted-foreground/50 sm:block"
      />
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <span
          className={`flex size-10 shrink-0 items-center justify-center rounded-full text-lg font-semibold ${active === 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
        >
          2
        </span>
        <div className="flex flex-col gap-1 pt-1">
          <span className={`font-semibold ${active === 2 ? "text-primary" : "text-foreground"}`}>Interview rounds</span>
          <span className="text-sm text-muted-foreground">Add your rounds</span>
        </div>
      </div>
      <div
        aria-hidden="true"
        className="mt-5 hidden h-px flex-1 border-t border-dashed border-muted-foreground/50 sm:block"
      />
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <span
          className={`flex size-10 shrink-0 items-center justify-center rounded-full text-lg font-semibold ${active === 3 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
        >
          3
        </span>
        <div className="flex flex-col gap-1 pt-1">
          <span className={`font-semibold ${active === 3 ? "text-primary" : "text-foreground"}`}>Review & Publish</span>
          <span className="text-sm text-muted-foreground">Final step</span>
        </div>
      </div>
    </section>
  );
}
