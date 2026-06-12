import { createFileRoute } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { DataImportModal } from "@/components/data-import-modal";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, Tooltip, CartesianGrid, RadarChart,
  PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
} from "recharts";
import {
  Building2, MapPin, TrendingUp, Search, Filter,
  ArrowUpRight, ArrowDownRight, Layers, Target,
  Home, ChevronRight, Star, AlertTriangle, CheckCircle2,
  Users, BarChart3, Zap, Shield, Eye, Upload,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/empreendimentos")({
  component: EmpreendimentosPage,
});

// ─── Types ────────────────────────────────────────────────────────────────────

type Status = "Lançamento" | "Em obras" | "Concluído" | "Breve lançamento";
type Padrao = "MCMV F1" | "MCMV F2" | "MCMV F3" | "Médio" | "Alto";
type Zona = "Oeste" | "Norte" | "Centro" | "Sul" | "Metro";

type Tipologia = {
  tipo: string;
  area: number; // m²
  qtd_total: number;
  qtd_disp: number;
  valor: number; // R$ mil
  valor_m2: number;
};

type Empreendimento = {
  id: string;
  nome: string;
  incorporadora: string;
  bairro: string;
  zona: Zona;
  status: Status;
  padrao: Padrao;
  abs: number; // % absorção
  vso: number; // % VSO mês
  unidades: number;
  estoque: number;
  ticket: number; // R$ mil
  valor_m2: number;
  entrega: string;
  tipologias: Tipologia[];
  lat: number;
  lng: number;
  diferenciais: string[];
  financiamento: string[];
  variacao_abs: number; // delta vs mês anterior
};

// ─── Dataset ──────────────────────────────────────────────────────────────────

