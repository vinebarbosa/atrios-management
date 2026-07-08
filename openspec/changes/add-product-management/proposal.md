# Proposal: add-product-management

## Why

As telas de produtos (frames 02–06 do mockup `Átrios Produtos (standalone).html`) já existem no app — lista, modal de criação, página do produto com board kanban/lista, compositor de card e painel do card — mas são 100% fachada: tudo lê de `src/lib/mock-data.ts`, nada persiste e um refresh desfaz qualquer ação. Com autenticação real no lugar (`add-auth`), o próximo passo natural é tornar o gerenciamento de produtos funcional de ponta a ponta.

## What Changes

- **Persistência real** em Postgres via Drizzle: tabelas `product`, `product_repo`, `card` e histórico de etapas — substituindo `mock-data.ts`.
- **Criar produto** de verdade pelo modal existente: nome, código único (prefixo dos ids de card) e repositórios; produto nasce na etapa "Descoberta".
- **Ciclo de vida do produto**: alterar a etapa (Descoberta → Definição → Desenvolvimento → Testes → Em Produção → Descontinuado) com data registrada, exibida no stepper.
- **Repositórios do produto**: adicionar/remover no painel de contexto (apenas registro + link para GitHub; criação automática de repos fica para uma integração futura).
- **Board funcional**: criar card na coluna To Do (id sequencial `CODE-n`), mover card entre as 4 colunas, editar título/descrição/repositório e vincular PR colando o link.
- **Dados derivados calculados do banco**: contagem "N em andamento" (cards em Progresso + Revisão), totais por coluna e "atualizado há X".
- Lista `/produtos`, página `/produtos/[code]` e sidebar passam a ler do banco; seed de desenvolvimento com os dados do mockup.

Sem mudanças **BREAKING** — as rotas e componentes de UI existentes são mantidos; só a fonte de dados muda de mock para banco.

## Capabilities

### New Capabilities

- `products`: cadastro e ciclo de vida de produtos — listagem, criação com código único e repositórios, etapa com histórico datado, painel de contexto (frames 02, 03 e 04-cabeçalho).
- `product-board`: board de cards por produto — 4 colunas fixas, visões kanban/lista, criação rápida na To Do, painel do card com edição, mudança de status e vínculo de PR (frames 04-board, 05 e 06).

### Modified Capabilities

_Nenhuma — auth/invites/team-management não mudam; a proteção das rotas `/produtos/*` já existe via `proxy.ts`._

## Impact

- **Schema/migrations**: novas tabelas em `src/db/schema.ts` + migration Drizzle em `drizzle/`.
- **Server actions novas**: `src/app/produtos/actions.ts` seguindo o padrão de `src/app/time/actions.ts` (sessão obrigatória, `revalidatePath`).
- **Rotas alteradas**: `/produtos` (lista do banco), `/produtos/[code]` (board do banco, mutations reais).
- **Componentes alterados**: `new-product-modal.tsx` e `product-board.tsx` (submissão real), `app-sidebar.tsx` (produtos do banco).
- **Removido**: `src/lib/mock-data.ts` (dados migram para seed de dev; tipos migram para o schema).
- **Fora de escopo**: integração GitHub (criar repos, auto-vincular PRs), drag-and-drop no kanban, cofre de acessos (existe no `logic.js` do mockup mas sem frame desenhado).
