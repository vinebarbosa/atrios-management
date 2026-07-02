Square, quiet icon-only button — close (×), copy, add (+), and inline row actions. On hover it fills to `--atr-fill` and brightens.

```jsx
<IconButton onClick={close}><CloseIcon/></IconButton>
<IconButton tinted onClick={copy}><CopyIcon/></IconButton>
```

`tinted` adds a faint resting background (as on the copy-branch button). Default size 26px; icons sit at 11–15px.