const empreendimentos: Empreendimento[] = [
  // ── CURY ──
  {
    id: "cury-01", nome: "Cury Vista Park", incorporadora: "Cury",
    bairro: "Campo Grande", zona: "Oeste", status: "Lançamento", padrao: "MCMV F3",
    abs: 72, vso: 18.4, unidades: 320, estoque: 89, ticket: 295, valor_m2: 4900,
    entrega: "Dez/2027", variacao_abs: 4,
    tipologias: [
      { tipo: "2Q", area: 48, qtd_total: 160, qtd_disp: 40, valor: 260, valor_m2: 5417 },
      { tipo: "2Q + Suíte", area: 58, qtd_total: 120, qtd_disp: 35, valor: 310, valor_m2: 5345 },
      { tipo: "3Q", area: 68, qtd_total: 40, qtd_disp: 14, valor: 370, valor_m2: 5441 },
    ],
    lat: -22.9068, lng: -43.5631,
    diferenciais: ["Rooftop com piscina", "Fitness", "Salão de festas", "BRT a 400m"],
    financiamento: ["MCMV Faixa 3", "FGTS", "SFH"],
  },
  {
    id: "cury-02", nome: "Cury Estação Madureira", incorporadora: "Cury",
    bairro: "Madureira", zona: "Norte", status: "Em obras", padrao: "MCMV F3",
    abs: 85, vso: 19.2, unidades: 260, estoque: 39, ticket: 285, valor_m2: 5100,
    entrega: "Jun/2027", variacao_abs: 6,
    tipologias: [
      { tipo: "Studio", area: 28, qtd_total: 60, qtd_disp: 8, valor: 175, valor_m2: 6250 },
      { tipo: "2Q", area: 46, qtd_total: 140, qtd_disp: 22, valor: 265, valor_m2: 5761 },
      { tipo: "2Q + Suíte", area: 56, qtd_total: 60, qtd_disp: 9, valor: 305, valor_m2: 5446 },
    ],
    lat: -22.8742, lng: -43.3394,
    diferenciais: ["Metrô Madureira 200m", "Coworking", "Playground", "Segurança 24h"],
    financiamento: ["MCMV Faixa 3", "FGTS", "SFH"],
  },
  {
    id: "cury-03", nome: "Cury Bangu Plaza", incorporadora: "Cury",
    bairro: "Bangu", zona: "Oeste", status: "Em obras", padrao: "MCMV F2",
    abs: 64, vso: 14.8, unidades: 180, estoque: 65, ticket: 220, valor_m2: 4200,
    entrega: "Mar/2028", variacao_abs: 1,
    tipologias: [
      { tipo: "2Q", area: 44, qtd_total: 120, qtd_disp: 42, valor: 195, valor_m2: 4432 },
      { tipo: "2Q + Suíte", area: 54, qtd_total: 60, qtd_disp: 23, valor: 240, valor_m2: 4444 },
    ],
    lat: -22.8733, lng: -43.4517,
    diferenciais: ["Próx. Shopping Bangu", "Piscina", "Quadra poliesportiva"],
    financiamento: ["MCMV Faixa 2", "FGTS"],
  },
  {
    id: "cury-04", nome: "Cury Realengo Life", incorporadora: "Cury",
    bairro: "Realengo", zona: "Oeste", status: "Lançamento", padrao: "MCMV F2",
    abs: 58, vso: 12.6, unidades: 240, estoque: 101, ticket: 235, valor_m2: 4400,
    entrega: "Jun/2028", variacao_abs: -2,
    tipologias: [
      { tipo: "2Q", area: 46, qtd_total: 160, qtd_disp: 68, valor: 210, valor_m2: 4565 },
      { tipo: "2Q + Suíte", area: 55, qtd_total: 80, qtd_disp: 33, valor: 255, valor_m2: 4636 },
    ],
    lat: -22.8829, lng: -43.4189,
    diferenciais: ["BRT Realengo", "Área verde", "Salão de festas"],
    financiamento: ["MCMV Faixa 2", "FGTS"],
  },
  {
    id: "cury-05", nome: "Cury Pixinguinha Residencial", incorporadora: "Cury",
    bairro: "Porto Maravilha", zona: "Centro", status: "Lançamento", padrao: "MCMV F3",
    abs: 68, vso: 12.1, unidades: 400, estoque: 128, ticket: 380, valor_m2: 7200,
    entrega: "Set/2027", variacao_abs: 9,
    tipologias: [
      { tipo: "Studio", area: 28, qtd_total: 120, qtd_disp: 38, valor: 245, valor_m2: 8750 },
      { tipo: "1Q", area: 38, qtd_total: 160, qtd_disp: 52, valor: 310, valor_m2: 8158 },
      { tipo: "2Q", area: 52, qtd_total: 80, qtd_disp: 28, valor: 420, valor_m2: 8077 },
      { tipo: "2Q + Suíte", area: 62, qtd_total: 40, qtd_disp: 10, valor: 490, valor_m2: 7903 },
    ],
    lat: -22.8986, lng: -43.1773,
    diferenciais: ["Rooftop vista Guanabara", "Porto Maravilha", "VLT 300m", "Coworking premium"],
    financiamento: ["MCMV Faixa 3", "FGTS", "SFH"],
  },
  {
    id: "cury-06", nome: "Cury Santa Cruz Garden", incorporadora: "Cury",
    bairro: "Santa Cruz", zona: "Oeste", status: "Concluído", padrao: "MCMV F2",
    abs: 98, vso: 4.2, unidades: 300, estoque: 6, ticket: 215, valor_m2: 3900,
    entrega: "Concluído", variacao_abs: 0,
    tipologias: [
      { tipo: "2Q", area: 44, qtd_total: 200, qtd_disp: 4, valor: 185, valor_m2: 4205 },
      { tipo: "2Q + Suíte", area: 54, qtd_total: 100, qtd_disp: 2, valor: 225, valor_m2: 4167 },
    ],
    lat: -22.9175, lng: -43.6861,
    diferenciais: ["Pronto para morar", "Escritura imediata"],
    financiamento: ["MCMV Faixa 2", "FGTS", "SFH"],
  },

  // ── CONCORRENTES ──
  {
    id: "mrv-01", nome: "MRV Jardins do Rio", incorporadora: "MRV",
    bairro: "Campo Grande", zona: "Oeste", status: "Em obras", padrao: "MCMV F3",
    abs: 78, vso: 16.2, unidades: 480, estoque: 106, ticket: 275, valor_m2: 4600,
    entrega: "Ago/2027", variacao_abs: 3,
    tipologias: [
      { tipo: "2Q", area: 45, qtd_total: 280, qtd_disp: 62, valor: 240, valor_m2: 5333 },
      { tipo: "2Q + Suíte", area: 55, qtd_total: 160, qtd_disp: 34, valor: 285, valor_m2: 5182 },
      { tipo: "3Q", area: 66, qtd_total: 40, qtd_disp: 10, valor: 340, valor_m2: 5152 },
    ],
    lat: -22.9022, lng: -43.5598,
    diferenciais: ["Piscina adulto e infantil", "Churrasqueira", "Segurança 24h"],
    financiamento: ["MCMV Faixa 3", "FGTS", "SFH"],
  },
  {
    id: "mrv-02", nome: "MRV Reserva Bangu", incorporadora: "MRV",
    bairro: "Bangu", zona: "Oeste", status: "Lançamento", padrao: "MCMV F2",
    abs: 55, vso: 11.4, unidades: 360, estoque: 162, ticket: 210, valor_m2: 4000,
    entrega: "Dez/2028", variacao_abs: 2,
    tipologias: [
      { tipo: "2Q", area: 43, qtd_total: 240, qtd_disp: 108, valor: 185, valor_m2: 4302 },
      { tipo: "2Q + Suíte", area: 52, qtd_total: 120, qtd_disp: 54, valor: 225, valor_m2: 4327 },
    ],
    lat: -22.8811, lng: -43.4538,
    diferenciais: ["Playground", "Salão de festas", "Área verde"],
    financiamento: ["MCMV Faixa 2", "FGTS"],
  },
  {
    id: "dir-01", nome: "Direcional Viver Mais RJ", incorporadora: "Direcional",
    bairro: "Madureira", zona: "Norte", status: "Em obras", padrao: "MCMV F2",
    abs: 82, vso: 17.8, unidades: 520, estoque: 94, ticket: 265, valor_m2: 4800,
    entrega: "Out/2026", variacao_abs: 5,
    tipologias: [
      { tipo: "2Q", area: 44, qtd_total: 320, qtd_disp: 58, valor: 230, valor_m2: 5227 },
      { tipo: "2Q + Suíte", area: 54, qtd_total: 200, qtd_disp: 36, valor: 275, valor_m2: 5093 },
    ],
    lat: -22.8710, lng: -43.3421,
    diferenciais: ["Metrô próximo", "Cobertura lazer", "Estacionamento"],
    financiamento: ["MCMV Faixa 2", "FGTS"],
  },
  {
    id: "dir-02", nome: "Direcional Reserva Oeste", incorporadora: "Direcional",
    bairro: "Realengo", zona: "Oeste", status: "Breve lançamento", padrao: "MCMV F2",
    abs: 0, vso: 0, unidades: 400, estoque: 400, ticket: 225, valor_m2: 4200,
    entrega: "2029", variacao_abs: 0,
    tipologias: [
      { tipo: "2Q", area: 45, qtd_total: 260, qtd_disp: 260, valor: 205, valor_m2: 4556 },
      { tipo: "2Q + Suíte", area: 55, qtd_total: 140, qtd_disp: 140, valor: 245, valor_m2: 4455 },
    ],
    lat: -22.8852, lng: -43.4202,
    diferenciais: ["Pré-lançamento", "Condições especiais"],
    financiamento: ["MCMV Faixa 2", "FGTS"],
  },
  {
    id: "rjz-01", nome: "RJZ Living Porto", incorporadora: "RJZ Cyrela",
    bairro: "Porto Maravilha", zona: "Centro", status: "Lançamento", padrao: "Médio",
    abs: 61, vso: 10.8, unidades: 280, estoque: 109, ticket: 580, valor_m2: 9800,
    entrega: "Mar/2028", variacao_abs: 7,
    tipologias: [
      { tipo: "Studio", area: 32, qtd_total: 80, qtd_disp: 32, valor: 380, valor_m2: 11875 },
      { tipo: "1Q", area: 42, qtd_total: 120, qtd_disp: 46, valor: 520, valor_m2: 12381 },
      { tipo: "2Q", area: 60, qtd_total: 80, qtd_disp: 31, valor: 720, valor_m2: 12000 },
    ],
    lat: -22.8971, lng: -43.1748,
    diferenciais: ["Design assinado", "Varanda gourmet", "VLT 200m", "Marina view"],
    financiamento: ["SFH", "SFI", "Permuta"],
  },
  {
    id: "tenda-01", nome: "Tenda Carioca Homes", incorporadora: "Construtora Tenda",
    bairro: "Santa Cruz", zona: "Oeste", status: "Em obras", padrao: "MCMV F1",
    abs: 91, vso: 22.4, unidades: 600, estoque: 54, ticket: 185, valor_m2: 3500,
    entrega: "Abr/2026", variacao_abs: 2,
    tipologias: [
      { tipo: "2Q", area: 42, qtd_total: 400, qtd_disp: 36, valor: 165, valor_m2: 3929 },
      { tipo: "2Q + Suíte", area: 50, qtd_total: 200, qtd_disp: 18, valor: 200, valor_m2: 4000 },
    ],
    lat: -22.9148, lng: -43.6834,
    diferenciais: ["FGTS zerado", "Subsidiado MCMV F1", "Entrega próxima"],
    financiamento: ["MCMV Faixa 1", "FGTS total"],
  },
  {
    id: "even-01", nome: "Even Boulevard Recreio", incorporadora: "Even",
    bairro: "Recreio", zona: "Oeste", status: "Lançamento", padrao: "Alto",
    abs: 54, vso: 9.2, unidades: 160, estoque: 74, ticket: 890, valor_m2: 12500,
    entrega: "Jun/2028", variacao_abs: 4,
    tipologias: [
      { tipo: "3Q + Suíte", area: 98, qtd_total: 80, qtd_disp: 38, valor: 1100, valor_m2: 11224 },
      { tipo: "Cobertura", area: 180, qtd_total: 40, qtd_disp: 18, valor: 1900, valor_m2: 10556 },
      { tipo: "Garden", area: 130, qtd_total: 40, qtd_disp: 18, valor: 1500, valor_m2: 11538 },
    ],
    lat: -23.0084, lng: -43.4612,
    diferenciais: ["Pé direito alto", "Spa", "Concierge", "Vista mar"],
    financiamento: ["SFI", "Permuta", "Financiamento direto"],
  },
];

