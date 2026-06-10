import { Activity, MapPin, Brain, BarChart3, ArrowRight, Sparkles, Shield, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MotorDeInteligencia() {
  return (
    <section className="relative w-full overflow-hidden py-20 md:py-28">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />
      <div className="absolute inset-0 bg-[var(--gradient-radial)] pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-6xl px-6 lg:px-12">
        {/* Hero header */}
        <div className="flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
            Inteligência territorial · Mercado imobiliário RJ
          </span>

          <h1 className="mt-6 text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
            O motor analítico do{" "}
            <span className="text-gradient-gold">mercado imobiliário</span>{" "}
            do Rio.
          </h1>

          <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
            Centralize análises territoriais, comportamento de leads, absorção,
            scoring estratégico e narrativas de mercado em uma única plataforma
            enterprise.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              className="bg-primary hover:bg-primary/90 shadow-[var(--shadow-glow)]"
            >
              Começar agora <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline">
              Ver demonstração
            </Button>
          </div>
        </div>

        {/* Feature cards */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: MapPin,
              title: "Inteligência territorial",
              desc: "Heatmaps, ranking de regiões e leitura urbana em tempo real.",
            },
            {
              icon: BarChart3,
              title: "Absorção & scoring",
              desc: "Score de liquidez, valorização e risco por empreendimento.",
            },
            {
              icon: Brain,
              title: "IA estratégica",
              desc: "Narrativas de mercado e cruzamentos automatizados.",
            },
            {
              icon: Sparkles,
              title: "Pipeline de leads",
              desc: "Importação em lote, deduplicação e scoring automático.",
            },
          ].map((f) => (
            <div
              key={f.title}
              className="glass rounded-2xl p-6 hover:border-gold/30 transition-colors text-center"
            >
              <div className="mx-auto h-10 w-10 rounded-lg bg-gold/10 flex items-center justify-center">
                <f.icon className="h-5 w-5 text-gold" />
              </div>
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>

        {/* Stats / trust bar */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: TrendingUp,
              value: "+340%",
              label: "Acurácia em projeções",
            },
            {
              icon: Shield,
              value: "100%",
              label: "Dados validados RJ",
            },
            {
              icon: Activity,
              value: "24/7",
              label: "Monitoramento ativo",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-4 rounded-2xl border border-border/50 bg-background/50 p-6"
            >
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <s.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gradient-gold">
                  {s.value}
                </div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
