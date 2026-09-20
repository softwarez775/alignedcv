import { Link } from "react-router-dom";
import { Files, Pencil, Copy, Eye, Trash2, FileText } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MatchScore } from "@/components/match/MatchScore";
import { EmptyState } from "@/components/common/EmptyState";
import { useAppStore } from "@/stores/useAppStore";
import { analyzeATS } from "@/lib/engines/ats";
import { calculateMatch } from "@/lib/engines/matching";
import { mockJobList } from "@/lib/mock-data";
import { formatRelativeDate } from "@/lib/utils";

/** Currículos — seção 18 do prompt (versões por vaga) */
export default function Resumes() {
  const resumes = useAppStore((s) => s.resumes);
  const duplicateResume = useAppStore((s) => s.duplicateResume);
  const deleteResume = useAppStore((s) => s.deleteResume);

  if (resumes.length === 0) {
    return (
      <EmptyState
        icon={Files}
        title="Nenhum currículo ainda"
        description="Importe seu currículo na primeira configuração ou crie versões personalizadas a partir de uma vaga."
        action={
          <Button asChild>
            <Link to="/app/vagas">Encontrar vagas</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Currículos</h1>
        <p className="mt-1.5 text-muted-foreground">
          Gerencie seu currículo base e as versões personalizadas por vaga.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {resumes.map((resume) => {
          const ats = analyzeATS(resume);
          const job = resume.jobId
            ? mockJobList.find((j) => j.id === resume.jobId)
            : undefined;
          const match = job ? calculateMatch(resume, job).overall : null;
          return (
            <Card key={resume.id} className="flex flex-col">
              <CardContent className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="flex items-center gap-2 font-semibold">
                      <FileText className="h-4 w-4 shrink-0 text-primary dark:text-primary-foreground" />
                      <span className="truncate">{resume.name}</span>
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {resume.personal.title || "Sem cargo definido"}
                    </p>
                  </div>
                  {resume.isBase && <Badge variant="secondary">Base</Badge>}
                </div>

                <div className="mt-4 flex items-center gap-4 text-sm">
                  <span>
                    <strong className="tabular-nums">{ats.score}</strong>
                    <span className="text-muted-foreground">/100 ATS</span>
                  </span>
                  {match !== null && <MatchScore score={match} size="sm" showLabel={false} />}
                </div>

                <p className="mt-2 text-xs text-muted-foreground">
                  Atualizado {formatRelativeDate(resume.updatedAt)}
                </p>

                <div className="mt-auto flex flex-wrap gap-1.5 border-t pt-4">
                  <Button asChild variant="outline" size="sm">
                    <Link to={`/app/curriculos/${resume.id}/editar`}>
                      <Pencil className="h-3.5 w-3.5" /> Editar
                    </Link>
                  </Button>
                  <Button
                    variant="outline" size="sm"
                    onClick={() => {
                      const id = duplicateResume(resume.id);
                      if (id) {
                        toast.success("Currículo duplicado!", {
                          description: "Edite a cópia sem afetar o original.",
                        });
                      }
                    }}
                  >
                    <Copy className="h-3.5 w-3.5" /> Duplicar
                  </Button>
                  <Button asChild variant="outline" size="sm">
                    <Link to={`/app/curriculos/${resume.id}/editar?preview=1`}>
                      <Eye className="h-3.5 w-3.5" /> Visualizar
                    </Link>
                  </Button>
                  <Button
                    variant="ghost" size="sm"
                    className="text-destructive hover:text-destructive"
                    onClick={() => {
                      if (resume.isBase && resumes.length > 1) {
                        toast.error("Exclua primeiro as versões derivadas ou defina outra base.");
                        return;
                      }
                      deleteResume(resume.id);
                      toast.success("Currículo excluído");
                    }}
                    aria-label={`Excluir ${resume.name}`}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