// ─── Absorção histórica mock ───────────────────────────────────────────────────

const absHistory = (base: number) =>
  ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"].map(
    (m, i) => ({ m, v: Math.max(0, Math.min(100, base - 28 + i * 2.8 + (Math.sin(i) * 4))) })
  );

// ─── Helpers ──────────────────────────────────────────────────────────────────

const corpora: Record<string, string> = {
  "Cury": "border-gold/50 text-gold bg-gold/10",
  "MRV": "border-primary/50 text-primary bg-primary/10",
  "Direcional": "border-emerald-400/50 text-emerald-300 bg-emerald-500/10",
  "RJZ Cyrela": "border-violet-400/50 text-violet-300 bg-violet-500/10",
  "Construtora Tenda": "border-sky-400/50 text-sky-300 bg-sky-500/10",
  "Even": "border-rose-400/50 text-rose-300 bg-rose-500/10",
};

const statusColor: Record<Status, string> = {
  "Lançamento": "border-gold/40 text-gold",
  "Em obras": "border-primary/40 text-primary",
  "Concluído": "border-success/40 text-success",
  "Breve lançamento": "border-muted-foreground/40 text-muted-foreground",
};

const padraoColor: Record<Padrao, string> = {
  "MCMV F1": "bg-sky-500/10 text-sky-300 border-sky-400/30",
  "MCMV F2": "bg-emerald-500/10 text-emerald-300 border-emerald-400/30",
  "MCMV F3": "bg-primary/10 text-primary border-primary/30",
  "Médio": "bg-gold/10 text-gold border-gold/30",
  "Alto": "bg-violet-500/10 text-violet-300 border-violet-400/30",
};

const scoreColor = (v: number) =>
  v >= 80 ? "text-emerald-300" : v >= 65 ? "text-gold" : v >= 45 ? "text-primary" : "text-muted-foreground";

