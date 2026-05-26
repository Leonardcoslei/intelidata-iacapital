import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const Route = createFileRoute("/_authenticated/configuracoes")({
  component: ConfiguracoesPage,
});

function ConfiguracoesPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState("");
  const [roleTitle, setRoleTitle] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!user) return;
    supabase
      .from("profiles")
      .select("display_name, role_title")
      .eq("id", user.id)
      .maybeSingle()
      .then(({ data }) => {
        setDisplayName(data?.display_name ?? "");
        setRoleTitle(data?.role_title ?? "");
      });
  }, [user]);

  const save = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: user.id, display_name: displayName, role_title: roleTitle, updated_at: new Date().toISOString() });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Perfil atualizado.");
  };

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <PageHeader title="Configurações" subtitle="Preferências da conta e da plataforma." />

      <Card className="p-6 glass border-border/60">
        <h3 className="font-semibold">Perfil</h3>
        <p className="text-xs text-muted-foreground mt-1">Como você aparece dentro do Motor de Inteligência.</p>
        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Nome</Label>
            <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Cargo</Label>
            <Input value={roleTitle} onChange={(e) => setRoleTitle(e.target.value)} placeholder="Ex.: Analista de Mercado" />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label>Email</Label>
            <Input value={user?.email ?? ""} disabled />
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <Button onClick={save} disabled={saving} className="bg-primary hover:bg-primary/90">
            {saving ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </Card>

      <Card className="mt-4 p-6 glass border-border/60">
        <h3 className="font-semibold">Notificações</h3>
        <div className="mt-5 space-y-4">
          {[
            { l: "Alertas estratégicos", d: "Receber por email quando surgir risco ou oportunidade." },
            { l: "Relatórios semanais", d: "Resumo de absorção, leads e ranking territorial." },
            { l: "Atualizações de empreendimentos", d: "Mudanças de status, absorção e estoque." },
          ].map((n, i) => (
            <div key={n.l} className="flex items-center justify-between gap-4">
              <div>
                <div className="text-sm font-medium">{n.l}</div>
                <div className="text-xs text-muted-foreground">{n.d}</div>
              </div>
              <Switch defaultChecked={i < 2} />
            </div>
          ))}
        </div>
      </Card>

      <Card className="mt-4 p-6 glass border-destructive/30">
        <h3 className="font-semibold text-destructive">Sessão</h3>
        <p className="text-xs text-muted-foreground mt-1">Encerrar sua sessão atual.</p>
        <Button
          variant="outline"
          className="mt-4 border-destructive/40 text-destructive hover:bg-destructive/10"
          onClick={async () => {
            await signOut();
            navigate({ to: "/login" });
          }}
        >
          Sair da plataforma
        </Button>
      </Card>
    </div>
  );
}
