import { Fragment } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { DataImportModal } from "@/components/data-import-modal";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend,
} from "recharts";
import {
  ArrowDownRight,
  ArrowUpRight,
  Filter,
  Layers,
  Minus,
  Search,
  Sparkles,
  TrendingUp,
  Upload,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/territorios")({
  head: () => ({
    meta: [
      { title: "Territórios — Motor de Inteligência" },
      {
        name: "description",
        content:
          "Ranking territorial, score, expansão, saturação, absorção, pressão institucional, liquidez e narrativa dominante das regiões do Rio de Janeiro.",
      },
    ],
  }),
  component: TerritoriosPage,
});

// =================== DATA (mock analítica) ===================

type Territorio = {
  nome: string;
  zona: "Oeste" | "Norte" | "Centro" | "Sul" | "Metro";
  score: number;
  variacao: number;
  expansao: number;
  saturacao: number;
  absorcao: number;
  pressao: number;
  liquidez: number;
  narrativa: number;
  narrativaLabel: "Valorização" | "Mobilidade" | "Requalificação" | "Demanda popular" | "Saturação" | "Renovação";
  ticket: number;
  vso: number;
};

const territorios: Territorio[] = [
  { nome: "Campo Grande",   zona: "Oeste",  score: 92, variacao: 6,  expansao: 88, saturacao: 42, absorcao: 81, pressao: 64, liquidez: 86, narrativa: 78, narrativaLabel: "Demanda popular",  ticket: 285, vso: 18.4 },
  { nome: "Santa Cruz",     zona: "Oeste",  score: 88, variacao: 4,  expansao: 91, saturacao: 36, absorcao: 79, pressao: 58, liquidez: 82, narrativa: 74, narrativaLabel: "Demanda popular",  ticket: 240, vso: 17.1 },
  { nome: "Madureira",      zona: "Norte",  score: 85, variacao: 6,  expansao: 72, saturacao: 61, absorcao: 84, pressao: 70, liquidez: 88, narrativa: 81, narrativaLabel: "Mobilidade",       ticket: 295, vso: 19.2 },
  { nome: "Bangu",          zona: "Oeste",  score: 81, variacao: 1,  expansao: 74, saturacao: 49, absorcao: 71, pressao: 55, liquidez: 76, narrativa: 65, narrativaLabel: "Valorização",      ticket: 220, vso: 14.8 },
  { nome: "Realengo",       zona: "Oeste",  score: 78, variacao: -2, expansao: 69, saturacao: 58, absorcao: 66, pressao: 51, liquidez: 71, narrativa: 60, narrativaLabel: "Saturação",        ticket: 235, vso: 12.6 },
  { nome: "Jacarepaguá",    zona: "Oeste",  score: 76, variacao: 3,  expansao: 65, saturacao: 71, absorcao: 64, pressao: 62, liquidez: 79, narrativa: 70, narrativaLabel: "Renovação",        ticket: 410, vso: 13.9 },
  { nome: "Pavuna",         zona: "Norte",  score: 72, variacao: 0,  expansao: 61, saturacao: 54, absorcao: 60, pressao: 49, liquidez: 66, narrativa: 57, narrativaLabel: "Demanda popular",  ticket: 195, vso: 11.3 },
  { nome: "Penha",          zona: "Norte",  score: 70, variacao: -1, expansao: 58, saturacao: 63, absorcao: 57, pressao: 53, liquidez: 64, narrativa: 55, narrativaLabel: "Saturação",        ticket: 255, vso: 10.7 },
  // NOVOS
  { nome: "Porto Maravilha", zona: "Centro", score: 86, variacao: 9,  expansao: 94, saturacao: 31, absorcao: 68, pressao: 88, liquidez: 73, narrativa: 92, narrativaLabel: "Requalificação",   ticket: 620, vso: 12.1 },
  { nome: "São Cristóvão",   zona: "Centro", score: 79, variacao: 5,  expansao: 82, saturacao: 44, absorcao: 65, pressao: 76, liquidez: 70, narrativa: 81, narrativaLabel: "Requalificação",   ticket: 340, vso: 11.4 },
  { nome: "Irajá",           zona: "Norte",  score: 74, variacao: 2,  expansao: 67, saturacao: 52, absorcao: 69, pressao: 54, liquidez: 72, narrativa: 63, narrativaLabel: "Mobilidade",       ticket: 265, vso: 12.9 },
  { nome: "Recreio",         zona: "Oeste",  score: 83, variacao: 4,  expansao: 71, saturacao: 66, absorcao: 73, pressao: 60, liquidez: 84, narrativa: 77, narrativaLabel: "Valorização",      ticket: 525, vso: 15.6 },
  { nome: "Piedade",         zona: "Norte",  score: 71, variacao: 1,  expansao: 64, saturacao: 57, absorcao: 62, pressao: 50, liquidez: 68, narrativa: 58, narrativaLabel: "Demanda popular",  ticket: 230, vso: 11.8 },
  { nome: "Niterói",         zona: "Metro",  score: 84, variacao: 3,  expansao: 76, saturacao: 59, absorcao: 70, pressao: 72, liquidez: 89, narrativa: 80, narrativaLabel: "Valorização",      ticket: 480, vso: 14.2 },
];