function compararScore(emp: Empreendimento): { label: string; pts: number }[] {
  const cury = empreendimentos.find(
    (e) => e.incorporadora === "Cury" && e.bairro === emp.bairro && e.id !== emp.id
  );
  if (!cury) return [];
  return [
    { label: "Absorção", pts: emp.abs - cury.abs },
    { label: "VSO", pts: Math.round((emp.vso - cury.vso) * 10) / 10 },
    { label: "Ticket", pts: emp.ticket - cury.ticket },
    { label: "Valor m²", pts: emp.valor_m2 - cury.valor_m2 },
    { label: "Estoque", pts: emp.estoque - cury.estoque },
  ];
}

// ─── Components ───────────────────────────────────────────────────────────────

function EmpCard({
  emp,
  onClick,
  highlight,
}: {
  emp: Empreendimento;
  onClick: () => void;
  highlight?: boolean;
}) {
  const isCury = emp.incorporadora === "Cury";
  const estoquePct = Math.round((emp.estoque / emp.unidades) * 100);

  return (
    <Card
      onClick={onClick}
      className={`p-5 glass border-border/60 cursor-pointer transition-all hover:border-gold/40 group relative overflow-hidden ${
        highlight ? "ring-1 ring-gold/40" : ""
      }`}
    >
      {isCury && (
        <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-gold/60 via-gold to-gold/60" />
      )}

      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <div
            className={`h-8 w-8 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 ${
              corpora[emp.incorporadora] || "bg-muted/40 text-muted-foreground border border-border"
            } border`}
          >
            {emp.incorporadora.slice(0, 2).toUpperCase()}
          </div>
          <div>
            <Badge variant="outline" className={`text-[10px] ${statusColor[emp.status]}`}>
              {emp.status}
            </Badge>
          </div>
        </div>
        <Badge variant="outline" className={`text-[10px] shrink-0 ${padraoColor[emp.padrao]}`}>
          {emp.padrao}
        </Badge>
      </div>

      <h3 className="mt-3 font-semibold text-sm leading-snug group-hover:text-gold transition-colors">
        {emp.nome}
      </h3>
      <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
        <MapPin className="h-3 w-3 shrink-0" />
        {emp.bairro} · {emp.zona}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-md bg-muted/20 p-2">
          <div className={`text-lg font-semibold font-mono ${scoreColor(emp.abs)}`}>{emp.abs}%</div>
          <div className="text-[10px] text-muted-foreground">Absorção</div>
        </div>
        <div className="rounded-md bg-muted/20 p-2">
          <div className="text-lg font-semibold font-mono text-foreground">{emp.vso}%</div>
          <div className="text-[10px] text-muted-foreground">VSO/mês</div>
        </div>
        <div className="rounded-md bg-muted/20 p-2">
          <div className="text-lg font-semibold font-mono text-foreground">
            {emp.ticket < 1000 ? `${emp.ticket}k` : `${(emp.ticket / 1000).toFixed(1)}M`}
          </div>
          <div className="text-[10px] text-muted-foreground">Ticket</div>
        </div>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between text-[11px] mb-1.5">
          <span className="text-muted-foreground">Estoque disponível</span>
          <span className="font-mono text-muted-foreground">{emp.estoque} un · {estoquePct}%</span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
          <div
            className={`h-full rounded-full ${isCury ? "bg-gradient-to-r from-primary to-gold" : "bg-primary/60"}`}
            style={{ width: `${emp.abs}%` }}
          />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>R$ {emp.valor_m2.toLocaleString("pt-BR")}/m²</span>
        <span className={`flex items-center gap-1 ${emp.variacao_abs >= 0 ? "text-success" : "text-destructive"}`}>
          {emp.variacao_abs >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {emp.variacao_abs >= 0 ? "+" : ""}{emp.variacao_abs} pts
        </span>
      </div>

      <div className="mt-3 pt-3 border-t border-border/40 flex items-center justify-between text-[11px]">
        <span className="text-muted-foreground">{emp.tipologias.length} tipologias · {emp.unidades} un</span>
        <span className="text-muted-foreground flex items-center gap-1">
          Ver detalhes <ChevronRight className="h-3 w-3" />
        </span>
      </div>
    </Card>
  );
}

// ─── Detail Modal ─────────────────────────────────────────────────────────────

function EmpDetail({ emp, onClose }: { emp: Empreendimento; onClose: () => void }) {
  const isCury = emp.incorporadora === "Cury";
  const concorrentes = empreendimentos.filter(
    (e) => e.incorporadora !== "Cury" && e.bairro === emp.bairro
  );
  const radarData = [
    { eixo: "Absorção", val: emp.abs },
    { eixo: "VSO", val: emp.vso * 4 },
    { eixo: "Preço/m²", val: Math.min(100, (emp.valor_m2 / 150)) },
    { eixo: "Estoque", val: 100 - Math.round((emp.estoque / emp.unidades) * 100) },
    { eixo: "Tipologias", val: emp.tipologias.length * 20 },
  ];

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="glass border-border/60 max-w-4xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <div className={`p-6 border-b border-border/60 ${isCury ? "bg-gold/5" : ""}`}>
          {isCury && (
            <div className="h-0.5 w-full bg-gradient-to-r from-gold/60 via-gold to-gold/60 mb-5 -mt-6 mx-0 rounded-none" />
          )}
          <DialogHeader>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className={`text-[10px] ${corpora[emp.incorporadora] || ""} border`}>
                    {emp.incorporadora}
                  </Badge>
                  <Badge variant="outline" className={`text-[10px] ${statusColor[emp.status]}`}>
                    {emp.status}
                  </Badge>
                  <Badge variant="outline" className={`text-[10px] ${padraoColor[emp.padrao]}`}>
                    {emp.padrao}
                  </Badge>
                </div>
                <DialogTitle className="text-xl font-bold">{emp.nome}</DialogTitle>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {emp.bairro} · Zona {emp.zona} · Entrega: {emp.entrega}
                </div>
              </div>
              <div className="text-right shrink-0">
                <div className={`text-3xl font-bold font-mono ${scoreColor(emp.abs)}`}>{emp.abs}%</div>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Absorção</div>
              </div>
            </div>
          </DialogHeader>
        </div>

        <div className="p-6 space-y-6">
          {/* KPIs */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { l: "VSO mensal", v: `${emp.vso}%`, icon: TrendingUp },
              { l: "Ticket médio", v: `R$ ${emp.ticket}k`, icon: BarChart3 },
              { l: "Valor m²", v: `R$ ${emp.valor_m2.toLocaleString("pt-BR")}`, icon: Layers },
              { l: "Estoque", v: `${emp.estoque} un`, icon: Building2 },
            ].map((k) => (
              <div key={k.l} className="rounded-lg bg-muted/20 border border-border/40 p-3">
                <k.icon className="h-3.5 w-3.5 text-gold mb-2" />
                <div className="text-lg font-semibold">{k.v}</div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">{k.l}</div>
              </div>
            ))}
          </div>

          {/* Tipologias */}
          <div>
            <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Home className="h-4 w-4 text-gold" /> Tipologias disponíveis
            </h4>
            <div className="rounded-lg border border-border/60 overflow-hidden">
              <div className="grid grid-cols-5 gap-2 px-3 py-2 text-[10px] uppercase tracking-wider text-muted-foreground bg-muted/20">
                <div>Tipo</div>
                <div className="text-right">Área</div>
                <div className="text-right">Valor</div>
                <div className="text-right">Valor m²</div>
                <div className="text-right">Disponível</div>
              </div>
              {emp.tipologias.map((t) => (
                <div key={t.tipo} className="grid grid-cols-5 gap-2 px-3 py-3 border-t border-border/40 text-sm items-center hover:bg-muted/20">
                  <div className="font-medium">{t.tipo}</div>
                  <div className="text-right font-mono text-xs text-muted-foreground">{t.area} m²</div>
                  <div className="text-right font-mono text-xs text-gold">R$ {t.valor}k</div>
                  <div className="text-right font-mono text-xs">R$ {t.valor_m2.toLocaleString("pt-BR")}</div>
                  <div className="text-right">
                    <span className={`text-xs font-medium ${t.qtd_disp === 0 ? "text-destructive" : t.qtd_disp < 10 ? "text-warning" : "text-success"}`}>
                      {t.qtd_disp}/{t.qtd_total}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gráfico + Radar */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-gold" /> Absorção histórica
              </h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={absHistory(emp.abs)}>
                    <defs>
                      <linearGradient id="gAbs" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="oklch(0.55 0.090 215)" stopOpacity={0.5} />
                        <stop offset="100%" stopColor="oklch(0.55 0.090 215)" stopOpacity={0.02} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" />
                    <XAxis dataKey="m" stroke="oklch(0.68 0.025 230)" fontSize={10} />
                    <YAxis stroke="oklch(0.68 0.025 230)" fontSize={10} domain={[0, 100]} />
                    <Tooltip contentStyle={{ background: "oklch(0.18 0.022 230)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 8, fontSize: 11 }} />
                    <Area type="monotone" dataKey="v" stroke="oklch(0.55 0.090 215)" strokeWidth={2} fill="url(#gAbs)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Target className="h-4 w-4 text-gold" /> Perfil competitivo
              </h4>
              <div className="h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData} outerRadius="70%">
                    <PolarGrid stroke="oklch(0.3 0.02 240 / 0.4)" />
                    <PolarAngleAxis dataKey="eixo" tick={{ fill: "oklch(0.7 0.02 240)", fontSize: 9 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
                    <Radar dataKey="val" stroke="oklch(0.78 0.115 85)" fill="oklch(0.78 0.115 85)" fillOpacity={0.2} strokeWidth={2} />
                    <Tooltip contentStyle={{ background: "oklch(0.18 0.022 230)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 8, fontSize: 11 }} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Diferenciais + Financiamento */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Star className="h-4 w-4 text-gold" /> Diferenciais
              </h4>
              <div className="space-y-2">
                {emp.diferenciais.map((d) => (
                  <div key={d} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0" />
                    <span className="text-muted-foreground">{d}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Shield className="h-4 w-4 text-gold" /> Financiamento aceito
              </h4>
              <div className="flex flex-wrap gap-2">
                {emp.financiamento.map((f) => (
                  <Badge key={f} variant="outline" className="border-primary/40 text-primary text-[11px]">
                    {f}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Comparativo vs concorrentes no mesmo bairro */}
          {!isCury && concorrentes.length === 0 && (
            <div className="rounded-lg border border-gold/20 bg-gold/5 p-4">
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-gold" />
                Nenhum empreendimento Cury cadastrado neste bairro para comparação direta.
              </p>
            </div>
          )}

          {isCury && concorrentes.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Zap className="h-4 w-4 text-gold" /> Concorrência direta no bairro
              </h4>
              <div className="space-y-3">
                {concorrentes.map((c) => {
                  const diff = compararScore(c);
                  return (
                    <div key={c.id} className="rounded-lg border border-border/60 p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className={`text-[10px] ${corpora[c.incorporadora] || ""} border`}>
                            {c.incorporadora}
                          </Badge>
                          <span className="text-sm font-medium">{c.nome}</span>
                        </div>
                        <span className="text-xs text-muted-foreground">Absorção {c.abs}%</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {diff.map((d) => (
                          <span key={d.label} className={`text-[11px] px-2 py-0.5 rounded border ${
                            d.pts > 0 ? "text-destructive border-destructive/30 bg-destructive/5" :
                            d.pts < 0 ? "text-success border-success/30 bg-success/5" :
                            "text-muted-foreground border-border/40"
                          }`}>
                            {d.label}: {d.pts > 0 ? "+" : ""}{d.pts}{d.label === "Ticket" || d.label === "Valor m²" ? "k" : d.label === "Estoque" ? " un" : "%"}
                            {" "}
                            {d.pts > 0 ? "↑ concorrente" : d.pts < 0 ? "↓ Cury vence" : "="}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ─── Radar Comparativo ────────────────────────────────────────────────────────

function RadarComparativo({ emps }: { emps: Empreendimento[] }) {
  const data = [
    { eixo: "Absorção" },
    { eixo: "VSO×4" },
    { eixo: "Preço competitivo" },
    { eixo: "Disponibilidade" },
    { eixo: "Tipologias" },
  ];
  const colors = [
    "oklch(0.78 0.115 85)",
    "oklch(0.55 0.09 215)",
    "oklch(0.70 0.15 160)",
    "oklch(0.65 0.18 25)",
  ];

  const enriched = data.map((d, i) => {
    const row: Record<string, string | number> = { eixo: d.eixo };
    emps.forEach((e) => {
      const vals = [
        e.abs,
        Math.min(100, e.vso * 4),
        Math.max(0, 100 - (e.valor_m2 / 150)),
        100 - Math.round((e.estoque / e.unidades) * 100),
        e.tipologias.length * 20,
      ];
      row[e.nome] = vals[i];
    });
    return row;
  });

  return (
    <div className="h-72">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={enriched} outerRadius="72%">
          <PolarGrid stroke="oklch(0.3 0.02 240 / 0.4)" />
          <PolarAngleAxis dataKey="eixo" tick={{ fill: "oklch(0.7 0.02 240)", fontSize: 10 }} />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
          {emps.map((e, i) => (
            <Radar
              key={e.id}
              name={e.nome}
              dataKey={e.nome}
              stroke={colors[i % colors.length]}
              fill={colors[i % colors.length]}
              fillOpacity={0.15}
              strokeWidth={2}
            />
          ))}
          <Tooltip contentStyle={{ background: "oklch(0.18 0.022 230)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 8, fontSize: 11 }} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

function EmpreendimentosPage() {
  const [busca, setBusca] = useState("");
  const [zonaFiltro, setZonaFiltro] = useState("todas");
  const [statusFiltro, setStatusFiltro] = useState("todos");
  const [corpFiltro, setCorpFiltro] = useState("todas");
  const [selected, setSelected] = useState<Empreendimento | null>(null);
  const [comparar, setComparar] = useState<string[]>([]);
  const [importOpen, setImportOpen] = useState(false);

  const curyEmps = empreendimentos.filter((e) => e.incorporadora === "Cury");
  const concEmps = empreendimentos.filter((e) => e.incorporadora !== "Cury");

  const filtered = (list: Empreendimento[]) =>
    list.filter((e) => {
      if (zonaFiltro !== "todas" && e.zona !== zonaFiltro) return false;
      if (statusFiltro !== "todos" && e.status !== statusFiltro) return false;
      if (corpFiltro !== "todas" && e.incorporadora !== corpFiltro) return false;
      if (busca && !`${e.nome} ${e.bairro} ${e.incorporadora}`.toLowerCase().includes(busca.toLowerCase())) return false;
      return true;
    });

  const kpis = useMemo(() => ({
    totalCury: curyEmps.length,
    absMedia: Math.round(curyEmps.reduce((s, e) => s + e.abs, 0) / curyEmps.length),
    vsoMedia: Math.round((curyEmps.reduce((s, e) => s + e.vso, 0) / curyEmps.length) * 10) / 10,
    estoque: curyEmps.reduce((s, e) => s + e.estoque, 0),
    concorrentes: concEmps.length,
    absConc: Math.round(concEmps.filter(e => e.abs > 0).reduce((s, e) => s + e.abs, 0) / concEmps.filter(e => e.abs > 0).length),
  }), []);

  const toggleComparar = (id: string) => {
    setComparar((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : prev.length >= 4 ? [...prev.slice(1), id] : [...prev, id]
    );
  };

  const comparandos = empreendimentos.filter((e) => comparar.includes(e.id));

  const barComparativo = useMemo(() => {
    const bairros = [...new Set(empreendimentos.map((e) => e.bairro))];
    return bairros.map((b) => {
      const curyB = empreendimentos.find((e) => e.incorporadora === "Cury" && e.bairro === b);
      const concB = empreendimentos.filter((e) => e.incorporadora !== "Cury" && e.bairro === b && e.abs > 0);
      const concAbs = concB.length ? Math.round(concB.reduce((s, e) => s + e.abs, 0) / concB.length) : null;
      return { bairro: b.split(" ")[0], cury: curyB?.abs ?? null, conc: concAbs };
    }).filter((d) => d.cury !== null || d.conc !== null);
  }, []);

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      <PageHeader
        title="Empreendimentos"
        subtitle="Portfólio Cury e radar competitivo — absorção, VSO, tipologias e comparativo de mercado."
        actions={
          <div className="flex items-center gap-2">
            {comparar.length > 0 && (
              <Button
                size="sm"
                variant="outline"
                className="gap-1.5 border-gold/40 text-gold"
                onClick={() => setComparar([])}
              >
                Limpar comparação ({comparar.length})
              </Button>
            )}
            <Button size="sm" variant="outline" className="gap-1.5 border-border/60"
              onClick={() => setImportOpen(true)}>
              <Upload className="h-4 w-4" /> Importar dados
            </Button>
          </div>
        }
      />
      <DataImportModal
        open={importOpen}
        onClose={() => setImportOpen(false)}
        target="empreendimentos"
        onImport={() => { setImportOpen(false); }}
      />

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
        {[
          { l: "Empreendimentos Cury", v: kpis.totalCury, icon: Building2, cls: "text-gold" },
          { l: "Absorção média Cury", v: `${kpis.absMedia}%`, icon: TrendingUp, cls: "text-success" },
          { l: "VSO médio Cury", v: `${kpis.vsoMedia}%`, icon: Zap, cls: "text-primary" },
          { l: "Estoque total", v: kpis.estoque, icon: Layers, cls: "text-foreground" },
          { l: "Concorrentes mapeados", v: kpis.concorrentes, icon: Eye, cls: "text-muted-foreground" },
          { l: "Absorção média conc.", v: `${kpis.absConc}%`, icon: BarChart3, cls: "text-muted-foreground" },
        ].map((k) => (
          <Card key={k.l} className="p-4 glass border-border/60">
            <k.icon className={`h-3.5 w-3.5 mb-2 ${k.cls}`} />
            <div className={`text-2xl font-semibold font-mono ${k.cls}`}>{k.v}</div>
            <div className="text-[10px] text-muted-foreground mt-1 leading-tight">{k.l}</div>
          </Card>
        ))}
      </div>

      {/* Filtros */}
      <Card className="mb-5 p-3 glass border-border/60 flex flex-col md:flex-row md:items-center gap-3">
        <Filter className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar empreendimento, bairro..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-8 h-9 bg-muted/40"
          />
        </div>
        <Select value={zonaFiltro} onValueChange={setZonaFiltro}>
          <SelectTrigger className="w-[150px] h-9"><SelectValue placeholder="Zona" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas as zonas</SelectItem>
            <SelectItem value="Oeste">Zona Oeste</SelectItem>
            <SelectItem value="Norte">Zona Norte</SelectItem>
            <SelectItem value="Centro">Centro</SelectItem>
            <SelectItem value="Sul">Zona Sul</SelectItem>
            <SelectItem value="Metro">Metropolitana</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFiltro} onValueChange={setStatusFiltro}>
          <SelectTrigger className="w-[170px] h-9"><SelectValue placeholder="Status" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os status</SelectItem>
            <SelectItem value="Lançamento">Lançamento</SelectItem>
            <SelectItem value="Em obras">Em obras</SelectItem>
            <SelectItem value="Concluído">Concluído</SelectItem>
            <SelectItem value="Breve lançamento">Breve lançamento</SelectItem>
          </SelectContent>
        </Select>
        <Select value={corpFiltro} onValueChange={setCorpFiltro}>
          <SelectTrigger className="w-[160px] h-9"><SelectValue placeholder="Incorporadora" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="todas">Todas</SelectItem>
            <SelectItem value="Cury">Cury</SelectItem>
            <SelectItem value="MRV">MRV</SelectItem>
            <SelectItem value="Direcional">Direcional</SelectItem>
            <SelectItem value="RJZ Cyrela">RJZ Cyrela</SelectItem>
            <SelectItem value="Construtora Tenda">Tenda</SelectItem>
            <SelectItem value="Even">Even</SelectItem>
          </SelectContent>
        </Select>
        {comparar.length > 0 && (
          <Badge variant="outline" className="border-gold/40 text-gold ml-auto hidden md:inline-flex gap-1">
            <Users className="h-3 w-3" /> {comparar.length} selecionados
          </Badge>
        )}
      </Card>

      <Tabs defaultValue="portfolio">
        <TabsList className="mb-5">
          <TabsTrigger value="portfolio">
            <Building2 className="h-3.5 w-3.5 mr-2" /> Portfólio Cury
          </TabsTrigger>
          <TabsTrigger value="concorrentes">
            <Eye className="h-3.5 w-3.5 mr-2" /> Radar Competitivo
          </TabsTrigger>
          <TabsTrigger value="comparativo">
            <BarChart3 className="h-3.5 w-3.5 mr-2" /> Comparativo
          </TabsTrigger>
        </TabsList>

        {/* ── Portfólio Cury ── */}
        <TabsContent value="portfolio">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered(curyEmps).map((e) => (
              <EmpCard
                key={e.id}
                emp={e}
                onClick={() => setSelected(e)}
                highlight={comparar.includes(e.id)}
              />
            ))}
          </div>
          {filtered(curyEmps).length === 0 && (
            <div className="text-center py-16 text-muted-foreground text-sm">
              Nenhum empreendimento encontrado com os filtros atuais.
            </div>
          )}
        </TabsContent>

        {/* ── Radar Competitivo ── */}
        <TabsContent value="concorrentes">
          <div className="mb-4 rounded-lg border border-gold/20 bg-gold/5 p-3 flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 text-gold shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground">
              Clique em qualquer empreendimento para ver o comparativo completo com o portfólio Cury do mesmo bairro.
              Selecione até 4 para comparar no radar.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered(concEmps).map((e) => (
              <div key={e.id} className="relative">
                <EmpCard
                  emp={e}
                  onClick={() => setSelected(e)}
                  highlight={comparar.includes(e.id)}
                />
                <button
                  onClick={(ev) => { ev.stopPropagation(); toggleComparar(e.id); }}
                  className={`absolute top-3 right-3 h-6 px-2 rounded text-[10px] border transition-colors ${
                    comparar.includes(e.id)
                      ? "bg-gold/20 border-gold/50 text-gold"
                      : "bg-muted/40 border-border/60 text-muted-foreground hover:border-gold/40"
                  }`}
                >
                  {comparar.includes(e.id) ? "✓ Comparando" : "+ Comparar"}
                </button>
              </div>
            ))}
          </div>
          {filtered(concEmps).length === 0 && (
            <div className="text-center py-16 text-muted-foreground text-sm">
              Nenhum concorrente encontrado com os filtros atuais.
            </div>
          )}
        </TabsContent>

        {/* ── Comparativo ── */}
        <TabsContent value="comparativo">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Bar: Cury vs Média concorrentes por bairro */}
            <Card className="glass border-border/60 p-5">
              <h3 className="font-semibold text-sm mb-1">Absorção — Cury vs concorrentes por bairro</h3>
              <p className="text-xs text-muted-foreground mb-4">Média de absorção no mesmo território</p>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barComparativo} margin={{ left: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="oklch(1 0 0 / 0.06)" vertical={false} />
                    <XAxis dataKey="bairro" stroke="oklch(0.68 0.025 230)" fontSize={10} tickLine={false} />
                    <YAxis stroke="oklch(0.68 0.025 230)" fontSize={10} domain={[0, 100]} />
                    <Tooltip contentStyle={{ background: "oklch(0.18 0.022 230)", border: "1px solid oklch(1 0 0 / 0.1)", borderRadius: 8, fontSize: 11 }} />
                    <Bar dataKey="cury" name="Cury" fill="oklch(0.78 0.115 85)" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="conc" name="Concorrentes" fill="oklch(0.55 0.090 215)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card>

            {/* Radar comparativo selecionados */}
            <Card className="glass border-border/60 p-5">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-semibold text-sm">Radar comparativo</h3>
                {comparar.length > 0 && (
                  <Button size="sm" variant="ghost" className="h-6 text-xs" onClick={() => setComparar([])}>
                    Limpar
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground mb-3">
                {comparar.length === 0
                  ? 'Selecione empreendimentos na aba "Radar Competitivo" para comparar aqui.'
                  : `${comparar.length} empreendimento${comparar.length > 1 ? "s" : ""} selecionado${comparar.length > 1 ? "s" : ""}.`}
              </p>
              {comparandos.length >= 2 ? (
                <RadarComparativo emps={comparandos} />
              ) : (
                <div className="h-64 flex items-center justify-center text-xs text-muted-foreground">
                  Selecione pelo menos 2 empreendimentos.
                </div>
              )}
            </Card>
          </div>

          {/* Tabela completa */}
          <Card className="mt-5 glass border-border/60 overflow-hidden">
            <div className="px-5 py-3 border-b border-border/60">
              <h3 className="font-semibold text-sm">Tabela comparativa — todos os empreendimentos</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="text-left text-[10px] uppercase tracking-wider text-muted-foreground border-b border-border/60 bg-muted/20">
                    <th className="px-4 py-2.5">Empreendimento</th>
                    <th className="px-4 py-2.5">Incorporadora</th>
                    <th className="px-4 py-2.5">Bairro</th>
                    <th className="px-4 py-2.5">Padrão</th>
                    <th className="px-4 py-2.5 text-right">Absorção</th>
                    <th className="px-4 py-2.5 text-right">VSO</th>
                    <th className="px-4 py-2.5 text-right">Ticket</th>
                    <th className="px-4 py-2.5 text-right">R$/m²</th>
                    <th className="px-4 py-2.5 text-right">Estoque</th>
                    <th className="px-4 py-2.5">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {empreendimentos
                    .sort((a, b) => (a.incorporadora === "Cury" ? -1 : 1) - (b.incorporadora === "Cury" ? -1 : 1) || b.abs - a.abs)
                    .map((e) => (
                      <tr
                        key={e.id}
                        onClick={() => setSelected(e)}
                        className={`border-b border-border/40 cursor-pointer transition-colors ${
                          e.incorporadora === "Cury" ? "hover:bg-gold/5" : "hover:bg-muted/20"
                        }`}
                      >
                        <td className="px-4 py-2.5 font-medium">
                          <div className="flex items-center gap-2">
                            {e.incorporadora === "Cury" && (
                              <span className="h-1.5 w-1.5 rounded-full bg-gold shrink-0" />
                            )}
                            {e.nome}
                          </div>
                        </td>
                        <td className="px-4 py-2.5">
                          <Badge variant="outline" className={`text-[10px] ${corpora[e.incorporadora] || ""} border`}>
                            {e.incorporadora}
                          </Badge>
                        </td>
                        <td className="px-4 py-2.5 text-muted-foreground">{e.bairro}</td>
                        <td className="px-4 py-2.5">
                          <Badge variant="outline" className={`text-[10px] ${padraoColor[e.padrao]}`}>{e.padrao}</Badge>
                        </td>
                        <td className={`px-4 py-2.5 text-right font-mono font-semibold ${scoreColor(e.abs)}`}>{e.abs}%</td>
                        <td className="px-4 py-2.5 text-right font-mono">{e.vso}%</td>
                        <td className="px-4 py-2.5 text-right font-mono">R$ {e.ticket}k</td>
                        <td className="px-4 py-2.5 text-right font-mono">{e.valor_m2.toLocaleString("pt-BR")}</td>
                        <td className="px-4 py-2.5 text-right font-mono">{e.estoque}</td>
                        <td className="px-4 py-2.5">
                          <Badge variant="outline" className={`text-[10px] ${statusColor[e.status]}`}>{e.status}</Badge>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Detail modal */}
      {selected && <EmpDetail emp={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}
