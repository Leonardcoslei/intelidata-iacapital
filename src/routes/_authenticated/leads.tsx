import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState, useRef, Fragment } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader,
  DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Search, Flame, Snowflake, ThermometerSun, TrendingUp, Users, Target,
  Phone, Mail, MessageCircle, MapPin, Briefcase, Wallet, Home, Building2,
  AlertTriangle, Sparkles, ArrowUpRight, Clock, ChevronRight, Upload,
  FileSpreadsheet, Download, CheckCircle2,
} from "lucide-react";
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  ResponsiveContainer, XAxis, YAxis, Tooltip, CartesianGrid, Legend,
} from "recharts";

export const Route = createFileRoute("/_authenticated/leads")({
  component: LeadsPage,
});

// ---------------- Mock data ----------------
type Temperatura = "quente" | "morno" | "frio";
type Perfil = "investidor" | "familiar" | "primeiro_imovel";
type Stage = "Novo" | "Qualificado" | "Visita" | "Proposta" | "Negociação" | "Fechado";

type Lead = {
  id: string;
  nome: string;
  origem: string;
  bairro: string;
  emp: string;
  tipologia: string;
  renda: number; // R$ mil/mês
  profissao: string;
  score: number;
  temp: Temperatura;
  perfil: Perfil;
  stage: Stage;
  ultima: string;
  aderencia: number; // % aderência territorial
};

const leads: Lead[] = [
  { id: "L-1042", nome: "Ana Pereira", origem: "Instagram", bairro: "Campo Grande", emp: "Vista Park", tipologia: "2Q + Suíte", renda: 7.8, profissao: "Servidora Pública", score: 92, temp: "quente", perfil: "familiar", stage: "Visita", ultima: "há 2h", aderencia: 94 },
  { id: "L-1041", nome: "Carlos Souza", origem: "Stand", bairro: "Madureira", emp: "Estação Madureira", tipologia: "Studio", renda: 12.4, profissao: "Engenheiro", score: 89, temp: "quente", perfil: "investidor", stage: "Proposta", ultima: "há 5h", aderencia: 88 },
  { id: "L-1039", nome: "Beatriz Lima", origem: "Indicação", bairro: "Bangu", emp: "Bangu Plaza", tipologia: "2Q", renda: 5.2, profissao: "Professora", score: 84, temp: "quente", perfil: "primeiro_imovel", stage: "Qualificado", ultima: "ontem", aderencia: 91 },
  { id: "L-1037", nome: "Diego Martins", origem: "Google Ads", bairro: "Realengo", emp: "Realengo Life", tipologia: "3Q", renda: 9.6, profissao: "Bancário", score: 78, temp: "morno", perfil: "familiar", stage: "Visita", ultima: "ontem", aderencia: 82 },
  { id: "L-1036", nome: "Fernanda Rocha", origem: "Site", bairro: "Santa Cruz", emp: "Santa Cruz Garden", tipologia: "2Q", renda: 4.1, profissao: "Autônoma", score: 71, temp: "morno", perfil: "primeiro_imovel", stage: "Novo", ultima: "ontem", aderencia: 76 },
  { id: "L-1034", nome: "Gabriel Alves", origem: "WhatsApp", bairro: "Penha", emp: "Penha Reserva", tipologia: "2Q + Suíte", renda: 8.9, profissao: "Comercial", score: 67, temp: "morno", perfil: "familiar", stage: "Qualificado", ultima: "2 dias", aderencia: 73 },
  { id: "L-1031", nome: "Helena Dias", origem: "Instagram", bairro: "Jacarepaguá", emp: "Vista Park", tipologia: "Studio", renda: 14.7, profissao: "Médica", score: 86, temp: "quente", perfil: "investidor", stage: "Negociação", ultima: "há 1h", aderencia: 90 },
  { id: "L-1028", nome: "Igor Nascimento", origem: "Facebook", bairro: "Irajá", emp: "Irajá Living", tipologia: "1Q", renda: 3.6, profissao: "Estudante", score: 48, temp: "frio", perfil: "primeiro_imovel", stage: "Novo", ultima: "5 dias", aderencia: 58 },
  { id: "L-1025", nome: "Julia Mendes", origem: "Indicação", bairro: "Recreio", emp: "Recreio Boulevard", tipologia: "3Q + Suíte", renda: 22.3, profissao: "Advogada", score: 95, temp: "quente", perfil: "familiar", stage: "Proposta", ultima: "há 3h", aderencia: 96 },
  { id: "L-1022", nome: "Lucas Ribeiro", origem: "Site", bairro: "Piedade", emp: "Piedade Park", tipologia: "2Q", renda: 6.4, profissao: "TI", score: 73, temp: "morno", perfil: "primeiro_imovel", stage: "Qualificado", ultima: "ontem", aderencia: 80 },
  { id: "L-1018", nome: "Marina Costa", origem: "Google Ads", bairro: "São Cristóvão", emp: "SC Urban", tipologia: "Studio", renda: 11.2, profissao: "Designer", score: 81, temp: "quente", perfil: "investidor", stage: "Visita", ultima: "ontem", aderencia: 87 },
  { id: "L-1014", nome: "Otávio Pinto", origem: "Stand", bairro: "Bangu", emp: "Bangu Plaza", tipologia: "2Q", renda: 4.8, profissao: "Vendedor", score: 52, temp: "frio", perfil: "primeiro_imovel", stage: "Novo", ultima: "6 dias", aderencia: 61 },
];

