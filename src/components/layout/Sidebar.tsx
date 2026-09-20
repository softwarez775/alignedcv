import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Search,
  FileText,
  Files,
  ScanSearch,
  KanbanSquare,
  Sparkles,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAppStore } from "@/stores/useAppStore";
import { useUiStore } from "@/stores/useUiStore";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

export const NAV_ITEMS = [
  { to: "/app", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/app/vagas", label: "Encontrar Vagas", icon: Search },
  { to: "/app/curriculo", label: "Meu Currículo", icon: FileText },
  { to: "/app/curriculos", label: "Currículos", icon: Files },
  { to: "/app/ats", label: "Análise ATS", icon: ScanSearch },
  { to: "/app/candidaturas", label: "Candidaturas", icon: KanbanSquare },
  { to: "/app/perfil", label: "Perfil Profissional", icon: Sparkles },
  { to: "/app/configuracoes", label: "Configurações", icon: Settings },
] as const;

export function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex-1 space-y-1 px-3" aria-label="Navegação principal">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          end={"end" in item && item.end}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:bg-secondary hover:text-foreground",
            )
          }
        >
          <item.icon className="h-4 w-4 shrink-0" />
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}

export function SidebarFooter() {
  const navigate = useNavigate();
  const baseResume = useAppStore((s) => s.baseResume);
  const toggleTheme = useUiStore((s) => s.toggleTheme);
  const theme = useUiStore((s) => s.theme);
  const name = baseResume?.personal.name || "Seu perfil";
  const title = baseResume?.personal.title || "Configure seu cargo";

  return (
    <div className="border-t p-3">
      <DropdownMenu>
        <DropdownMenuTrigger className="w-full rounded-md p-2 text-left transition-colors hover:bg-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>{initialsOf(name)}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium">{name}</p>
              <p className="truncate text-xs text-muted-foreground">{title}</p>
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="top" align="start" className="w-56">
          <DropdownMenuLabel>Preferências</DropdownMenuLabel>
          <DropdownMenuItem onClick={() => navigate("/app/configuracoes")}>
            Configurações
          </DropdownMenuItem>
          <DropdownMenuItem onClick={toggleTheme}>
            Tema {theme === "light" ? "escuro" : "claro"}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-xs font-normal text-muted-foreground">
            MVP local — sem login, dados salvos no navegador
          </DropdownMenuLabel>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

export function BrandHeader({ subtitle }: { subtitle?: string }) {
  return (
    <div className="flex items-center gap-2.5 px-5 py-5">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Sparkles className="h-4 w-4" />
      </div>
      <div>
        <p className="text-sm font-bold leading-none">AlignedCV</p>
        {subtitle && (
          <p className="mt-1 text-[11px] text-muted-foreground">{subtitle}</p>
        )}
      </div>
      <Badge variant="ai" className="ml-auto">IA</Badge>
    </div>
  );
}
