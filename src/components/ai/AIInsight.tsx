import { Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Insight da IA — seção 26 do prompt.
 * Ícone de IA + Indigo como cor principal.
 */
export function AIInsight({
  title = "Insight da IA",
  children,
  className,
}: {
  title?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex gap-3 rounded-lg border border-primary/20 bg-primary/5 p-4 dark:bg-primary/10",
        className,
      )}
    >
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 dark:bg-primary/20">
        <Sparkles className="h-4 w-4 text-primary dark:text-primary-foreground" />
      </div>
      <div className="min-w-0">
        <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-primary dark:text-primary-foreground">
          {title}
        </p>
        <div className="mt-1 text-sm leading-relaxed text-foreground">
          {children}
        </div>
      </div>
    </div>
  );
}

/** Mensagens rotativas exibidas enquanto a IA processa */
export function AIProcessing({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-10 text-center">
      <div className="relative flex h-14 w-14 items-center justify-center">
        <span className="absolute inset-0 animate-ping rounded-full bg-primary/20" />
        <Sparkles className="h-6 w-6 text-primary dark:text-primary-foreground" />
      </div>
      <p className="text-sm font-medium text-muted-foreground">{message}</p>
    </div>
  );
}
