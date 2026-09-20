import { useRef } from "react";
import {
  Upload,
  FilePlus2,
  PartyPopper,
  Sparkles,
  Check,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { AIInsight } from "@/components/ai/AIInsight";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Seniority, WorkModel } from "@/types";

const inputCls = "h-10";

export function StepAbout({
  name, title, area, setName, setTitle, setArea,
}: {
  name: string; title: string; area: string;
  setName: (v: string) => void; setTitle: (v: string) => void; setArea: (v: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Vamos conhecer você</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Essas informações personalizarão suas recomendações de vagas.
        </p>
      </div>
      <div className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="ob-name">Nome</Label>
          <Input id="ob-name" className={inputCls} placeholder="Como você se chama?"
            value={name} onChange={(e) => setName(e.target.value)} autoFocus />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ob-title">Cargo atual</Label>
          <Input id="ob-title" className={inputCls} placeholder="Ex.: Desenvolvedor(a) Front-end"
            value={title} onChange={(e) => setTitle(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ob-area">Área profissional</Label>
          <Select value={area} onValueChange={setArea}>
            <SelectTrigger id="ob-area" className={inputCls}>
              <SelectValue placeholder="Selecione sua área" />
            </SelectTrigger>
            <SelectContent>
              {[
                "Desenvolvimento de Software",
                "Design",
                "Análise de Sistemas",
                "Dados",
                "Produto",
                "Marketing",
                "Outra",
              ].map((a) => (
                <SelectItem key={a} value={a}>{a}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}

export function StepResume({
  resumeText, setResumeText, fileName, onUpload,
}: {
  resumeText: string; setResumeText: (v: string) => void;
  fileName: string | null; onUpload: (f: File | undefined) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Importe seu currículo</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Envie um arquivo ou cole o texto. Também dá para começar do zero.
        </p>
      </div>

      <label
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-8 text-center transition-colors hover:border-primary/50 hover:bg-accent/40",
          fileName && "border-success/50 bg-success/5",
        )}
      >
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          className="sr-only"
          onChange={(e) => onUpload(e.target.files?.[0])}
        />
        <div className={cn(
          "flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10",
          fileName && "bg-success/15",
        )}>
          {fileName ? (
            <Check className="h-6 w-6 text-success" />
          ) : (
            <Upload className="h-6 w-6 text-primary dark:text-primary-foreground" />
          )}
        </div>
        {fileName ? (
          <p className="text-sm font-medium text-success">
            {fileName} recebido — a IA fará a análise
          </p>
        ) : (
          <>
            <span className="text-sm font-medium">
              Arraste seu currículo ou clique para enviar
            </span>
            <span className="text-xs text-muted-foreground">PDF, DOCX ou TXT</span>
          </>
        )}
      </label>

      <div className="space-y-1.5">
        <Label htmlFor="ob-resume-text">
          Ou cole o texto do seu currículo (opcional)
        </Label>
        <Textarea
          id="ob-resume-text"
          placeholder="Cole aqui o conteúdo do seu currículo: experiências, competências, formação..."
          className="min-h-[110px]"
          value={resumeText}
          onChange={(e) => setResumeText(e.target.value)}
        />
      </div>

      <Button
        type="button"
        variant="ghost"
        className="w-full text-muted-foreground"
        onClick={() => setResumeText("")}
      >
        <FilePlus2 className="h-4 w-4" /> Prefiro criar meu currículo do zero
      </Button>
    </div>
  );
}
export function StepGoals({
  desiredRole, setDesiredRole,
  location, setLocation,
  workModel, setWorkModel,
  seniority, setSeniority,
  salary, setSalary,
}: {
  desiredRole: string; setDesiredRole: (v: string) => void;
  location: string; setLocation: (v: string) => void;
  workModel: WorkModel; setWorkModel: (v: WorkModel) => void;
  seniority: Seniority; setSeniority: (v: Seniority) => void;
  salary: string; setSalary: (v: string) => void;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Conte-nos o que você procura
        </h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Usamos isso para calcular seu Match com as vagas.
        </p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <Label htmlFor="ob-role">Cargo desejado</Label>
          <Input id="ob-role" className={inputCls}
            placeholder="Ex.: Desenvolvedor(a) Front-end Pleno"
            value={desiredRole} onChange={(e) => setDesiredRole(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ob-loc">Localização</Label>
          <Input id="ob-loc" className={inputCls} placeholder="Cidade — Estado"
            value={location} onChange={(e) => setLocation(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ob-model">Modelo de trabalho</Label>
          <Select value={workModel} onValueChange={setWorkModel}>
            <SelectTrigger id="ob-model" className={inputCls}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["Remoto", "Híbrido", "Presencial"].map((m) => (
                <SelectItem key={m} value={m}>{m}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ob-sen">Senioridade</Label>
          <Select value={seniority} onValueChange={setSeniority}>
            <SelectTrigger id="ob-sen" className={inputCls}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["Estágio", "Júnior", "Pleno", "Sênior", "Especialista"].map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="ob-salary">Pretensão salarial</Label>
          <Input id="ob-salary" className={inputCls} placeholder="Ex.: R$ 12.000"
            value={salary} onChange={(e) => setSalary(e.target.value)} />
        </div>
      </div>
    </div>
  );
}

export function StepDone({ name }: { name: string }) {
  const first = name.split(" ")[0] || "por lá";
  return (
    <div className="space-y-5 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-success/15">
        <PartyPopper className="h-7 w-7 text-success" />
      </div>
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Seu perfil está pronto</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">
          A IA finalizou a análise do seu currículo, {first}.
        </p>
      </div>
      <AIInsight className="text-left">
        <p>
          Identificamos <strong>18 competências</strong> no seu currículo e
          encontramos <strong>12 vagas</strong> com mais de 80% de
          compatibilidade.
        </p>
      </AIInsight>
      <p className="text-xs text-muted-foreground">
        <Sparkles className="mr-1 inline h-3.5 w-3.5 text-primary dark:text-primary-foreground" />
        Você poderá revisar e editar tudo depois — nada aqui é definitivo.
      </p>
    </div>
  );
}

