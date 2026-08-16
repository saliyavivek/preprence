export function VerdictBadge({ verdict }: { verdict: any }) {
  if (!verdict) return null;

  const selected = verdict === "selected";
  const rejected = verdict === "rejected";

  return (
    <span
      className={`inline-flex w-fit items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-semibold ${
        selected ? "bg-success/10 text-success" : rejected ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"
      }`}
    >
      <span className="capitalize">{verdict === "not_disclosed" ? "not disclosed" : verdict.replace("_", " ")}</span>
    </span>
  );
}