const tempMeta: Record<Temperatura, { label: string; icon: typeof Flame; cls: string; dot: string }> = {
  quente: { label: "Quente", icon: Flame, cls: "text-rose-400 bg-rose-500/10 border-rose-500/30", dot: "bg-rose-400" },
  morno: { label: "Morno", icon: ThermometerSun, cls: "text-gold bg-gold/10 border-gold/30", dot: "bg-gold" },
  frio: { label: "Frio", icon: Snowflake, cls: "text-sky-300 bg-sky-500/10 border-sky-500/30", dot: "bg-sky-300" },
};

const perfilMeta: Record<Perfil, { label: string; icon: typeof Home; cls: string }> = {
  investidor: { label: "Investidor", icon: TrendingUp, cls: "text-emerald-300 border-emerald-500/30 bg-emerald-500/10" },
  familiar: { label: "Familiar", icon: Home, cls: "text-primary border-primary/30 bg-primary/10" },
  primeiro_imovel: { label: "Primeiro imóvel", icon: Sparkles, cls: "text-violet-300 border-violet-500/30 bg-violet-500/10" },
};

const stageMeta: Record<Stage, string> = {
  Novo: "text-muted-foreground border-muted-foreground/30",
  Qualificado: "text-primary border-primary/40",
  Visita: "text-gold border-gold/40",
  Proposta: "text-emerald-300 border-emerald-400/40",
  "Negociação": "text-amber-300 border-amber-400/40",
  Fechado: "text-success border-success/40",
};

const stages: Stage[] = ["Novo", "Qualificado", "Visita", "Proposta", "Negociação", "Fechado"];

const evolucao = [
  { mes: "Jan", quente: 180, morno: 320, frio: 410 },
  { mes: "Fev", quente: 210, morno: 360, frio: 430 },
  { mes: "Mar", quente: 245, morno: 380, frio: 420 },
  { mes: "Abr", quente: 290, morno: 410, frio: 395 },
  { mes: "Mai", quente: 335, morno: 445, frio: 380 },
  { mes: "Jun", quente: 388, morno: 472, frio: 360 },
];

const tipologiaInteresse = [
  { tipo: "Studio", leads: 412 },
  { tipo: "1Q", leads: 318 },
  { tipo: "2Q", leads: 982 },
  { tipo: "2Q+Suíte", leads: 745 },
  { tipo: "3Q", leads: 521 },
  { tipo: "3Q+Suíte", leads: 286 },
];

const perfilDist = [
  { name: "Familiar", value: 48, color: "oklch(0.55 0.10 215)" },
  { name: "Primeiro imóvel", value: 31, color: "oklch(0.62 0.18 295)" },
  { name: "Investidor", value: 21, color: "oklch(0.72 0.16 155)" },
];

