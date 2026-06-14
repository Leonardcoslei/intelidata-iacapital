# CLAUDE.md — Motor de Inteligência
**Guia de Contexto para Sessões com IA · v2.2.0**

> Este arquivo deve ser colado no início de qualquer nova sessão com o Claude para restaurar contexto completo do projeto.

---

## 1. Quem é o dono do projeto

**Leonardo Leite** — corretor de imóveis independente, engenheiro civil, perito judicial/bancário credenciado pelo CREA. Atua no Rio de Janeiro e Niterói com foco em lançamentos na planta, especializado no ecossistema Cury Construtora. CNAI certificado. Marca: **Leonardo Leite Corretor**.

**Perfil técnico:** não-programador, alta capacidade analítica. Prefere entregas diretas no chat, máxima densidade, sem links externos. Trabalha com preview no chat + arquivos gerados aqui + git push/pull para aplicar no projeto local.

---

## 2. O que é este projeto

**Motor de Inteligência** é uma plataforma SaaS de inteligência territorial e mercadológica imobiliária para o Rio de Janeiro, com foco estratégico na Cury Construtora.

**Stack:** React + TypeScript + Tailwind + Supabase + TanStack Router + Recharts + Vite

**Repositório:** https://github.com/Leonardcoslei/intelidata-iacapital.git

**Rodando local:** `C:\Users\Leonardo\motor` → `npm run dev` → http://localhost:8080

**Supabase:** https://bjfexpmnddledfxoykml.supabase.co

---

## 3. Stack técnica

| Camada | Tecnologia |
|---|---|
| Framework | React + TypeScript (TSX) |
| Roteamento | TanStack Router |
| Estilização | Tailwind CSS |
| Gráficos | Recharts |
| Backend | Supabase (PostgreSQL) |
| Auth | Supabase Auth (senha mestre BERNARDO) |
| Build | Vite v7.3.3 |

---

## 4. Status dos módulos (Jun/2026)

| Módulo | Status | Observações |
|---|---|---|
| **Dashboard** | ⚠️ Em evolução | KPIs conectados ao Supabase real |
| **Territórios** | ✅ Estrutura | Botão importar bairros pronto |
| **Empreendimentos** | ✅ Estrutura | Botão importar dados + lixeira vermelha pendente |
| **Leads** | ✅ Estrutura | Botão importar dados + lixeira vermelha pendente |
| **Inteligência** | ✅ Completo | Claude Sonnet com streaming, 4 templates, análises salvas |
| **Relatórios** | ✅ Funcional | 5 relatórios com período 3M/6M/12M/24M, visualização, download CSV |
| **Configurações** | ⚠️ Básico | Funcional mas minimalista |

---

## 5. Fluxo de autenticação

**Tela de login mestre** → Senha: `BERNARDO` (hardcoded, sem Supabase Auth)

Após entrar:
- Landing page pública (sem senha adicional)
- Clica "Acessar plataforma" → Supabase Auth (login/signup padrão)

---

## 6. Banco de dados — Schema

### Schema `public` (Supabase JS acessa direto)
- `bairros` — 10 bairros iniciais (Porto Maravilha, Campo Grande, etc.)
- `empreendimentos` — 7 empreendimentos Cury
- `leads` — vazio (a popular via importação)
- `relatorios` — para salvar relatórios gerados

### Schema `motor` (dados originais, não usado pelo JS)
- Tabelas com soft delete (`deleted_at`)
- RLS ativado, políticas para anon em leitura
- Views criadas mas não usadas pelo frontend (Supabase JS limitação)

**Solução implementada:** Tabelas copiadas para `public` no painel SQL do Supabase.

---

## 7. Dados de exemplo

### Portfólio Cury (7 empreendimentos em public.empreendimentos)
- Cury Vista Park — Campo Grande, F3, abs 72%, VSO 18.4%, ticket 295k
- Cury Estação Madureira — Madureira, F3, abs 85%, VSO 19.2%, ticket 285k
- Cury Bangu Plaza — Bangu, F2, abs 64%, VSO 14.8%, ticket 220k
- Cury Realengo Life — Realengo, F2, abs 58%, VSO 12.6%, ticket 235k
- Cury Pixinguinha Residencial — Porto Maravilha, F3, abs 68%, VSO 12.1%, ticket 380k
- Cury Santa Cruz Garden — Santa Cruz, F2, abs 98%, VSO 4.2%, ticket 215k
- (+ 1 adicional)