const evolucaoTemporal = [
  { mes: "Jan", oeste: 78, norte: 70, centro: 74, metro: 76 },
  { mes: "Fev", oeste: 80, norte: 71, centro: 76, metro: 77 },
  { mes: "Mar", oeste: 81, norte: 72, centro: 78, metro: 78 },
  { mes: "Abr", oeste: 83, norte: 73, centro: 80, metro: 79 },
  { mes: "Mai", oeste: 84, norte: 73, centro: 82, metro: 81 },
  { mes: "Jun", oeste: 85, norte: 74, centro: 83, metro: 82 },
  { mes: "Jul", oeste: 86, norte: 74, centro: 84, metro: 83 },
  { mes: "Ago", oeste: 87, norte: 75, centro: 85, metro: 84 },
];

// =================== HELPERS ===================

const indicadores = [
  { key: "score",     label: "Score Territorial",     short: "Score" },
  { key: "expansao",  label: "Índice de Expansão",    short: "Expansão" },
  { key: "saturacao", label: "Índice de Saturação",   short: "Saturação" },
  { key: "absorcao",  label: "Índice de Absorção",    short: "Absorção" },
  { key: "pressao",   label: "Pressão Institucional", short: "Pressão" },
  { key: "liquidez",  label: "Índice de Liquidez",    short: "Liquidez" },
  { key: "narrativa", label: "Narrativa Dominante",   short: "Narrativa" },
] as const;

function heatColor(v: number) {
  // gradient verde → âmbar → vermelho (alto = quente)
  if (v >= 85) return "bg-[oklch(0.65_0.18_25)] text-white";
  if (v >= 75) return "bg-[oklch(0.72_0.16_45)] text-black";
  if (v >= 65) return "bg-[oklch(0.78_0.14_80)] text-black";
  if (v >= 55) return "bg-[oklch(0.72_0.12_140)] text-black";
  return "bg-[oklch(0.55_0.09_200)] text-white";
}

function Delta({ v }: { v: number }) {
  if (v > 0)
    return (
      <span className="inline-flex items-center gap-1 text-success font-mono text-xs">
        <ArrowUpRight className="h-3 w-3" /> +{v}
      </span>
    );
  if (v < 0)
    return (
      <span className="inline-flex items-center gap-1 text-destructive font-mono text-xs">
        <ArrowDownRight className="h-3 w-3" /> {v}
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 text-muted-foreground font-mono text-xs">
      <Minus className="h-3 w-3" /> 0
    </span>
  );
}

// =================== PAGE ===================

