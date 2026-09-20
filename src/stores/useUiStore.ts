import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface UiStore {
  theme: "light" | "dark";
  toggleTheme(): void;
  setTheme(theme: "light" | "dark"): void;
  /** IDs de vagas já vistas no feed (para "novas" desde a última visita) */
  seenJobIds: string[];
  markJobsSeen(ids: string[]): void;
}

export const useUiStore = create<UiStore>()(
  persist(
    (set, get) => ({
      theme: "light",
      toggleTheme: () => {
        const next = get().theme === "light" ? "dark" : "light";
        set({ theme: next });
        applyTheme(next);
      },
      setTheme: (theme) => {
        set({ theme });
        applyTheme(theme);
      },
      seenJobIds: [],
      markJobsSeen: (ids) => set({ seenJobIds: ids }),
    }),
    {
      name: "alignedcv-ui",
      storage: createJSONStorage(() => localStorage),
      onRehydrateStorage: () => (state) => {
        if (state?.theme) applyTheme(state.theme);
      },
    },
  ),
);

function applyTheme(theme: "light" | "dark") {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.style.colorScheme = theme;
}

// Aplica o tema o quanto antes (evita flash)
const initial = localStorage.getItem("alignedcv-ui");
if (initial) {
  try {
    const parsed = JSON.parse(initial) as { state?: { theme?: "light" | "dark" } };
    if (parsed.state?.theme) applyTheme(parsed.state.theme);
  } catch {
    /* noop */
  }
}
