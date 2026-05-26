import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { ArrowRight, Activity, MapPin, Brain, BarChart3 } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Landing,
});

function Landing() {
  const { user, loading } = useAuth();

  if (!loading && user) return <Navigate to="/dashboard" replace />;

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />
      <div className="absolute inset-0 bg-[var(--gradient-radial)] pointer-events-none" />

      <header className="relative z-10 flex items-center justify-between px-6 lg:px-12 py-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-md bg-[var(--gradient-petrol)] flex items-center justify-center shadow-[var(--shadow-glow)]">
            <Activity className="h-4 w-4 text-foreground" />
          </div>
          <span className="font-semibold tracking-tight">Motor de Inteligência</span>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/login">
            <Button variant="ghost" size="sm">Entrar</Button>
          </Link>
          <Link to="/signup">
            <Button size="sm" className="bg-gold text-gold-foreground hover:bg-gold/90">
              Criar conta
            </Button>
          </Link>
        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-6 lg:px-12 pt-16 pb-24">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full glass px-3 py-1 text-xs text-muted-foreground">
            <span className="h-1.5 w-1.5 rounded-full bg-gold animate-pulse" />
            Inteligência territorial · Mercado imobiliário RJ
          </span>
          <h1 className="mt-6 text-5xl lg:text-7xl font-bold tracking-tight leading-[1.05]">
            O motor analítico do{" "}
            <span className="text-gradient-gold">mercado imobiliário</span> do Rio.
          </h1>
          <p className="mt-6 text-lg text-muted-foreground max-w-2xl">
            Centralize análises territoriais, comportamento de leads, absorção, scoring
            estratégico e narrativas de mercado em uma única plataforma enterprise.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link to="/signup">
              <Button size="lg" className="bg-primary hover:bg-primary/90 shadow-[var(--shadow-glow)]">
                Começar agora <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/login">
              <Button size="lg" variant="outline">
                Acessar plataforma
              </Button>
            </Link>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: MapPin, title: "Inteligência territorial", desc: "Heatmaps, ranking de regiões e leitura urbana em tempo real." },
            { icon: BarChart3, title: "Absorção & scoring", desc: "Score de liquidez, valorização e risco por empreendimento." },
            { icon: Brain, title: "IA estratégica", desc: "Narrativas de mercado e cruzamentos automatizados." },
          ].map((f) => (
            <div key={f.title} className="glass rounded-2xl p-6 hover:border-gold/30 transition-colors">
              <f.icon className="h-6 w-6 text-gold" />
              <h3 className="mt-4 font-semibold">{f.title}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
