import { ActivityItem } from "./activity-item";
import type { RecentActivity } from "@/lib/types/dashboard";

interface ActivityFeedProps {
  activities: RecentActivity[];
  title: string;
  locale: string;
  emptyMessage?: string;
}

export function ActivityFeed({
  activities,
  title,
  locale,
  emptyMessage = "No recent activity",
}: ActivityFeedProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="mb-4 text-sm font-medium text-muted-foreground">{title}</h3>
      <div className="divide-y divide-border">
        {activities.length === 0 ? (
          <p className="py-4 text-center text-sm text-muted-foreground italic">
            {emptyMessage}
          </p>
        ) : (
          activities.map((activity) => (
            <ActivityItem
              key={activity.id}
              activity={activity}
              locale={locale}
            />
          ))
        )}
      </div>
    </div>
  );
}