const aderenciaTerritorial = [
  { bairro: "Recreio", adesao: 94 },
  { bairro: "Campo Grande", adesao: 89 },
  { bairro: "Madureira", adesao: 86 },
  { bairro: "Bangu", adesao: 82 },
  { bairro: "Penha", adesao: 78 },
  { bairro: "Santa Cruz", adesao: 71 },
  { bairro: "Irajá", adesao: 64 },
];

const timeline = [
  { t: "há 12 min", titulo: "Julia Mendes avançou para Proposta", desc: "Recreio Boulevard · 3Q + Suíte · R$ 920k", tag: "Conversão", color: "text-emerald-300" },
  { t: "há 1h", titulo: "Helena Dias agendou nova visita", desc: "Vista Park · Studio investidor · ticket alto", tag: "Visita", color: "text-gold" },
  { t: "há 3h", titulo: "12 novos leads quentes em Madureira", desc: "Pico após campanha Google Ads · CPL R$ 18,40", tag: "Aquisição", color: "text-primary" },
  { t: "há 6h", titulo: "Alerta: queda de aderência em Irajá", desc: "Score territorial caiu 9 pts vs semana anterior", tag: "Risco", color: "text-rose-300" },
  { t: "ontem", titulo: "Cluster 'Primeiro imóvel' cresceu 14%", desc: "Concentração em Bangu, Realengo e Santa Cruz", tag: "Comportamento", color: "text-violet-300" },
];

const alertas = [
  { sev: "alta", titulo: "8 leads quentes sem retorno > 24h", desc: "Risco de esfriamento. Acionar SDR para Recreio e Campo Grande.", icon: AlertTriangle },
  { sev: "media", titulo: "Aderência baixa em Santa Cruz", desc: "Perfil de renda dos leads abaixo da tipologia ofertada.", icon: Target },
  { sev: "info", titulo: "Pico de investidores no Centro", desc: "+38% em 7 dias · Studios SC Urban e Porto Maravilha.", icon: TrendingUp },
];

// ---------------- Helpers ----------------
const fmt = (n: number) => n.toLocaleString("pt-BR");
const scoreColor = (s: number) =>
  s >= 85 ? "text-emerald-300" : s >= 70 ? "text-gold" : s >= 55 ? "text-primary" : "text-sky-300";

