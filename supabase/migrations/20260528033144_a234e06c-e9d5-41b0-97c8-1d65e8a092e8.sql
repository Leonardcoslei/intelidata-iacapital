
-- ============== ROLES ==============
CREATE TYPE public.app_role AS ENUM ('admin', 'analista', 'viewer');

CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role public.app_role)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role)
$$;

CREATE OR REPLACE FUNCTION public.can_write(_user_id UUID)
RETURNS BOOLEAN LANGUAGE SQL STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT public.has_role(_user_id, 'admin') OR public.has_role(_user_id, 'analista')
$$;

CREATE POLICY "view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));
CREATE POLICY "admin manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin')) WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============== Generic updated_at trigger ==============
CREATE OR REPLACE FUNCTION public.tg_set_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

-- ============== CONSTRUTORAS ==============
CREATE TABLE public.construtoras (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  cnpj TEXT UNIQUE,
  site TEXT,
  logo_url TEXT,
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- ============== REGIOES ==============
CREATE TABLE public.regioes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL UNIQUE,
  zona TEXT,
  descricao TEXT,
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- ============== BAIRROS ==============
CREATE TABLE public.bairros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  regiao_id UUID REFERENCES public.regioes(id) ON DELETE SET NULL,
  nome TEXT NOT NULL,
  latitude NUMERIC(10,6),
  longitude NUMERIC(10,6),
  populacao INTEGER,
  renda_media NUMERIC(12,2),
  idh NUMERIC(4,3),
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  UNIQUE (regiao_id, nome)
);
CREATE INDEX idx_bairros_regiao ON public.bairros(regiao_id);

-- ============== TIPOLOGIAS ==============
CREATE TABLE public.tipologias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  area_m2 NUMERIC(8,2),
  dormitorios INTEGER,
  banheiros INTEGER,
  vagas INTEGER,
  preco_min NUMERIC(14,2),
  preco_max NUMERIC(14,2),
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- ============== EMPREENDIMENTOS ==============
CREATE TABLE public.empreendimentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  construtora_id UUID REFERENCES public.construtoras(id) ON DELETE SET NULL,
  bairro_id UUID REFERENCES public.bairros(id) ON DELETE SET NULL,
  tipologia_id UUID REFERENCES public.tipologias(id) ON DELETE SET NULL,
  nome TEXT NOT NULL,
  status TEXT CHECK (status IN ('planejado','lancamento','em_obras','entregue','vendido')),
  data_lancamento DATE,
  data_entrega DATE,
  vgv NUMERIC(16,2),
  unidades_total INTEGER,
  unidades_vendidas INTEGER DEFAULT 0,
  ticket_medio NUMERIC(14,2),
  endereco TEXT,
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);
CREATE INDEX idx_emp_construtora ON public.empreendimentos(construtora_id);
CREATE INDEX idx_emp_bairro ON public.empreendimentos(bairro_id);

-- ============== LEADS ==============
CREATE TABLE public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  email TEXT,
  telefone TEXT,
  origem TEXT,
  bairro_id UUID REFERENCES public.bairros(id) ON DELETE SET NULL,
  empreendimento_id UUID REFERENCES public.empreendimentos(id) ON DELETE SET NULL,
  estagio TEXT CHECK (estagio IN ('novo','qualificado','visita','proposta','fechado','perdido')) DEFAULT 'novo',
  renda_estimada NUMERIC(12,2),
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);
CREATE INDEX idx_leads_emp ON public.leads(empreendimento_id);
CREATE INDEX idx_leads_bairro ON public.leads(bairro_id);

-- ============== SCORING TERRITORIAL ==============
CREATE TABLE public.scoring_territorial (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bairro_id UUID NOT NULL REFERENCES public.bairros(id) ON DELETE CASCADE,
  score_total NUMERIC(5,2) NOT NULL,
  score_demanda NUMERIC(5,2),
  score_infraestrutura NUMERIC(5,2),
  score_valorizacao NUMERIC(5,2),
  score_risco NUMERIC(5,2),
  metodologia TEXT,
  observacoes TEXT,
  referencia DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);
CREATE INDEX idx_score_terr_bairro ON public.scoring_territorial(bairro_id, referencia DESC);

-- ============== SCORING LEADS ==============
CREATE TABLE public.scoring_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  score_total NUMERIC(5,2) NOT NULL,
  score_perfil NUMERIC(5,2),
  score_intencao NUMERIC(5,2),
  score_capacidade NUMERIC(5,2),
  classificacao TEXT,
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);
CREATE INDEX idx_score_lead_lead ON public.scoring_leads(lead_id, created_at DESC);

-- ============== ABSORCAO IMOBILIARIA ==============
CREATE TABLE public.absorcao_imobiliaria (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empreendimento_id UUID NOT NULL REFERENCES public.empreendimentos(id) ON DELETE CASCADE,
  mes_referencia DATE NOT NULL,
  unidades_vendidas INTEGER NOT NULL DEFAULT 0,
  unidades_disponiveis INTEGER,
  vso NUMERIC(5,2),
  ticket_medio NUMERIC(14,2),
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ,
  UNIQUE (empreendimento_id, mes_referencia)
);

