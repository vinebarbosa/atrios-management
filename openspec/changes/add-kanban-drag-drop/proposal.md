# Proposal: add-kanban-drag-drop

## Why

Hoje a única forma de mover um card entre colunas é abrir o painel e trocar o status num dropdown — dois cliques e um modal para a operação mais frequente de um kanban. Arrastar o card até a coluna de destino é o gesto que qualquer usuário espera de um board (referência de UX Linear, base do design do app).

## What Changes

- Cards do kanban tornam-se **arrastáveis**: soltar um card sobre outra coluna muda seu status (mesma semântica da action `setCardStatus` já existente).
- **Feedback visual** durante o arrasto: card de origem esmaecido, coluna de destino destacada, cursor de agarrar.
- **Atualização otimista**: o card aparece na coluna de destino imediatamente, reconciliado quando a revalidação chegar; em erro da action, volta ao estado anterior.
- Arrasto existe só na visão Kanban (a Lista mantém o painel como via de mudança de status) e não há reordenação manual dentro da coluna (ordem continua sendo a de criação).

Sem mudanças **BREAKING** — o dropdown de status no painel do card continua funcionando; o arrasto é uma via adicional.

## Capabilities

### New Capabilities

_Nenhuma._

### Modified Capabilities

- `product-board`: novo requisito de arrastar cards entre colunas no kanban (aditivo; o spec principal ainda não foi sincronizado — a capability vive em `openspec/changes/add-product-management/specs/product-board/`).

## Impact

- **Componente alterado**: `src/app/produtos/[code]/product-board.tsx` (handlers de drag nos cards e colunas da visão kanban, estado otimista).
- **Sem novas dependências**: HTML5 drag-and-drop nativo — mover entre 4 colunas fixas não justifica dnd-kit.
- **Sem mudanças** de schema, actions ou rotas (`setCardStatus` já cobre a mutação).
