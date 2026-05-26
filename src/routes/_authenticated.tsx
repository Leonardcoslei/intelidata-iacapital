import { createFileRoute, Outlet, Navigate } from "@tanstack/react-router";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useAuth } from "@/hooks/use-auth";
import { Loader2, Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/_authenticated")({
  component: AuthenticatedLayout,
});

function AuthenticatedLayout() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 flex items-center gap-3 border-b border-border px-4 lg:px-6 sticky top-0 z-30 backdrop-blur bg-background/70">
            <SidebarTrigger />
            <div className="relative max-w-sm flex-1 hidden md:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Buscar bairro, empreendimento, lead..." className="pl-8 h-9 bg-muted/50 border-border" />
            </div>
            <div className="ml-auto flex items-center gap-2">
              <button className="relative h-9 w-9 inline-flex items-center justify-center rounded-md hover:bg-muted transition-colors">
                <Bell className="h-4 w-4" />
                <span className="absolute top-2 right-2 h-1.5 w-1.5 rounded-full bg-gold" />
              </button>
            </div>
          </header>
          <main className="flex-1 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
