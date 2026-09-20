import { Link } from "react-router-dom";
import { FileText, Pencil, ScanSearch, Copy, Printer, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ATSScore } from "@/components/ats/ATSScore";
import { useAppStore } from "@/stores/useAppStore";
import { analyzeATS } from "@/lib/engines/ats";

/** Meu Currículo (base) — seção 10 do prompt */
export default function MyResume() {
  const baseResume = useAppStore((s) => s.baseResume);
  const duplicateResume = useAppStore((s) => s.duplicateResume);

  if (!baseResume) return null;

  const analysis = analyzeATS(baseResume);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Meu Currículo</h1>
        <p className="mt-1.5 text-muted-foreground">
          Seu currículo base — ponto de partida para todas as versões personalizadas.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardContent className="flex items-start justify-between gap-4 p-6">
            <div>
              <div className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary dark:text-primary-foreground" />
                <h2 className="font-semibold">{baseResume.name}</h2>
                <Badge variant="secondary">Base</Badge>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {baseResume.experiences.length} experiências ·{" "}
                {baseResume.skills.length} competências ·{" "}
                {baseResume.education.length} formação(ões)
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Titular: {baseResume.personal.name || "—"}
              </p>
            </div>
            <ATSScore analysis={analysis} size="sm" />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="grid gap-2.5 p-6">
            <Button asChild>
              <Link to={`/app/curriculos/${baseResume.id}/editar`}>
                <Pencil className="h-4 w-4" /> Editar currículo
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/app/ats">
                <ScanSearch className="h-4 w-4" /> Analisar ATS
              </Link>
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                const id = duplicateResume(baseResume.id);
                if (id) window.location.assign(`#/app/curriculos`);
              }}
            >
              <Copy className="h-4 w-4" /> Duplicar
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
          <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold">
            <Sparkles className="h-4 w-4 text-primary dark:text-primary-foreground" />
            Como o AlignedCV usa seu currículo base
          </h3>
          <ul className="list-disc space-y-1.5 pl-5 text-sm text-muted-foreground">
            <li>Cada vaga pode gerar uma versão personalizada a partir dele.</li>
            <li>
              Melhorias com IA nunca inventam experiências — apenas realçam o que
              já existe.
            </li>
            <li>
              Exporte em PDF com texto selecionável, ideal para sistemas ATS.
            </li>
          </ul>
          <div className="mt-4">
            <Button asChild variant="secondary" size="sm">
              <Link to="/app/vagas">
                <Printer className="h-4 w-4" /> Criar versão para uma vaga
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
