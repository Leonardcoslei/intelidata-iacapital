import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// ============================================================
// TIPOS baseados no schema real do banco
// ============================================================

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
  criado_em: string;
  atualizado_em: string;
  // campos da view
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
  tipologias: unknown;
  data_lancamento: string | null;
  data_entrega: string | null;
  status: string | null;
  tipo: string | null;
  obs: string | null;
  ativo: boolean;
  criado_em: string;
  atualizado_em: string;
  // campos da view
  dias_para_entrega?: number;
  absorcao_calculada?: number;
}

export interface Lead {
  id: string;
  nome: string;
  telefone: string | null;
  email: string | null;
  bairro_id: string | null;
  bairro_nome: string | null;
  interesse: string | null;
  tipologia_int: string | null;
  faixa_renda: number | null;
  score: number | null;
  temperatura: string | null;
  status: string | null;
  canal_origem: string | null;
  empreendimento_id: string | null;
  obs: string | null;
  ativo: boolean;
  criado_em: string;
  atualizado_em: string;
  // campos da view
  bairro_label?: string;
  bairro_zona?: string;
  empreendimento_label?: string;
  dias_para_entrega?: number;
}

// ============================================================
// HOOK: Bairros
// ============================================================
export function useBairros() {
  const [bairros, setBairros] = useState<Bairro[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .schema("motor" as never)
      .from("v_ranking_territorial" as never)
      .select("*")
      .order("score", { ascending: false });

    if (error) {
      // fallback para tabela direta se view não existir
      const { data: d2, error: e2 } = await supabase
        .schema("motor" as never)
        .from("bairros" as never)
        .select("*")
        .eq("ativo", true)
        .is("deleted_at", null)
        .order("score", { ascending: false });
      if (e2) { toast.error("Erro ao carregar bairros."); }
      else { setBairros((d2 as Bairro[]) || []); }
    } else {
      setBairros((data as Bairro[]) || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const deletar = async (id: string) => {
    const { error } = await supabase
      .schema("motor" as never)
      .from("bairros" as never)
      .update({ deleted_at: new Date().toISOString(), ativo: false } as never)
      .eq("id", id);
    if (error) { toast.error("Erro ao excluir bairro."); return false; }
    toast.success("Bairro excluído.");
    await fetch();
    return true;
  };

  const adicionar = async (bairro: Partial<Bairro>) => {
    const { error } = await supabase
      .schema("motor" as never)
      .from("bairros" as never)
      .insert(bairro as never);
    if (error) { toast.error("Erro ao adicionar bairro: " + error.message); return false; }
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
      .schema("motor" as never)
      .from("v_empreendimentos" as never)
      .select("*")
      .order("nome");

    if (error) {
      const { data: d2, error: e2 } = await supabase
        .schema("motor" as never)
        .from("empreendimentos" as never)
        .select("*")
        .eq("ativo", true)
        .is("deleted_at", null)
        .order("nome");
      if (e2) { toast.error("Erro ao carregar empreendimentos."); }
      else { setEmpreendimentos((d2 as Empreendimento[]) || []); }
    } else {
      setEmpreendimentos((data as Empreendimento[]) || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const deletar = async (id: string) => {
    const { error } = await supabase
      .schema("motor" as never)
      .from("empreendimentos" as never)
      .update({ deleted_at: new Date().toISOString(), ativo: false } as never)
      .eq("id", id);
    if (error) { toast.error("Erro ao excluir empreendimento."); return false; }
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
      .schema("motor" as never)
      .from("v_leads_ativos" as never)
      .select("*")
      .order("score", { ascending: false });

    if (error) {
      const { data: d2, error: e2 } = await supabase
        .schema("motor" as never)
        .from("leads" as never)
        .select("*")
        .eq("ativo", true)
        .is("deleted_at", null)
        .order("score", { ascending: false });
      if (e2) { toast.error("Erro ao carregar leads."); }
      else { setLeads((d2 as Lead[]) || []); }
    } else {
      setLeads((data as Lead[]) || []);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const deletar = async (id: string) => {
    const { error } = await supabase
      .schema("motor" as never)
      .from("leads" as never)
      .update({ deleted_at: new Date().toISOString(), ativo: false } as never)
      .eq("id", id);
    if (error) { toast.error("Erro ao excluir lead."); return false; }
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
      const [{ count: leads }, { count: emp }, { count: bairros }, { data: stats }] =
        await Promise.all([
          supabase.schema("motor" as never).from("leads" as never).select("*", { count: "exact", head: true }).eq("ativo", true).is("deleted_at", null),
          supabase.schema("motor" as never).from("empreendimentos" as never).select("*", { count: "exact", head: true }).eq("ativo", true).is("deleted_at", null),
          supabase.schema("motor" as never).from("bairros" as never).select("*", { count: "exact", head: true }).eq("ativo", true).is("deleted_at", null),
          supabase.schema("motor" as never).from("empreendimentos" as never).select("absorcao_pct,vso_pct,ticket_medio").eq("ativo", true).is("deleted_at", null),
        ]);

      const s = (stats as { absorcao_pct: number; vso_pct: number; ticket_medio: number }[]) || [];
      const avg = (key: "absorcao_pct" | "vso_pct" | "ticket_medio") =>
        s.length ? s.reduce((a, r) => a + (Number(r[key]) || 0), 0) / s.length : 0;

      setKpis({
        totalLeads: leads || 0,
        totalEmpreendimentos: emp || 0,
        totalBairros: bairros || 0,
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
