import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/hooks/use-auth";
import { MasterAuthProvider, useMasterAuth } from "@/hooks/use-master-auth";
import { MasterLogin } from "@/components/master-login";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-gradient-gold">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Página não encontrada</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          O recurso solicitado não existe ou foi movido.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Voltar ao início
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold tracking-tight text-foreground">
          Falha ao carregar a página
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Algo deu errado. Tente novamente ou volte ao início.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
          >
            Tentar novamente
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent"
          >
            Início
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Motor de Inteligência — Inteligência territorial imobiliária" },
      {
        name: "description",
        content:
          "Plataforma SaaS de inteligência territorial, comportamental e mercadológica para o mercado imobiliário do Rio de Janeiro.",
      },
      { property: "og:title", content: "Motor de Inteligência — Inteligência territorial imobiliária" },
      {
        property: "og:description",
        content:
          "Centralize análises territoriais, leads, empreendimentos e scoring estratégico em uma plataforma enterprise.",
      },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Motor de Inteligência" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Motor de Inteligência — Inteligência territorial imobiliária" },
      { name: "description", content: "Smart Real Estate Insights provides AI-driven market analysis for real estate." },
      { property: "og:description", content: "Smart Real Estate Insights provides AI-driven market analysis for real estate." },
      { name: "twitter:description", content: "Smart Real Estate Insights provides AI-driven market analysis for real estate." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/c2b3705d-f6ef-4faa-9824-aacee6e33846" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/attachments/og-images/c2b3705d-f6ef-4faa-9824-aacee6e33846" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          name: "Motor de Inteligência",
          url: "https://intelidata-iacapital.lovable.app",
          description:
            "Plataforma SaaS de inteligência territorial, comportamental e mercadológica para o mercado imobiliário do Rio de Janeiro.",
        }),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Motor de Inteligência",
          url: "https://intelidata-iacapital.lovable.app",
        }),
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function AppGate() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <MasterAuthProvider>
        <AppGate />
        <Toaster richColors theme="dark" position="top-right" />
      </MasterAuthProvider>
    </QueryClientProvider>
  );
}
