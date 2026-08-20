import { Skeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <main
      aria-busy="true"
      className="mx-auto max-w-[1100px] px-5 py-10"
    >
      <Skeleton className="h-4 w-48" />
      <header className="mt-8 flex flex-col gap-3">
        <Skeleton className="h-10 w-80 sm:h-12" />
        <Skeleton className="h-5 w-72" />
      </header>
      <Skeleton className="mt-10 h-36 rounded-2xl sm:h-32" />
      <section className="mt-12">
        <Skeleton className="h-7 w-36" />
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <Skeleton
              key={index}
              className="h-32 rounded-2xl"
            />
          ))}
        </div>
      </section>
      <section className="mt-12 overflow-hidden rounded-2xl border border-border bg-card">
        <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-5">
          <Skeleton className="h-6 w-52" />
          <Skeleton className="h-5 w-16" />
        </div>
        <div className="divide-y divide-border border-t border-border">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="flex gap-4 p-4 sm:p-6"
            >
              <Skeleton className="size-20 shrink-0 rounded-lg" />
              <div className="flex min-w-0 flex-1 flex-col gap-3">
                <Skeleton className="h-6 w-1/2" />
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-4 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
