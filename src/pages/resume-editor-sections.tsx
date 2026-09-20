import { useState } from "react";
import { Plus, Trash2, Sparkles, Check, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AIProcessing } from "@/components/ai/AIInsight";
import { aiService } from "@/lib/ai";
import { uid } from "@/lib/utils";
import { useAIProcess } from "@/hooks/use-theme";
import type {
  AIImproveAction,
  Certification,
  Education,
  Experience,
  LanguageSkill,
  Project,
  Resume,
} from "@/types";

const IMPROVE_OPTIONS: Array<{ action: AIImproveAction; label: string }> = [
  { action: "professional", label: "Tornar mais profissional" },
  { action: "keywords", label: "Adicionar palavras-chave" },
  { action: "impact", label: "Melhorar impacto" },
  { action: "objective", label: "Tornar mais objetivo" },
  { action: "grammar", label: "Corrigir gramática" },
  { action: "quantify", label: "Quantificar resultados" },
];

export const IMPROVE_LABELS: Record<AIImproveAction, string> = {
  professional: "Tornar mais profissional",
  keywords: "Adicionar palavras-chave",
  impact: "Melhorar impacto",
  objective: "Tornar mais objetivo",
  grammar: "Corrigir gramática",
  quantify: "Quantificar resultados",
};

