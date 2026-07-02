Rounded status chip with a leading colored dot — the primary way status is shown on headers and card panels. Color carries the meaning.

```jsx
<StatusPill hue="done">Em Produção</StatusPill>
<StatusPill hue="progress">Em Progresso</StatusPill>
<StatusPill hue="review" tinted={false}>Em Revisão</StatusPill>
```

`tinted` (default) draws the washed pill background; set false for the bare dot+label used inside dense card panels. Hues map to the workflow spectrum: todo · progress · review · test · done · archived.
