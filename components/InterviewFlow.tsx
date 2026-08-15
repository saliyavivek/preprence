const FLOW_STEPS = ["Application", "Assessment", "Technical", "HR", "You're in"];

export function InterviewFlow() {
  return (
    <div
      aria-hidden="true"
      className="relative hidden w-[300px] shrink-0 lg:block"
    >
      <svg
        className="absolute inset-y-4 left-6 h-[calc(100%-2rem)] w-16 text-primary"
        fill="none"
        viewBox="0 0 64 320"
        preserveAspectRatio="none"
      >
        <path
          d="M8 26v40c0 12 8 20 20 20h28"
          stroke="currentColor"
          strokeOpacity=".28"
        />
        <path
          d="M8 66v76c0 12 8 20 20 20h28"
          stroke="currentColor"
          strokeOpacity=".22"
        />
        <path
          d="M8 146v76c0 12 8 20 20 20h28"
          stroke="currentColor"
          strokeOpacity=".18"
        />
        <path
          d="M8 226v56c0 12 8 20 20 20h28"
          stroke="currentColor"
          strokeOpacity=".14"
        />
        <path
          d="M8 20v270"
          stroke="currentColor"
          strokeOpacity=".16"
          strokeDasharray="2 5"
        />
      </svg>
      <ul className="relative flex flex-col gap-6 pl-24">
        {FLOW_STEPS.map((step, index) => (
          <li
            key={step}
            className="flex items-center gap-3 text-xs text-muted-foreground"
            style={{ marginLeft: `${[0, 28, 12, 40, 4][index]}px` }}
          >
            <span className="size-1.5 shrink-0 rounded-full bg-primary/70" />
            <span className={`rounded-full border px-3.5 py-1.5 ${index === FLOW_STEPS.length - 1 ? "border-primary/30 bg-card font-medium text-foreground" : "border-border bg-card/70"}`}>
              {step}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
