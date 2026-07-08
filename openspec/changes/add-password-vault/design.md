# Design: add-password-vault

## Context

O domínio de produtos já é real (tabelas `product`/`card`, actions com sessão, páginas server-first). O mockup do Cofre (frames 13–16; template decodificado em `scratchpad/cofre_template.html`, dados em `cofre_logic.js`) evoluiu aditivamente os shapes que já existiam no `logic.js` do doc de Produtos: acesso `{name, tipo, ambiente, login, senha, 2FA, notas}`, agrupamentos por ambiente (aba do produto) e por produto (visão global), auditoria e regra admin/member para revelar. Roles já existem no `user.role` (better-auth). Next 16: consultar `node_modules/next/dist/docs/` para rotas aninhadas/layouts antes de implementar.

## Goals / Non-Goals

**Goals:**

- Segredos cifrados em repouso, nunca presentes no payload de renderização; saída em claro só por action auditada.
- UI fiel aos frames 13–16 com o design system existente; mesma pilha (Drizzle, server actions, `revalidatePath`).
- Permissões: revelar = admin; listar/copiar/criar/editar = qualquer membro (o mockup só restringe explicitamente o revelar).

**Non-Goals:**

- Botão dedicado "rotacionar" (rotação = trocar senha na edição, como o mockup sugere ao não desenhá-lo), lembretes de rotação, TOTP dinâmico, versionamento de senhas antigas, exclusão de acesso (não desenhada; pode vir depois).
- Busca server-side (dados pequenos; filtro no client).

## Decisions

### D1 — Criptografia: AES-256-GCM com `node:crypto`, chave em `VAULT_KEY`

`src/lib/vault-crypto.ts`: `encrypt(plain)` → `iv:tag:cipher` base64; `decrypt(blob)`. Chave de 32 bytes (base64) em `VAULT_KEY`; falha explícita no primeiro uso se ausente/inválida (não no boot, para não quebrar quem não usa o cofre). Alternativas rejeitadas: libs (libsodium etc.) — GCM nativo cobre; hash — precisamos recuperar o valor. Trade-off assumido: **copiar envia o valor em claro ao client** (inevitável para pôr no clipboard) — "copiar não revela" é regra de UI, e é por isso que a cópia é auditada.

### D2 — Modelo de dados (2 tabelas)

```
access:       id, product_id FK cascade, name, tipo ('sistema'|'infra'|'banco'|'plataforma'|'email'),
              ambiente ('producao'|'homologacao'|'geral'), login,
              password_enc, totp_codes_enc?, notes?,
              created_by_id FK user set-null, rotated_at, rotated_by_id FK user set-null,
              created_at, updated_at
access_event: id, access_id FK cascade, user_id FK user set-null,
              action ('created'|'viewed'|'copied'|'rotated'), created_at
```

Enums como text + catálogo estático em `src/lib/vault-constants.ts` (labels/cores de tipo e ambiente, limiar de rotação velha = 90 dias), como feito com `STAGES`. "Última rotação" = `rotated_at`/`rotated_by_id` (inicializados na criação). Auditoria exibida = join com `user` (nome), `formatRelative` existente.

### D3 — Actions em `src/app/cofre/actions.ts`

Padrão de `produtos/actions.ts` (sessão obrigatória, `{error?}`, `revalidatePath`):

- `createAccess(input)` / `updateAccess(id, input)` — validação de obrigatórios; senha vazia na edição = mantém a atual; senha nova ⇒ atualiza `rotated_at/by` + evento `rotated`. Criação ⇒ evento `created`.
- `getSecret(accessId, field: 'password'|'totp', intent: 'reveal'|'copy')` — decripta e retorna em claro. `reveal` exige `role === 'admin'` (checado no servidor); `copy` exige sessão. Auditoria: `reveal` de senha ⇒ `viewed`; `copy` de senha ⇒ `copied`; cópia de 2FA ⇒ `copied` também (mesmo rigor). Sem `revalidatePath` (não muda listagem) — o painel de auditoria refaz por `refresh`/reabertura.

### D4 — Rotas e composição da página do produto

- `/produtos/[code]/acessos` como rota irmã do board. **Extrair `ProductHeader`** (breadcrumb + dot/nome/código/pill + abas Cards|Acessos com contagens) para componente server compartilhado pelas duas páginas; o botão/painel "Contexto" permanece exclusivo da aba Cards (no frame 13a o painel não aparece; manter o botão só onde o painel existe evita estado cruzado layout↔página). Alternativa rejeitada: layout aninhado com header — o toggle do Contexto atravessaria a fronteira layout/página.
- `/cofre`: página server que consulta acessos com produto + criador, agrupa por produto; filtro por produto e busca são estado client sobre os dados carregados. Sidebar ganha item "Cofre" (ícone de chave) sob "Produtos".
- Modais client: `AccessModal` (criar/editar — mesmo componente, frame 14) e `AccessDetail` (frame 15; recebe `isAdmin` do server para esconder o olho; a action revalida a permissão de qualquer forma). Linhas de lista abrem o detalhe; botão "Copiar senha" na linha chama `getSecret` direto.

### D5 — Dados mascarados por construção

As queries das páginas selecionam colunas explicitamente e **omitem** `password_enc`/`totp_codes_enc`; o tipo `AccessRow` do client nem possui esses campos. Máscara `••••••••••` é literal de UI. Existência de 2FA vai como boolean (`hasTotp`) para o detalhe renderizar `••••-••••` + copiar.

### D6 — Seed e verificação com papéis

Seed adiciona os ~10 acessos do mockup (Pórtico 8+, Cortina, Ábaco; AWS e Postgres-Ábaco com rotação > 90 dias para exercitar o âmbar) com `VAULT_KEY` de dev no `.env.example`. Verificação exige os dois papéis: promover um usuário de teste a admin via SQL (ou usar o admin existente) e manter `dev@atrios.test` como member para validar 15b e a recusa da action de revelar.

## Risks / Trade-offs

- [Vazamento de segredo por query descuidada] → colunas de segredo só são lidas dentro de `getSecret`; revisar `with/columns` das queries na verificação (grep por `password_enc` fora de `actions.ts`/crypto).
- [Perda da `VAULT_KEY` = segredos irrecuperáveis] → documentar no `.env.example`; aceitável para uso interno.
- [Clipboard API exige contexto seguro] → dev em localhost ok; fallback: mostrar erro "não foi possível copiar".
- [Auditoria de cópia depende do client chamar a action] → a action é o único caminho para obter o valor, então o log é garantido por construção.

## Migration Plan

1. Migration aditiva (2 tabelas) + `VAULT_KEY` no env.
2. Crypto util + actions + seed.
3. UI (header compartilhado → aba → cofre global → modais).
   Rollback: reverter commits; tabelas novas não tocam o existente.

## Open Questions

Nenhuma bloqueante. (Exclusão de acesso e botão de rotacionar ficam para um change futuro se o time pedir.)
