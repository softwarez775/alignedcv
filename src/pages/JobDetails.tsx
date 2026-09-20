import { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { CircleAlert, FileCheck2, ListChecks, Sparkles, Star } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { JobHeader } from "@/components/jobs/JobHeader";
import { MatchPanel, MatchExplanationCards } from "@/components/match/MatchPanel";
import { AdaptResumeDialog } from "@/components/resume/AdaptResumeDialog";
import { useAppStore } from "@/stores/useAppStore";
import { calculateMatch } from "@/lib/engines/matching";
import { mockJobList } from "@/lib/mock-data";
import { toast } from "sonner";
import { aiService, type MatchExplanation } from "@/lib/ai";
import type { Job } from "@/types";

/** Página de detalhes da vaga — seções 8 e 9 do prompt */
export default function JobDetails() {
  const { jobId } = useParams();
  const [searchParams] = useSearchParams();
  const baseResume = useAppStore((s) => s.baseResume);
  const savedJobIds = useAppStore((s) => s.savedJobIds);
  const toggleSaveJob = useAppStore((s) => s.toggleSaveJob);
  const applications = useAppStore((s) => s.applications);
  const addApplication = useAppStore((s) => s.addApplication);
  const resumes = useAppStore((s) => s.resumes);

  const [adaptOpen, setAdaptOpen] = useState(false);
  const [explanation, setExplanation] = useState<MatchExplanation | null>(null);

  const job: Job | undefined = useMemo(
    () => mockJobList.find((j) => j.id === jobId),
    [jobId],
  );

  useEffect(() => {
    if (searchParams.get("adaptar") === "1") setAdaptOpen(true);
  }, [searchParams]);

  useEffect(() => {
    let cancelled = false;
    setExplanation(null);
    if (job && baseResume) {
      aiService.analyzeJob(job, baseResume).then((result) => {
        if (!cancelled) setExplanation(result);
      });
    }
    return () => {
      cancelled = true;
    };
  }, [job, baseResume]);

  const match = useMemo(
    () => (job && baseResume ? calculateMatch(baseResume, job) : null),
    [job, baseResume],
  );

  if (!job || !baseResume || !match) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  const applied = applications.some((a) => a.jobId === job.id);
  const saved = savedJobIds.includes(job.id);
  const usedResume = resumes.find((r) => r.jobId === job.id);
  const handleApply = () => {
    addApplication(job.id, usedResume?.id ?? baseResume.id);
    toast.success("Candidatura registrada!", {
      description: `Você agora está acompanhando a vaga de ${job.title} na ${job.company}.`,
    });
  };

  return (
    <div className="space-y-6">
      <JobHeader
        job={job}
        applied={applied}
        saved={saved}
        onApply={handleApply}
        onSave={() => {
          toggleSaveJob(job.id);
          toast.success(saved ? "Vaga removida dos salvos" : "Vaga salva", {
            description: saved ? undefined : "Acompanhe na página Candidaturas.",
          });
        }}
      />

      <MatchPanel
        breakdown={match}
        explanation={
          explanation?.text ??
          "A IA está analisando a compatibilidade do seu perfil com esta vaga..."
        }
      />

      <section>
        <h2 className="mb-4 text-lg font-semibold">
          Por que você combina com esta vaga?
        </h2>
        {explanation ? (
          <MatchExplanationCards
            strengths={explanation.strengths}
            gaps={explanation.gaps}
            differentials={explanation.differentials}
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-3">
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} className="h-40" />
            ))}
          </div>
        )}
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Sobre a vaga</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <p className="text-sm leading-relaxed text-muted-foreground">
                {job.description}
              </p>

              <div>
                <h3 className="mb-2.5 flex items-center gap-2 text-sm font-semibold">
                  <ListChecks className="h-4 w-4 text-primary dark:text-primary-foreground" />
                  Responsabilidades
                </h3>
                <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
                  {job.responsibilities.map((r) => (
                    <li key={r}>{r}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="mb-2.5 flex items-center gap-2 text-sm font-semibold">
                  <CircleAlert className="h-4 w-4 text-primary dark:text-primary-foreground" />
                  Requisitos
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {job.requirements.map((r) => {
                    const has = match.matchedSkills.includes(r);
                    return (
                      <Badge
                        key={r}
                        variant={has ? "success" : "destructive"}
                        title={
                          has
                            ? "Você tem esse requisito"
                            : "Requisito não encontrado no seu currículo"
                        }
                      >
                        {has ? "✓" : "✕"} {r}
                      </Badge>
                    );
                  })}
                </div>
              </div>

              <div>
                <h3 className="mb-2.5 flex items-center gap-2 text-sm font-semibold">
                  <Star className="h-4 w-4 text-primary dark:text-primary-foreground" />
                  Diferenciais
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {job.differentials.map((d) => (
                    <Badge key={d} variant="outline">{d}</Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Benefícios</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {job.benefits.map((b) => (
                  <li key={b} className="flex items-start gap-2">
                    <FileCheck2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    {b}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="border-primary/25 bg-primary/5 dark:bg-primary/10">
            <CardContent className="p-5">
              <p className="flex items-center gap-2 text-sm font-semibold">
                <Sparkles className="h-4 w-4 text-primary dark:text-primary-foreground" />
                Aumente suas chances
              </p>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Gere uma versão do seu currículo otimizada para os requisitos
                desta vaga antes de se candidatar.
              </p>
              <button
                onClick={() => setAdaptOpen(true)}
                className="mt-3 w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
              >
                Adaptar currículo
              </button>
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator />

      <AdaptResumeDialog job={job} open={adaptOpen} onOpenChange={setAdaptOpen} />
    </div>
  );
}

