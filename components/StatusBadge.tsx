import { ExperienceStatus } from "@/lib/types";

export const statusLabels = {
  draft: "Draft",
  published: "Published",
  taken_down: "Taken down",
} as const;

export function normalizeStatus(status?: ExperienceStatus | string) {
  if (status && status in statusLabels) {
    return status as ExperienceStatus;
  }

  return "draft" as ExperienceStatus;
}

export function Status({ status }: { status: ExperienceStatus | string }) {
  const normalizedStatus = normalizeStatus(status);

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-xs font-medium ${normalizedStatus === "published" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : normalizedStatus === "taken_down" ? "border-red-200 bg-red-50 text-red-700" : "border-amber-200 bg-amber-50 text-amber-700"}`}
    >
      <span
        aria-hidden="true"
        className="size-1.5 rounded-full bg-current"
      />
      {statusLabels[normalizedStatus]}
    </span>
  );
}
