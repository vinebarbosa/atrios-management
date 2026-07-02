A single kanban card — mono id, optional badges (novo / auto / PR), title, and an optional repo chip. Hover lifts the border and surface. Composes Badge + RepoChip.

```jsx
<TaskCard id="POR-27" title="Configurar alertas de falha" repo="api" isNew />
<TaskCard id="POR-17" title="Refatorar conciliação" repo="api" auto prNum={138} />
```

Width is set by the column (`flex:1`); the card itself is width-agnostic.
