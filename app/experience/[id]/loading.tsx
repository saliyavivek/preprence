import { Skeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <main
      aria-busy="true"
      className="min-h-screen"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-8 sm:gap-8 sm:px-8 sm:py-14 lg:px-12">
        <Skeleton className="h-4 w-72" />
        <header className="flex flex-col gap-3">
          <Skeleton className="h-10 w-80 sm:h-14" />
          <Skeleton className="h-5 w-full max-w-xl" />
        </header>
        <Skeleton className="h-16 rounded-lg" />
        <section className="flex flex-col gap-5 rounded-xl border border-border bg-white/60 p-4 sm:flex-row sm:items-center sm:p-6">
          <Skeleton className="size-20 shrink-0 rounded-xl" />
          <div className="flex flex-1 flex-col gap-3">
            <Skeleton className="h-7 w-2/3" />
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-4 w-3/4" />
          </div>
          <Skeleton className="h-10 w-40 rounded-md" />
        </section>
        <section className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-full max-w-xl" />
          </div>
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="flex flex-col gap-4 rounded-xl border border-border bg-white/60 p-5"
            >
              <div className="flex items-center gap-4">
                <Skeleton className="size-12 rounded-full" />
                <Skeleton className="h-6 w-48" />
              </div>
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </section>
        <section className="flex flex-col gap-4 rounded-xl border border-border bg-white/60 p-6">
          <Skeleton className="h-7 w-48" />
          <Skeleton className="h-20 rounded-lg" />
        </section>
        <section className="flex items-center justify-between rounded-xl border border-border bg-white/60 p-6">
          <div className="space-y-3">
            <Skeleton className="h-6 w-40" />
            <Skeleton className="h-4 w-72" />
          </div>
          <Skeleton className="h-11 w-36 rounded-md" />
        </section>
      </div>
    </main>
  );
}
