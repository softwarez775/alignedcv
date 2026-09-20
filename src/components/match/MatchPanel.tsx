import { CheckCircle2, XCircle, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { MatchRing } from "@/components/match/MatchScore";
import { AIInsight } from "@/components/ai/AIInsight";
import type { MatchBreakdown } from "@/types";

/** Painel "Seu Match" com anel + dimensões — seção 8 do prompt */
export function MatchPanel({
  breakdown,
  explanation,
}: {
  breakdown: MatchBreakdown;
  explanation: string;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Seu Match</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center gap-6 md:flex-row md:items-start">
        <div className="flex shrink-0 flex-col items-center gap-2">
          <MatchRing score={breakdown.overall} size={140} />
          <span className="text-sm font-medium">de compatibilidade</span>
        </div>
        <div className="w-full flex-1 space-y-3">
          {breakdown.dimensions.map((d) => (
            <div key={d.category}>
              <div className="mb-1 flex items-center justify-between gap-2 text-sm">
                <span className="whitespace-nowrap font-medium">{d.label}</span>
                <span className="ml-2 hidden truncate text-xs text-muted-foreground sm:block">
                  {d.detail}
                </span>
                <span className="font-semibold tabular-nums">{d.score}%</span>
              </div>
              <Progress
                value={d.score}
                indicatorClassName={d.score >= 80 ? "bg-success" : undefined}
              />
            </div>
          ))}
        </div>
      </CardContent>
      <div className="px-5 pb-5">
        <AIInsight>{explanation}</AIInsight>
      </div>
    </Card>
  );
}

/** Cards de Pontos fortes / Gaps / Diferenciais — seção 9 do prompt */
export function MatchExplanationCards({
  strengths,
  gaps,
  differentials,
}: {
  strengths: string[];
  gaps: string[];
  differentials: string[];
}) {
  const groups = [
    {
      title: "Pontos fortes",
      icon: <CheckCircle2 className="h-5 w-5 text-success" />,
      items: strengths,
      empty: "Nenhum requisito atendido ainda",
      badge: "success" as const,
    },
    {
      title: "Gaps",
      icon: <XCircle className="h-5 w-5 text-destructive" />,
      items: gaps,
      empty: "Nenhum gap identificado",
      badge: "destructive" as const,
    },
    {
      title: "Diferenciais",
      icon: <Star className="h-5 w-5 text-primary dark:text-primary-foreground" />,
      items: differentials,
      empty: "Sem diferenciais mapeados",
      badge: "ai" as const,
    },
  ];
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {groups.map((g) => (
        <Card key={g.title}>
          <CardHeader className="flex-row items-center gap-2 space-y-0 pb-3">
            {g.icon}
            <CardTitle className="text-base">{g.title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {g.items.length === 0 && (
              <p className="text-sm text-muted-foreground">{g.empty}</p>
            )}
            {g.items.map((item) => (
              <p key={item} className="text-sm leading-relaxed">
                {item}
              </p>
            ))}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
