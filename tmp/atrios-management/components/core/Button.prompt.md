Primary action control — use for any button in the Átrios UI; `primary` for the single confident action per view, `dashed` for "add" affordances (Novo card, Adicionar repositório).

```jsx
<Button variant="primary" size="md" onClick={save}>Criar produto</Button>
<Button variant="secondary">Cancelar</Button>
<Button variant="dashed" icon={<PlusIcon/>}>Adicionar repositório</Button>
```

Variants: `primary` (indigo fill, white text), `secondary` (hairline outline), `ghost` (text only), `dashed` (dashed outline). Sizes: `sm` 28px, `md` 30px, `lg` 34px. Pass a 14–16px SVG to `icon`.
