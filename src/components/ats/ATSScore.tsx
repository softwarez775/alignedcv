import { BadgeCheck, AlertTriangle, Wrench } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ATSAnalysis, ATSIssue } from "@/types";
import { atsStatusLabel } from "@/lib/engines/ats";
import { Progress } from "@/components/ui/progress";

const statusStyles: Record<ATSAnalysis["status"], string> = {
  excellent: "bg-success text-success-foreground",
  good: "bg-success/85 text-success-foreground",
  regular: "bg-amber-500 text-white",
  poor: "bg-destructive text-destructive-foreground",
};

/** Componente ATSScore — seção 25 do prompt */
export function ATSScore({
  analysis,
  size = "md",
  showDimensions = false,
  className,
}: {
  analysis: ATSAnalysis;
  size?: "sm" | "md" | "lg";
  showDimensions?: boolean;
  className?: string;
}) {
  const { badge } = atsStatusLabel(analysis);
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="flex items-center gap-3 flex-wrap">
        <div
          className={cn(
            "flex items-baseline gap-1 font-bold tabular-nums",
            size === "lg" && "text-4xl",
            size === "md" && "text-2xl",
            size === "sm" && "text-lg",
          )}
        >
          {analysis.score}
          <span
            className={cn(
              "text-muted-foreground font-semibold",
              size === "lg" ? "text-xl" : "text-sm",
            )}
          >
            /100
          </span>
        </div>
        {analysis.status === "excellent" && (
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
              statusStyles[analysis.status],
            )}
          >
            <BadgeCheck className="h-3.5 w-3.5" />
            {badge}
          </span>
        )}
      </div>

      {showDimensions && (
        <div className="space-y-2.5">
          {analysis.dimensions.map((d) => (
            <div key={d.key}>
              <div className="mb-1 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{d.label}</span>
                <span className="font-semibold tabular-nums">{d.score}%</span>
              </div>
              <Progress
                value={d.score}
                indicatorClassName={d.score >= 80 ? "bg-success" : undefined}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/** Lista de problemas/melhorias detectadas — seção 13 do prompt */
export function ATSIssueList({ issues }: { issues: ATSIssue[] }) {
  const icons = {
    good: <BadgeCheck className="h-4 w-4 text-success" />,
    warning: <AlertTriangle className="h-4 w-4 text-amber-500" />,
    improvement: <Wrench className="h-4 w-4 text-primary" />,
  } as const;
  const labels = {
    good: "Boa prática",
    warning: "Atenção",
    improvement: "Melhoria recomendada",
  } as const;
  return (
    <ul className="space-y-2">
      {issues.map((issue, i) => (
        <li
          key={i}
          className="flex gap-3 rounded-lg border bg-card p-3.5"
        >
          <span className="mt-0.5 shrink-0">{icons[issue.severity]}</span>
          <div>
            <p className="text-sm font-medium">
              {issue.title}
              <span className="ml-2 text-xs font-normal text-muted-foreground">
                {labels[issue.severity]}
              </span>
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {issue.description}
            </p>
          </div>
        </li>
      ))}
    </ul>
  );
}
