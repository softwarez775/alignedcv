import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ATSScore } from "@/components/ats/ATSScore";
import { ResumePreview } from "@/components/resume/ResumePreview";
import { ExportPDFButton } from "@/components/resume/ExportPDFButton";
import { useAppStore } from "@/stores/useAppStore";
import { analyzeATS } from "@/lib/engines/ats";
import { mockJobList } from "@/lib/mock-data";
import { replaceAt } from "@/lib/utils";
import { toast } from "sonner";
import {
  SummaryEditor,
  ExperienceEditor,
  SkillsEditor,
  SimpleListEditor,
  createExperience,
  createEducation,
  createCertification,
  createLanguage,
  createProject,
} from "./resume-editor-sections";
import type { Resume } from "@/types";

/**
 * Editor de currículo ATS — seções 15, 16 e 17 do prompt.
 * Editor à esquerda, preview à direita, ATS Score em tempo real.
 */
export default function ResumeEditor() {
  const { resumeId } = useParams();
  const [searchParams] = useSearchParams();
  const resumes = useAppStore((s) => s.resumes);
  const updateResume = useAppStore((s) => s.updateResume);
  const [tab, setTab] = useState(
    searchParams.get("preview") === "1" ? "preview" : "editor",
  );

  const resume = resumes.find((r) => r.id === resumeId);
  const [prevScore, setPrevScore] = useState<number | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const job = useMemo(
    () => (resume?.jobId ? mockJobList.find((j) => j.id === resume.jobId) : undefined),
    [resume],
  );

  const analysis = useMemo(
    () => (resume ? analyzeATS(resume, job) : null),
    [resume, job],
  );

  useEffect(() => {
    if (analysis && prevScore !== null && analysis.score !== prevScore) {
      toast.success(`ATS Score: ${prevScore} → ${analysis.score}`, {
        description:
          analysis.score > prevScore
            ? "Suas edições melhoraram a compatibilidade com sistemas ATS."
            : "As edições reduziram o score — revise o que foi removido.",
      });
    }
    if (analysis) setPrevScore(analysis.score);
  }, [analysis?.score]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!resume || !analysis) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 lg:grid-cols-2">
          <Skeleton className="h-[500px]" />
          <Skeleton className="h-[500px]" />
        </div>
      </div>
    );
  }

  const patchResume = (patch: Partial<Resume>) => updateResume(resume.id, patch);
  const backTo = job ? `/app/vagas/${job.id}` : "/app/curriculos";

  return (
    <div className="space-y-5">
      <div className="no-print">
        <Button asChild variant="ghost" size="sm" className="-ml-2 mb-2 text-muted-foreground">
          <Link to={backTo}>
            <ArrowLeft className="h-4 w-4" /> Voltar
          </Link>
        </Button>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold tracking-tight md:text-2xl">
              Currículo — {resume.jobTitle ?? resume.personal.title ?? "Minha versão"}
              {job && <span className="text-muted-foreground"> — {job.company}</span>}
            </h1>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {analysis.status === "excellent" && (
                <Badge variant="success">ATS Friendly</Badge>
              )}
              <span className="text-sm font-semibold text-primary dark:text-primary-foreground tabular-nums">
                Score ATS: {analysis.score}/100
              </span>
            </div>
          </div>
          <ExportPDFButton
            targetRef={previewRef}
            fileName={`CV-${resume.personal.name.replace(/\s+/g, "-")}`}
          />
        </div>
      </div>

      <div className="no-print lg:hidden">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="w-full">
            <TabsTrigger value="editor" className="flex-1">Editor</TabsTrigger>
            <TabsTrigger value="preview" className="flex-1">Preview</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className={tab === "editor" ? "space-y-5" : "hidden space-y-5 lg:block"}>
          <section className="rounded-lg border bg-card p-5">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Informações pessoais
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              {(
                [
                  ["name", "Nome completo"],
                  ["title", "Cargo profissional"],
                  ["email", "E-mail"],
                  ["phone", "Telefone"],
                  ["location", "Localização"],
                  ["linkedin", "LinkedIn"],
                  ["github", "GitHub"],
                  ["portfolio", "Portfolio"],
                ] as const
              ).map(([key, label]) => (
                <div key={key} className="space-y-1.5">
                  <Label htmlFor={`pe-${key}`}>{label}</Label>
                  <Input
                    id={`pe-${key}`}
                    value={resume.personal[key]}
                    onChange={(e) =>
                      patchResume({
                        personal: { ...resume.personal, [key]: e.target.value },
                      })
                    }
                  />
                </div>
              ))}
            </div>
          </section>

          <SummaryEditor
            summary={resume.summary}
            onChange={(v) => patchResume({ summary: v })}
          />

          <section className="rounded-lg border bg-card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Experiência profissional
              </h3>
              <Button variant="ghost" size="sm"
                onClick={() =>
                  patchResume({ experiences: [...resume.experiences, createExperience()] })
                }>
                Adicionar
              </Button>
            </div>
            <div className="space-y-4">
              {resume.experiences.map((exp) => (
                <ExperienceEditor
                  key={exp.id}
                  experience={exp}
                  onChange={(patch) =>
                    patchResume({
                      experiences: resume.experiences.map((e) =>
                        e.id === exp.id ? { ...e, ...patch } : e,
                      ),
                    })
                  }
                  onRemove={() =>
                    patchResume({
                      experiences: resume.experiences.filter((e) => e.id !== exp.id),
                    })
                  }
                />
              ))}
              {resume.experiences.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Nenhuma experiência. Adicione a mais recente primeiro.
                </p>
              )}
            </div>
          </section>

          <SkillsEditor
            skills={resume.skills}
            onChange={(v) => patchResume({ skills: v })}
          />
          <SimpleListEditor
            title="Formação"
            items={resume.education}
            onCreate={createEducation}
            onChange={(i, value) =>
              patchResume({ education: replaceAt(resume.education, i, value) })
            }
            onRemove={(i) =>
              patchResume({ education: resume.education.filter((_, idx) => idx !== i) })
            }
            render={(edu, update) => (
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label>Instituição</Label>
                  <Input value={edu.institution}
                    onChange={(e) => update({ institution: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Período</Label>
                  <Input placeholder="2017 — 2021" value={edu.period}
                    onChange={(e) => update({ period: e.target.value })} />
                </div>
                <div className="space-y-1.5 sm:col-span-3">
                  <Label>Curso</Label>
                  <Input value={edu.course}
                    onChange={(e) => update({ course: e.target.value })} />
                </div>
              </div>
            )}
          />
          <SimpleListEditor
            title="Certificações"
            items={resume.certifications}
            onCreate={createCertification}
            onChange={(i, value) =>
              patchResume({ certifications: replaceAt(resume.certifications, i, value) })
            }
            onRemove={(i) =>
              patchResume({
                certifications: resume.certifications.filter((_, idx) => idx !== i),
              })
            }
            render={(cert, update) => (
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="space-y-1.5 sm:col-span-2">
                  <Label>Nome</Label>
                  <Input value={cert.name}
                    onChange={(e) => update({ name: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Ano</Label>
                  <Input placeholder="2023" value={cert.year}
                    onChange={(e) => update({ year: e.target.value })} />
                </div>
                <div className="space-y-1.5 sm:col-span-3">
                  <Label>Emissor</Label>
                  <Input value={cert.issuer}
                    onChange={(e) => update({ issuer: e.target.value })} />
                </div>
              </div>
            )}
          />
          <SimpleListEditor
            title="Idiomas"
            items={resume.languages}
            onCreate={createLanguage}
            onChange={(i, value) =>
              patchResume({ languages: replaceAt(resume.languages, i, value) })
            }
            onRemove={(i) =>
              patchResume({ languages: resume.languages.filter((_, idx) => idx !== i) })
            }
            render={(lang, update) => (
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Idioma</Label>
                  <Input value={lang.name}
                    onChange={(e) => update({ name: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Nível</Label>
                  <Input placeholder="Avançado" value={lang.level}
                    onChange={(e) => update({ level: e.target.value as typeof lang.level })} />
                </div>
              </div>
            )}
          />
          <SimpleListEditor
            title="Projetos"
            items={resume.projects}
            onCreate={createProject}
            onChange={(i, value) =>
              patchResume({ projects: replaceAt(resume.projects, i, value) })
            }
            onRemove={(i) =>
              patchResume({ projects: resume.projects.filter((_, idx) => idx !== i) })
            }
            render={(proj, update) => (
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <Label>Nome</Label>
                  <Input value={proj.name}
                    onChange={(e) => update({ name: e.target.value })} />
                </div>
                <div className="space-y-1.5">
                  <Label>Link</Label>
                  <Input value={proj.link}
                    onChange={(e) => update({ link: e.target.value })} />
                </div>
                <div className="space-y-1.5 sm:col-span-2">
                  <Label>Descrição</Label>
                  <Input value={proj.description}
                    onChange={(e) => update({ description: e.target.value })} />
                </div>
              </div>
            )}
          />
        </div>

        <div className={tab === "preview" ? "" : "hidden lg:block"}>
          <div ref={previewRef}>
            <ResumePreview resume={resume} />
          </div>
          <div className="no-print mt-4 rounded-lg border bg-card p-5">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Análise ATS em tempo real
            </h3>
            <ATSScore analysis={analysis} showDimensions size="md" />
          </div>
        </div>
      </div>
    </div>
  );
}

