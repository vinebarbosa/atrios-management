## Context

O fluxo de convites já existe: `inviteMember`/`resendInvite` em `src/app/time/actions.ts` persistem o convite e chamam `sendInviteEmail`, que por sua vez chama `sendEmail` em `src/lib/email.ts`. Hoje `sendEmail` só faz `console.log`. O template de referência está em `Convite Átrios (standalone).html` — um HTML "standalone" que embrulha o email real dentro de um script `type="__bundler/template"` (uma string JSON escapada). O email real usa placeholders `{{inviterName}}`, `{{roleLabel}}`, `{{inviteUrl}}`, `{{expiresInDays}}`.

Restrições: a stack é Next.js 16 + server actions; não há SDK de email instalado; a API do Resend é acessível por HTTP simples (`POST https://api.resend.com/emails`). O `AGENTS.md` alerta que esta versão do Next tem breaking changes — porém nada aqui usa APIs de framework novas (apenas `fetch`, `fs` e server actions já em uso).

## Goals / Non-Goals

**Goals:**
- Enviar convites por email de verdade via Resend, com corpo HTML da marca Átrios.
- Manter o fallback de console quando o provedor não estiver configurado (dev continua funcionando sem chaves).
- Não quebrar chamadores existentes de `sendEmail` (reset de senha permanece em texto).
- Zero dependências novas.

**Non-Goals:**
- Suportar múltiplos provedores além de Resend + console (a env `INVITE_EMAIL_PROVIDER` deixa a porta aberta, mas só Resend é implementado agora).
- Emails transacionais além de convite/reset.
- Fila de reenvio, retry automático ou tracking de entrega.

## Decisions

**1. Transporte Resend via `fetch`, sem SDK.**
`sendEmail` ganha um campo opcional `html`. Quando `INVITE_EMAIL_PROVIDER=resend` e `RESEND_API_KEY` existem, faz `POST https://api.resend.com/emails` com `{ from: RESEND_FROM_EMAIL, to, subject, html, text }`. Sem isso, mantém o `console.log` atual. Alternativa considerada: pacote `resend`. Rejeitada por trazer dependência para uma única chamada HTTP trivial.

**2. Template como asset em `public/emails/invite.html`, lido em runtime.**
Extraímos a string do `__bundler/template` (fazendo o unescape do JSON) e salvamos o HTML de email puro em `public/emails/invite.html`. Em `sendInviteEmail`, lê-se o arquivo com `fs/promises` a partir de `process.cwd()` e substituem-se os placeholders. Alternativa considerada: importar como string via bundler ou inline no TS. Rejeitada — o pedido explícito é ter o arquivo em `public/`, e ler de disco mantém o template editável sem recompilar. O arquivo em `public/` fica publicamente acessível, mas é apenas markup de template com placeholders — sem segredos.

**3. Substituição simples de placeholders `{{chave}}`.**
Um `replaceAll` por chave (`inviterName`, `roleLabel`, `inviteUrl`, `expiresInDays`). `roleLabel` mapeia `admin→"Administrador"`, `member→"Membro"`. `inviteUrl` é `${BETTER_AUTH_URL}/convite/${token}`. `inviterName` vem da sessão do admin que convida (`session.user.name`); no reenvio, busca-se o nome via `invitedBy` ou usa-se um fallback ("Um administrador"). `expiresInDays` é derivado de `INVITE_TTL_MS` (7).

**4. Falha de envio não derruba o convite.**
O envio é embrulhado em try/catch com log de erro; o convite já foi persistido antes do envio. Mantém a semântica atual (a action não falha por causa do email) e evita convites "perdidos" no banco por erro de rede.

## Risks / Trade-offs

- [Template extraído incorreto do bundler] → Extrair a string do `__bundler/template` e validar visualmente que abre como email HTML íntegro antes de finalizar.
- [Chave Resend exposta] → A chave vive só no `.env` (git-ignored) e nas envs do servidor; o `.env.example` recebe placeholders vazios. O `public/emails/invite.html` não contém segredo.
- [Domínio remetente não verificado no Resend] → `atrios@viniciosbarbosa.com` precisa estar verificado na conta Resend, senão o envio falha; documentado como pré-requisito, e a falha é logada sem quebrar o fluxo.
- [Leitura de arquivo em cada envio] → Custo desprezível (convites são raros); sem cache para manter o template hot-editável.