/** Botão "Melhorar com IA" com menu de ações — seções 15 e 16 */
export function ImproveWithAIButton({
  onImprove,
  disabled,
  label = "Melhorar com IA",
}: {
  onImprove: (action: AIImproveAction) => void;
  disabled?: boolean;
  label?: string;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" disabled={disabled}>
          <Sparkles className="h-3.5 w-3.5 text-primary dark:text-primary-foreground" />
          {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {IMPROVE_OPTIONS.map((opt) => (
          <DropdownMenuItem key={opt.action} onClick={() => onImprove(opt.action)}>
            {opt.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** Editor de seção genérico com título + remover */
export function SectionShell({
  title,
  onAdd,
  addLabel,
  children,
}: {
  title: string;
  onAdd?: () => void;
  addLabel?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-lg border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          {title}
        </h3>
        {onAdd && (
          <Button variant="ghost" size="sm" onClick={onAdd}>
            <Plus className="h-3.5 w-3.5" /> {addLabel ?? "Adicionar"}
          </Button>
        )}
      </div>
      <div className="space-y-4">{children}</div>
    </section>
  );
}

/** Editor de Resumo com contador + melhoria por IA */
export function SummaryEditor({
  summary,
  onChange,
}: {
  summary: string;
  onChange: (v: string) => void;
}) {
  const process = useAIProcess<string>();
  const [showCompare, setShowCompare] = useState<string | null>(null);

  const improve = async (action: AIImproveAction) => {
    const result = await process.run(
      [{ message: "Otimizando resumo..." }],
      () => aiService.improveSummary(summary, action),
    );
    setShowCompare(result);
  };

  return (
    <SectionShell title="Resumo Profissional">
      {process.status === "processing" && <AIProcessing message={process.message} />}
      {process.status === "done" && showCompare !== null && (
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border bg-secondary/50 p-3">
            <p className="mb-1.5 text-xs font-semibold text-muted-foreground">Antes</p>
            <p className="text-sm text-muted-foreground">{summary || "—"}</p>
          </div>
          <div className="rounded-lg border border-success/40 bg-success/5 p-3">
            <p className="mb-1.5 flex items-center justify-between text-xs font-semibold text-success">
              Depois
              <span className="flex gap-1">
                <Button size="sm" variant="ghost" className="h-6 px-2 text-xs"
                  onClick={() => setShowCompare(null)}>
                  <X className="h-3 w-3" /> Descartar
                </Button>
                <Button size="sm" className="h-6 px-2 text-xs"
                  onClick={() => {
                    onChange(showCompare);
                    setShowCompare(null);
                  }}>
                  <Check className="h-3 w-3" /> Aplicar
                </Button>
              </span>
            </p>
            <p className="text-sm">{showCompare}</p>
          </div>
        </div>
      )}
      <div className="space-y-2">
        <Textarea
          placeholder="Resuma sua trajetória em 3–4 linhas: área, anos de experiência, principais competências e diferenciais."
          className="min-h-[90px]"
          value={summary}
          onChange={(e) => onChange(e.target.value)}
          aria-label="Resumo profissional"
        />
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {summary.length} caracteres {summary.length > 500 && "· considere encurtar"}
          </span>
          <ImproveWithAIButton onImprove={improve} disabled={!summary.trim()} />
        </div>
      </div>
    </SectionShell>
  );
}
/** Editor de uma experiência profissional — seção 16 */
export function ExperienceEditor({
  experience,
  onChange,
  onRemove,
}: {
  experience: Experience;
  onChange: (patch: Partial<Experience>) => void;
  onRemove: () => void;
}) {
  const process = useAIProcess<Experience>();
  const [improved, setImproved] = useState<Experience | null>(null);

  const improve = async (action: AIImproveAction) => {
    const result = await process.run(
      [{ message: "Otimizando descrição com IA..." }],
      () => aiService.improveExperience(experience, action),
    );
    setImproved(result);
  };

  return (
    <div className="rounded-lg border bg-card p-4">
      {process.status === "processing" && <AIProcessing message={process.message} />}
      {process.status === "done" && improved && (
        <div className="mb-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-lg border bg-secondary/50 p-3">
            <p className="mb-1.5 text-xs font-semibold text-muted-foreground">Antes</p>
            <p className="text-sm text-muted-foreground">{experience.description}</p>
          </div>
          <div className="rounded-lg border border-success/40 bg-success/5 p-3">
            <p className="mb-1.5 flex items-center justify-between text-xs font-semibold text-success">
              Depois
              <span className="flex gap-1">
                <Button size="sm" variant="ghost" className="h-6 px-2 text-xs"
                  onClick={() => setImproved(null)}>
                  <X className="h-3 w-3" /> Descartar
                </Button>
                <Button size="sm" className="h-6 px-2 text-xs"
                  onClick={() => {
                    onChange({ description: improved.description });
                    setImproved(null);
                  }}>
                  <Check className="h-3 w-3" /> Aplicar
                </Button>
              </span>
            </p>
            <p className="text-sm">{improved.description}</p>
          </div>
        </div>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Cargo</Label>
          <Input value={experience.role}
            onChange={(e) => onChange({ role: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label>Empresa</Label>
          <Input value={experience.company}
            onChange={(e) => onChange({ company: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label>Período</Label>
          <Input placeholder="Ex.: 2022 — atual" value={experience.period}
            onChange={(e) => onChange({ period: e.target.value })} />
        </div>
        <div className="space-y-1.5">
          <Label>Localização</Label>
          <Input placeholder="Ex.: São Paulo — SP" value={experience.location}
            onChange={(e) => onChange({ location: e.target.value })} />
        </div>
      </div>

      <div className="mt-3 space-y-1.5">
        <Label>Descrição</Label>
        <Textarea className="min-h-[70px]" value={experience.description}
          onChange={(e) => onChange({ description: e.target.value })}
          placeholder="Descreva suas atividades e responsabilidades." />
      </div>

      <div className="mt-3 space-y-1.5">
        <Label>Conquistas (uma por linha)</Label>
        <Textarea
          className="min-h-[60px]"
          placeholder={"Ex.: Reduzi o tempo de carregamento em 40%\nEx.: Liderei migração para TypeScript"}
          value={experience.achievements.join("\n")}
          onChange={(e) =>
            onChange({
              achievements: e.target.value.split("\n").filter((l) => l.trim()),
            })
          }
        />
      </div>

      <div className="mt-3 space-y-1.5">
        <Label>Tecnologias utilizadas (separadas por vírgula)</Label>
        <Input
          value={experience.skills.join(", ")}
          onChange={(e) =>
            onChange({
              skills: e.target.value.split(",").map((s) => s.trim()).filter(Boolean),
            })
          }
        />
      </div>

      <div className="mt-3 flex items-center justify-between border-t pt-3">
        <ImproveWithAIButton
          onImprove={improve}
          disabled={!experience.description.trim()}
        />
        <Button variant="ghost" size="sm" onClick={onRemove}
          className="text-destructive hover:text-destructive">
          <Trash2 className="h-3.5 w-3.5" /> Remover
        </Button>
      </div>
    </div>
  );
}

/** Editor de competências com sistema de tags — seção 10 */
export function SkillsEditor({
  skills,
  onChange,
}: {
  skills: string[];
  onChange: (v: string[]) => void;
}) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const value = draft.trim();
    if (value && !skills.includes(value)) onChange([...skills, value]);
    setDraft("");
  };

  return (
    <SectionShell title="Competências">
      <div className="flex gap-2">
        <Input
          placeholder="Digite uma competência e pressione Enter"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
        />
        <Button onClick={add} variant="secondary" aria-label="Adicionar competência">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {skills.map((skill) => (
            <Badge key={skill} variant="secondary" className="gap-1 pl-2.5">
              {skill}
              <button
                onClick={() => onChange(skills.filter((s) => s !== skill))}
                className="rounded-full p-0.5 hover:bg-foreground/10"
                aria-label={`Remover ${skill}`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </SectionShell>
  );
}

/** Editor de listas simples (formação, certificações, idiomas, projetos) */
export function SimpleListEditor<T>({
  title,
  items,
  onCreate,
  onChange,
  onRemove,
  render,
}: {
  title: string;
  items: T[];
  onCreate: () => T;
  onChange: (index: number, value: T) => void;
  onRemove: (index: number) => void;
  render: (item: T, update: (patch: Partial<T>) => void) => React.ReactNode;
}) {
  return (
    <SectionShell title={title} onAdd={() => onChange(items.length, onCreate())}
      addLabel="Adicionar">
      {items.length === 0 && (
        <p className="text-sm text-muted-foreground">
          Nenhum item. Clique em “Adicionar” para começar.
        </p>
      )}
      {items.map((item, i) => (
        <div key={i} className="rounded-lg border bg-card p-4">
          {render(item, (patch) => onChange(i, { ...item, ...patch }))}
          <div className="mt-3 flex justify-end border-t pt-3">
            <Button variant="ghost" size="sm" onClick={() => onRemove(i)}
              className="text-destructive hover:text-destructive">
              <Trash2 className="h-3.5 w-3.5" /> Remover
            </Button>
          </div>
        </div>
      ))}
    </SectionShell>
  );
}

export const createEducation = (): Education => ({
  id: uid("edu"),
  institution: "",
  course: "",
  period: "",
});

export const createCertification = (): Certification => ({
  id: uid("cert"),
  name: "",
  issuer: "",
  year: "",
});

export const createLanguage = (): LanguageSkill => ({
  id: uid("lang"),
  name: "",
  level: "Intermediário",
});

export const createProject = (): Project => ({
  id: uid("proj"),
  name: "",
  description: "",
  skills: [],
  link: "",
});

export function createExperience(): Experience {
  return {
    id: uid("exp"),
    company: "",
    role: "",
    period: "",
    location: "",
    description: "",
    achievements: [],
    skills: [],
  };
}

export type { Resume };

