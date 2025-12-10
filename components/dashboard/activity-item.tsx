import { UserPlus, UserCheck, CheckCircle } from "lucide-react";
import type { RecentActivity } from "@/lib/types/dashboard";

interface ActivityItemProps {
  activity: RecentActivity;
  locale: string;
}

const typeIcons = {
  registration: UserPlus,
  qualified: UserCheck,
  completed: CheckCircle,
};

const typeColors = {
  registration: "text-blue-500 bg-blue-500/10",
  qualified: "text-amber-500 bg-amber-500/10",
  completed: "text-emerald-500 bg-emerald-500/10",
};

export function ActivityItem({ activity, locale }: ActivityItemProps) {
  const Icon = typeIcons[activity.type];
  const colorClass = typeColors[activity.type];

  const timeAgo = getTimeAgo(activity.timestamp, locale);

  return (
    <div className="flex items-center gap-3 py-3">
      <div className={`rounded-full p-2 ${colorClass}`}>
        <Icon className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">
          {activity.name}
        </p>
        <p className="text-xs text-muted-foreground truncate">
          {activity.email}
        </p>
      </div>
      <div className="text-right">
        <p className="text-xs font-medium text-foreground">{activity.action}</p>
        <p className="text-xs text-muted-foreground">{timeAgo}</p>
      </div>
    </div>
  );
}

function getTimeAgo(timestamp: string, locale: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  const isVi = locale === "vi";

  if (diffInSeconds < 60) {
    return isVi ? "Vừa xong" : "Just now";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return isVi
      ? `${diffInMinutes} phút trước`
      : `${diffInMinutes}m ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return isVi
      ? `${diffInHours} giờ trước`
      : `${diffInHours}h ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 7) {
    return isVi
      ? `${diffInDays} ngày trước`
      : `${diffInDays}d ago`;
  }

  return date.toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
  });
}
