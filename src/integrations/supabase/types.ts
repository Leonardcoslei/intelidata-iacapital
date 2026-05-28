export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      absorcao_imobiliaria: {
        Row: {
          created_at: string
          deleted_at: string | null
          empreendimento_id: string
          id: string
          mes_referencia: string
          observacoes: string | null
          ticket_medio: number | null
          unidades_disponiveis: number | null
          unidades_vendidas: number
          updated_at: string
          vso: number | null
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          empreendimento_id: string
          id?: string
          mes_referencia: string
          observacoes?: string | null
          ticket_medio?: number | null
          unidades_disponiveis?: number | null
          unidades_vendidas?: number
          updated_at?: string
          vso?: number | null
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          empreendimento_id?: string
          id?: string
          mes_referencia?: string
          observacoes?: string | null
          ticket_medio?: number | null
          unidades_disponiveis?: number | null
          unidades_vendidas?: number
          updated_at?: string
          vso?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "absorcao_imobiliaria_empreendimento_id_fkey"
            columns: ["empreendimento_id"]
            isOneToOne: false
            referencedRelation: "empreendimentos"
            referencedColumns: ["id"]
          },
        ]
      }
      alertas_estrategicos: {
        Row: {
          bairro_id: string | null
          created_at: string
          deleted_at: string | null
          empreendimento_id: string | null
          id: string
          lead_id: string | null
          lido: boolean
          mensagem: string
          observacoes: string | null
          severidade: string
          tipo: string
          titulo: string
          updated_at: string
        }
        Insert: {
          bairro_id?: string | null
          created_at?: string
          deleted_at?: string | null
          empreendimento_id?: string | null
          id?: string
          lead_id?: string | null
          lido?: boolean
          mensagem: string
          observacoes?: string | null
          severidade: string
          tipo: string
          titulo: string
          updated_at?: string
        }
        Update: {
          bairro_id?: string | null
          created_at?: string
          deleted_at?: string | null
          empreendimento_id?: string | null
          id?: string
          lead_id?: string | null
          lido?: boolean
          mensagem?: string
          observacoes?: string | null
          severidade?: string
          tipo?: string
          titulo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "alertas_estrategicos_bairro_id_fkey"
            columns: ["bairro_id"]
            isOneToOne: false
            referencedRelation: "bairros"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alertas_estrategicos_empreendimento_id_fkey"
            columns: ["empreendimento_id"]
            isOneToOne: false
            referencedRelation: "empreendimentos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "alertas_estrategicos_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      bairros: {
        Row: {
          created_at: string
          deleted_at: string | null
          id: string
          idh: number | null
          latitude: number | null
          longitude: number | null
          nome: string
          observacoes: string | null
          populacao: number | null
          regiao_id: string | null
          renda_media: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          idh?: number | null
          latitude?: number | null
          longitude?: number | null
          nome: string
          observacoes?: string | null
          populacao?: number | null
          regiao_id?: string | null
          renda_media?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          id?: string
          idh?: number | null
          latitude?: number | null
          longitude?: number | null
          nome?: string
          observacoes?: string | null
          populacao?: number | null
          regiao_id?: string | null
          renda_media?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "bairros_regiao_id_fkey"
            columns: ["regiao_id"]
            isOneToOne: false
            referencedRelation: "regioes"
            referencedColumns: ["id"]
          },
        ]
      }
      concorrencia: {
        Row: {
          bairro_id: string | null
          construtora_id: string | null
          created_at: string
          deleted_at: string | null
          empreendimento_id: string | null
          id: string
          observacoes: string | null
          posicao_ranking: number | null
          preco_m2: number | null
          preco_medio: number | null
          referencia: string
          share_mercado: number | null
          updated_at: string
        }
        Insert: {
          bairro_id?: string | null
          construtora_id?: string | null
          created_at?: string
          deleted_at?: string | null
          empreendimento_id?: string | null
          id?: string
          observacoes?: string | null
          posicao_ranking?: number | null
          preco_m2?: number | null
          preco_medio?: number | null
          referencia?: string
          share_mercado?: number | null
          updated_at?: string
        }
        Update: {
          bairro_id?: string | null
          construtora_id?: string | null
          created_at?: string
          deleted_at?: string | null
          empreendimento_id?: string | null
          id?: string
          observacoes?: string | null
          posicao_ranking?: number | null
          preco_m2?: number | null
          preco_medio?: number | null
          referencia?: string
          share_mercado?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "concorrencia_bairro_id_fkey"
            columns: ["bairro_id"]
            isOneToOne: false
            referencedRelation: "bairros"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "concorrencia_construtora_id_fkey"
            columns: ["construtora_id"]
            isOneToOne: false
            referencedRelation: "construtoras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "concorrencia_empreendimento_id_fkey"
            columns: ["empreendimento_id"]
            isOneToOne: false
            referencedRelation: "empreendimentos"
            referencedColumns: ["id"]
          },
        ]
      }
      construtoras: {
        Row: {
          cnpj: string | null
          created_at: string
          deleted_at: string | null
          id: string
          logo_url: string | null
          nome: string
          observacoes: string | null
          site: string | null
          updated_at: string
        }
        Insert: {
          cnpj?: string | null
          created_at?: string
          deleted_at?: string | null
          id?: string
          logo_url?: string | null
          nome: string
          observacoes?: string | null
          site?: string | null
          updated_at?: string
        }
        Update: {
          cnpj?: string | null
          created_at?: string
          deleted_at?: string | null
          id?: string
          logo_url?: string | null
          nome?: string
          observacoes?: string | null
          site?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      empreendimentos: {
        Row: {
          bairro_id: string | null
          construtora_id: string | null
          created_at: string
          data_entrega: string | null
          data_lancamento: string | null
          deleted_at: string | null
          endereco: string | null
          id: string
          nome: string
          observacoes: string | null
          status: string | null
          ticket_medio: number | null
          tipologia_id: string | null
          unidades_total: number | null
          unidades_vendidas: number | null
          updated_at: string
          vgv: number | null
        }
        Insert: {
          bairro_id?: string | null
          construtora_id?: string | null
          created_at?: string
          data_entrega?: string | null
          data_lancamento?: string | null
          deleted_at?: string | null
          endereco?: string | null
          id?: string
          nome: string
          observacoes?: string | null
          status?: string | null
          ticket_medio?: number | null
          tipologia_id?: string | null
          unidades_total?: number | null
          unidades_vendidas?: number | null
          updated_at?: string
          vgv?: number | null
        }
        Update: {
          bairro_id?: string | null
          construtora_id?: string | null
          created_at?: string
          data_entrega?: string | null
          data_lancamento?: string | null
          deleted_at?: string | null
          endereco?: string | null
          id?: string
          nome?: string
          observacoes?: string | null
          status?: string | null
          ticket_medio?: number | null
          tipologia_id?: string | null
          unidades_total?: number | null
          unidades_vendidas?: number | null
          updated_at?: string
          vgv?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "empreendimentos_bairro_id_fkey"
            columns: ["bairro_id"]
            isOneToOne: false
            referencedRelation: "bairros"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empreendimentos_construtora_id_fkey"
            columns: ["construtora_id"]
            isOneToOne: false
            referencedRelation: "construtoras"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "empreendimentos_tipologia_id_fkey"
            columns: ["tipologia_id"]
            isOneToOne: false
            referencedRelation: "tipologias"
            referencedColumns: ["id"]
          },
        ]
      }
      historico_alteracoes: {
        Row: {
          acao: string
          created_at: string
          dados_anteriores: Json | null
          dados_novos: Json | null
          id: string
          observacoes: string | null
          registro_id: string
          tabela: string
          usuario_id: string | null
        }
        Insert: {
          acao: string
          created_at?: string
          dados_anteriores?: Json | null
          dados_novos?: Json | null
          id?: string
          observacoes?: string | null
          registro_id: string
          tabela: string
          usuario_id?: string | null
        }
        Update: {
          acao?: string
          created_at?: string
          dados_anteriores?: Json | null
          dados_novos?: Json | null
          id?: string
          observacoes?: string | null
          registro_id?: string
          tabela?: string
          usuario_id?: string | null
        }
        Relationships: []
      }
      leads: {
        Row: {
          bairro_id: string | null
          created_at: string
          deleted_at: string | null
          email: string | null
          empreendimento_id: string | null
          estagio: string | null
          id: string
          nome: string
          observacoes: string | null
          origem: string | null
          renda_estimada: number | null
          telefone: string | null
          updated_at: string
        }
        Insert: {
          bairro_id?: string | null
          created_at?: string
          deleted_at?: string | null
          email?: string | null
          empreendimento_id?: string | null
          estagio?: string | null
          id?: string
          nome: string
          observacoes?: string | null
          origem?: string | null
          renda_estimada?: number | null
          telefone?: string | null
          updated_at?: string
        }
        Update: {
          bairro_id?: string | null
          created_at?: string
          deleted_at?: string | null
          email?: string | null
          empreendimento_id?: string | null
          estagio?: string | null
          id?: string
          nome?: string
          observacoes?: string | null
          origem?: string | null
          renda_estimada?: number | null
          telefone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "leads_bairro_id_fkey"
            columns: ["bairro_id"]
            isOneToOne: false
            referencedRelation: "bairros"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leads_empreendimento_id_fkey"
            columns: ["empreendimento_id"]
            isOneToOne: false
            referencedRelation: "empreendimentos"
            referencedColumns: ["id"]
          },
        ]
      }
      narrativas_mercado: {
        Row: {
          bairro_id: string | null
          created_at: string
          deleted_at: string | null
          fontes: Json | null
          id: string
          narrativa: string
          observacoes: string | null
          publicado_em: string | null
          regiao_id: string | null
          sentimento: string | null
          tags: string[] | null
          titulo: string
          updated_at: string
        }
        Insert: {
          bairro_id?: string | null
          created_at?: string
          deleted_at?: string | null
          fontes?: Json | null
          id?: string
          narrativa: string
          observacoes?: string | null
          publicado_em?: string | null
          regiao_id?: string | null
          sentimento?: string | null
          tags?: string[] | null
          titulo: string
          updated_at?: string
        }
        Update: {
          bairro_id?: string | null
          created_at?: string
          deleted_at?: string | null
          fontes?: Json | null
          id?: string
          narrativa?: string
          observacoes?: string | null
          publicado_em?: string | null
          regiao_id?: string | null
          sentimento?: string | null
          tags?: string[] | null
          titulo?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "narrativas_mercado_bairro_id_fkey"
            columns: ["bairro_id"]
            isOneToOne: false
            referencedRelation: "bairros"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "narrativas_mercado_regiao_id_fkey"
            columns: ["regiao_id"]
            isOneToOne: false
            referencedRelation: "regioes"
            referencedColumns: ["id"]
          },
        ]
      }
      pressao_territorial: {
        Row: {
          bairro_id: string
          created_at: string
          deleted_at: string | null
          demanda: number | null
          id: string
          indice_pressao: number
          observacoes: string | null
          oferta: number | null
          referencia: string
          tensao: number | null
          updated_at: string
        }
        Insert: {
          bairro_id: string
          created_at?: string
          deleted_at?: string | null
          demanda?: number | null
          id?: string
          indice_pressao: number
          observacoes?: string | null
          oferta?: number | null
          referencia?: string
          tensao?: number | null
          updated_at?: string
        }
        Update: {
          bairro_id?: string
          created_at?: string
          deleted_at?: string | null
          demanda?: number | null
          id?: string
          indice_pressao?: number
          observacoes?: string | null
          oferta?: number | null
          referencia?: string
          tensao?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "pressao_territorial_bairro_id_fkey"
            columns: ["bairro_id"]
            isOneToOne: false
            referencedRelation: "bairros"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          display_name: string | null
          id: string
          role_title: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id: string
          role_title?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          display_name?: string | null
          id?: string
          role_title?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      regioes: {
        Row: {
          created_at: string
          deleted_at: string | null
          descricao: string | null
          id: string
          nome: string
          observacoes: string | null
          updated_at: string
          zona: string | null
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          descricao?: string | null
          id?: string
          nome: string
          observacoes?: string | null
          updated_at?: string
          zona?: string | null
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          descricao?: string | null
          id?: string
          nome?: string
          observacoes?: string | null
          updated_at?: string
          zona?: string | null
        }
        Relationships: []
      }
      scoring_leads: {
        Row: {
          classificacao: string | null
          created_at: string
          deleted_at: string | null
          id: string
          lead_id: string
          observacoes: string | null
          score_capacidade: number | null
          score_intencao: number | null
          score_perfil: number | null
          score_total: number
          updated_at: string
        }
        Insert: {
          classificacao?: string | null
          created_at?: string
          deleted_at?: string | null
          id?: string
          lead_id: string
          observacoes?: string | null
          score_capacidade?: number | null
          score_intencao?: number | null
          score_perfil?: number | null
          score_total: number
          updated_at?: string
        }
        Update: {
          classificacao?: string | null
          created_at?: string
          deleted_at?: string | null
          id?: string
          lead_id?: string
          observacoes?: string | null
          score_capacidade?: number | null
          score_intencao?: number | null
          score_perfil?: number | null
          score_total?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "scoring_leads_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "leads"
            referencedColumns: ["id"]
          },
        ]
      }
      scoring_territorial: {
        Row: {
          bairro_id: string
          created_at: string
          deleted_at: string | null
          id: string
          metodologia: string | null
          observacoes: string | null
          referencia: string
          score_demanda: number | null
          score_infraestrutura: number | null
          score_risco: number | null
          score_total: number
          score_valorizacao: number | null
          updated_at: string
        }
        Insert: {
          bairro_id: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          metodologia?: string | null
          observacoes?: string | null
          referencia?: string
          score_demanda?: number | null
          score_infraestrutura?: number | null
          score_risco?: number | null
          score_total: number
          score_valorizacao?: number | null
          updated_at?: string
        }
        Update: {
          bairro_id?: string
          created_at?: string
          deleted_at?: string | null
          id?: string
          metodologia?: string | null
          observacoes?: string | null
          referencia?: string
          score_demanda?: number | null
          score_infraestrutura?: number | null
          score_risco?: number | null
          score_total?: number
          score_valorizacao?: number | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "scoring_territorial_bairro_id_fkey"
            columns: ["bairro_id"]
            isOneToOne: false
            referencedRelation: "bairros"
            referencedColumns: ["id"]
          },
        ]
      }
      tipologias: {
        Row: {
          area_m2: number | null
          banheiros: number | null
          created_at: string
          deleted_at: string | null
          dormitorios: number | null
          id: string
          nome: string
          observacoes: string | null
          preco_max: number | null
          preco_min: number | null
          updated_at: string
          vagas: number | null
        }
        Insert: {
          area_m2?: number | null
          banheiros?: number | null
          created_at?: string
          deleted_at?: string | null
          dormitorios?: number | null
          id?: string
          nome: string
          observacoes?: string | null
          preco_max?: number | null
          preco_min?: number | null
          updated_at?: string
          vagas?: number | null
        }
        Update: {
          area_m2?: number | null
          banheiros?: number | null
          created_at?: string
          deleted_at?: string | null
          dormitorios?: number | null
          id?: string
          nome?: string
          observacoes?: string | null
          preco_max?: number | null
          preco_min?: number | null
          updated_at?: string
          vagas?: number | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_write: { Args: { _user_id: string }; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "analista" | "viewer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "analista", "viewer"],
    },
  },
} as const
