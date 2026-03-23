import { Skeleton } from "@/components/ui/skeleton";

export default function EmailSenderLoading() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header Skeleton */}
      <div className="border-b bg-card px-6 py-4">
        <Skeleton className="h-8 w-48" />
      </div>

      <div className="p-6">
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Email Form Skeleton */}
          <div className="rounded-xl border bg-card p-6 space-y-4">
            <Skeleton className="h-6 w-32 mb-4" />

            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-32 w-full" />
            </div>

            <Skeleton className="h-10 w-full" />
          </div>

          {/* Preview Skeleton */}
          <div className="rounded-xl border bg-card p-6">
            <Skeleton className="h-6 w-24 mb-4" />
            <Skeleton className="h-[400px] w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
