import { useEffect, useState } from "react";
import { Sparkles, RefreshCw, Briefcase, Compass, Award, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AIInsight } from "@/components/ai/AIInsight";
import { useAppStore } from "@/stores/useAppStore";
import { aiService } from "@/lib/ai";
import type { SmartProfile } from "@/types";

/** Perfil Profissional Inteligente — seção 11 do prompt */
export default function Profile() {
  const baseResume = useAppStore((s) => s.baseResume);
  const storedProfile = useAppStore((s) => s.profile);
  const refreshProfile = useAppStore((s) => s.refreshProfile);
  const [profile, setProfile] = useState<SmartProfile | null>(storedProfile);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setProfile(storedProfile);
  }, [storedProfile]);

  const regenerate = async () => {
    if (!baseResume) return;
    setLoading(true);
    try {
      await refreshProfile();
      setProfile(useAppStore.getState().profile);
    } finally {
      setLoading(false);
    }
  };

  if (!baseResume) return null;

  if (!profile) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-64 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Seu Perfil Profissional
          </h1>
          <p className="mt-1.5 text-muted-foreground">
            A IA transformou seu currículo em um perfil estruturado — revisado por você.
          </p>
        </div>
        <Button variant="outline" onClick={regenerate} disabled={loading}>
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          {loading ? "Analisando seu currículo..." : "Reanalisar com IA"}
        </Button>
      </div>

      {/* Identidade */}
      <Card>
        <CardContent className="flex flex-wrap items-center gap-5 p-6">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-lg">
              {baseResume.personal.name
                .split(/\s+/)
                .slice(0, 2)
                .map((w) => w[0]?.toUpperCase())
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h2 className="text-lg font-bold">{baseResume.personal.name}</h2>
            <p className="text-sm text-muted-foreground">
              {baseResume.personal.title}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <Badge variant="ai">
                <Sparkles className="mr-1 h-3 w-3" /> {profile.seniority}
              </Badge>
              <Badge variant="secondary">{profile.area}</Badge>
              <Badge variant="outline">{profile.totalSkills} competências</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumo gerado pela IA */}
      <AIInsight title="Resumo gerado pela IA">
        {profile.summary}
        <p className="mt-2 text-xs text-muted-foreground">
          Gerado apenas com as informações do seu currículo — nada foi inventado.
          <button className="ml-1 font-medium text-primary underline-offset-2 hover:underline"
            onClick={regenerate} disabled={loading}>
            Regenerar
          </button>
        </p>
      </AIInsight>

      {/* Competências principais */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Award className="h-4 w-4 text-primary dark:text-primary-foreground" />
            Principais competências
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1.5">
            {profile.skills.map((skill) => (
              <Badge key={skill} variant="secondary">{skill}</Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Áreas e cargos recomendados */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Compass className="h-4 w-4 text-primary dark:text-primary-foreground" />
              Áreas recomendadas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {profile.recommendedAreas.map((area) => (
              <p key={area} className="flex items-center gap-2 text-sm">
                <Briefcase className="h-3.5 w-3.5 text-muted-foreground" /> {area}
              </p>
            ))}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-4 w-4 text-primary dark:text-primary-foreground" />
              Cargos recomendados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {profile.recommendedRoles.map((role) => (
              <p key={role} className="flex items-center gap-2 text-sm">
                <Briefcase className="h-3.5 w-3.5 text-muted-foreground" /> {role}
              </p>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
