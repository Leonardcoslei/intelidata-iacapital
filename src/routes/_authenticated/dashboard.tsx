import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowDownRight,
  ArrowUpRight,
  Building2,
  Users,
  TrendingUp,
  AlertTriangle,
  MapPin,
  Sparkles,
  Calendar,
  Download,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";

export const Route = createFileRoute("/_authenticated/dashboard")({
  component: DashboardPage,
});

const kpis = [
  { label: "Leads ativos", value: "12.847", delta: +14.2, icon: Users },
  { label: "Empreendimentos", value: "38", delta: +2.1, icon: Building2 },
  { label: "Absorção média", value: "68%", delta: +5.4, icon: TrendingUp },
  { label: "Score territorial", value: "84,3", delta: -1.2, icon: Sparkles },
];

const absorptionData = [
  { m: "Jan", v: 42, p: 38 }, { m: "Fev", v: 48, p: 41 }, { m: "Mar", v: 55, p: 47 },
  { m: "Abr", v: 51, p: 49 }, { m: "Mai", v: 63, p: 55 }, { m: "Jun", v: 71, p: 60 },
  { m: "Jul", v: 68, p: 64 }, { m: "Ago", v: 74, p: 67 }, { m: "Set", v: 79, p: 70 },
  { m: "Out", v: 82, p: 73 }, { m: "Nov", v: 77, p: 75 }, { m: "Dez", v: 86, p: 78 },
];

const regions = [
  { name: "Campo Grande", score: 92, leads: 2843, abs: "78%" },
  { name: "Santa Cruz", score: 88, leads: 2110, abs: "72%" },
  { name: "Madureira", score: 85, leads: 1987, abs: "69%" },
  { name: "Bangu", score: 81, leads: 1564, abs: "65%" },
  { name: "Realengo", score: 78, leads: 1402, abs: "61%" },
  { name: "Jacarepaguá", score: 76, leads: 1298, abs: "58%" },
];

const ranking = regions.slice().sort((a, b) => b.score - a.score);

const heatCells = Array.from({ length: 84 }, (_, i) => {
  const intensity = (Math.sin(i * 0.37) + Math.cos(i * 0.21) + 2) / 4;
  return Math.min(1, Math.max(0.05, intensity));
});

const alerts = [
  { type: "risco", title: "Queda de absorção em Realengo", desc: "Conversão lead→visita caiu 12% nos últimos 14 dias.", level: "alto" },
  { type: "oportunidade", title: "Campo Grande aquecido", desc: "Pico de busca por 2 quartos · ticket médio +8%.", level: "alto" },
  { type: "tendência", title: "Madureira ganhando tração", desc: "Score subiu 6 pontos no último mês.", level: "médio" },
];

const timeline = [
  { time: "há 2h", title: "Novo empreendimento cadastrado", desc: "Cury Vista Park — Campo Grande" },
  { time: "há 5h", title: "Relatório semanal gerado", desc: "Absorção · 12 regiões · IA Gemini 2.5" },
  { time: "ontem", title: "Pico de leads orgânicos", desc: "+38% vs média · Bangu" },
  { time: "2 dias", title: "Alerta de risco resolvido", desc: "Saturação narrativa em Santa Cruz" },
];

const barData = ranking.map((r) => ({ name: r.name.split(" ")[0], score: r.score }));

