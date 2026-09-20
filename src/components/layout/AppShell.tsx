import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { SidebarNav, SidebarFooter, BrandHeader } from "./Sidebar";
import { useUiStore } from "@/stores/useUiStore";

/**
 * Shell do app: sidebar fixa no desktop, Sheet lateral no mobile.
 * Sem qualquer opção de login/cadastro/sair — acesso direto.
 */
export function AppShell() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useUiStore((s) => s.theme);
  const toggleTheme = useUiStore((s) => s.toggleTheme);

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r bg-card lg:flex">
        <BrandHeader subtitle="Match inteligente de carreira" />
        <SidebarNav />
        <SidebarFooter />
      </aside>

      {/* Header mobile/tablet */}
      <header className="sticky top-0 z-20 flex h-14 items-center gap-2 border-b bg-card/95 px-4 backdrop-blur lg:hidden">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setMobileOpen(true)}
          aria-label="Abrir menu de navegação"
        >
          <Menu className="h-5 w-5" />
        </Button>
        <span className="flex items-center gap-2 font-bold">
          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-[10px] text-primary-foreground">
            AC
          </span>
          AlignedCV
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="ml-auto"
          onClick={toggleTheme}
          aria-label="Alternar tema"
        >
          {theme === "light" ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </Button>
      </header>

      {/* Sidebar mobile (Sheet) */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <div className="flex h-full flex-col">
            <SheetTitle className="sr-only">Menu de navegação</SheetTitle>
            <BrandHeader subtitle="Match inteligente de carreira" />
            <SidebarNav onNavigate={() => setMobileOpen(false)} />
            <SidebarFooter />
          </div>
        </SheetContent>
      </Sheet>

      {/* Alternador de tema flutuante no desktop */}
      <div className="fixed bottom-6 right-6 z-20 hidden lg:block">
        <Button
          variant="outline"
          size="icon"
          onClick={toggleTheme}
          aria-label="Alternar tema"
          className="rounded-full shadow-md"
        >
          {theme === "light" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </Button>
      </div>

      <main className="lg:pl-60">
        <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

