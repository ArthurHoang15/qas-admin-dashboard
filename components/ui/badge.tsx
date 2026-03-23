import { HTMLAttributes } from "react";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "danger" | "info";
}

export function Badge({
  className = "",
  variant = "default",
  children,
  ...props
}: BadgeProps) {
  const variants = {
    default: "bg-muted text-muted-foreground",
    success: "bg-emerald-600 text-white dark:bg-emerald-500 dark:text-white",
    warning: "bg-amber-500 text-white dark:bg-amber-500 dark:text-white",
    danger: "bg-red-600 text-white dark:bg-red-500 dark:text-white",
    info: "bg-blue-600 text-white dark:bg-blue-500 dark:text-white",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
