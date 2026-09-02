import { Skeleton } from "@/components/Skeleton";

export default function Loading() {
  return (
    <main
      aria-busy="true"
      className="min-h-[calc(100vh-10rem)]"
    >
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-5 py-10 sm:px-8 sm:py-14 lg:px-12">
        {/* Breadcrumbs */}
        <Skeleton className="h-4 w-48" />

        {/* Header */}
        <header className="flex items-center gap-5 sm:gap-8">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-10 w-96 sm:h-12 sm:w-full" />
            <Skeleton className="h-5 w-72" />
          </div>
        </header>

        {/* Timeline */}
        <Skeleton className="h-12 w-full rounded-2xl" />

        {/* Form Fields */}
        <div className="flex flex-col gap-6">
          {/* Company Field */}
          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-14 w-full rounded-xl" />
          </div>

          {/* Role Field */}
          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-20" />
            <Skeleton className="h-14 w-full rounded-xl" />
          </div>

          {/* Interview Round */}
          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-14 w-full rounded-xl" />
          </div>

          {/* Job Title / Internship Title */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-14 w-full rounded-xl" />
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-5 w-28" />
              <Skeleton className="h-14 w-full rounded-xl" />
            </div>
          </div>

          {/* Duration */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-14 w-full rounded-xl" />
            </div>
            <div className="flex flex-col gap-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-14 w-full rounded-xl" />
            </div>
          </div>

          {/* Skills */}
          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-14 w-full rounded-xl" />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-2">
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-32 w-full rounded-xl" />
          </div>

          {/* Button */}
          <Skeleton className="h-12 w-32 rounded-lg" />
        </div>
      </div>
    </main>
  );
}
