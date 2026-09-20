import type { Job, MatchBreakdown, MatchDimensionScore, Resume } from "@/types";

export const MATCH_WEIGHTS = {
  skills: 0.3,
  experience: 0.25,
  seniority: 0.15,
  keywords: 0.15,
  education: 0.05,
  location: 0.05,
  workModel: 0.05,
} as const;

const SENIORITY_ORDER: Record<string, number> = {
  Estágio: 0,
  Júnior: 1,
  Pleno: 2,
  Sênior: 3,
  Especialista: 4,
};
void SENIORITY_ORDER;

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

/** Extrai anos de experiência a partir dos períodos ("mar/2021 – atual" etc.) */
function extractYearsOfExperience(resume: Resume): number {
  let months = 0;
  const now = new Date();
  for (const exp of resume.experiences) {
    const dates = exp.period.match(/(19|20)\d{2}/g);
    if (!dates) continue;
    const years = dates.map(Number).sort((a, b) => a - b);
    const start = years[0];
    const end = years[years.length - 1];
    const isCurrent = /atual|presente|hoje/i.test(exp.period);
    const endYear = isCurrent ? now.getFullYear() : end;
    months += Math.max(0, (endYear - start) * 12);
  }
  return Math.round((months / 12) * 10) / 10;
}

export function getExperienceYears(resume: Resume): number {
  return extractYearsOfExperience(resume);
}

function scoreSkills(resume: Resume, job: Job) {
  const resumeSkills = new Set(resume.skills.map(normalize));
  for (const exp of resume.experiences) {
    exp.skills.forEach((s) => resumeSkills.add(normalize(s)));
  }
  const matched: string[] = [];
  const missing: string[] = [];
  for (const req of job.requirements) {
    const reqTokens = normalize(req).split(/\s+/);
    const hit = reqTokens.some((t) => resumeSkills.has(t) && t.length > 2);
    if (hit) matched.push(req);
    else missing.push(req);
  }
  const score =
    job.requirements.length === 0
      ? 100
      : Math.round((matched.length / job.requirements.length) * 100);
  return { score, matched, missing };
}

function scoreSeniority(resume: Resume, job: Job) {
  const years = extractYearsOfExperience(resume);
  const expected: Record<string, [number, number]> = {
    Estágio: [0, 1],
    Júnior: [1, 3],
    Pleno: [3, 6],
    Sênior: [6, 10],
    Especialista: [10, 99],
  };
  const [min, max] = expected[job.seniority] ?? [0, 99];
  let score: number;
  if (years >= min && years <= max) score = 100;
  else if (years < min) score = Math.max(40, 100 - (min - years) * 18);
  else score = Math.max(70, 100 - (years - max) * 5); // over-qualified desconta pouco
  return Math.min(100, Math.round(score));
}

function scoreKeywords(resume: Resume, job: Job) {
  const blob = normalize(
    [
      resume.summary,
      ...resume.experiences.map((e) => `${e.description} ${e.achievements.join(" ")}`),
      ...resume.skills,
      ...resume.projects.map((p) => `${p.name} ${p.description}`),
    ].join(" "),
  );
  let matched = 0;
  for (const kw of job.keywords) {
    if (blob.includes(normalize(kw))) matched++;
  }
  return {
    score:
      job.keywords.length === 0
        ? 100
        : Math.round((matched / job.keywords.length) * 100),
    matched,
    total: job.keywords.length,
  };
}

function scoreEducation(resume: Resume) {
  if (resume.education.length === 0) return 60;
  const ongoing = resume.education.some((e) =>
    /andamento|cursando|atual/i.test(e.period),
  );
  return ongoing ? 92 : 100;
}

function scoreLocation(resume: Resume, job: Job) {
  const userLoc = normalize(resume.personal.location);
  const jobLoc = normalize(job.location);
  if (job.workModel === "Remoto") return 100;
  if (!userLoc || !jobLoc) return 80;
  if (userLoc === jobLoc) return 100;
  const userCity = userLoc.split(/[-–,]/)[0].trim();
  const jobCity = jobLoc.split(/[-–,]/)[0].trim();
  return userCity === jobCity ? 95 : 55;
}

function scoreWorkModel(job: Job) {
  // Currículo não declara preferência de modelo — não penaliza
  return job.workModel === "Remoto" ? 95 : 90;
}

export function calculateMatch(resume: Resume, job: Job): MatchBreakdown {
  const skills = scoreSkills(resume, job);
  const seniority = scoreSeniority(resume, job);
  const keywords = scoreKeywords(resume, job);
  const education = scoreEducation(resume);
  const location = scoreLocation(resume, job);
  const workModel = scoreWorkModel(job);

  const years = extractYearsOfExperience(resume);
  const experienceScore = Math.min(100, Math.round((years / 6) * 100));

  const dimensions: MatchDimensionScore[] = [
    {
      category: "skills",
      label: "Competências",
      score: skills.score,
      weight: MATCH_WEIGHTS.skills,
      detail: `${skills.matched.length} de ${job.requirements.length} requisitos atendidos`,
    },
    {
      category: "experience",
      label: "Experiência",
      score: experienceScore,
      weight: MATCH_WEIGHTS.experience,
      detail: `${years} anos de experiência profissional`,
    },
    {
      category: "seniority",
      label: "Senioridade",
      score: seniority,
      weight: MATCH_WEIGHTS.seniority,
      detail: `Vaga ${job.seniority} · você tem ${years} anos`,
    },
    {
      category: "keywords",
      label: "Palavras-chave",
      score: keywords.score,
      weight: MATCH_WEIGHTS.keywords,
      detail: `${keywords.matched} de ${keywords.total} palavras-chave da vaga no currículo`,
    },
    {
      category: "education",
      label: "Formação",
      score: education,
      weight: MATCH_WEIGHTS.education,
      detail:
        resume.education.length > 0
          ? `${resume.education.length} formação(ões) registrada(s)`
          : "Nenhuma formação registrada",
    },
    {
      category: "location",
      label: "Localização",
      score: location,
      weight: MATCH_WEIGHTS.location,
      detail: `${resume.personal.location || "Local não informado"} · vaga em ${job.location}`,
    },
    {
      category: "workModel",
      label: "Modelo de trabalho",
      score: workModel,
      weight: MATCH_WEIGHTS.workModel,
      detail: `Vaga ${job.workModel.toLowerCase()}`,
    },
  ];

  const overall = Math.round(
    dimensions.reduce((acc, d) => acc + d.score * d.weight, 0),
  );

  return {
    overall: Math.min(100, Math.max(0, overall)),
    dimensions,
    matchedSkills: skills.matched,
    missingSkills: skills.missing,
    matchedKeywords: keywords.matched,
    totalKeywords: keywords.total,
  };
}

export function matchLabel(score: number): {
  label: string;
  tone: "low" | "medium" | "high" | "top";
} {
  if (score >= 90) return { label: "Excelente compatibilidade", tone: "top" };
  if (score >= 80) return { label: "Boa compatibilidade", tone: "high" };
  if (score >= 60) return { label: "Compatibilidade moderada", tone: "medium" };
  return { label: "Baixa compatibilidade", tone: "low" };
}

