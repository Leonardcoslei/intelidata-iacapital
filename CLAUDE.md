# CLAUDE.md — Motor de Inteligência
**Guia de Contexto para Sessões com IA · v2.1.0**

> Este arquivo deve ser colado no início de qualquer nova sessão com o Claude para restaurar contexto completo do projeto. Mantenha-o atualizado a cada sprint.

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

**Supabase URL:** https://bjfexpmnddledfxoykml.supabase.co

---

## 3. Stack técnica

| Camada | Tecnologia |
|---|---|
| Framework | React + TypeScript (TSX) |
| Roteamento | TanStack Router |
| Estilização | Tailwind CSS |
| Gráficos | Recharts |
| Backend | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Build | Vite v7.3.3 |

---

## 4. Status dos módulos (Jun/2026)

| Módulo | Status | Observações |
|---|---|---|
| **Dashboard** | ⚠️ Parcial | KPIs e gráficos com dados mock — próximo a evoluir |
| **Territórios** | ✅ Completo | Ranking, heatmap, radar comparativo |
| **Empreendimentos** | ✅ Completo | Portfólio Cury + Radar Competitivo + Comparativo |
| **Leads** | ✅ Bom | Pipeline, scoring, import CSV |
| **Inteligência** | ✅ Completo | Claude Sonnet com streaming, 4 templates, análises salvas |
| **Relatórios** | ❌ Casca | Lista estática sem geração real |
| **Configurações** | ⚠️ Básico | Funcional mas minimalista |

---

## 5. Módulo Empreendimentos — dados cadastrados

### Portfólio Cury (6 empreendimentos)
- Cury Vista Park — Campo Grande, MCMV F3, abs 72%, VSO 18.4%, ticket 295k
- Cury Estação Madureira — Madureira, MCMV F3, abs 85%, VSO 19.2%, ticket 285k
- Cury Bangu Plaza — Bangu, MCMV F2, abs 64%, VSO 14.8%, ticket 220k
- Cury Realengo Life — Realengo, MCMV F2, abs 58%, VSO 12.6%, ticket 235k
- Cury Pixinguinha Residencial — Porto Maravilha, MCMV F3, abs 68%, VSO 12.1%, ticket 380k
- Cury Santa Cruz Garden — Santa Cruz, MCMV F2, abs 98%, VSO 4.2%, ticket 215k (concluído)

### Concorrentes mapeados (6)
- MRV Jardins do Rio — Campo Grande, MCMV F3, abs 78%
- MRV Reserva Bangu — Bangu, MCMV F2, abs 55%
- Direcional Viver Mais RJ — Madureira, MCMV F2, abs 82%
- Direcional Reserva Oeste — Realengo, breve lançamento
- RJZ Living Porto — Porto Maravilha, Médio padrão, abs 61%
- Construtora Tenda Carioca Homes — Santa Cruz, MCMV F1, abs 91%
- Even Boulevard Recreio — Recreio, Alto padrão, abs 54%

---

## 6. Fluxo de trabalho estabelecido

1. Claude constrói/edita arquivos no ambiente (`/home/claude/motor/`)
2. Faz commit + push para o GitHub com token
3. Leonardo roda `git pull` + `npm run dev` no PowerShell
4. Visualização em http://localhost:8080

**Token GitHub (válido 30 dias):** [TOKEN_GITHUB — gerar novo a cada sessão]

---

## 7. Próximas prioridades

1. **Dashboard** — conectar KPIs reais dos empreendimentos (absorção média, VSO, estoque por zona)
2. **Relatórios** — geração real de relatórios exportáveis
3. **Configurações** — thresholds e pesos do scoring
4. **Supabase** — conectar banco de dados real quando produto estiver maduro

---

## 8. Schema do banco (motor.*)

> Ainda não implementado — dados são mock estático nos componentes.
> Quando for implementar, usar schema `motor` (nunca `public`).

Ver CLAUDE.md v2.0.0 para schema completo das 17 tabelas.

---

## 9. Design system

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

## 10. Convenções obrigatórias

- NUNCA `localStorage` em artifacts
- NUNCA `<form>` em React — sempre `onClick`/`onChange`
- NUNCA `alert()` — sempre Toast
- SQL sempre com schema `motor.`
- Soft delete — nunca DELETE físico
- Chart.js destruído no cleanup do useEffect

---

## 11. Vocabulário do domínio

VSO · MCMV · SFH · SFI · SBPE · FGTS · SAC · PRICE · CPL · Tabela de venda · Tipologia · Lançamento · Porto Maravilha · Guaratiba

---

## 12. Histórico de versões

| Versão | Data | Mudança |
|---|---|---|
| v1.0.0 | — | Criação inicial |
| v2.0.0 | Jun/2026 | Schema v2, CII v18+, stack consolidada |
| v2.1.0 | Jun/2026 | Empreendimentos completo, Inteligência com Claude Sonnet, sistema rodando local |

---

*Motor de Inteligência · Leonardo Leite Corretor · Rio de Janeiro*
