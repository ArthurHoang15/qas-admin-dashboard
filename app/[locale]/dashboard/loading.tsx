import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Skeleton */}
      <div className="border-b bg-card px-6 py-4">
        <Skeleton className="h-8 w-48" />
      </div>

      <div className="p-6 space-y-6">
        {/* Stats Grid Skeleton */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="rounded-xl border bg-card p-6">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </div>
              <Skeleton className="h-8 w-16 mt-3" />
              <Skeleton className="h-3 w-32 mt-2" />
            </div>
          ))}
        </div>

        {/* Charts Row 1 Skeleton */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 rounded-xl border bg-card p-6">
            <Skeleton className="h-5 w-32 mb-4" />
            <Skeleton className="h-[300px] w-full" />
          </div>
          <div className="lg:col-span-1 rounded-xl border bg-card p-6">
            <Skeleton className="h-5 w-32 mb-4" />
            <Skeleton className="h-[300px] w-full rounded-full mx-auto" />
          </div>
        </div>

        {/* Charts Row 2 Skeleton */}
        <div className="grid gap-6 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-xl border bg-card p-6">
              <Skeleton className="h-5 w-32 mb-4" />
              <Skeleton className="h-[200px] w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