### Bairros (10 em public.bairros)
Porto Maravilha, Campo Grande, Madureira, Bangu, Realengo, Santa Cruz, Guaratiba, Niterói, Recreio, Barra da Tijuca

---

## 8. Fluxo de trabalho

1. Claude constrói/edita arquivos em `/home/claude/motor/`
2. Faz commit + push para GitHub
3. Leonardo roda `git pull` + `npm run dev` no PowerShell
4. Visualização em http://localhost:8080

**Token GitHub:** Gerar novo a cada sessão se expirado (30 dias).

---

## 9. Próximas prioridades

1. ✅ Senha mestre BERNARDO + landing pública
2. ✅ Supabase conectado — KPIs reais no Dashboard
3. ✅ Relatórios funcionais — filtro período 3M/6M/12M/24M, visualização, CSV
4. ✅ Modal importação PDF/Excel/CSV
5. ❌ **Lixeira vermelha** — botão deletar em leads/empreendimentos/bairros (soft delete)
6. ❌ **Botão adicionar bairros** — ranking territorial expansível
7. ❌ **Tipologias corretas** — LOFT, STUDIO, 1Q, 2Q, 2QV, 2QS, 2QSV, 3QSV, COBERTURA, GARDEN 1Q/2Q/3Q
8. ❌ **Dashboard — período real** — botões 3M/6M/12M/24M funcionando (dados da view/API)
9. ❌ **Heatmap territorial** — legenda real (não só quadrinhos azuis)
10. ❌ **Importação inteligente** — detecção duplicatas, controle de reexecução via hash MD5

---

## 10. Schema Supabase (motor.*)

Tabelas criadas via SQL (schema `motor`):
- `bairros` (soft delete, RLS, políticas anon)
- `empreendimentos` (soft delete, RLS, políticas anon)
- `leads` (soft delete, RLS, políticas anon)
- `importacoes` (hash MD5 para evitar reimportação)
- `relatorios` (para salvar relatórios gerados)

Views em `motor` (não usadas pelo JS):
- `v_ranking_territorial`
- `v_empreendimentos`
- `v_leads_ativos`

**SOLUÇÃO ATUAL:** Dados espelhados em `public.*` (Supabase JS acessa direto).

---

## 11. Design system

**Estética:** Bloomberg-Notion-Power BI — premium/enterprise, dark mode

```css
--cor-fundo:        #0f1117
--cor-superficie:   #1a1f2e
--cor-borda:        #2a3040
--cor-primaria:     #1e6fa8   /* azul petróleo */
--cor-destaque:     #c9a84c   /* ouro discreto */
--cor-texto:        #e2e8f0
--cor-texto-fraco:  #94a3b8
--cor-sucesso:      #22c55e
--cor-alerta:       #f59e0b
--cor-erro:         #ef4444
```

---

## 12. Convenções obrigatórias

- NUNCA `localStorage` em artifacts
- NUNCA `<form>` em React — sempre `onClick`/`onChange`
- NUNCA `alert()` — sempre Toast
- Soft delete — nunca DELETE físico (set `deleted_at` + `ativo = false`)
- RLS ativado em `motor.*`, políticas para anon em leitura
- Dados em `public.*` para acesso JS direto

---

## 13. Histórico de versões

| Versão | Data | Mudança |
|---|---|---|
| v1.0.0 | — | Criação inicial |
| v2.0.0 | Jun/2026 | Schema v2, CII v18+, stack consolidada |
| v2.1.0 | Jun/2026 | Empreendimentos completo, Inteligência com Claude Sonnet |
| v2.2.0 | Jun/2026 | Supabase conectado, relatórios reais, modal importação, KPIs no Dashboard |

---

*Motor de Inteligência · Leonardo Leite Corretor · Rio de Janeiro*
