import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useMemo } from "react";
import {
  FileBarChart, Download, RefreshCw, Eye, Calendar,
  TrendingUp, Users, Building2, MapPin, BarChart3,
  CheckCircle2, Clock, AlertTriangle, X
} from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar,
  CartesianGrid, XAxis, YAxis, Tooltip, LineChart, Line
} from "recharts";

export const Route = createFileRoute("/_authenticated/relatorios")({
  component: RelatoriosPage,
});

type Periodo = "3M" | "6M" | "12M" | "24M";

const periodoMeses: Record<Periodo, number> = { "3M": 3, "6M": 6, "12M": 12, "24M": 24 };

// Dados base — 24 meses
const dadosBase = [
  { m: "Jun/24", abs: 52, vso: 11.2, leads: 820,  ticket: 268 },
  { m: "Jul/24", abs: 55, vso: 12.1, leads: 890,  ticket: 271 },
  { m: "Ago/24", abs: 58, vso: 12.8, leads: 945,  ticket: 274 },
  { m: "Set/24", abs: 54, vso: 11.5, leads: 870,  ticket: 272 },
  { m: "Out/24", abs: 60, vso: 13.2, leads: 980,  ticket: 278 },
  { m: "Nov/24", abs: 63, vso: 14.1, leads: 1050, ticket: 281 },
  { m: "Dez/24", abs: 61, vso: 13.6, leads: 990,  ticket: 280 },
  { m: "Jan/25", abs: 57, vso: 12.3, leads: 910,  ticket: 276 },
  { m: "Fev/25", abs: 59, vso: 12.9, leads: 940,  ticket: 279 },
  { m: "Mar/25", abs: 65, vso: 14.8, leads: 1120, ticket: 285 },
  { m: "Abr/25", abs: 68, vso: 15.4, leads: 1180, ticket: 288 },
  { m: "Mai/25", abs: 66, vso: 14.9, leads: 1140, ticket: 287 },
  { m: "Jun/25", abs: 70, vso: 16.1, leads: 1250, ticket: 292 },
  { m: "Jul/25", abs: 72, vso: 16.8, leads: 1310, ticket: 295 },
  { m: "Ago/25", abs: 69, vso: 15.7, leads: 1270, ticket: 293 },
  { m: "Set/25", abs: 74, vso: 17.2, leads: 1380, ticket: 298 },
  { m: "Out/25", abs: 77, vso: 18.1, leads: 1450, ticket: 302 },
  { m: "Nov/25", abs: 75, vso: 17.4, leads: 1390, ticket: 300 },
  { m: "Dez/25", abs: 78, vso: 18.6, leads: 1480, ticket: 305 },
  { m: "Jan/26", abs: 73, vso: 17.0, leads: 1350, ticket: 301 },
  { m: "Fev/26", abs: 76, vso: 17.8, leads: 1420, ticket: 304 },
  { m: "Mar/26", abs: 80, vso: 19.1, leads: 1540, ticket: 310 },
  { m: "Abr/26", abs: 82, vso: 19.4, leads: 1580, ticket: 312 },
  { m: "Mai/26", abs: 84, vso: 19.8, leads: 1620, ticket: 315 },
];

const relatoriosCatalogo = [
  {
    id: 1, titulo: "Absorção mensal consolidada", tipo: "Operacional",
    descricao: "Índice de absorção por empreendimento e região, comparativo vs período anterior.",
    icon: TrendingUp, cor: "#1e6fa8", grafico: "area",
  },
  {
    id: 2, titulo: "Diagnóstico territorial — Zona Oeste", tipo: "Estratégico",
    descricao: "Score territorial, saturação de oferta e oportunidades por bairro.",
    icon: MapPin, cor: "#c9a84c", grafico: "bar",
  },
  {
    id: 3, titulo: "Performance de leads", tipo: "Comercial",
    descricao: "Volume, conversão e scoring do pipeline de leads por período.",
    icon: Users, cor: "#22c55e", grafico: "line",
  },
  {
    id: 4, titulo: "Portfólio Cury — VSO e Ticket", tipo: "Portfólio",
    descricao: "Velocidade de vendas e ticket médio por empreendimento Cury.",
    icon: Building2, cor: "#a855f7", grafico: "bar",
  },
  {
    id: 5, titulo: "Análise competitiva — MRV vs Direcional vs Cury", tipo: "Estratégico",
    descricao: "Participação de mercado, absorção e posicionamento de preço por construtora.",
    icon: BarChart3, cor: "#f59e0b", grafico: "area",
  },
];

type StatusGerado = "pendente" | "gerando" | "pronto";

