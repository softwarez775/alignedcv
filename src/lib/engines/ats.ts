import type {
  ATSDimensionScore,
  ATSIssue,
  ATSAnalysis,
  Job,
  Resume,
} from "@/types";

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

const hasNumbers = (text: string) => /\d/.test(text);

/** Bola de texto do currículo para checagem de presença de termos */
function resumeBlob(resume: Resume): string {
  return normalize(
    [
      resume.summary,
      ...resume.experiences.map(
        (e) =>
          `${e.role} ${e.company} ${e.description} ${e.achievements.join(" ")} ${e.skills.join(" ")}`,
      ),
      ...resume.skills,
      ...resume.projects.map((p) => `${p.name} ${p.description}`),
    ].join(" "),
  );
}

/**
 * Motor de análise ATS — determinístico, sem IA real.
 * NUNCA inventa experiências, competências ou resultados:
 * apenas avalia o que existe (ou falta) no conteúdo informado.
 */
export function analyzeATS(resume: Resume, job?: Job): ATSAnalysis {
  const dimensions: ATSDimensionScore[] = [];
  const issues: ATSIssue[] = [];
  const blob = resumeBlob(resume);

  // ── 1. Palavras-chave ─────────────────────────────────────────
  let keywordScore = 70;
  if (job) {
    const hits = job.keywords.filter((k) => blob.includes(normalize(k)));
    keywordScore = job.keywords.length
      ? Math.round((hits.length / job.keywords.length) * 100)
      : 100;
    const missing = job.keywords.filter((k) => !blob.includes(normalize(k)));
    if (missing.length > 0) {
      issues.push({
        severity: "warning",
        title: "Palavras-chave ausentes",
        description: `Algumas palavras-chave da vaga não aparecem no currículo: ${missing
          .slice(0, 6)
          .join(", ")}.`,
      });
    }
  } else if (resume.skills.length >= 6) {
    keywordScore = 88;
  }
  dimensions.push({
    key: "keywords",
    label: "Palavras-chave",
    score: Math.min(100, keywordScore),
  });

  // ── 2. Estrutura ──────────────────────────────────────────────
  const hasSection = (arr: unknown[]) => arr.length > 0;
  const checks = [
    resume.personal.name.length > 0,
    resume.personal.email.length > 0,
    resume.personal.phone.length > 0,
    resume.summary.length >= 80,
    hasSection(resume.experiences),
    hasSection(resume.education),
    hasSection(resume.skills),
  ];
  const structureScore = Math.round(
    (checks.filter(Boolean).length / checks.length) * 100,
  );
  dimensions.push({ key: "structure", label: "Estrutura", score: structureScore });
  issues.push({
    severity: structureScore >= 90 ? "good" : "improvement",
    title:
      structureScore >= 90
        ? "Estrutura compatível com ATS"
        : "Estrutura incompleta",
    description:
      structureScore >= 90
        ? "Seu currículo possui estrutura compatível com sistemas ATS: seções claras e informações de contato completas."
        : "Complete as informações de contato e o resumo profissional para que sistemas ATS identifiquem corretamente seu perfil.",
  });

  // ── 3. Experiência ────────────────────────────────────────────
  let expScore = 50;
  if (hasSection(resume.experiences)) {
    const withAchievements = resume.experiences.filter(
      (e) => e.achievements.length > 0,
    ).length;
    const withQuantified = resume.experiences.filter(
      (e) => e.achievements.some(hasNumbers) || hasNumbers(e.description),
    ).length;
    expScore =
      60 +
      Math.round((withAchievements / resume.experiences.length) * 25) +
      Math.round((withQuantified / resume.experiences.length) * 15);
    if (withQuantified < resume.experiences.length) {
      issues.push({
        severity: "improvement",
        title: "Resultados quantitativos",
        description:
          "Adicione resultados quantitativos às experiências profissionais — números fortalecem o impacto e a leitura por recrutadores.",
      });
    }
  } else {
    issues.push({
      severity: "warning",
      title: "Sem experiências profissionais",
      description:
        "Nenhuma experiência registrada. Adicione pelo menos uma experiência, mesmo que seja acadêmica ou de projeto.",
    });
  }
  dimensions.push({
    key: "experience",
    label: "Experiência",
    score: Math.min(100, expScore),
  });

  // ── 4. Clareza ────────────────────────────────────────────────
  const avgDesc =
    resume.experiences.map((e) => e.description.length).reduce((a, b) => a + b, 0) /
    Math.max(1, resume.experiences.length);
  let clarityScore = 75;
  if (resume.experiences.length > 0) {
    if (avgDesc >= 80 && avgDesc <= 400) clarityScore = 95;
    else if (avgDesc > 400) clarityScore = 78;
    else clarityScore = Math.round(60 + (avgDesc / 80) * 30);
  }
  dimensions.push({
    key: "clarity",
    label: "Clareza",
    score: Math.min(100, Math.round(clarityScore)),
  });

  // ── 5. Formatação ──────────────────────────────────────────────
  let formatScore = 90;
  const emailOk = /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(resume.personal.email);
  if (!emailOk) formatScore -= 20;
  if (resume.personal.name.length < 3) formatScore -= 15;
  if (resume.skills.length < 5) formatScore -= 10;
  if (resume.skills.length > 18) formatScore -= 5;
  dimensions.push({
    key: "formatting",
    label: "Formatação",
    score: Math.max(0, Math.min(100, formatScore)),
  });

  const score = Math.round(
    dimensions.reduce((acc, d) => acc + d.score, 0) / dimensions.length,
  );
  const status: ATSAnalysis["status"] =
    score >= 90
      ? "excellent"
      : score >= 75
        ? "good"
        : score >= 55
          ? "regular"
          : "poor";

  return { score, status, dimensions, issues };
}

export function atsStatusLabel(analysis: ATSAnalysis): {
  label: string;
  badge:
    | "ATS Friendly"
    | "Quase lá"
    | "Precisa melhorar"
    | "Reprovável";
} {
  switch (analysis.status) {
    case "excellent":
      return { label: "Pronto para passar por sistemas ATS", badge: "ATS Friendly" };
    case "good":
      return { label: "Bom nível ATS com pontos a melhorar", badge: "Quase lá" };
    case "regular":
      return { label: "Estrutura presente, mas com lacunas importantes", badge: "Precisa melhorar" };
    default:
      return { label: "Currículo será mal interpretado por ATS", badge: "Reprovável" };
  }
}

