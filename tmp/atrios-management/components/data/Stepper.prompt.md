Horizontal product-lifecycle bar. Steps before `current` are filled and connected with a green line; the current step glows; future steps are hollow. Started steps show their start date underneath. The connecting track is a fixed 20px tall so the line stays level across differently-sized dots.

```jsx
<Stepper current={4} steps={[
  { name: 'Descoberta', date: '12 fev' },
  { name: 'Definição', date: '03 mar' },
  { name: 'Desenvolvimento', date: '24 mar' },
  { name: 'Testes', date: '19 mai' },
  { name: 'Em Produção', date: '08 jun' },
  { name: 'Descontinuado' },
]} />
```
