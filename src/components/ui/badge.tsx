import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "secondary" | "success" | "destructive" | "outline" | "ai";

const variants: Record<Variant, string> = {
  default: "border-transparent bg-primary text-primary-foreground",
  secondary: "border-transparent bg-secondary text-secondary-foreground",
  success: "border-transparent bg-success/10 text-success dark:bg-success/20",
  destructive: "border-transparent bg-destructive/10 text-destructive dark:bg-destructive/20",
  outline: "text-foreground",
  ai: "border-primary/20 bg-primary/10 text-primary dark:text-primary-foreground dark:bg-primary/25",
};

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: Variant;
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium w-fit",
        variants[variant],
        className,
      )}
      {...props}
    />
  );
}

export { Badge };
