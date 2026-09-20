import { cn } from "@/lib/utils";
import { matchLabel } from "@/lib/engines/matching";

export type MatchSize = "sm" | "md" | "lg";

const sizeMap: Record<MatchSize, { badge: string; label: string }> = {
  sm: { badge: "text-xs px-2 py-0.5", label: "hidden" },
  md: { badge: "text-sm px-2.5 py-1", label: "text-xs mt-1" },
  lg: { badge: "text-lg px-3 py-1.5 font-bold", label: "text-sm mt-1.5" },
};

function toneClasses(score: number) {
  if (score >= 80)
    return "bg-success/10 text-success border-success/30 dark:bg-success/20";
  if (score >= 60)
    return "bg-primary/10 text-primary border-primary/30 dark:bg-primary/20";
  return "bg-muted text-muted-foreground border-border";
}

/**
 * Componente de score de compatibilidade (Match) — seção 24 do prompt.
 * 0–59 baixa · 60–79 moderada · 80–89 boa · 90–100 excelente.
 */
export function MatchScore({
  score,
  size = "md",
  showLabel = true,
  className,
}: {
  score: number;
  size?: MatchSize;
  showLabel?: boolean;
  className?: string;
}) {
  const { label } = matchLabel(score);
  const s = sizeMap[size];
  return (
    <div className={cn("flex flex-col items-start", className)}>
      <span
        className={cn(
          "inline-flex items-center rounded-full border font-semibold",
          s.badge,
          toneClasses(score),
        )}
      >
        {score}% Match
      </span>
      {showLabel && size !== "sm" && (
        <span className={cn("text-muted-foreground", s.label)}>{label}</span>
      )}
    </div>
  );
}

/** Barra circular de Match para destaques grandes (dashboard, detalhe da vaga) */
export function MatchRing({
  score,
  size = 120,
  className,
}: {
  score: number;
  size?: number;
  className?: string;
}) {
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? "#10B981" : score >= 60 ? "#4F46E5" : "#94A3B8";
  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label={`${score}% de compatibilidade`}
    >
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={stroke}
          className="text-secondary"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold tabular-nums">{score}%</span>
        <span className="text-[11px] font-medium text-muted-foreground">
          Match
        </span>
      </div>
    </div>
  );
}
