import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Activity, Loader2 } from "lucide-react";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Definir nova senha — Motor de Inteligência" },
      { name: "description", content: "Defina uma nova senha para sua conta." },
      { property: "og:title", content: "Definir nova senha — Motor de Inteligência" },
    ],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [recovery, setRecovery] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Recovery links arrive with type=recovery in the URL hash
    const hash = window.location.hash;
    if (hash.includes("type=recovery")) {
      setRecovery(true);
      setChecking(false);
      return;
    }
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setRecovery(true);
        setChecking(false);
      }
    });
    // If already signed in via recovery session, allow reset
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setRecovery(true);
      setChecking(false);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirm) return toast.error("As senhas não coincidem.");
    if (password.length < 8) return toast.error("A senha deve ter pelo menos 8 caracteres.");
    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) return toast.error(error.message);
    toast.success("Senha atualizada com sucesso.");
    navigate({ to: "/dashboard", replace: true });
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-grid opacity-30 pointer-events-none" />
      <div className="absolute inset-0 bg-[var(--gradient-radial)] pointer-events-none" />

      <div className="relative w-full max-w-md glass rounded-2xl p-8 shadow-[var(--shadow-elegant)]">
        <Link to="/" className="flex items-center gap-2 mb-8">
          <div className="h-8 w-8 rounded-md bg-[var(--gradient-petrol)] flex items-center justify-center">
            <Activity className="h-4 w-4" />
          </div>
          <span className="font-semibold">Motor de Inteligência</span>
        </Link>

        {checking ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : !recovery ? (
          <div className="text-center py-4">
            <h1 className="text-2xl font-semibold">Link inválido ou expirado</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Solicite um novo link de recuperação de senha.
            </p>
            <Link to="/esqueci-senha" className="mt-6 inline-block text-sm text-gold hover:underline">
              Solicitar novo link
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-semibold">Definir nova senha</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Escolha uma nova senha para sua conta.
            </p>

            <form onSubmit={handleReset} className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Nova senha</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  minLength={8}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm">Confirmar senha</Label>
                <Input
                  id="confirm"
                  type="password"
                  required
                  minLength={8}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full bg-gold text-gold-foreground hover:bg-gold/90" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Atualizar senha
              </Button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
