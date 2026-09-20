import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  closestCorners,
} from "@dnd-kit/core";
import type { Job } from "@/types";
import { KanbanSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  ApplicationColumn,
  APPLICATION_COLUMNS,
} from "@/components/applications/ApplicationKanban";
import { EmptyState } from "@/components/common/EmptyState";
import { useAppStore } from "@/stores/useAppStore";
import { calculateMatch } from "@/lib/engines/matching";
import { mockJobList } from "@/lib/mock-data";
import type { ApplicationStatus } from "@/types";

/** Candidaturas — seção 19 do prompt (Kanban com drag & drop) */
export default function Applications() {
  const applications = useAppStore((s) => s.applications);
  const moveApplication = useAppStore((s) => s.moveApplication);
  const removeApplication = useAppStore((s) => s.removeApplication);
  const baseResume = useAppStore((s) => s.baseResume);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 6 } }),
  );

  const jobsById = useMemo(() => {
    const map: Record<string, Job> = {};
    for (const job of mockJobList) map[job.id] = job;
    return map;
  }, []);

  const matchScores = useMemo(() => {
    const map: Record<string, number> = {};
    if (baseResume) {
      for (const job of mockJobList) {
        map[job.id] = calculateMatch(baseResume, job).overall;
      }
    }
    return map;
  }, [baseResume]);

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;
    const status = over.id as ApplicationStatus;
    const app = applications.find((a) => a.id === active.id);
    if (app && app.status !== status) {
      moveApplication(app.id, status);
      const column = APPLICATION_COLUMNS.find((c) => c.status === status);
      toast.success(`Candidatura movida para "${column?.label}"`);
    }
  };

  if (applications.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Candidaturas</h1>
          <p className="mt-1.5 text-muted-foreground">
            Acompanhe cada etapa do seu processo seletivo em um Kanban.
          </p>
        </div>
        <EmptyState
          icon={KanbanSquare}
          title="Nenhuma candidatura ainda"
          description="Encontre uma vaga com bom Match e clique em “Quero me candidatar” — ela aparecerá aqui."
          action={
            <Button asChild>
              <Link to="/app/vagas">Encontrar vagas</Link>
            </Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Candidaturas</h1>
        <p className="mt-1.5 text-muted-foreground">
          Arraste os cards entre as colunas para atualizar o status.
        </p>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={({ active }) => setActiveId(String(active.id))}
        onDragEnd={onDragEnd}
      >
        <div className="flex gap-4 overflow-x-auto pb-4">
          {APPLICATION_COLUMNS.map((col) => (
            <ApplicationColumn
              key={col.status}
              status={col.status}
              applications={applications.filter((a) => a.status === col.status)}
              jobs={jobsById}
              matchScores={matchScores}
              onRemove={removeApplication}
            />
          ))}
        </div>
      </DndContext>
      {activeId && (
        <p className="text-xs text-muted-foreground">Solte o card na coluna desejada…</p>
      )}
    </div>
  );
}
