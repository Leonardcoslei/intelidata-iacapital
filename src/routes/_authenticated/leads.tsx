import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export const Route = createFileRoute("/_authenticated/leads")({
  component: LeadsPage,
});

const leads = [
  { nome: "Ana Pereira", origem: "Instagram", bairro: "Campo Grande", emp: "Vista Park", score: 92, stage: "Visita" },
  { nome: "Carlos Souza", origem: "Stand", bairro: "Madureira", emp: "Estação Madureira", score: 88, stage: "Proposta" },
  { nome: "Beatriz Lima", origem: "Indicação", bairro: "Bangu", emp: "Bangu Plaza", score: 81, stage: "Qualificado" },
  { nome: "Diego Martins", origem: "Google Ads", bairro: "Realengo", emp: "Realengo Life", score: 76, stage: "Visita" },
  { nome: "Fernanda Rocha", origem: "Site", bairro: "Santa Cruz", emp: "Santa Cruz Garden", score: 70, stage: "Novo" },
  { nome: "Gabriel Alves", origem: "WhatsApp", bairro: "Penha", emp: "Penha Reserva", score: 64, stage: "Qualificado" },
  { nome: "Helena Dias", origem: "Instagram", bairro: "Jacarepaguá", emp: "Vista Park", score: 60, stage: "Novo" },
];

const stageColor: Record<string, string> = {
  Novo: "border-muted-foreground/40 text-muted-foreground",
  Qualificado: "border-primary/40 text-primary",
  Visita: "border-gold/40 text-gold",
  Proposta: "border-success/40 text-success",
};

function LeadsPage() {
  const summary = [
    { l: "Leads no mês", v: "4.218" },
    { l: "Taxa de qualificação", v: "62%" },
    { l: "Visitas agendadas", v: "1.087" },
    { l: "Conversão proposta", v: "11,4%" },
  ];
  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      <PageHeader title="Leads" subtitle="Funil comercial, qualificação e scoring comportamental." />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summary.map((s) => (
          <Card key={s.l} className="p-5 glass border-border/60">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">{s.l}</div>
            <div className="mt-2 text-2xl font-semibold">{s.v}</div>
          </Card>
        ))}
      </div>

      <Card className="mt-6 glass border-border/60 overflow-hidden">
        <div className="px-5 py-4 border-b border-border/60 flex items-center justify-between gap-3">
          <h3 className="font-semibold">Pipeline</h3>
          <div className="relative max-w-xs w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar lead..." className="pl-8 h-9" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase text-muted-foreground border-b border-border/60">
                <th className="px-5 py-3">Lead</th>
                <th className="px-5 py-3">Origem</th>
                <th className="px-5 py-3">Bairro</th>
                <th className="px-5 py-3">Empreendimento</th>
                <th className="px-5 py-3">Score</th>
                <th className="px-5 py-3">Estágio</th>
              </tr>
            </thead>
            <tbody>
              {leads.map((l) => (
                <tr key={l.nome} className="border-b border-border/40 hover:bg-muted/30 transition-colors">
                  <td className="px-5 py-3 font-medium">{l.nome}</td>
                  <td className="px-5 py-3 text-muted-foreground">{l.origem}</td>
                  <td className="px-5 py-3 text-muted-foreground">{l.bairro}</td>
                  <td className="px-5 py-3 text-muted-foreground">Cury {l.emp}</td>
                  <td className="px-5 py-3 font-mono text-gold">{l.score}</td>
                  <td className="px-5 py-3"><Badge variant="outline" className={stageColor[l.stage]}>{l.stage}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
