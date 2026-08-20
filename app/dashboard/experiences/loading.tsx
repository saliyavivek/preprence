import { Skeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <main
      aria-busy="true"
      className="min-h-[calc(100vh-8rem)]"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 py-12 sm:px-8 sm:py-16 lg:px-12">
        <Skeleton className="h-4 w-72" />
        <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-3">
            <Skeleton className="h-12 w-72 sm:h-14" />
            <Skeleton className="h-5 w-80" />
          </div>
          <Skeleton className="h-12 w-full rounded-md sm:w-48" />
        </header>
        <section className="flex flex-col gap-4">
          {Array.from({ length: 5 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col gap-5 rounded-sm border border-border bg-card p-4 sm:flex-row sm:items-center sm:p-6"
            >
              <Skeleton className="size-20 shrink-0 rounded-lg" />
              <div className="flex min-w-0 flex-1 flex-col gap-3">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-5 w-1/3" />
                <Skeleton className="h-4 w-4/5" />
              </div>
              <Skeleton className="h-9 w-24 rounded-md" />
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
