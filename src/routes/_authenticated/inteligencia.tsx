import { createFileRoute } from "@tanstack/react-router";
import { useState, useRef, useEffect } from "react";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  Sparkles,
  Zap,
  Send,
  Square,
  RotateCcw,
  Copy,
  CheckCheck,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
  TrendingUp,
  MapPin,
  Lightbulb,
  BarChart3,
  Clock,
} from "lucide-react";

export const Route = createFileRoute("/_authenticated/inteligencia")({
  component: InteligenciaPage,
});

// ─── Types ────────────────────────────────────────────────────────────────────

type AnalysisStatus = "idle" | "loading" | "streaming" | "done" | "error";

type SavedAnalysis = {
  id: string;
  titulo: string;
  badge: string;
  badgeVariant: "diagnostico" | "risco" | "oportunidade" | "tendencia";
  texto: string;
  prompt: string;
  criadoEm: string;
};

// ─── Prompt Templates ────────────────────────────────────────────────────────

const TEMPLATES = [
  {
    label: "Diagnóstico territorial",
    icon: MapPin,
    prompt:
      "Faça um diagnóstico completo do território de Campo Grande, Zona Oeste do Rio de Janeiro. Considere: absorção atual de 81%, ticket médio R$ 285k, score territorial 92/100, VSO de 18,4%, pressão institucional em 64 e narrativa dominante de demanda popular. Identifique forças, riscos, oportunidades de janela e recomendações táticas para os próximos 90 dias.",
  },
  {
    label: "Análise de risco",
    icon: AlertTriangle,
    prompt:
      "Analise o risco de saturação narrativa em Santa Cruz, Zona Oeste do RJ. Dados: score 88, absorção 79%, saturação 36, volume de concorrentes cresceu 22% em 30 dias. Qual a probabilidade de reversão do cenário? Que indicadores monitorar? Recomende ações de mitigação.",
  },
  {
    label: "Oportunidade de mercado",
    icon: TrendingUp,
    prompt:
      "Identifique e qualifique a oportunidade em Madureira, Zona Norte do Rio. Dados: score subiu 6 pontos para 85, absorção 84%, liquidez 88, narrativa de mobilidade, VSO 19,2%. Qual é o tamanho desta janela? Qual perfil de lead priorizar? Que tipo de produto tem maior aderência?",
  },
  {
    label: "Comparativo territorial",
    icon: BarChart3,
    prompt:
      "Compare os territórios Porto Maravilha (score 86, expansão 94, ticket R$ 620k, narrativa requalificação) e Campo Grande (score 92, expansão 88, ticket R$ 285k, narrativa demanda popular) do Rio de Janeiro. Quais as diferenças estratégicas? Para qual perfil de investidor cada um é mais indicado? Qual tem melhor perspectiva para os próximos 12 meses?",
  },
];

// ─── System Prompt ────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `Você é o Motor de Inteligência — analista sênior especializado no mercado imobiliário do Rio de Janeiro, com foco no ecossistema Cury Construtora.

Seu perfil:
- Especialista em MCMV (Faixas 1, 2 e 3), SFH, SFI e SBPE
- Domínio profundo de VSO, absorção imobiliária, scoring territorial e análise de leads
- Conhecimento das regiões prioritárias: Porto Maravilha, Guaratiba, Zona Oeste, Zona Norte
- Foco em lançamentos na planta e estratégias de comercialização

Formato de resposta:
- Use markdown estruturado com seções claras
- Comece sempre com um resumo executivo de 2-3 linhas
- Use **negrito** para métricas e termos técnicos chave
- Organize com subtítulos: ## Diagnóstico, ## Riscos, ## Oportunidades, ## Recomendações
- Seja direto, denso e analítico — sem rodeios
- Termine sempre com 3 ações táticas priorizadas numeradas

