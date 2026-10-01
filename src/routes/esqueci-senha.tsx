import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Activity, Loader2, MailCheck } from "lucide-react";

export const Route = createFileRoute("/esqueci-senha")({
  head: () => ({
    meta: [
      { title: "Recuperar senha — Motor de Inteligência" },
      {
        name: "description",
        content: "Solicite um link de recuperação de senha da sua conta.",
      },
      { property: "og:title", content: "Recuperar senha — Motor de Inteligência" },
    ],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) return toast.error(error.message);
    setSent(true);
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

        {sent ? (
          <div className="text-center py-4">
            <MailCheck className="h-12 w-12 mx-auto text-gold" />
            <h1 className="mt-4 text-2xl font-semibold">Verifique seu e-mail</h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Enviamos um link de recuperação para <span className="text-foreground">{email}</span>.
              Clique no link para definir uma nova senha.
            </p>
            <Link to="/login" className="mt-6 inline-block text-sm text-gold hover:underline">
              Voltar para o login
            </Link>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-semibold">Recuperar senha</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Informe seu e-mail para receber o link de redefinição.
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Enviar link de recuperação
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Lembrou a senha?{" "}
              <Link to="/login" className="text-gold hover:underline">
                Entrar
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
