import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import type { WorkModel } from "@/types";

export interface JobsFiltersState {
  location: string;
  workModels: string[];
  seniority: string;
  salaryMin: string;
  contract: string;
  area: string;
  published: string;
}

export const DEFAULT_FILTERS: JobsFiltersState = {
  location: "todas",
  workModels: [],
  seniority: "todas",
  salaryMin: "qualquer",
  contract: "todos",
  area: "todas",
  published: "qualquer",
};

export function countActiveFilters(f: JobsFiltersState): number {
  return [
    f.location !== "todas",
    f.workModels.length > 0,
    f.seniority !== "todas",
    f.salaryMin !== "qualquer",
    f.contract !== "todos",
    f.area !== "todas",
    f.published !== "qualquer",
  ].filter(Boolean).length;
}

/** Corpo de filtros — seção 6 do prompt (usado no desktop e no Sheet) */
export function JobsFiltersBody({
  filters,
  setFilters,
  locations,
  areas,
}: {
  filters: JobsFiltersState;
  setFilters: (patch: Partial<JobsFiltersState>) => void;
  locations: string[];
  areas: string[];
}) {
  const toggleWorkModel = (m: WorkModel) => {
    const has = filters.workModels.includes(m);
    setFilters({
      workModels: has
        ? filters.workModels.filter((x) => x !== m)
        : [...filters.workModels, m],
    });
  };

  return (
    <div className="space-y-5">
      <SelectField label="Localização" value={filters.location}
        onChange={(v) => setFilters({ location: v })}
        options={["todas: Todas as localizações", ...locations.map((l) => `${l}: ${l}`)]} />

      <div className="space-y-2">
        <Label>Modelo de trabalho</Label>
        <div className="flex flex-wrap gap-2">
          {(["Remoto", "Híbrido", "Presencial"] as WorkModel[]).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => toggleWorkModel(m)}
              className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                filters.workModels.includes(m)
                  ? "border-primary bg-primary text-primary-foreground"
                  : "bg-card text-muted-foreground hover:bg-accent"
              }`}
              aria-pressed={filters.workModels.includes(m)}
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <SelectField label="Senioridade" value={filters.seniority}
          onChange={(v) => setFilters({ seniority: v })}
          options={["todas: Todas", "Estágio", "Júnior", "Pleno", "Sênior"]} />
        <SelectField label="Faixa salarial (mín.)" value={filters.salaryMin}
          onChange={(v) => setFilters({ salaryMin: v })}
          options={[
            "qualquer: Qualquer", "5000: R$ 5.000+", "8000: R$ 8.000+",
            "12000: R$ 12.000+", "16000: R$ 16.000+",
          ]} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <SelectField label="Tipo de contrato" value={filters.contract}
          onChange={(v) => setFilters({ contract: v })}
          options={["todos: Todos", "CLT", "PJ", "Freelance", "Estágio"]} />
        <SelectField label="Área" value={filters.area}
          onChange={(v) => setFilters({ area: v })}
          options={["todas: Todas", ...areas.map((a) => `${a}: ${a}`)]} />
      </div>

      <SelectField label="Data de publicação" value={filters.published}
        onChange={(v) => setFilters({ published: v })}
        options={[
          "qualquer: Qualquer data", "3: Últimos 3 dias",
          "7: Última semana", "14: Últimas 2 semanas",
        ]} />

      {countActiveFilters(filters) > 0 && (
        <Button
          variant="ghost"
          onClick={() => setFilters({ ...DEFAULT_FILTERS })}
          className="w-full text-muted-foreground"
        >
          Limpar filtros ({countActiveFilters(filters)})
        </Button>
      )}
    </div>
  );
}

/** Select de filtro compacto: options no formato "valor: label" */
function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  const parsed = options.map((o) => {
    const [v, l] = o.split(": ");
    return { value: v, label: l ?? v };
  });
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger><SelectValue /></SelectTrigger>
        <SelectContent>
          {parsed.map((o) => (
            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