// ---------------- Page ----------------
function LeadsPage() {
  const [query, setQuery] = useState("");
  const [filterTemp, setFilterTemp] = useState<Temperatura | "all">("all");
  const [filterPerfil, setFilterPerfil] = useState<Perfil | "all">("all");
  const [selected, setSelected] = useState<Lead>(leads[8]);

  const filtered = useMemo(() => {
    return leads.filter((l) => {
      if (filterTemp !== "all" && l.temp !== filterTemp) return false;
      if (filterPerfil !== "all" && l.perfil !== filterPerfil) return false;
      if (query && !`${l.nome} ${l.bairro} ${l.emp}`.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [query, filterTemp, filterPerfil]);

  const kpis = [
    { l: "Leads ativos", v: "4.218", d: "+12,4%", icon: Users, color: "text-primary" },
    { l: "Quentes", v: "388", d: "+18%", icon: Flame, color: "text-rose-400" },
    { l: "Aderência média", v: "82%", d: "+3 pts", icon: Target, color: "text-gold" },
    { l: "Conversão proposta", v: "11,4%", d: "+1,2 pp", icon: TrendingUp, color: "text-emerald-300" },
  ];

  const pipeline = stages.map((s) => ({
    stage: s,
    total: leads.filter((l) => l.stage === s).length + (s === "Novo" ? 142 : s === "Qualificado" ? 96 : s === "Visita" ? 64 : s === "Proposta" ? 38 : s === "Negociação" ? 22 : 11),
  }));
  const pipelineMax = Math.max(...pipeline.map((p) => p.total));

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto space-y-6">
      <PageHeader
        title="Leads Inteligentes"
        subtitle="Comportamento, scoring automático e aderência territorial."
        actions={
          <Button className="bg-primary hover:bg-primary/90 gap-2">
            <Sparkles className="h-4 w-4" /> Recalcular score
          </Button>
        }
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((k) => (
          <Card key={k.l} className="glass border-border/60 p-5 relative overflow-hidden">
            <div className="absolute -right-6 -top-6 h-20 w-20 rounded-full bg-primary/5 blur-2xl" />
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">{k.l}</p>
                <p className="text-2xl font-semibold mt-2">{k.v}</p>
                <p className="text-[11px] text-emerald-300 mt-1 flex items-center gap-1">
                  <ArrowUpRight className="h-3 w-3" /> {k.d} vs mês anterior
                </p>
              </div>
              <div className={`h-9 w-9 rounded-lg bg-muted/40 grid place-items-center ${k.color}`}>
                <k.icon className="h-4 w-4" />
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* Pipeline */}
      <Card className="glass border-border/60 p-6">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="font-semibold">Pipeline comercial</h3>
            <p className="text-xs text-muted-foreground">Distribuição por etapa · ciclo médio 18 dias</p>
          </div>
          <Badge variant="outline" className="border-gold/40 text-gold">VSO projetada · 14,2%</Badge>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {pipeline.map((p, i) => (
            <div key={p.stage} className="relative">
              <div className="rounded-lg border border-border/60 bg-muted/20 p-4 hover:bg-muted/40 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{i + 1}</span>
                  <ChevronRight className="h-3 w-3 text-muted-foreground" />
                </div>
                <p className="text-sm font-medium mt-2">{p.stage}</p>
                <p className="text-2xl font-semibold mt-1">{fmt(p.total)}</p>
                <div className="h-1 mt-3 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-primary to-gold"
                    style={{ width: `${(p.total / pipelineMax) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="glass border-border/60 p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-sm">Evolução por temperatura</h3>
              <p className="text-xs text-muted-foreground">Volume mensal de leads classificados pelo motor</p>
            </div>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={evolucao}>
                <defs>
                  <linearGradient id="q" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.65 0.22 25)" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="oklch(0.65 0.22 25)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="m" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.78 0.115 85)" stopOpacity={0.5} />
                    <stop offset="100%" stopColor="oklch(0.78 0.115 85)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="f" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="oklch(0.75 0.10 230)" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="oklch(0.75 0.10 230)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.02 240)" vertical={false} />
                <XAxis dataKey="mes" stroke="oklch(0.65 0.02 240)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="oklch(0.65 0.02 240)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "oklch(0.16 0.02 240)", border: "1px solid oklch(0.28 0.02 240)", borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Area type="monotone" dataKey="quente" stroke="oklch(0.7 0.22 25)" fill="url(#q)" strokeWidth={2} />
                <Area type="monotone" dataKey="morno" stroke="oklch(0.78 0.115 85)" fill="url(#m)" strokeWidth={2} />
                <Area type="monotone" dataKey="frio" stroke="oklch(0.75 0.10 230)" fill="url(#f)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="glass border-border/60 p-5">
          <h3 className="font-semibold text-sm">Perfil dominante</h3>
          <p className="text-xs text-muted-foreground">Distribuição comportamental</p>
          <div className="h-48 mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={perfilDist} dataKey="value" innerRadius={50} outerRadius={75} paddingAngle={3}>
                  {perfilDist.map((p) => <Cell key={p.name} fill={p.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "oklch(0.16 0.02 240)", border: "1px solid oklch(0.28 0.02 240)", borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-2 mt-2">
            {perfilDist.map((p) => (
              <div key={p.name} className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
                  {p.name}
                </span>
                <span className="font-medium">{p.value}%</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="glass border-border/60 p-5">
          <h3 className="font-semibold text-sm">Interesse por tipologia</h3>
          <p className="text-xs text-muted-foreground">Demanda agregada nos últimos 30 dias</p>
          <div className="h-56 mt-3">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={tipologiaInteresse}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.3 0.02 240)" vertical={false} />
                <XAxis dataKey="tipo" stroke="oklch(0.65 0.02 240)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="oklch(0.65 0.02 240)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "oklch(0.16 0.02 240)", border: "1px solid oklch(0.28 0.02 240)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="leads" radius={[6, 6, 0, 0]} fill="oklch(0.55 0.10 215)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="glass border-border/60 p-5">
          <h3 className="font-semibold text-sm">Aderência territorial</h3>
          <p className="text-xs text-muted-foreground">Match entre perfil do lead e oferta do bairro</p>
          <div className="space-y-3 mt-4">
            {aderenciaTerritorial.map((a) => (
              <div key={a.bairro}>
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="flex items-center gap-1.5"><MapPin className="h-3 w-3 text-muted-foreground" />{a.bairro}</span>
                  <span className={`font-semibold ${scoreColor(a.adesao)}`}>{a.adesao}%</span>
                </div>
                <Progress value={a.adesao} className="h-1.5" />
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Filters + List + Detail */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        <Card className="glass border-border/60 p-5 xl:col-span-2">
          <div className="flex flex-col lg:flex-row lg:items-center gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Buscar lead, bairro ou empreendimento..."
                className="pl-8 h-9 bg-muted/40 border-border"
              />
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(["all", "quente", "morno", "frio"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setFilterTemp(t)}
                  className={`px-3 h-8 rounded-md text-xs border transition-colors ${
                    filterTemp === t ? "bg-primary/15 border-primary/50 text-primary" : "border-border/60 text-muted-foreground hover:bg-muted/40"
                  }`}
                >
                  {t === "all" ? "Todas" : tempMeta[t].label}
                </button>
              ))}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {(["all", "investidor", "familiar", "primeiro_imovel"] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setFilterPerfil(p)}
                  className={`px-3 h-8 rounded-md text-xs border transition-colors ${
                    filterPerfil === p ? "bg-gold/15 border-gold/50 text-gold" : "border-border/60 text-muted-foreground hover:bg-muted/40"
                  }`}
                >
                  {p === "all" ? "Todos perfis" : perfilMeta[p].label}
                </button>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-border/60">
            <div className="grid grid-cols-[1.4fr_1fr_0.8fr_0.7fr_0.8fr_0.6fr] gap-2 px-3 py-2 text-[10px] uppercase tracking-wider text-muted-foreground bg-muted/30">
              <div>Lead</div><div>Empreendimento</div><div>Perfil</div><div>Temp.</div><div>Estágio</div><div className="text-right">Score</div>
            </div>
            <div className="divide-y divide-border/40 max-h-[420px] overflow-y-auto">
              {filtered.map((l) => {
                const T = tempMeta[l.temp].icon;
                const P = perfilMeta[l.perfil].icon;
                const active = selected.id === l.id;
                return (
                  <button
                    key={l.id}
                    onClick={() => setSelected(l)}
                    className={`w-full grid grid-cols-[1.4fr_1fr_0.8fr_0.7fr_0.8fr_0.6fr] gap-2 px-3 py-3 text-xs items-center text-left transition-colors ${
                      active ? "bg-primary/10" : "hover:bg-muted/30"
                    }`}
                  >
                    <div className="min-w-0">
                      <div className="font-medium truncate">{l.nome}</div>
                      <div className="text-[10px] text-muted-foreground truncate">{l.origem} · {l.bairro}</div>
                    </div>
                    <div className="min-w-0 truncate text-muted-foreground">{l.emp}</div>
                    <div className="min-w-0">
                      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-[10px] ${perfilMeta[l.perfil].cls}`}>
                        <P className="h-3 w-3" />{perfilMeta[l.perfil].label}
                      </span>
                    </div>
                    <div>
                      <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-[10px] ${tempMeta[l.temp].cls}`}>
                        <T className="h-3 w-3" />{tempMeta[l.temp].label}
                      </span>
                    </div>
                    <div>
                      <Badge variant="outline" className={`text-[10px] ${stageMeta[l.stage]}`}>{l.stage}</Badge>
                    </div>
                    <div className={`text-right font-semibold ${scoreColor(l.score)}`}>{l.score}</div>
                  </button>
                );
              })}
              {filtered.length === 0 && (
                <div className="p-8 text-center text-xs text-muted-foreground">Nenhum lead encontrado.</div>
              )}
            </div>
          </div>
        </Card>

        {/* Detail */}
        <Card className="glass border-border/60 p-5">
          <div className="flex items-start justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{selected.id}</div>
              <h3 className="font-semibold text-lg mt-0.5">{selected.nome}</h3>
              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                <Briefcase className="h-3 w-3" />{selected.profissao}
              </p>
            </div>
            <div className="text-right">
              <div className={`text-3xl font-bold ${scoreColor(selected.score)}`}>{selected.score}</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Score</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4">
            <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded border text-xs ${tempMeta[selected.temp].cls}`}>
              <Flame className="h-3 w-3" />Lead {tempMeta[selected.temp].label.toLowerCase()}
            </span>
            <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded border text-xs ${perfilMeta[selected.perfil].cls}`}>
              <Home className="h-3 w-3" />{perfilMeta[selected.perfil].label}
            </span>
          </div>

          <div className="mt-5 space-y-3 text-xs">
            <DetailRow icon={Wallet} label="Renda estimada" value={`R$ ${selected.renda.toFixed(1)}k / mês`} />
            <DetailRow icon={Home} label="Interesse tipologia" value={selected.tipologia} />
            <DetailRow icon={Building2} label="Empreendimento alvo" value={selected.emp} />
            <DetailRow icon={MapPin} label="Interesse territorial" value={selected.bairro} />
            <DetailRow icon={Clock} label="Última interação" value={selected.ultima} />
          </div>

          <div className="mt-5">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="text-muted-foreground">Aderência territorial</span>
              <span className={`font-semibold ${scoreColor(selected.aderencia)}`}>{selected.aderencia}%</span>
            </div>
            <Progress value={selected.aderencia} className="h-1.5" />
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2">
            <Button size="sm" variant="outline" className="gap-1.5 h-8 text-xs"><Phone className="h-3 w-3" />Ligar</Button>
            <Button size="sm" variant="outline" className="gap-1.5 h-8 text-xs"><MessageCircle className="h-3 w-3" />WhatsApp</Button>
            <Button size="sm" variant="outline" className="gap-1.5 h-8 text-xs"><Mail className="h-3 w-3" />Email</Button>
          </div>

          <div className="mt-5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Histórico</h4>
            <ol className="relative border-l border-border/60 ml-2 space-y-3">
              {[
                { t: selected.ultima, d: `Avançou para ${selected.stage}` },
                { t: "2 dias", d: "Visitou Vista Park" },
                { t: "4 dias", d: "Baixou material via WhatsApp" },
                { t: "1 semana", d: `Cadastro via ${selected.origem}` },
              ].map((h, i) => (
                <li key={i} className="ml-3">
                  <span className="absolute -left-1.5 h-3 w-3 rounded-full bg-primary border-2 border-background" />
                  <p className="text-xs font-medium">{h.d}</p>
                  <p className="text-[10px] text-muted-foreground">{h.t}</p>
                </li>
              ))}
            </ol>
          </div>
        </Card>
      </div>

      {/* Alertas + Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="glass border-border/60 p-5">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-gold" /> Alertas automáticos
          </h3>
          <div className="mt-4 space-y-3">
            {alertas.map((a) => (
              <div key={a.titulo} className="p-3 rounded-lg border border-border/60 bg-muted/20">
                <div className="flex items-start gap-2">
                  <div className={`h-7 w-7 rounded-md grid place-items-center shrink-0 ${
                    a.sev === "alta" ? "bg-rose-500/15 text-rose-300" : a.sev === "media" ? "bg-gold/15 text-gold" : "bg-primary/15 text-primary"
                  }`}>
                    <a.icon className="h-3.5 w-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-medium">{a.titulo}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{a.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="glass border-border/60 p-5 lg:col-span-2">
          <h3 className="font-semibold text-sm flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" /> Timeline analítica
          </h3>
          <ol className="mt-4 relative border-l border-border/60 ml-2 space-y-4">
            {timeline.map((t, i) => (
              <li key={i} className="ml-4">
                <span className="absolute -left-1.5 h-3 w-3 rounded-full bg-gradient-to-br from-primary to-gold border-2 border-background" />
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-medium">{t.titulo}</p>
                  <Badge variant="outline" className={`text-[10px] ${t.color} border-current/30`}>{t.tag}</Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-1">{t.desc}</p>
                <p className="text-[10px] text-muted-foreground mt-1">{t.t}</p>
              </li>
            ))}
          </ol>
        </Card>
      </div>
    </div>
  );
}

function DetailRow({ icon: Icon, label, value }: { icon: typeof Home; label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-muted-foreground flex items-center gap-1.5"><Icon className="h-3 w-3" />{label}</span>
      <span className="font-medium truncate">{value}</span>
    </div>
  );
}
