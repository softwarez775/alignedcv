import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ScanSearch } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ATSScore, ATSIssueList } from "@/components/ats/ATSScore";
import { useAppStore } from "@/stores/useAppStore";
import { analyzeATS } from "@/lib/engines/ats";
import { mockJobList } from "@/lib/mock-data";

/** Análise ATS — seções 12 e 13 do prompt */
export default function ATSAnalyzer() {
  const resumes = useAppStore((s) => s.resumes);
  const [resumeId, setResumeId] = useState<string | undefined>(undefined);

  const resume = resumes.find((r) => r.id === resumeId) ?? resumes[0];
  const job = useMemo(
    () => (resume?.jobId ? mockJobList.find((j) => j.id === resume.jobId) : undefined),
    [resume],
  );
  const analysis = useMemo(
    () => (resume ? analyzeATS(resume, job) : null),
    [resume, job],
  );

  if (!resume || !analysis) return null;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Análise ATS</h1>
          <p className="mt-1.5 text-muted-foreground">
            Descubra como seu currículo será interpretado por sistemas de recrutamento.
          </p>
        </div>
        {resumes.length > 1 && (
          <Select
            value={resume.id}
            onValueChange={(v) => setResumeId(v)}
          >
            <SelectTrigger className="w-64" aria-label="Selecionar currículo">
              <SelectValue placeholder="Selecione o currículo" />
            </SelectTrigger>
            <SelectContent>
              {resumes.map((r) => (
                <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Score principal */}
      <Card>
        <CardContent className="flex flex-col items-start gap-6 p-6 md:flex-row md:items-center">
          <div className="flex items-center gap-5">
            <div>
              <div className="text-5xl font-bold tabular-nums">
                {analysis.score}
                <span className="text-2xl font-semibold text-muted-foreground">/100</span>
              </div>
              {analysis.status === "excellent" && (
                <Badge variant="success" className="mt-2">ATS Friendly</Badge>
              )}
              {analysis.status === "good" && (
                <Badge variant="secondary" className="mt-2">Quase lá</Badge>
              )}
            </div>
          </div>
          <div className="w-full flex-1 md:pl-6">
            <ATSScore analysis={analysis} showDimensions />
          </div>
        </CardContent>
      </Card>

      {/* Problemas encontrados */}
      <section>
        <h2 className="mb-3 text-lg font-semibold">Problemas encontrados</h2>
        <ATSIssueList issues={analysis.issues} />
      </section>

      {/* Ações */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button asChild>
          <Link to={`/app/curriculos/${resume.id}/editar`}>
            <ScanSearch className="h-4 w-4" /> Otimizar currículo agora
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/app/vagas">Encontrar vagas compatíveis</Link>
        </Button>
      </div>
    </div>
  );
}
