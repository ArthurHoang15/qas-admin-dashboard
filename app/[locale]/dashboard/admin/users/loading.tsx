import { Skeleton } from "@/components/ui/skeleton";

export default function UsersLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Skeleton */}
      <div className="border-b bg-card px-6 py-4">
        <Skeleton className="h-8 w-48" />
      </div>

      <div className="p-6">
        {/* Search Skeleton */}
        <div className="flex gap-4 mb-6">
          <Skeleton className="h-10 w-64" />
        </div>

        {/* Users Table Skeleton */}
        <div className="rounded-xl border bg-card">
          <div className="border-b p-4">
            <div className="flex gap-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-4 w-24" />
              ))}
            </div>
          </div>
          {[...Array(8)].map((_, i) => (
            <div key={i} className="border-b p-4 last:border-0">
              <div className="flex gap-4 items-center">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1">
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-3 w-48" />
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-8 w-20" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
