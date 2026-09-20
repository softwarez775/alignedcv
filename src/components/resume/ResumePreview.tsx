import type { Resume } from "@/types";
import { cn } from "@/lib/utils";

/**
 * Preview do currículo — formato ATS: coluna única, sem tabelas/imagens.
 * A versão impressa (window.print) gera PDF com texto selecionável.
 */
export function ResumePreview({
  resume,
  className,
}: {
  resume: Resume;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[210mm] rounded-lg border bg-white p-8 text-[13px] leading-relaxed text-zinc-900 shadow-sm",
        className,
      )}
    >
      <header>
        <h1 className="text-xl font-bold tracking-tight">
          {resume.personal.name || "Seu nome"}
        </h1>
        <p className="text-sm font-medium text-indigo-700">
          {resume.personal.title || "Cargo profissional"}
        </p>
        <p className="mt-2 text-[12px] text-zinc-600">
          {[resume.personal.email, resume.personal.phone, resume.personal.location]
            .filter(Boolean)
            .join(" · ")}
        </p>
        {(resume.personal.linkedin || resume.personal.github || resume.personal.portfolio) && (
          <p className="text-[12px] text-zinc-600">
            {[resume.personal.linkedin, resume.personal.github, resume.personal.portfolio]
              .filter(Boolean)
              .join(" · ")}
          </p>
        )}
      </header>

      <hr className="my-4 border-zinc-200" />

      {resume.summary && (
        <section>
          <h2 className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-zinc-800">
            Resumo Profissional
          </h2>
          <p>{resume.summary}</p>
        </section>
      )}

      {resume.experiences.length > 0 && (
        <section className="mt-4">
          <h2 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-zinc-800">
            Experiência Profissional
          </h2>
          <div className="space-y-3">
            {resume.experiences.map((exp) => (
              <article key={exp.id}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-2">
                  <h3 className="font-semibold">{exp.role} — {exp.company}</h3>
                  <span className="text-[12px] text-zinc-500">{exp.period}</span>
                </div>
                {exp.location && <p className="text-[12px] text-zinc-500">{exp.location}</p>}
                {exp.description && <p className="mt-1">{exp.description}</p>}
                {exp.achievements.length > 0 && (
                  <ul className="mt-1 list-disc space-y-0.5 pl-5">
                    {exp.achievements.map((a, i) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                )}
                {exp.skills.length > 0 && (
                  <p className="mt-1 text-[12px] text-zinc-600">
                    <span className="font-medium">Tecnologias:</span> {exp.skills.join(", ")}
                  </p>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {resume.education.length > 0 && (
        <section className="mt-4">
          <h2 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-zinc-800">
            Formação
          </h2>
          {resume.education.map((edu) => (
            <div key={edu.id} className="mb-1.5 flex flex-wrap items-baseline justify-between gap-x-2">
              <p className="font-semibold">{edu.course}</p>
              <span className="text-[12px] text-zinc-500">{edu.period}</span>
              <p className="w-full text-[12px] text-zinc-500">{edu.institution}</p>
            </div>
          ))}
        </section>
      )}

      {resume.skills.length > 0 && (
        <section className="mt-4">
          <h2 className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-zinc-800">
            Competências
          </h2>
          <p>{resume.skills.join(" · ")}</p>
        </section>
      )}

      {resume.projects.length > 0 && (
        <section className="mt-4">
          <h2 className="mb-2 text-[11px] font-bold uppercase tracking-wider text-zinc-800">
            Projetos
          </h2>
          {resume.projects.map((proj) => (
            <article key={proj.id} className="mb-2">
              <h3 className="font-semibold">{proj.name}</h3>
              <p>{proj.description}</p>
              {proj.link && <p className="text-[12px] text-zinc-600">{proj.link}</p>}
            </article>
          ))}
        </section>
      )}

      {resume.certifications.length > 0 && (
        <section className="mt-4">
          <h2 className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-zinc-800">
            Certificações
          </h2>
          <ul className="space-y-0.5">
            {resume.certifications.map((c) => (
              <li key={c.id}>{c.name} — {c.issuer} ({c.year})</li>
            ))}
          </ul>
        </section>
      )}

      {resume.languages.length > 0 && (
        <section className="mt-4">
          <h2 className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-zinc-800">
            Idiomas
          </h2>
          <p>{resume.languages.map((l) => `${l.name} (${l.level})`).join(" · ")}</p>
        </section>
      )}
    </div>
  );
}
