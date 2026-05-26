import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, TrendingUp } from "lucide-react";

export const Route = createFileRoute("/_authenticated/territorios")({
  component: TerritoriosPage,
});

const territorios = [
  { nome: "Campo Grande", zona: "Oeste", score: 92, var: "+6", densidade: "Alta", ticket: "R$ 285k" },
  { nome: "Santa Cruz", zona: "Oeste", score: 88, var: "+4", densidade: "Alta", ticket: "R$ 240k" },
  { nome: "Madureira", zona: "Norte", score: 85, var: "+6", densidade: "Média-alta", ticket: "R$ 295k" },
  { nome: "Bangu", zona: "Oeste", score: 81, var: "+1", densidade: "Média", ticket: "R$ 220k" },
  { nome: "Realengo", zona: "Oeste", score: 78, var: "-2", densidade: "Média", ticket: "R$ 235k" },
  { nome: "Jacarepaguá", zona: "Oeste", score: 76, var: "+3", densidade: "Média", ticket: "R$ 410k" },
  { nome: "Pavuna", zona: "Norte", score: 72, var: "0", densidade: "Média", ticket: "R$ 195k" },
  { nome: "Penha", zona: "Norte", score: 70, var: "-1", densidade: "Média-baixa", ticket: "R$ 255k" },
];

function TerritoriosPage() {
  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      <PageHeader
        title="Inteligência territorial"
        subtitle="Mapa, ranking e leitura urbana das regiões de atuação da Cury no Rio de Janeiro."
      />

      <Card className="p-0 glass border-border/60 overflow-hidden">
        <div className="relative h-[420px] bg-grid">
          <div className="absolute inset-0 bg-[var(--gradient-radial)]" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <MapPin className="h-10 w-10 text-gold mb-3" />
            <div className="text-sm font-medium">Mapa interativo</div>
            <div className="text-xs text-muted-foreground max-w-md mt-1">
              Slot reservado para integração com Mapbox / Leaflet · camadas territoriais, calor de demanda e clusters por empreendimento.
            </div>
          </div>
          {/* Pontos decorativos */}
          {[
            { top: "30%", left: "22%" }, { top: "55%", left: "38%" },
            { top: "42%", left: "62%" }, { top: "68%", left: "70%" },
            { top: "25%", left: "78%" },
          ].map((p, i) => (
            <div
              key={i}
              className="absolute h-3 w-3 rounded-full bg-gold shadow-[0_0_20px_oklch(0.78_0.115_85/0.8)] animate-pulse"
              style={p}
            />
          ))}
        </div>
      </Card>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-5 glass border-border/60">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Regiões monitoradas</div>
          <div className="mt-2 text-3xl font-semibold">42</div>
          <div className="mt-1 text-xs text-success flex items-center gap-1"><TrendingUp className="h-3 w-3" /> +5 no trimestre</div>
        </Card>
        <Card className="p-5 glass border-border/60">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Score médio</div>
          <div className="mt-2 text-3xl font-semibold">82,4</div>
          <div className="mt-1 text-xs text-muted-foreground">+3,1 vs período anterior</div>
        </Card>
        <Card className="p-5 glass border-border/60">
          <div className="text-xs uppercase tracking-wider text-muted-foreground">Cobertura RJ</div>
          <div className="mt-2 text-3xl font-semibold">68%</div>
          <div className="mt-1 text-xs text-muted-foreground">Zona Oeste · Norte · Centro</div>
        </Card>
      </div>

      <Card className="mt-6 glass border-border/60 overflow-hidden">
        <div className="px-5 py-4 border-b border-border/60">
          <h3 className="font-semibold">Ranking de territórios</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase text-muted-foreground border-b border-border/60">
                <th className="px-5 py-3">Bairro</th>
                <th className="px-5 py-3">Zona</th>
                <th className="px-5 py-3">Score</th>
                <th className="px-5 py-3">Variação</th>
                <th className="px-5 py-3">Densidade</th>
                <th className="px-5 py-3 text-right">Ticket médio</th>
              </tr>
            </thead>
            <tbody>
              {territorios.map((t) => (
                <tr key={t.nome} className="border-b border-border/40 hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3 font-medium">{t.nome}</td>
                  <td className="px-5 py-3 text-muted-foreground">{t.zona}</td>
                  <td className="px-5 py-3">
                    <span className="font-mono text-gold">{t.score}</span>
                  </td>
                  <td className="px-5 py-3">
                    <Badge variant="outline" className={
                      t.var.startsWith("+") ? "border-success/40 text-success" :
                      t.var.startsWith("-") ? "border-destructive/40 text-destructive" :
                      "border-border text-muted-foreground"
                    }>{t.var}</Badge>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">{t.densidade}</td>
                  <td className="px-5 py-3 text-right font-mono">{t.ticket}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
