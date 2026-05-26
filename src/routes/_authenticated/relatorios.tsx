import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileBarChart, Download } from "lucide-react";

export const Route = createFileRoute("/_authenticated/relatorios")({
  component: RelatoriosPage,
});

const relatorios = [
  { titulo: "Absorção mensal — Novembro", tipo: "Operacional", data: "01 dez 2025", paginas: 18 },
  { titulo: "Diagnóstico Zona Oeste Q4", tipo: "Estratégico", data: "28 nov 2025", paginas: 42 },
  { titulo: "Performance de leads — Out/Nov", tipo: "Comercial", data: "20 nov 2025", paginas: 26 },
  { titulo: "Análise territorial Madureira", tipo: "Territorial", data: "12 nov 2025", paginas: 31 },
  { titulo: "Pipeline e conversão — Set", tipo: "Comercial", data: "02 out 2025", paginas: 22 },
];

function RelatoriosPage() {
  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      <PageHeader
        title="Relatórios"
        subtitle="Documentos analíticos gerados por IA e exportáveis."
        actions={<Button size="sm" className="bg-gold text-gold-foreground hover:bg-gold/90"><FileBarChart className="mr-2 h-4 w-4" />Novo relatório</Button>}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {relatorios.map((r) => (
          <Card key={r.titulo} className="p-5 glass border-border/60 hover:border-gold/30 transition-colors flex items-start gap-4">
            <div className="h-10 w-10 rounded-md bg-[var(--gradient-petrol)] flex items-center justify-center shrink-0">
              <FileBarChart className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold truncate">{r.titulo}</h3>
              </div>
              <div className="mt-1 text-xs text-muted-foreground">
                {r.tipo} · {r.data} · {r.paginas} páginas
              </div>
              <div className="mt-4 flex items-center gap-2">
                <Button size="sm" variant="outline">Visualizar</Button>
                <Button size="sm" variant="ghost"><Download className="h-4 w-4" /></Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
