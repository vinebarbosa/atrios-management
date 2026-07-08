# Tasks: add-kanban-drag-drop

## 1. Implementação

- [x] 1.1 Estado otimista de status em `product-board.tsx` com `useOptimistic` (override `cardId → status` aplicado sobre `cards` antes de montar as colunas)
- [x] 1.2 Tornar os cards do kanban arrastáveis: `draggable`, `onDragStart` (payload id + estado `draggingId`), `onDragEnd` (limpa estado), `cursor-grab` e `opacity-40` no card em arrasto
- [x] 1.3 Colunas como alvo de drop: `onDragOver` (preventDefault + realce `dragOverCol`, sem setState redundante), `onDragLeave`, `onDrop` → se a coluna difere da atual, `startTransition` com override otimista + `setCardStatus`
- [x] 1.4 Garantir que soltar na própria coluna ou fora de coluna não envia mutação e que o clique ainda abre o painel

## 2. Verificação

- [x] 2.1 No browser: arrastar card entre colunas (contagens ajustam, status persiste após reload), soltar na própria coluna (nada), realce visual durante o arrasto
- [x] 2.2 Confirmar que a visão Lista segue sem arrasto e o dropdown do painel continua movendo cards
- [x] 2.3 `npm run lint` e `npm run build` limpos
