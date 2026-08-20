import { Skeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <main
      aria-busy="true"
      className="min-h-[calc(100vh-8rem)]"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-5 py-14 sm:px-8 sm:py-16 lg:px-12">
        <Skeleton className="h-4 w-32" />
        <header className="flex max-w-3xl flex-col gap-3">
          <Skeleton className="h-12 w-56 sm:h-14 sm:w-64" />
          <Skeleton className="h-6 w-full max-w-xl" />
        </header>
        <div className="flex flex-col gap-14">
          <section className="flex flex-col gap-6">
            <div className="flex items-end justify-between gap-4">
              <Skeleton className="h-8 w-56" />
              <Skeleton className="hidden h-5 w-52 sm:block" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-24 rounded-xl"
                />
              ))}
            </div>
          </section>
          <section className="flex flex-col gap-6 border-t border-gray-200 pt-10">
            <div className="flex flex-col gap-2">
              <div className="flex items-end justify-between gap-4">
                <Skeleton className="h-9 w-48" />
                <Skeleton className="hidden h-5 w-32 sm:block" />
              </div>
              <Skeleton className="h-5 w-full max-w-2xl" />
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:gap-4">
              {Array.from({ length: 6 }).map((_, index) => (
                <Skeleton
                  key={index}
                  className="h-28 rounded-md"
                />
              ))}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
