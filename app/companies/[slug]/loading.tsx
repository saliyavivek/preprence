import { Skeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <main
      aria-busy="true"
      className="min-h-screen"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
        <Skeleton className="h-4 w-64" />
        <section className="rounded-lg border border-border bg-white/60 p-6 sm:p-8">
          <div className="flex flex-col gap-7 sm:flex-row sm:items-center">
            <Skeleton className="mx-auto size-24 rounded-xl sm:mx-0 sm:size-32" />
            <div className="flex flex-1 flex-col items-center gap-3 sm:items-start">
              <Skeleton className="h-10 w-64" />
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-5 w-56" />
            </div>
          </div>
        </section>
        <section className="flex flex-col gap-4">
          <Skeleton className="h-8 w-64" />
          <div className="overflow-hidden rounded-lg border border-border bg-white/60">
            {Array.from({ length: 3 }).map((_, index) => (
              <div
                key={index}
                className="flex gap-4 border-b border-border p-5 last:border-b-0"
              >
                <Skeleton className="size-14 shrink-0 rounded-lg" />
                <div className="flex min-w-0 flex-1 flex-col gap-3">
                  <Skeleton className="h-6 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