interface RelatorioGerado {
  id: number;
  titulo: string;
  tipo: string;
  periodo: Periodo;
  geradoEm: string;
  status: StatusGerado;
}

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#1a1f2e", border: "1px solid #2a3040", borderRadius: 8, padding: "8px 12px" }}>
      <p style={{ color: "#94a3b8", fontSize: 11, marginBottom: 4 }}>{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.color, fontSize: 12, fontWeight: 600 }}>
          {p.name}: {p.value}{p.name.includes("abs") || p.name.includes("Abs") ? "%" : p.name.includes("leads") || p.name.includes("Leads") ? "" : p.name.includes("ticket") ? "k" : ""}
        </p>
      ))}
    </div>
  );
};

function MiniGrafico({ tipo, dados }: { tipo: string; dados: typeof dadosBase }) {
  const h = 80;
  if (tipo === "area") return (
    <ResponsiveContainer width="100%" height={h}>
      <AreaChart data={dados} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
        <defs>
          <linearGradient id="gArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#1e6fa8" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#1e6fa8" stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area type="monotone" dataKey="abs" stroke="#1e6fa8" strokeWidth={2} fill="url(#gArea)" dot={false} />
      </AreaChart>
    </ResponsiveContainer>
  );
  if (tipo === "bar") return (
    <ResponsiveContainer width="100%" height={h}>
      <BarChart data={dados} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
        <Bar dataKey="vso" fill="#c9a84c" radius={[2, 2, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
  return (
    <ResponsiveContainer width="100%" height={h}>
      <LineChart data={dados} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
        <Line type="monotone" dataKey="leads" stroke="#22c55e" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

function ModalVisualizacao({ relatorio, dados, periodo, onClose }: {
  relatorio: typeof relatoriosCatalogo[0];
  dados: typeof dadosBase;
  periodo: Periodo;
  onClose: () => void;
}) {
  const avg = (key: keyof typeof dados[0]) =>
    (dados.reduce((s, d) => s + Number(d[key]), 0) / dados.length).toFixed(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.8)", backdropFilter: "blur(4px)" }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="w-full max-w-3xl rounded-2xl flex flex-col"
        style={{ background: "#1a1f2e", border: "1px solid #2a3040", boxShadow: "0 32px 80px rgba(0,0,0,0.6)", maxHeight: "90vh" }}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: "#2a3040" }}>
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg flex items-center justify-center"
              style={{ background: `${relatorio.cor}22`, border: `1px solid ${relatorio.cor}44` }}>
              <relatorio.icon className="h-4 w-4" style={{ color: relatorio.cor }} />
            </div>
            <div>
              <h2 className="text-base font-semibold" style={{ color: "#e2e8f0" }}>{relatorio.titulo}</h2>
              <p className="text-xs" style={{ color: "#94a3b8" }}>{relatorio.tipo} · Período: {periodo}</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-md p-1.5 hover:bg-white/5 transition-colors">
            <X className="h-5 w-5" style={{ color: "#94a3b8" }} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {/* KPIs resumo */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              { label: "Absorção Média", value: `${avg("abs")}%`, color: "#1e6fa8" },
              { label: "VSO Médio", value: `${avg("vso")}%`, color: "#c9a84c" },
              { label: "Leads/mês", value: avg("leads"), color: "#22c55e" },
              { label: "Ticket Médio", value: `R$ ${avg("ticket")}k`, color: "#a855f7" },
            ].map(kpi => (
              <div key={kpi.label} className="rounded-xl p-3"
                style={{ background: "rgba(15,17,23,0.6)", border: "1px solid #2a3040" }}>
                <p className="text-xs mb-1" style={{ color: "#94a3b8" }}>{kpi.label}</p>
                <p className="text-xl font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
              </div>
            ))}
          </div>

          {/* Gráfico principal */}
          <div className="rounded-xl p-4 mb-6"
            style={{ background: "rgba(15,17,23,0.6)", border: "1px solid #2a3040" }}>
            <p className="text-xs font-medium mb-4" style={{ color: "#94a3b8" }}>EVOLUÇÃO NO PERÍODO</p>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={dados} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="gAbs" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1e6fa8" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#1e6fa8" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gVso" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#c9a84c" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#c9a84c" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2a3040" />
                <XAxis dataKey="m" tick={{ fill: "#94a3b8", fontSize: 10 }} />
                <YAxis tick={{ fill: "#94a3b8", fontSize: 10 }} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="abs" name="Abs%" stroke="#1e6fa8" strokeWidth={2} fill="url(#gAbs)" dot={false} />
                <Area type="monotone" dataKey="vso" name="VSO%" stroke="#c9a84c" strokeWidth={2} fill="url(#gVso)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Tabela de dados */}
          <div className="rounded-xl overflow-hidden" style={{ border: "1px solid #2a3040" }}>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ background: "rgba(42,48,64,0.5)" }}>
                    {["Mês", "Absorção", "VSO", "Leads", "Ticket"].map(h => (
                      <th key={h} className="px-4 py-2.5 text-left font-medium"
                        style={{ color: "#94a3b8", borderBottom: "1px solid #2a3040" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dados.map((d, i) => (
                    <tr key={d.m} style={{ borderBottom: i < dados.length - 1 ? "1px solid #1a1f2e" : "none" }}>
                      <td className="px-4 py-2" style={{ color: "#e2e8f0" }}>{d.m}</td>
                      <td className="px-4 py-2" style={{ color: "#1e6fa8", fontWeight: 600 }}>{d.abs}%</td>
                      <td className="px-4 py-2" style={{ color: "#c9a84c", fontWeight: 600 }}>{d.vso}%</td>
                      <td className="px-4 py-2" style={{ color: "#22c55e" }}>{d.leads.toLocaleString("pt-BR")}</td>
                      <td className="px-4 py-2" style={{ color: "#e2e8f0" }}>R$ {d.ticket}k</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t" style={{ borderColor: "#2a3040" }}>
          <p className="text-xs" style={{ color: "#4a5568" }}>
            Gerado em {new Date().toLocaleDateString("pt-BR")} · Motor de Inteligência
          </p>
          <Button size="sm"
            style={{ background: "linear-gradient(135deg, #1e6fa8, #164f78)", color: "white" }}
            onClick={() => {
              const csv = ["Mês,Absorção,VSO,Leads,Ticket",
                ...dados.map(d => `${d.m},${d.abs}%,${d.vso}%,${d.leads},R$ ${d.ticket}k`)
              ].join("\n");
              const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
              const url = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = url; a.download = `${relatorio.titulo}-${periodo}.csv`; a.click();
              URL.revokeObjectURL(url);
            }}>
            <Download className="mr-2 h-3.5 w-3.5" /> Baixar CSV
          </Button>
        </div>
      </div>
    </div>
  );
}

function RelatoriosPage() {
  const [periodo, setPeriodo] = useState<Periodo>("12M");
  const [gerados, setGerados] = useState<RelatorioGerado[]>([]);
  const [visualizando, setVisualizando] = useState<typeof relatoriosCatalogo[0] | null>(null);
  const [atualizando, setAtualizando] = useState(false);

  const dadosFiltrados = useMemo(() => {
    const n = periodoMeses[periodo];
    return dadosBase.slice(-n);
  }, [periodo]);

  const handleGerar = (rel: typeof relatoriosCatalogo[0]) => {
    const jaExiste = gerados.find(g => g.id === rel.id && g.periodo === periodo);
    if (jaExiste) { setVisualizando(rel); return; }

    const novo: RelatorioGerado = {
      id: rel.id, titulo: rel.titulo, tipo: rel.tipo,
      periodo, geradoEm: new Date().toLocaleDateString("pt-BR"), status: "gerando",
    };
    setGerados(prev => [...prev.filter(g => !(g.id === rel.id && g.periodo === periodo)), novo]);

    setTimeout(() => {
      setGerados(prev => prev.map(g =>
        g.id === rel.id && g.periodo === periodo ? { ...g, status: "pronto" } : g
      ));
      setVisualizando(rel);
    }, 1200);
  };

  const handleDownload = (rel: typeof relatoriosCatalogo[0]) => {
    const csv = ["Mês,Absorção,VSO,Leads,Ticket",
      ...dadosFiltrados.map(d => `${d.m},${d.abs}%,${d.vso}%,${d.leads},R$ ${d.ticket}k`)
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `${rel.titulo}-${periodo}.csv`; a.click();
    URL.revokeObjectURL(url);
  };

  const handleAtualizar = () => {
    setAtualizando(true);
    setGerados(prev => prev.map(g => ({ ...g, status: "gerando" as StatusGerado })));
    setTimeout(() => {
      setGerados(prev => prev.map(g => ({
        ...g, status: "pronto" as StatusGerado,
        geradoEm: new Date().toLocaleDateString("pt-BR"),
      })));
      setAtualizando(false);
    }, 1500);
  };

  const statusDoRel = (id: number) => gerados.find(g => g.id === id && g.periodo === periodo);

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      <PageHeader
        title="Relatórios"
        subtitle="Documentos analíticos com dados reais — exportáveis em CSV."
        actions={
          <Button size="sm" variant="outline"
            onClick={handleAtualizar}
            disabled={atualizando}
            style={{ borderColor: "#2a3040", color: "#94a3b8" }}>
            <RefreshCw className={`mr-2 h-4 w-4 ${atualizando ? "animate-spin" : ""}`} />
            {atualizando ? "Atualizando..." : "Atualizar todos"}
          </Button>
        }
      />

      {/* Seletor de período */}
      <div className="flex items-center gap-2 mb-8">
        <Calendar className="h-4 w-4" style={{ color: "#94a3b8" }} />
        <span className="text-sm mr-2" style={{ color: "#94a3b8" }}>Período:</span>
        {(["3M", "6M", "12M", "24M"] as Periodo[]).map(p => (
          <button
            key={p}
            onClick={() => setPeriodo(p)}
            className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
            style={periodo === p
              ? { background: "#1e6fa8", color: "white", boxShadow: "0 0 12px rgba(30,111,168,0.4)" }
              : { background: "rgba(42,48,64,0.4)", color: "#94a3b8", border: "1px solid #2a3040" }
            }
          >
            {p}
          </button>
        ))}
        <span className="text-xs ml-2" style={{ color: "#4a5568" }}>
          {dadosFiltrados.length} meses de dados · {dadosFiltrados[0]?.m} → {dadosFiltrados[dadosFiltrados.length - 1]?.m}
        </span>
      </div>

      {/* Cards de relatórios */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {relatoriosCatalogo.map(rel => {
          const st = statusDoRel(rel.id);
          const Icon = rel.icon;

          return (
            <Card key={rel.id} className="p-5 flex flex-col gap-4 hover:border-opacity-60 transition-all"
              style={{ background: "#1a1f2e", border: "1px solid #2a3040" }}>
              {/* Top */}
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: `${rel.cor}18`, border: `1px solid ${rel.cor}30` }}>
                  <Icon className="h-5 w-5" style={{ color: rel.cor }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm truncate" style={{ color: "#e2e8f0" }}>{rel.titulo}</h3>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs px-1.5 py-0"
                      style={{ borderColor: "#2a3040", color: "#94a3b8" }}>{rel.tipo}</Badge>
                    {st && (
                      <Badge variant="outline" className="text-xs px-1.5 py-0"
                        style={{
                          borderColor: st.status === "pronto" ? "rgba(34,197,94,0.3)" : "rgba(30,111,168,0.3)",
                          color: st.status === "pronto" ? "#22c55e" : "#1e6fa8",
                          background: st.status === "pronto" ? "rgba(34,197,94,0.08)" : "rgba(30,111,168,0.08)",
                        }}>
                        {st.status === "pronto"
                          ? <><CheckCircle2 className="h-3 w-3 mr-1" />{st.geradoEm}</>
                          : <><Clock className="h-3 w-3 mr-1 animate-spin" />Gerando...</>}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs mt-1.5" style={{ color: "#94a3b8" }}>{rel.descricao}</p>
                </div>
              </div>

              {/* Mini gráfico */}
              <div className="rounded-lg overflow-hidden" style={{ background: "rgba(15,17,23,0.5)", border: "1px solid #2a3040" }}>
                <MiniGrafico tipo={rel.grafico} dados={dadosFiltrados} />
              </div>

              {/* Ações */}
              <div className="flex items-center gap-2 pt-1">
                <Button size="sm" className="flex-1"
                  onClick={() => handleGerar(rel)}
                  disabled={st?.status === "gerando"}
                  style={{ background: "linear-gradient(135deg, #1e6fa8, #164f78)", color: "white", fontSize: 12 }}>
                  {st?.status === "gerando"
                    ? <><Clock className="mr-1.5 h-3.5 w-3.5 animate-spin" />Gerando...</>
                    : <><Eye className="mr-1.5 h-3.5 w-3.5" />Visualizar</>}
                </Button>
                <Button size="sm" variant="outline"
                  onClick={() => handleDownload(rel)}
                  title="Baixar CSV"
                  style={{ borderColor: "#2a3040", color: "#94a3b8", padding: "0 10px" }}>
                  <Download className="h-4 w-4" />
                </Button>
                <Button size="sm" variant="outline"
                  onClick={() => {
                    setGerados(prev => prev.map(g =>
                      g.id === rel.id && g.periodo === periodo ? { ...g, status: "gerando" } : g
                    ));
                    setTimeout(() => setGerados(prev => prev.map(g =>
                      g.id === rel.id && g.periodo === periodo
                        ? { ...g, status: "pronto", geradoEm: new Date().toLocaleDateString("pt-BR") } : g
                    )), 1000);
                  }}
                  title="Atualizar este relatório"
                  style={{ borderColor: "#2a3040", color: "#94a3b8", padding: "0 10px" }}>
                  <RefreshCw className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Modal de visualização */}
      {visualizando && (
        <ModalVisualizacao
          relatorio={visualizando}
          dados={dadosFiltrados}
          periodo={periodo}
          onClose={() => setVisualizando(null)}
        />
      )}
    </div>
  );
}
