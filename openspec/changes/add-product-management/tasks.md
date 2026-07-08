# Tasks: add-product-management

## 1. Fundação — schema e seed

- [x] 1.1 Ler os guias relevantes em `node_modules/next/dist/docs/` (server actions, cache/revalidação, params de rota) — Next 16 tem breaking changes (AGENTS.md)
- [x] 1.2 Adicionar tabelas `product`, `product_repo`, `card`, `product_stage_event` em `src/db/schema.ts` (com relations, índices e unique `(product_id, seq)`), conforme D1
- [x] 1.3 Gerar e aplicar migration (`drizzle-kit generate` + migrate) e verificar contra o banco de dev
- [x] 1.4 Criar `src/lib/product-constants.ts` com o catálogo `STAGES` (nome, cor, hue), cores de repo por label e helpers (slug de código, branch sugerida) migrados de `mock-data.ts`
- [x] 1.5 Criar seed de dev `src/db/seed.ts` com os 7 produtos do mockup (etapas + eventos de etapa), repos do Pórtico e o board do Pórtico (cards com repo/PR/auto)

## 2. Capability `products` — produto e ciclo de vida

- [x] 2.1 Criar `src/app/produtos/actions.ts` com `requireSession()` e a action `createProduct` (validação de nome, código `^[A-Z0-9]{2,4}$`, unicidade com erro inline, repos iniciais, evento Descoberta, `revalidatePath`)
- [x] 2.2 Actions `setProductStage` (persiste etapa + `product_stage_event`), `addRepo` e `removeRepo`
- [x] 2.3 Converter `/produtos/page.tsx` em server component lendo do banco com derivados (contagem em andamento, "atualizado há X" relativo pt-BR calculado no servidor) e estado vazio
- [x] 2.4 Ligar `new-product-modal.tsx` à action `createProduct`: submit real, erro inline de código duplicado/validação, fechar e refletir na lista ao criar
- [x] 2.5 Sidebar (`app-sidebar.tsx` / layout) recebe produtos do banco via props, com dot na cor da etapa atual
- [x] 2.6 Página `/produtos/[code]`: buscar produto + repos + eventos de etapa do banco, `notFound()` para código inexistente; cabeçalho e painel de contexto com dados reais (datas do stepper vindas de `product_stage_event`)
- [x] 2.7 Painel de contexto: stepper clicável chamando `setProductStage`; adicionar/remover repositório chamando as actions (estado vazio "Adicionar repositório" preservado)

## 3. Capability `product-board` — cards

- [x] 3.1 Actions de card: `createCard` (seq transacional `max(seq)+1` por produto, status todo), `setCardStatus`, `updateCard` (título/descrição/repo), `linkPr` (regex de URL de PR → número) e `unlinkPr`
- [x] 3.2 `product-board.tsx`: colunas montadas dos cards do banco (contagens reais), chip de repo derivado do `product_repo` vinculado, visões kanban/lista sem refetch
- [x] 3.3 Compositor da To Do ligado a `createCard`: dropdown com repos reais do produto, Enter/Esc, card novo no topo com destaque "novo" client-side
- [x] 3.4 Painel do card: status como dropdown (`setCardStatus`), título/descrição editáveis in-place (`updateCard`), select de repo real, campo de colar/remover link de PR com validação
- [x] 3.5 Mutations de card tocam `updated_at` do produto (alimenta "atualizado há X" e ordenação da lista)

## 4. Limpeza e verificação

- [x] 4.1 Verificar importadores de `mock-data.ts` (incluindo `/design-system`), migrar o que restar para `product-constants.ts` e remover `src/lib/mock-data.ts`
- [x] 4.2 Rodar seed, exercitar o fluxo completo no browser: criar produto → mudar etapa → adicionar repo → criar card → mover status → editar card → vincular PR; conferir contagens na lista e sidebar
- [x] 4.3 Cenários de erro: código duplicado, código inválido, título vazio, URL de PR inválida, `/produtos/XYZ` → 404
- [x] 4.4 `npm run lint` e `npm run build` limpos