function TerritoriosPage() {
  const [zona, setZona] = useState<string>("todas");
  const [busca, setBusca] = useState("");
  const [metrica, setMetrica] = useState<(typeof indicadores)[number]["key"]>("score");
  const [comparar, setComparar] = useState<string[]>(["Porto Maravilha", "Niterói", "Campo Grande"]);
  const [importOpen, setImportOpen] = useState(false);

  const filtrados = useMemo(() => {
    return territorios
      .filter((t) => (zona === "todas" ? true : t.zona === zona))
      .filter((t) => t.nome.toLowerCase().includes(busca.toLowerCase()))
      .sort((a, b) => (b[metrica] as number) - (a[metrica] as number));
  }, [zona, busca, metrica]);

  const kpis = useMemo(() => {
    const arr = territorios;
    const avg = (k: keyof Territorio) =>
      Math.round((arr.reduce((s, t) => s + (t[k] as number), 0) / arr.length) * 10) / 10;
    return {
      monitoradas: arr.length,
      scoreMedio: avg("score"),
      expansao: avg("expansao"),
      pressao: avg("pressao"),
      liquidez: avg("liquidez"),
    };
  }, []);

  const radarData = useMemo(() => {
    return indicadores
      .filter((i) => i.key !== "score")
      .map((i) => {
        const row: Record<string, string | number> = { eixo: i.short };
        comparar.forEach((nome) => {
          const t = territorios.find((x) => x.nome === nome);
          row[nome] = t ? (t[i.key] as number) : 0;
        });
        return row;
      });
  }, [comparar]);

  const toggleComparar = (nome: string) => {
    setComparar((prev) =>
      prev.includes(nome)
        ? prev.filter((n) => n !== nome)
        : prev.length >= 4
          ? [...prev.slice(1), nome]
          : [...prev, nome],
    );
  };

  const radarColors = ["oklch(0.78 0.115 85)", "oklch(0.65 0.15 215)", "oklch(0.72 0.16 25)", "oklch(0.7 0.14 140)"];

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      <PageHeader
        title="Inteligência territorial"
        subtitle="Ranking, score multifatorial e leitura urbana das regiões monitoradas no Rio de Janeiro."
        actions={
          <Button size="sm" variant="outline" className="gap-1.5 border-border/60"
            onClick={() => setImportOpen(true)}>
            <Upload className="h-4 w-4" /> Importar bairros
          </Button>
        }
      />
      <DataImportModal
        open={importOpen}
        onClose={() => setImportOpen(false)}
        target="bairros"
        onImport={() => { setImportOpen(false); }}
      />

      {/* ============ KPIs ============ */}
      <h2 className="sr-only">Indicadores territoriais</h2>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { l: "Territórios", v: kpis.monitoradas, s: "monitorados" },
          { l: "Score médio", v: kpis.scoreMedio, s: "+3,1 vs período anterior", trend: true },
          { l: "Expansão média", v: kpis.expansao, s: "frentes ativas" },
          { l: "Pressão instit.", v: kpis.pressao, s: "intervenção pública" },
          { l: "Liquidez", v: kpis.liquidez, s: "absorção comercial" },
        ].map((k) => (
          <Card key={k.l} className="p-4 glass border-border/60">
            <div className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">{k.l}</div>
            <div className="mt-1.5 text-2xl font-semibold font-mono">{k.v}</div>
            <div className="mt-1 text-[11px] text-muted-foreground flex items-center gap-1">
              {k.trend && <TrendingUp className="h-3 w-3 text-success" />} {k.s}
            </div>
          </Card>
        ))}
      </div>

      {/* ============ FILTROS ============ */}
      <Card className="mt-5 p-3 glass border-border/60 flex flex-col md:flex-row md:items-center gap-3">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Filter className="h-3.5 w-3.5" /> Filtros
        </div>
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar bairro..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-8 h-9 bg-muted/40"
          />
        </div>
        <Select value={zona} onValueChange={setZona}>
          <SelectTrigger className="w-[160px] h-9"><SelectValue placeholder="Zona" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas as zonas</SelectItem>
            <SelectItem value="Oeste">Zona Oeste</SelectItem>
            <SelectItem value="Norte">Zona Norte</SelectItem>
            <SelectItem value="Centro">Centro</SelectItem>
            <SelectItem value="Metro">Metropolitana</SelectItem>
          </SelectContent>
        </Select>
        <Select value={metrica} onValueChange={(v) => setMetrica(v as typeof metrica)}>
          <SelectTrigger className="w-[220px] h-9"><SelectValue placeholder="Ordenar por" /></SelectTrigger>
          <SelectContent>
            {indicadores.map((i) => (
              <SelectItem key={i.key} value={i.key}>{i.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Badge variant="outline" className="border-gold/40 text-gold ml-auto hidden md:inline-flex">
          <Sparkles className="h-3 w-3 mr-1" /> {filtrados.length} territórios
        </Badge>
      </Card>

      {/* ============ TABELA INTELIGENTE ============ */}
      <h2 className="sr-only">Ranking territorial</h2>
      <Card className="mt-5 glass border-border/60 overflow-hidden">
        <div className="px-5 py-3 border-b border-border/60 flex items-center justify-between">
          <h3 className="font-semibold text-sm">Ranking territorial</h3>
          <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Clique em um bairro para comparar
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border/60 bg-muted/20">
                <th className="px-4 py-2.5 w-10">#</th>
                <th className="px-4 py-2.5">Bairro</th>
                <th className="px-4 py-2.5">Zona</th>
                <th className="px-4 py-2.5 text-right">Score</th>
                <th className="px-4 py-2.5 text-right">Δ</th>
                <th className="px-4 py-2.5 text-right">Expansão</th>
                <th className="px-4 py-2.5 text-right">Saturação</th>
                <th className="px-4 py-2.5 text-right">Absorção</th>
                <th className="px-4 py-2.5 text-right">Pressão</th>
                <th className="px-4 py-2.5 text-right">Liquidez</th>
                <th className="px-4 py-2.5">Narrativa</th>
                <th className="px-4 py-2.5 text-right">Ticket</th>
              </tr>
            </thead>
            <tbody>
              {filtrados.map((t, i) => {
                const ativo = comparar.includes(t.nome);
                return (
                  <tr
                    key={t.nome}
                    onClick={() => toggleComparar(t.nome)}
                    className={`border-b border-border/40 cursor-pointer transition-colors ${
                      ativo ? "bg-gold/5" : "hover:bg-muted/30"
                    }`}
                  >
                    <td className="px-4 py-2.5 font-mono text-xs text-muted-foreground">{String(i + 1).padStart(2, "0")}</td>
                    <td className="px-4 py-2.5 font-medium">
                      <div className="flex items-center gap-2">
                        {ativo && <span className="h-1.5 w-1.5 rounded-full bg-gold" />}
                        {t.nome}
                      </div>
                    </td>
                    <td className="px-4 py-2.5 text-xs text-muted-foreground">{t.zona}</td>
                    <td className="px-4 py-2.5 text-right font-mono text-gold font-semibold">{t.score}</td>
                    <td className="px-4 py-2.5 text-right"><Delta v={t.variacao} /></td>
                    <td className="px-4 py-2.5 text-right font-mono text-xs">{t.expansao}</td>
                    <td className="px-4 py-2.5 text-right font-mono text-xs">{t.saturacao}</td>
                    <td className="px-4 py-2.5 text-right font-mono text-xs">{t.absorcao}</td>
                    <td className="px-4 py-2.5 text-right font-mono text-xs">{t.pressao}</td>
                    <td className="px-4 py-2.5 text-right font-mono text-xs">{t.liquidez}</td>
                    <td className="px-4 py-2.5">
                      <Badge variant="outline" className="text-[10px] border-border/60 text-muted-foreground">
                        {t.narrativaLabel}
                      </Badge>
                    </td>
                    <td className="px-4 py-2.5 text-right font-mono text-xs">R$ {t.ticket}k</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* ============ HEATMAP ============ */}
      <h2 className="sr-only">Heatmap multifatorial</h2>
      <Card className="mt-5 glass border-border/60 overflow-hidden">
        <div className="px-5 py-3 border-b border-border/60 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-gold" />
            <h3 className="font-semibold text-sm">Heatmap multifatorial</h3>
          </div>
          <div className="flex items-center gap-3 text-[10px] uppercase tracking-wider text-muted-foreground">
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-[oklch(0.55_0.09_200)]" /> Frio</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-[oklch(0.78_0.14_80)]" /> Médio</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-[oklch(0.65_0.18_25)]" /> Quente</span>
          </div>
        </div>
        <div className="overflow-x-auto p-4">
          <div className="min-w-[820px]">
            <div className="grid grid-cols-[160px_repeat(6,1fr)] gap-1.5 text-[11px]">
              <div />
              {indicadores.filter((i) => i.key !== "score").map((i) => (
                <div key={i.key} className="text-center text-[10px] uppercase tracking-wider text-muted-foreground py-1">
                  {i.short}
                </div>
              ))}
              {filtrados.map((t) => (
                <Fragment key={t.nome}>
                  <div className="flex items-center text-xs font-medium pr-2 truncate">
                    {t.nome}
                  </div>
                  {(["expansao","saturacao","absorcao","pressao","liquidez","narrativa"] as const).map((k) => (
                    <div
                      key={t.nome + k}
                      className={`h-9 rounded-md flex items-center justify-center font-mono text-xs font-semibold ${heatColor(t[k])}`}
                    >
                      {t[k]}
                    </div>
                  ))}
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* ============ COMPARATIVO + EVOLUÇÃO ============ */}
      <h2 className="sr-only">Comparativo e evolução temporal</h2>
      <div className="mt-5 grid grid-cols-1 lg:grid-cols-5 gap-5">
        <Card className="lg:col-span-3 glass border-border/60 overflow-hidden">
          <div className="px-5 py-3 border-b border-border/60 flex items-center justify-between">
            <h3 className="font-semibold text-sm">Evolução temporal · score médio por zona</h3>
            <Tabs defaultValue="8m">
              <TabsList className="h-7">
                <TabsTrigger value="3m" className="text-xs h-6">3M</TabsTrigger>
                <TabsTrigger value="8m" className="text-xs h-6">8M</TabsTrigger>
                <TabsTrigger value="12m" className="text-xs h-6">12M</TabsTrigger>
              </TabsList>
              <TabsContent value="8m" />
            </Tabs>
          </div>
          <div className="p-4 h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={evolucaoTemporal}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.02 240 / 0.3)" />
                <XAxis dataKey="mes" stroke="oklch(0.65 0.02 240)" fontSize={11} />
                <YAxis stroke="oklch(0.65 0.02 240)" fontSize={11} domain={[60, 95]} />
                <Tooltip
                  contentStyle={{
                    background: "oklch(0.18 0.02 240)",
                    border: "1px solid oklch(0.3 0.02 240)",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line type="monotone" dataKey="oeste"  name="Oeste"  stroke="oklch(0.78 0.115 85)"  strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="norte"  name="Norte"  stroke="oklch(0.65 0.15 215)"  strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="centro" name="Centro" stroke="oklch(0.72 0.16 25)"   strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="metro"  name="Metro"  stroke="oklch(0.7 0.14 140)"   strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="lg:col-span-2 glass border-border/60 overflow-hidden">
          <div className="px-5 py-3 border-b border-border/60 flex items-center justify-between">
            <h3 className="font-semibold text-sm">Comparativo multidimensional</h3>
            <Button
              size="sm"
              variant="ghost"
              className="h-7 text-xs"
              onClick={() => setComparar([])}
              disabled={comparar.length === 0}
            >
              Limpar
            </Button>
          </div>
          <div className="px-4 pt-3 flex flex-wrap gap-1.5">
            {comparar.length === 0 && (
              <div className="text-xs text-muted-foreground py-2">
                Selecione bairros na tabela acima para comparar (até 4).
              </div>
            )}
            {comparar.map((n, i) => (
              <Badge
                key={n}
                onClick={() => toggleComparar(n)}
                className="cursor-pointer text-[10px] gap-1"
                style={{
                  background: `${radarColors[i]} / 0.15`,
                  color: radarColors[i],
                  borderColor: radarColors[i],
                }}
                variant="outline"
              >
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: radarColors[i] }} />
                {n} ×
              </Badge>
            ))}
          </div>
          <div className="p-4 h-[280px]">
            {comparar.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarData} outerRadius="78%">
                  <PolarGrid stroke="oklch(0.3 0.02 240 / 0.4)" />
                  <PolarAngleAxis dataKey="eixo" tick={{ fill: "oklch(0.7 0.02 240)", fontSize: 10 }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: "oklch(0.5 0.02 240)", fontSize: 9 }} />
                  {comparar.map((n, i) => (
                    <Radar
                      key={n}
                      name={n}
                      dataKey={n}
                      stroke={radarColors[i]}
                      fill={radarColors[i]}
                      fillOpacity={0.18}
                      strokeWidth={2}
                    />
                  ))}
                  <Tooltip
                    contentStyle={{
                      background: "oklch(0.18 0.02 240)",
                      border: "1px solid oklch(0.3 0.02 240)",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                </RadarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
                Sem seleção
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
