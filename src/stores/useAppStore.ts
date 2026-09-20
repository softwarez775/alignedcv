import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type {
  Application,
  ApplicationStatus,
  Resume,
  SmartProfile,
  UserPreferences,
} from "@/types";
import { buildDemoResume } from "@/lib/mock-data";
import { aiService } from "@/lib/ai";


export interface AppData {
  onboarded: boolean;
  profile: SmartProfile | null;
  preferences: UserPreferences | null;
  baseResume: Resume | null;
  resumes: Resume[];
  savedJobIds: string[];
  applications: Application[];
}

interface AppStore extends AppData {
  // onboarding
  completeOnboarding(data: {
    name: string;
    title: string;
    area: string;
    preferences: UserPreferences;
    resume?: Resume;
    uploadedFileName?: string;
  }): Promise<void>;
  refreshProfile(): Promise<void>;
  // currículos
  addResume(resume: Resume): void;
  updateResume(id: string, patch: Partial<Resume>): void;
  deleteResume(id: string): void;
  duplicateResume(id: string): string | null;
  setBaseResume(resume: Resume): void;
  // vagas
  toggleSaveJob(jobId: string): void;
  // candidaturas
  addApplication(jobId: string, resumeId?: string): void;
  moveApplication(id: string, status: ApplicationStatus): void;
  removeApplication(id: string): void;
  // privacidade
  clearAllData(): void;
}

const initialData: AppData = {
  onboarded: false,
  profile: null,
  preferences: null,
  baseResume: null,
  resumes: [],
  savedJobIds: [],
  applications: [],
};

export const useAppStore = create<AppStore>()(
  persist(
    (set, get) => ({
      ...initialData,

      async completeOnboarding({ preferences, resume, uploadedFileName }) {
        // O currículo pode vir do upload "analisado" (mock) ou do zero;
        // usamos o currículo demo enriquecido quando não há texto colado.
        const base =
          resume ??
          buildDemoResume(Date.now());
        void uploadedFileName;
        const profile = await aiService.analyzeResume(base);
        set({
          onboarded: true,
          preferences,
          baseResume: base,
          resumes: [base],
          profile,
        });
      },

      async refreshProfile() {
        const { baseResume } = get();
        if (!baseResume) return;
        const profile = await aiService.analyzeResume(baseResume);
        set({ profile });
      },

      addResume(resume) {
        set((s) => ({ resumes: [resume, ...s.resumes] }));
      },

      updateResume(id, patch) {
        set((s) => ({
          resumes: s.resumes.map((r) =>
            r.id === id ? { ...r, ...patch, updatedAt: Date.now() } : r,
          ),
          baseResume:
            s.baseResume && s.baseResume.id === id
              ? { ...s.baseResume, ...patch, updatedAt: Date.now() }
              : s.baseResume,
        }));
      },

      deleteResume(id) {
        set((s) => {
          const resumes = s.resumes.filter((r) => r.id !== id);
          return {
            resumes,
            baseResume: s.baseResume?.id === id ? resumes[0] ?? null : s.baseResume,
          };
        });
      },

      duplicateResume(id) {
        const resume = get().resumes.find((r) => r.id === id);
        if (!resume) return null;
        const copy: Resume = {
          ...structuredClone(resume),
          id: `resume-${Date.now()}`,
          name: `${resume.name} (cópia)`,
          isBase: false,
          updatedAt: Date.now(),
        };
        set((s) => ({ resumes: [copy, ...s.resumes] }));
        return copy.id;
      },

      setBaseResume(resume) {
        set((s) => ({
          baseResume: resume,
          resumes: [resume, ...s.resumes.filter((r) => r.id !== resume.id)],
        }));
      },

      toggleSaveJob(jobId) {
        set((s) => ({
          savedJobIds: s.savedJobIds.includes(jobId)
            ? s.savedJobIds.filter((id) => id !== jobId)
            : [...s.savedJobIds, jobId],
        }));
      },

      addApplication(jobId, resumeId) {
        if (get().applications.some((a) => a.jobId === jobId)) return;
        set((s) => ({
          applications: [
            {
              id: `app-${Date.now()}`,
              jobId,
              resumeId,
              status: "applied" as ApplicationStatus,
              appliedAt: new Date().toISOString(),
              notes: "",
            },
            ...s.applications,
          ],
        }));
      },

      moveApplication(id, status) {
        set((s) => ({
          applications: s.applications.map((a) =>
            a.id === id ? { ...a, status } : a,
          ),
        }));
      },

      removeApplication(id) {
        set((s) => ({ applications: s.applications.filter((a) => a.id !== id) }));
      },

      clearAllData() {
        set({ ...initialData });
      },
    }),
    {
      name: "alignedcv-data",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);

// ─── Helpers ─────────────────────────────────────────────────────

export function useResumeById(id: string | undefined): Resume | null {
  return useAppStore((s) =>
    id ? s.resumes.find((r) => r.id === id) ?? null : null,
  );
}

