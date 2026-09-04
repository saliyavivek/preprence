import { Skeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <main aria-busy="true">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 sm:gap-10 sm:px-8 sm:py-16 lg:px-10">
        <Skeleton className="h-4 w-72" />
        <section className="flex flex-col gap-5 border-b border-border pb-7 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            <Skeleton className="size-[134px] shrink-0 rounded-xl" />
            <div className="flex flex-col gap-3">
              <Skeleton className="h-9 w-64" />
              <Skeleton className="h-6 w-52" />
              <Skeleton className="h-5 w-40" />
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-8 w-28" />
                <Skeleton className="h-8 w-32" />
                <Skeleton className="h-8 w-36" />
              </div>
            </div>
          </div>
          <Skeleton className="hidden h-10 w-28 sm:block" />
        </section>
        <section className="flex flex-col gap-5 border-b border-border pb-8">
          <Skeleton className="h-8 w-48" />
          <div className="flex gap-3 overflow-hidden pb-4 pt-2">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton
                key={index}
                className="h-36 w-64 shrink-0 rounded-xl"
              />
            ))}
          </div>
        </section>
        <section className="flex flex-col gap-5">
          <Skeleton className="h-7 w-64" />
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="grid gap-4 sm:grid-cols-[3.5rem_minmax(0,1fr)] sm:gap-5"
            >
              <Skeleton className="size-10 rounded-full" />
              <div className="overflow-hidden rounded-lg border border-border bg-white/60">
                <Skeleton className="h-12 rounded-none" />
                <div className="space-y-4 p-5">
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-4/5" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </section>
        <section className="flex flex-col gap-4">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-24 rounded-lg" />
        </section>
        <div className="flex justify-between border-t border-border pt-6">
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-10 w-28" />
        </div>
      </div>
    </main>
  );
}
