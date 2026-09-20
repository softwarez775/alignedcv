// ─── Tipos de domínio do AlignedCV ───────────────────────────────

export type Seniority = "Júnior" | "Pleno" | "Sênior" | "Especialista" | "Estágio";
export type WorkModel = "Remoto" | "Híbrido" | "Presencial";
export type ContractType = "CLT" | "PJ" | "Freelance" | "Estágio" | "Temporário";

export interface PersonalInfo {
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  portfolio: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  location: string;
  description: string;
  achievements: string[];
  skills: string[];
}

export interface Education {
  id: string;
  institution: string;
  course: string;
  period: string;
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  year: string;
}

export interface LanguageSkill {
  id: string;
  name: string;
  level: "Básico" | "Intermediário" | "Avançado" | "Fluente" | "Nativo";
}

export interface Project {
  id: string;
  name: string;
  description: string;
  skills: string[];
  link: string;
}

export interface Resume {
  id: string;
  name: string;
  /** Vaga vinculada quando o currículo foi personalizado */
  jobId?: string;
  jobTitle?: string;
  isBase: boolean;
  updatedAt: number;
  personal: PersonalInfo;
  summary: string;
  experiences: Experience[];
  education: Education[];
  skills: string[];
  certifications: Certification[];
  languages: LanguageSkill[];
  projects: Project[];
}

export interface Job {
  id: string;
  title: string;
  company: string;
  logoInitials: string;
  location: string;
  isRemote: boolean;
  workModel: WorkModel;
  seniority: Seniority;
  salaryMin?: number;
  salaryMax?: number;
  contract: ContractType;
  area: string;
  publishedAt: string; // ISO
  description: string;
  responsibilities: string[];
  requirements: string[];
  differentials: string[];
  keywords: string[];
  benefits: string[];
}

export type ApplicationStatus =
  | "saved"
  | "applied"
  | "reviewing"
  | "interview"
  | "offer"
  | "closed";

export interface Application {
  id: string;
  jobId: string;
  resumeId?: string;
  status: ApplicationStatus;
  appliedAt: string; // ISO
  notes: string;
}

export interface SmartProfile {
  seniority: Seniority;
  area: string;
  skills: string[];
  summary: string;
  recommendedAreas: string[];
  recommendedRoles: string[];
  totalSkills: number;
  generatedAt: number;
}

export interface UserPreferences {
  desiredRole: string;
  location: string;
  workModel: WorkModel;
  seniority: Seniority;
  salaryExpectation: string;
}

// ─── Matching ─────────────────────────────────────────────────────

export type MatchCategory =
  | "skills"
  | "experience"
  | "seniority"
  | "keywords"
  | "education"
  | "location"
  | "workModel";

export interface MatchDimensionScore {
  category: MatchCategory;
  label: string;
  score: number; // 0–100
  weight: number; // 0–1
  detail: string;
}

export interface MatchBreakdown {
  overall: number; // 0–100
  dimensions: MatchDimensionScore[];
  matchedSkills: string[];
  missingSkills: string[];
  matchedKeywords: number;
  totalKeywords: number;
}

// ─── ATS ─────────────────────────────────────────────────────────

export type ATSIssueSeverity = "good" | "warning" | "improvement";

export interface ATSDimensionScore {
  key: "keywords" | "structure" | "experience" | "clarity" | "formatting";
  label: string;
  score: number; // 0–100
}

export interface ATSIssue {
  severity: ATSIssueSeverity;
  title: string;
  description: string;
}

export interface ATSAnalysis {
  score: number; // 0–100
  status: "excellent" | "good" | "regular" | "poor";
  dimensions: ATSDimensionScore[];
  issues: ATSIssue[];
}

// ─── IA (adaptação de currículo) ──────────────────────────────────

export type AIImproveAction =
  | "professional"
  | "keywords"
  | "impact"
  | "objective"
  | "grammar"
  | "quantify";

export interface AIImproveOption {
  action: AIImproveAction;
  label: string;
  description: string;
}

export interface AdaptInsight {
  label: string;
  items: string[];
}

export interface AdaptAnalysis {
  priorityKeywords: string[];
  relevantSkills: string[];
  relevantExperiences: string[]; // ids das experiências mais aderentes
  gaps: string[];
  termsToInclude: string[];
  termsToAvoid: string[];
  recommendations: string[];
  insights: AdaptInsight[];
}
