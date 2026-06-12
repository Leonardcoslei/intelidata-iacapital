import { useState } from "react";
import { useRouter } from "@tanstack/react-router";
import { Activity, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMasterAuth } from "@/hooks/use-master-auth";
import { toast } from "sonner";

export function MasterLogin() {
  const { login } = useMasterAuth();
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [shaking, setShaking] = useState(false);

  const handleLogin = () => {
    const ok = login(password);
    if (ok) {
      router.navigate({ to: "/dashboard" });
    } else {
      toast.error("Senha incorreta.");
      setShaking(true);
      setTimeout(() => setShaking(false), 500);
      setPassword("");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--cor-fundo, #0f1117)" }}>
      {/* Grid background */}
      <div className="absolute inset-0 opacity-20 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(30,111,168,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(30,111,168,0.15) 1px, transparent 1px)",
          backgroundSize: "40px 40px"
        }}
      />
      {/* Radial glow */}
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(30,111,168,0.08) 0%, transparent 70%)" }}
      />

      <div
        className={`relative w-full max-w-sm rounded-2xl p-8 transition-all ${shaking ? "animate-pulse" : ""}`}
        style={{
          background: "rgba(26,31,46,0.95)",
          border: "1px solid rgba(42,48,64,0.8)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.5), 0 0 0 1px rgba(30,111,168,0.1)"
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #1e6fa8, #164f78)" }}>
            <Activity className="h-5 w-5 text-white" />
          </div>
          <div>
            <p className="text-xs font-medium" style={{ color: "#c9a84c" }}>MOTOR DE INTELIGÊNCIA</p>
            <p className="text-xs" style={{ color: "#94a3b8" }}>Leonardo Leite Corretor</p>
          </div>
        </div>

        {/* Lock icon */}
        <div className="flex justify-center mb-6">
          <div className="h-14 w-14 rounded-full flex items-center justify-center"
            style={{ background: "rgba(30,111,168,0.12)", border: "1px solid rgba(30,111,168,0.25)" }}>
            <Lock className="h-6 w-6" style={{ color: "#1e6fa8" }} />
          </div>
        </div>

        <h1 className="text-xl font-semibold text-center mb-1" style={{ color: "#e2e8f0" }}>
          Acesso Restrito
        </h1>
        <p className="text-sm text-center mb-6" style={{ color: "#94a3b8" }}>
          Plataforma privada · Leonardo Leite Corretor
        </p>

        {/* Input */}
        <div className="relative mb-4">
          <Input
            type={show ? "text" : "password"}
            placeholder="Senha mestre"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pr-10 text-center tracking-widest text-lg"
            style={{
              background: "rgba(15,17,23,0.8)",
              border: "1px solid rgba(42,48,64,0.8)",
              color: "#e2e8f0",
              letterSpacing: "0.2em"
            }}
            autoFocus
          />
          <button
            type="button"
            onClick={() => setShow(!show)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
            style={{ color: "#94a3b8" }}
          >
            {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        <Button
          onClick={handleLogin}
          className="w-full font-semibold"
          style={{ background: "linear-gradient(135deg, #1e6fa8, #164f78)", color: "white" }}
        >
          Entrar
        </Button>

        <p className="text-center text-xs mt-4" style={{ color: "#4a5568" }}>
          Acesso monitorado · Uso exclusivo
        </p>
      </div>
    </div>
  );
}