-- ============== CONCORRENCIA ==============
CREATE TABLE public.concorrencia (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bairro_id UUID REFERENCES public.bairros(id) ON DELETE SET NULL,
  construtora_id UUID REFERENCES public.construtoras(id) ON DELETE SET NULL,
  empreendimento_id UUID REFERENCES public.empreendimentos(id) ON DELETE SET NULL,
  preco_m2 NUMERIC(12,2),
  preco_medio NUMERIC(14,2),
  posicao_ranking INTEGER,
  share_mercado NUMERIC(5,2),
  observacoes TEXT,
  referencia DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- ============== NARRATIVAS DE MERCADO ==============
CREATE TABLE public.narrativas_mercado (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  regiao_id UUID REFERENCES public.regioes(id) ON DELETE SET NULL,
  bairro_id UUID REFERENCES public.bairros(id) ON DELETE SET NULL,
  titulo TEXT NOT NULL,
  narrativa TEXT NOT NULL,
  sentimento TEXT CHECK (sentimento IN ('positivo','neutro','negativo')),
  fontes JSONB DEFAULT '[]'::jsonb,
  tags TEXT[],
  observacoes TEXT,
  publicado_em DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);

-- ============== PRESSAO TERRITORIAL ==============
CREATE TABLE public.pressao_territorial (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bairro_id UUID NOT NULL REFERENCES public.bairros(id) ON DELETE CASCADE,
  indice_pressao NUMERIC(5,2) NOT NULL,
  demanda NUMERIC(5,2),
  oferta NUMERIC(5,2),
  tensao NUMERIC(5,2),
  observacoes TEXT,
  referencia DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);
CREATE INDEX idx_pressao_bairro ON public.pressao_territorial(bairro_id, referencia DESC);

-- ============== HISTORICO ALTERACOES ==============
CREATE TABLE public.historico_alteracoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tabela TEXT NOT NULL,
  registro_id UUID NOT NULL,
  acao TEXT NOT NULL CHECK (acao IN ('insert','update','delete')),
  usuario_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  dados_anteriores JSONB,
  dados_novos JSONB,
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_hist_tabela ON public.historico_alteracoes(tabela, registro_id);

-- ============== ALERTAS ESTRATEGICOS ==============
CREATE TABLE public.alertas_estrategicos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo TEXT NOT NULL,
  severidade TEXT NOT NULL CHECK (severidade IN ('info','baixa','media','alta','critica')),
  titulo TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  bairro_id UUID REFERENCES public.bairros(id) ON DELETE SET NULL,
  empreendimento_id UUID REFERENCES public.empreendimentos(id) ON DELETE SET NULL,
  lead_id UUID REFERENCES public.leads(id) ON DELETE SET NULL,
  lido BOOLEAN NOT NULL DEFAULT false,
  observacoes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  deleted_at TIMESTAMPTZ
);
CREATE INDEX idx_alertas_severidade ON public.alertas_estrategicos(severidade, lido);

-- ============== GRANTS + RLS + POLICIES + TRIGGERS (loop) ==============
DO $$
DECLARE
  t TEXT;
  tables TEXT[] := ARRAY[
    'construtoras','regioes','bairros','tipologias','empreendimentos','leads',
    'scoring_territorial','scoring_leads','absorcao_imobiliaria','concorrencia',
    'narrativas_mercado','pressao_territorial','alertas_estrategicos'
  ];
BEGIN
  FOREACH t IN ARRAY tables LOOP
    EXECUTE format('GRANT SELECT, INSERT, UPDATE, DELETE ON public.%I TO authenticated;', t);
    EXECUTE format('GRANT ALL ON public.%I TO service_role;', t);
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY;', t);
    EXECUTE format('CREATE POLICY "auth read %1$s" ON public.%1$I FOR SELECT TO authenticated USING (deleted_at IS NULL);', t);
    EXECUTE format('CREATE POLICY "writers insert %1$s" ON public.%1$I FOR INSERT TO authenticated WITH CHECK (public.can_write(auth.uid()));', t);
    EXECUTE format('CREATE POLICY "writers update %1$s" ON public.%1$I FOR UPDATE TO authenticated USING (public.can_write(auth.uid())) WITH CHECK (public.can_write(auth.uid()));', t);
    EXECUTE format('CREATE POLICY "admin delete %1$s" ON public.%1$I FOR DELETE TO authenticated USING (public.has_role(auth.uid(), ''admin''));', t);
    EXECUTE format('CREATE TRIGGER set_updated_at_%1$s BEFORE UPDATE ON public.%1$I FOR EACH ROW EXECUTE FUNCTION public.tg_set_updated_at();', t);
  END LOOP;
END $$;

-- historico_alteracoes: read-only insert by service / writers, full read for authenticated
GRANT SELECT, INSERT ON public.historico_alteracoes TO authenticated;
GRANT ALL ON public.historico_alteracoes TO service_role;
ALTER TABLE public.historico_alteracoes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "auth read historico" ON public.historico_alteracoes FOR SELECT TO authenticated USING (true);
CREATE POLICY "writers insert historico" ON public.historico_alteracoes FOR INSERT TO authenticated WITH CHECK (public.can_write(auth.uid()));
