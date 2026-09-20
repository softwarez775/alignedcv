import { Printer } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Botão de exportação em PDF — usa a impressão do navegador,
 * que gera PDF com texto selecionável (ideal para ATS).
 */
export function ExportPDFButton({
  targetRef,
  fileName,
  label = "Exportar PDF",
  className,
}: {
  targetRef: React.RefObject<HTMLElement | null>;
  fileName: string;
  label?: string;
  className?: string;
}) {
  const handlePrint = () => {
    const el = targetRef.current;
    if (el) el.classList.add("print-area");
    document.title = fileName;
    window.print();
    setTimeout(() => {
      el?.classList.remove("print-area");
      document.title = "AlignedCV";
    }, 500);
  };
  return (
    <Button variant="outline" onClick={handlePrint} className={className}>
      <Printer className="h-4 w-4" /> {label}
    </Button>
  );
}
