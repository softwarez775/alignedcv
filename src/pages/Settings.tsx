import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Moon, Sun, ShieldCheck, Trash2, Info } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppStore } from "@/stores/useAppStore";
import { useUiStore } from "@/stores/useUiStore";

/** Configurações — seções 28 e 36 do prompt */
export default function Settings() {
  const navigate = useNavigate();
  const clearAllData = useAppStore((s) => s.clearAllData);
  const theme = useUiStore((s) => s.theme);
  const toggleTheme = useUiStore((s) => s.toggleTheme);
  const baseResume = useAppStore((s) => s.baseResume);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleClear = () => {
    clearAllData();
    setConfirmOpen(false);
    toast.success("Dados apagados", {
      description: "Todas as informações locais foram removidas deste navegador.",
    });
    navigate("/", { replace: true });
  };

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Configurações</h1>
        <p className="mt-1.5 text-muted-foreground">
          Preferências, privacidade e seus dados locais.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Aparência</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between">
          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            {theme === "light" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            Tema {theme === "light" ? "claro" : "escuro"}
          </p>
          <Button variant="outline" size="sm" onClick={toggleTheme}>
            Alternar para {theme === "light" ? "escuro" : "claro"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Dados pessoais</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Nome</span>
            <span className="font-medium">{baseResume?.personal.name ?? "—"}</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Cargo</span>
            <span className="font-medium">{baseResume?.personal.title ?? "—"}</span>
          </div>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">E-mail</span>
            <span className="font-medium">{baseResume?.personal.email ?? "—"}</span>
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <ShieldCheck className="h-4 w-4 text-success" /> Privacidade
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3 rounded-lg border bg-secondary/50 p-3.5">
            <Info className="mt-0.5 h-4 w-4 shrink-0 text-primary dark:text-primary-foreground" />
            <p className="text-sm text-muted-foreground">
              Seus dados profissionais são utilizados para personalizar suas
              recomendações e currículos. Neste MVP, sem autenticação, tudo fica
              salvo <strong>localmente neste navegador</strong> — nada é enviado
              a servidores.
            </p>
          </div>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">Visibilidade dos dados</p>
              <p className="text-xs text-muted-foreground">
                Nenhuma informação privada é exposta em páginas públicas.
              </p>
            </div>
            <Badge variant="success">Local</Badge>
          </div>
          <Separator />
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-sm font-medium">Limpar meus dados</p>
              <p className="text-xs text-muted-foreground">
                Apaga perfil, currículos, candidaturas e preferências salvas.
              </p>
            </div>
            <Button variant="destructive" size="sm" onClick={() => setConfirmOpen(true)}>
              <Trash2 className="h-4 w-4" /> Limpar
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Bell className="h-4 w-4" /> Notificações
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p className="rounded-lg border bg-secondary/50 p-3">
            “Encontramos 5 novas vagas com mais de 90% de Match.”
          </p>
          <p className="rounded-lg border bg-secondary/50 p-3">
            “Seu currículo ATS aumentou de 84 para 92.”
          </p>
          <p className="text-xs">
            No MVP local, as notificações aparecem como alertas durante a sessão
            (ex.: toasts de score em tempo real no editor).
          </p>
        </CardContent>
      </Card>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Limpar todos os dados?</DialogTitle>
            <DialogDescription>
              Isso apaga permanentemente seu perfil, currículos, candidaturas e
              preferências deste navegador. A ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleClear}>
              Apagar tudo
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

