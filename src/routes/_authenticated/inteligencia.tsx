import { createFileRoute } from "@tanstack/react-router";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Brain, Sparkles, Zap } from "lucide-react";

export const Route = createFileRoute("/_authenticated/inteligencia")({
  component: InteligenciaPage,
});

const insights = [
  {
    titulo: "Diagnóstico territorial — Zona Oeste",
    badge: "Diagnóstico",
    texto: "A Zona Oeste concentra 64% dos leads ativos do mês. Campo Grande lidera em densidade e ticket médio (R$ 285k), com pico de busca por unidades de 2 quartos e tendência de valorização sustentada pelos eixos de transporte (BRT Transoeste).",
  },
  {
    titulo: "Risco de saturação narrativa — Santa Cruz",
    badge: "Risco",
    texto: "Volume de anúncios concorrentes cresceu 22% em 30 dias. Recomenda-se reposicionar comunicação para diferenciais de infraestrutura e revisar criativos com fadiga superior a 35%.",
  },
  {
    titulo: "Oportunidade — Madureira",
    badge: "Oportunidade",
    texto: "Score subiu 6 pontos. Combinação de novo empreendimento + queda de oferta concorrente cria janela de 60-90 dias para acelerar captação com mídia paga segmentada.",
  },
];

function InteligenciaPage() {
  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      <PageHeader
        title="Inteligência estratégica"
        subtitle="Análises geradas por IA, cruzamentos de dados e leitura de mercado."
        actions={
          <Button size="sm" className="bg-gold text-gold-foreground hover:bg-gold/90">
            <Sparkles className="mr-2 h-4 w-4" />Gerar análise
          </Button>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-5 glass border-border/60">
          <h3 className="font-semibold flex items-center gap-2">
            <Brain className="h-4 w-4 text-gold" /> Prompt Master
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            Cole dados ou descreva o cenário. A IA retorna diagnóstico, liquidez, riscos e recomendações.
          </p>
          <Textarea
            className="mt-4 min-h-40 bg-muted/40 border-border resize-none"
            placeholder="Ex: Analisar absorção dos últimos 90 dias em Campo Grande considerando entrada do BRT e novos lançamentos concorrentes..."
          />
          <div className="mt-3 flex items-center justify-between">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1">
              <Zap className="h-3 w-3 text-gold" /> Modelo: Gemini 2.5 Pro
            </div>
            <Button size="sm" className="bg-primary hover:bg-primary/90">Executar</Button>
          </div>
        </Card>

        <Card className="p-5 glass border-border/60">
          <h3 className="font-semibold">Capacidades</h3>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            {[
              "Diagnóstico territorial",
              "Análise de liquidez",
              "Mapeamento de riscos",
              "Cruzamento mercadológico",
              "Narrativas de mercado",
              "Recomendações táticas",
            ].map((c) => (
              <li key={c} className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />{c}
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4">
        {insights.map((i) => (
          <Card key={i.titulo} className="p-5 glass border-border/60 hover:border-gold/30 transition-colors">
            <Badge variant="outline" className="border-gold/40 text-gold">{i.badge}</Badge>
            <h4 className="mt-3 font-semibold">{i.titulo}</h4>
            <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{i.texto}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
