import { useMemo, useState } from "react";
import { SearchX, Search as SearchIcon, SlidersHorizontal } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { JobCard } from "@/components/jobs/JobCard";
import { EmptyState } from "@/components/common/EmptyState";
import { useAppStore } from "@/stores/useAppStore";
import { calculateMatch } from "@/lib/engines/matching";
import { mockJobList } from "@/lib/mock-data";
import {
  DEFAULT_FILTERS,
  JobsFiltersBody,
  countActiveFilters,
  type JobsFiltersState,
} from "./jobs-filters";

type SortKey = "match" | "recent" | "salary";

/** Encontrar Vagas — seções 6 e 7 do prompt */
export default function Jobs() {
  const baseResume = useAppStore((s) => s.baseResume);
  const savedJobIds = useAppStore((s) => s.savedJobIds);
  const toggleSaveJob = useAppStore((s) => s.toggleSaveJob);
  const [query, setQuery] = useState("");
  const [filters, setFiltersState] = useState<JobsFiltersState>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortKey>("match");
  const [filtersOpen, setFiltersOpen] = useState(false);

  const setFilters = (patch: Partial<JobsFiltersState>) =>
    setFiltersState((prev) => ({ ...prev, ...patch }));

  const locations = useMemo(() => [...new Set(mockJobList.map((j) => j.location))], []);
  const areas = useMemo(() => [...new Set(mockJobList.map((j) => j.area))], []);

  const results = useMemo(() => {
    if (!baseResume) return [];
    const q = query.toLowerCase().trim();
    const now = Date.now();
    const filtered = mockJobList.filter((job) => {
      if (q) {
        const blob = `${job.title} ${job.company} ${job.keywords.join(" ")} ${job.requirements.join(" ")}`.toLowerCase();
        if (!blob.includes(q)) return false;
      }
      if (filters.location !== "todas" && job.location !== filters.location) return false;
      if (filters.workModels.length > 0 && !filters.workModels.includes(job.workModel))
        return false;
      if (filters.seniority !== "todas" && job.seniority !== filters.seniority) return false;
      if (filters.contract !== "todos" && job.contract !== filters.contract) return false;
      if (filters.area !== "todas" && job.area !== filters.area) return false;
      if (filters.salaryMin !== "qualquer" && (job.salaryMax ?? 0) < Number(filters.salaryMin))
        return false;
      if (filters.published !== "qualquer") {
        const days = (now - new Date(job.publishedAt).getTime()) / 86400000;
        if (days > Number(filters.published)) return false;
      }
      return true;
    });
    const withMatch = filtered.map((job) => ({
      job,
      match: calculateMatch(baseResume, job).overall,
    }));
    withMatch.sort((a, b) => {
      if (sort === "match") return b.match - a.match;
      if (sort === "salary") return (b.job.salaryMax ?? 0) - (a.job.salaryMax ?? 0);
      return new Date(b.job.publishedAt).getTime() - new Date(a.job.publishedAt).getTime();
    });
    return withMatch;
  }, [baseResume, query, filters, sort]);

  const activeFilters = countActiveFilters(filters);
  const filtersEl = (
    <JobsFiltersBody filters={filters} setFilters={setFilters}
      locations={locations} areas={areas} />
  );
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          Encontre sua próxima oportunidade
        </h1>
        <p className="mt-1.5 text-muted-foreground">
          A IA encontra vagas compatíveis com seu perfil profissional.
        </p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Cargo, tecnologia ou palavra-chave"
            value={query} onChange={(e) => setQuery(e.target.value)} aria-label="Buscar vagas" />
        </div>
        <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
          <SelectTrigger className="w-full sm:w-44" aria-label="Ordenar vagas por">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="match">Melhor Match</SelectItem>
            <SelectItem value="recent">Mais recentes</SelectItem>
            <SelectItem value="salary">Maior salário</SelectItem>
          </SelectContent>
        </Select>
        <Sheet open={filtersOpen} onOpenChange={setFiltersOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="lg:hidden">
              <SlidersHorizontal className="h-4 w-4" /> Filtros
              {activeFilters > 0 && <Badge variant="ai" className="ml-1">{activeFilters}</Badge>}
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 overflow-y-auto">
            <SheetTitle>Filtros</SheetTitle>
            {filtersEl}
          </SheetContent>
        </Sheet>
      </div>

      <div className="hidden rounded-lg border bg-card p-5 lg:block">{filtersEl}</div>

      <div>
        <p className="mb-3 text-sm text-muted-foreground">
          {results.length} {results.length === 1 ? "vaga encontrada" : "vagas encontradas"}
        </p>
        {results.length === 0 ? (
          <EmptyState icon={SearchX} title="Nenhuma vaga encontrada"
            description="Tente ajustar a busca ou remover alguns filtros para ver mais oportunidades."
            action={<Button onClick={() => setFiltersState(DEFAULT_FILTERS)}>Limpar filtros</Button>} />
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {results.map(({ job, match }) => (
              <JobCard key={job.id} job={job} match={match}
                saved={savedJobIds.includes(job.id)} onSave={() => toggleSaveJob(job.id)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