Vocabulário obrigatório: VSO, CPL, absorção, ticket médio, FGTS, MCMV, SFH, tipologia, pipeline, aderência territorial, score, narrativa dominante, pressão institucional.`;

// ─── Static Insights ─────────────────────────────────────────────────────────

const staticInsights: SavedAnalysis[] = [
  {
    id: "static-1",
    titulo: "Diagnóstico territorial — Zona Oeste",
    badge: "Diagnóstico",
    badgeVariant: "diagnostico",
    texto:
      "A Zona Oeste concentra 64% dos leads ativos do mês. Campo Grande lidera em densidade e ticket médio (R$ 285k), com pico de busca por unidades de 2 quartos e tendência de valorização sustentada pelos eixos de transporte (BRT Transoeste).",
    prompt: "",
    criadoEm: "há 2 dias",
  },
  {
    id: "static-2",
    titulo: "Risco de saturação narrativa — Santa Cruz",
    badge: "Risco",
    badgeVariant: "risco",
    texto:
      "Volume de anúncios concorrentes cresceu 22% em 30 dias. Recomenda-se reposicionar comunicação para diferenciais de infraestrutura e revisar criativos com fadiga superior a 35%.",
    prompt: "",
    criadoEm: "há 3 dias",
  },
  {
    id: "static-3",
    titulo: "Oportunidade — Madureira",
    badge: "Oportunidade",
    badgeVariant: "oportunidade",
    texto:
      "Score subiu 6 pontos. Combinação de novo empreendimento + queda de oferta concorrente cria janela de 60-90 dias para acelerar captação com mídia paga segmentada.",
    prompt: "",
    criadoEm: "há 4 dias",
  },
];

// ─── Badge styles ─────────────────────────────────────────────────────────────

const badgeStyles: Record<string, string> = {
  diagnostico: "border-primary/40 text-primary",
  risco: "border-destructive/40 text-destructive",
  oportunidade: "border-success/40 text-success",
  tendencia: "border-gold/40 text-gold",
};

const badgeIcons: Record<string, typeof Brain> = {
  diagnostico: Brain,
  risco: AlertTriangle,
  oportunidade: TrendingUp,
  tendencia: Lightbulb,
};

// ─── Markdown renderer simples ────────────────────────────────────────────────

function renderMarkdown(text: string) {
  const lines = text.split("\n");
  const elements: React.ReactNode[] = [];
  let key = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    if (line.startsWith("## ")) {
      elements.push(
        <h3 key={key++} className="text-sm font-semibold text-foreground mt-5 mb-2 flex items-center gap-2">
          <span className="h-1 w-4 rounded bg-gold inline-block" />
          {line.replace("## ", "")}
        </h3>
      );
    } else if (line.startsWith("# ")) {
      elements.push(
        <h2 key={key++} className="text-base font-bold text-foreground mt-4 mb-3">
          {line.replace("# ", "")}
        </h2>
      );
    } else if (line.startsWith("- ") || line.startsWith("* ")) {
      elements.push(
        <div key={key++} className="flex items-start gap-2 text-sm text-muted-foreground my-1">
          <span className="h-1.5 w-1.5 rounded-full bg-gold mt-1.5 shrink-0" />
          <span dangerouslySetInnerHTML={{ __html: boldify(line.replace(/^[-*] /, "")) }} />
        </div>
      );
    } else if (/^\d+\. /.test(line)) {
      const num = line.match(/^(\d+)\. /)?.[1];
      elements.push(
        <div key={key++} className="flex items-start gap-2 text-sm my-1.5">
          <span className="h-5 w-5 rounded bg-primary/20 text-primary text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
            {num}
          </span>
          <span className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: boldify(line.replace(/^\d+\. /, "")) }} />
        </div>
      );
    } else if (line.trim() === "") {
      elements.push(<div key={key++} className="h-1" />);
    } else {
      elements.push(
        <p key={key++} className="text-sm text-muted-foreground leading-relaxed my-1"
          dangerouslySetInnerHTML={{ __html: boldify(line) }} />
      );
    }
  }
  return elements;
}

function boldify(text: string): string {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong class="text-foreground font-semibold">$1</strong>')
    .replace(/`(.+?)`/g, '<code class="bg-muted/60 px-1 py-0.5 rounded text-xs font-mono text-gold">$1</code>');
}

// ─── Analysis Card ────────────────────────────────────────────────────────────

function AnalysisCard({ analysis, onExpand }: { analysis: SavedAnalysis; onExpand: (a: SavedAnalysis) => void }) {
  const Icon = badgeIcons[analysis.badgeVariant] ?? Brain;
  return (
    <Card
      className="p-5 glass border-border/60 hover:border-gold/30 transition-colors cursor-pointer group"
      onClick={() => onExpand(analysis)}
    >
      <div className="flex items-start justify-between gap-2">
        <Badge variant="outline" className={`text-[10px] ${badgeStyles[analysis.badgeVariant]}`}>
          <Icon className="h-3 w-3 mr-1" />{analysis.badge}
        </Badge>
        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
          <Clock className="h-3 w-3" />{analysis.criadoEm}
        </span>
      </div>
      <h4 className="mt-3 font-semibold text-sm leading-snug">{analysis.titulo}</h4>
      <p className="mt-2 text-xs text-muted-foreground leading-relaxed line-clamp-3">{analysis.texto}</p>
      <div className="mt-3 flex items-center gap-1 text-[10px] text-muted-foreground group-hover:text-gold transition-colors">
        <ChevronDown className="h-3 w-3" /> Ver análise completa
      </div>
    </Card>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

function InteligenciaPage() {
  const [prompt, setPrompt] = useState("");
  const [status, setStatus] = useState<AnalysisStatus>("idle");
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [savedAnalyses, setSavedAnalyses] = useState<SavedAnalysis[]>(staticInsights);
  const [expanded, setExpanded] = useState<SavedAnalysis | null>(null);
  const [showTemplates, setShowTemplates] = useState(true);
  const abortRef = useRef<AbortController | null>(null);
  const responseRef = useRef<HTMLDivElement>(null);

  // Auto-scroll durante streaming
  useEffect(() => {
    if (status === "streaming" && responseRef.current) {
      responseRef.current.scrollTop = responseRef.current.scrollHeight;
    }
  }, [response, status]);

  const execute = async () => {
    if (!prompt.trim() || status === "streaming" || status === "loading") return;

    setStatus("loading");
    setResponse("");
    setError("");
    setShowTemplates(false);

    const ctrl = new AbortController();
    abortRef.current = ctrl;

    try {
      const res = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: ctrl.signal,
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          stream: true,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error?.message || `Erro ${res.status}`);
      }

      setStatus("streaming");
      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const data = line.slice(6).trim();
          if (data === "[DONE]") continue;
          try {
            const parsed = JSON.parse(data);
            const delta = parsed?.delta?.text ?? parsed?.delta?.type === "text_delta" ? parsed.delta.text : null;
            if (delta) setResponse((prev) => prev + delta);
          } catch {
            // ignore malformed chunks
          }
        }
      }

      setStatus("done");

      // Salvar análise automaticamente
      setResponse((finalText) => {
        const titulo = extractTitle(finalText, prompt);
        const badge = extractBadge(finalText, prompt);
        const newAnalysis: SavedAnalysis = {
          id: `ai-${Date.now()}`,
          titulo,
          badge: badge.label,
          badgeVariant: badge.variant,
          texto: finalText.slice(0, 280).replace(/[#*`]/g, "").trim() + "...",
          prompt,
          criadoEm: "agora",
        };
        setSavedAnalyses((prev) => [newAnalysis, ...prev].slice(0, 12));
        return finalText;
      });
    } catch (e: unknown) {
      if ((e as Error).name === "AbortError") {
        setStatus("done");
      } else {
        setError((e as Error).message || "Erro ao conectar com a IA.");
        setStatus("error");
      }
    }
  };

  const stop = () => {
    abortRef.current?.abort();
    setStatus("done");
  };

  const reset = () => {
    setPrompt("");
    setResponse("");
    setError("");
    setStatus("idle");
    setShowTemplates(true);
  };

  const copyResponse = () => {
    navigator.clipboard.writeText(response);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const useTemplate = (t: typeof TEMPLATES[0]) => {
    setPrompt(t.prompt);
    setShowTemplates(false);
  };

  const charCount = prompt.length;
  const isRunning = status === "loading" || status === "streaming";

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      <PageHeader
        title="Inteligência estratégica"
        subtitle="Análises geradas por IA · diagnóstico territorial, liquidez, riscos e recomendações."
        actions={
          <div className="flex items-center gap-2">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground flex items-center gap-1.5 border border-border/60 rounded-md px-2 py-1">
              <Zap className="h-3 w-3 text-gold" />
              Claude Sonnet
            </div>
            <Button
              size="sm"
              className="bg-gold text-gold-foreground hover:bg-gold/90 gap-2"
              onClick={execute}
              disabled={!prompt.trim() || isRunning}
            >
              <Sparkles className="h-4 w-4" /> Gerar análise
            </Button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* ── Prompt Master ── */}
        <div className="lg:col-span-2 space-y-4">
          <Card className="p-5 glass border-border/60">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold flex items-center gap-2 text-sm">
                <Brain className="h-4 w-4 text-gold" /> Prompt Master
              </h3>
              {(status === "done" || status === "error") && (
                <Button size="sm" variant="ghost" className="h-7 text-xs gap-1.5" onClick={reset}>
                  <RotateCcw className="h-3 w-3" /> Nova análise
                </Button>
              )}
            </div>

            <Textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="min-h-36 bg-muted/40 border-border resize-none text-sm leading-relaxed"
              placeholder="Descreva o cenário ou cole dados. Ex: Analisar absorção dos últimos 90 dias em Campo Grande considerando entrada do BRT e novos lançamentos concorrentes..."
              disabled={isRunning}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) execute();
              }}
            />

            <div className="mt-2 flex items-center justify-between">
              <span className="text-[10px] text-muted-foreground">
                {charCount > 0 ? `${charCount} caracteres · ` : ""}
                <kbd className="bg-muted/60 px-1 py-0.5 rounded text-[9px] font-mono">⌘+Enter</kbd> para executar
              </span>
              <div className="flex items-center gap-2">
                {isRunning ? (
                  <Button size="sm" variant="outline" className="gap-1.5 h-8 border-destructive/40 text-destructive" onClick={stop}>
                    <Square className="h-3 w-3" /> Parar
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="gap-1.5 h-8 bg-primary hover:bg-primary/90"
                    onClick={execute}
                    disabled={!prompt.trim()}
                  >
                    <Send className="h-3 w-3" /> Executar
                  </Button>
                )}
              </div>
            </div>
          </Card>

          {/* Templates */}
          {showTemplates && status === "idle" && (
            <Card className="p-4 glass border-border/60">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Prompts sugeridos
                </h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {TEMPLATES.map((t) => {
                  const Icon = t.icon;
                  return (
                    <button
                      key={t.label}
                      onClick={() => useTemplate(t)}
                      className="text-left p-3 rounded-lg border border-border/60 hover:border-gold/40 hover:bg-muted/30 transition-all group"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <Icon className="h-3.5 w-3.5 text-gold" />
                        <span className="text-xs font-medium">{t.label}</span>
                      </div>
                      <p className="text-[11px] text-muted-foreground line-clamp-2 leading-relaxed">
                        {t.prompt.slice(0, 100)}...
                      </p>
                    </button>
                  );
                })}
              </div>
            </Card>
          )}

          {/* Response */}
          {(status === "loading" || status === "streaming" || status === "done" || status === "error") && (
            <Card className="glass border-border/60 overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <div className={`h-2 w-2 rounded-full ${
                    status === "loading" ? "bg-gold animate-pulse" :
                    status === "streaming" ? "bg-success animate-pulse" :
                    status === "done" ? "bg-success" :
                    "bg-destructive"
                  }`} />
                  <span className="text-xs font-medium">
                    {status === "loading" ? "Processando..." :
                     status === "streaming" ? "Gerando análise..." :
                     status === "done" ? "Análise concluída" :
                     "Erro na execução"}
                  </span>
                </div>
                {status === "done" && response && (
                  <Button size="sm" variant="ghost" className="h-7 text-xs gap-1.5" onClick={copyResponse}>
                    {copied ? <CheckCheck className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
                    {copied ? "Copiado" : "Copiar"}
                  </Button>
                )}
              </div>

              {status === "loading" && (
                <div className="p-6 flex items-center gap-3">
                  <div className="flex gap-1">
                    {[0, 1, 2].map((i) => (
                      <div
                        key={i}
                        className="h-2 w-2 rounded-full bg-gold/60"
                        style={{ animation: `bounce 1s ${i * 0.15}s infinite` }}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">Consultando o Motor de Inteligência...</span>
                </div>
              )}

              {status === "error" && (
                <div className="p-5 flex items-start gap-3">
                  <AlertTriangle className="h-4 w-4 text-destructive shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-destructive">Erro na execução</p>
                    <p className="text-xs text-muted-foreground mt-1">{error}</p>
                  </div>
                </div>
              )}

              {(status === "streaming" || status === "done") && response && (
                <div
                  ref={responseRef}
                  className="p-5 max-h-[520px] overflow-y-auto space-y-0.5 scrollbar-thin"
                >
                  {renderMarkdown(response)}
                  {status === "streaming" && (
                    <span className="inline-block h-4 w-0.5 bg-gold animate-pulse ml-0.5" />
                  )}
                </div>
              )}
            </Card>
          )}
        </div>

        {/* ── Sidebar ── */}
        <div className="space-y-4">
          <Card className="p-5 glass border-border/60">
            <h3 className="font-semibold text-sm">Capacidades</h3>
            <ul className="mt-4 space-y-2.5">
              {[
                { label: "Diagnóstico territorial", icon: MapPin },
                { label: "Análise de liquidez", icon: BarChart3 },
                { label: "Mapeamento de riscos", icon: AlertTriangle },
                { label: "Cruzamento mercadológico", icon: Brain },
                { label: "Narrativas de mercado", icon: Lightbulb },
                { label: "Recomendações táticas", icon: TrendingUp },
              ].map((c) => {
                const Icon = c.icon;
                return (
                  <li key={c.label} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Icon className="h-3.5 w-3.5 text-gold shrink-0" />
                    {c.label}
                  </li>
                );
              })}
            </ul>
          </Card>

          <Card className="p-5 glass border-border/60">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm">Dicas de uso</h3>
            </div>
            <div className="space-y-3">
              {[
                { titulo: "Inclua dados numéricos", desc: "Score, absorção, VSO, ticket médio — quanto mais dados, mais precisa a análise." },
                { titulo: "Especifique o território", desc: "Nome do bairro, zona e contexto (BRT, concorrência, campanha ativa)." },
                { titulo: "Peça ações táticas", desc: "Sempre termine com 'recomende 3 ações para os próximos 90 dias'." },
              ].map((d) => (
                <div key={d.titulo} className="p-3 rounded-lg bg-muted/20 border border-border/40">
                  <p className="text-xs font-medium">{d.titulo}</p>
                  <p className="text-[11px] text-muted-foreground mt-1 leading-relaxed">{d.desc}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* ── Análises salvas ── */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-gold" />
            Análises recentes
            <Badge variant="outline" className="border-gold/40 text-gold text-[10px]">
              {savedAnalyses.length}
            </Badge>
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedAnalyses.map((a) => (
            <AnalysisCard key={a.id} analysis={a} onExpand={setExpanded} />
          ))}
        </div>
      </div>

      {/* ── Modal de análise expandida ── */}
      {expanded && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm"
          onClick={() => setExpanded(null)}
        >
          <Card
            className="glass border-border/60 w-full max-w-2xl max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between p-5 border-b border-border/60">
              <div>
                <Badge variant="outline" className={`text-[10px] mb-2 ${badgeStyles[expanded.badgeVariant]}`}>
                  {expanded.badge}
                </Badge>
                <h3 className="font-semibold">{expanded.titulo}</h3>
                <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
                  <Clock className="h-3 w-3" /> {expanded.criadoEm}
                </p>
              </div>
              <button
                onClick={() => setExpanded(null)}
                className="h-7 w-7 rounded-md hover:bg-muted/60 flex items-center justify-center text-muted-foreground"
              >
                <ChevronUp className="h-4 w-4" />
              </button>
            </div>
            <div className="p-5 overflow-y-auto flex-1 space-y-1">
              {expanded.prompt
                ? renderMarkdown(expanded.texto.replace(/\.\.\.$/, ""))
                : <p className="text-sm text-muted-foreground leading-relaxed">{expanded.texto}</p>
              }
            </div>
            {expanded.prompt && (
              <div className="px-5 py-3 border-t border-border/60">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-2">Prompt original</p>
                <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">{expanded.prompt}</p>
              </div>
            )}
          </Card>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 100% { transform: translateY(0); opacity: 0.6; }
          50% { transform: translateY(-4px); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function extractTitle(text: string, prompt: string): string {
  const firstLine = text.split("\n").find((l) => l.trim() && !l.startsWith("#"));
  if (firstLine && firstLine.length < 80) return firstLine.replace(/[*#]/g, "").trim();
  const words = prompt.split(" ").slice(0, 8).join(" ");
  return words.charAt(0).toUpperCase() + words.slice(1);
}

function extractBadge(text: string, prompt: string): { label: string; variant: SavedAnalysis["badgeVariant"] } {
  const lower = (text + prompt).toLowerCase();
  if (/risco|saturação|queda|crise|perigo/.test(lower)) return { label: "Risco", variant: "risco" };
  if (/oportunidade|janela|crescimento|potencial/.test(lower)) return { label: "Oportunidade", variant: "oportunidade" };
  if (/tendência|tendencia|projeção|perspectiva/.test(lower)) return { label: "Tendência", variant: "tendencia" };
  return { label: "Diagnóstico", variant: "diagnostico" };
}