function KpiCard({ kpi }: { kpi: typeof kpis[number] }) {
  const Icon = kpi.icon;
  const positive = kpi.delta >= 0;
  return (
    <Card className="relative overflow-hidden p-5 glass border-border/60 hover:border-gold/30 transition-colors">
      <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-[var(--gradient-petrol)] opacity-20 blur-2xl" />
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">{kpi.label}</span>
        <Icon className="h-4 w-4 text-gold" />
      </div>
      <div className="mt-3 text-3xl font-semibold tracking-tight">{kpi.value}</div>
      <div className={"mt-2 inline-flex items-center gap-1 text-xs " + (positive ? "text-success" : "text-destructive")}>
        {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
        {positive ? "+" : ""}{kpi.delta}% vs período anterior
      </div>
    </Card>
  );
}

function DashboardPage() {
  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      <PageHeader
        title="Dashboard estratégico"
        subtitle="Visão consolidada de territórios, leads, empreendimentos e absorção — Rio de Janeiro."
        actions={
          <>
            <Button variant="outline" size="sm"><Calendar className="mr-2 h-4 w-4" />Últimos 30 dias</Button>
            <Button size="sm" className="bg-gold text-gold-foreground hover:bg-gold/90">
              <Download className="mr-2 h-4 w-4" />Exportar
            </Button>
          </>
        }
      />

      <h2 className="sr-only">Indicadores chave</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => <KpiCard key={k.label} kpi={k} />)}
      </div>

      <h2 className="sr-only">Absorção e ranking territorial</h2>

      <div className="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2 p-5 glass border-border/60">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Absorção imobiliária</h3>
              <p className="text-xs text-muted-foreground">Realizado vs projetado · 12 meses</p>
            </div>
            <Badge variant="outline" className="border-gold/40 text-gold">+12,4%</Badge>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={absorptionData}>
                <defs>
                  <linearGradient id="gPetrol" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.55 0.090 215)" stopOpacity={0.55} />
                    <stop offset="100%" stopColor="oklch(0.55 0.090 215)" stopOpacity={0.02} />
                  </linearGradient>
                  <linearGradient id="gGold" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.78 0.115 85)" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="oklch(0.78 0.115 85)" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
                <XAxis dataKey="m" stroke="oklch(0.68 0.025 230)" fontSize={12} />
                <YAxis stroke="oklch(0.68 0.025 230)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.18 0.022 230)",
                    border: "1px solid oklch(1 0 0 / 0.1)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Area type="monotone" dataKey="v" stroke="oklch(0.55 0.090 215)" strokeWidth={2} fill="url(#gPetrol)" />
                <Area type="monotone" dataKey="p" stroke="oklch(0.78 0.115 85)" strokeWidth={2} fill="url(#gGold)" strokeDasharray="4 3" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5 glass border-border/60">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold">Ranking territorial</h3>
              <p className="text-xs text-muted-foreground">Score consolidado</p>
            </div>
            <Sparkles className="h-4 w-4 text-gold" />
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData} layout="vertical" margin={{ left: 8 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" horizontal={false} />
                <XAxis type="number" stroke="oklch(0.68 0.025 230)" fontSize={12} domain={[0, 100]} />
                <YAxis type="category" dataKey="name" stroke="oklch(0.68 0.025 230)" fontSize={11} width={80} />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.18 0.022 230)",
                    border: "1px solid oklch(1 0 0 / 0.1)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="score" fill="oklch(0.55 0.090 215)" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2 p-5 glass border-border/60">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gold" /> Heatmap territorial
              </h3>
              <p className="text-xs text-muted-foreground">Densidade de demanda · Zona Oeste RJ</p>
            </div>
            <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
              Baixa
              <div className="flex gap-0.5">
                {[0.1, 0.3, 0.5, 0.7, 0.9].map((o) => (
                  <div key={o} className="h-2 w-4 rounded-sm" style={{ background: `oklch(0.55 0.09 215 / ${o})` }} />
                ))}
              </div>
              Alta
            </div>
          </div>
          <div className="grid grid-cols-12 gap-1.5">
            {heatCells.map((v, i) => (
              <div
                key={i}
                className="aspect-square rounded-sm transition-transform hover:scale-110"
                style={{
                  background: `oklch(0.55 0.09 215 / ${v})`,
                  boxShadow: v > 0.75 ? "0 0 12px oklch(0.78 0.115 85 / 0.4)" : "none",
                }}
                title={`Célula ${i + 1} · intensidade ${(v * 100).toFixed(0)}%`}
              />
            ))}
          </div>
        </Card>

        <Card className="p-5 glass border-border/60">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-gold" /> Alertas estratégicos
          </h3>
          <div className="space-y-3">
            {alerts.map((a) => (
              <div key={a.title} className="rounded-lg border border-border/60 p-3 hover:border-gold/30 transition-colors">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-[10px] uppercase">{a.type}</Badge>
                  <span className={"text-[10px] uppercase " + (a.level === "alto" ? "text-destructive" : "text-warning")}>
                    {a.level}
                  </span>
                </div>
                <div className="mt-2 text-sm font-medium">{a.title}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{a.desc}</div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="xl:col-span-2 p-5 glass border-border/60">
          <h3 className="font-semibold mb-4">Regiões em destaque</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {regions.map((r) => (
              <div key={r.name} className="rounded-lg border border-border/60 p-4 hover:border-gold/40 hover:bg-muted/30 transition-all">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium">{r.name}</div>
                  <span className="text-xs text-gold font-mono">{r.score}</span>
                </div>
                <div className="mt-3 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div className="h-full bg-[var(--gradient-petrol)]" style={{ width: `${r.score}%` }} />
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span>{r.leads.toLocaleString("pt-BR")} leads</span>
                  <span>Absorção {r.abs}</span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="p-5 glass border-border/60">
          <h3 className="font-semibold mb-4">Timeline analítica</h3>
          <ol className="relative border-l border-border/60 ml-2 space-y-5">
            {timeline.map((t) => (
              <li key={t.title} className="pl-4">
                <span className="absolute -left-[5px] h-2.5 w-2.5 rounded-full bg-gold shadow-[0_0_10px_oklch(0.78_0.115_85/0.6)]" />
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{t.time}</div>
                <div className="text-sm font-medium">{t.title}</div>
                <div className="text-xs text-muted-foreground">{t.desc}</div>
              </li>
            ))}
          </ol>
        </Card>
      </div>
    </div>
  );
}
