import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, Plus } from "lucide-react";

export const Route = createFileRoute("/_authenticated/empreendimentos")({
  component: EmpreendimentosPage,
});

const empreendimentos = [
  { nome: "Cury Vista Park", bairro: "Campo Grande", status: "Lançamento", abs: 72, ticket: "R$ 295k", unidades: 320 },
  { nome: "Cury Estação Madureira", bairro: "Madureira", status: "Em obras", abs: 85, ticket: "R$ 285k", unidades: 260 },
  { nome: "Cury Bangu Plaza", bairro: "Bangu", status: "Em obras", abs: 64, ticket: "R$ 220k", unidades: 180 },
  { nome: "Cury Realengo Life", bairro: "Realengo", status: "Lançamento", abs: 58, ticket: "R$ 235k", unidades: 240 },
  { nome: "Cury Santa Cruz Garden", bairro: "Santa Cruz", status: "Concluído", abs: 98, ticket: "R$ 215k", unidades: 300 },
  { nome: "Cury Penha Reserva", bairro: "Penha", status: "Em obras", abs: 47, ticket: "R$ 255k", unidades: 200 },
];

function statusColor(s: string) {
  if (s === "Lançamento") return "border-gold/40 text-gold";
  if (s === "Em obras") return "border-primary/40 text-primary";
  return "border-success/40 text-success";
}

function EmpreendimentosPage() {
  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      <PageHeader
        title="Empreendimentos"
        subtitle="Portfólio em comercialização e análise de absorção por unidade."
        actions={<Button size="sm" className="bg-gold text-gold-foreground hover:bg-gold/90"><Plus className="mr-2 h-4 w-4" />Novo</Button>}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {empreendimentos.map((e) => (
          <Card key={e.nome} className="p-5 glass border-border/60 hover:border-gold/30 transition-colors group">
            <div className="flex items-start justify-between">
              <div className="h-10 w-10 rounded-md bg-[var(--gradient-petrol)] flex items-center justify-center">
                <Building2 className="h-5 w-5" />
              </div>
              <Badge variant="outline" className={statusColor(e.status)}>{e.status}</Badge>
            </div>
            <h3 className="mt-4 font-semibold tracking-tight">{e.nome}</h3>
            <div className="text-xs text-muted-foreground">{e.bairro} · {e.unidades} unidades</div>

            <div className="mt-5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Absorção</span>
                <span className="font-mono text-gold">{e.abs}%</span>
              </div>
              <div className="mt-1.5 h-1.5 w-full rounded-full bg-muted overflow-hidden">
                <div className="h-full bg-[var(--gradient-gold)]" style={{ width: `${e.abs}%` }} />
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Ticket médio</span>
              <span className="font-mono">{e.ticket}</span>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
