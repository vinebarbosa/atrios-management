# Design: add-kanban-drag-drop

## Context

O board ([product-board.tsx](../../../src/app/produtos/[code]/product-board.tsx)) é um client component que recebe `cards` do server e monta as 4 colunas filtrando por `status`. A mutação `setCardStatus` (server action) já persiste e revalida — o painel do card a usa via dropdown. Falta o gesto de arrastar. O mockup não desenha o drag (board presentational); o feedback visual fica a cargo dos tokens existentes do design system.

## Goals / Non-Goals

**Goals:**

- Arrastar card → soltar em coluna → `setCardStatus`, com resposta visual imediata (otimista) e rollback em erro.
- Zero dependências novas; mudança contida em um componente.

**Non-Goals:**

- Reordenação manual dentro da coluna (ordem segue `createdAt desc`).
- Arrasto na visão Lista ou em touch/mobile (HTML5 DnD não cobre touch; fica para quando houver demanda).
- Acessibilidade de teclado para o gesto — o dropdown do painel continua sendo a via acessível.

## Decisions

### D1 — HTML5 drag-and-drop nativo, sem biblioteca

`draggable` no `TaskCard` + `onDragStart`/`onDragEnd` no card e `onDragOver`/`onDragLeave`/`onDrop` na coluna. Payload = id do card via `dataTransfer.setData("text/plain", id)` (com fallback no estado local, pois alguns browsers restringem `getData` fora do drop). Alternativa rejeitada: `@dnd-kit` — dá touch, teclado e sort animado, mas são não-objetivos; para "soltar em uma de 4 colunas" a API nativa basta e não adiciona ~50KB.

### D2 — Estado otimista com `useOptimistic`

`useOptimistic<Record<cardId, CardStatus>>` sobre os `cards` do server: no drop, `startTransition` aplica o override e chama `setCardStatus`. Quando a revalidação chega, os props novos já trazem o status persistido e o override é descartado pelo React; se a action retornar erro, o override é revertido automaticamente ao fim da transition (comportamento padrão do `useOptimistic`). Alternativa rejeitada: estado manual + reconciliação por `useEffect` — mais código para reimplementar o que o React 19 já dá.

### D3 — Feedback com estado local + tokens existentes

- Card arrastado: `opacity-40` enquanto `draggingId === card.id`.
- Coluna alvo: realce com `border`/`bg` primários (mesma família do compositor: `border-primary/45`, `bg-surface-selected`) via estado `dragOverCol`; colunas ganham área de drop de altura total para não exigir mira nos cards.
- `cursor-grab`/`cursor-grabbing` no card. Clique continua abrindo o painel — o browser só dispara `click` se não houve drag real.

## Risks / Trade-offs

- [HTML5 DnD não funciona em touch] → aceito como non-goal; painel cobre mobile.
- [Drop fora de qualquer coluna] → `onDragEnd` limpa `draggingId`/`dragOverCol`; sem mutação.
- [dragover dispara em rajada] → só faz `setState` quando o valor muda, evitando re-render por frame.

## Migration Plan

Uma edição em `product-board.tsx`; sem migration nem rollout. Rollback = reverter o commit.

## Open Questions

Nenhuma.
