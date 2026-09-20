import type {
  AdaptAnalysis,
  AIImproveAction,
  ATSAnalysis,
  Experience,
  Job,
  MatchBreakdown,
  Resume,
  SmartProfile,
} from "@/types";
import { analyzeATS } from "@/lib/engines/ats";
import { calculateMatch, getExperienceYears } from "@/lib/engines/matching";
import type { AIService, MatchExplanation } from "./index";

/**
 * Provider de IA mockado — determinístico, baseado exclusivamente
 * nas informações que o usuário informou.
 *
 * REGRA CRÍTICA: nunca fabrica empregos, empresas, tecnologias,
 * certificações, resultados, números, cargos ou formação.
 * Apenas reorganiza, resume, melhora a linguagem e sugere o que falta.
 */

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

function normalize(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

/** Competências presentes no currículo (nunca inventa) */
function resumeSkills(resume: Resume): Set<string> {
  const set = new Set(resume.skills);
  for (const exp of resume.experiences) exp.skills.forEach((s) => set.add(s));
  for (const proj of resume.projects) proj.skills.forEach((s) => set.add(s));
  return set;
}

/** Competências mais citadas nas experiências (frequência real) */
function topSkills(resume: Resume, limit = 8): string[] {
  const freq = new Map<string, number>();
  for (const exp of resume.experiences)
    for (const s of exp.skills) freq.set(s, (freq.get(s) ?? 0) + 2);
  for (const s of resume.skills) freq.set(s, (freq.get(s) ?? 0) + 1);
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([s]) => s);
}

function estimateSeniority(resume: Resume): SmartProfile["seniority"] {
  const years = getExperienceYears(resume);
  if (years >= 10) return "Especialista";
  if (years >= 6) return "Sênior";
  if (years >= 3) return "Pleno";
  if (years >= 1) return "Júnior";
  return "Estágio";
}

function guessArea(resume: Resume): string {
  const blob = normalize(
    resume.skills.join(" ") +
      " " +
      resume.experiences.map((e) => `${e.role} ${e.description}`).join(" "),
  );
  if (/react|typescript|front-end|frontend|css|html/.test(blob))
    return "Desenvolvimento de Software";
  if (/figma|design|prot/.test(blob)) return "Design";
  if (/sql|dados|anal/.test(blob)) return "Análise de Sistemas";
  return "Tecnologia";
}

function guessAreas(resume: Resume): string[] {
  const blob = normalize(resume.skills.join(" "));
  const areas: string[] = [];
  if (/react|front|css|html/.test(blob)) areas.push("Front-end");
  if (/node|api|sql/.test(blob)) areas.push("Full Stack");
  areas.push("Desenvolvimento Web");
  return [...new Set(areas)];
}

function guessRoles(resume: Resume): string[] {
  const blob = normalize(
    resume.skills.join(" ") + " " + resume.experiences.map((e) => e.role).join(" "),
  );
  const roles: string[] = [];
  if (/react|front/.test(blob)) roles.push("Desenvolvedor Front-end");
  if (/node|api/.test(blob)) roles.push("Desenvolvedor Full Stack");
  if (/react/.test(blob)) roles.push("Desenvolvedor React");
  if (roles.length === 0) roles.push("Desenvolvedor Web");
  return [...new Set(roles)];
}

function buildProfileSummary(resume: Resume): string {
  const years = getExperienceYears(resume);
  const title = resume.personal.title || "profissional";
  const seniority = estimateSeniority(resume);
  const main = topSkills(resume, 4);
  const company = resume.experiences[0]?.company;
  return (
    `Profissional ${seniority.toLowerCase()} de ${title.toLowerCase()} com ${years} anos de experiência` +
    (main.length ? `, com domínio de ${main.join(", ")}` : "") +
    (company ? `. Histórico de atuação em empresas como ${company}` : "") +
    ", com foco em entregas mensuráveis e evolução contínua."
  );
}

/** Texto completo do currículo para checar presença de termos */
function resumeBlob(resume: Resume): string {
  return normalize(
    [
      resume.summary,
      ...resume.experiences.map(
        (e) => `${e.role} ${e.company} ${e.description} ${e.achievements.join(" ")} ${e.skills.join(" ")}`,
      ),
      ...resume.skills,
      ...resume.projects.map((p) => `${p.name} ${p.description}`),
    ].join(" "),
  );
}

// ── Melhoria de texto (nunca adiciona fatos, só linguagem) ────────

const WEAK_STARTS: Array<[RegExp, string]> = [
  [/^trabalhei (com|no|na) (o |a )?/i, ""],
  [/^fui responsável por /i, ""],
  [/^responsável por /i, ""],
  [/^atuei como /i, ""],
  [/^participei de /i, "Contribuí com "],
  [/^ajudei /i, "Apoiei "],
];

function cleanWeakStarts(text: string): string {
  let out = text.trim();
  for (const [re, replacement] of WEAK_STARTS) {
    if (re.test(out)) {
      out = out.replace(re, replacement);
      break;
    }
  }
  return out;
}

function capitalize(text: string): string {
  const t = text.trim();
  return t.charAt(0).toUpperCase() + t.slice(1);
}

function ensurePeriod(text: string): string {
  const t = text.trim();
  return /[.!?]$/.test(t) ? t : `${t}.`;
}

/**
 * Melhora o texto da experiência. Só reescreve a linguagem:
 * o conteúdo factual (empresa, cargo, tecnologias, números) permanece.
 */
