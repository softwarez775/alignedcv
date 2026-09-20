import { useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { Building2, FileText, GripVertical, Trash2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MatchScore } from "@/components/match/MatchScore";
import { useAppStore } from "@/stores/useAppStore";
import { cn } from "@/lib/utils";
import type { Application, ApplicationStatus, Job } from "@/types";

export const APPLICATION_COLUMNS: Array<{
  status: ApplicationStatus;
  label: string;
  hint: string;
}> = [
  { status: "saved", label: "Salvas", hint: "Vagas que você guardou" },
  { status: "applied", label: "Candidatura enviada", hint: "Aguardando retorno" },
  { status: "reviewing", label: "Em análise", hint: "Sua candidatura foi vista" },
  { status: "interview", label: "Entrevista", hint: "Processos em andamento" },
  { status: "offer", label: "Oferta", hint: "Quase lá!" },
  { status: "closed", label: "Encerrada", hint: "Concluídas ou arquivadas" },
];

/** Card de candidatura no Kanban */
export function ApplicationCard({
  application,
  job,
  matchScore,
  onRemove,
}: {
  application: Application;
  job: Job;
  matchScore: number;
  onRemove: () => void;
}) {
  const resumeUsed = useAppStore((s) =>
    s.resumes.find((r) => r.id === application.resumeId),
  );
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: application.id,
  });

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform) }}
      className={cn(
        "rounded-lg border bg-card p-3 shadow-sm transition-shadow",
        isDragging && "z-10 cursor-grabbing shadow-lg opacity-90",
      )}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-start gap-2">
        <GripVertical className="mt-0.5 h-4 w-4 shrink-0 cursor-grab text-muted-foreground/60" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold leading-snug">{job.title}</p>
          <p className="truncate text-xs text-muted-foreground">{job.company}</p>
          <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
            <MatchScore score={matchScore} size="sm" showLabel={false} />
            <span>
              {new Date(application.appliedAt).toLocaleDateString("pt-BR")}
            </span>
          </div>
          {resumeUsed && (
            <p className="mt-1.5 inline-flex max-w-full items-center gap-1 truncate text-[11px] text-muted-foreground">
              <FileText className="h-3 w-3 shrink-0" /> {resumeUsed.name}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/** Coluna do Kanban */
export function ApplicationColumn({
  status,
  applications,
  jobs,
  matchScores,
  onRemove,
}: {
  status: ApplicationStatus;
  applications: Application[];
  jobs: Record<string, Job>;
  matchScores: Record<string, number>;
  onRemove: (id: string) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });
  const column = APPLICATION_COLUMNS.find((c) => c.status === status)!;

  return (
    <div className="flex min-h-[220px] w-72 shrink-0 flex-col rounded-xl bg-secondary/60 p-3 md:w-64">
      <div className="mb-3 flex items-center justify-between px-1">
        <div>
          <p className="text-sm font-semibold">{column.label}</p>
          <p className="text-[11px] text-muted-foreground">{column.hint}</p>
        </div>
        <Badge variant="secondary">{applications.length}</Badge>
      </div>
      <div
        ref={setNodeRef}
        className={cn(
          "flex flex-1 flex-col gap-2.5 rounded-lg p-1 transition-colors",
          isOver && "bg-primary/5 ring-2 ring-inset ring-primary/30",
        )}
      >
        {applications.map((app) => {
          const job = jobs[app.jobId];
          if (!job) return null;
          return (
            <ApplicationCard
              key={app.id}
              application={app}
              job={job}
              matchScore={matchScores[app.jobId] ?? 0}
              onRemove={() => onRemove(app.id)}
            />
          );
        })}
        {applications.length === 0 && (
          <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed p-4">
            <p className="flex items-center gap-1.5 text-center text-xs text-muted-foreground">
              <Building2 className="h-3.5 w-3.5" /> Arraste cards para cá
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/** Botão de excluir (fora do card arrastável, no menu da coluna) */
export function RemoveApplicationButton({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="ghost" size="icon" onClick={onClick} aria-label="Excluir candidatura">
      <Trash2 className="h-4 w-4 text-muted-foreground" />
    </Button>
  );
}
