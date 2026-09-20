import { useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Heart,
  ScanSearch,
  Briefcase,
  ArrowRight,
  BadgeCheck,
  XCircle,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { MatchRing } from "@/components/match/MatchScore";
import { AIInsight } from "@/components/ai/AIInsight";
import { useAppStore } from "@/stores/useAppStore";
import { calculateMatch } from "@/lib/engines/matching";
import { analyzeATS } from "@/lib/engines/ats";
import { mockJobList } from "@/lib/mock-data";

/** Dashboard orientado à ação — seção 5 do prompt */
export default function Dashboard() {
  const baseResume = useAppStore((s) => s.baseResume);
  const applications = useAppStore((s) => s.applications);
  const profile = useAppStore((s) => s.profile);

  const matches = useMemo(() => {
    if (!baseResume) return [];
    return mockJobList
      .map((job) => ({ job, match: calculateMatch(baseResume, job) }))
      .sort((a, b) => b.match.overall - a.match.overall);
  }, [baseResume]);

  const ats = useMemo(
    () => (baseResume ? analyzeATS(baseResume) : null),
    [baseResume],
  );

  if (!baseResume || !ats) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      </div>
    );
  }

  const firstName = baseResume.personal.name.split(" ")[0];
  const recommended = matches.filter((m) => m.match.overall >= 60).length;
  const avgMatch = recommended
    ? Math.round(
        matches
          .filter((m) => m.match.overall >= 60)
          .reduce((acc, m) => acc + m.match.overall, 0) / recommended,
      )
    : 0;
  const active = applications.filter((a) => a.status !== "closed").length;
  const best = matches[0];
  const bestSkills = best.match.dimensions.find((d) => d.category === "skills")!;
  const bestKeywords = best.match.dimensions.find((d) => d.category === "keywords")!;

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Olá, {firstName} 👋
        </h1>
        <p className="mt-1.5 text-muted-foreground">
          Encontre oportunidades que combinam com seu perfil e aumente suas
          chances de contratação.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard label="Match médio" value={`${avgMatch}%`}
          hint="compatibilidade média com vagas recomendadas" accent="success" />
        <MetricCard label="Vagas recomendadas" value={String(recommended)}
          hint="novas oportunidades para você" accent="primary" />
        <MetricCard label="Currículo ATS" value={`${ats.score}/100`}
          hint="última análise" accent="primary" />
        <MetricCard label="Candidaturas" value={String(active)}
          hint="candidaturas ativas" accent="primary" />
      </div>
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Melhor oportunidade para você</h2>
          <Button asChild variant="ghost" size="sm" className="text-muted-foreground">
            <Link to="/app/vagas">
              Ver todas <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col gap-6 md:flex-row md:items-center">
              <div className="flex items-center gap-4 md:flex-1">
                <MatchRing score={best.match.overall} size={120} />
                <div>
                  <Link
                    to={`/app/vagas/${best.job.id}`}
                    className="text-lg font-bold hover:text-primary"
                  >
                    {best.job.title}
                  </Link>
                  <p className="text-sm text-muted-foreground">
                    {best.job.company} · {best.job.location}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    <Badge variant="secondary">{best.job.seniority}</Badge>
                    <Badge variant="secondary">{best.job.workModel}</Badge>
                  </div>
                </div>
              </div>
              <div className="grid flex-1 gap-2 text-sm md:grid-cols-2">
                <p className="flex items-center gap-2">
                  <BadgeCheck className="h-4 w-4 text-success" />
                  {bestSkills.score}% das competências exigidas
                </p>
                <p className="flex items-center gap-2">
                  <BadgeCheck className="h-4 w-4 text-success" />
                  {bestKeywords.score}% de aderência às palavras-chave
                </p>
                <p className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-destructive" />
                  {best.match.missingSkills.length} competências faltantes
                </p>
                <p className="flex items-center gap-2">
                  <BadgeCheck className="h-4 w-4 text-success" />
                  Experiência compatível
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-col gap-2 sm:flex-row">
              <Button asChild>
                <Link to={`/app/vagas/${best.job.id}`}>Ver vaga</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to={`/app/curriculo/adaptar/${best.job.id}`}>
                  Adaptar currículo
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </section>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <AIInsight>
            {profile?.summary ??
              "Complete seu perfil profissional para recomendações mais precisas."}
          </AIInsight>
        </div>
        <div className="grid gap-3">
          <ShortcutCard to="/app/vagas"
            icon={<Heart className="h-5 w-5 text-primary dark:text-primary-foreground" />}
            title="Encontrar vagas" hint={`${recommended} oportunidades compatíveis`} />
          <ShortcutCard to="/app/ats"
            icon={<ScanSearch className="h-5 w-5 text-primary dark:text-primary-foreground" />}
            title="Análise ATS" hint={`Score atual: ${ats.score}/100`} />
          <ShortcutCard to="/app/candidaturas"
            icon={<Briefcase className="h-5 w-5 text-primary dark:text-primary-foreground" />}
            title="Candidaturas" hint={`${active} em andamento`} />
        </div>
      </div>
    </div>
  );
}

function MetricCard({
  label,
  value,
  hint,
  accent,
}: {
  label: string;
  value: string;
  hint: string;
  accent: "success" | "primary";
}) {
  return (
    <Card>
      <CardContent className="p-5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </p>
        <p
          className={`mt-2 text-3xl font-bold tabular-nums ${
            accent === "success"
              ? "text-success"
              : "text-primary dark:text-primary-foreground"
          }`}
        >
          {value}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      </CardContent>
    </Card>
  );
}

function ShortcutCard({
  to,
  icon,
  title,
  hint,
}: {
  to: string;
  icon: React.ReactNode;
  title: string;
  hint: string;
}) {
  return (
    <Link
      to={to}
      className="flex items-center gap-3 rounded-lg border bg-card p-3.5 transition-colors hover:bg-accent"
    >
      {icon}
      <div className="min-w-0">
        <p className="text-sm font-medium">{title}</p>
        <p className="truncate text-xs text-muted-foreground">{hint}</p>
      </div>
      <ArrowRight className="ml-auto h-4 w-4 shrink-0 text-muted-foreground" />
    </Link>
  );
}