export function improveExperienceText(
  text: string,
  action: AIImproveAction,
): string {
  if (!text.trim()) return text;
  let out = text.trim();

  if (action === "professional") {
    out = cleanWeakStarts(out);
    out = out.replace(/\bfiz\b|\bfaço\b/gi, "realizei");
    out = out.replace(/\bcoisas\b/gi, "atividades");
    return ensurePeriod(capitalize(out));
  }
  if (action === "objective") {
    const sentences = out.split(/(?<=[.!?])\s+/);
    const keep = sentences.slice(0, 2).join(" ");
    return ensurePeriod(capitalize(cleanWeakStarts(keep || out)));
  }
  if (action === "grammar") {
    out = out.replace(/\s{2,}/g, " ");
    out = out.replace(/\s+([,.;:])/g, "$1");
    return ensurePeriod(capitalize(out.trim()));
  }
  // impact / keywords / quantify → linguagem mais direta, fatos preservados
  return ensurePeriod(capitalize(cleanWeakStarts(out)));
}

/** Aplica melhoria de linguagem preservando todo o conteúdo factual */
function improvedCopy(text: string, action: AIImproveAction): string {
  const cleaned = improveExperienceText(text, action);
  return cleaned === text.trim() ? text : cleaned;
}

export const mockAIProvider: AIService = {
  async analyzeResume(resume) {
    await delay(1400);
    return {
      seniority: estimateSeniority(resume),
      area: guessArea(resume),
      skills: topSkills(resume),
      summary: buildProfileSummary(resume),
      recommendedAreas: guessAreas(resume),
      recommendedRoles: guessRoles(resume),
      totalSkills: resumeSkills(resume).size,
      generatedAt: Date.now(),
    };
  },

  async calculateMatch(resume, job) {
    await delay(900);
    return calculateMatch(resume, job);
  },

  async analyzeJob(job, resume) {
    await delay(1100);
    const match = calculateMatch(resume, job);
    const strengths = match.matchedSkills.slice(0, 6);
    const gaps = match.missingSkills.slice(0, 4);
    const skillBlob = normalize(
      resume.skills.join(" ") + " " + resumeBlob(resume),
    );
    const differentials = job.differentials.filter((d) =>
      skillBlob.includes(normalize(d).split(/\s+/)[0]),
    );
    const text =
      `Seu perfil possui ${match.overall >= 80 ? "alta" : "boa"} compatibilidade com esta oportunidade. ` +
      (strengths.length >= 2
        ? `Sua experiência com ${strengths[0]} e ${strengths[1]} atende diretamente aos principais requisitos da vaga. `
        : "Seu histórico atende parte dos requisitos da vaga. ") +
      (gaps.length
        ? `O principal gap identificado é experiência com ${gaps[0]}.`
        : "Nenhum gap crítico foi identificado.");
    return { text, strengths, gaps, differentials };
  },

  async optimizeResume(resume, job) {
    await delay(1600);
    const blob = resumeBlob(resume);
    const inResume = (kw: string) => blob.includes(normalize(kw));

    const priorityKeywords = job.keywords.filter(inResume).slice(0, 8);
    const gaps = job.requirements.filter((r) => !inResume(r)).slice(0, 5);
    const relevantSkills = resume.skills.filter((s) =>
      job.keywords.some((k) => normalize(k).includes(normalize(s))),
    );
    const relevantExperiences = resume.experiences
      .map((e) => ({
        id: e.id,
        overlap:
          e.skills.filter((s) =>
            job.keywords.some((k) => normalize(k).includes(normalize(s))),
          ).length +
          (job.requirements.some((r) =>
            normalize(e.description).includes(normalize(r)),
          )
            ? 1
            : 0),
      }))
      .sort((a, b) => b.overlap - a.overlap)
      .filter((x) => x.overlap > 0)
      .slice(0, 2)
      .map((x) => x.id);

    const recommendations: string[] = [];
    if (priorityKeywords.length)
      recommendations.push(
        `Destaque ${priorityKeywords.slice(0, 3).join(", ")} no resumo e nas experiências — são termos prioritários da vaga.`,
      );
    if (gaps.length)
      recommendations.push(
        `A vaga cita ${gaps[0]}, que não aparece no seu currículo. Se você tem vivência real, adicione; caso contrário, considere desenvolver essa competência.`,
      );
    if (!resume.experiences.some((e) => e.achievements.length >= 2))
      recommendations.push(
        "Adicione conquistas quantificadas às experiências relevantes — números aumentam o impacto junto a recrutadores.",
      );

    return {
      priorityKeywords,
      relevantSkills,
      relevantExperiences,
      gaps,
      termsToInclude: priorityKeywords.slice(0, 5),
      termsToAvoid: [
        "Linguagem genérica como “responsável por tarefas”",
        "Termos técnicos sem evidência real no seu histórico",
      ],
      recommendations,
      insights: [
        {
          label: "Insight da IA",
          items: [
            `Seu currículo tem forte aderência à vaga de ${job.title}. ${gaps[0] ? `Adicionar experiência real com ${gaps[0]} pode aumentar seu Match.` : "Mantenha os termos prioritários visíveis no resumo."}`,
          ],
        },
      ],
    };
  },

  async improveExperience(experience, action) {
    await delay(1200);
    return {
      ...experience,
      description: improvedCopy(experience.description, action),
    };
  },

  async improveSummary(text, action) {
    await delay(1000);
    return improvedCopy(text, action);
  },

  async generateSummary(resume) {
    await delay(1300);
    return buildProfileSummary(resume);
  },

  async analyzeATS(resume, job) {
    await delay(1000);
    return analyzeATS(resume, job);
  },
};


