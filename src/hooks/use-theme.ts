import { useCallback, useEffect, useState } from "react";
import { useUiStore } from "@/stores/useUiStore";

export function useTheme() {
  const theme = useUiStore((s) => s.theme);
  const toggleTheme = useUiStore((s) => s.toggleTheme);
  const setTheme = useUiStore((s) => s.setTheme);
  return { theme, toggleTheme, setTheme, isDark: theme === "dark" };
}

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== "undefined" ? window.matchMedia(query).matches : false,
  );
  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    mql.addEventListener("change", onChange);
    setMatches(mql.matches);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);
  return matches;
}

/**
 * Processo de IA com estados loading + mensagens rotativas em pt-BR
 * ("Analisando seu currículo...", "Comparando com a vaga..." etc.)
 */
export function useAIProcess<T>() {
  const [state, setState] = useState<{
    status: "idle" | "processing" | "done" | "error";
    message: string;
    result: T | null;
  }>({ status: "idle", message: "", result: null });

  const run = useCallback(
    async (steps: Array<{ message: string; run?: () => Promise<void> }>, task: () => Promise<T>) => {
      setState({ status: "processing", message: steps[0]?.message ?? "", result: null });
      let current = 0;
      const timer = setInterval(() => {
        current = (current + 1) % steps.length;
        setState((s) => ({ ...s, message: steps[current].message }));
      }, 900);
      try {
        // dispara passos intermediários opcionais
        for (const step of steps) await step.run?.();
        const result = await task();
        clearInterval(timer);
        setState({ status: "done", message: "", result });
        return result;
      } catch (err) {
        clearInterval(timer);
        setState({ status: "error", message: "", result: null });
        throw err;
      }
    },
    [],
  );

  const reset = useCallback(
    () => setState({ status: "idle", message: "", result: null }),
    [],
  );

  return { ...state, run, reset };
}
