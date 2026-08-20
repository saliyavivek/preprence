import { Skeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <main aria-busy="true">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:gap-8 sm:px-8 sm:py-16">
        <Skeleton className="h-4 w-56" />
        <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-3">
            <Skeleton className="h-10 w-80 sm:h-12" />
            <Skeleton className="h-5 w-full max-w-xl" />
          </div>
          <Skeleton className="h-10 w-full rounded-md sm:w-48" />
        </header>
        <Skeleton className="h-20 rounded-lg p-3 sm:h-16" />
        <div className="mt-0 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_17rem]">
          <div className="flex min-w-0 flex-col gap-6">
            <section className="overflow-hidden rounded-lg border border-border bg-card">
              <Skeleton className="h-12 rounded-none border-b border-border" />
              {Array.from({ length: 4 }).map((_, index) => (
                <div
                  key={index}
                  className="flex gap-4 border-b border-border p-5 last:border-b-0"
                >
                  <Skeleton className="hidden size-20 shrink-0 rounded-lg sm:block" />
                  <div className="flex min-w-0 flex-1 flex-col gap-3">
                    <Skeleton className="h-6 w-2/3" />
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))}
            </section>
            <Skeleton className="h-28 rounded-lg" />
          </div>
          <aside className="hidden flex-col gap-5 lg:flex">
            <Skeleton className="h-40 rounded-lg" />
            <Skeleton className="h-64 rounded-lg" />
          </aside>
        </div>
      </div>
    </main>
  );
}
