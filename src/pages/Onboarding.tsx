import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, ArrowRight, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAppStore } from "@/stores/useAppStore";
import { buildDemoResume } from "@/lib/mock-data";
import { toast } from "sonner";
import type { WorkModel, Seniority } from "@/types";
import {
  StepAbout,
  StepResume,
  StepGoals,
  StepDone,
} from "@/pages/onboarding-steps";

const STEPS = ["Sobre você", "Currículo", "O que você procura", "Pronto"];

/**
 * Onboarding direto na primeira utilização — seções 21/22 do prompt.
 * Sem conta, sem senha: as informações ficam salvas no navegador.
 */
export default function Onboarding() {
  const navigate = useNavigate();
  const completeOnboarding = useAppStore((s) => s.completeOnboarding);
  const [step, setStep] = useState(0);

  const [name, setName] = useState("");
  const [title, setTitle] = useState("");
  const [area, setArea] = useState("");
  const [resumeText, setResumeText] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [desiredRole, setDesiredRole] = useState("");
  const [location, setLocation] = useState("");
  const [workModel, setWorkModel] = useState<WorkModel>("Remoto");
  const [seniority, setSeniority] = useState<Seniority>("Pleno");
  const [salary, setSalary] = useState("");
  const [finishing, setFinishing] = useState(false);

  const canNext =
    step === 0
      ? name.trim().length > 1 && title.trim().length > 1
      : step === 2
        ? desiredRole.trim().length > 1
        : true;

  const handleUpload = (file: File | undefined) => {
    if (!file) return;
    if (!/\.(pdf|docx?|txt)$/i.test(file.name)) {
      toast.error("Formato não suportado", {
        description: "Envie um arquivo PDF, DOCX ou TXT.",
      });
      return;
    }
    setFileName(file.name);
    toast.success("Currículo recebido!", {
      description: `A IA analisará "${file.name}" e extrairá seu perfil profissional.`,
    });
  };

  const finish = async () => {
    setFinishing(true);
    const preferences = {
      desiredRole: desiredRole || title,
      location: location || "Brasil",
      workModel,
      seniority,
      salaryExpectation: salary,
    };
    // MVP: o texto colado/enviado alimenta o perfil demo.
    // (Parse real de PDF/DOCX entra com a integração de IA real.)
    const demo = buildDemoResume(Date.now());
    demo.personal.name = name.trim() || demo.personal.name;
    demo.personal.title = title.trim() || demo.personal.title;
    if (resumeText.trim()) demo.summary = resumeText.trim().slice(0, 600);

    await completeOnboarding({
      name,
      title,
      area,
      preferences,
      resume: demo,
      uploadedFileName: fileName ?? undefined,
    });
    toast.success("Perfil profissional pronto!", {
      description: "Bem-vindo(a) ao AlignedCV.",
    });
    navigate("/app");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-xl">
        <div className="mb-8 flex items-center justify-between">
          <span className="flex items-center gap-2 text-sm font-bold">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" />
            </span>
            AlignedCV
          </span>
          <Badge variant="secondary">
            Etapa {step + 1} de {STEPS.length}
          </Badge>
        </div>
        <Progress value={((step + 1) / STEPS.length) * 100} className="mb-8 h-1.5" />

        <Card>
          <CardContent className="p-6 sm:p-8">
            {step === 0 && (
              <StepAbout
                name={name} title={title} area={area}
                setName={setName} setTitle={setTitle} setArea={setArea}
              />
            )}
            {step === 1 && (
              <StepResume
                resumeText={resumeText} setResumeText={setResumeText}
                fileName={fileName} onUpload={handleUpload}
              />
            )}
            {step === 2 && (
              <StepGoals
                desiredRole={desiredRole} setDesiredRole={setDesiredRole}
                location={location} setLocation={setLocation}
                workModel={workModel} setWorkModel={setWorkModel}
                seniority={seniority} setSeniority={setSeniority}
                salary={salary} setSalary={setSalary}
              />
            )}
            {step === 3 && <StepDone name={name} />}

            <div className="mt-8 flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                disabled={step === 0 || finishing}
              >
                <ArrowLeft className="h-4 w-4" /> Voltar
              </Button>
              {step < 3 ? (
                <Button onClick={() => setStep((s) => s + 1)} disabled={!canNext}>
                  Avançar <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={finish} disabled={finishing} size="lg">
                  {finishing ? (
                    <>
                      <Sparkles className="h-4 w-4 animate-pulse" /> Gerando seu perfil...
                    </>
                  ) : (
                    <>
                      Encontrar minhas vagas <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Sem cadastro e sem login — suas informações ficam salvas apenas neste
          navegador.
        </p>
      </div>
    </div>
  );
}
