# Design: add-product-management

## Context

A UI dos frames 02–06 do mockup já está portada e polida: `src/app/produtos/page.tsx` (lista), `new-product-modal.tsx` (criação), `produtos/[code]/product-board.tsx` (board kanban/lista + compositor + painel do card). Tudo lê de `src/lib/mock-data.ts` e o estado vive só em `useState`. A infra real já existe: Postgres + Drizzle (`src/db`), better-auth com rotas protegidas via `src/proxy.ts`, e o padrão de server actions com verificação de sessão em `src/app/time/actions.ts`.

O mockup (`Átrios Produtos (standalone).html`, dados autoritativos no `Component.renderVals()` embutido) define: 7 produtos exemplo, 6 etapas de ciclo de vida com datas, 4 colunas fixas de board, cards com repo/PR/auto, e repositórios `atrios/<nome>` por produto.

**Atenção Next.js**: este repo usa Next 16 com breaking changes (ver `AGENTS.md`) — consultar `node_modules/next/dist/docs/` antes de escrever código de rotas, cache/revalidação e server actions.

## Goals / Non-Goals

**Goals:**

- Persistir produtos, repositórios e cards em Postgres e ligar a UI existente a eles com o mínimo de mudança visual.
- Mutations via server actions com sessão obrigatória, seguindo o padrão de `time/actions.ts`.
- Dados derivados (contagens, "atualizado há X", cor do produto) calculados no servidor a partir do banco.
- Seed de desenvolvimento reproduzindo os dados do mockup.

**Non-Goals:**

- Integração GitHub (criar repositórios ao salvar, auto-vincular PRs, status "aberto" real do PR) — o texto "serão criados no GitHub ao salvar" fica como promessa futura; registramos apenas nome + link.
- Drag-and-drop no kanban — o mockup não o implementa; status muda pelo painel do card.
- Cofre de acessos e time (existem no `logic.js` do mockup, sem frame desenhado; time já é coberto por `add-auth`).
- Permissões por papel: qualquer membro autenticado gerencia produtos e cards (admin só importa em `/time`).
- Excluir produto — "Descontinuado" é o arquivamento; hard delete fica de fora.

## Decisions

### D1 — Modelo de dados (4 tabelas)

```
product:        id (uuid), name, code (unique, 2–4 chars), description,
                long_description?, stage (int 0–5), created_at, updated_at
product_repo:   id, product_id FK cascade, label, name
card:           id, product_id FK cascade, seq (int, unique por produto),
                title, description?, status ('todo'|'progress'|'review'|'done'),
                repo_id FK set-null → product_repo, pr_number?, pr_url?,
                auto (bool, default false), created_at, updated_at
product_stage_event: id, product_id FK cascade, stage (int), entered_at
```

- **`stage` como índice int + catálogo estático em código** (nomes, cores, hues das 6 etapas), não tabela: as etapas são fixas do produto Átrios, e a UI (`STAGES`) já funciona por índice. Alternativa rejeitada: tabela `stage` — flexibilidade que ninguém pediu.
- **Cor do produto derivada da etapa** — no mockup a cor do produto é sempre a cor da etapa atual; não persistimos cor.
- **`card.seq` por produto** com id de exibição `${code}-${seq}` calculado. Próximo seq via `max(seq)+1` dentro de transação (ou `insert … select`), garantindo o cenário de criação concorrente sem coluna de contador. Seq nunca é reutilizado (não decrementa ao deletar).
- **`product_stage_event`** guarda cada mudança de etapa com data — alimenta as datas do stepper. Criação do produto insere o evento da etapa Descoberta.
- **Card ↔ repo por FK** (`repo_id`, on delete set null) em vez do enum `web|api|mobile` do mock: o dropdown do compositor/painel lista os repos reais do produto. Cor do chip derivada do `label` (mapa `web/api/mobile` existente, fallback neutro).

### D2 — Server actions em `src/app/produtos/actions.ts`

Mesmo padrão de `time/actions.ts`: `"use server"`, helper `requireSession()` (sessão basta; sem exigir admin), validação no servidor, retorno `{ error?: string }`, `revalidatePath` de `/produtos` e `/produtos/[code]`. Actions: `createProduct`, `setProductStage`, `addRepo`, `removeRepo`, `createCard`, `updateCard` (título/descrição/repo), `setCardStatus`, `linkPr`, `unlinkPr`. Alternativa rejeitada: route handlers REST — actions já são o padrão do repo e eliminam boilerplate de fetch.

### D3 — Páginas server-first, interatividade preservada

`/produtos` e `/produtos/[code]` viram server components que buscam do banco e passam dados como props para os client components existentes (`NewProductModal`, `ProductBoard`), que trocam `useState`-como-fonte-de-verdade por chamadas às actions + estado otimista local onde a UX pede (compositor de card, destaque "novo"). A sidebar recebe os produtos via props do layout (server). Alternativa rejeitada: SWR/React Query — dependência nova sem necessidade; revalidação do Next cobre.

### D4 — Derivados calculados na query

"N em andamento" = `count(cards where status in ('progress','review'))`; total por coluna = contagem real; "atualizado há X" = formatação relativa (pt-BR) de `greatest(product.updated_at, max(card.updated_at))`, calculada no servidor para evitar hidratação divergente. `updated_at` do produto é tocado por mutations de card via `$onUpdate`/update explícito.

### D5 — UI nova mínima onde o mockup é omisso

Duas ações necessárias ao gerenciamento não têm affordance desenhada; resolvemos com o design system existente, sem tela nova:

- **Mudar etapa**: os passos do `Stepper` tornam-se clicáveis (title com a etapa, cursor pointer).
- **Mudar status / editar card / PR**: o painel do card (frame 06) ganha o pill de status como dropdown, título/descrição editáveis in-place e campo para colar link de PR — todos já têm slot visual no frame.

### D6 — Validações

- Código: `^[A-Z0-9]{2,4}$`, unicidade com tratamento do erro de constraint (mensagem inline).
- Link de PR: `^https://github\.com/[^/]+/[^/]+/pull/(\d+)$` → extrai `pr_number`.
- `mock-data.ts` morre; `STAGES`, cores de repo e helpers de UI (slug, branch sugerida) migram para `src/lib/product-constants.ts` + schema. Seed em `src/db/seed.ts` (script `drizzle-kit`/`tsx`) com os 7 produtos e o board do Pórtico.

## Risks / Trade-offs

- [Concorrência no `seq`] Dois inserts simultâneos podem colidir → transação com `select max(seq) … for update` do produto (ou unique `(product_id, seq)` + retry único no conflito).
- [Next 16 divergente do conhecimento prévio] APIs de cache/revalidação e params podem ter mudado → tarefa explícita de ler `node_modules/next/dist/docs/` antes das páginas; validar com `npm run build`.
- [Estado otimista × revalidação] O destaque "novo" e o compositor dependem de estado local que a revalidação pode sobrescrever → manter flags puramente client-side (não persistir `isNew`), reconciliar por id.
- [Perda dos dados de exemplo] Remover `mock-data.ts` quebra o design system page se ela o importar → verificar importadores antes de deletar; seed cobre o ambiente de dev.

## Migration Plan

1. Schema + migration (`drizzle-kit generate` + `migrate`) — aditivo, sem tocar tabelas de auth.
2. Actions + páginas lendo do banco; seed para dev.
3. Remover `mock-data.ts` por último, quando nada mais importar dele.
   Rollback: reverter o branch; migration é aditiva, sem perda para auth.

## Open Questions

- Nenhuma bloqueante. (Se surgir a integração GitHub, `product_repo.name` + `pr_url` já são o ponto de encaixe.)
