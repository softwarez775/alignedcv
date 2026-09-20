import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight, RefreshCw } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { AIInsight, AIProcessing } from "@/components/ai/AIInsight";
import { useAIProcess } from "@/hooks/use-theme";
import { aiService } from "@/lib/ai";
import { useAppStore } from "@/stores/useAppStore";
import { uid } from "@/lib/utils";
import type { AdaptAnalysis, Job, Resume } from "@/types";

/**
 * Fluxo "Vamos adaptar seu currículo" — seção 14 do prompt.
 * A personalização só reordena/realça conteúdo existente — nunca inventa.
 */
export function AdaptResumeDialog({
  job,
  open,
  onOpenChange,
}: {
  job: Job | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const navigate = useNavigate();
  const baseResume = useAppStore((s) => s.baseResume);
  const addResume = useAppStore((s) => s.addResume);
  const [analysis, setAnalysis] = useState<AdaptAnalysis | null>(null);
  const process = useAIProcess<AdaptAnalysis>();

  const startAnalysis = async () => {
    if (!baseResume || !job) return;
    setAnalysis(null);
    const result = await process.run(
      [
        { message: "Analisando seu currículo..." },
        { message: "Comparando com a vaga..." },
        { message: "Otimizando palavras-chave..." },
        { message: "Calculando compatibilidade..." },
      ],
      () => aiService.optimizeResume(baseResume, job),
    );
    setAnalysis(result);
  };

  const generateResume = () => {
    if (!baseResume || !job || !analysis) return;
    const adapted: Resume = {
      ...structuredClone(baseResume),
      id: uid("resume"),
      name: `${job.seniority} ${job.title.split(" ").slice(0, 2).join(" ")} — ${job.company}`,
      isBase: false,
      jobId: job.id,
      jobTitle: job.title,
      updatedAt: Date.now(),
      // Realça competências já existentes citadas na vaga (sem adicionar novas)
      skills: [
        ...analysis.relevantSkills,
        ...baseResume.skills.filter((s) => !analysis.relevantSkills.includes(s)),
      ].slice(0, 14),
    };
    addResume(adapted);
    onOpenChange(false);
    navigate(`/app/curriculos/${adapted.id}/editar`);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (next && baseResume && job && !analysis) void startAnalysis();
      }}
    >
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary dark:text-primary-foreground" />
            Vamos adaptar seu currículo
          </DialogTitle>
          <DialogDescription>
            Vaga selecionada: <strong>{job?.title}</strong> — {job?.company}
            <br />
            Currículo base: <strong>{baseResume?.name ?? "—"}</strong>
          </DialogDescription>
        </DialogHeader>

        {process.status === "processing" && <AIProcessing message={process.message} />}

        {process.status === "done" && analysis && (
          <div className="space-y-4">
            {analysis.insights.map((insight) => (
              <AIInsight key={insight.label} title={insight.label}>
                {insight.items.map((item, i) => (
                  <p key={i}>{item}</p>
                ))}
              </AIInsight>
            ))}

            <div className="grid gap-3 sm:grid-cols-2">
              <Card>
                <CardContent className="p-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Palavras-chave prioritárias
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.priorityKeywords.length === 0 && (
                      <span className="text-sm text-muted-foreground">
                        Nenhuma em comum ainda
                      </span>
                    )}
                    {analysis.priorityKeywords.map((k) => (
                      <Badge key={k} variant="ai">{k}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Gaps identificados
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {analysis.gaps.length === 0 && (
                      <span className="text-sm text-success">Nenhum gap crítico 🎉</span>
                    )}
                    {analysis.gaps.map((g) => (
                      <Badge key={g} variant="destructive">{g}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardContent className="p-4 text-sm">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Recomendações de melhoria
                </p>
                <ul className="list-disc space-y-1.5 pl-4">
                  {analysis.recommendations.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-muted-foreground">
                  <span className="font-semibold">Evite:</span>{" "}
                  {analysis.termsToAvoid.join(" · ")}
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {process.status === "error" && (
          <p className="text-sm text-destructive">
            Não foi possível concluir a análise. Tente novamente.
          </p>
        )}

        <DialogFooter>
          {process.status === "idle" && (
            <Button onClick={startAnalysis} disabled={!baseResume || !job}>
              <RefreshCw className="h-4 w-4" /> Analisar compatibilidade
            </Button>
          )}
          {process.status === "processing" && (
            <Button disabled>Comparando com a vaga...</Button>
          )}
          {process.status === "done" && (
            <>
              <Button variant="ghost" onClick={startAnalysis}>
                <RefreshCw className="h-4 w-4" /> Refazer análise
              </Button>
              <Button onClick={generateResume}>
                Gerar currículo personalizado <ArrowRight className="h-4 w-4" />
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

