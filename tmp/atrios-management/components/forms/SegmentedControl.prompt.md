Compact two/three-way view switcher — the Kanban / Lista toggle on the board. Controlled.

```jsx
<SegmentedControl
  value={view}
  onChange={setView}
  options={[
    { value: 'kanban', label: 'Kanban', icon: <KanbanIcon/> },
    { value: 'list', label: 'Lista', icon: <ListIcon/> },
  ]}
/>
```
