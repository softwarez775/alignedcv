import { Link } from "react-router-dom";
import {
  Sparkles,
  ArrowRight,
  FileSearch,
  ScanSearch,
  FileEdit,
  UserPlus,
  Target,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { MatchRing } from "@/components/match/MatchScore";

/** Landing page pública — seção 23 do prompt */
export default function Landing() {
  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-30 border-b bg-card/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center gap-3 px-6">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="text-lg font-bold">AlignedCV</span>
          <nav className="ml-auto hidden items-center gap-6 text-sm text-muted-foreground md:flex">
            <a href="#como-funciona" className="hover:text-foreground">Como funciona</a>
            <a href="#match" className="hover:text-foreground">Match inteligente</a>
            <a href="#ats" className="hover:text-foreground">Currículo ATS</a>
          </nav>
          <Button asChild className="ml-4 md:ml-6">
            <Link to="/onboarding">
              Entrar no app <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 pb-16 pt-20 text-center md:pt-28">
        <Badge variant="ai" className="mb-5">
          <Sparkles className="mr-1 h-3 w-3" /> Inteligência artificial para sua carreira
        </Badge>
        <h1 className="mx-auto max-w-3xl text-balance text-4xl font-extrabold tracking-tight md:text-6xl">
          Seu currículo. A vaga certa.{" "}
          <span className="bg-gradient-to-r from-primary to-success bg-clip-text text-transparent">
            O match inteligente.
          </span>
        </h1>
        <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground">
          Use IA para encontrar vagas compatíveis e criar currículos
          personalizados que passam pelos sistemas ATS.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button asChild size="lg" className="px-8 text-base">
            <Link to="/onboarding">
              Começar gratuitamente <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="px-8 text-base">
            <a href="#como-funciona">Ver como funciona</a>
          </Button>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Sem cadastro. Sem login. Entre e comece a usar.
        </p>

        <div className="mx-auto mt-12 grid max-w-4xl grid-cols-2 gap-3 text-left md:grid-cols-4">
          {[
            { icon: FileSearch, label: "Análise de currículo com IA" },
            { icon: Target, label: "Match por compatibilidade" },
            { icon: ScanSearch, label: "Score ATS em tempo real" },
            { icon: FileEdit, label: "Versões por vaga" },
          ].map((f) => (
            <Card key={f.label} className="border-dashed">
              <CardContent className="flex items-center gap-2.5 p-4">
                <f.icon className="h-5 w-5 shrink-0 text-primary dark:text-primary-foreground" />
                <span className="text-xs font-medium leading-snug">{f.label}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <LandingHowItWorks />
      <LandingMatch />
      <LandingATS />
      <LandingCTA />
      <footer className="border-t py-10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 text-sm text-muted-foreground md:flex-row">
          <span className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary dark:text-primary-foreground" />
            AlignedCV — match inteligente de carreira
          </span>
          <span>MVP demonstrativo · dados fictícios · nenhuma informação real é coletada</span>
        </div>
      </footer>
    </div>
  );
}
function LandingHowItWorks() {
  return (
    <section id="como-funciona" className="border-t bg-card/40 py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 className="text-center text-3xl font-bold tracking-tight">Como funciona</h2>
        <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">
          Três passos para sair do currículo genérico e chegar na vaga certa.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              n: "01",
              icon: UserPlus,
              title: "Crie seu perfil",
              text: "Importe seu currículo atual ou comece do zero. A IA extrai competências, experiências e forma um Perfil Profissional.",
            },
            {
              n: "02",
              icon: Target,
              title: "Encontre seu Match",
              text: "Veja vagas com pontuação de compatibilidade e entenda exatamente por que você combina — e onde estão os gaps.",
            },
            {
              n: "03",
              icon: FileEdit,
              title: "Adapte seu currículo",
              text: "Gere versões otimizadas por vaga, com palavras-chave certas e score ATS em tempo real até a exportação em PDF.",
            },
          ].map((s) => (
            <Card key={s.n} className="relative overflow-hidden">
              <span className="absolute right-4 top-3 text-5xl font-extrabold text-primary/10">
                {s.n}
              </span>
              <CardContent className="p-6">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                  <s.icon className="h-5 w-5 text-primary dark:text-primary-foreground" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{s.text}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}

function LandingMatch() {
  return (
    <section id="match" className="py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 md:grid-cols-2">
        <div>
          <Badge variant="success" className="mb-4">Match inteligente</Badge>
          <h2 className="text-3xl font-bold tracking-tight">
            Pare de se candidatar às cegas
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            O AlignedCV compara seu perfil com cada vaga em sete dimensões:
            competências, experiência, senioridade, palavras-chave, formação,
            localização e modelo de trabalho. O resultado é um score claro — e a
            explicação dele.
          </p>
          <ul className="mt-6 space-y-2.5">
            {[
              "Pontuação de 0 a 100 com justificativa",
              "Pontos fortes, gaps e diferenciais por vaga",
              "Apenas vagas que fazem sentido para você",
            ].map((i) => (
              <li key={i} className="flex items-start gap-2.5 text-sm">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                {i}
              </li>
            ))}
          </ul>
        </div>
        <Card className="p-8">
          <div className="flex flex-wrap items-center justify-center gap-4 text-center sm:gap-6">
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground">Vaga</p>
              <p className="mt-1 text-sm font-semibold">Front-end Pleno</p>
              <p className="text-xs text-muted-foreground">Tech Solutions</p>
            </div>
            <span className="text-2xl font-bold text-muted-foreground">×</span>
            <div>
              <p className="text-xs font-semibold uppercase text-muted-foreground">Perfil</p>
              <p className="mt-1 text-sm font-semibold">Desenvolvedora</p>
              <p className="text-xs text-muted-foreground">5 anos · React, TS</p>
            </div>
            <span className="text-2xl font-bold text-muted-foreground">=</span>
            <MatchRing score={94} size={110} />
          </div>
        </Card>
      </div>
    </section>
  );
}
function LandingATS() {
  return (
    <section id="ats" className="border-t bg-card/40 py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-6 md:grid-cols-2">
        <Card className="p-6">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-4">
            <div className="rounded-lg border bg-background p-4">
              <p className="text-xs font-semibold text-muted-foreground">
                Currículo original
              </p>
              <p className="mt-2 text-3xl font-bold text-foreground/40">72</p>
              <p className="text-[11px] text-muted-foreground">score ATS</p>
              <ul className="mt-3 space-y-1 text-[11px] text-muted-foreground">
                <li>• Palavras-chave genéricas</li>
                <li>• Sem resultados quantificados</li>
              </ul>
            </div>
            <ArrowRight className="h-6 w-6 text-primary" />
            <div className="rounded-lg border border-success/40 bg-success/5 p-4">
              <p className="text-xs font-semibold text-success">Currículo otimizado</p>
              <p className="mt-2 text-3xl font-bold text-success">94</p>
              <p className="text-[11px] text-success/80">score ATS</p>
              <ul className="mt-3 space-y-1 text-[11px] text-success/90">
                <li>• Palavras-chave da vaga</li>
                <li>• Conquistas quantificadas</li>
              </ul>
            </div>
          </div>
        </Card>
        <div>
          <Badge variant="ai" className="mb-4">Currículo ATS</Badge>
          <h2 className="text-3xl font-bold tracking-tight">
            Passe pelos robôs antes dos recrutadores
          </h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            A maioria das empresas usa sistemas ATS para filtrar currículos
            antes de qualquer humano ler. O AlignedCV avalia estrutura,
            palavras-chave, clareza e formatação do seu currículo — e mostra
            exatamente o que melhorar enquanto você edita.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            <FileEdit className="mr-1 inline h-4 w-4 text-primary dark:text-primary-foreground" />
            Exportação em PDF com texto selecionável, lido corretamente por ATS.
          </p>
        </div>
      </div>
    </section>
  );
}

function LandingCTA() {
  return (
    <section className="border-t py-20">
      <div className="mx-auto max-w-3xl px-6 text-center">
        <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
          Pronto para a vaga certa?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Importe seu currículo, veja suas vagas com Match e gere versões
          otimizadas. Tudo em poucos minutos.
        </p>
        <Button asChild size="lg" className="mt-8 px-10 text-base">
          <Link to="/onboarding">
            Começar gratuitamente <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    </section>
  );
}


