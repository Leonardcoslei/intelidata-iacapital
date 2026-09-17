import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface Bairro {
  id: string;
  nome: string;
  zona: string;
  score: number;
  leads_pot: number;
  renda_media: number | null;
  mcmv_faixa: string | null;
  expansao: string | null;
  pressao_inst: string | null;
  liquidez: string | null;
  obs: string | null;
  ativo: boolean;
  total_leads?: number;
  total_empreendimentos?: number;
  absorcao_media?: number;
  vso_medio?: number;
}

export interface Empreendimento {
  id: string;
  nome: string;
  construtora: string;
  bairro_id: string | null;
  bairro_nome: string | null;
  zona: string | null;
  mcmv_faixa: string | null;
  ticket_medio: number | null;
  absorcao_pct: number | null;
  vso_pct: number | null;
  total_unidades: number | null;
  unidades_disp: number | null;
  data_lancamento: string | null;
  data_entrega: string | null;
  status: string | null;
  tipo: string | null;
  obs: string | null;
  ativo: boolean;
}

export interface Lead {
  id: string;
  nome: string;
  telefone: string | null;
  email: string | null;
  bairro_id: string | null;
  bairro_nome: string | null;
  interesse: string | null;
  score: number | null;
  temperatura: string | null;
  status: string | null;
  ativo: boolean;
}

// ============================================================
// HOOK: Bairros (via view pública motor_ranking)
// ============================================================
export function useBairros() {
  const [bairros, setBairros] = useState<Bairro[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("motor_ranking" as never)
      .select("*")
      .order("score" as never, { ascending: false });

    if (error) {
      toast.error("Erro ao carregar bairros.");
    } else {
      setBairros((data as unknown as Bairro[]) || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const deletar = async (id: string) => {
    const { error } = await supabase
      .from("motor_bairros" as never)
      .update({ deleted_at: new Date().toISOString(), ativo: false } as never)
      .eq("id" as never, id);
    if (error) { toast.error("Erro ao excluir bairro."); return false; }
    toast.success("Bairro excluído.");
    await fetch();
    return true;
  };

  const adicionar = async (bairro: Partial<Bairro>) => {
    const { error } = await supabase
      .from("motor_bairros" as never)
      .insert(bairro as never);
    if (error) { toast.error("Erro: " + error.message); return false; }
    toast.success("Bairro adicionado.");
    await fetch();
    return true;
  };

  return { bairros, loading, refetch: fetch, deletar, adicionar };
}

// ============================================================
// HOOK: Empreendimentos
// ============================================================
export function useEmpreendimentos() {
  const [empreendimentos, setEmpreendimentos] = useState<Empreendimento[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("motor_empreendimentos" as never)
      .select("*")
      .order("nome" as never);

    if (error) {
      toast.error("Erro ao carregar empreendimentos.");
    } else {
      setEmpreendimentos((data as unknown as Empreendimento[]) || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const deletar = async (id: string) => {
    const { error } = await supabase
      .from("motor_empreendimentos" as never)
      .update({ deleted_at: new Date().toISOString(), ativo: false } as never)
      .eq("id" as never, id);
    if (error) { toast.error("Erro ao excluir."); return false; }
    toast.success("Empreendimento excluído.");
    await fetch();
    return true;
  };

  return { empreendimentos, loading, refetch: fetch, deletar };
}

// ============================================================
// HOOK: Leads
// ============================================================
export function useLeads() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("motor_leads" as never)
      .select("*")
      .order("score" as never, { ascending: false });

    if (error) {
      toast.error("Erro ao carregar leads.");
    } else {
      setLeads((data as unknown as Lead[]) || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const deletar = async (id: string) => {
    const { error } = await supabase
      .from("motor_leads" as never)
      .update({ deleted_at: new Date().toISOString(), ativo: false } as never)
      .eq("id" as never, id);
    if (error) { toast.error("Erro ao excluir."); return false; }
    toast.success("Lead excluído.");
    await fetch();
    return true;
  };

  return { leads, loading, refetch: fetch, deletar };
}

// ============================================================
// HOOK: KPIs Dashboard
// ============================================================
export function useKpisDashboard() {
  const [kpis, setKpis] = useState({
    totalLeads: 0,
    totalEmpreendimentos: 0,
    totalBairros: 0,
    absorcaoMedia: 0,
    vsoMedio: 0,
    ticketMedio: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [r1, r2, r3, r4] = await Promise.all([
        supabase.from("motor_leads" as never).select("*", { count: "exact", head: true } as never),
        supabase.from("motor_empreendimentos" as never).select("*", { count: "exact", head: true } as never),
        supabase.from("motor_bairros" as never).select("*", { count: "exact", head: true } as never),
        supabase.from("motor_empreendimentos" as never).select("absorcao_pct,vso_pct,ticket_medio" as never),
      ]);

      const stats = (r4.data as unknown as { absorcao_pct: number; vso_pct: number; ticket_medio: number }[]) || [];
      const avg = (key: "absorcao_pct" | "vso_pct" | "ticket_medio") =>
        stats.length ? stats.reduce((a, r) => a + (Number(r[key]) || 0), 0) / stats.length : 0;

      setKpis({
        totalLeads: (r1 as unknown as { count: number }).count || 0,
        totalEmpreendimentos: (r2 as unknown as { count: number }).count || 0,
        totalBairros: (r3 as unknown as { count: number }).count || 0,
        absorcaoMedia: Number(avg("absorcao_pct").toFixed(1)),
        vsoMedio: Number(avg("vso_pct").toFixed(1)),
        ticketMedio: Number(avg("ticket_medio").toFixed(0)),
      });
      setLoading(false);
    }
    load();
  }, []);

  return { kpis, loading };
}
