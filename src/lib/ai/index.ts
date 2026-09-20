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

/**
 * Camada abstrata de IA do AlignedCV.
 *
 * Para integrar um provedor real (GLM, Claude, OpenAI...), implemente
 * esta mesma interface em outro arquivo (ex.: glm-provider.ts) e troque
 * o provider usado no export abaixo. Nenhum componente deve chamar
 * provedores diretamente — sempre via `aiService`.
 */
export interface AIService {
  analyzeResume(resume: Resume): Promise<SmartProfile>;
  analyzeJob(job: Job, resume: Resume): Promise<MatchExplanation>;
  calculateMatch(resume: Resume, job: Job): Promise<MatchBreakdown>;
  optimizeResume(resume: Resume, job: Job): Promise<AdaptAnalysis>;
  improveExperience(experience: Experience, action: AIImproveAction): Promise<Experience>;
  improveSummary(text: string, action: AIImproveAction): Promise<string>;
  generateSummary(resume: Resume): Promise<string>;
  analyzeATS(resume: Resume, job?: Job): Promise<ATSAnalysis>;
}

export interface MatchExplanation {
  text: string;
  strengths: string[];
  gaps: string[];
  differentials: string[];
}

// Provider padrão do MVP: mockado e determinístico.
// Ver mock-provider.ts — nunca fabrica informações do usuário.
export { mockAIProvider as aiService } from "./mock-provider";

